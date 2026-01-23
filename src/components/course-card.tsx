import Link from 'next/link';
import Image from 'next/image';
import type { Course } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/courses/${course.id}`} className="block">
          <Image
            src={course.image}
            alt={course.title}
            width={600}
            height={400}
            className="aspect-[3/2] w-full object-cover"
            data-ai-hint={course.imageHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="mb-2 flex items-center justify-between">
          <Badge variant={course.category === 'Beginner' ? 'secondary' : 'default'} className="bg-accent text-accent-foreground">{course.category}</Badge>
          <p className="font-headline text-lg font-bold text-primary">${course.price}</p>
        </div>
        <CardTitle className="mb-2 font-headline text-xl">
          <Link href={`/courses/${course.id}`}>{course.title}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {course.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="outline" className="w-full">
            <Link href={`/courses/${course.id}`}>
                View Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
