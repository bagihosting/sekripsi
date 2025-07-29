
import AbstractGenerator from '@/components/abstract-generator';
import { Card, CardContent } from '@/components/ui/card';
import { BookText } from 'lucide-react';

export default function GeneratorAbstrakPage() {
  return (
    <section id="abstract-generator" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <BookText className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Wajah Penelitianmu, Disusun oleh AI</h1>
            <p className="text-lg text-foreground/70">
              Abstrak adalah bagian terpenting untuk menarik pembaca. Masukkan poin-poin kunci dari penelitianmu, dan biarkan AI merangkainya menjadi abstrak akademis yang padat, jelas, dan profesional.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <AbstractGenerator />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
