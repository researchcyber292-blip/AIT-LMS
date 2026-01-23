import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/course-card';
import { RecommendationClient } from '@/components/recommendation-client';
import { COURSES } from '@/data/content';
import { ArrowRight, BookOpen, Shield, Users } from 'lucide-react';

export default function Home() {
  const featuredCourses = COURSES.slice(0, 3);

  const stats = [
    { icon: BookOpen, value: '10+', label: 'Expert-led Courses' },
    { icon: Users, value: '5,000+', label: 'Students Enrolled' },
    { icon: Shield, value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="container pt-16 text-center md:pt-24">
        <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
          Master Cybersecurity.
          <br />
          <span className="text-primary">Defend the Future.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Join CyberLearn to gain hands-on skills in ethical hacking, network defense, and more. Learn from industry experts and launch your career in cybersecurity.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/courses">Explore Courses</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/about">About Us</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container">
        <div className="grid grid-cols-1 gap-8 rounded-xl border bg-card p-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center gap-2 text-center">
              <stat.icon className="h-8 w-8 text-primary" />
              <p className="font-headline text-3xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="container">
        <div className="flex flex-col items-center text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">Featured Courses</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
                Get started with our most popular courses, designed for aspiring cyber professionals.
            </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        <div className="mt-10 text-center">
            <Button asChild variant="link" className="text-primary">
                <Link href="/courses">
                    View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      </section>
      
      {/* AI Recommendation Section */}
      <section className="container">
        <RecommendationClient courses={COURSES} />
      </section>

      <div className="pb-16 md:pb-24"></div>
    </div>
  );
}
