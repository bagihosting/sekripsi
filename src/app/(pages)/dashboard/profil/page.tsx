
'use client';

import ProfileForm from '@/components/profile-form';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCog } from 'lucide-react';

export default function ProfilePage() {
  const { userProfile, loading } = useAuth();

  if (loading) {
    return <ProfilePageSkeleton />;
  }

  if (!userProfile) {
    return (
      <div className="container max-w-screen-md py-12 lg:py-16">
        <p>Profil tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <section id="profile" className="py-16 lg:py-24">
      <div className="container max-w-screen-md">
        <div className="text-center mb-12">
            <UserCog className="h-16 w-16 mx-auto text-accent mb-4" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Profil Saya</h1>
            <p className="mt-4 text-lg text-foreground/70">
                Kelola informasi akun Anda di sini untuk menjaga data tetap aman dan terbaru.
            </p>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Detail Akun</CardTitle>
            <CardDescription>Perbarui nama, kata sandi, dan foto profil Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm userProfile={userProfile} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ProfilePageSkeleton() {
    return (
        <section id="profile" className="py-16 lg:py-24">
            <div className="container max-w-screen-md">
                 <div className="text-center mb-12">
                    <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-10 w-1/2 mx-auto" />
                    <Skeleton className="h-6 w-3/4 mx-auto mt-4" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                             <Skeleton className="h-4 w-1/4" />
                             <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                             <Skeleton className="h-4 w-1/4" />
                             <Skeleton className="h-10 w-full" />
                        </div>
                         <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
