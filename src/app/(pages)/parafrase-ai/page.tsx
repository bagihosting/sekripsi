
import ParaphraseTool from '@/components/paraphrase-tool';
import { Card, CardContent } from '@/components/ui/card';
import { PenSquare } from 'lucide-react';

export default function ParafraseAiPage() {
  return (
    <section id="paraphrase-tool" className="py-16 lg:py-24">
      <div className="container max-w-screen-xl">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-4">
            <PenSquare className="h-12 w-12 text-accent" />
            <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Hindari Plagiarisme dengan AI Cerdas Kami</h1>
            <p className="text-lg text-foreground/70">
              Ubah kalimat Anda menjadi versi baru yang unik tanpa kehilangan makna aslinya. Alat parafrase kami membantu Anda menyusun ulang tulisan agar lolos uji plagiarisme dan terdengar lebih profesional.
            </p>
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <ParaphraseTool />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
