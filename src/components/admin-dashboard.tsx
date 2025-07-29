
import type { UserProfile } from '@/lib/firestore';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Users, BarChart, Settings, LayoutGrid, Wand2, UserCog, Banknote, Tag, Rss, Store } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeatureManagementCard from './feature-management-card';
import PaymentConfirmation from './payment-confirmation';
import PricingManagement from './pricing-management';
import BlogManagement from './blog-management';
import ProductManagement from './product-management';

interface AdminDashboardProps {
  userProfile: UserProfile;
}

const pagesToManage = [
    { id: 'harga', title: 'Halaman Harga', description: 'Atur paket dan harga langganan.' },
    { id: 'dukungan', title: 'Halaman Dukungan', description: 'Kelola formulir kontak dan info bantuan.' },
];

const toolsToManage = [
    { id: 'generator-judul', title: 'Generator Judul', description: 'Aktifkan/nonaktifkan alat pembuat judul.' },
    { id: 'pertanyaan-penelitian', title: 'Pertanyaan Penelitian', description: 'Kelola alat pembuat pertanyaan penelitian.' },
    { id: 'parafrase-ai', title: 'Alat Parafrase', description: 'Atur ketersediaan alat parafrase.' },
    { id: 'simulasi-sidang', title: 'Simulasi Sidang', description: 'Kelola fitur simulasi sidang skripsi.' },
];


export default function AdminDashboard({ userProfile }: AdminDashboardProps) {
  return (
    <div className="container max-w-screen-xl py-12 lg:py-16">
      <div className="space-y-2 mb-12">
        <h1 className="font-headline text-3xl font-bold md:text-4xl">Dasbor Admin</h1>
        <p className="text-lg text-foreground/70">
          Selamat datang, {userProfile.email}. Kelola pengguna, halaman, dan fitur dari sini.
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-8 mb-8">
          <TabsTrigger value="overview">
            <BarChart className="mr-2 h-4 w-4" /> Ringkasan
          </TabsTrigger>
           <TabsTrigger value="blog">
            <Rss className="mr-2 h-4 w-4" /> Manajemen Blog
          </TabsTrigger>
          <TabsTrigger value="products">
            <Store className="mr-2 h-4 w-4" /> Manajemen Produk
          </TabsTrigger>
          <TabsTrigger value="payments">
            <Banknote className="mr-2 h-4 w-4" /> Konfirmasi Pembayaran
          </TabsTrigger>
           <TabsTrigger value="pricing">
            <Tag className="mr-2 h-4 w-4" /> Manajemen Harga
          </TabsTrigger>
          <TabsTrigger value="users">
            <UserCog className="mr-2 h-4 w-4" /> Manajemen Pengguna
          </TabsTrigger>
          <TabsTrigger value="pages">
            <LayoutGrid className="mr-2 h-4 w-4" /> Manajemen Halaman
          </TabsTrigger>
          <TabsTrigger value="tools">
            <Wand2 className="mr-2 h-4 w-4" /> Manajemen Alat AI
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    <CardTitle className="text-sm font-medium">Pengaturan Umum</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground pt-4">Kelola konfigurasi aplikasi dan fitur dari sini.</p>
                </CardContent>
                </Card>
            </div>
        </TabsContent>
        
        <TabsContent value="blog">
            <BlogManagement />
        </TabsContent>

        <TabsContent value="products">
            <ProductManagement />
        </TabsContent>

        <TabsContent value="payments">
            <PaymentConfirmation />
        </TabsContent>

         <TabsContent value="pricing">
            <PricingManagement />
        </TabsContent>

        <TabsContent value="users">
             <Card>
                <CardHeader>
                    <CardTitle>Manajemen Pengguna</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Fitur untuk melihat, mengedit, dan menghapus pengguna akan tersedia di sini.</p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="pages">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pagesToManage.map(page => (
                    <FeatureManagementCard key={page.id} {...page} />
                ))}
            </div>
        </TabsContent>

        <TabsContent value="tools">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {toolsToManage.map(tool => (
                    <FeatureManagementCard key={tool.id} {...tool} />
                ))}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
