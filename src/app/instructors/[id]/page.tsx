import { COURSES } from '@/data/content';
import InstructorProfileClient from '@/components/instructor-profile-client';

export function generateStaticParams() {
  const instructorIds = [...new Set(COURSES.map(course => course.instructorId))];
  return instructorIds.map((id) => ({
    id,
  }));
}

export default function InstructorProfilePage() {
    return <InstructorProfileClient />;
}
