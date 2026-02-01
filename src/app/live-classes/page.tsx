
import { CourseCard } from '@/components/course-card';
import { COURSES } from '@/data/content';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Live Classes - Aviraj Info Tech',
    description: 'Join live, interactive classes taught by industry experts.',
};

export default function LiveClassesPage() {
    return (
        <div className="container py-12 md:py-16">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="font-headline text-4xl font-bold">Live Classes</h1>
                <p className="mt-4 text-muted-foreground">
                    Join live, interactive classes taught by our expert instructors. Select a course to see if a session is active.
                </p>
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {COURSES.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}
