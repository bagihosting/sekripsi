'use server';

/**
 * @fileOverview AI agent for generating short stories.
 *
 * - generateStory - A function that handles the story generation process.
 * - StoryGeneratorInput - The input type for the generateStory function.
 * - StoryGeneratorOutput - The return type for the generateStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const StoryGeneratorInputSchema = z.object({
  prompt: z.string().describe('The prompt or idea for the story.'),
});
export type StoryGeneratorInput = z.infer<typeof StoryGeneratorInputSchema>;

const StoryGeneratorOutputSchema = z.object({
  story: z.string().describe('The generated short story.'),
});
export type StoryGeneratorOutput = z.infer<typeof StoryGeneratorOutputSchema>;

export async function generateStory(input: StoryGeneratorInput): Promise<StoryGeneratorOutput> {
  return storyGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'storyGeneratorPrompt',
  input: {schema: StoryGeneratorInputSchema},
  output: {schema: StoryGeneratorOutputSchema},
  prompt: `Anda adalah seorang penulis cerita pendek yang kreatif.
Berdasarkan prompt yang diberikan, tulis sebuah cerita pendek yang menarik dan imajinatif.

Prompt: {{{prompt}}}

Pastikan cerita memiliki awal, tengah, dan akhir yang jelas. Gunakan bahasa yang deskriptif untuk menghidupkan cerita.`,
});

const storyGeneratorFlow = ai.defineFlow(
  {
    name: 'storyGeneratorFlow',
    inputSchema: StoryGeneratorInputSchema,
    outputSchema: StoryGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
