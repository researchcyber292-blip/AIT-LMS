'use client';

import { CheckCircle, XCircle, Crown, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

// Note: Metadata export is for server components, but we keep it for potential future static generation.
// In a client component, document title would be set via useEffect if needed.

const plans = [
    {
        title: 'Beginner',
        price: '₹399/mo',
        description: 'Ideal for those new to cybersecurity, providing the essential concepts and tools to start your journey.',
        features: [
            { text: 'Access to all Beginner courses', included: true },
            { text: 'Learn Cybersecurity from scratch', included: true },
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
        card: 'border-orange-500/50 bg-neutral-900',
        header: 'bg-gradient-to-r from-orange-500 to-orange-600',
        button: 'bg-orange-500 hover:bg-orange-400 border-orange-600 text-white',
        peel: 'from-orange-500/80 to-neutral-900/10'
    },
    silver: {
        card: 'border-slate-400/50 bg-slate-900',
        header: 'bg-gradient-to-r from-slate-500 to-slate-700',
        button: 'bg-slate-500 hover:bg-slate-400 border-slate-600',
        peel: 'from-slate-500/80 to-slate-900/10'
    },
    gold: {
        card: 'border-yellow-500/50 bg-neutral-900',
        header: 'bg-gradient-to-r from-yellow-500 to-amber-600',
        button: 'bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-600',
        peel: 'from-yellow-500/80 to-neutral-900/10'
    }
}

export default function CoursesPage() {
  return (
    <div className="bg-gray-900 text-white min-h-[calc(100vh-3.5rem)] py-12 md:py-24">
        <div className="container">
            <div className="text-center mb-16">
                <h1 className="font-headline text-4xl font-bold uppercase tracking-wider">Our Subscription Plans</h1>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                    Choose the plan that best fits your learning goals.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
                {plans.map((plan) => (
                    <div key={plan.title} className={cn(
                        "rounded-lg shadow-2xl flex flex-col border-2 relative transition-transform transform hover:-translate-y-2",
                        tierStyles[plan.tier as keyof typeof tierStyles].card,
                        plan.isPopular && "scale-105 md:scale-110 z-10 border-4 border-slate-400 shadow-slate-400/20"
                    )}>
                        {plan.isPopular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="bg-slate-300 text-black px-4 py-1 rounded-full text-sm font-bold uppercase shadow-lg">
                                    Best Value
                                </div>
                            </div>
                        )}

                        {/* A simplified visual flair to mimic a curled corner */}
                        <div className={cn(
                            "absolute top-0 right-0 h-24 w-24 bg-gradient-to-bl rounded-bl-full opacity-50",
                             tierStyles[plan.tier as keyof typeof tierStyles].peel
                        )}></div>
                        <div className="absolute top-[3px] right-[3px] h-8 w-8 bg-gray-900 rounded-bl-full"></div>


                        {/* Header */}
                        <div className={cn("p-6 text-center rounded-t-md", tierStyles[plan.tier as keyof typeof tierStyles].header)}>
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
                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
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
                <div className="relative rounded-2xl shadow-2xl border-2 border-cyan-500/30 bg-gray-950 p-8 text-center overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-[spin-slow_8s_linear_infinite]"></div>
                    <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl animate-[spin-slow_10s_linear_infinite_reverse]"></div>
                    
                    <div className="relative z-10">
                        <div className="mx-auto bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-full w-fit mb-4 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-purple-500/30">
                            <Rocket className="h-8 w-8 text-white transition-transform duration-300 group-hover:-rotate-12" />
                        </div>
                        <h2 className="text-4xl font-bold uppercase font-headline tracking-widest text-white">
                            Premium++
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-purple-200/80">
                            NO LIMIT LEARNING WITH OUR ADVANCED FEATURES AND THE COURCE WILL GET REDESIGNE FOR YOU PERSONALLY WITH A HYPER FEEL.
                        </p>
                        <div className="my-8">
                            <span className="text-5xl font-bold font-headline text-white">₹12,999</span>
                            <span className="text-xl font-semibold text-muted-foreground"> / 6 months</span>
                        </div>
                        <Button size="lg" className="w-full max-w-xs mx-auto uppercase font-bold bg-transparent border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 hover:text-white hover:border-cyan-300 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-400/40">
                            Contact to Order
                        </Button>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
}
