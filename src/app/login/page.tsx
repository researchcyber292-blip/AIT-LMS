'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'Please enter both email and password.',
        });
        return;
    }
    setIsLoading(true);

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if user is a student
        let docRef = doc(firestore, 'users', user.uid);
        let userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
            toast({ title: 'Login Successful' });
            router.push('/dashboard');
            return;
        }

        // Check if user is an instructor
        docRef = doc(firestore, 'instructors', user.uid);
        userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
            const instructorData = userDoc.data();
             // Check instructor status
            if (instructorData.accountStatus === 'pending') {
                router.push('/instructor-pending-verification');
            } else if (instructorData.accountStatus === 'rejected' || instructorData.accountStatus === 'banned') {
                router.push(`/instructor-access-denied?status=${instructorData.accountStatus}`);
            } else if (instructorData.accountStatus === 'active' && !instructorData.photoURL) {
                // First time login after approval
                router.push('/instructor-avatar-selection');
            } else {
                toast({ title: 'Login Successful' });
                router.push('/dashboard');
            }
            return;
        }
        
        // If neither, sign out and show error
        await auth.signOut();
        toast({ variant: 'destructive', title: 'Login Failed', description: 'This account is not registered as a student or instructor.' });
    } catch (error: any) {
        let description = 'An unexpected error occurred.';
        switch(error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                description = 'Invalid email or password.';
                break;
            default:
                description = error.message;
                break;
        }
        toast({ variant: 'destructive', title: 'Login Failed', description });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
        <Image
            src="https://img.freepik.com/free-vector/black-geometric-memphis-social-banner_53876-116843.jpg?semt=ais_hybrid&w=740&q=80"
            alt="Geometric background"
            fill
            className="object-cover"
            data-ai-hint="geometric memphis"
        />
        <div className="absolute inset-0 bg-black/30" />
        <Card className="w-full max-w-sm z-10 border-white/10 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    <Shield className="h-8 w-8" />
                </div>
                <CardTitle className="font-headline text-2xl">Console Access</CardTitle>
                <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                            className="h-11 bg-transparent border-white/20 focus:bg-background/20"
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required 
                            className="h-11 bg-transparent border-white/20 focus:bg-background/20"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} className="border-muted-foreground" />
                            <Label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground">Remember me</Label>
                        </div>
                        <Link
                            href="#"
                            className="ml-auto inline-block text-sm text-muted-foreground hover:text-primary"
                            >
                            Forgot Password?
                        </Link>
                    </div>
                    <Button type="submit" className="w-full h-11 mt-4 font-bold" disabled={isLoading}>
                        {isLoading ? 'Authenticating...' : 'Secure Login'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline font-semibold text-primary hover:text-primary/80">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
