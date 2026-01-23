'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { recommendRelevantCourses } from '@/ai/flows/recommend-relevant-courses';
import type { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  interests: z.string().min(10, 'Please tell us a bit more about your interests.'),
  careerGoals: z.string().min(10, 'Please tell us a bit more about your career goals.'),
});

interface RecommendationClientProps {
  courses: Course[];
}

export function RecommendationClient({ courses }: RecommendationClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interests: '',
      careerGoals: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations([]);

    const courseCatalog = courses.map(c => `- ${c.title}: ${c.description}`).join('\n');

    try {
      const result = await recommendRelevantCourses({
        ...values,
        courseCatalog,
      });
      setRecommendations(result.recommendedCourses);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Here you could use a toast to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Find Your Perfect Course
        </CardTitle>
        <CardDescription>
          Let our AI guide you to the courses that best match your ambitions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Interests</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., 'I'm fascinated by how hackers find vulnerabilities and I enjoy solving complex puzzles. I'm also interested in cloud computing and automation.'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="careerGoals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Career Goals</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., 'I want to become a penetration tester or a security analyst. My long-term goal is to lead a security team at a tech company.'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="bg-accent hover:bg-accent/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Get Recommendations'
              )}
            </Button>
          </form>
        </Form>
        {(isLoading || recommendations.length > 0) && (
          <div className="mt-6">
            <h3 className="font-headline text-lg mb-2">Recommended For You:</h3>
            {isLoading && <p className="text-muted-foreground">Generating recommendations...</p>}
            {recommendations.length > 0 && (
              <ul className="list-disc pl-5 space-y-1">
                {recommendations.map((rec, index) => {
                  const matchedCourse = courses.find(c => c.title.toLowerCase() === rec.toLowerCase());
                  if (matchedCourse) {
                    return (
                        <li key={index}>
                            <Link href={`/courses/${matchedCourse.id}`} className="text-primary hover:underline font-medium">
                                {matchedCourse.title}
                            </Link>
                        </li>
                    )
                  }
                  return <li key={index}>{rec}</li>;
                })}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
