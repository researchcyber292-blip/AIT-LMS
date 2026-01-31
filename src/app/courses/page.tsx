
import { Check, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Courses - CyberLearn',
  description: 'Choose your learning path, from beginner to advanced cybersecurity courses.',
};

const plans = [
    {
        title: 'Beginner',
        description: 'Perfect for those new to cybersecurity.',
        price: 'Free',
        features: [
            'Access to introductory courses',
            'Basic cybersecurity concepts',
            'Community forum access',
            'Email support'
        ],
        isPopular: false,
    },
    {
        title: 'Pro',
        description: 'For those looking to advance their skills.',
        price: '₹499/mo',
        features: [
            'Access to all Beginner courses',
            'Intermediate & Advanced topics',
            'Hands-on labs & projects',
            'Priority support',
            'Career guidance'
        ],
        isPopular: true,
    },
    {
        title: 'Advanced',
        description: 'For seasoned professionals seeking mastery.',
        price: '₹999/mo',
        features: [
            'Access to all Pro courses',
            'Specialized expert-level content',
            '1-on-1 mentorship sessions',
            'Certification preparation',
            'Exclusive networking events'
        ],
        isPopular: false,
    }
]

export default function CoursesPage() {
  return (
    <div className="container py-12 md:py-24">
      <div className="text-center">
        <h1 className="font-headline text-4xl font-bold">Choose Your Path</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Select the plan that best fits your learning goals and unlock your potential in cybersecurity.
        </p>
      </div>

      <div className="mt-12 mx-auto max-w-4xl space-y-8">
        {plans.map((plan) => (
          <Card key={plan.title} className={cn(
            "shadow-lg border-2",
            plan.isPopular ? "border-primary shadow-primary/20" : "border-border"
          )}>
            <CardHeader className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-2xl">{plan.title}</CardTitle>
                        <CardDescription className="mt-2">{plan.description}</CardDescription>
                    </div>
                    {plan.isPopular && (
                        <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                            <Crown className="w-4 h-4" />
                            <span>Most Popular</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-3">
                                <Check className="w-5 h-5 text-green-500" />
                                <span className="text-muted-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="text-center md:text-right">
                    <p className="text-4xl font-bold font-headline">{plan.price}</p>
                    <p className="text-muted-foreground text-sm">{plan.title === 'Free' ? 'to get started' : 'billed monthly'}</p>
                    <Button size="lg" className="mt-6 w-full md:w-auto">Get Started</Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
