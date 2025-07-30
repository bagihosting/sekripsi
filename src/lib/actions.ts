
'use server';

import { z } from 'zod';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
import { auth as clientAuth, db } from '@/lib/firebase';
import { createUserProfile } from './firestore';
import { redirect } from 'next/navigation';
import { collection, doc, setDoc, serverTimestamp, updateDoc, addDoc, deleteDoc, getDoc, arrayUnion } from 'firebase/firestore';
import { uploadToCloudinary } from './cloudinary';
import { revalidatePath } from 'next/cache';
import { getToolById } from './plugins';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function register(values: z.infer<typeof registerSchema>) {
  if (!adminAuth) {
    return { error: 'Konfigurasi server Firebase tidak lengkap.' };
  }
  try {
    const validatedValues = registerSchema.parse(values);
    const { email, password } = validatedValues;

    const userCredential = await createUserWithEmailAndPassword(clientAuth, email, password);
    const user = userCredential.user;

    await createUserProfile(user.uid, user.email);

    const idToken = await user.getIdToken();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    cookies().set('session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
    
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
    if (!adminAuth) {
      return { error: 'Konfigurasi server Firebase tidak lengkap.' };
    }
    try {
        const validatedValues = loginSchema.parse(values);
        const { email, password } = validatedValues;
        
        const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);
        const idToken = await userCredential.user.getIdToken();
        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
        cookies().set('session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });

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
        await signOut(clientAuth);
        cookies().delete('session');
    } catch (error) {
        console.error('Error signing out:', error);
    }
    redirect('/login');
}


export async function requestUpgrade(formData: FormData): Promise<{ success: boolean; error?: string; }> {
    if (!adminAuth) {
      return { success: false, error: "Konfigurasi server Firebase tidak lengkap." };
    }
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return { success: false, error: "Anda harus login untuk melakukan ini." };
    
    let decodedToken;
    try {
        decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
        return { success: false, error: "Sesi tidak valid. Silakan login kembali." };
    }
    
    const user = { uid: decodedToken.uid, email: decodedToken.email };
    
    const proof = formData.get('proof') as File;
    const toolId = formData.get('toolId') as string | null;

    if (!proof) {
        return { success: false, error: "File bukti transfer tidak ditemukan." };
    }
    
    try {
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
        
        const paymentData: { [key: string]: any } = {
            userId: user.uid,
            userEmail: user.email,
            proofUrl: downloadURL,
            status: 'pending',
            createdAt: serverTimestamp(),
            type: toolId ? 'tool_purchase' : 'subscription',
        };

        if (toolId) {
            const tool = await getToolById(toolId);
            paymentData.toolId = toolId;
            paymentData.toolName = tool?.title;
            paymentData.amount = tool?.price;
        } else {
            // Logic for subscription pricing if needed
            paymentData.amount = 79000;
        }

        const paymentRef = doc(collection(db, 'payments'));
        await setDoc(paymentRef, paymentData);
        
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
            paymentStatus: 'pending'
        });

    } catch (error: any) {
        console.error("Upgrade request failed:", error);
        return { success: false, error: "Gagal memproses permintaan Anda. Silakan coba lagi." };
    }

    return { success: true };
}

export async function updateUserProfile(formData: FormData) {
    if (!adminAuth) {
      return { error: "Konfigurasi server Firebase tidak lengkap." };
    }
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) return { error: "Anda harus login untuk melakukan ini." };
    
    let decodedToken;
    try {
        decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
        return { error: "Sesi tidak valid. Silakan login kembali." };
    }

    const user = { uid: decodedToken.uid, email: decodedToken.email };
    
    const displayName = formData.get('displayName') as string;
    const password = formData.get('password') as string | null;
    const photo = formData.get('photo') as File | null;
    
    const userRef = doc(db, 'users', user.uid);
    const updates: { [key: string]: any } = {};

    try {
        if (displayName) {
            updates.displayName = displayName;
        }

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
        
        if (Object.keys(updates).length > 0) {
            await updateDoc(userRef, updates);
        }

        if (password) {
            if (clientAuth.currentUser) {
              await updatePassword(clientAuth.currentUser, password);
            } else {
              return { error: 'Sesi Anda telah berakhir. Silakan logout dan login kembali untuk mengubah kata sandi.' };
            }
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
  toolId: z.string().optional(),
});

export async function confirmPayment(values: z.infer<typeof confirmPaymentSchema>) {
    const validatedValues = confirmPaymentSchema.parse(values);
    const { paymentId, userId, toolId } = validatedValues;

    try {
        const userRef = doc(db, 'users', userId);
        const paymentRef = doc(db, 'payments', paymentId);

        if (toolId) {
             // It's a tool purchase
            await updateDoc(userRef, {
                purchasedTools: arrayUnion(toolId),
                activatedTools: arrayUnion(toolId),
                paymentStatus: 'pro', // or some other logic
            });
        } else {
            // It's a subscription upgrade
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) throw new Error("User not found");
            const userData = userSnap.data();

            await updateDoc(userRef, {
                plan: 'pro',
                paymentStatus: 'pro',
                upgradedAt: serverTimestamp(),
            });

            // Add to the public recent_upgrades collection for the toast notification
            const upgradeRef = doc(collection(db, 'recent_upgrades'));
            await setDoc(upgradeRef, {
                displayName: userData.displayName,
                photoURL: userData.photoURL,
                upgradedAt: serverTimestamp(),
            });
        }

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
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
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
    
    if (!slug) {
        slug = generateSlug(title);
    } else {
        slug = generateSlug(slug);
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
            description: content.substring(0, 150),
            author: "Tim sekripsi.com",
            aiHint: `${category.toLowerCase()} blog`,
            updatedAt: serverTimestamp(),
        };

        if (postId) {
            const postRef = doc(db, 'blogPosts', postId);
            await updateDoc(postRef, postData);
        } else {
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
    revalidatePath('/dashboard');
    return { success: true };
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

export async function updateAiTool(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;

    if (!id) return { error: 'Tool ID is required' };

    try {
        const toolRef = doc(db, 'ai_tools', id);
        await updateDoc(toolRef, {
            title,
            description,
            price: Number(price) || 0,
        });
    } catch (e: any) {
        console.error("Error updating AI tool:", e);
        return { error: 'Failed to update AI tool.' };
    }
    
    revalidatePath('/produk');
    revalidatePath(`/produk/${id}`);
    revalidatePath('/dashboard');
    return { success: true };
}
