'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();


  const handleStudentLogin = async (e: React.FormEvent) => {
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

        // Verify it is a student account by checking the 'users' collection
        const studentDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (!studentDoc.exists()) {
            await auth.signOut();
            toast({ variant: 'destructive', title: 'Login Failed', description: 'This account is not registered as a student.' });
        } else {
            toast({ title: 'Login Successful' });
            router.push('/dashboard'); 
        }
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

  const handleInstructorLogin = async (e: React.FormEvent) => {
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

        // Verify it is an instructor account by checking the 'instructors' collection
        const instructorDocRef = doc(firestore, 'instructors', user.uid);
        const instructorDoc = await getDoc(instructorDocRef);

        if (instructorDoc.exists()) {
            // The OnboardingGuard will handle redirects based on status.
            // Just log in and go to the main entry point.
            toast({ title: 'Instructor Login Successful' });
            router.push('/dashboard');
        } else {
            await auth.signOut();
            toast({ variant: 'destructive', title: 'Login Failed', description: 'This account is not registered as an instructor.' });
        }
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
  
  // Clear email and password fields when switching roles for better UX
  const onRoleChange = (value: 'student' | 'instructor') => {
    setRole(value);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen w-full bg-secondary/50 text-foreground">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <CardTitle className="font-headline text-2xl">
              Console Access
            </CardTitle>
            <CardDescription>
              Log into your account to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
                <RadioGroup defaultValue="student" onValueChange={onRoleChange} className="grid grid-cols-2 gap-4">
                    <div>
                        <RadioGroupItem value="student" id="student" className="peer sr-only" />
                        <Label
                        htmlFor="student"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                        Student
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="instructor" id="instructor" className="peer sr-only" />
                        <Label
                        htmlFor="instructor"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                        Instructor
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="flex flex-col gap-4">
                {role === 'student' ? (
                    <form onSubmit={handleStudentLogin} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="h-12"
                            autoComplete="email"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="h-12"
                            autoComplete="current-password"
                        />
                        <Button type="submit" size="lg" className="h-12 w-full justify-center text-base font-bold" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login as Student'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleInstructorLogin} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Instructor Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="h-12"
                            autoComplete="email"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="h-12"
                            autoComplete="current-password"
                        />
                        <Button type="submit" size="lg" className="h-12 w-full justify-center text-base font-bold" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login as Instructor'}
                        </Button>
                    </form>
              )}
            </div>
            
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
