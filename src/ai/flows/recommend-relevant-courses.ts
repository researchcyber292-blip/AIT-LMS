'use server';

/**
 * @fileOverview An AI agent that recommends relevant courses to a learner based on their interests and career goals.
 *
 * - recommendRelevantCourses - A function that recommends relevant courses.
 * - RecommendRelevantCoursesInput - The input type for the recommendRelevantCourses function.
 * - RecommendRelevantCoursesOutput - The return type for the recommendRelevantCourses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendRelevantCoursesInputSchema = z.object({
  interests: z.string().describe('The interests of the learner.'),
  careerGoals: z.string().describe('The career goals of the learner.'),
  courseCatalog: z.string().describe('A description of the available courses.'),
});
export type RecommendRelevantCoursesInput = z.infer<typeof RecommendRelevantCoursesInputSchema>;

const RecommendRelevantCoursesOutputSchema = z.object({
  recommendedCourses: z
    .array(z.string())
    .describe('The names of the courses recommended to the learner.'),
});
export type RecommendRelevantCoursesOutput = z.infer<typeof RecommendRelevantCoursesOutputSchema>;

export async function recommendRelevantCourses(
  input: RecommendRelevantCoursesInput
): Promise<RecommendRelevantCoursesOutput> {
  return recommendRelevantCoursesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendRelevantCoursesPrompt',
  input: {schema: RecommendRelevantCoursesInputSchema},
  output: {schema: RecommendRelevantCoursesOutputSchema},
  prompt: `You are an expert career counselor specializing in helping learners find the best courses to achieve their goals.

You will use the learner's interests and career goals, and the course catalog, to recommend courses to the learner.

Learner Interests: {{{interests}}}
Learner Career Goals: {{{careerGoals}}}
Course Catalog: {{{courseCatalog}}}

Based on this information, recommend courses to the learner that are a good fit.  Just respond with the names of the courses. Do not provide any explanations.
`,
});

const recommendRelevantCoursesFlow = ai.defineFlow(
  {
    name: 'recommendRelevantCoursesFlow',
    inputSchema: RecommendRelevantCoursesInputSchema,
    outputSchema: RecommendRelevantCoursesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
