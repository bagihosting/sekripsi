'use server';

/**
 * @fileOverview AI agent for finding academic references.
 *
 * - findReferences - A function that handles finding and summarizing references.
 * - FindReferencesInput - The input type for the findReferences function.
 * - FindReferencesOutput - The return type for the findReferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const FindReferencesInputSchema = z.object({
  topic: z.string().describe('The research topic to find references for.'),
});
export type FindReferencesInput = z.infer<typeof FindReferencesInputSchema>;

const ReferenceSchema = z.object({
  title: z.string().describe('The title of the academic paper or article.'),
  author: z.string().describe('The author(s) of the reference.'),
  year: z.number().describe('The publication year.'),
  summary: z.string().describe('A brief summary of the reference and its relevance to the topic.'),
  url: z.string().url().describe('A plausible URL to the reference, preferably a direct link to a PDF or an academic repository like Google Scholar, ResearchGate, or a university domain.'),
});

const FindReferencesOutputSchema = z.object({
  references: z
    .array(ReferenceSchema)
    .describe('A list of 3-5 relevant academic references for the given topic.'),
});
export type FindReferencesOutput = z.infer<typeof FindReferencesOutputSchema>;

export async function findReferences(input: FindReferencesInput): Promise<FindReferencesOutput> {
  return referenceFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'referenceFinderPrompt',
  input: {schema: FindReferencesInputSchema},
  output: {schema: FindReferencesOutputSchema},
  prompt: `Anda adalah asisten peneliti AI yang ahli dalam menemukan referensi akademis yang relevan.
Berdasarkan topik penelitian yang diberikan, temukan 3 hingga 5 artikel jurnal, makalah konferensi, atau buku yang sangat relevan.

Topik Penelitian: {{{topic}}}

Untuk setiap referensi, berikan informasi berikut:
1.  **Judul:** Judul lengkap dari karya tersebut.
2.  **Penulis:** Nama penulis utama. Jika lebih dari satu, gunakan format "Nama Penulis et al.".
3.  **Tahun:** Tahun publikasi.
4.  **Ringkasan:** Ringkasan singkat (2-3 kalimat) yang menjelaskan isi referensi dan mengapa ini relevan dengan topik yang diberikan.
5.  **URL:** Berikan URL yang paling mungkin menuju ke sumber tersebut. Prioritaskan tautan langsung ke PDF, Google Scholar, ResearchGate, Academia.edu, atau repositori universitas.

Pastikan referensi yang diberikan adalah otentik dan relevan secara akademis.`,
});

const referenceFinderFlow = ai.defineFlow(
  {
    name: 'referenceFinderFlow',
    inputSchema: FindReferencesInputSchema,
    outputSchema: FindReferencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
