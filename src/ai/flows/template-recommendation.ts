'use server';

/**
 * @fileOverview Template recommendation AI agent.
 *
 * - recommendTemplates - A function that handles the template recommendation process.
 * - RecommendTemplatesInput - The input type for the recommendTemplates function.
 * - RecommendTemplatesOutput - The return type for the recommendTemplates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTemplatesInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('Deskripsi proyek yang membutuhkan template.'),
});
export type RecommendTemplatesInput = z.infer<typeof RecommendTemplatesInputSchema>;

const RecommendTemplatesOutputSchema = z.object({
  templateRecommendations: z
    .array(z.string())
    .describe('Daftar rekomendasi template berdasarkan deskripsi proyek.'),
});
export type RecommendTemplatesOutput = z.infer<typeof RecommendTemplatesOutputSchema>;

export async function recommendTemplates(input: RecommendTemplatesInput): Promise<RecommendTemplatesOutput> {
  return recommendTemplatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTemplatesPrompt',
  input: {schema: RecommendTemplatesInputSchema},
  output: {schema: RecommendTemplatesOutputSchema},
  prompt: `Anda adalah seorang ahli dalam merekomendasikan template situs web berdasarkan deskripsi proyek.

  Berdasarkan deskripsi proyek berikut, rekomendasikan daftar template situs web yang cocok.
  Deskripsi Proyek: {{{projectDescription}}}
  
  Kembalikan daftar nama template dalam Bahasa Indonesia.`,
});

const recommendTemplatesFlow = ai.defineFlow(
  {
    name: 'recommendTemplatesFlow',
    inputSchema: RecommendTemplatesInputSchema,
    outputSchema: RecommendTemplatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
