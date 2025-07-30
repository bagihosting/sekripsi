
import type { AiTool } from './plugins';

export const initialTools: AiTool[] = [
  // Ideation Tools
  {
    id: 'draft-generator',
    icon: 'FileText',
    title: 'Generator Draf Skripsi (Bab 1-5)',
    description:
      'Alat paling jenius. Masukkan topik, dan dapatkan draf Bab 1-5 yang solid dalam sekejap.',
    href: '/generator-draf',
    category: 'Perencanaan & Ideasi',
    badge: 'Terbaru!',
    price: 15000,
  },
  {
    id: 'title-generator',
    icon: 'Wand2',
    title: 'Generator Judul',
    description:
      'Dapatkan ide-ide judul skripsi yang menarik dan akademis berdasarkan bidang studimu.',
    href: '/generator-judul',
    category: 'Perencanaan & Ideasi',
    price: 0,
  },
  {
    id: 'question-generator',
    icon: 'Target',
    title: 'Pertanyaan Penelitian',
    description:
      'Ubah topik luas menjadi pertanyaan penelitian kualitatif & kuantitatif yang fokus dan tajam.',
    href: '/pertanyaan-penelitian',
    category: 'Perencanaan & Ideasi',
    price: 0,
  },
  {
    id: 'hypothesis-generator',
    icon: 'TestTubeDiagonal',
    title: 'Generator Hipotesis',
    description:
      'Buat hipotesis nol (H0) dan alternatif (H1) yang jelas, spesifik, dan dapat diuji untuk penelitianmu.',
    href: '/generator-hipotesis',
    category: 'Perencanaan & Ideasi',
    price: 0,
  },
  {
    id: 'outline-generator',
    icon: 'BookMarked',
    title: 'Generator Kerangka',
    description:
      'Susun struktur bab skripsi yang logis dan komprehensif, dari pendahuluan hingga penutup.',
    href: '/kerangka-ai',
    category: 'Perencanaan & Ideasi',
    price: 0,
  },
  // Research Tools
  {
    id: 'reference-finder',
    icon: 'Library',
    title: 'Asisten Referensi',
    description:
      'Temukan artikel jurnal dan referensi akademis yang relevan lengkap dengan ringkasannya.',
    href: '/referensi-ai',
    category: 'Penulisan & Riset',
    price: 0,
  },
  {
    id: 'paraphrase-tool',
    icon: 'PenSquare',
    title: 'Alat Parafrase',
    description:
      'Hindari plagiarisme dengan mengubah kalimatmu menjadi versi baru yang unik tanpa kehilangan makna.',
    href: '/parafrase-ai',
    category: 'Penulisan & Riset',
    badge: 'Populer',
    price: 10000,
  },
  // Analysis Tools
  {
    id: 'spss-guide',
    icon: 'Database',
    title: 'Panduan Analisis SPSS',
    description:
      'Bingung pakai uji statistik apa? AI akan memandumu memilih dan menginterpretasi hasil analisis di SPSS.',
    href: '/panduan-spss',
    category: 'Analisis Data',
    badge: 'Baru',
    price: 20000,
  },
  // Finalization Tools
  {
    id: 'abstract-generator',
    icon: 'BookText',
    title: 'Generator Abstrak',
    description:
      'Sintesis Latar Belakang, Metode, Hasil, dan Kesimpulan menjadi Abstrak yang utuh dan profesional.',
    href: '/generator-abstrak',
    category: 'Koreksi & Finalisasi',
    badge: 'Baru',
    price: 10000,
  },
  {
    id: 'grammar-checker',
    icon: 'SpellCheck',
    title: 'Korektor Tulisan',
    description:
      'Perbaiki kesalahan ejaan, tata bahasa, dan gaya penulisan agar skripsimu terlihat profesional.',
    href: '/korektor-ai',
    category: 'Koreksi & Finalisasi',
    price: 0,
  },
  {
    id: 'argument-checker',
    icon: 'BrainCircuit',
    title: 'Pengecek Argumen',
    description:
      'Identifikasi kelemahan logis dalam argumenmu sebelum dosen pembimbing menemukannya.',
    href: '/cek-argumen',
    category: 'Koreksi & Finalisasi',
    price: 15000,
  },
  {
    id: 'defense-simulator',
    icon: 'ShieldQuestion',
    title: 'Simulasi Sidang',
    description:
      'Latih mentalmu dengan menjawab pertanyaan-pertanyaan kritis dari "dosen penguji" AI kami.',
    href: '/simulasi-sidang',
    category: 'Koreksi & Finalisasi',
    price: 25000,
  },
  // Creative Tools
  {
    id: 'story-generator',
    icon: 'Wand',
    title: 'Generator Cerita',
    description:
      'Ubah satu kalimat ide menjadi sebuah cerita pendek yang utuh untuk memancing imajinasimu.',
    href: '/story-generator',
    category: 'Alat Kreatif',
    price: 0,
  },
];
