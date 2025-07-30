
'use server';

/**
 * @fileOverview AI agent for generating research hypotheses.
 *
 * - generateHypotheses - A function that handles the hypothesis generation process.
 * - HypothesisGeneratorInput - The input type for the generateHypotheses function.
 * - HypothesisGeneratorOutput - The return type for the generateHypotheses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const HypothesisGeneratorInputSchema = z.object({
  researchTopic: z
    .string()
    .describe(
      'A brief description of the research topic, including key variables if known.'
    ),
});
export type HypothesisGeneratorInput = z.infer<
  typeof HypothesisGeneratorInputSchema
>;

const HypothesisSchema = z.object({
  hypothesis: z.string().describe('The full text of the hypothesis.'),
  type: z
    .string()
    .describe(
      'The type of hypothesis (e.g., "Hipotesis Alternatif (H1)", "Hipotesis Nol (H0)").'
    ),
  explanation: z
    .string()
    .describe(
      'A brief explanation of the relationship between variables in this hypothesis.'
    ),
});

const HypothesisGeneratorOutputSchema = z.object({
  hypotheses: z
    .array(HypothesisSchema)
    .describe(
      'A list of potential research hypotheses, typically including a null and an alternative hypothesis.'
    ),
});
export type HypothesisGeneratorOutput = z.infer<
  typeof HypothesisGeneratorOutputSchema
>;

export async function generateHypotheses(
  input: HypothesisGeneratorInput
): Promise<HypothesisGeneratorOutput> {
  return hypothesisGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'hypothesisGeneratorPrompt',
  input: {schema: HypothesisGeneratorInputSchema},
  output: {schema: HypothesisGeneratorOutputSchema},
  prompt: `Anda adalah seorang metodolog penelitian senior yang sangat berpengalaman dalam merumuskan hipotesis untuk penelitian kuantitatif.
Berdasarkan topik penelitian yang diberikan, buatlah sepasang hipotesis yang jelas, spesifik, dan dapat diuji.

Topik Penelitian:
{{{researchTopic}}}

Buatlah dua hipotesis utama:
1.  **Hipotesis Alternatif (H1):** Pernyataan yang menunjukkan adanya hubungan, pengaruh, atau perbedaan antara variabel yang diteliti. Ini adalah hipotesis yang ingin dibuktikan oleh peneliti.
2.  **Hipotesis Nol (H0):** Pernyataan yang menunjukkan tidak adanya hubungan, pengaruh, atau perbedaan antara variabel. Ini adalah hipotesis yang akan diuji secara statistik.

Untuk setiap hipotesis yang Anda buat, berikan:
1.  **Hipotesis:** Teks lengkap dari hipotesis.
2.  **Tipe:** Klasifikasikan sebagai "Hipotesis Alternatif (H1)" atau "Hipotesis Nol (H0)".
3.  **Penjelasan:** Jelaskan secara singkat (satu kalimat) logika atau hubungan antar variabel yang terkandung dalam hipotesis tersebut.

Pastikan hipotesis yang dirumuskan operasional dan dapat diukur.`,
});

const hypothesisGeneratorFlow = ai.defineFlow(
  {
    name: 'hypothesisGeneratorFlow',
    inputSchema: HypothesisGeneratorInputSchema,
    outputSchema: HypothesisGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
