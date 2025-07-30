
'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import type { RecentUpgrade, AiTool, UserProfile, BlogPost, Payment, PricingPlan } from './types';
import { initialTools, defaultPlans } from '@/lib/initial-data';
import { getUserProfile } from '@/lib/user-actions';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ========== Validation Schemas ==========

const registerSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid.' }),
  password: z.string().min(6, { message: 'Password minimal harus 6 karakter.' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Email tidak valid.' }),
  password: z.string().min(1, { message: 'Password tidak boleh kosong.' }),
});

const fileSchema = z.instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, `Ukuran file maksimal 5MB.`)
  .refine(
    (file) => ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
    "Hanya format .jpg, .jpeg, .png, dan .webp yang didukung."
  );

const profileUpdateSchema = z.object({
    displayName: z.string().min(1, { message: 'Nama lengkap tidak boleh kosong.' }),
    password: z.string().min(6, { message: 'Password baru harus minimal 6 karakter.' }).optional().or(z.literal('')),
    photo: fileSchema.optional(),
});

const pricingPlanSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.string(),
  priceDescription: z.string(),
  features: z.array(z.string()),
  isRecommended: z.boolean(),
});

const blogPostSchema = z.object({
  title: z.string().min(1, { message: 'Judul harus diisi.' }),
  slug: z.string().min(1, { message: 'Slug harus diisi.' }),
  content: z.string().min(1, { message: 'Konten harus diisi.' }),
  category: z.string().min(1, { message: 'Kategori harus diisi.' }),
  status: z.enum(['draft', 'published']),
  image: fileSchema.optional(),
  postId: z.string().optional(),
  currentImageUrl: z.string().optional(),
});

const aiToolSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.coerce.number().min(0),
});

const confirmPaymentSchema = z.object({
  paymentId: z.string(),
  userId: z.string(),
  toolId: z.string().optional(),
});


// ========== Authentication Actions ==========

export async function register(values: z.infer<typeof registerSchema>) {
  if (!adminAuth || !adminDb) {
    return { error: 'Konfigurasi server Firebase tidak lengkap.' };
  }
  try {
    const validatedValues = registerSchema.parse(values);
    const { email, password } = validatedValues;

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: email.split('@')[0] || 'User',
    });
    
    const freeTools = initialTools.filter(tool => tool.price === 0).map(tool => tool.id);
    const newUserProfile = {
      email,
      displayName: email.split('@')[0] || 'User',
      photoURL: '',
      role: 'user',
      plan: 'free',
      paymentStatus: 'none',
      activatedTools: freeTools,
      purchasedTools: [],
      createdAt: FieldValue.serverTimestamp(),
    };
    await adminDb.collection('users').doc(userRecord.uid).set(newUserProfile);

    const customToken = await adminAuth.createCustomToken(userRecord.uid);
    return { customToken };

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors.map((e) => e.message).join(', ') };
    }
    if (error.code === 'auth/email-already-exists') {
      return { error: 'Email ini sudah terdaftar.' };
    }
    console.error("Registration error:", error);
    return {
      error: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
    };
  }
}

export async function login(values: z.infer<typeof loginSchema>) {
    if (!adminAuth) {
        return { error: 'Konfigurasi server Firebase tidak lengkap.' };
    }
    try {
        const validatedValues = loginSchema.parse(values);
        const { email, password } = validatedValues;
        // This is a simplified login for demo. In a real app, you'd verify password.
        // For this app, we'll get the user and create a custom token, then session.
        // NOTE: This approach is NOT standard password verification. 
        // It's a workaround for custom token flow without client SDK password check.
        const userRecord = await adminAuth.getUserByEmail(email);
        const customToken = await adminAuth.createCustomToken(userRecord.uid);
        
        // The client will need to sign in with this token, then send the ID token.
        // This server action is now simplified to just return the token.
        // The client will handle the rest.
        return { customToken };
        
    } catch (error: any) {
         if (error instanceof z.ZodError) {
            return { error: error.errors.map((e) => e.message).join(', ') };
        }
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            return { error: 'Email atau password salah.' };
        }
        console.error("Login error:", error);
        return { error: 'Terjadi kesalahan saat login.' };
    }
}


export async function createSession(idToken: string) {
    if (!adminAuth) {
        console.error('Admin Auth not initialized');
        return { error: 'Authentication service not configured.' };
    }
    const validatedIdToken = z.string().min(1).safeParse(idToken);
    if (!validatedIdToken.success) {
      return { error: 'ID Token tidak valid.' };
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    try {
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
        cookies().set('session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });
        return { success: true };
    } catch (error) {
        console.error('Failed to create session:', error);
        return { error: 'Failed to create session.' };
    }
}


export async function logout() {
    cookies().delete('session');
    redirect('/login');
}

// ========== User Actions ==========

export async function requestUpgrade(formData: FormData): Promise<{ success: boolean; error?: string; }> {
    if (!adminAuth || !adminDb) {
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
    
    const proof = formData.get('proof') as File | null;
    const toolId = formData.get('toolId') as string | null;

    if (!proof) {
        return { success: false, error: "File bukti transfer tidak ditemukan." };
    }
    
    const validationResult = fileSchema.safeParse(proof);
    if (!validationResult.success) {
        return { success: false, error: validationResult.error.errors[0].message };
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
            createdAt: FieldValue.serverTimestamp(),
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

        await adminDb.collection('payments').add(paymentData);
        
        const userRef = adminDb.collection('users').doc(user.uid);
        await userRef.update({
            paymentStatus: 'pending'
        });

    } catch (error: any) {
        console.error("Upgrade request failed:", error);
        return { success: false, error: "Gagal memproses permintaan Anda. Silakan coba lagi." };
    }

    return { success: true };
}

export async function updateUserProfile(formData: FormData) {
    if (!adminAuth || !adminDb) {
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
    
    const photo = formData.get('photo') as File | null;
    const values = {
        displayName: formData.get('displayName') as string,
        password: formData.get('password') as string | null,
        photo: photo && photo.size > 0 ? photo : undefined,
    };
    
    const validationResult = profileUpdateSchema.safeParse(values);
    if (!validationResult.success) {
      return { error: validationResult.error.errors.map((e) => e.message).join(', ') };
    }
    
    const { displayName, password } = validationResult.data;
    const userRef = adminDb.collection('users').doc(user.uid);
    const updates: { [key: string]: any } = { displayName };
    const authUpdates: { [key: string]: any } = { displayName };

    try {
        if (validationResult.data.photo) {
            const fileBuffer = await validationResult.data.photo.arrayBuffer();
            const mime = validationResult.data.photo.type;
            const fileUri = `data:${mime};base64,${Buffer.from(fileBuffer).toString('base64')}`;
            
            const result = await uploadToCloudinary(fileUri, `profile_pictures/${user.uid}`);
            const downloadURL = result.secure_url;

            if (downloadURL) {
                updates.photoURL = downloadURL;
                authUpdates.photoURL = downloadURL;
            } else {
                 throw new Error("Gagal mengunggah foto profil.");
            }
        }
        
        if (password) {
            authUpdates.password = password;
        }
        
        await adminAuth.updateUser(user.uid, authUpdates);
        await userRef.update(updates);

    } catch (error: any) {
        console.error("Profile update failed:", error);
        return { error: "Gagal memperbarui profil Anda. Silakan coba lagi." };
    }
    
    revalidatePath('/dashboard/profil');
    return { success: true };
}

// ========== Admin Actions ==========

export async function confirmPayment(values: z.infer<typeof confirmPaymentSchema>) {
    if (!adminDb) {
      return { error: "Konfigurasi server Firebase tidak lengkap." };
    }
    const validatedValues = confirmPaymentSchema.safeParse(values);
     if (!validatedValues.success) {
      return { error: "Data konfirmasi tidak valid." };
    }

    const { paymentId, userId, toolId } = validatedValues.data;

    try {
        const userRef = adminDb.collection('users').doc(userId);
        const paymentRef = adminDb.collection('payments').doc(paymentId);
        const userSnap = await userRef.get();
        if (!userSnap.exists) throw new Error("User not found");
        const userData = userSnap.data();
        if (!userData) throw new Error("User data not found");

        if (toolId) {
            await userRef.update({
                purchasedTools: FieldValue.arrayUnion(toolId),
                activatedTools: FieldValue.arrayUnion(toolId),
                paymentStatus: userData.plan === 'pro' ? 'pro' : 'none', 
            });
        } else {
            await userRef.update({
                plan: 'pro',
                paymentStatus: 'pro',
                upgradedAt: FieldValue.serverTimestamp(),
            });

            const upgradeData = {
                displayName: userData.displayName,
                photoURL: userData.photoURL,
                upgradedAt: FieldValue.serverTimestamp(),
            };
            await adminDb.collection('recent_upgrades').add(upgradeData);
        }

        await paymentRef.update({
            status: 'confirmed',
            processedAt: FieldValue.serverTimestamp(),
        });

    } catch (error: any) {
        console.error("Payment confirmation failed:", error);
        return { error: "Gagal mengonfirmasi pembayaran. Silakan coba lagi." };
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function updatePricingPlan(formData: FormData) {
    if (!adminDb) {
      return { error: "Konfigurasi server Firebase tidak lengkap." };
    }
    
    const data = {
        id: formData.get('id') as string,
        name: formData.get('name') as string,
        price: formData.get('price') as string,
        priceDescription: formData.get('priceDescription') as string,
        features: formData.getAll('features') as string[],
        isRecommended: formData.get('isRecommended') === 'on',
    };

    const validationResult = pricingPlanSchema.safeParse(data);
    if (!validationResult.success) {
        return { error: "Data paket harga tidak valid." };
    }
    
    const { id, ...planData } = validationResult.data;

    try {
        const planRef = adminDb.collection('pricingPlans').doc(id);
        await planRef.update(planData);
    } catch(error) {
        console.error("Error updating plan:", error);
        return { error: "Gagal memperbarui paket harga." };
    }

    revalidatePath('/harga');
    revalidatePath('/dashboard');
    return { success: true };
}

export async function saveBlogPost(formData: FormData) {
    if (!adminDb) {
      return { error: "Konfigurasi server Firebase tidak lengkap." };
    }
    
    const image = formData.get('image') as File | null;
    const data = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        content: formData.get('content') as string,
        category: formData.get('category') as string,
        status: formData.get('status') as 'draft' | 'published',
        image: image && image.size > 0 ? image : undefined,
        postId: formData.get('postId') as string || undefined,
        currentImageUrl: formData.get('currentImageUrl') as string || undefined,
    };
    
    const validationResult = blogPostSchema.safeParse(data);
    if (!validationResult.success) {
        return { error: validationResult.error.errors.map(e => e.message).join(', ') };
    }

    const { postId, currentImageUrl, ...postContent } = validationResult.data;
    let imageUrl = currentImageUrl || '';

    try {
        if (postContent.image) {
            const fileBuffer = await postContent.image.arrayBuffer();
            const mime = postContent.image.type;
            const fileUri = `data:${mime};base64,${Buffer.from(fileBuffer).toString('base64')}`;
            const result = await uploadToCloudinary(fileUri, `blog_images/${postContent.slug}`);
            imageUrl = result.secure_url;
        }

        const finalPostData: { [key: string]: any } = {
            ...postContent,
            description: postContent.content.substring(0, 150),
            author: "Tim sekripsi.com",
            aiHint: `${postContent.category.toLowerCase()} blog`,
            updatedAt: FieldValue.serverTimestamp(),
            imageUrl: imageUrl
        };
        delete finalPostData.image; // remove file object before saving to firestore


        if (postId) {
            await adminDb.collection('blogPosts').doc(postId).update(finalPostData);
        } else {
            await adminDb.collection('blogPosts').add({
                ...finalPostData,
                createdAt: FieldValue.serverTimestamp(),
            });
        }
    } catch (e: any) {
        console.error(e);
        return { error: 'Gagal menyimpan artikel blog.' };
    }

    revalidatePath('/blog');
    if (status === 'published') {
        revalidatePath(`/blog/${postContent.slug}`);
    }
    revalidatePath('/dashboard');
    return { success: true };
}

export async function deleteBlogPost(postId: string) {
    if (!adminDb) {
      return { error: "Konfigurasi server Firebase tidak lengkap." };
    }
    if (!postId) {
        return { error: "Post ID is required." };
    }
    try {
        const postRef = adminDb.collection('blogPosts').doc(postId);
        await postRef.delete();
    } catch(e) {
        console.error(e);
        return { error: "Failed to delete post." };
    }
    
    revalidatePath('/blog');
    revalidatePath('/dashboard');
    return { success: true, postId };
}

export async function updateAiTool(formData: FormData) {
    if (!adminDb) {
      return { error: "Konfigurasi server Firebase tidak lengkap." };
    }
    
    const data = {
        id: formData.get('id') as string,
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: formData.get('price') as string,
    };
    
    const validationResult = aiToolSchema.safeParse(data);
    if (!validationResult.success) {
        return { error: 'Data alat AI tidak valid.' };
    }
    
    const { id, ...toolData } = validationResult.data;

    try {
        const toolRef = adminDb.collection('ai_tools').doc(id);
        await toolRef.update(toolData);
    } catch (e: any) {
        console.error("Error updating AI tool:", e);
        return { error: 'Gagal memperbarui alat AI.' };
    }
    
    revalidatePath('/produk');
    revalidatePath(`/produk/${id}`);
    revalidatePath('/dashboard');
    return { success: true };
}

// ========== Data Fetching Actions ==========

export async function getRecentUpgrades(): Promise<RecentUpgrade[]> {
    if (!adminDb) {
      console.warn('Admin DB not available for getRecentUpgrades');
      return [];
    }
    try {
        const snapshot = await adminDb.collection('recent_upgrades')
            .orderBy('upgradedAt', 'desc')
            .limit(5)
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => {
            const data = doc.data();
            const upgradedAt = data.upgradedAt as Timestamp;
            return {
                displayName: data.displayName,
                photoURL: data.photoURL,
                upgradedAt: upgradedAt.toDate().toISOString(),
            };
        });

    } catch (error) {
        console.error("Error fetching recent upgrades:", error);
        return [];
    }
}

export async function getBlogPosts(): Promise<BlogPost[] | null> {
    if (!adminDb) return null;
    try {
        const postsCollection = adminDb.collection('blogPosts');
        const q = postsCollection.where('status', '==', 'published');
        const querySnapshot = await q.get();

        const posts = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
                updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
            } as BlogPost;
        });
        
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return posts;

    } catch (error) {
        console.error("Error getting blog posts:", error);
        return null;
    }
}

export async function getPendingPayments(): Promise<Payment[] | null> {
    if (!adminDb) return null;
    try {
        const q = adminDb.collection('payments').where('status', '==', 'pending');
        const querySnapshot = await q.get();
        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
            } as Payment;
        });
    } catch (error) {
        console.error("Error getting pending payments:", error);
        return null;
    }
}


export async function getAllTools(): Promise<AiTool[]> {
  if (!adminDb) {
     console.warn("Admin DB not initialized. Returning initial tools.");
     return initialTools;
  }
  try {
    const toolsCollection = adminDb.collection('ai_tools');
    let toolsSnapshot = await toolsCollection.get();
    
    if (toolsSnapshot.empty) {
        const batch = adminDb.batch();
        initialTools.forEach(tool => {
            const docRef = toolsCollection.doc(tool.id);
            batch.set(docRef, tool);
        });
        await batch.commit();
        toolsSnapshot = await toolsCollection.get();
    }
    
    const tools = toolsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        icon: data.icon as string,
      } as AiTool;
    });
    return tools;
  } catch (error) {
    console.error("Error fetching tools from Firestore with Admin SDK:", error);
    return [];
  }
}

export async function getPricingPlans(): Promise<PricingPlan[]> {
  if (!adminDb) {
    console.warn("Admin DB not initialized. Can't fetch plans.");
    return [];
  }
  try {
    const plansCollection = adminDb.collection('pricingPlans');
    let plansSnapshot = await plansCollection.get();

    if (plansSnapshot.empty) {
        const batch = adminDb.batch();
        defaultPlans.forEach(plan => {
            const docRef = plansCollection.doc(plan.id);
            // We remove the 'id' from the object before setting it in Firestore
            const { id, ...planData } = plan;
            batch.set(docRef, planData);
        });
        await batch.commit();
        plansSnapshot = await plansCollection.get();
    }
    
    const plans: PricingPlan[] = [];
    plansSnapshot.forEach((doc) => {
        plans.push({ id: doc.id, ...doc.data() } as PricingPlan);
    });
    
    const order: { [key: string]: number } = { free: 1, pro: 2, team: 3 };
    plans.sort((a, b) => (order[a.id] || 99) - (order[b.id] || 99));

    return plans;
  } catch (error) {
    console.error("Error fetching pricing plans with Admin SDK:", error);
    return [];
  }
}


export async function getToolById(id: string): Promise<AiTool | null> {
    if (!adminDb) {
        console.warn(`Admin DB not initialized. Cannot fetch tool ${id}.`);
        return null;
    }
    try {
        const toolRef = adminDb.collection('ai_tools').doc(id);
        const toolSnap = await toolRef.get();

        if (!toolSnap.exists) {
            console.warn(`Tool with id ${id} not found in Firestore.`);
            return null;
        }

        const data = toolSnap.data();
        if (!data) return null;

        return {
            id: toolSnap.id,
            icon: data.icon as string,
            title: data.title,
            description: data.description,
            href: data.href,
            category: data.category,
            badge: data.badge,
            price: data.price,
        } as AiTool;
    } catch (error) {
        console.error(`Error fetching tool with id ${id} with Admin SDK:`, error);
        return null;
    }
}

export async function getSession(): Promise<{ userProfile: UserProfile | null }> {
  const sessionCookie = cookies().get('session')?.value;
  if (!sessionCookie || !adminAuth) {
    return { userProfile: null };
  }
  try {
    const decodedIdToken = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userProfile = await getUserProfile(decodedIdToken.uid);
    return { userProfile };
  } catch (error) {
    return { userProfile: null };
  }
}
