
import AuthFormContainer from '@/components/auth-form-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SekripsiComIcon } from '@/components/icons';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
         <div className="mb-4 flex justify-center">
          <Link href="/">
            <SekripsiComIcon className="h-12 w-12 text-primary" />
          </Link>
        </div>
        <CardTitle>Buat Akun Baru</CardTitle>
        <CardDescription>Mulai perjalanan skripsimu dengan sekripsi.com.</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthFormContainer mode="register" />
         <p className="mt-4 text-center text-sm text-muted-foreground">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Login di sini
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
