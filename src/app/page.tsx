
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getTemplates, Template } from '@/lib/data';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function Home() {
  const allTemplates = getTemplates();
  const trendingTemplates = allTemplates.filter(t => t.trending).slice(0, 4);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <TrendingSection templates={trendingTemplates} />
        <AiSection />
      </main>
      <SiteFooter />
    </div>
  );
}

const HeroSection = () => (
  <section className="w-full">
    <div className="container grid min-h-[calc(100dvh-3.5rem)] content-center text-center max-w-screen-xl">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Deadline Skripsi di Depan Mata? Lulus Cepat Tanpa Koding, Malam Ini Juga!
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
          Stop begadang dan stres mikirin kodingan dari nol. Skrip & template kami adalah jalan pintasmu menuju wisuda. Sudah teruji, tinggal pakai, dijamin dosen pembimbing langsung ACC!
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/produk">Saya Mau Lulus Cepat!</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/rekomendasi-ai">
              <Sparkles className="mr-2 h-5 w-5" />
              Carikan Ide Buat TA Saya
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const TrendingSection = ({ templates }: { templates: Template[] }) => (
  <section id="trending" className="w-full py-16 lg:py-24 bg-secondary/50">
    <div className="container max-w-screen-xl">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Skrip Paling Laris di Kalangan Pejuang Skripsi!</h2>
        <p className="mt-4 text-lg text-foreground/70">
          Ratusan mahasiswa sudah membuktikan. Ini bukan sekadar skrip, ini kunci kelulusan Anda. Jangan sampai teman Anda wisuda duluan!
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button asChild size="lg">
          <Link href="/produk">
            Lihat Semua Produk <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

const AiSection = () => (
  <section id="ai-recommendations" className="py-16 lg:py-24">
    <div className="container max-w-screen-xl">
      <div className="mx-auto max-w-3xl text-center">
          <Sparkles className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Masih Bingung Judul TA? Biarkan AI Kami Cari Ide Terbaik!</h2>
          <p className="mt-4 text-lg text-foreground/70">
            Jangan habiskan waktu berharga Anda! Cukup jelaskan bidang minat Anda, dan AI SkripsiKilat akan merekomendasikan skrip & template yang paling relevan dan berpotensi dapat nilai A. Gratis!
          </p>
           <div className="mt-8 flex items-center justify-center">
            <Button asChild size="lg" variant="outline">
                <Link href="/rekomendasi-ai">Coba Rekomendasi AI Sekarang</Link>
            </Button>
        </div>
      </div>
    </div>
  </section>
);

const TemplateCard = ({ template }: { template: Template }) => (
  <Card className="group overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
    <CardContent className="p-0">
      <Link href={`/produk/${template.id}`} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-t-lg">
        <div className="relative">
          <Image
            src={template.imageUrl}
            alt={template.name}
            width={600}
            height={400}
            data-ai-hint={template.aiHint}
            className="aspect-[3/2] w-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h3 className="font-headline text-xl font-semibold text-white">{template.name}</h3>
            <p className="text-sm text-white/80">{template.category}</p>
          </div>
          <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
            Rp{template.price.toLocaleString('id-ID')}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <p className="mb-4 text-sm text-muted-foreground h-10">{template.shortDescription}</p>
        <div className="flex gap-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href={template.liveDemoUrl} target="_blank">Demo Langsung</Link>
          </Button>
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href={`/produk/${template.id}`}>Detail</Link>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
