'use server';

/**
 * @fileOverview AI agent for generating thesis outlines.
 *
 * - generateOutline - A function that handles the outline generation process.
 * - GenerateOutlineInput - The input type for the generateOutline function.
 * - GenerateOutlineOutput - The return type for the generateOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateOutlineInputSchema = z.object({
  topic: z.string().describe('The main topic or title of the thesis.'),
});
export type GenerateOutlineInput = z.infer<typeof GenerateOutlineInputSchema>;

const ChapterSchema = z.object({
  chapterTitle: z.string().describe('The title of the chapter (e.g., "Bab I: Pendahuluan").'),
  description: z.string().describe('A brief overview of what this chapter contains.'),
  points: z.array(z.string()).describe('A list of key points or sub-sections to be discussed in this chapter.'),
});

const GenerateOutlineOutputSchema = z.object({
  outline: z
    .array(ChapterSchema)
    .describe('A list of chapters forming the thesis outline.'),
});
export type GenerateOutlineOutput = z.infer<typeof GenerateOutlineOutputSchema>;

export async function generateOutline(input: GenerateOutlineInput): Promise<GenerateOutlineOutput> {
  return generateOutlineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOutlinePrompt',
  input: {schema: GenerateOutlineInputSchema},
  output: {schema: GenerateOutlineOutputSchema},
  prompt: `Anda adalah seorang konsultan akademik yang ahli dalam menyusun kerangka skripsi atau tugas akhir.
Berdasarkan topik atau judul yang diberikan, buatlah kerangka skripsi yang logis dan komprehensif.

Topik/Judul Skripsi: {{{topic}}}

Buatlah struktur yang terdiri dari 5 (lima) bab standar:
1.  **Bab I: Pendahuluan:** Latar belakang, rumusan masalah, tujuan, dan manfaat penelitian.
2.  **Bab II: Tinjauan Pustaka:** Teori-teori relevan, penelitian terdahulu, dan kerangka pemikiran.
3.  **Bab III: Metode Penelitian:** Pendekatan, objek, teknik pengumpulan data, dan teknik analisis data.
4.  **Bab IV: Hasil dan Pembahasan:** Penyajian data, analisis, dan interpretasi hasil.
5.  **Bab V: Penutup:** Kesimpulan dan saran.

Untuk setiap bab, berikan deskripsi singkat dan beberapa poin atau sub-bagian kunci yang harus ada di dalamnya, sesuaikan dengan topik yang diberikan.`,
});

const generateOutlineFlow = ai.defineFlow(
  {
    name: 'generateOutlineFlow',
    inputSchema: GenerateOutlineInputSchema,
    outputSchema: GenerateOutlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
