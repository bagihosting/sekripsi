
import QuestionGenerator from '@/components/question-generator';
import { Card, CardContent } from '@/components/ui/card';
import { Target } from 'lucide-react';

export default function PertanyaanPenelitianPage() {
  return (
    <section id="question-generator" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <Target className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Rumuskan Pertanyaan Penelitian yang Tajam</h1>
            <p className="text-lg text-foreground/70">
              Dari topik yang luas menjadi pertanyaan yang fokus. Masukkan area penelitianmu, dan biarkan AI membantu merumuskan pertanyaan penelitian kualitatif dan kuantitatif yang akan menjadi fondasi skripsimu.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <QuestionGenerator />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
