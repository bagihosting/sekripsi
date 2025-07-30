
'use server';

/**
 * @fileOverview AI agent for paraphrasing text.
 *
 * - paraphraseText - A function that handles the paraphrasing process.
 * - ParaphraseTextInput - The input type for the paraphraseText function.
 * - ParaphraseTextOutput - The return type for the paraphraseText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ParaphraseTextInputSchema = z.object({
  text: z.string().describe('The text to be paraphrased.'),
});
export type ParaphraseTextInput = z.infer<typeof ParaphraseTextInputSchema>;

const ParaphraseTextOutputSchema = z.object({
  paraphrasedOptions: z
    .array(
      z.object({
        option: z.string().describe('A single paraphrased version of the original text.'),
        focus: z.string().describe('The focus of this version (e.g., "Formal", "Sederhana", "Kreatif").'),
      })
    )
    .describe('A list of paraphrased versions of the text, each with a different focus.'),
});
export type ParaphraseTextOutput = z.infer<typeof ParaphraseTextOutputSchema>;

export async function paraphraseText(input: ParaphraseTextInput): Promise<ParaphraseTextOutput> {
  return paraphraseTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'paraphraseTextPrompt',
  input: {schema: ParaphraseTextInputSchema},
  output: {schema: ParaphraseTextOutputSchema},
  prompt: `Anda adalah seorang ahli parafrase untuk karya tulis ilmiah. Tugas Anda adalah menulis ulang teks yang diberikan tanpa mengubah maknanya.

Teks Asli:
{{{text}}}

Buatlah 3 (tiga) versi parafrase dari teks di atas dengan fokus yang berbeda:
1.  **Formal:** Gunakan bahasa yang lebih formal dan akademis.
2.  **Sederhana:** Gunakan kalimat yang lebih sederhana dan mudah dipahami.
3.  **Kreatif:** Tulis ulang dengan struktur kalimat yang sama sekali baru namun tetap menjaga esensi informasi.

Pastikan setiap versi unik dan berkualitas tinggi.`,
});

const paraphraseTextFlow = ai.defineFlow(
  {
    name: 'paraphraseTextFlow',
    inputSchema: ParaphraseTextInputSchema,
    outputSchema: ParaphraseTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
