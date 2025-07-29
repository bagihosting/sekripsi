
import HypothesisGenerator from '@/components/hypothesis-generator';
import { Card, CardContent } from '@/components/ui/card';
import { TestTubeDiagonal } from 'lucide-react';

export default function GeneratorHipotesisPage() {
  return (
    <section id="hypothesis-generator" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <TestTubeDiagonal className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Ubah Topik Jadi Hipotesis yang Teruji</h1>
            <p className="text-lg text-foreground/70">
              Dari ide abstrak menjadi pernyataan yang bisa diukur. Masukkan topik penelitianmu, dan biarkan AI jenius kami merumuskan hipotesis nol (H0) dan hipotesis alternatif (H1) yang akan menjadi inti pengujianmu.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <HypothesisGenerator />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
