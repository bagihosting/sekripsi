
'use server';

/**
 * @fileOverview AI agent for checking grammar and style.
 *
 * - checkGrammar - A function that handles the grammar checking process.
 * - GrammarCheckInput - The input type for the checkGrammar function.
 * - GrammarCheckOutput - The return type for the checkGrammar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GrammarCheckInputSchema = z.object({
  text: z.string().describe('The text to be checked and corrected.'),
});
export type GrammarCheckInput = z.infer<typeof GrammarCheckInputSchema>;

const CorrectionSchema = z.object({
  original: z.string().describe('The original phrase with an error.'),
  corrected: z.string().describe('The corrected version of the phrase.'),
  reason: z.string().describe('A brief explanation of the correction (e.g., "Kesalahan Ejaan", "Tata Bahasa", "Gaya Penulisan").'),
});

const GrammarCheckOutputSchema = z.object({
  correctedText: z.string().describe('The full text after all corrections have been applied.'),
  corrections: z.array(CorrectionSchema).describe('A list of specific corrections made to the text.'),
});
export type GrammarCheckOutput = z.infer<typeof GrammarCheckOutputSchema>;

export async function checkGrammar(input: GrammarCheckInput): Promise<GrammarCheckOutput> {
  return grammarCheckFlow(input);
}

const prompt = ai.definePrompt({
  name: 'grammarCheckPrompt',
  input: {schema: GrammarCheckInputSchema},
  output: {schema: GrammarCheckOutputSchema},
  prompt: `Anda adalah seorang editor ahli untuk tulisan akademis berbahasa Indonesia. Tugas Anda adalah memeriksa teks yang diberikan, mengidentifikasi kesalahan, dan memperbaikinya.

Fokus pada tiga area:
1.  **Kesalahan Ejaan (Typo):** Perbaiki setiap salah ketik.
2.  **Kesalahan Tata Bahasa (Grammar):** Perbaiki struktur kalimat, penggunaan tanda baca, dan aturan tata bahasa lainnya.
3.  **Gaya Penulisan (Style):** Ganti kata atau frasa yang kurang formal dengan alternatif yang lebih akademis dan profesional.

Teks Asli:
{{{text}}}

Analisis teks tersebut dan berikan:
1.  Versi teks lengkap yang sudah diperbaiki sepenuhnya.
2.  Daftar terperinci dari setiap perubahan yang Anda buat, jelaskan apa yang salah, bagaimana Anda memperbaikinya, dan alasan perbaikannya. Kelompokkan alasan ke dalam "Kesalahan Ejaan", "Tata Bahasa", atau "Gaya Penulisan".`,
});

const grammarCheckFlow = ai.defineFlow(
  {
    name: 'grammarCheckFlow',
    inputSchema: GrammarCheckInputSchema,
    outputSchema: GrammarCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
