'use server';

import { z } from 'zod';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { createUserProfile } from './firestore';
import { redirect } from 'next/navigation';

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
