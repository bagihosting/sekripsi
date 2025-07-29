
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTemplates, Template } from '@/lib/data';
import { ArrowRight, Sparkles, Wand2, Target, TestTubeDiagonal, BookMarked, Library, PenSquare, SpellCheck, BrainCircuit, ShieldQuestion, Wand, Database } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const tools: { icon: LucideIcon; title: string; description: string, href: string }[] = [
  {
    icon: Wand2,
    title: 'Generator Judul',
    description: 'Dapatkan ide-ide judul skripsi yang menarik dan akademis berdasarkan bidang studimu.',
    href: '/generator-judul'
  },
  {
    icon: Target,
    title: 'Pertanyaan Penelitian',
    description: 'Ubah topik luas menjadi pertanyaan penelitian kualitatif & kuantitatif yang fokus.',
    href: '/pertanyaan-penelitian'
  },
  {
    icon: Library,
    title: 'Asisten Referensi',
    description: 'Temukan artikel jurnal dan referensi akademis yang relevan dengan ringkasannya.',
    href: '/referensi-ai'
  },
  {
    icon: PenSquare,
    title: 'Alat Parafrase',
    description: 'Tulis ulang kalimat untuk menghindari plagiarisme tanpa kehilangan makna aslinya.',
    href: '/parafrase-ai'
  },
  {
    icon: BrainCircuit,
    title: 'Pengecek Argumen',
    description: 'Identifikasi kelemahan logis dalam argumenmu sebelum dosen pembimbing.',
    href: '/cek-argumen'
  },
  {
    icon: ShieldQuestion,
    title: 'Simulasi Sidang',
    description: 'Latih mentalmu dengan menjawab pertanyaan-pertanyaan kritis dari "dosen penguji" AI.',
    href: '/simulasi-sidang'
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureGrid />
      <CtaSection />
    </>
  );
}

const HeroSection = () => (
  <section className="w-full">
    <div className="container flex min-h-[calc(60dvh-4rem)] items-center text-center max-w-screen-xl">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Lulus 3.5 Tahun Bukan Mimpi! Taklukkan Skripsimu Sekarang.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80">
          Dosen killer? Judul ditolak terus? Buntu di Bab 4? Lupakan semua itu. sekripsi.com adalah senjata rahasiamu untuk lulus lebih cepat dari teman-temanmu.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/alat-ai">Coba Senjata AI Gratis</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/blog">
              Intip Trik Rahasia
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);

const FeatureGrid = () => (
  <section id="features" className="w-full py-16 lg:py-24 bg-secondary/50">
    <div className="container max-w-screen-xl">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h2 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Gudang Senjata Pejuang Skripsi</h2>
        <p className="mt-4 text-lg text-foreground/70">
          Setiap alat adalah jalan pintas cerdas untuk melewati rintangan skripsi. Jangan kerja keras, kerja cerdas!
        </p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <FeatureCard key={index} icon={tool.icon} title={tool.title} description={tool.description} href={tool.href} />
        ))}
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, description, href }: { icon: LucideIcon; title: string; description: string; href: string }) => (
  <Link href={href}>
    <Card className="h-full transform-gpu transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <CardHeader className="flex-row items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                <Icon className="h-8 w-8" />
            </div>
            <CardTitle className="font-headline text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
  </Link>
);


const CtaSection = () => (
    <section id="cta" className="py-16 lg:py-24">
        <div className="container max-w-screen-xl text-center">
            <div className="mx-auto max-w-2xl">
                <h2 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Masih Mau Nunda Kelulusan?</h2>
                <p className="mt-4 text-lg text-foreground/70">
                   Waktu terus berjalan. Teman-temanmu sudah mulai wisuda. Giliranmu kapan? Semua alat untuk menaklukkan skripsi sudah di depan mata.
                </p>
                <Button size="lg" className="mt-8" asChild>
                    <Link href="/harga">
                        <span className="sm:hidden">Lihat Paket & Upgrade</span>
                        <span className="hidden sm:inline">Lihat Paket & Upgrade Sekarang</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </div>
        </div>
    </section>
);
