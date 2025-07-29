
import StoryGenerator from '@/components/story-generator';
import { Card, CardContent } from '@/components/ui/card';
import { Wand } from 'lucide-react';

export default function StoryGeneratorPage() {
  return (
    <section id="story-generator" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <Wand className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Kehabisan Ide? AI Bantu Ciptakan Cerita!</h1>
            <p className="text-lg text-foreground/70">
              Cukup berikan satu kalimat ide, dan biarkan AI kami yang kreatif mengubahnya menjadi sebuah cerita pendek yang utuh. Alat yang sempurna untuk memancing imajinasi Anda.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <StoryGenerator />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
