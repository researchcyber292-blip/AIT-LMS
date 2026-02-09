import { COURSES } from '@/data/content';
import CourseDetailClient from '@/components/course-detail-client';

export function generateStaticParams() {
  return COURSES.map((course) => ({
    id: course.id,
  }));
}

export default function CourseDetailPage() {
    return <CourseDetailClient />;
}
