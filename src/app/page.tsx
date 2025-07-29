
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { getTemplates, Template } from '@/lib/data';
import AiRecommender from '@/components/ai-recommender';
import TemplateGrid from '@/components/template-grid';
import { CuanKilatIcon } from '@/components/icons';
import { ArrowRight, Mail, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const allTemplates = getTemplates();
  const trendingTemplates = allTemplates.filter(t => t.trending).slice(0, 4);

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <TrendingSection templates={trendingTemplates} />
        <AllTemplatesSection templates={allTemplates} />
        <AiSection />
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
}

const Header = () => (
  <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <CuanKilatIcon className="h-6 w-6 text-primary" />
        <span className="font-headline text-xl font-bold text-foreground">CuanKilat</span>
      </Link>
      <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
        <Link href="#templates" className="transition-colors hover:text-primary">Produk</Link>
        <Link href="#ai-recommendations" className="transition-colors hover:text-primary">Rekomendasi AI</Link>
        <Link href="#support" className="transition-colors hover:text-primary">Dukungan</Link>
      </nav>
      <Button asChild>
        <Link href="#templates">
          Lihat Produk <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </header>
);

const HeroSection = () => (
  <section className="container grid min-h-[calc(100dvh-3.5rem)] content-center text-center">
    <div className="mx-auto max-w-4xl">
      <h1 className="font-headline text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl">
        Jangan Cuma Punya Ide, Wujudkan Jadi Cuan!
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 md:text-xl">
        Lewati proses koding berbulan-bulan! Dapatkan akses instan ke ratusan template & skrip profesional yang terbukti menghasilkan. Proyek Anda bisa online malam ini!
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Button size="lg" asChild>
          <Link href="#templates">Jelajahi Produk</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="#ai-recommendations">
            <Sparkles className="mr-2 h-5 w-5" />
            Dapatkan Saran AI
          </Link>
        </Button>
      </div>
    </div>
  </section>
);

const TrendingSection = ({ templates }: { templates: Template[] }) => (
  <section id="trending" className="w-full py-16 lg:py-24">
    <div className="container">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-headline text-4xl font-bold md:text-5xl">Diborong Ribuan Orang! Jangan Sampai Ketinggalan Produk Terlaris Ini!</h2>
        <p className="mt-4 text-lg text-foreground/70">
          Lihat apa yang sedang viral! Desain dan aplikasi ini adalah yang paling dicari, terbukti disukai, dan siap melambungkan proyek Anda ke level berikutnya.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map(template => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  </section>
);

const AllTemplatesSection = ({ templates }: { templates: Template[] }) => (
  <section id="templates" className="w-full bg-secondary/50 py-16 lg:py-24">
    <div className="container">
       <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="font-headline text-4xl font-bold md:text-5xl">Koleksi Lengkap Senjata Rahasia Anda</h2>
        <p className="mt-4 text-lg text-foreground/70">
          Jelajahi pustaka lengkap template dan skrip aplikasi premium kami. Temukan yang paling cocok untuk proyek Anda.
        </p>
      </div>
      <TemplateGrid templates={templates} />
    </div>
  </section>
);

const AiSection = () => (
  <section id="ai-recommendations" className="py-16 lg:py-24">
    <div className="container">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <Sparkles className="h-12 w-12 text-accent" />
          <h2 className="font-headline text-4xl font-bold md:text-5xl">Masih Ragu? Biarkan AI Kami Memilihkan Jodoh Proyek Anda!</h2>
          <p className="text-lg text-foreground/70">
            Cukup ketik ide gila Anda, dan biarkan asisten cerdas kami mengungkap produk rahasia yang akan mengubah visi Anda menjadi kenyataan dalam sekejap. Gratis!
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

const SupportSection = () => (
  <section id="support" className="bg-secondary/50 py-16 lg:py-24">
    <div className="container max-w-2xl text-center">
      <h2 className="font-headline text-4xl font-bold md:text-5xl">Kami Siap Membantu Anda Jadi Sultan</h2>
      <p className="mt-4 text-lg text-foreground/70">
        Ada pertanyaan? Butuh bantuan? Tim dukungan kami siap mengawal Anda menuju kesuksesan. Jangan ragu, hubungi kami!
      </p>
      <form className="mt-8 space-y-4 text-left">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input placeholder="Nama Anda" />
          <Input type="email" placeholder="Email Anda" />
        </div>
        <Textarea placeholder="Pesan Anda" rows={6} />
        <Button type="submit" className="w-full sm:w-auto" size="lg">
          <Mail className="mr-2 h-5 w-5" /> Kirim Pesan
        </Button>
      </form>
    </div>
  </section>
);

const Footer = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t py-12">
      <div className="container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <CuanKilatIcon className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">CuanKilat</span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {year} CuanKilat. Semua hak cipta dilindungi.
        </p>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">Kebijakan Privasi</Link>
          <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">Ketentuan Layanan</Link>
        </div>
      </div>
    </footer>
  );
};

const TemplateCard = ({ template }: { template: Template }) => (
  <Card className="group overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
    <CardContent className="p-0">
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
          ${template.price.toFixed(2)}
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground">{template.shortDescription}</p>
        <div className="mt-4 flex gap-2">
          <Button size="sm" className="flex-1" asChild>
            <Link href="#">Demo Langsung</Link>
          </Button>
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href="#">Detail</Link>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
