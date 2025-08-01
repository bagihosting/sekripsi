import { config } from 'dotenv';
config();

import '@/ai/flows/title-generator.ts';
import '@/ai/flows/question-generator.ts';
import '@/ai/flows/hypothesis-generator.ts';
import '@/ai/flows/outline-generator.ts';
import '@/ai/flows/reference-finder.ts';
import '@/ai/flows/paraphrase-flow.ts';
import '@/ai/flows/grammar-checker.ts';
import '@/ai/flows/argument-checker.ts';
import '@/ai/flows/defense-simulator.ts';
import '@/ai/flows/story-generator.ts';
import '@/ai/flows/spss-guide.ts';
import '@/ai/flows/abstract-generator.ts';
import '@/ai/flows/draft-generator.ts';
