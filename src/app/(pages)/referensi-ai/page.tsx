
import ReferenceFinder from '@/components/reference-finder';
import { Card, CardContent } from '@/components/ui/card';
import { Library } from 'lucide-react';

export default function ReferensiAiPage() {
  return (
    <section id="reference-finder" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <Library className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Cari Referensi Jurnal & Artikel Jadi Mudah</h1>
            <p className="text-lg text-foreground/70">
              Kesulitan mencari sumber untuk skripsimu? Masukkan topik penelitianmu, dan biarkan AI kami menemukan artikel dan jurnal relevan, lengkap dengan ringkasannya untukmu.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <ReferenceFinder />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
