import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import { COURSES } from '@/data/content';
import { Lock, Shield, CheckCircle, Search, ShieldCheck, BookOpen, User, Star, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Home() {
  const featuredCourses = COURSES.slice(0, 4);

  const expertiseItems = [
    { icon: Award, text: 'BEST-IN-CLASS-LMS' },
    { icon: User, text: 'EXPERT FACULTY' },
    { icon: Star, text: 'CERTIFICATION & PLACEMENT' },
    { icon: BookOpen, text: 'FLEXIBLE ONLINE & OFFLINE' },
  ];

  const infoBoxes = [
    { icon: Shield, text: 'THREAT DETECTION' },
    { icon: Search, text: 'THREAT MITIGATION' },
    { icon: CheckCircle, text: 'DATA TERMINEX' },
    { icon: ShieldCheck, text: 'DATA PRIVACY' },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 container">
      {/* Hero Section */}
      <section className="pt-16 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="text-center md:text-left">
            <p className="font-headline text-lg text-primary">AVIRAJ INFO TECH</p>
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mt-2">
              CYBER SECURITY PROGRAM
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Safeguarding the Future of Digital
            </p>
            <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 rounded-full">
              <Link href="/courses">EXPLORE PROGRAMS</Link>
            </Button>
          </div>
          <div className="flex items-center justify-center">
             <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 border-2 border-primary/40 rounded-full animate-pulse delay-200"></div>
              <div className="absolute inset-8 border-t-2 border-primary rounded-full animate-spin-slow"></div>
              <div className="absolute inset-12 bg-background/50 rounded-full flex items-center justify-center">
                 <Lock className="w-24 h-24 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Boxes Section */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {infoBoxes.map((box, index) => (
            <div key={index} className="flex flex-col items-center justify-center gap-3 p-4 border border-border/50 rounded-lg bg-card/50 text-center">
              <box.icon className="w-8 h-8 text-primary" />
              <span className="font-headline text-sm font-semibold">{box.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Our Expertise Section */}
      <section>
        <h2 className="font-headline text-3xl font-bold text-center mb-12">OUR EXPERTISE</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <Card className="p-6 space-y-4 bg-card border-none">
              {expertiseItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                  <span className="font-semibold text-sm">{item.text}</span>
                </div>
              ))}
            </Card>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredCourses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      <div className="pb-16 md:pb-24"></div>
    </div>
  );
}
