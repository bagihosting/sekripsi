
"use client";

import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { login, register, createSession } from '@/lib/actions';
import { signInWithEmailAndPassword, signInWithCustomToken, getIdToken } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

import LoginForm, { type LoginFormValues } from './login-form';
import RegisterForm, { type RegisterFormValues } from './register-form';

interface AuthFormContainerProps {
  mode: 'login' | 'register';
}

export default function AuthFormContainer({ mode }: AuthFormContainerProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = (values: LoginFormValues) => {
    startTransition(async () => {
      // First, sign in with email and password on the client to verify credentials
      try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
      } catch (error: any) {
        if (error.code === 'auth/invalid-credential') {
          toast({ title: 'Login Gagal', description: 'Email atau password salah.', variant: 'destructive' });
        } else {
          toast({ title: 'Login Gagal', description: 'Terjadi kesalahan. Silakan coba lagi.', variant: 'destructive' });
        }
        return;
      }
      
      // If successful, get the ID token
      if (auth.currentUser) {
        const idToken = await getIdToken(auth.currentUser);
        await createSession(idToken); // Create server session
        router.push('/dashboard');
        toast({ title: 'Login Berhasil!', description: 'Selamat datang kembali.' });
      }
    });
  };

  const handleRegister = (values: RegisterFormValues) => {
    startTransition(async () => {
      // Create user via server action
      const result = await register(values);
      if (result?.error) {
        toast({ title: 'Registrasi Gagal', description: result.error, variant: 'destructive' });
        return;
      }

      // If server-side creation is successful, sign in on the client with the custom token
      if (result.customToken) {
        try {
          await signInWithCustomToken(auth, result.customToken);
          if (auth.currentUser) {
              const idToken = await getIdToken(auth.currentUser);
              await createSession(idToken); // Create server session
              router.push('/dashboard');
              toast({ title: 'Registrasi Berhasil!', description: 'Selamat datang di sekripsi.com.' });
          }
        } catch (clientError) {
            console.error("Client sign-in error:", clientError);
            toast({ title: 'Registrasi Gagal', description: 'Gagal saat login setelah registrasi.', variant: 'destructive' });
        }
      }
    });
  };

  if (mode === 'login') {
    return <LoginForm onSubmit={handleLogin} isPending={isPending} />;
  }

  return <RegisterForm onSubmit={handleRegister} isPending={isPending} />;
}
