
'use client';

import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen w-full bg-black text-gray-200">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">
              Log into your account
            </h1>
            
            <div className="mb-6">
                <p className="mb-3 font-medium text-center">I am logging in as a...</p>
                <RadioGroup defaultValue="student" onValueChange={onRoleChange} className="grid grid-cols-2 gap-4">
                    <div>
                        <RadioGroupItem value="student" id="student" className="peer sr-only" />
                        <Label
                        htmlFor="student"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white/5 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                        Student
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="instructor" id="instructor" className="peer sr-only" />
                        <Label
                        htmlFor="instructor"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white/5 p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                        >
                        Instructor
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="flex flex-col gap-4">
                {role === 'student' ? (
                    <form onSubmit={handleStudentLogin} className="space-y-4">
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-700" /></div>
                            <div className="relative flex justify-center text-sm"><span className="bg-black px-2 uppercase text-muted-foreground">Login as a Student</span></div>
                        </div>
                        
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="h-12 bg-transparent border-white/20"
                            autoComplete="email"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="h-12 bg-transparent border-white/20"
                            autoComplete="current-password"
                        />

                        <Button type="submit" size="lg" className="h-14 w-full justify-center border border-gray-700 bg-black text-base font-bold text-white hover:bg-gray-800" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'LOGIN WITH AIT'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleInstructorLogin} className="space-y-4">
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-700" /></div>
                            <div className="relative flex justify-center text-sm"><span className="bg-black px-2 uppercase text-muted-foreground">Login as an Instructor</span></div>
                        </div>
                        
                        <Input
                            type="email"
                            placeholder="Instructor Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="h-12 bg-transparent border-white/20"
                            autoComplete="email"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="h-12 bg-transparent border-white/20"
                            autoComplete="current-password"
                        />
                        <Button type="submit" size="lg" className="h-14 w-full justify-center border border-gray-700 bg-black text-base font-bold text-white hover:bg-gray-800" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'LOGIN AS INSTRUCTOR'}
                        </Button>
                    </form>
              )}
            </div>
            
            <p className="mt-8 text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/about" className="font-semibold text-white hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="relative hidden items-center justify-center overflow-hidden md:flex">
            <Image
                src="/LOGINPAGE.png"
                alt="Abstract background"
                fill
                className="object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                <h2 className="font-headline text-4xl font-bold tracking-tight drop-shadow-md md:text-5xl">WELCOME TO</h2>
                <h1 className="font-headline text-5xl font-bold tracking-tight drop-shadow-lg md:text-6xl mt-2">AVIRAJ INFO TECH</h1>
            </div>
        </div>
      </div>
    </div>
  );
}
