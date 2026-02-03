'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { COURSES } from '@/data/content';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CourseCard } from '@/components/course-card';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { Instructor } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function InstructorProfileSkeleton() {
    return (
        <div className="container py-12 md:py-16">
            <div className="flex flex-col md:flex-row gap-12">
                <aside className="md:w-1/3 lg:w-1/4">
                    <div className="md:sticky md:top-24 h-fit">
                        <div className="bg-card border rounded-xl p-6 shadow-lg text-center">
                            <Skeleton className="h-32 w-32 mx-auto rounded-full border-4 border-primary" />
                            <Skeleton className="h-8 w-48 mt-4 mx-auto" />
                            <Skeleton className="h-5 w-32 mt-2 mx-auto" />
                            <div className="mt-4 space-y-2 text-left">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                    </div>
                </aside>
                <main className="md:w-2/3 lg:w-3/4">
                    <Skeleton className="h-9 w-64" />
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Skeleton className="h-96 rounded-lg" />
                        <Skeleton className="h-96 rounded-lg" />
                    </div>
                </main>
            </div>
        </div>
    );
}


export default function InstructorProfilePage() {
  const params = useParams<{ id: string }>();
  const firestore = useFirestore();

  const instructorDocRef = useMemoFirebase(
    () => (firestore && params.id ? doc(firestore, 'instructors', params.id as string) : null),
    [firestore, params.id]
  );
  const { data: instructor, isLoading: isInstructorLoading } = useDoc<Instructor>(instructorDocRef);

  if (isInstructorLoading) {
    return <InstructorProfileSkeleton />;
  }

  if (!instructor) {
    notFound();
  }

  // NOTE: This still uses static course data. Migrating courses to Firestore is a separate task.
  const instructorCourses = COURSES.filter(course => course.instructor.id === instructor.id);

  return (
    <div className="container py-12 md:py-16">
       {typeof document !== 'undefined' && (
        <title>{`${instructor.firstName} ${instructor.lastName} - Instructor Profile`}</title>
      )}
      <div className="flex flex-col md:flex-row gap-12">
        <aside className="md:w-1/3 lg:w-1/4">
             <div className="md:sticky md:top-24 h-fit">
                <div className="bg-card border rounded-xl p-6 shadow-lg text-center">
                    <Avatar className="h-32 w-32 mx-auto border-4 border-primary">
                        <AvatarImage src={instructor.photoURL} alt={`${instructor.firstName} ${instructor.lastName}`} />
                        <AvatarFallback className="text-4xl">{`${instructor.firstName.charAt(0)}${instructor.lastName.charAt(0)}`}</AvatarFallback>
                    </Avatar>
                    <h1 className="font-headline text-3xl font-bold mt-4">{instructor.firstName} {instructor.lastName}</h1>
                    <p className="text-primary mt-1 font-semibold">{instructor.title}</p>
                    <p className="mt-4 text-sm text-muted-foreground text-left">{instructor.bio}</p>
                </div>
            </div>
        </aside>

        <main className="md:w-2/3 lg:w-3/4">
            <h2 className="font-headline text-3xl font-semibold border-l-4 border-primary pl-4">
              Courses by {instructor.firstName}
            </h2>
            {instructorCourses.length > 0 ? (
                 <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {instructorCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <div className="mt-8 bg-card border rounded-lg p-8 text-center text-muted-foreground">
                    <p>{instructor.firstName} doesn't have any courses published yet.</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
}
