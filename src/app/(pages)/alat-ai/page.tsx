
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Wand2,
  Target,
  TestTubeDiagonal,
  BookMarked,
  Library,
  PenSquare,
  SpellCheck,
  BrainCircuit,
  ShieldQuestion,
  Wand,
  ArrowRight,
  Sparkles,
  Database,
  BookText,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';

interface AiTool {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
}

const toolGroups = [
  {
    title: 'Tahap Perencanaan & Ideasi',
    description: 'Mulai perjalanan skripsimu dengan fondasi yang kuat. Dari ide mentah hingga kerangka yang matang.',
    tools: [
       {
        icon: FileText,
        title: 'Generator Draf Skripsi (Bab 1-5)',
        description: 'Alat paling jenius. Masukkan topik, dan dapatkan draf Bab 1-5 yang solid dalam sekejap.',
        href: '/generator-draf',
        badge: 'Terbaru!',
      },
      {
        icon: Wand2,
        title: 'Generator Judul',
        description: 'Dapatkan ide-ide judul skripsi yang menarik dan akademis berdasarkan bidang studimu.',
        href: '/generator-judul',
      },
      {
        icon: Target,
        title: 'Pertanyaan Penelitian',
        description: 'Ubah topik luas menjadi pertanyaan penelitian kualitatif & kuantitatif yang fokus dan tajam.',
        href: '/pertanyaan-penelitian',
      },
      {
        icon: TestTubeDiagonal,
        title: 'Generator Hipotesis',
        description: 'Buat hipotesis nol (H0) dan alternatif (H1) yang jelas, spesifik, dan dapat diuji untuk penelitianmu.',
        href: '/generator-hipotesis',
      },
      {
        icon: BookMarked,
        title: 'Generator Kerangka',
        description: 'Susun struktur bab skripsi yang logis dan komprehensif, dari pendahuluan hingga penutup.',
        href: '/kerangka-ai',
      },
    ],
  },
  {
    title: 'Tahap Penulisan & Riset',
    description: 'Percepat proses menulismu dengan bantuan AI. Cari sumber, tulis ulang, dan pastikan tulisanmu berkualitas.',
    tools: [
      {
        icon: Library,
        title: 'Asisten Referensi',
        description: 'Temukan artikel jurnal dan referensi akademis yang relevan lengkap dengan ringkasannya.',
        href: '/referensi-ai',
      },
      {
        icon: PenSquare,
        title: 'Alat Parafrase',
        description: 'Hindari plagiarisme dengan mengubah kalimatmu menjadi versi baru yang unik tanpa kehilangan makna.',
        href: '/parafrase-ai',
        badge: 'Populer',
      },
    ],
  },
   {
    title: 'Tahap Analisis Data',
    description: 'Jangan tersesat di tengah angka. Dapatkan panduan ahli untuk mengolah dan menginterpretasikan data penelitianmu.',
    tools: [
       {
        icon: Database,
        title: 'Panduan Analisis SPSS',
        description: 'Bingung pakai uji statistik apa? AI akan memandumu memilih dan menginterpretasi hasil analisis di SPSS.',
        href: '/panduan-spss',
        badge: 'Baru',
      },
    ]
  },
  {
    title: 'Tahap Koreksi & Finalisasi',
    description: 'Poles naskahmu hingga sempurna. Periksa tata bahasa, perkuat argumen, dan siapkan dirimu untuk sidang.',
    tools: [
      {
        icon: BookText,
        title: 'Generator Abstrak',
        description: 'Sintesis Latar Belakang, Metode, Hasil, dan Kesimpulan menjadi Abstrak yang utuh dan profesional.',
        href: '/generator-abstrak',
        badge: 'Baru',
      },
      {
        icon: SpellCheck,
        title: 'Korektor Tulisan',
        description: 'Perbaiki kesalahan ejaan, tata bahasa, dan gaya penulisan agar skripsimu terlihat profesional.',
        href: '/korektor-ai',
      },
      {
        icon: BrainCircuit,
        title: 'Pengecek Argumen',
        description: 'Identifikasi kelemahan logis dalam argumenmu sebelum dosen pembimbing menemukannya.',
        href: '/cek-argumen',
      },
      {
        icon: ShieldQuestion,
        title: 'Simulasi Sidang',
        description: 'Latih mentalmu dengan menjawab pertanyaan-pertanyaan kritis dari "dosen penguji" AI kami.',
        href: '/simulasi-sidang',
      },
    ]
  },
   {
    title: 'Alat Kreatif',
    description: 'Butuh sedikit inspirasi di luar skripsi? Alat ini bisa membantu.',
    tools: [
       {
        icon: Wand,
        title: 'Generator Cerita',
        description: 'Ubah satu kalimat ide menjadi sebuah cerita pendek yang utuh untuk memancing imajinasimu.',
        href: '/story-generator',
      },
    ]
  }
];

export default function AiToolsPage() {
  return (
    <div className="container max-w-screen-xl py-12 lg:py-16">
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <h1 className="font-headline text-3xl font-bold md:text-4xl lg:text-5xl">Pusat Senjata AI SkripsiKilat</h1>
        <p className="mt-4 text-lg text-foreground/70">
          Semua yang kamu butuhkan untuk mempercepat kelulusan ada di sini. Pilih alat yang sesuai dengan tahap pengerjaan skripsimu, dari perencanaan hingga persiapan sidang.
        </p>
      </div>

      <div className="space-y-12">
        {toolGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="mb-8">
              <h2 className="font-headline text-2xl font-bold md:text-3xl">{group.title}</h2>
              <p className="mt-2 text-md text-foreground/70">{group.description}</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool) => (
                <ToolCard key={tool.href} {...tool} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ToolCard({ icon: Icon, title, description, href, badge }: AiTool) {
  return (
    <Card className="flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                 <Icon className="h-8 w-8" />
            </div>
            {badge && (
                <div className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{badge}</div>
            )}
        </div>
        <CardTitle className="pt-4 font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
      <div className="p-6 pt-0">
        <Button asChild className="w-full">
          <Link href={href}>
            Gunakan Alat <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
