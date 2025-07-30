
'use server';

/**
 * @fileOverview AI agent for simulating a thesis defense.
 *
 * - simulateDefense - A function that handles the defense simulation process.
 * - DefenseSimulatorInput - The input type for the simulateDefense function.
 * - DefenseSimulatorOutput - The return type for the simulateDefense function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DefenseSimulatorInputSchema = z.object({
  summary: z.string().describe('The abstract or summary of the thesis.'),
});
export type DefenseSimulatorInput = z.infer<typeof DefenseSimulatorInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('A potential question from an examiner.'),
  focusArea: z.string().describe('The area this question focuses on (e.g., "Metodologi", "Latar Belakang", "Hasil", "Kontribusi").'),
});

const DefenseSimulatorOutputSchema = z.object({
  questions: z
    .array(QuestionSchema)
    .describe('A list of 5-7 critical questions an examiner might ask during the thesis defense.'),
});
export type DefenseSimulatorOutput = z.infer<typeof DefenseSimulatorOutputSchema>;

export async function simulateDefense(input: DefenseSimulatorInput): Promise<DefenseSimulatorOutput> {
  return defenseSimulatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'defenseSimulatorPrompt',
  input: {schema: DefenseSimulatorInputSchema},
  output: {schema: DefenseSimulatorOutputSchema},
  prompt: `Anda adalah seorang dosen penguji senior yang sangat kritis dan berpengalaman dalam menguji skripsi mahasiswa.
Tugas Anda adalah membaca ringkasan atau abstrak skripsi yang diberikan, lalu merumuskan 5 hingga 7 pertanyaan tajam dan mendalam yang akan menguji pemahaman mahasiswa secara menyeluruh.

Ringkasan Skripsi:
{{{summary}}}

Buatlah pertanyaan yang mencakup berbagai aspek penelitian, seperti:
- **Latar Belakang & Rumusan Masalah:** Mengapa penelitian ini penting? Apa yang mendasari masalah ini?
- **Metodologi:** Mengapa memilih metode ini? Apa kelemahan metode ini? Bagaimana validitas data dipastikan?
- **Hasil & Pembahasan:** Apa temuan paling signifikan? Bagaimana Anda menginterpretasikan hasil X? Apa implikasi praktis dari temuan Anda?
- **Kontribusi & Keaslian:** Apa kontribusi utama penelitian Anda terhadap bidang ini? Apa yang membedakan penelitian Anda dari penelitian sebelumnya?
- **Batasan & Saran:** Apa batasan dari penelitian Anda dan bagaimana saran untuk penelitian selanjutnya?

Untuk setiap pertanyaan, tentukan area fokusnya (misalnya, "Metodologi", "Hasil", dll.). Pertanyaan harus menantang dan mendorong mahasiswa untuk berpikir kritis.`,
});

const defenseSimulatorFlow = ai.defineFlow(
  {
    name: 'defenseSimulatorFlow',
    inputSchema: DefenseSimulatorInputSchema,
    outputSchema: DefenseSimulatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
