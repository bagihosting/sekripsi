
import GrammarChecker from '@/components/grammar-checker';
import { Card, CardContent } from '@/components/ui/card';
import { SpellCheck } from 'lucide-react';

export default function KorektorAiPage() {
  return (
    <section id="grammar-checker" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <SpellCheck className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Tingkatkan Kualitas Tulisan Skripsimu Seketika</h1>
            <p className="text-lg text-foreground/70">
              Jangan biarkan kesalahan ejaan atau tata bahasa mengurangi nilai skripsimu. Cukup tempel teksmu di sini, dan biarkan AI kami memolesnya hingga menjadi tulisan yang profesional dan bebas dari kesalahan.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <GrammarChecker />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
