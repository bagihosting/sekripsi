import LoginForm from '@/components/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SekripsiComIcon } from '@/components/icons';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Link href="/">
            <SekripsiComIcon className="h-12 w-12 text-primary" />
          </Link>
        </div>
        <CardTitle>Selamat Datang Kembali!</CardTitle>
        <CardDescription>Masukkan email dan password Anda untuk melanjutkan.</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Daftar di sini
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
