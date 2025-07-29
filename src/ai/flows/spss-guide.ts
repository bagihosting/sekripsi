'use server';

/**
 * @fileOverview AI agent for providing SPSS data analysis guidance.
 *
 * - guideSpssAnalysis - A function that handles the SPSS guidance process.
 * - SpssGuideInput - The input type for the guideSpssAnalysis function.
 * - SpssGuideOutput - The return type for the guideSpssAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpssGuideInputSchema = z.object({
  problemDescription: z.string().describe('A description of the research problem or the data analysis needed.'),
});
export type SpssGuideInput = z.infer<typeof SpssGuideInputSchema>;

const SpssStepSchema = z.object({
    stepNumber: z.number().describe("The step number in the process."),
    stepTitle: z.string().describe("The title of the step (e.g., 'Choosing the Right Test', 'Running the Analysis')."),
    stepInstruction: z.string().describe("The detailed instruction for this step."),
});

const SpssGuideOutputSchema = z.object({
  recommendedTest: z.string().describe('The statistical test recommended for the analysis (e.g., "Independent Samples T-Test", "Pearson Correlation").'),
  testRationale: z.string().describe('A brief rationale for why the recommended test is appropriate.'),
  analysisSteps: z.array(SpssStepSchema).describe('A list of step-by-step instructions to perform the analysis in SPSS.'),
  interpretationGuide: z.string().describe('A guide on how to interpret the key results from the SPSS output.'),
});
export type SpssGuideOutput = z.infer<typeof SpssGuideOutputSchema>;

export async function guideSpssAnalysis(input: SpssGuideInput): Promise<SpssGuideOutput> {
  return spssGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spssGuidePrompt',
  input: {schema: SpssGuideInputSchema},
  output: {schema: SpssGuideOutputSchema},
  prompt: `Anda adalah seorang ahli statistik dan metodolog penelitian yang sangat berpengalaman menggunakan SPSS.
Tugas Anda adalah memberikan panduan lengkap kepada mahasiswa untuk melakukan analisis data menggunakan SPSS berdasarkan deskripsi masalah yang mereka berikan.

Deskripsi Masalah Penelitian:
{{{problemDescription}}}

Berdasarkan deskripsi tersebut, berikan panduan yang jelas dan terstruktur:
1.  **Rekomendasikan Uji Statistik:** Tentukan uji statistik yang paling tepat di SPSS untuk menjawab masalah penelitian tersebut.
2.  **Berikan Alasan:** Jelaskan secara singkat mengapa uji tersebut adalah pilihan yang tepat.
3.  **Langkah-langkah Analisis:** Sediakan panduan langkah-demi-langkah (step-by-step) yang praktis tentang cara melakukan uji tersebut di SPSS. Mulai dari menu apa yang harus diklik, variabel mana yang harus dimasukkan ke kolom mana, hingga opsi apa yang harus dipilih.
4.  **Panduan Interpretasi:** Jelaskan cara membaca dan menginterpretasikan tabel output utama dari SPSS untuk uji tersebut. Fokus pada nilai-nilai kunci seperti 'Sig.' (p-value), nilai t, F, atau r, dan bagaimana cara mengambil kesimpulan berdasarkan nilai tersebut.

Pastikan bahasa yang Anda gunakan mudah dipahami oleh mahasiswa yang mungkin belum terlalu akrab dengan statistik.`,
});

const spssGuideFlow = ai.defineFlow(
  {
    name: 'spssGuideFlow',
    inputSchema: SpssGuideInputSchema,
    outputSchema: SpssGuideOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
