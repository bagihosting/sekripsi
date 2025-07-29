
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
import { SkripsiKilatIcon } from '@/components/icons';
import { ArrowRight, Mail, Menu, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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

const Header = () => {
  const [open, setOpen] = useState(false);
  const navLinks = [
    { href: '#templates', label: 'Produk' },
    { href: '#ai-recommendations', label: 'Rekomendasi AI' },
    { href: '#support', label: 'Dukungan' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <SkripsiKilatIcon className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold text-foreground">SkripsiKilat</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild className="hidden sm:inline-flex">
            <Link href="#templates">
              Lihat Produk <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 pt-12">
                <Link href="/" className="mb-4 flex items-center gap-2">
                  <SkripsiKilatIcon className="h-8 w-8 text-primary" />
                  <span className="font-headline text-xl font-bold text-foreground">SkripsiKilat</span>
                </Link>
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild className="mt-4">
                  <Link href="#templates" onClick={() => setOpen(false)}>
                    Lihat Produk
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};


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
            <Link href="#templates">Saya Mau Lulus Cepat!</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
            <Link href="#ai-recommendations">
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
  <section id="trending" className="w-full py-16 lg:py-24">
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
    </div>
  </section>
);

const AllTemplatesSection = ({ templates }: { templates: Template[] }) => (
  <section id="templates" className="w-full bg-secondary/50 py-16 lg:py-24">
    <div className="container max-w-screen-xl">
       <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Gudang Senjata Rahasia untuk Tugas Akhir Anda</h2>
        <p className="mt-4 text-lg text-foreground/70">
          Apapun judul dan metode penelitian Anda, kami punya solusinya. Jelajahi koleksi skrip terlengkap dan temukan yang paling pas untuk membuat dosen terkesan.
        </p>
      </div>
      <TemplateGrid templates={templates} />
    </div>
  </section>
);

const AiSection = () => (
  <section id="ai-recommendations" className="py-16 lg:py-24">
    <div className="container max-w-screen-xl">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-4">
          <Sparkles className="h-12 w-12 text-accent" />
          <h2 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Masih Bingung Judul TA? Biarkan AI Kami Cari Ide Terbaik!</h2>
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

const SupportSection = () => (
  <section id="support" className="bg-secondary/50 py-16 lg:py-24">
    <div className="container max-w-screen-xl">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Tim Support Kami Siap Kawal Sampai Sidang!</h2>
        <p className="mt-4 text-lg text-foreground/70">
          Ada error saat instalasi? Butuh bantuan customisasi? Tim kami bukan sekadar teknisi, tapi mentor dadakan Anda. Hubungi kami, jangan biarkan error menghalangi kelulusan!
        </p>
      </div>
      <form className="mx-auto mt-8 max-w-2xl space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input placeholder="Nama Anda" aria-label="Nama Anda" />
          <Input type="email" placeholder="Email Anda" aria-label="Email Anda" />
        </div>
        <Textarea placeholder="Pertanyaan seputar skrip..." rows={6} aria-label="Pesan Anda" />
        <div className="text-left">
          <Button type="submit" size="lg">
            <Mail className="mr-2 h-5 w-5" /> Kirim Pertanyaan
          </Button>
        </div>
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
    <footer className="border-t py-8">
      <div className="container flex max-w-screen-xl flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <SkripsiKilatIcon className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold">SkripsiKilat</span>
        </div>
        <p className="text-center text-sm text-muted-foreground sm:text-left">
          &copy; {year} SkripsiKilat. Jalan Pintas Menuju Wisuda.
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
  <Card className="group overflow-hidden rounded-lg shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
    <CardContent className="p-0">
      <Link href="#">
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
            <Link href="#">Demo Langsung</Link>
          </Button>
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link href="#">Beli Skrip Ini</Link>
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);
