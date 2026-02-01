'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Video } from 'lucide-react';
import { COURSES } from '@/data/content';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Enrollment } from '@/lib/types';
import Loading from '@/app/loading';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const enrollmentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'enrollments');
  }, [firestore, user]);

  const { data: enrollments, isLoading: enrollmentsLoading } = useCollection<Enrollment>(enrollmentsQuery);

  if (isUserLoading || (user && enrollmentsLoading)) {
    return <Loading />;
  }

  const enrolledCourses = (enrollments || [])
    .map(enrollment => {
      const course = COURSES.find(c => c.id === enrollment.courseId);
      if (course) {
        // Just using a placeholder progress for now.
        return { ...course, progress: Math.floor(Math.random() * 80) + 10 };
      }
      return null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-10">
        <h1 className="font-headline text-4xl font-bold">Welcome Back, {user?.displayName || 'Student'}!</h1>
        <p className="mt-2 text-muted-foreground">
          Continue your learning journey and sharpen your cybersecurity skills.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
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

        <section>
          <h2 className="font-headline text-2xl font-semibold mb-4">Featured Videos</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden bg-card/50">
                <div className="aspect-video w-full bg-muted flex items-center justify-center">
                  <Video className="h-12 w-12 text-muted-foreground" />
                </div>
                <CardHeader>
                  <CardTitle className="font-headline text-base h-10">Placeholder Video Title {i+1}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
