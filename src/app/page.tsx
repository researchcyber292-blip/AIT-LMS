'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, BrainCircuit, Users, Star, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CourseCard } from '@/components/course-card';
import type { Course } from '@/lib/types';


// Mock data for featured courses for a stable and fast-loading homepage.
const featuredCourses: Partial<Course>[] = [
  {
    id: 'clps3x2y8000008l8h4g2f7c6',
    title: 'Advanced Penetration Testing',
    description: 'Master the art of ethical hacking and find vulnerabilities before the bad guys do.',
    price: 4999,
    image: 'https://images.unsplash.com/photo-1631624220291-8f191fbdb543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxoYWNrZXIlMjBjb2RlfGVufDB8fHx8MTc2OTA5Njc3OHww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'hacker code',
    category: 'Advanced'
  },
  {
    id: 'clps4a5b9000108l8g6h3c9e1',
    title: 'Cloud Security Engineering',
    description: 'Secure modern cloud infrastructure in AWS, Azure, and GCP.',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1667984390538-3dea7a3fe33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjbG91ZCUyMGNvbXB1dGluZ3xlbnwwfHx8fDE3NjkxNDI1OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'cloud computing',
    category: 'Intermediate'
  },
  {
    id: 'clps4c7d0000208l8b2k9a3f8',
    title: 'Digital Forensics & Incident Response',
    description: 'Learn to investigate cybercrimes and respond to security breaches effectively.',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8ZGF0YSUyMGFuYWx5c2lzfGVufDB8fHx8MTc2OTE2MjI3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'data analysis',
    category: 'Advanced'
  },
];


const testimonials = [
    {
        quote: "This platform transformed my understanding of cybersecurity. The hands-on labs are incredible!",
        name: "Priya Sharma",
        title: "Cybersecurity Analyst",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFufGVufDB8fHx8MTc3MDEyODkyNnww&ixlib=rb-4.1.0&q=80&w=1080",
        avatarHint: 'portrait woman',
    },
    {
        quote: "The instructors are true experts and the community is so supportive. I landed my dream job after completing the advanced course.",
        name: "Rajesh Kumar",
        title: "Penetration Tester",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbnxlbnwwfHx8fDE3NzAxMjg5MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        avatarHint: 'portrait man',
    },
    {
        quote: "I started with zero knowledge and now I feel confident in my skills. The beginner-friendly approach made all the difference.",
        name: "Anjali Menon",
        title: "Junior SOC Analyst",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwb3J0cmFpdCUyMHdvbWFufGVufDB8fHx8MTc3MDEyODkyNnww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: 'portrait woman smiling',
    },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section 
          className="relative bg-cover bg-center" 
          style={{backgroundImage: "url('/homepage.png')"}}
        >
          <div className="absolute inset-0 bg-background/30 backdrop-blur-sm" />
          <div className="container relative px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12 md:py-24">
              <div className="text-center md:text-left">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  Your Gateway to Cybersecurity Mastery
                </h1>
                <p className="mt-6 max-w-xl mx-auto md:mx-0 text-lg text-foreground/80">
                  Master in-demand cybersecurity skills with expert-led courses, hands-on labs, and a vibrant professional community.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <Button asChild size="lg" className="rounded-full px-10 py-6 text-lg">
                    <Link href="/courses">
                      Explore Courses
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="rounded-full px-10 py-6 text-lg">
                    <Link href="/about">Get Started</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-96 md:h-full w-full flex items-center justify-center">
                <div className="relative w-full h-full max-w-lg -translate-x-24 translate-y-12">
                  <Image
                    src="/man_home_page.png"
                    alt="Cybersecurity Professional"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 bg-secondary/50 md:py-24">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Aviraj Info Tech?</h2>
                    <p className="mt-4 text-lg text-muted-foreground">We provide a comprehensive learning ecosystem designed for success.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="text-center p-6 border rounded-lg bg-card">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <UserCheck className="h-6 w-6" />
                        </div>
                        <h3 className="mt-6 font-headline text-lg font-semibold">Expert-Led Curriculum</h3>
                        <p className="mt-2 text-muted-foreground">Courses crafted by industry veterans with decades of real-world offensive and defensive security experience.</p>
                    </div>
                    <div className="text-center p-6 border rounded-lg bg-card">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <h3 className="mt-6 font-headline text-lg font-semibold">Hands-On Virtual Labs</h3>
                        <p className="mt-2 text-muted-foreground">Move beyond theory with practical labs that simulate real-world attacks and defensive scenarios.</p>
                    </div>
                    <div className="text-center p-6 border rounded-lg bg-card">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <h3 className="mt-6 font-headline text-lg font-semibold">Career-Focused Learning</h3>
                        <p className="mt-2 text-muted-foreground">Gain certifications and build a portfolio that stands out to employers in the cybersecurity industry.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Featured Courses Section */}
        <section className="py-16 bg-background md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Explore Our Featured Courses</h2>
              <p className="mt-4 text-lg text-muted-foreground">Kickstart your learning journey with our most popular courses.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course as Course} />
              ))}
            </div>
             <div className="mt-12 text-center">
                 <Button asChild size="lg" variant="outline">
                    <Link href="/courses">
                        View All Courses
                    </Link>
                 </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-secondary/50 md:py-24">
            <div className="container mx-auto px-4">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Trusted by Aspiring Professionals</h2>
                    <p className="mt-4 text-lg text-muted-foreground">Hear what our students have to say about their learning experience.</p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, i) => (
                        <Card key={i} className="flex flex-col bg-card">
                            <CardContent className="pt-6 flex-grow">
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                                <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                            </CardContent>
                            <CardFooter className="flex items-center gap-4 bg-muted/50">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{testimonial.name}</p>
                                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="relative overflow-hidden rounded-2xl bg-secondary px-6 py-20 text-center shadow-inner-lg sm:px-16 border">
                    <div className="relative">
                        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Ready to Start Learning?</h2>
                        <p className="mt-4 text-lg text-muted-foreground">Join thousands of learners and take the next step in your cybersecurity career.</p>
                        <Button asChild size="lg" className="mt-8 rounded-full px-10 py-6 text-lg">
                            <Link href="/about">Sign Up Now</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
