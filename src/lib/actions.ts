
'use server';

import { z } from 'zod';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { createUserProfile } from './firestore';
import { redirect } from 'next/navigation';
import { doc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
        // 1. Upload image to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, `payment_proofs/${user.uid}/${Date.now()}_${proof.name}`);
        const snapshot = await uploadBytes(storageRef, proof);
        const downloadURL = await getDownloadURL(snapshot.ref);

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
