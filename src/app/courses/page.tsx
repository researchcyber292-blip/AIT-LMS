
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
    },
    {
      id: 'cloud-security-1',
      title: 'Ultimate AWS Certified Cloud Practitioner - 2024',
      description: 'Pass the AWS Cloud Practitioner exam. Complete AWS course.',
      longDescription: '...',
      price: 450,
      image: 'https://images.unsplash.com/photo-1585241936939-be4099591252?w=800&auto=format&fit=crop',
      imageHint: 'cloud security server',
      instructorId: 'inst-4',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Cloud Security',
      priceType: 'paid', duration: '30h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 4200, lessons: 100, students: 11000,
      instructor: { name: 'Anjali Menon', avatar: 'https://picsum.photos/seed/instructor-4/40/40' }
    },
    {
      id: 'network-security-1',
      title: 'The Complete Network Security Course: From Scratch',
      description: 'Learn about firewalls, IDS/IPS, VPNs, and network hardening.',
      longDescription: '...',
      price: 550,
      image: 'https://images.unsplash.com/photo-1454165205744-3b78555e5572?w=800&auto=format&fit=crop',
      imageHint: 'network diagram security',
      instructorId: 'inst-5',
      learningObjectives: [],
      curriculum: [],
      level: 'Intermediate',
      category: 'Network Security',
      priceType: 'paid', duration: '60h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 1800, lessons: 130, students: 6800,
      instructor: { name: 'Vijay Singh', avatar: 'https://picsum.photos/seed/instructor-5/40/40' }
    },
    {
      id: 'ethical-hacking-2',
      title: 'Web Application Hacking and Security',
      description: 'Master common web vulnerabilities like SQLi, XSS, and CSRF.',
      longDescription: '...',
      price: 650,
      image: 'https://images.unsplash.com/photo-1593431038929-8e35493208f2?w=800&auto=format&fit=crop',
      imageHint: 'web security code',
      instructorId: 'inst-4',
      learningObjectives: [],
      curriculum: [],
      level: 'Intermediate',
      category: 'Ethical Hacking',
      priceType: 'paid', duration: '55h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 2300, lessons: 160, students: 9800,
      instructor: { name: 'Anjali Menon', avatar: 'https://picsum.photos/seed/instructor-4/40/40' }
    },
    {
      id: 'data-science-2',
      title: 'Python for Data Science and Machine Learning',
      description: 'Learn NumPy, Pandas, Matplotlib, Scikit-learn and more!',
      longDescription: '...',
      price: 499,
      image: 'https://images.unsplash.com/photo-1526374965328-5f61d25c04b6?w=800&auto=format&fit=crop',
      imageHint: 'python code data',
      instructorId: 'inst-5',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Data Science',
      priceType: 'paid', duration: '45h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 5100, lessons: 190, students: 18000,
      instructor: { name: 'Vijay Singh', avatar: 'https://picsum.photos/seed/instructor-5/40/40' }
    },
    {
      id: 'ai-ml-2',
      title: 'Deep Learning Specialization',
      description: 'Master the foundations of Deep Learning, understand how to build neural networks.',
      longDescription: '...',
      price: 1199,
      image: 'https://images.unsplash.com/photo-1696253900257-2a5c4a03a743?w=800&auto=format&fit=crop',
      imageHint: 'neural network abstract',
      instructorId: 'inst-1',
      learningObjectives: [],
      curriculum: [],
      level: 'Highly Advanced',
      category: 'AI & ML',
      priceType: 'paid', duration: '150h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 4500, lessons: 300, students: 8000,
      instructor: { name: 'Rajesh Kumar', avatar: 'https://picsum.photos/seed/instructor-1/40/40' }
    },
    {
      id: 'full-stack-2',
      title: 'MERN Stack - The Complete Guide',
      description: 'Build fullstack React.js, Node.js, Express.js & MongoDB applications.',
      longDescription: '...',
      price: 799,
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&auto=format&fit=crop',
      imageHint: 'react code',
      instructorId: 'inst-2',
      learningObjectives: [],
      curriculum: [],
      level: 'Intermediate',
      category: 'Full Stack Dev',
      priceType: 'paid', duration: '85h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 2800, lessons: 220, students: 12500,
      instructor: { name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/instructor-2/40/40' }
    },
    {
      id: 'robotics-2',
      title: 'ROS for Beginners: Basics, Motion, and OpenCV',
      description: 'Learn the Robot Operating System from scratch.',
      longDescription: '...',
      price: 850,
      image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop',
      imageHint: 'small robot',
      instructorId: 'inst-3',
      learningObjectives: [],
      curriculum: [],
      level: 'Intermediate',
      category: 'Robotics & Tech',
      priceType: 'paid', duration: '95h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 600, lessons: 110, students: 3500,
      instructor: { name: 'Amit Das', avatar: 'https://picsum.photos/seed/instructor-3/40/40' }
    },
    {
      id: 'cloud-security-2',
      title: 'Microsoft Azure Security Technologies (AZ-500)',
      description: 'Prepare for the AZ-500 exam and learn to secure Azure environments.',
      longDescription: '...',
      price: 600,
      image: 'https://images.unsplash.com/photo-1633511116413-649354d83d1e?w=800&auto=format&fit=crop',
      imageHint: 'azure cloud logo',
      instructorId: 'inst-4',
      learningObjectives: [],
      curriculum: [],
      level: 'Advanced',
      category: 'Cloud Security',
      priceType: 'paid', duration: '70h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 1500, lessons: 150, students: 5000,
      instructor: { name: 'Anjali Menon', avatar: 'https://picsum.photos/seed/instructor-4/40/40' }
    },
    {
      id: 'network-security-2',
      title: 'Wi-Fi Hacking and Security',
      description: 'Learn to hack WEP, WPA/WPA2 and protect your own network.',
      longDescription: '...',
      price: 350,
      image: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?w=800&auto=format&fit=crop',
      imageHint: 'people using laptops',
      instructorId: 'inst-5',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Network Security',
      priceType: 'paid', duration: '20h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 2200, lessons: 60, students: 10000,
      instructor: { name: 'Vijay Singh', avatar: 'https://picsum.photos/seed/instructor-5/40/40' }
    },
    {
      id: 'coding-2',
      title: 'Java Programming Masterclass for Software Developers',
      description: 'Learn Java from scratch and become a certified Java developer.',
      longDescription: '...',
      price: 350,
      image: 'https://images.unsplash.com/photo-1629904853716-f0bc642d9b6b?w=800&auto=format&fit=crop',
      imageHint: 'java code editor',
      instructorId: 'inst-2',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Coding',
      priceType: 'paid', duration: '90h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 6000, lessons: 400, students: 25000,
      instructor: { name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/instructor-2/40/40' }
    },
    {
      id: 'earn-ai-2',
      title: 'AI for Business: Create AI-Powered Apps without Code',
      description: 'Leverage no-code tools to build and deploy AI solutions for your business.',
      longDescription: '...',
      price: 250,
      image: 'https://images.unsplash.com/photo-1694034234711-20422617781b?w=800&auto=format&fit=crop',
      imageHint: 'ai business chart',
      instructorId: 'inst-3',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Earn with AI',
      priceType: 'paid', duration: '15h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 900, lessons: 35, students: 8000,
      instructor: { name: 'Amit Das', avatar: 'https://picsum.photos/seed/instructor-3/40/40' }
    },
    {
      id: 'ethical-hacking-3',
      title: 'Social Engineering: The Art of Human Hacking',
      description: 'Learn the techniques attackers use to manipulate and deceive.',
      longDescription: '...',
      price: 400,
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&auto=format&fit=crop',
      imageHint: 'person whispering secret',
      instructorId: 'inst-2',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Ethical Hacking',
      priceType: 'paid', duration: '18h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 2500, lessons: 55, students: 11500,
      instructor: { name: 'Priya Sharma', avatar: 'https://picsum.photos/seed/instructor-2/40/40' }
    },
    {
      id: 'data-science-3',
      title: 'Tableau 2024 A-Z: Hands-On Tableau Training',
      description: 'Master data visualization and create stunning dashboards.',
      longDescription: '...',
      price: 300,
      image: 'https://images.unsplash.com/photo-1637416395253-9426f8279124?w=800&auto=format&fit=crop',
      imageHint: 'tableau dashboard chart',
      instructorId: 'inst-3',
      learningObjectives: [],
      curriculum: [],
      level: 'Beginner',
      category: 'Data Science',
      priceType: 'paid', duration: '35h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 3800, lessons: 120, students: 14000,
      instructor: { name: 'Amit Das', avatar: 'https://picsum.photos/seed/instructor-3/40/40' }
    },
    {
      id: 'ai-ml-3',
      title: 'Natural Language Processing with Python',
      description: 'Learn to analyze text data, build chatbots, and more with NLTK and spaCy.',
      longDescription: '...',
      price: 650,
      image: 'https://images.unsplash.com/photo-1531771686278-222c3ca12265?w=800&auto=format&fit=crop',
      imageHint: 'text analysis abstract',
      instructorId: 'inst-4',
      learningObjectives: [],
      curriculum: [],
      level: 'Intermediate',
      category: 'AI & ML',
      priceType: 'paid', duration: '50h', liveSessionsEnabled: true, resourcesEnabled: true, createdAt: null,
      rating: 4, reviews: 1400, lessons: 100, students: 5500,
      instructor: { name: 'Anjali Menon', avatar: 'https://picsum.photos/seed/instructor-4/40/40' }
    },
    {
      id: 'full-stack-3',
      title: 'Django 4 - The Complete Guide',
      description: 'Build powerful web applications with Python and the Django framework.',
      longDescription: '...',
      price: 450,
      image: 'https://images.unsplash.com/photo-1606115915090-be18a385f0f6?w=800&auto=format&fit=crop',
      imageHint: 'python django code',
      instructorId: 'inst-5',
      learningObjectives: [],
      curriculum: [],
      level: 'Intermediate',
      category: 'Full Stack Dev',
      priceType: 'paid', duration: '60h', liveSessionsEnabled: false, resourcesEnabled: true, createdAt: null,
      rating: 5, reviews: 2100, lessons: 180, students: 9000,
      instructor: { name: 'Vijay Singh', avatar: 'https://picsum.photos/seed/instructor-5/40/40' }
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
