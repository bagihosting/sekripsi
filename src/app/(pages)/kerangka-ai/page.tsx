
import OutlineGenerator from '@/components/outline-generator';
import { Card, CardContent } from '@/components/ui/card';
import { BookMarked } from 'lucide-react';

export default function KerangkaAiPage() {
  return (
    <section id="outline-generator" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <BookMarked className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Dari Judul Jadi Bab? AI Susun Kerangkanya!</h1>
            <p className="text-lg text-foreground/70">
              Menyusun kerangka skripsi yang sistematis kini bukan lagi masalah. Masukkan judul atau topik Anda, dan biarkan AI kami menyusun struktur bab yang logis dan lengkap, dari pendahuluan hingga penutup.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <OutlineGenerator />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
