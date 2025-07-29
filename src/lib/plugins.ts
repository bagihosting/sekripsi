
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
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface AiTool {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  category: string;
  badge?: string;
  price: number; // 0 for free tools
}

export interface AiToolGroup {
    title: string;
    description: string;
    tools: AiTool[];
}

// This is the initial data that will be populated into Firestore.
// It is NOT the source of truth for the application.
// The source of truth is the 'ai_tools' collection in Firestore.
export const initialTools: AiTool[] = [
    // Ideation Tools
    {
      id: 'draft-generator',
      icon: FileText,
      title: 'Generator Draf Skripsi (Bab 1-5)',
      description: 'Alat paling jenius. Masukkan topik, dan dapatkan draf Bab 1-5 yang solid dalam sekejap.',
      href: '/generator-draf',
      category: 'Perencanaan & Ideasi',
      badge: 'Terbaru!',
      price: 15000,
    },
    {
      id: 'title-generator',
      icon: Wand2,
      title: 'Generator Judul',
      description: 'Dapatkan ide-ide judul skripsi yang menarik dan akademis berdasarkan bidang studimu.',
      href: '/generator-judul',
      category: 'Perencanaan & Ideasi',
      price: 0,
    },
    {
      id: 'question-generator',
      icon: Target,
      title: 'Pertanyaan Penelitian',
      description: 'Ubah topik luas menjadi pertanyaan penelitian kualitatif & kuantitatif yang fokus dan tajam.',
      href: '/pertanyaan-penelitian',
      category: 'Perencanaan & Ideasi',
      price: 0,
    },
    {
      id: 'hypothesis-generator',
      icon: TestTubeDiagonal,
      title: 'Generator Hipotesis',
      description: 'Buat hipotesis nol (H0) dan alternatif (H1) yang jelas, spesifik, dan dapat diuji untuk penelitianmu.',
      href: '/generator-hipotesis',
      category: 'Perencanaan & Ideasi',
      price: 0,
    },
    {
      id: 'outline-generator',
      icon: BookMarked,
      title: 'Generator Kerangka',
      description: 'Susun struktur bab skripsi yang logis dan komprehensif, dari pendahuluan hingga penutup.',
      href: '/kerangka-ai',
      category: 'Perencanaan & Ideasi',
      price: 0,
    },
    // Research Tools
    {
      id: 'reference-finder',
      icon: Library,
      title: 'Asisten Referensi',
      description: 'Temukan artikel jurnal dan referensi akademis yang relevan lengkap dengan ringkasannya.',
      href: '/referensi-ai',
      category: 'Penulisan & Riset',
      price: 0,
    },
    {
      id: 'paraphrase-tool',
      icon: PenSquare,
      title: 'Alat Parafrase',
      description: 'Hindari plagiarisme dengan mengubah kalimatmu menjadi versi baru yang unik tanpa kehilangan makna.',
      href: '/parafrase-ai',
      category: 'Penulisan & Riset',
      badge: 'Populer',
      price: 10000,
    },
    // Analysis Tools
    {
      id: 'spss-guide',
      icon: Database,
      title: 'Panduan Analisis SPSS',
      description: 'Bingung pakai uji statistik apa? AI akan memandumu memilih dan menginterpretasi hasil analisis di SPSS.',
      href: '/panduan-spss',
      category: 'Analisis Data',
      badge: 'Baru',
      price: 20000,
    },
    // Finalization Tools
    {
      id: 'abstract-generator',
      icon: BookText,
      title: 'Generator Abstrak',
      description: 'Sintesis Latar Belakang, Metode, Hasil, dan Kesimpulan menjadi Abstrak yang utuh dan profesional.',
      href: '/generator-abstrak',
      category: 'Koreksi & Finalisasi',
      badge: 'Baru',
      price: 10000,
    },
    {
      id: 'grammar-checker',
      icon: SpellCheck,
      title: 'Korektor Tulisan',
      description: 'Perbaiki kesalahan ejaan, tata bahasa, dan gaya penulisan agar skripsimu terlihat profesional.',
      href: '/korektor-ai',
      category: 'Koreksi & Finalisasi',
      price: 0,
    },
    {
      id: 'argument-checker',
      icon: BrainCircuit,
      title: 'Pengecek Argumen',
      description: 'Identifikasi kelemahan logis dalam argumenmu sebelum dosen pembimbing menemukannya.',
      href: '/cek-argumen',
      category: 'Koreksi & Finalisasi',
      price: 15000,
    },
    {
      id: 'defense-simulator',
      icon: ShieldQuestion,
      title: 'Simulasi Sidang',
      description: 'Latih mentalmu dengan menjawab pertanyaan-pertanyaan kritis dari "dosen penguji" AI kami.',
      href: '/simulasi-sidang',
      category: 'Koreksi & Finalisasi',
      price: 25000,
    },
    // Creative Tools
    {
      id: 'story-generator',
      icon: Wand,
      title: 'Generator Cerita',
      description: 'Ubah satu kalimat ide menjadi sebuah cerita pendek yang utuh untuk memancing imajinasimu.',
      href: '/story-generator',
      category: 'Alat Kreatif',
      price: 0,
    },
];

// Map icon names to actual components
const iconMap: { [key: string]: LucideIcon } = {
    FileText, Wand2, Target, TestTubeDiagonal, BookMarked, Library, PenSquare, SpellCheck, BrainCircuit, ShieldQuestion, Wand, Database, BookText
};

async function populateInitialTools() {
    const toolsCollection = collection(db, 'ai_tools');
    const snapshot = await getDocs(toolsCollection);
    if (snapshot.empty) {
        console.log("Populating initial AI tools into Firestore...");
        const batch = [];
        for (const tool of initialTools) {
            const toolData = { ...tool, icon: tool.icon.displayName || tool.icon.name };
            batch.push(setDoc(doc(db, 'ai_tools', tool.id), toolData));
        }
        await Promise.all(batch);
        console.log("Initial tools populated.");
    }
}

// Call this function once, perhaps in a startup script or admin dashboard, to populate Firestore.
// For this prototype, we will check on every server start.
populateInitialTools();


// Function to get all tools from Firestore
export async function getAllTools(): Promise<AiTool[]> {
  try {
    const toolsCollection = collection(db, 'ai_tools');
    const toolsSnapshot = await getDocs(toolsCollection);
    
    if (toolsSnapshot.empty) {
        // This case should be rare after the initial population
        console.warn("No AI tools found in Firestore. Returning initial toolset.");
        return initialTools;
    }
    
    const tools = toolsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        icon: iconMap[data.icon as string] || Wand, // Fallback icon
      } as AiTool;
    });
    return tools;
  } catch (error) {
    console.error("Error fetching tools from Firestore:", error);
    return initialTools; // Fallback to initial data on error
  }
}

// Function to get a single tool by ID from Firestore
export async function getToolById(id: string): Promise<AiTool | null> {
    try {
        const toolRef = doc(db, 'ai_tools', id);
        const toolSnap = await getDoc(toolRef);

        if (!toolSnap.exists()) {
            console.warn(`Tool with id ${id} not found in Firestore.`);
            return null;
        }

        const data = toolSnap.data();
        return {
            ...data,
            id: toolSnap.id,
            icon: iconMap[data.icon as string] || Wand,
        } as AiTool;
    } catch (error) {
        console.error(`Error fetching tool with id ${id}:`, error);
        return null;
    }
}

export function groupTools(tools: AiTool[]): AiToolGroup[] {
  const groups: { [key: string]: AiTool[] } = {};
  
  tools.forEach(tool => {
    if (!groups[tool.category]) {
      groups[tool.category] = [];
    }
    groups[tool.category].push(tool);
  });

  const categoryOrder = [
    'Perencanaan & Ideasi',
    'Penulisan & Riset',
    'Analisis Data',
    'Koreksi & Finalisasi',
    'Alat Kreatif',
  ];

  const groupDescriptions: { [key: string]: string } = {
    'Perencanaan & Ideasi': 'Mulai perjalanan skripsimu dengan fondasi yang kuat. Dari ide mentah hingga kerangka yang matang.',
    'Penulisan & Riset': 'Percepat proses menulismu dengan bantuan AI. Cari sumber, tulis ulang, dan pastikan tulisanmu berkualitas.',
    'Analisis Data': 'Jangan tersesat di tengah angka. Dapatkan panduan ahli untuk mengolah dan menginterpretasikan data penelitianmu.',
    'Koreksi & Finalisasi': 'Poles naskahmu hingga sempurna. Periksa tata bahasa, perkuat argumen, dan siapkan dirimu untuk sidang.',
    'Alat Kreatif': 'Butuh sedikit inspirasi di luar skripsi? Alat ini bisa membantu.',
  };
  
  return categoryOrder
    .filter(category => groups[category])
    .map(category => ({
      title: category,
      description: groupDescriptions[category] || 'Alat AI untuk membantumu.',
      tools: groups[category],
    }));
}
