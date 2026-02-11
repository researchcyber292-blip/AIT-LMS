'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CourseCard } from '@/components/course-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Course, Instructor } from '@/lib/types';
import { collection } from 'firebase/firestore';

const courseCategories = [
    'All',
    'Ethical Hacking',
    'Data Science',
    'Full Stack Dev',
    'AI & ML',
    'Robotics & Tech',
    'Coding',
];

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const firestore = useFirestore();

    const coursesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'courses');
    }, [firestore]);
    const { data: courses, isLoading: areCoursesLoading } = useCollection<Course>(coursesQuery);

    const instructorsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'instructors');
    }, [firestore]);
    const { data: instructors, isLoading: areInstructorsLoading } = useCollection<Instructor>(instructorsQuery);

    const allCourses = useMemo(() => {
        if (!courses || !instructors) return [];
        return courses.map(course => {
            const instructor = instructors.find(inst => inst.id === course.instructorId);
            return {
                ...course,
                instructor: instructor ? {
                    name: `${instructor.firstName} ${instructor.lastName}`,
                    avatar: instructor.photoURL
                } : {
                    name: 'AIT Staff',
                    avatar: '/image.png'
                }
            };
        });
    }, [courses, instructors]);

    const filteredCourses = useMemo(() => {
        if (!allCourses) return [];
        return allCourses.filter(course => {
            const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchTerm, allCourses]);

    const isLoading = areCoursesLoading || areInstructorsLoading;

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
                        <div className="max-w-xl mx-auto animated-glowing-border">
                           <div className="relative flex items-center bg-background rounded-full">
                                <Search className="absolute left-6 h-6 w-6 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search course..."
                                    className="w-full pl-16 h-16 text-lg rounded-full border-none bg-transparent shadow-none focus-visible:ring-0"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
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
                         {isLoading ? renderSkeletons() : (
                            filteredCourses.length > 0 ? (
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
                            )
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
