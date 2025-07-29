'use server';

/**
 * @fileOverview AI agent for detecting weaknesses in academic arguments.
 *
 * - checkArgument - A function that handles the argument checking process.
 * - ArgumentCheckInput - The input type for the checkArgument function.
 * - ArgumentCheckOutput - The return type for the checkArgument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ArgumentCheckInputSchema = z.object({
  text: z.string().describe('The academic text/argument to be analyzed.'),
});
export type ArgumentCheckInput = z.infer<typeof ArgumentCheckInputSchema>;

const WeaknessSchema = z.object({
  weakness: z
    .string()
    .describe('A summary of the identified weakness in the argument.'),
  quote: z
    .string()
    .describe('The specific sentence or phrase from the text that contains the weakness.'),
  suggestion: z
    .string()
    .describe('A concrete suggestion on how to improve or strengthen this part of the argument.'),
});

const ArgumentCheckOutputSchema = z.object({
  weaknesses: z
    .array(WeaknessSchema)
    .describe('A list of potential logical weaknesses found in the text.'),
});
export type ArgumentCheckOutput = z.infer<typeof ArgumentCheckOutputSchema>;

export async function checkArgument(input: ArgumentCheckInput): Promise<ArgumentCheckOutput> {
  return argumentCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'argumentCheckerPrompt',
  input: {schema: ArgumentCheckInputSchema},
  output: {schema: ArgumentCheckOutputSchema},
  prompt: `Anda adalah seorang ahli logika dan pembimbing akademik yang sangat teliti. Tugas Anda adalah menganalisis teks argumen skripsi atau tesis yang diberikan dan mengidentifikasi kelemahan logisnya.

Teks untuk dianalisis:
{{{text}}}

Fokus pada identifikasi kelemahan umum dalam penulisan ilmiah, seperti:
- **Generalisasi Berlebihan:** Klaim yang terlalu luas tanpa bukti yang cukup.
- **Asumsi Tersembunyi:** Argumen yang bergantung pada asumsi yang tidak dinyatakan atau dibuktikan.
- **Logika Melompat (Non Sequitur):** Kesimpulan yang tidak mengikuti premisnya secara logis.
- **Bukti Tidak Relevan:** Menggunakan data atau bukti yang tidak secara langsung mendukung klaim.
- **Korelasi vs Kausalitas:** Mengasumsikan bahwa karena dua hal terjadi bersamaan, yang satu pasti menyebabkan yang lain.
- **Kurangnya Kritis Terhadap Sumber:** Menerima klaim dari sumber lain tanpa pertanyaan.

Untuk setiap kelemahan yang Anda temukan:
1.  Identifikasi dan rangkum kelemahan tersebut.
2.  Kutip kalimat spesifik dari teks yang menunjukkan kelemahan itu.
3.  Berikan saran konkret tentang cara memperbaikinya.

Jika tidak ada kelemahan yang signifikan, kembalikan array kosong.`,
});

const argumentCheckerFlow = ai.defineFlow(
  {
    name: 'argumentCheckerFlow',
    inputSchema: ArgumentCheckInputSchema,
    outputSchema: ArgumentCheckOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
