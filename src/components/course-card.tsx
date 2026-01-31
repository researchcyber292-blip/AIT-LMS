import Link from 'next/link';
import Image from 'next/image';
import type { Course } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 bg-card border-border group">
      <CardHeader className="p-0 overflow-hidden">
        <Link href={`/courses/${course.id}`} className="block">
          <Image
            src={course.image}
            alt={course.title}
            width={600}
            height={400}
            className="aspect-[3/2] w-full object-cover group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={course.imageHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-4">
        <CardTitle className="mb-2 font-headline text-lg text-primary">
          <Link href={`/courses/${course.id}`}>{course.title}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground flex-1">
          {course.description}
        </p>
         <div className="mt-4 flex items-center">
            <p className="text-xl font-bold text-foreground">₹{course.price}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
            <Link href={`/courses/${course.id}`}>
                View Course <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
