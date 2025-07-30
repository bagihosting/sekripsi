
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

interface UserDashboardProps {
  userProfile: UserProfile;
}

export default function UserDashboard({ userProfile }: UserDashboardProps) {
  return (
    <div className="container max-w-screen-xl py-12 lg:py-16">
      <div className="space-y-4">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">Selamat Datang, {userProfile.displayName || 'Pejuang Skripsi'}!</h1>
        <p className="text-lg text-foreground/70">
          Ini adalah pusat kendalimu. Semua alat dan progresmu ada di sini. Mari kita lanjutkan perjuangan!
        </p>
      </div>

      <div className="mt-12 grid gap-8">
        <Card className="bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <Sparkles className="h-6 w-6 text-primary" />
                    Akses Senjata AI-mu
                </CardTitle>
                <CardDescription>
                    Manfaatkan semua alat AI yang tersedia untuk mempercepat kelulusanmu.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/alat-ai">
                        Lihat Semua Alat AI <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
