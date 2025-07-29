
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
  Database,
  BookText,
  FileText,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface AiTool {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  badge?: string;
  availability: 'free' | 'pro';
}

export interface AiToolGroup {
    title: string;
    description: string;
    tools: AiTool[];
}

const ideationTools: AiTool[] = [
    {
      id: 'draft-generator',
      icon: FileText,
      title: 'Generator Draf Skripsi (Bab 1-5)',
      description: 'Alat paling jenius. Masukkan topik, dan dapatkan draf Bab 1-5 yang solid dalam sekejap.',
      href: '/generator-draf',
      badge: 'Terbaru!',
      availability: 'pro',
    },
    {
      id: 'title-generator',
      icon: Wand2,
      title: 'Generator Judul',
      description: 'Dapatkan ide-ide judul skripsi yang menarik dan akademis berdasarkan bidang studimu.',
      href: '/generator-judul',
      availability: 'free',
    },
    {
      id: 'question-generator',
      icon: Target,
      title: 'Pertanyaan Penelitian',
      description: 'Ubah topik luas menjadi pertanyaan penelitian kualitatif & kuantitatif yang fokus dan tajam.',
      href: '/pertanyaan-penelitian',
      availability: 'free',
    },
    {
      id: 'hypothesis-generator',
      icon: TestTubeDiagonal,
      title: 'Generator Hipotesis',
      description: 'Buat hipotesis nol (H0) dan alternatif (H1) yang jelas, spesifik, dan dapat diuji untuk penelitianmu.',
      href: '/generator-hipotesis',
      availability: 'free',
    },
    {
      id: 'outline-generator',
      icon: BookMarked,
      title: 'Generator Kerangka',
      description: 'Susun struktur bab skripsi yang logis dan komprehensif, dari pendahuluan hingga penutup.',
      href: '/kerangka-ai',
      availability: 'free',
    },
];

const researchTools: AiTool[] = [
    {
      id: 'reference-finder',
      icon: Library,
      title: 'Asisten Referensi',
      description: 'Temukan artikel jurnal dan referensi akademis yang relevan lengkap dengan ringkasannya.',
      href: '/referensi-ai',
      availability: 'free',
    },
    {
      id: 'paraphrase-tool',
      icon: PenSquare,
      title: 'Alat Parafrase',
      description: 'Hindari plagiarisme dengan mengubah kalimatmu menjadi versi baru yang unik tanpa kehilangan makna.',
      href: '/parafrase-ai',
      badge: 'Populer',
      availability: 'pro',
    },
];

const analysisTools: AiTool[] = [
    {
      id: 'spss-guide',
      icon: Database,
      title: 'Panduan Analisis SPSS',
      description: 'Bingung pakai uji statistik apa? AI akan memandumu memilih dan menginterpretasi hasil analisis di SPSS.',
      href: '/panduan-spss',
      badge: 'Baru',
      availability: 'pro',
    },
];

const finalizationTools: AiTool[] = [
    {
      id: 'abstract-generator',
      icon: BookText,
      title: 'Generator Abstrak',
      description: 'Sintesis Latar Belakang, Metode, Hasil, dan Kesimpulan menjadi Abstrak yang utuh dan profesional.',
      href: '/generator-abstrak',
      badge: 'Baru',
      availability: 'pro',
    },
    {
      id: 'grammar-checker',
      icon: SpellCheck,
      title: 'Korektor Tulisan',
      description: 'Perbaiki kesalahan ejaan, tata bahasa, dan gaya penulisan agar skripsimu terlihat profesional.',
      href: '/korektor-ai',
      availability: 'free',
    },
    {
      id: 'argument-checker',
      icon: BrainCircuit,
      title: 'Pengecek Argumen',
      description: 'Identifikasi kelemahan logis dalam argumenmu sebelum dosen pembimbing menemukannya.',
      href: '/cek-argumen',
      availability: 'pro',
    },
    {
      id: 'defense-simulator',
      icon: ShieldQuestion,
      title: 'Simulasi Sidang',
      description: 'Latih mentalmu dengan menjawab pertanyaan-pertanyaan kritis dari "dosen penguji" AI kami.',
      href: '/simulasi-sidang',
      availability: 'pro',
    },
];

const creativeTools: AiTool[] = [
    {
      id: 'story-generator',
      icon: Wand,
      title: 'Generator Cerita',
      description: 'Ubah satu kalimat ide menjadi sebuah cerita pendek yang utuh untuk memancing imajinasimu.',
      href: '/story-generator',
      availability: 'free',
    },
];


export const aiToolGroups: AiToolGroup[] = [
  {
    title: 'Tahap Perencanaan & Ideasi',
    description: 'Mulai perjalanan skripsimu dengan fondasi yang kuat. Dari ide mentah hingga kerangka yang matang.',
    tools: ideationTools,
  },
  {
    title: 'Tahap Penulisan & Riset',
    description: 'Percepat proses menulismu dengan bantuan AI. Cari sumber, tulis ulang, dan pastikan tulisanmu berkualitas.',
    tools: researchTools,
  },
  {
    title: 'Tahap Analisis Data',
    description: 'Jangan tersesat di tengah angka. Dapatkan panduan ahli untuk mengolah dan menginterpretasikan data penelitianmu.',
    tools: analysisTools,
  },
  {
    title: 'Tahap Koreksi & Finalisasi',
    description: 'Poles naskahmu hingga sempurna. Periksa tata bahasa, perkuat argumen, dan siapkan dirimu untuk sidang.',
    tools: finalizationTools,
  },
  {
    title: 'Alat Kreatif',
    description: 'Butuh sedikit inspirasi di luar skripsi? Alat ini bisa membantu.',
    tools: creativeTools,
  },
];

export const allAiTools: AiTool[] = [
    ...ideationTools,
    ...researchTools,
    ...analysisTools,
    ...finalizationTools,
    ...creativeTools,
];
