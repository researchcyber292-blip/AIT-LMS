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

        const collectionName = role === 'student' ? 'users' : 'instructors';
        const docRef = doc(firestore, collectionName, user.uid);
        const userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
            toast({ title: 'Login Successful' });
            router.push('/dashboard');
        } else {
            await auth.signOut();
            toast({ variant: 'destructive', title: 'Login Failed', description: `This account is not registered as a ${role}.` });
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

  const onRoleChange = (value: 'student' | 'instructor') => {
    setRole(value);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen pt-14 lg:pt-0">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[380px] gap-6">
            <div className="grid gap-2 text-center">
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-2">
                    <ShieldCheck className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold font-headline">Console Access</h1>
                <p className="text-balance text-muted-foreground">
                    Select your role and enter your credentials to continue
                </p>
            </div>
            
            <div className="mb-2">
                <RadioGroup defaultValue="student" onValueChange={onRoleChange} className="grid grid-cols-2 gap-4">
                    <div>
                        <RadioGroupItem value="student" id="student" className="peer sr-only" />
                        <Label
                        htmlFor="student"
                        className="flex h-12 flex-col items-center justify-center rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-semibold"
                        >
                        Student
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="instructor" id="instructor" className="peer sr-only" />
                        <Label
                        htmlFor="instructor"
                        className="flex h-12 flex-col items-center justify-center rounded-md border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer font-semibold"
                        >
                        Instructor
                        </Label>
                    </div>
                </RadioGroup>
            </div>
          
            <form onSubmit={handleLogin} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        required
                        className="h-11"
                    />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                        >
                        Forgot your password?
                        </Link>
                    </div>
                    <Input 
                        id="password" 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        required 
                        className="h-11"
                    />
                </div>
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : `Login as ${role}`}
                </Button>
            </form>

            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline">
                    Sign up
                </Link>
            </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <Image
          src="https://images.unsplash.com/photo-1549492423-400259a2e574?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBjaXR5fGVufDB8fHx8MTc3MDI4NDQyN3ww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cyberpunk city"
          data-ai-hint="cyberpunk city"
          fill
          className="h-full w-full object-cover dark:brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent"></div>
        <div className="absolute bottom-10 left-10 text-white max-w-md">
            <h2 className="text-3xl font-bold font-headline">"The future is already here – it's just not evenly distributed."</h2>
            <p className="mt-2 text-lg font-medium">- William Gibson</p>
        </div>
      </div>
    </div>
  );
}
