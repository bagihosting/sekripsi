
import type { LucideIcon } from 'lucide-react';
import { allAiTools, AiTool } from './plugins';

// Re-export AiTool as DigitalProduct for semantic consistency in this file.
export type DigitalProduct = AiTool & {
  features: string[];
};

const productDetails: { [key: string]: { features: string[] } } = {
    'draft-generator': {
        features: [
            "Membuat draf 5 bab (Pendahuluan, Tinjauan Pustaka, Metode, Hasil, Penutup)",
            "Menambahkan sitasi hipotetis untuk panduan referensi",
            "Menghasilkan daftar pustaka fiktif yang relevan"
        ]
    },
    'paraphrase-tool': {
        features: [
            "Menghasilkan 3 opsi parafrase: Formal, Sederhana, dan Kreatif",
            "Membantu menghindari plagiarisme",
            "Memperbaiki gaya penulisan menjadi lebih akademis"
        ]
    },
    'spss-guide': {
        features: [
            "Merekomendasikan uji statistik yang tepat",
            "Memberikan panduan langkah-demi-langkah di SPSS",
            "Menjelaskan cara menginterpretasi output hasil"
        ]
    },
    'abstract-generator': {
        features: [
            "Mensintesis 4 bagian utama penelitian menjadi satu abstrak",
            "Menghasilkan abstrak yang padat, jelas, dan profesional",
            "Menghemat waktu dalam merangkum keseluruhan penelitian"
        ]
    },
    'argument-checker': {
        features: [
            "Mendeteksi potensi kelemahan logis dalam tulisan",
            "Mengutip bagian yang bermasalah",
            "Memberikan saran perbaikan yang konkret"
        ]
    },
    'defense-simulator': {
        features: [
            "Menghasilkan 5-7 pertanyaan kritis selevel dosen penguji",
            "Mencakup berbagai area: metodologi, hasil, kontribusi",
            "Membantu melatih kesiapan mental untuk sidang"
        ]
    },
};


const proTools: DigitalProduct[] = allAiTools
  .filter(tool => tool.availability === 'pro')
  .map(tool => ({
    ...tool,
    features: productDetails[tool.id]?.features || [
      "Fitur A",
      "Fitur B",
      "Fitur C"
    ],
  }));
  
export const getProducts = (): DigitalProduct[] => {
    return proTools;
};

export const getProductById = (id: string): DigitalProduct | undefined => {
    return proTools.find(p => p.id === id);
};
