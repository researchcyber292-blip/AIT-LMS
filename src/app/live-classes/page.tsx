
'use client';

import { CourseCard } from '@/components/course-card';
import { COURSES } from '@/data/content';
import { Video } from 'lucide-react';

export default function LiveClassesPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <Video className="h-8 w-8" />
        </div>
        <h1 className="font-headline text-4xl font-bold">Course Catalog & Live Streams</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Browse our courses to join a live stream or start your learning journey. Live sessions will be indicated on the course page when active.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
