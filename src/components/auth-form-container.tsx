
"use client";

import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { register, createSession } from '@/lib/actions';
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
      if (!auth) {
        toast({ title: 'Login Gagal', description: 'Layanan autentikasi tidak tersedia.', variant: 'destructive' });
        return;
      }
      try {
        const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
        const idToken = await getIdToken(userCredential.user);
        
        const sessionResult = await createSession(idToken);
        
        if (sessionResult?.error) {
          throw new Error(sessionResult.error);
        }

        toast({ title: 'Login Berhasil!', description: 'Selamat datang kembali.' });
        router.push('/dashboard');
      } catch (error: any) {
        if (error.code === 'auth/invalid-credential') {
          toast({ title: 'Login Gagal', description: 'Email atau password salah.', variant: 'destructive' });
        } else {
          console.error("Login error:", error);
          toast({ title: 'Login Gagal', description: 'Terjadi kesalahan. Silakan coba lagi.', variant: 'destructive' });
        }
      }
    });
  };

  const handleRegister = (values: RegisterFormValues) => {
    startTransition(async () => {
       if (!auth) {
        toast({ title: 'Registrasi Gagal', description: 'Layanan autentikasi tidak tersedia.', variant: 'destructive' });
        return;
      }
      const result = await register(values);
      if (result?.error) {
        toast({ title: 'Registrasi Gagal', description: result.error, variant: 'destructive' });
        return;
      }

      if (result.customToken) {
        try {
          await signInWithCustomToken(auth, result.customToken);
          if (auth.currentUser) {
              const idToken = await getIdToken(auth.currentUser);
              await createSession(idToken);
              toast({ title: 'Registrasi Berhasil!', description: 'Selamat datang di sekripsi.com.' });
              router.push('/dashboard');
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

    