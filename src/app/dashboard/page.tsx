import Link from 'next/link';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';
import { COURSES } from '@/data/content';

export const metadata: Metadata = {
  title: 'Dashboard - CyberLearn',
  description: 'Access your courses and track your learning progress.',
};

export default function DashboardPage() {
  const enrolledCourses = [
    { ...COURSES[0], progress: 75 },
    { ...COURSES[2], progress: 20 },
  ];

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-10">
        <h1 className="font-headline text-4xl font-bold">Welcome Back!</h1>
        <p className="mt-2 text-muted-foreground">
          Continue your learning journey and sharpen your cybersecurity skills.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <section>
          <h2 className="font-headline text-2xl font-semibold mb-4">My Courses</h2>
          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map(course => (
                <Card key={course.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="font-headline">{course.title}</CardTitle>
                    <CardDescription>{course.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                        <Progress value={course.progress} aria-label={`${course.progress}% complete`} />
                        <p className="text-sm text-muted-foreground">{course.progress}% complete</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/courses/${course.id}`}>Continue Learning</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30 bg-card p-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-headline text-xl font-semibold">No Courses Yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You haven't enrolled in any courses. Explore our catalog to get started.
              </p>
              <Button asChild className="mt-6">
                <Link href="/courses">Explore Courses</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
