
import DraftGenerator from '@/components/draft-generator';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function GeneratorDrafPage() {
  return (
    <section id="draft-generator" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <FileText className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Draf Skripsi Lengkap (Bab 1-5) dalam Sekejap</h1>
            <p className="text-lg text-foreground/70">
              Ini bukan sihir, ini AI. Masukkan topik penelitianmu, dan saksikan AI jenius kami menyusun draf 5 bab yang solid, terstruktur, dan siap kamu kembangkan menjadi skripsi utuh.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <DraftGenerator />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
