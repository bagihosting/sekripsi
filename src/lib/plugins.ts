
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
import { adminDb } from './firebase-admin';
import { initialTools } from './initial-data';


export interface AiTool {
  id: string;
  icon: string; 
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


export const iconMap: { [key: string]: LucideIcon } = {
    FileText, Wand2, Target, TestTubeDiagonal, BookMarked, Library, PenSquare, SpellCheck, BrainCircuit, ShieldQuestion, Wand, Database, BookText
};

async function populateInitialTools() {
    if (!adminDb) return;
    const toolsCollection = adminDb.collection('ai_tools');
    const snapshot = await toolsCollection.get();
    if (snapshot.empty) {
        console.log("Populating initial AI tools into Firestore...");
        const batch = adminDb.batch();
        for (const tool of initialTools) {
            const docRef = toolsCollection.doc(tool.id);
            batch.set(docRef, tool);
        }
        await batch.commit();
        console.log("Initial tools populated.");
    }
}

populateInitialTools();

// Function to get all tools from Firestore, returning icon as a string
export async function getAllTools(): Promise<AiTool[]> {
  if (!adminDb) {
     console.warn("Admin DB not initialized. Returning initial tools.");
     return initialTools;
  }
  try {
    const toolsCollection = adminDb.collection('ai_tools');
    const toolsSnapshot = await toolsCollection.get();
    
    if (toolsSnapshot.empty) {
        console.warn("No AI tools found in Firestore. Returning initial toolset.");
        return initialTools;
    }
    
    const tools = toolsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        icon: data.icon as string, // Keep icon as string
      } as AiTool;
    });
    return tools;
  } catch (error) {
    console.error("Error fetching tools from Firestore with Admin SDK:", error);
    return initialTools; // Fallback
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
