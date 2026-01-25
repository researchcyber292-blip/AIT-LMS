'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowDown, ShieldCheck, Zap, Award, BookOpen, Target, TrendingUp } from 'lucide-react';
import imageData from '@/lib/placeholder-images.json';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { placeholderImages } = imageData;
  const bgImage = placeholderImages.find(img => img.id === 'course-2');
  const mainContentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate background shapes
      gsap.fromTo(
        '.bg-shape-1',
        { opacity: 0, y: 150, rotate: -45 },
        {
          opacity: 0.15,
          y: -150,
          rotate: 45,
          scrollTrigger: {
            trigger: mainContentRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
      gsap.fromTo(
        '.bg-shape-2',
        { opacity: 0, y: 200, x: -100, rotate: 45 },
        {
          opacity: 0.1,
          y: 0,
          x: 100,
          rotate: -45,
          scrollTrigger: {
            trigger: mainContentRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );
      
      // Animate feature cards on scroll
      gsap.from('.feature-card', {
        scrollTrigger: {
          trigger: '.card-grid',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power3.out',
      });

    }, mainContentRef);

    return () => ctx.revert();
  }, []);
  
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 min-h-full min-w-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center text-white">
          <h1 className="font-stylish text-5xl font-bold tracking-tight drop-shadow-xl md:text-7xl">
            AVIRAJ INFO TECH
          </h1>
          <p className="mt-6 max-w-2xl font-body text-2xl text-gray-200 drop-shadow-lg md:text-3xl">
            CYBER SECURITY COURSES
          </p>
          <Link
            href="/courses"
            className="mt-10 rounded-full border border-white/40 bg-black/20 px-10 py-3 text-lg font-medium text-white backdrop-blur-md transition-all hover:border-white/70 hover:bg-white/10"
          >
            Get Started
          </Link>

          <div className="absolute bottom-10 animate-bounce">
            <a href="#main-content" aria-label="Scroll to next section">
                <ArrowDown className="h-8 w-8 text-white/70" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="main-content" ref={mainContentRef} className="bg-background scroll-mt-20">
        <section className="relative overflow-hidden py-20 md:py-28">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-soft-light filter blur-3xl opacity-20 bg-shape-1 pointer-events-none"></div>
            <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-accent rounded-full mix-blend-soft-light filter blur-3xl opacity-10 bg-shape-2 pointer-events-none"></div>

            <div className="container relative">
                <div className="mb-16 text-center">
                    <Link href="/dashboard" className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-0.5 text-lg font-bold text-white">
                      <span className="absolute h-full w-full bg-gradient-to-br from-primary via-accent to-primary/70 transition-all duration-1000 group-hover:w-[300%] group-hover:rotate-[30deg]"></span>
                      <span className="relative z-10 rounded-full bg-background/80 px-12 py-4 backdrop-blur-xl transition-colors duration-300 group-hover:bg-transparent">
                          OPEN WORKSPACE
                      </span>
                    </Link>
                </div>

                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl font-bold md:text-4xl">Your Gateway to Cybersecurity Mastery</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-muted-foreground">
                        At Aviraj Info Tech, we're dedicated to forging the next generation of cybersecurity experts. We provide cutting-edge, hands-on training to equip you with the skills demanded by the industry.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 card-grid">
                    <Card className="bg-card/50 backdrop-blur-lg border border-border/20 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/10 feature-card">
                        <CardHeader className="flex-row items-center gap-4 pb-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <Award className="h-6 w-6" />
                            </div>
                            <CardTitle className="font-headline text-xl leading-tight">Expert-Led Training</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">Learn from seasoned professionals who are leaders in the cybersecurity industry, bringing real-world experience to every lesson.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-lg border border-border/20 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/10 feature-card">
                        <CardHeader className="flex-row items-center gap-4 pb-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <Zap className="h-6 w-6" />
                            </div>
                            <CardTitle className="font-headline text-xl leading-tight">Hands-On Labs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">Apply what you learn in real-world scenarios with our interactive lab environments designed to build practical, job-ready skills.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-lg border border-border/20 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/10 feature-card">
                        <CardHeader className="flex-row items-center gap-4 pb-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <CardTitle className="font-headline text-xl leading-tight">Career-Focused Curriculum</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">Our curriculum is designed in collaboration with industry experts to equip you with the skills demanded by top employers.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-lg border border-border/20 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/10 feature-card">
                        <CardHeader className="flex-row items-center gap-4 pb-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <CardTitle className="font-headline text-xl leading-tight">Industry-Recognized Certifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">Validate your skills and enhance your resume with certifications that are respected and valued by employers worldwide.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-lg border border-border/20 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/10 feature-card">
                        <CardHeader className="flex-row items-center gap-4 pb-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <CardTitle className="font-headline text-xl leading-tight">Comprehensive Course Catalog</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">From beginner fundamentals to advanced specializations, find the perfect course to match your skill level and career goals.</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-card/50 backdrop-blur-lg border border-border/20 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-primary/10 feature-card">
                        <CardHeader className="flex-row items-center gap-4 pb-4">
                            <div className="bg-primary/10 text-primary p-3 rounded-lg">
                                <Target className="h-6 w-6" />
                            </div>
                            <CardTitle className="font-headline text-xl leading-tight">Personalized Learning Paths</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground text-sm">Our platform helps you track your progress and suggests courses to help you achieve your specific career objectives.</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="mt-16 text-center">
                    <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                        <Link href="/courses">Explore All Courses</Link>
                    </Button>
                </div>
            </div>
        </section>
      </div>
    </>
  );
}
