
'use server';

import { z } from 'zod';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { createUserProfile } from './firestore';
import { redirect } from 'next/navigation';
import { collection, doc, setDoc, serverTimestamp, updateDoc, addDoc, deleteDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { uploadToCloudinary } from './cloudinary';
import { revalidatePath } from 'next/cache';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(values: z.infer<typeof registerSchema>) {
  try {
    const validatedValues = registerSchema.parse(values);
    const { email, password } = validatedValues;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await createUserProfile(user.uid, user.email);
    
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      return { error: 'Email ini sudah terdaftar.' };
    }
    return {
      error: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
    };
  }

  redirect('/dashboard');
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});


export async function login(values: z.infer<typeof loginSchema>) {
    try {
        const validatedValues = loginSchema.parse(values);
        const { email, password } = validatedValues;
        
        await signInWithEmailAndPassword(auth, email, password);

    } catch (error: any) {
        if (error.code === 'auth/invalid-credential') {
             return { error: 'Email atau password salah.' };
        }
        return {
            error: 'Terjadi kesalahan saat login. Silakan coba lagi.',
        };
    }
    
    redirect('/dashboard');
}

export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Error signing out:', error);
    }
    redirect('/login');
}


export async function requestUpgrade(formData: FormData) {
    const user = auth.currentUser;
    if (!user) {
        return { error: "Anda harus login untuk melakukan ini." };
    }

    const proof = formData.get('proof') as File;
    if (!proof) {
        return { error: "File bukti transfer tidak ditemukan." };
    }
    
    try {
        // 1. Upload image to Cloudinary
        const fileBuffer = await proof.arrayBuffer();
        const mime = proof.type;
        const encoding = 'base64';
        const base64Data = Buffer.from(fileBuffer).toString('base64');
        const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
        
        const result = await uploadToCloudinary(fileUri, `payment_proofs/${user.uid}`);
        const downloadURL = result.secure_url;

        if (!downloadURL) {
            throw new Error("Gagal mengunggah gambar, URL tidak ditemukan.");
        }
        
        // 2. Create a payment document in Firestore
        const paymentRef = doc(collection(db, 'payments'));
        await setDoc(paymentRef, {
            userId: user.uid,
            userEmail: user.email,
            proofUrl: downloadURL,
            status: 'pending',
            createdAt: serverTimestamp(),
        });
        
        // 3. Update user's payment status
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            paymentStatus: 'pending'
        });

    } catch (error: any) {
        console.error("Upgrade request failed:", error);
        return { error: "Gagal memproses permintaan Anda. Silakan coba lagi." };
    }

    return { success: true };
}

export async function updateUserProfile(formData: FormData) {
    const user = auth.currentUser;
    if (!user) {
        return { error: "Anda harus login untuk melakukan ini." };
    }

    const displayName = formData.get('displayName') as string;
    const password = formData.get('password') as string | null;
    const photo = formData.get('photo') as File | null;
    
    const userRef = doc(db, 'users', user.uid);
    const updates: { [key: string]: any } = {};

    try {
        // Update display name
        if (displayName) {
            updates.displayName = displayName;
        }

        // Update photo
        if (photo) {
            const fileBuffer = await photo.arrayBuffer();
            const mime = photo.type;
            const encoding = 'base64';
            const base64Data = Buffer.from(fileBuffer).toString('base64');
            const fileUri = `data:${mime};${encoding},${base64Data}`;
            
            const result = await uploadToCloudinary(fileUri, `profile_pictures/${user.uid}`);
            const downloadURL = result.secure_url;

            if (downloadURL) {
                updates.photoURL = downloadURL;
            } else {
                 throw new Error("Gagal mengunggah foto profil.");
            }
        }
        
        // Update Firestore
        if (Object.keys(updates).length > 0) {
            await updateDoc(userRef, updates);
        }

        // Update password in Firebase Auth
        if (password) {
            await updatePassword(user, password);
        }

    } catch (error: any) {
        console.error("Profile update failed:", error);
        if (error.code === 'auth/requires-recent-login') {
            return { error: 'Sesi Anda telah berakhir. Silakan logout dan login kembali untuk mengubah kata sandi.' };
        }
        return { error: "Gagal memperbarui profil Anda. Silakan coba lagi." };
    }
    
    revalidatePath('/dashboard/profil');
    return { success: true };
}

const confirmPaymentSchema = z.object({
  paymentId: z.string(),
  userId: z.string(),
});

export async function confirmPayment(values: z.infer<typeof confirmPaymentSchema>) {
    const validatedValues = confirmPaymentSchema.parse(values);
    const { paymentId, userId } = validatedValues;

    // A real app should verify that the current user is an admin.
    // For now, we trust the call comes from the admin dashboard.

    try {
        const userRef = doc(db, 'users', userId);
        const paymentRef = doc(db, 'payments', paymentId);

        // Update user to Pro
        await updateDoc(userRef, {
            plan: 'pro',
            paymentStatus: 'pro',
            upgradedAt: serverTimestamp(),
        });

        // Update payment status to confirmed
        await updateDoc(paymentRef, {
            status: 'confirmed',
            processedAt: serverTimestamp(),
        });

    } catch (error: any) {
        console.error("Payment confirmation failed:", error);
        return { error: "Gagal mengonfirmasi pembayaran. Silakan coba lagi." };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function updatePricingPlan(formData: FormData) {
    const planId = formData.get('id') as string;
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const priceDescription = formData.get('priceDescription') as string;
    const features = formData.getAll('features') as string[];
    const isRecommended = formData.get('isRecommended') === 'on';

    if (!planId) {
        return { error: "Plan ID is missing." };
    }

    try {
        const planRef = doc(db, 'pricingPlans', planId);
        await updateDoc(planRef, {
            name,
            price,
            priceDescription,
            features,
            isRecommended
        });
    } catch(error) {
        console.error("Error updating plan:", error);
        return { error: "Gagal memperbarui paket harga." };
    }

    revalidatePath('/harga');
    revalidatePath('/dashboard');
    return { success: true };
}

const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // remove special characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-'); // remove consecutive hyphens
};

export async function saveBlogPost(formData: FormData) {
    const postId = formData.get('postId') as string | null;
    const title = formData.get('title') as string;
    let slug = formData.get('slug') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const status = formData.get('status') as 'draft' | 'published';
    const image = formData.get('image') as File | null;

    if (!title || !content || !category || !status) {
        return { error: 'Please fill all required fields.' };
    }
    
    // Sanitize the slug, or generate if it's empty
    if (!slug) {
        slug = generateSlug(title);
    } else {
        slug = generateSlug(slug); // Sanitize user-provided slug
    }
    
    let imageUrl = formData.get('currentImageUrl') as string || '';

    try {
        if (image && image.size > 0) {
            const fileBuffer = await image.arrayBuffer();
            const mime = image.type;
            const encoding = 'base64';
            const base64Data = Buffer.from(fileBuffer).toString('base64');
            const fileUri = `data:${mime};${encoding},${base64Data}`;
            const result = await uploadToCloudinary(fileUri, `blog_images/${slug}`);
            imageUrl = result.secure_url;
        }

        const postData = {
            title,
            slug,
            content,
            category,
            status,
            imageUrl,
            description: content.substring(0, 150), // Auto-generate description
            author: "Tim sekripsi.com", // Or get from current user
            aiHint: `${category.toLowerCase()} blog`, // Auto-generate aiHint
            updatedAt: serverTimestamp(),
        };

        if (postId) {
            // Update existing post
            const postRef = doc(db, 'blogPosts', postId);
            await updateDoc(postRef, postData);
        } else {
            // Create new post
            const collectionRef = collection(db, 'blogPosts');
            await addDoc(collectionRef, {
                ...postData,
                createdAt: serverTimestamp(),
            });
        }
    } catch (e: any) {
        console.error(e);
        return { error: 'Failed to save blog post.' };
    }

    revalidatePath('/blog');
    if (status === 'published') {
        revalidatePath(`/blog/${slug}`);
    }
    redirect('/dashboard?tab=blog');
}

export async function deleteBlogPost(postId: string) {
    if (!postId) {
        return { error: "Post ID is required." };
    }
    try {
        const postRef = doc(db, 'blogPosts', postId);
        await deleteDoc(postRef);
    } catch(e) {
        console.error(e);
        return { error: "Failed to delete post." };
    }
    
    revalidatePath('/blog');
    revalidatePath('/dashboard');
}

const activateAiToolSchema = z.object({
  toolId: z.string(),
});

export async function activateAiTool(values: z.infer<typeof activateAiToolSchema>) {
    const user = auth.currentUser;
    if (!user) {
        return { error: 'You must be logged in to activate a tool.' };
    }

    const { toolId } = activateAiToolSchema.parse(values);

    try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        if (userData?.plan !== 'pro') {
            return { error: 'This feature is only for Pro members.' };
        }
        
        await updateDoc(userRef, {
            activatedTools: arrayUnion(toolId),
        });

    } catch (error) {
        console.error("Failed to activate AI tool:", error);
        return { error: 'Could not activate the tool. Please try again.' };
    }

    revalidatePath('/alat-ai');
    return { success: true };
}
