'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, ArrowRight, BookCopy, BarChart, Bot, Code, Wallet, Cpu } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const courseCategories = [
    { name: 'Ethical Hacking', icon: Fingerprint, href: '/login' },
    { name: 'Data Science', icon: BarChart, href: '/login' },
    { name: 'Full Stack Dev', icon: Code, href: '/login' },
    { name: 'AI & ML', icon: Bot, href: '/login' },
    { name: 'Robotics & Tech', icon: Cpu, href: '/login' },
    { name: 'Coding', icon: BookCopy, href: '/login' },
    { name: 'Earn with AI', icon: Wallet, href: '/login' }
];


export default function InstructorLoginPage() {
    const [instructorId, setInstructorId] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleIdSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simple check for the specific admin ID
        if (instructorId.toLowerCase() === 'admins@ait.com') {
            setTimeout(() => {
                setIsAuthenticated(true);
                setIsLoading(false);
            }, 500); // Simulate a quick check
        } else {
            toast({
                variant: 'destructive',
                title: 'Access Denied',
                description: 'The provided Instructor ID is not valid.',
            });
            setIsLoading(false);
        }
    };
    
    if (!isAuthenticated) {
        return (
             <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
                <Image
                    src="/login.png"
                    alt="Cyber security concept"
                    fill
                    className="object-cover opacity-20"
                />
                 <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
                <Card className="w-full max-w-md z-10 border-primary/20 bg-card/50 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                            <Fingerprint className="h-8 w-8" />
                        </div>
                        <CardTitle className="font-headline text-2xl">Instructor Access</CardTitle>
                        <CardDescription>Please verify your Instructor ID to continue.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleIdSubmit} className="space-y-4">
                            <div className="space-y-2">
                            <Input
                                id="instructorId"
                                type="text"
                                placeholder="Enter your Instructor ID"
                                value={instructorId}
                                onChange={(e) => setInstructorId(e.target.value)}
                                required
                                autoComplete="off"
                                className="h-12 text-center"
                            />
                            </div>
                            <Button type="submit" className="w-full h-12 !mt-6" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Verify & Proceed'}
                            <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="container py-24 md:py-32">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold font-headline">Admin Management Console</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Select a category to manage courses and related content.
                </p>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {courseCategories.map((category) => (
                    <Button
                        key={category.name}
                        variant="outline"
                        className="h-24 text-left justify-start flex-col items-start p-4 gap-2 group transition-all hover:bg-primary/5 hover:border-primary"
                        onClick={() => router.push(category.href)}
                    >
                       <div className="flex items-center gap-3">
                         <category.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                         <span className="text-lg font-semibold font-headline transition-colors group-hover:text-primary-foreground">{category.name}</span>
                       </div>
                       <p className="text-sm text-muted-foreground transition-colors group-hover:text-primary-foreground/80">Manage {category.name} content</p>
                    </Button>
                ))}
            </div>
        </div>
    );
}
