
'use client';

import { useEffect, useState } from 'react';
import UpgradeForm from '@/components/upgrade-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Package } from 'lucide-react';
import { getToolById } from '@/lib/plugins';
import type { AiTool } from '@/lib/plugins';
import { Skeleton } from '@/components/ui/skeleton';

export default function UpgradeToolPage({ params }: { params: { toolId: string } }) {
  const [tool, setTool] = useState<AiTool | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTool() {
      const fetchedTool = await getToolById(params.toolId);
      setTool(fetchedTool);
      setLoading(false);
    }
    fetchTool();
  }, [params.toolId]);

  if (loading) {
    return <UpgradePageSkeleton />;
  }

  return (
    <section id="upgrade" className="py-16 lg:py-24">
      <div className="container max-w-screen-md">
        <div className="space-y-8">
          <div className="text-center">
            <Banknote className="h-16 w-16 mx-auto text-accent mb-4" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Selesaikan Pembelian Alat</h1>
            <p className="mt-4 text-lg text-foreground/70">
              Satu langkah lagi untuk mendapatkan akses permanen ke alat canggih pilihanmu.
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Detail Pembelian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{tool?.title || 'Alat AI'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-muted-foreground" />
                    <span className="font-bold text-primary text-lg">Rp {tool?.price?.toLocaleString('id-ID') || '...'}</span>
                </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Langkah 1: Lakukan Pembayaran</CardTitle>
              <CardDescription>
                Silakan transfer sejumlah <span className="font-bold text-primary">Rp {tool?.price?.toLocaleString('id-ID')}</span> ke rekening berikut:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 rounded-md border bg-secondary/50 p-4 text-sm">
                <p><strong>Bank:</strong> Bank Central Asia (BCA)</p>
                <p><strong>Nomor Rekening:</strong> 123 456 7890</p>
                <p><strong>Atas Nama:</strong> PT Sekripsi Jaya Abadi</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Langkah 2: Konfirmasi Pembayaran Anda</CardTitle>
              <CardDescription>
                Unggah bukti transfer Anda di sini. Tim kami akan memverifikasi pembayaran Anda dalam 1x24 jam.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpgradeForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function UpgradePageSkeleton() {
  return (
    <section id="upgrade" className="py-16 lg:py-24">
        <div className="container max-w-screen-md">
            <div className="space-y-8">
                <div className="text-center space-y-4">
                    <Skeleton className="h-16 w-16 mx-auto rounded-full" />
                    <Skeleton className="h-10 w-3/4 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                </div>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    </section>
  )
}
