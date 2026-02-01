
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Video, Mic } from 'lucide-react';
import { COURSES } from '@/data/content';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { Enrollment, Instructor } from '@/lib/types';
import Loading from '@/app/loading';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  // Check if the user is an instructor
  const instructorDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'instructors', user.uid);
  }, [firestore, user]);
  const { data: instructor, isLoading: isInstructorLoading } = useDoc<Instructor>(instructorDocRef);

  // Get student enrollments
  const enrollmentsQuery = useMemoFirebase(() => {
    if (!user || instructor) return null; // Don't fetch for instructors
    return collection(firestore, 'users', user.uid, 'enrollments');
  }, [firestore, user, instructor]);

  const { data: enrollments, isLoading: enrollmentsLoading } = useCollection<Enrollment>(enrollmentsQuery);

  const isLoading = isUserLoading || (user && (isInstructorLoading || enrollmentsLoading));

  if (isLoading) {
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

  // Instructor Dashboard
  if (instructor) {
    return (
      <div className="container py-12 md:py-16">
        <div className="mb-10">
          <h1 className="font-headline text-4xl font-bold">Welcome Back, Instructor {instructor.firstName}!</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your courses and start live sessions from your control panel.
          </p>
        </div>
        
        <div className="p-8 border rounded-lg bg-card max-w-2xl mx-auto text-center">
            <h2 className="font-headline text-3xl font-bold flex items-center justify-center gap-3">
                <Mic className="h-8 w-8" />
                Instructor Control Panel
            </h2>
            <p className="mt-4 text-muted-foreground">Start the live session for students. This will open the classroom in a new view.</p>
            <Button asChild size="lg" className="mt-8 px-10 py-7 text-lg">
                <Link href="/live-classroom?room=avirajinfotech-cybersecurity-classlive&courseTitle=Live%20Session&instructor=true">
                    Start Live Stream
                </Link>
            </Button>
        </div>
      </div>
    );
  }

  // Student Dashboard
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
