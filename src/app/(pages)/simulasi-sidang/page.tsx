
import DefenseSimulator from '@/components/defense-simulator';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldQuestion } from 'lucide-react';

export default function SimulasiSidangPage() {
  return (
    <section id="defense-simulator" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <ShieldQuestion className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Uji Mentalmu Sebelum Diuji Dosen!</h1>
            <p className="text-lg text-foreground/70">
              Merasa siap untuk sidang? Coba dulu hadapi "dosen penguji" AI kami. Masukkan abstrak skripsimu dan dapatkan pertanyaan-pertanyaan tajam yang akan melatihmu menjawab dengan percaya diri di hari-H.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <DefenseSimulator />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
