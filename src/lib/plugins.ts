
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
import type { AiTool, AiToolGroup } from './types';

export const iconMap: { [key: string]: LucideIcon } = {
    FileText, Wand2, Target, TestTubeDiagonal, BookMarked, Library, PenSquare, SpellCheck, BrainCircuit, ShieldQuestion, Wand, Database, BookText
};

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
