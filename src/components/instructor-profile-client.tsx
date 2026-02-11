'use client';

import { notFound, useParams } from 'next/navigation';
import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CourseCard } from '@/components/course-card';
import { useDoc, useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { Instructor, Course } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Cloud, BookOpen } from 'lucide-react';

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


export default function InstructorProfileClient() {
  const params = useParams<{ id: string }>();
  const firestore = useFirestore();

  const instructorDocRef = useMemoFirebase(
    () => (firestore && params.id ? doc(firestore, 'instructors', params.id as string) : null),
    [firestore, params.id]
  );
  const { data: instructor, isLoading: isInstructorLoading } = useDoc<Instructor>(instructorDocRef);
  
  const coursesCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, "courses");
  }, [firestore]);

  const { data: allCourses, isLoading: areCoursesLoading } = useCollection<Course>(coursesCollectionRef);

  const instructorCourses = useMemo(() => {
    if (!allCourses || !params.id) return [];
    return allCourses
      .filter(course => course.instructorId === params.id)
      .map(course => ({
        ...course,
        instructor: {
          name: `${instructor?.firstName || ''} ${instructor?.lastName || ''}`,
          avatar: instructor?.photoURL
        }
      }));
  }, [allCourses, params.id, instructor]);


  const isLoading = isInstructorLoading || areCoursesLoading;

  if (isLoading) {
    return <InstructorProfileSkeleton />;
  }

  if (!instructor) {
    notFound();
  }

  const isProfileIncomplete = !instructor.title || !instructor.bio || !instructor.photoURL;

  if (isProfileIncomplete) {
    return (
      <div className="container py-24 text-center">
        <Cloud className="mx-auto h-24 w-24 text-muted-foreground/50" />
        <h1 className="mt-8 font-headline text-3xl font-bold">
          Profile Coming Soon
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          {instructor.firstName} {instructor.lastName} hasn't set up their public portfolio yet. 
          Their detailed biography and course list will appear here once they're ready.
        </p>
      </div>
    );
  }

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
            {instructorCourses && instructorCourses.length > 0 ? (
                 <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {instructorCourses.map(course => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ) : (
                <div className="mt-8 bg-card border rounded-lg p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[200px]">
                    <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                    <p className="mt-4 font-semibold">{instructor.firstName} doesn't have any courses published yet.</p>
                    <p className="text-sm">Check back soon!</p>
                </div>
            )}
        </main>
      </div>
    </div>
  );
}
