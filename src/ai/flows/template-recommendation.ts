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
    .describe('A description of the project for which a template is needed.'),
});
export type RecommendTemplatesInput = z.infer<typeof RecommendTemplatesInputSchema>;

const RecommendTemplatesOutputSchema = z.object({
  templateRecommendations: z
    .array(z.string())
    .describe('A list of template recommendations based on the project description.'),
});
export type RecommendTemplatesOutput = z.infer<typeof RecommendTemplatesOutputSchema>;

export async function recommendTemplates(input: RecommendTemplatesInput): Promise<RecommendTemplatesOutput> {
  return recommendTemplatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTemplatesPrompt',
  input: {schema: RecommendTemplatesInputSchema},
  output: {schema: RecommendTemplatesOutputSchema},
  prompt: `You are an expert in recommending website templates based on project descriptions.

  Based on the following project description, recommend a list of website templates that would be suitable.
  Project Description: {{{projectDescription}}}
  
  Return a list of template names.`,
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
