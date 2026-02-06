'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Video, FileText, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Course } from '@/lib/types';
import { CourseCard } from '@/components/course-card';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const featureElements = featuresRef.current?.children;
    if (featureElements) {
        // Set initial state (invisible and shifted down)
        gsap.set(featureElements, { y: 50, opacity: 0 });

        ScrollTrigger.batch(featureElements, {
            start: "top 85%", // When the top of the element hits 85% of the viewport height
            onEnter: batch => gsap.to(batch, {
                opacity: 1, 
                y: 0, 
                stagger: 0.15,
                duration: 0.5,
                ease: 'power3.out',
            }),
            onLeaveBack: batch => gsap.to(batch, {
                opacity: 0,
                y: 50,
                stagger: 0.1,
                duration: 0.3,
                ease: 'power3.in'
            }),
        });
    }
  }, []);

  const dummyCourses: Course[] = [
    {
      id: 'dummy-1',
      title: 'The Complete Coding & Programming Bootcamp',
      description: '',
      longDescription: '',
      price: 13,
      image: 'https://img.freepik.com/free-vector/black-geometric-memphis-social-banner_53876-116843.jpg?semt=ais_hybrid&w=740&q=80',
      imageHint: 'coding programming',
      instructorId: 'dummy-instructor',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Coding/Programming',
      priceType: 'paid',
      duration: '2h',
      liveSessionsEnabled: false,
      resourcesEnabled: false,
      createdAt: null,
      rating: 4,
      reviews: 120,
      lessons: 12,
      students: 1543,
      instructor: {
          name: 'Robert Smith',
          avatar: 'https://picsum.photos/seed/instructor-1/40/40'
      }
    },
    {
      id: 'dummy-2',
      title: 'E-Commerce Development Course for Creating User-Friendly Online Stores',
      description: '',
      longDescription: '',
      price: 25.50,
      image: 'https://img.freepik.com/free-vector/black-geometric-memphis-social-banner_53876-116843.jpg?semt=ais_hybrid&w=740&q=80',
      imageHint: 'e-commerce development',
      instructorId: 'dummy-instructor',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Data Science',
      priceType: 'paid',
      duration: '2h 30m',
      liveSessionsEnabled: false,
      resourcesEnabled: false,
      createdAt: null,
      rating: 4,
      reviews: 98,
      lessons: 15,
      students: 2011,
      instructor: {
          name: 'Maria Garcia',
          avatar: 'https://picsum.photos/seed/instructor-2/40/40'
      }
    },
    {
      id: 'dummy-3',
      title: 'Full Stack Web Development with JavaScript',
      description: '',
      longDescription: '',
      price: 240,
      image: 'https://img.freepik.com/free-vector/black-geometric-memphis-social-banner_53876-116843.jpg?semt=ais_hybrid&w=740&q=80',
      imageHint: 'web development',
      instructorId: 'dummy-instructor',
      learningObjectives: [],
      curriculum: [],
      level: 'Intermediate',
      category: 'Web Development',
      priceType: 'paid',
      duration: '8h 15m',
      liveSessionsEnabled: false,
      resourcesEnabled: false,
      createdAt: null,
      rating: 4,
      reviews: 255,
      lessons: 45,
      students: 5230,
      instructor: {
          name: 'James Johnson',
          avatar: 'https://picsum.photos/seed/instructor-3/40/40'
      }
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section 
          className="relative"
        >
          <Image
            src="/background.png"
            alt="Hero background image"
            fill
            className="object-cover"
            quality={100}
            data-ai-hint="abstract background"
          />
          <div className="absolute inset-0 bg-background/60" />

          <div className="container relative px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12 md:py-24">
              <div className="text-center md:text-left">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  Bharat's <span className="text-primary">Trusted &</span><br/>
                  <span className="text-primary">Affordable</span><br/>
                  Educational Platform
                </h1>
                <p className="mt-6 max-w-xl mx-auto md:mx-0 text-lg text-foreground/80">
                  Unlock your potential by signing up with Aviraj Info Tech-
                  The most affordable learning solution
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <Button asChild size="lg" className="rounded-md px-10 py-6 text-lg">
                    <Link href="/courses">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
               <div className="relative h-96 md:h-full w-full flex items-center justify-center">
                      {/* Left Character (CEO) */}
                      <div className="relative transform -translate-x-16 translate-y-8">
                          {/* Dashed Circle */}
                          <div className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow"></div>
                          {/* Floating Dots */}
                          <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-orange-400 rounded-full"></div>
                          <div className="absolute -top-4 right-8 w-5 h-5 bg-blue-400 rounded-full"></div>
                          
                          {/* Image Container */}
                          <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg">
                              <Image
                                  src="/ceo.png"
                                  alt="Avanish Sir, CEO"
                                  width={224}
                                  height={224}
                                  className="object-cover absolute top-[-40px]"
                              />
                          </div>
                          {/* Speech Bubble */}
                          <div className="absolute bottom-12 left-[80%] w-56 bg-indigo-900 text-white p-3 rounded-lg shadow-xl z-10">
                              <p className="text-sm">"AIT is where students learn with love and can grow with guidance."</p>
                              {/* Triangle */}
                              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-indigo-900 border-b-8 border-b-transparent"></div>
                          </div>
                      </div>

                      {/* Right Character (Student) */}
                      <div className="relative transform translate-x-32 -translate-y-10">
                          {/* Dashed Circle */}
                          <div className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow [animation-direction:reverse]"></div>
                          {/* Floating Dots */}
                          <div className="absolute -top-4 -left-4 w-4 h-4 bg-pink-400 rounded-full"></div>
                          <div className="absolute -bottom-4 right-0 w-6 h-6 bg-cyan-400 rounded-full"></div>

                          {/* Image Container */}
                          <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg">
                              <Image
                                  src="/student.png"
                                  alt="Student"
                                  width={224}
                                  height={224}
                                  className="object-cover"
                              />
                          </div>
                          {/* Speech Bubble */}
                          <div className="absolute top-8 right-[80%] w-48 bg-white text-black p-3 rounded-lg shadow-xl z-10">
                              <p className="text-sm">"Avanish Sir, What is AIT?"</p>
                              {/* Triangle */}
                              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-white border-b-8 border-b-transparent"></div>
                          </div>
                      </div>
                </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="relative -mt-40">
                  <Card className="shadow-2xl">
                    <CardContent ref={featuresRef} className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                       <div className="text-center flex flex-col items-center gap-2">
                           <div className="p-3 bg-red-100 rounded-lg">
                               <Video className="h-6 w-6 text-red-500"/>
                           </div>
                           <h3 className="font-bold text-lg">Daily Live</h3>
                           <p className="text-sm text-muted-foreground">Interactive classes</p>
                       </div>
                       <div className="text-center flex flex-col items-center gap-2">
                           <div className="p-3 bg-blue-100 rounded-lg">
                               <FileText className="h-6 w-6 text-blue-500"/>
                           </div>
                           <h3 className="font-bold text-lg">10 Million +</h3>
                           <p className="text-sm text-muted-foreground">Tests, sample papers & notes</p>
                       </div>
                       <div className="text-center flex flex-col items-center gap-2">
                           <div className="p-3 bg-purple-100 rounded-lg">
                               <Clock className="h-6 w-6 text-purple-500"/>
                           </div>
                           <h3 className="font-bold text-lg">24 x 7</h3>
                           <p className="text-sm text-muted-foreground">Doubt solving sessions</p>
                       </div>
                       <div className="text-center flex flex-col items-center gap-2">
                           <div className="p-3 bg-yellow-100 rounded-lg">
                               <BookOpen className="h-6 w-6 text-yellow-500"/>
                           </div>
                           <h3 className="font-bold text-lg">100 +</h3>
                           <p className="text-sm text-muted-foreground">Offline centres</p>
                       </div>
                    </CardContent>
                  </Card>
                </div>
            </div>
        </section>

        {/* About Us Section */}
        <section className="py-16 md:py-24 bg-[#FFF5EC]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-headline text-3xl font-bold sm:text-4xl text-gray-900">About Aviraj Info Tech</h2>
                <p className="mt-4 text-lg text-gray-800">
                  Aviraj Info Tech is a leading provider of cybersecurity education, committed to empowering the next generation of security professionals. Our mission is to deliver high-quality, accessible, and affordable training that equips students with the real-world skills needed to tackle the challenges of the digital age.
                </p>
                 <p className="mt-4 text-gray-700">
                  Founded by industry experts, we combine cutting-edge curriculum with hands-on learning to ensure our students are not just certified, but truly job-ready. Join us to turn your passion for technology into a rewarding career in cybersecurity.
                </p>
                <div className="mt-8">
                    <Button asChild>
                        <Link href="/about">Learn More</Link>
                    </Button>
                </div>
              </div>
              <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <Image
                  src="/HOME1.png"
                  alt="A team of cybersecurity experts working together"
                  fill
                  className="object-cover"
                  data-ai-hint="cybersecurity team"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Popular Courses Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl font-bold sm:text-4xl">Explore Our Popular Courses</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        Dive into our most sought-after courses and start your journey to mastery.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dummyCourses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                  ))}
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
