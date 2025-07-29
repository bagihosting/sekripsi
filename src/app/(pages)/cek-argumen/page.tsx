
import ArgumentChecker from '@/components/argument-checker';
import { Card, CardContent } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export default function CekArgumenPage() {
  return (
    <section id="argument-checker" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <BrainCircuit className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Perkuat Argumenmu, Antisipasi Serangan Dosen</h1>
            <p className="text-lg text-foreground/70">
              Jangan biarkan ada celah dalam tulisanmu. AI kami akan bertindak sebagai dosen pembimbing paling kritis, menemukan potensi kelemahan dalam argumenmu sebelum orang lain melakukannya.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <ArgumentChecker />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
