
import Link from 'next/link';
import Image from 'next/image';
import type { Course } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Star, Clock, BookOpen, Users } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const StarRating = ({ rating = 0, reviews = 0 }: { rating?: number; reviews?: number }) => {
    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={`star-${i}`} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
            </div>
            <span className="text-xs text-muted-foreground">{reviews}</span>
        </div>
    );
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 bg-card border-border group">
        <div className="relative overflow-hidden rounded-t-lg">
            <Link href={`/courses/${course.id}`} className="block">
              <Image
                src={course.image}
                alt={course.title}
                width={600}
                height={400}
                className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={course.imageHint}
              />
            </Link>
            <Button size="icon" variant="ghost" className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/20 text-white backdrop-blur-sm hover:bg-black/40 hover:text-white">
                <Heart className="h-4 w-4" />
                <span className="sr-only">Favorite</span>
            </Button>
        </div>
      <CardContent className="flex flex-1 flex-col p-4 space-y-4">
        <div className="flex justify-between items-center">
            <StarRating rating={course.rating} reviews={course.reviews} />
            {course.category && <Badge variant="outline">{course.category}</Badge>}
        </div>
        
        <h3 className="font-bold text-base leading-snug flex-1">
          <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">{course.title}</Link>
        </h3>
        
        <div className="flex items-center text-xs text-muted-foreground gap-x-4 gap-y-1 flex-wrap">
            {course.duration && <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5"/><span>{course.duration}</span></div>}
            {course.lessons && <div className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5"/><span>{course.lessons} Lessons</span></div>}
            {course.students && <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5"/><span>{course.students} Students</span></div>}
        </div>
        
        <div className="!mt-auto pt-4 border-t border-border">
            <div className="flex justify-between items-center">
                {course.instructor && (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                            <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                            <AvatarFallback>{course.instructor.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{course.instructor.name}</span>
                    </div>
                )}
                <p className="text-lg font-bold text-primary">₹{course.price}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
