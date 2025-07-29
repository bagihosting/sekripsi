
import AiRecommender from '@/components/ai-recommender';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function RekomendasiAiPage() {
  return (
    <section id="ai-recommendations" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <Sparkles className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Masih Bingung Judul TA? Biarkan AI Kami Cari Ide Terbaik!</h1>
            <p className="text-lg text-foreground/70">
              Jangan habiskan waktu berharga Anda! Cukup jelaskan bidang minat Anda, dan AI SkripsiKilat akan merekomendasikan skrip & template yang paling relevan dan berpotensi dapat nilai A. Gratis!
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <AiRecommender />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
