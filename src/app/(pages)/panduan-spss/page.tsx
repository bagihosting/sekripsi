
import SpssGuide from '@/components/spss-guide';
import { Card, CardContent } from '@/components/ui/card';
import { Database } from 'lucide-react';

export default function PanduanSpssPage() {
  return (
    <section id="spss-guide" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <Database className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Olah Data SPSS Tanpa Pusing? AI Jawabannya!</h1>
            <p className="text-lg text-foreground/70">
              Uji-T, Anova, Regresi? Jangan biarkan istilah statistik membuatmu pusing. Jelaskan masalah penelitianmu, dan biarkan AI kami memberikan panduan uji statistik yang tepat, lengkap dengan cara menjalankannya di SPSS.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <SpssGuide />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
