
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Video, FileText, Clock, BookOpen, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Course } from '@/lib/types';
import { CourseCard } from '@/components/course-card';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

function UpcomingCourseCard({ course }: { course: any }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="h-full">
      <Card className="relative overflow-hidden h-[450px] flex flex-col justify-end group/upcoming rounded-lg">
        <Image src={course.image} alt={course.title} fill objectFit="cover" className="z-0 group-hover/upcoming:scale-105 transition-transform duration-300" data-ai-hint={course.imageHint} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
        
        <div className="absolute top-4 left-4 z-20">
            <Badge>₹{course.price}</Badge>
        </div>
        <div className="absolute top-4 right-4 z-20">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-9 w-9 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              onClick={toggleFavorite}
            >
                <Heart className={cn("h-4 w-4 transition-colors", isFavorited && "fill-red-500 text-red-500")} />
            </Button>
        </div>

        <CardContent className="relative z-20 p-4 text-white">
          <h3 className="font-headline text-2xl font-bold uppercase leading-tight">{course.title}</h3>
          <p className="text-sm mt-1 text-white/80 h-10 line-clamp-2">{course.subtitle}</p>
          
          <div className="mt-4 border-t border-white/20 pt-3 flex items-center gap-x-4 text-sm text-white/90">
              <div className="flex items-center gap-1.5"><BookOpen className="h-4 w-4"/><span>{course.lessons} Lessons</span></div>
              <div className="flex items-center gap-1.5"><Users className="h-4 w-4"/><span>{course.students} Students</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

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
      title: 'Data Science & Machine Learning Bootcamp',
      description: '',
      longDescription: '',
      price: 25.50,
      image: 'https://img.freepik.com/free-vector/black-geometric-memphis-social-banner_53876-116843.jpg?semt=ais_hybrid&w=740&q=80',
      imageHint: 'data science',
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
      title: 'Full Stack Web Development Bootcamp',
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
    {
      id: 'dummy-4',
      title: 'ROBOTICS AND TECH',
      description: '',
      longDescription: '',
      price: 45,
      image: 'https://img.freepik.com/free-vector/black-geometric-memphis-social-banner_53876-116843.jpg?semt=ais_hybrid&w=740&q=80',
      imageHint: 'robotics tech',
      instructorId: 'dummy-instructor-4',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Robotics',
      priceType: 'paid',
      duration: '4h',
      liveSessionsEnabled: true,
      resourcesEnabled: true,
      createdAt: null,
      rating: 4,
      reviews: 180,
      lessons: 25,
      students: 3102,
      instructor: {
          name: 'Sarah Lee',
          avatar: 'https://picsum.photos/seed/instructor-4/40/40'
      }
    },
    {
      id: 'dummy-5',
      title: 'Ethical Hacking: Zero to Hero',
      description: '',
      longDescription: '',
      price: 80,
      image: 'https://img.freepik.com/free-vector/black-geometric-memphis-social-banner_53876-116843.jpg?semt=ais_hybrid&w=740&q=80',
      imageHint: 'ethical hacking',
      instructorId: 'dummy-instructor-5',
      learningObjectives: [],
      curriculum: [],
      level: 'Intermediate',
      category: 'Ethical Hacking',
      priceType: 'paid',
      duration: '12h',
      liveSessionsEnabled: true,
      resourcesEnabled: true,
      createdAt: null,
      rating: 5,
      reviews: 350,
      lessons: 50,
      students: 4500,
      instructor: {
          name: 'David Chen',
          avatar: 'https://picsum.photos/seed/instructor-5/40/40'
      }
    },
    {
      id: 'dummy-6',
      title: 'AI & ML',
      description: '',
      longDescription: '',
      price: 150,
      image: 'https://img.freepik.com/free-vector/black-geometric-memphis-social-banner_53876-116843.jpg?semt=ais_hybrid&w=740&q=80',
      imageHint: 'AI ML',
      instructorId: 'dummy-instructor-6',
      learningObjectives: [],
      curriculum: [],
      level: 'Advanced',
      category: 'AI/ML',
      priceType: 'paid',
      duration: '20h',
      liveSessionsEnabled: false,
      resourcesEnabled: true,
      createdAt: null,
      rating: 4,
      reviews: 210,
      lessons: 60,
      students: 2800,
      instructor: {
          name: 'Emily White',
          avatar: 'https://picsum.photos/seed/instructor-6/40/40'
      }
    }
  ];

  const studentFeedback = [
    {
      name: 'Ravi Kumar',
      role: 'Ethical Hacking Student',
      feedback: "This was the best investment I've made in my career. The instructors are top-notch and the hands-on labs are incredibly valuable.",
      avatarSeed: 'student-1'
    },
    {
      name: 'Priya Sharma',
      role: 'Data Science Student',
      feedback: 'The curriculum is well-structured and up-to-date with industry standards. I feel much more confident in my skills now.',
      avatarSeed: 'student-2'
    },
    {
      name: 'Amit Das',
      role: 'Web Development Student',
      feedback: "I went from knowing nothing about web development to building my own applications. Highly recommended!",
      avatarSeed: 'student-3'
    },
    {
      name: 'Sneha Mehta',
      role: 'Cyber Security Student',
      feedback: 'The 24x7 doubt solving feature is a lifesaver. I never felt stuck for long.',
      avatarSeed: 'student-4'
    },
    {
      name: 'Vijay Singh',
      role: 'AI/ML Student',
      feedback: "Incredible value for the price. The quality of teaching is comparable to much more expensive bootcamps.",
      avatarSeed: 'student-5'
    },
    {
        name: 'Anjali Kulkarni',
        role: 'Robotics Student',
        feedback: "The practical, hands-on approach is what sets AIT apart. You don't just learn theory, you actually build things.",
        avatarSeed: 'student-6'
    }
  ];

  const latestBlogs = [
    {
      title: 'Top 10 Cybersecurity Threats to Watch in 2026',
      category: 'Threat Intelligence',
      image: 'https://images.unsplash.com/photo-1631624220291-8f191fbdb543?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxoYWNrZXIlMjBjb2RlfGVufDB8fHx8MTc2OTA5Njc3OHww&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'hacker code',
      excerpt: 'As technology evolves, so do the threats. We break down the most significant cyber threats that individuals and businesses will face this year.',
      author: {
        name: 'Aviraj Singh',
        avatar: 'https://picsum.photos/seed/instructor-1/40/40'
      },
      date: 'July 26, 2026',
      href: '#'
    },
    {
      title: "A Beginner's Guide to Ethical Hacking",
      category: 'Ethical Hacking',
      image: 'https://images.unsplash.com/photo-1548092372-0d1bd40894a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwc2VjdXJpdHl8ZW58MHx8fHwxNzY5MTE5MTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'digital security',
      excerpt: 'Ever wondered how hackers think? Our guide to ethical hacking will introduce you to the core concepts and tools used by security professionals.',
      author: {
        name: 'Priya Sharma',
        avatar: 'https://picsum.photos/seed/instructor-2/40/40'
      },
      date: 'July 22, 2026',
      href: '#'
    },
    {
      title: 'The Rise of AI in Cybersecurity: Friend or Foe?',
      category: 'AI Security',
      image: 'https://images.unsplash.com/photo-1488229297570-58520851e868?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxkaWdpdGFsJTIwYnJhaW58ZW58MHx8fHwxNzcwMDk5NDgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'digital brain',
      excerpt: 'Artificial intelligence is a double-edged sword. Learn how AI is being used to both defend against and carry out sophisticated cyber attacks.',
      author: {
        name: 'Rajesh Kumar',
        avatar: 'https://picsum.photos/seed/instructor-3/40/40'
      },
      date: 'July 18, 2026',
      href: '#'
    }
  ];

  const upcomingCourses = [
    {
      id: 'upcoming-1',
      title: 'DIGITAL MARKETING',
      subtitle: 'The Complete Digital Marketing Analysis Guide',
      price: 13,
      image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxkaWdpdGFsJTIwbWFya2V0aW5nfGVufDB8fHx8MTc3MDExOTEyOHww&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'digital marketing',
      lessons: 1,
      students: 0,
    },
    {
      id: 'upcoming-2',
      title: 'DIGITAL MARKETING',
      subtitle: 'This is the best Online Course in the country, we focus on adequate teaching for Everyone.',
      price: 25.50,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYXJrZXRpbmclMjBhbmFseXRpY3N8ZW58MHx8fHwxNzcwMTE5MTI4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'marketing analytics',
      lessons: 12,
      students: 1543,
    },
    {
      id: 'upcoming-3',
      title: 'FULL STACK WEB DEVELOPMENT WITH JAVASCRIPT',
      subtitle: 'This is the best Online Course in the country, we focus on adequate teaching for Everyone.',
      price: 82,
      image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3ZWIlMjBkZXZlbG9wbWVudHxlbnwwfHx8fDE3NjkxMzI2MTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'web javascript',
      lessons: 45,
      students: 5230,
    },
    {
      id: 'upcoming-4',
      title: 'ADVANCED PENETRATION TESTING',
      subtitle: 'Master the art of ethical hacking and secure networks like a pro.',
      price: 240,
      image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYmVyJTIwc2VjdXJpdHklMjBoYWNrZXJ8ZW58MHx8fHwxNzcxMjYxMjMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      imageHint: 'cyber security hacker',
      lessons: 60,
      students: 4210,
    }
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
                                  className="object-cover absolute top-[-20px]"
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

        {/* Student Feedback Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-headline text-3xl font-bold sm:text-4xl">What Our Students Say</h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Hear from learners who have transformed their careers with us.
              </p>
            </div>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[
                Autoplay({
                  delay: 2000,
                  stopOnInteraction: true,
                }),
              ]}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent>
                {studentFeedback.map((feedback, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-2 h-full">
                      <Card className="h-full flex flex-col">
                        <CardContent className="flex flex-col items-center text-center p-6 gap-6 flex-1">
                          <Avatar className="w-24 h-24 border-4 border-primary/20">
                            <AvatarImage src={`https://picsum.photos/seed/${feedback.avatarSeed}/100/100`} />
                            <AvatarFallback>{feedback.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex flex-col">
                            <p className="text-muted-foreground italic flex-grow">"{feedback.feedback}"</p>
                            <div className="mt-6">
                                <p className="font-bold text-lg">{feedback.name}</p>
                                <p className="text-sm text-primary">{feedback.role}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

        {/* Latest Blogs Section */}
        <section id="blog" className="py-16 md:py-24 scroll-mt-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl font-bold sm:text-4xl">From Our Blog</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        Stay updated with the latest trends, tutorials, and insights from the world of cybersecurity.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {latestBlogs.map((post) => (
                        <Card key={post.title} className="flex h-full flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 bg-card border-border group">
                            <div className="relative overflow-hidden rounded-t-lg">
                                <Link href={post.href} className="block">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        width={600}
                                        height={400}
                                        className="aspect-video w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        data-ai-hint={post.imageHint}
                                    />
                                </Link>
                            </div>
                            <CardContent className="flex flex-1 flex-col p-4 space-y-3">
                                <Badge variant="secondary">{post.category}</Badge>
                                <h3 className="font-bold text-lg leading-snug flex-1">
                                    <Link href={post.href} className="hover:text-primary transition-colors">{post.title}</Link>
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                                
                                <div className="!mt-auto pt-4 border-t border-border">
                                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                                      <div className="flex items-center gap-2">
                                            <Avatar className="h-7 w-7">
                                                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                                                <AvatarFallback>{post.author.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{post.author.name}</span>
                                        </div>
                                        <span>{post.date}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* Upcoming Courses Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="font-headline text-3xl font-bold sm:text-4xl">See Our Upcoming Courses</h2>
                <div className="hidden md:flex gap-2">
                  <CarouselPrevious className="static translate-y-0" />
                  <CarouselNext className="static translate-y-0" />
                </div>
              </div>
              <CarouselContent className="-ml-4">
                {upcomingCourses.map((course) => (
                  <CarouselItem key={course.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <UpcomingCourseCard course={course} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex md:hidden justify-center gap-4 mt-8">
                <CarouselPrevious />
                <CarouselNext />
              </div>
            </Carousel>
          </div>
        </section>

      </main>
    </div>
  );
}
