
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CourseCard } from '@/components/course-card';
import type { Course } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const courseCategories = [
    'All',
    'Ethical Hacking',
    'Data Science',
    'Full Stack Dev',
    'AI & ML',
    'Robotics & Tech',
    'Cloud Security',
    'Network Security',
    'Malware Analysis',
    'Digital Forensics',
    'Penetration Testing',
    'Cybersecurity Law',
    'Earn with AI',
    'Coding',
];

const allCourses: Course[] = [
    {
      id: 'ethical-hacking-1',
      title: 'The Complete Ethical Hacking Course: Zero to Hero',
      description: 'Learn to hack like a pro. A complete course for beginners.',
      longDescription: '...',
      price: 499,
      image: 'https://images.unsplash.com/photo-1544890225-2fde0e66f0d0?w=800&auto=format&fit=crop',
      imageHint: 'ethical hacking',
      instructorId: 'inst-1',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Ethical Hacking',
      priceType: 'paid', duration: '52h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 1250, lessons: 150, students: 8500,
      instructor: { name: 'Rajesh Kumar', avatar: 'https://picsum.photos/seed/instructor-1/40/40' }
    },
    {
      id: 'data-science-1',
      title: 'Data Science & Machine Learning Bootcamp',
      description: 'Become a data scientist in 2024! From zero to hero.',
      longDescription: '...',
      price: 599,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
      imageHint: 'data science dashboard',
      instructorId: 'inst-2',
      learningObjectives: [],
      curriculum: [],
      level: 'Intermediate',
      category: 'Data Science',
      priceType: 'paid', duration: '80h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 980, lessons: 210, students: 7600,
      instructor: { name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/instructor-2/40/40' }
    },
    {
      id: 'full-stack-1',
      title: 'The Full Stack Web Development Bootcamp',
      description: 'Learn HTML, CSS, Javascript, Node, React, and more!',
      longDescription: '...',
      price: 399,
      image: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=800&auto=format&fit=crop',
      imageHint: 'full stack code',
      instructorId: 'inst-3',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Full Stack Dev',
      priceType: 'paid', duration: '65h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 2100, lessons: 180, students: 10500,
      instructor: { name: 'Amit Das', avatar: 'https://picsum.photos/seed/instructor-3/40/40' }
    },
    {
      id: 'ai-ml-1',
      title: 'Artificial Intelligence A-Z: Build 5 AI Projects',
      description: 'Learn AI and ML from scratch. Build real-world projects.',
      longDescription: '...',
      price: 799,
      image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=800&auto=format&fit=crop',
      imageHint: 'AI robot face',
      instructorId: 'inst-4',
      learningObjectives: [],
      curriculum: [],
      level: 'Advanced',
      category: 'AI & ML',
      priceType: 'paid', duration: '100h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 3500, lessons: 250, students: 9500,
      instructor: { name: 'Anjali Menon', avatar: 'https://picsum.photos/seed/instructor-4/40/40' }
    },
    {
      id: 'robotics-1',
      title: 'Robotics & Tech: From Zero to Autonomous',
      description: 'Build and program your own robots using Arduino and Python.',
      longDescription: '...',
      price: 699,
      image: 'https://images.unsplash.com/photo-1635833948333-d85915d3368d?w=800&auto=format&fit=crop',
      imageHint: 'robotics arm',
      instructorId: 'inst-5',
      learningObjectives: [],
      curriculum: [],
      level: 'Intermediate',
      category: 'Robotics & Tech',
      priceType: 'paid', duration: '70h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 800, lessons: 120, students: 4500,
      instructor: { name: 'Vijay Singh', avatar: 'https://picsum.photos/seed/instructor-5/40/40' }
    },
    {
      id: 'earn-ai-1',
      title: 'How to Earn Money with AI in 2024',
      description: 'Practical guide to monetizing AI skills. No coding required!',
      longDescription: '...',
      price: 199,
      image: 'https://images.unsplash.com/photo-1678403323863-148554279a29?w=800&auto=format&fit=crop',
      imageHint: 'AI making money',
      instructorId: 'inst-1',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Earn with AI',
      priceType: 'paid', duration: '20h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 1500, lessons: 40, students: 12000,
      instructor: { name: 'Rajesh Kumar', avatar: 'https://picsum.photos/seed/instructor-1/40/40' }
    },
     {
      id: 'pen-test-1',
      title: 'Advanced Penetration Testing & Exploit Writing',
      description: 'Go beyond automated tools and learn to write your own exploits.',
      longDescription: '...',
      price: 999,
      image: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?w=800&auto=format&fit=crop',
      imageHint: 'cyber security professional',
      instructorId: 'inst-2',
      learningObjectives: [],
      curriculum: [],
      level: 'Advanced',
      category: 'Penetration Testing',
      priceType: 'paid', duration: '120h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 950, lessons: 180, students: 3200,
      instructor: { name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/instructor-2/40/40' }
    },
     {
      id: 'coding-1',
      title: 'Coding for Absolute Beginners: Python & JavaScript',
      description: 'Your first step into the world of programming. No experience needed.',
      longDescription: '...',
      price: 249,
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
      imageHint: 'coding on laptop',
      instructorId: 'inst-3',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Coding',
      priceType: 'paid', duration: '40h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 3100, lessons: 90, students: 15000,
      instructor: { name: 'Amit Das', avatar: 'https://picsum.photos/seed/instructor-3/40/40' }
    }
  ];

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const filteredCourses = useMemo(() => {
        return allCourses.filter(course => {
            const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchTerm]);

    const renderSkeletons = () => (
        [...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-[225px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        ))
    );

    return (
        <div className="min-h-screen bg-secondary/20 text-foreground">
            <main className="pt-16">
                {/* Hero Banner Section */}
                <section className="relative w-full h-[350px] bg-gray-900 text-white">
                    <Image
                        src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxidXNpbmVzcyUyMHRlYW0lMjBtZWV0aW5nfGVufDB8fHx8MTc3MDc0NDg0MHww&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Business team in a meeting"
                        layout="fill"
                        objectFit="cover"
                        className="opacity-30"
                        data-ai-hint="business team meeting"
                        priority
                    />
                    <div className="container relative z-10 flex flex-col justify-center h-full">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
                                Interview Preparation for
                                <span className="block text-red-400">Business & Data Analyst</span>
                                Professionals
                            </h1>
                            <p className="mt-4 text-lg text-gray-200">
                                Hybrid learning | Live workshops | Practical interview practice
                            </p>
                            <div className="mt-2">
                                <span className="text-3xl font-bold text-red-400 mr-2">₹10,999</span>
                                <span className="text-xl line-through opacity-70">₹15,999</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Course Listing Section */}
                <section className="container py-12 md:py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold font-headline tracking-tight sm:text-4xl">
                            Learn Skills That Matter
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            Gain real-world job ready skills for the future.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-12 space-y-8">
                        <div className="relative max-w-lg mx-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search course..."
                                className="w-full pl-12 h-12 text-base rounded-full shadow-sm bg-background"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <ScrollArea className="w-full whitespace-nowrap rounded-md">
                            <div className="flex w-max space-x-2 p-2 justify-center mx-auto">
                                {courseCategories.map(category => (
                                    <Button
                                        key={category}
                                        variant={activeCategory === category ? 'default' : 'outline'}
                                        onClick={() => setActiveCategory(category)}
                                        className="rounded-full"
                                    >
                                        {category}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <h3 className="text-2xl font-semibold">No courses found</h3>
                                <p className="text-muted-foreground mt-2">
                                    Try adjusting your search or filter.
                                </p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
