
import UpgradeForm from '@/components/upgrade-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote } from 'lucide-react';

export default function UpgradePage() {
  return (
    <section id="upgrade" className="py-16 lg:py-24">
      <div className="container max-w-screen-md">
        <div className="space-y-8">
            <div className="text-center">
                <Banknote className="h-16 w-16 mx-auto text-accent mb-4" />
                <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Selesaikan Upgrade ke Pro</h1>
                <p className="mt-4 text-lg text-foreground/70">
                    Satu langkah lagi untuk mendapatkan akses tak terbatas ke semua fitur canggih kami.
                </p>
            </div>
          
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Langkah 1: Lakukan Pembayaran</CardTitle>
                    <CardDescription>
                        Silakan transfer sejumlah <span className="font-bold text-primary">Rp 79.000</span> ke rekening berikut:
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
