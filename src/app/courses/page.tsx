
'use client';

import { CheckCircle, XCircle, Crown, Rocket, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Instructor } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

// Note: Metadata export is for server components, but we keep it for potential future static generation.
// In a client component, document title would be set via useEffect if needed.

const plans = [
    {
        title: 'Beginner',
        price: '₹599/m',
        description: 'Ideal for those new to cybersecurity, providing the essential concepts and tools to start your journey.',
        features: [
            { text: 'Access to all Beginner courses', included: true },
            { text: 'Learn Cybersecurity from scratch', included: true },
            { text: 'Quizzes & knowledge checks', included: true },
            { text: 'Weekly progress reports', included: true },
            { text: 'Community Access', included: true },
            { text: 'Certification', included: true },
            { text: '24/7 Live Support [AI]', included: true },
            { text: 'Live Classes', included: false },
            { text: 'Live Lab Tests', included: false },
            { text: 'Priority Support', included: false },
            { text: '1-on-1 Mentorship', included: false },
        ],
        tier: 'orange',
        isPopular: false,
    },
    {
        title: 'Pro',
        price: '₹2999 / 3 months',
        description: 'For learners aiming to advance their skills with practical labs and expert guidance.',
        features: [
            { text: 'Access to introductory courses', included: true },
            { text: 'Basic cybersecurity concepts', included: true },
            { text: 'Community forum access', included: true },
            { text: '24/7 LIVE SUPPORT [AI]', included: true },
            { text: 'WEEKLY DOUBT CLASSES', included: true },
            { text: '24 LIVE CLASSES IN 6 MONTHS AVAILABLE', included: true },
            { text: 'AFTER 6 MONTHS VERIFIED BADGES + CERTIFICATIONS + TITLE', included: true },
            { text: 'Priority Support', included: false },
            { text: '1-on-1 Mentorship', included: false },
        ],
        tier: 'silver',
        isPopular: true,
    },
    {
        title: 'Advanced',
        price: '₹4999/PER 6 MONTHS',
        description: 'For professionals seeking mastery with specialized content and 1-on-1 mentorship.',
        features: [
            { text: 'Full access to all courses (Beginner to Advanced)', included: true },
            { text: 'Hands-on labs & projects', included: true },
            { text: 'Cloud live testing environment', included: true },
            { text: 'Weekly doubt classes', included: true },
            { text: '24+ live classes in 6 months', included: true },
            { text: 'Verified Badges + Certifications + Title', included: true },
            { text: 'Community forum access', included: true },
            { text: '24/7 Live Support [AI]', included: true },
            { text: 'Priority support', included: true },
            { text: '1-on-1 mentorship sessions', included: true},
        ],
        tier: 'gold',
        isPopular: false,
    }
];

const tierStyles = {
    orange: {
        card: 'border-orange-500/50 bg-card shadow-orange-500/10',
        header: 'bg-orange-500',
        button: 'bg-orange-500 hover:bg-orange-600 border-orange-700 text-white',
    },
    silver: {
        card: 'border-primary/50 bg-card shadow-primary/10',
        header: 'bg-primary',
        button: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    },
    gold: {
        card: 'border-yellow-500/50 bg-card shadow-yellow-500/10',
        header: 'bg-yellow-500',
        button: 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-700',
    }
}

export default function CoursesPage() {
  const firestore = useFirestore();

  const instructorsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'instructors') : null),
    [firestore]
  );

  const { data: instructors, isLoading } = useCollection<Instructor>(instructorsQuery);
  
  const activeInstructors = instructors?.filter(inst => inst.accountStatus === 'active' && inst.bio && inst.title);

  return (
    <div className="bg-background text-foreground min-h-[calc(100vh-3.5rem)] py-12 md:py-24">
        <div className="container">
            <div className="relative text-center mb-16 rounded-2xl border border-border py-12">
                <div className="relative z-10">
                    <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4 shadow-lg">
                        <Gem className="h-8 w-8" />
                    </div>
                    <h1 className="font-headline text-4xl font-bold uppercase tracking-wider text-foreground">
                        Our Subscription Plans
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                        Choose the plan that best fits your learning goals and unlock your potential.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <div key={plan.title} className={cn(
                        "rounded-lg shadow-lg flex flex-col border relative transition-transform transform hover:-translate-y-2",
                        tierStyles[plan.tier as keyof typeof tierStyles].card,
                        plan.isPopular && "scale-105 md:scale-110 z-10 border-2 border-primary shadow-xl shadow-primary/20"
                    )}>
                        {plan.isPopular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold uppercase shadow-lg">
                                    Best Value
                                </div>
                            </div>
                        )}
                        
                        {/* Header */}
                        <div className={cn("p-6 text-center rounded-t-md text-primary-foreground", tierStyles[plan.tier as keyof typeof tierStyles].header)}>
                            <h2 className="text-3xl font-bold uppercase font-headline tracking-widest flex items-center justify-center gap-2">
                                {plan.tier === 'gold' && <Crown className="w-8 h-8 text-yellow-300" />}
                                {plan.title}
                            </h2>
                        </div>
                        
                        {/* Content */}
                        <div className="p-8 flex flex-col flex-grow">
                            <p className="text-muted-foreground min-h-[4rem] text-sm">{plan.description}</p>
                            
                            <ul className="space-y-3 my-8 flex-grow">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        {feature.included ? (
                                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500/70 flex-shrink-0" />
                                        )}
                                        <span className={cn('text-sm', !feature.included && 'text-muted-foreground/60')}>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="text-center mt-auto pt-4">
                                <p className="text-4xl font-bold font-headline mb-4">{plan.price}</p>
                                <Button size="lg" className={cn("w-full uppercase font-bold border-b-4", tierStyles[plan.tier as keyof typeof tierStyles].button)}>
                                    Order Now
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Premium++ Plan */}
            <div className="max-w-6xl mx-auto mt-24">
                <div className="relative rounded-2xl shadow-lg border border-border bg-card p-8 text-center overflow-hidden group">
                    <div className="relative z-10">
                        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4 shadow-lg transition-all duration-300 group-hover:scale-110">
                            <Rocket className="h-8 w-8 text-primary transition-transform duration-300 group-hover:-rotate-12" />
                        </div>
                        <h2 className="text-4xl font-bold uppercase font-headline tracking-widest text-foreground">
                            Premium++
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                            NO LIMIT LEARNING WITH OUR ADVANCED FEATURES AND THE COURCE WILL GET REDESIGNE FOR YOU PERSONALLY WITH A HYPER FEEL.
                        </p>
                        <div className="my-8">
                            <span className="text-5xl font-bold font-headline text-foreground">₹12,999</span>
                            <span className="text-xl font-semibold text-muted-foreground"> / 6 months</span>
                        </div>
                        <Button size="lg" variant="outline" className="w-full max-w-xs mx-auto uppercase font-bold transition-all duration-300">
                            Contact to Order
                        </Button>
                    </div>
                </div>
            </div>

            {/* Instructors Section */}
            <div className="mt-24 text-center">
                <h2 className="font-headline text-4xl font-bold uppercase tracking-wider text-foreground">
                    Our Instructors
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    Learn from a diverse group of industry experts who are passionate about sharing their knowledge.
                </p>
            </div>

            <div className="mt-12 max-w-7xl mx-auto grid grid-cols-1 gap-8">
                {isLoading ? (
                  <>
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col md:flex-row items-start gap-8">
                            {/* Left Skeleton */}
                            <div className="flex-shrink-0 flex flex-col items-center text-center md:w-52">
                                <Skeleton className="h-32 w-32 rounded-full border-4 border-primary/20" />
                                <Skeleton className="h-7 w-40 mt-4" />
                                <Skeleton className="h-4 w-48 mt-2" />
                                <div className="mt-4 space-y-2 w-full">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-3/4 mx-auto" />
                                </div>
                            </div>
                            {/* Right Skeleton */}
                             <div className="flex flex-col items-center flex-grow w-full">
                                <div className="w-full"><Skeleton className="h-32 w-full rounded-md" /></div>
                                <Skeleton className="h-11 w-48 mt-6" />
                            </div>
                        </div>
                    ))}
                  </>
                ) : (
                  activeInstructors?.map((instructor) => (
                    <div key={instructor.id} className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col md:flex-row items-start gap-8 transition-all hover:shadow-primary/10 hover:border-primary/40 hover:-translate-y-1">
                        {/* Left Side */}
                        <div className="flex-shrink-0 flex flex-col items-center text-center md:w-52">
                            <Avatar className="h-32 w-32 border-4 border-primary/50">
                                <AvatarImage src={instructor.photoURL} alt={`${instructor.firstName} ${instructor.lastName}`} />
                                <AvatarFallback className="text-4xl">{`${instructor.firstName.charAt(0)}${instructor.lastName.charAt(0)}`}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-headline text-2xl font-bold mt-4">{instructor.firstName} {instructor.lastName}</h3>
                            <p className="text-sm text-primary font-semibold mt-1 w-full break-words">{instructor.title}</p>
                            {instructor.qualifications && (
                                <div className="mt-4 text-xs text-muted-foreground text-center">
                                    <p className="whitespace-pre-line line-clamp-4">{instructor.qualifications}</p>
                                </div>
                            )}
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col items-center flex-grow w-full">
                            <div className="w-full">
                                <ScrollArea className="h-32 w-full rounded-md bg-muted/50 p-4">
                                    <p className="text-muted-foreground text-sm whitespace-pre-line">{instructor.bio || "View profile to see full description."}</p>
                                </ScrollArea>
                            </div>
                            <Button asChild size="lg" className="mt-6 self-center">
                                <Link href={`/instructors/${instructor.id}`}>
                                    View Profile & Courses
                                </Link>
                            </Button>
                        </div>
                    </div>
                  ))
                )}
                 {!isLoading && (!activeInstructors || activeInstructors.length === 0) && (
                    <div className="md:col-span-1 text-center text-muted-foreground py-8">
                        No active instructors found.
                    </div>
                )}
            </div>

        </div>
    </div>
  );
}
