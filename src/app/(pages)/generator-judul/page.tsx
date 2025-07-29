
import TitleGenerator from '@/components/title-generator';
import { Card, CardContent } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';

export default function GeneratorJudulPage() {
  return (
    <section id="title-generator" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <Wand2 className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Stuck di Halaman Judul? AI Kami Siap Beri Ilham!</h1>
            <p className="text-lg text-foreground/70">
              Inspirasi judul skripsi hanya sejauh satu klik. Masukkan bidang studimu, biarkan AI kami yang canggih menyajikan beberapa opsi judul kreatif dan berbobot yang bisa jadi awal kesuksesanmu.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <TitleGenerator />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
