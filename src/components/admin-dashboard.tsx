
import type { UserProfile } from '@/lib/firestore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Users, BarChart, Settings } from 'lucide-react';

interface AdminDashboardProps {
  userProfile: UserProfile;
}

export default function AdminDashboard({ userProfile }: AdminDashboardProps) {
  return (
    <div className="container max-w-screen-xl py-12 lg:py-16">
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">Dasbor Admin</h1>
        <p className="text-lg text-foreground/70">
          Selamat datang, {userProfile.email}. Kelola pengguna dan lihat statistik dari sini.
        </p>
      </div>

       <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+50 pengguna baru bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penggunaan Alat AI</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,678</div>
            <p className="text-xs text-muted-foreground">Total penggunaan bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pengaturan</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground pt-4">Kelola konfigurasi aplikasi dan fitur dari sini.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
