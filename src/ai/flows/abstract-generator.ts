'use server';

/**
 * @fileOverview AI agent for generating academic abstracts.
 *
 * - generateAbstract - A function that handles the abstract generation process.
 * - AbstractGeneratorInput - The input type for the generateAbstract function.
 * - AbstractGeneratorOutput - The return type for the generateAbstract function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AbstractGeneratorInputSchema = z.object({
  background: z.string().describe('The background and objectives of the research.'),
  methods: z.string().describe('The methods used in the research.'),
  results: z.string().describe('The key results and findings of the research.'),
  conclusion: z.string().describe('The main conclusion and implications of the research.'),
});
export type AbstractGeneratorInput = z.infer<typeof AbstractGeneratorInputSchema>;

const AbstractGeneratorOutputSchema = z.object({
  abstract: z.string().describe('The generated academic abstract.'),
});
export type AbstractGeneratorOutput = z.infer<typeof AbstractGeneratorOutputSchema>;

export async function generateAbstract(input: AbstractGeneratorInput): Promise<AbstractGeneratorOutput> {
  return abstractGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'abstractGeneratorPrompt',
  input: {schema: AbstractGeneratorInputSchema},
  output: {schema: AbstractGeneratorOutputSchema},
  prompt: `Anda adalah seorang penulis akademik ahli yang bertugas membuat abstrak untuk skripsi, tesis, atau disertasi.
Tugas Anda adalah mensintesis informasi yang diberikan dari setiap bagian penelitian menjadi sebuah abstrak yang padat, jelas, dan komprehensif.

Gunakan poin-poin kunci berikut untuk menyusun abstrak:

1.  **Latar Belakang dan Tujuan:**
    {{{background}}}

2.  **Metode Penelitian:**
    {{{methods}}}

3.  **Hasil Utama:**
    {{{results}}}

4.  **Kesimpulan dan Implikasi:**
    {{{conclusion}}}

Buatlah sebuah paragraf tunggal yang mengalir secara logis. Pastikan abstrak tersebut mencakup semua elemen kunci (tujuan, metode, hasil, kesimpulan) secara ringkas dan profesional. Hindari penggunaan kalimat yang terlalu panjang.
`,
});

const abstractGeneratorFlow = ai.defineFlow(
  {
    name: 'abstractGeneratorFlow',
    inputSchema: AbstractGeneratorInputSchema,
    outputSchema: AbstractGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
