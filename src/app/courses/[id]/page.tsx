import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { COURSES } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, User, BarChart, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const course = COURSES.find(c => c.id === params.id);
  if (!course) {
    return {
      title: 'Course Not Found',
    };
  }
  return {
    title: `${course.title} - CyberLearn`,
    description: course.description,
  };
}

export async function generateStaticParams() {
  return COURSES.map(course => ({
    id: course.id,
  }));
}

export default function CourseDetailPage({ params }: Props) {
  const course = COURSES.find(c => c.id === params.id);

  if (!course) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Left column (sticky on desktop) */}
        <div className="md:col-span-1 md:sticky md:top-24 h-fit">
          <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
            <Image
              src={course.image}
              alt={course.title}
              width={600}
              height={400}
              className="w-full object-cover"
              data-ai-hint={course.imageHint}
            />
            <div className="p-6">
              <p className="mb-4 text-4xl font-bold font-headline text-primary">${course.price}</p>
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/dashboard">Enroll Now</Link>
              </Button>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                    <BarChart className="h-5 w-5 text-primary" />
                    <span>Level: {course.category}</span>
                </li>
                <li className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>~20 Hours to complete</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 rounded-xl border bg-card p-6 shadow">
            <h3 className="font-headline text-lg font-semibold">Instructor</h3>
            <div className="mt-4 flex items-center gap-4">
              <Avatar>
                <AvatarImage src={course.instructor.image} alt={course.instructor.name} data-ai-hint={course.instructor.imageHint} />
                <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{course.instructor.name}</p>
                <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{course.instructor.bio}</p>
          </div>
        </div>
        
        {/* Right column */}
        <div className="md:col-span-2">
            <Badge variant="secondary" className="mb-2">{course.category}</Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">{course.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{course.longDescription}</p>

            <div className="mt-10">
                <h2 className="font-headline text-2xl font-semibold border-l-4 border-primary pl-4">What You'll Learn</h2>
                <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {course.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                    <span>{obj}</span>
                    </li>
                ))}
                </ul>
            </div>

            <div className="mt-10">
                <h2 className="font-headline text-2xl font-semibold border-l-4 border-primary pl-4">Course Curriculum</h2>
                <Accordion type="single" collapsible className="mt-4 w-full">
                {course.curriculum.map((item, i) => (
                    <AccordionItem value={`item-${i}`} key={i}>
                    <AccordionTrigger className="text-left font-medium hover:no-underline">{item.title}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                        {item.content}
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </div>
        </div>
      </div>
    </div>
  );
}
