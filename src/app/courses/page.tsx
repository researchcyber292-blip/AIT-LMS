'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

// Note: Metadata export is for server components, but we keep it for potential future static generation.
// In a client component, document title would be set via useEffect if needed.

const plans = [
    {
        title: 'Beginner',
        price: '₹199/mo',
        description: 'Perfect for those new to cybersecurity, providing the essential concepts to get you started.',
        features: [
            { text: 'Access to introductory courses', included: true },
            { text: 'Basic cybersecurity concepts', included: true },
            { text: 'Community forum access', included: true },
            { text: 'Intermediate & Advanced topics', included: false },
            { text: 'Hands-on labs & projects', included: false },
            { text: 'Priority support', included: false },
        ],
        tier: 'bronze',
        isPopular: false,
    },
    {
        title: 'Pro',
        price: '₹499/mo',
        description: 'For learners aiming to advance their skills with practical labs and expert guidance.',
        features: [
            { text: 'Access to introductory courses', included: true },
            { text: 'Basic cybersecurity concepts', included: true },
            { text: 'Community forum access', included: true },
            { text: 'Intermediate & Advanced topics', included: true },
            { text: 'Hands-on labs & projects', included: true },
            { text: 'Priority support', included: true },
        ],
        tier: 'silver',
        isPopular: true,
    },
    {
        title: 'Advanced',
        price: '₹999/mo',
        description: 'For professionals seeking mastery with specialized content and 1-on-1 mentorship.',
        features: [
            { text: 'Access to introductory courses', included: true },
            { text: 'Basic cybersecurity concepts', included: true },
            { text: 'Community forum access', included: true },
            { text: 'Intermediate & Advanced topics', included: true },
            { text: 'Hands-on labs & projects', included: true },
            { text: 'Priority support', included: true },
            { text: '1-on-1 mentorship sessions', included: true},
        ],
        tier: 'gold',
        isPopular: false,
    }
];

const tierStyles = {
    bronze: {
        card: 'border-orange-900/50 bg-stone-900',
        header: 'bg-gradient-to-r from-orange-800 to-amber-900',
        button: 'bg-orange-700 hover:bg-orange-600 border-orange-800',
        peel: 'from-orange-800/80 to-stone-900/10'
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
                            <h2 className="text-3xl font-bold uppercase font-headline tracking-widest">{plan.title}</h2>
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
                                        <span className={cn('text-sm', !feature.included && 'text-muted-foreground/60 line-through')}>{feature.text}</span>
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
        </div>
    </div>
  );
}
