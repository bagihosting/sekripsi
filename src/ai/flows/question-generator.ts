'use server';

/**
 * @fileOverview AI agent for generating research questions.
 *
 * - generateQuestions - A function that handles the research question generation process.
 * - QuestionGeneratorInput - The input type for the generateQuestions function.
 * - QuestionGeneratorOutput - The return type for the generateQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const QuestionGeneratorInputSchema = z.object({
  topic: z.string().describe('The research topic to generate questions for.'),
});
export type QuestionGeneratorInput = z.infer<typeof QuestionGeneratorInputSchema>;

const ResearchQuestionSchema = z.object({
  question: z.string().describe('A specific research question.'),
  type: z
    .string()
    .describe('The type of question (e.g., "Kualitatif", "Kuantitatif").'),
  description: z
    .string()
    .describe('A brief explanation of what this question aims to explore.'),
});

const QuestionGeneratorOutputSchema = z.object({
  questions: z
    .array(ResearchQuestionSchema)
    .describe(
      'A list of 3-5 potential research questions based on the topic.'
    ),
});
export type QuestionGeneratorOutput = z.infer<typeof QuestionGeneratorOutputSchema>;

export async function generateQuestions(input: QuestionGeneratorInput): Promise<QuestionGeneratorOutput> {
  return questionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'questionGeneratorPrompt',
  input: {schema: QuestionGeneratorInputSchema},
  output: {schema: QuestionGeneratorOutputSchema},
  prompt: `Anda adalah seorang metodolog penelitian senior yang ahli dalam merumuskan pertanyaan penelitian (research questions) untuk skripsi dan tesis.
Berdasarkan topik yang diberikan, buatlah 3 hingga 5 pertanyaan penelitian yang tajam, spesifik, dan dapat diteliti.

Topik Penelitian:
{{{topic}}}

Buatlah variasi pertanyaan yang mencakup:
- **Pertanyaan Kuantitatif:** Fokus pada hubungan antar variabel, perbandingan, atau pengaruh (misalnya, "Seberapa besar pengaruh X terhadap Y?").
- **Pertanyaan Kualitatif:** Fokus pada pemahaman mendalam, eksplorasi makna, atau proses (misalnya, "Bagaimana partisipan memaknai pengalaman X?").

Untuk setiap pertanyaan yang Anda buat, berikan:
1.  **Pertanyaan:** Teks lengkap dari pertanyaan penelitian.
2.  **Tipe:** Klasifikasikan sebagai "Kuantitatif" atau "Kualitatif".
3.  **Deskripsi:** Jelaskan secara singkat (satu kalimat) apa yang ingin digali atau dijawab oleh pertanyaan tersebut.

Pastikan pertanyaan yang dirumuskan jelas, fokus, dan relevan dengan topik yang diberikan.`,
});

const questionGeneratorFlow = ai.defineFlow(
  {
    name: 'questionGeneratorFlow',
    inputSchema: QuestionGeneratorInputSchema,
    outputSchema: QuestionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
