'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { useAuth } from '@/firebase';
import { signInAnonymously, setPersistence, inMemoryPersistence } from 'firebase/auth';
import { adminCredentials } from '@/lib/admin-credentials';

export default function InstructorSupportLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const auth = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Find if the credentials match any of the admin categories
        const adminCategory = Object.entries(adminCredentials).find(
            ([_, creds]) => creds.username === username && creds.password === password
        );

        if (adminCategory) {
            const [categoryKey] = adminCategory;
            try {
                if (!auth) {
                  toast({ variant: "destructive", title: "Authentication Error", description: "Firebase Auth not available." });
                  setIsLoading(false);
                  return;
                }
                // Sign out any existing user
                if (auth.currentUser) {
                  await auth.signOut();
                }
                // Use in-memory persistence for this special session
                await setPersistence(auth, inMemoryPersistence);
                await signInAnonymously(auth);

                // Store the special role to be picked up by the chat page
                localStorage.setItem('adminChatRole', categoryKey);

                toast({
                    title: 'Login Successful',
                    description: `Entering support chat as ${categoryKey.replace(/-/g, ' ')} instructor.`,
                });
                router.push('/explore');

            } catch (error) {
                console.error("Anonymous sign-in failed:", error);
                toast({
                    variant: 'destructive',
                    title: 'Firebase Login Failed',
                    description: 'Could not start a temporary session to enter chat.',
                });
                localStorage.removeItem('adminChatRole');
                setIsLoading(false);
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Access Denied',
                description: 'The provided credentials are not valid for an instructor role.',
            });
            setIsLoading(false);
        }
    };
    
    return (
         <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
            <Image
                src="/login.png"
                alt="Cyber security concept"
                fill
                className="object-cover opacity-20"
                data-ai-hint="cyber security"
            />
             <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
            <Card className="w-full max-w-md z-10 border-primary/20 bg-card/50 shadow-lg">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                        <Fingerprint className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Instructor Support Login</CardTitle>
                    <CardDescription>Enter your credentials to access the student chat.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                        <Input
                            id="username"
                            type="text"
                            placeholder="Username (e.g., cyber@ait.com)"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="off"
                            className="h-12"
                        />
                        </div>
                         <div className="space-y-2">
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="off"
                            className="h-12"
                        />
                        </div>
                        <Button type="submit" className="w-full h-12 !mt-6" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Enter Support Chat'}
                        <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
