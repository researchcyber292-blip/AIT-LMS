import { CourseCard } from '@/components/course-card';
import { COURSES } from '@/data/content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Courses - CyberLearn',
  description: 'Browse our full catalog of expert-led cybersecurity courses.',
};

export default function CoursesPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold">Our Course Catalog</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Find the perfect course to advance your skills, from beginner introductions to advanced, specialized topics in cybersecurity.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {COURSES.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
