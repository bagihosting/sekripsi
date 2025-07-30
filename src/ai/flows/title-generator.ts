
'use server';

/**
 * @fileOverview AI agent for generating thesis titles.
 *
 * - generateTitles - A function that handles the title generation process.
 * - GenerateTitlesInput - The input type for the generateTitles function.
 * - GenerateTitlesOutput - The return type for the generateTitles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateTitlesInputSchema = z.object({
  fieldOfStudy: z
    .string()
    .describe('The field of study or main keywords for the thesis.'),
});
export type GenerateTitlesInput = z.infer<typeof GenerateTitlesInputSchema>;

const GenerateTitlesOutputSchema = z.object({
  titles: z
    .array(
      z.object({
        title: z.string().describe('The generated thesis title.'),
        description: z
          .string()
          .describe(
            'A brief, one-sentence description of the potential research direction for this title.'
          ),
      })
    )
    .describe('A list of recommended thesis titles with brief descriptions.'),
});
export type GenerateTitlesOutput = z.infer<typeof GenerateTitlesOutputSchema>;

export async function generateTitles(input: GenerateTitlesInput): Promise<GenerateTitlesOutput> {
  return generateTitlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTitlesPrompt',
  input: {schema: GenerateTitlesInputSchema},
  output: {schema: GenerateTitlesOutputSchema},
  prompt: `Anda adalah seorang asisten akademik ahli yang bertugas membantu mahasiswa menemukan judul skripsi yang menarik, relevan, dan akademis.

Berdasarkan bidang studi atau kata kunci berikut, buatlah 5 (lima) rekomendasi judul skripsi yang unik.
Untuk setiap judul, berikan juga satu kalimat deskripsi singkat tentang kemungkinan arah penelitiannya.

Bidang Studi / Kata Kunci: {{{fieldOfStudy}}}

Pastikan judul yang dihasilkan terdengar formal dan cocok untuk sebuah karya ilmiah. Fokus pada tren teknologi, metode penelitian modern, atau studi kasus yang relevan jika memungkinkan.`,
});

const generateTitlesFlow = ai.defineFlow(
  {
    name: 'generateTitlesFlow',
    inputSchema: GenerateTitlesInputSchema,
    outputSchema: GenerateTitlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
