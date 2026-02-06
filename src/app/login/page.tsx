
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

        // Try to find user as a student first
        let docRef = doc(firestore, 'users', user.uid);
        let userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
            toast({ title: 'Login Successful' });
            router.push('/dashboard');
            return;
        }

        // If not a student, check if they are an instructor
        docRef = doc(firestore, 'instructors', user.uid);
        userDoc = await getDoc(docRef);

        if (userDoc.exists()) {
            toast({ title: 'Login Successful' });
            router.push('/dashboard');
            return;
        }

        // If not found in either collection, it's an invalid user for this app's context
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
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen pt-14 lg:pt-0 bg-[#FEFCF8]">
      <div className="hidden bg-muted lg:flex items-center justify-center p-12 relative overflow-hidden bg-[#FEF5E5]">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white/50 rounded-full" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-white/50 rounded-full" />
        <Image
          src="https://eduvouchers.com/wp-content/uploads/2022/10/account-login.png"
          alt="Login illustration"
          data-ai-hint="person laptop security"
          width={500}
          height={500}
          className="object-contain z-10"
        />
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[380px] gap-6">
            <div className="grid gap-2">
                <h1 className="text-3xl font-bold text-gray-800">Account Login</h1>
                <p className="text-balance text-muted-foreground">
                    If you are already a member you can login with your email address and password.
                </p>
            </div>
            
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
                        className="h-11 bg-white"
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
                        className="h-11 bg-white"
                    />
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                        <Label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600">Remember me</Label>
                    </div>
                    <Link
                        href="#"
                        className="ml-auto inline-block text-sm text-gray-600 hover:text-gray-900"
                        >
                        Forgot Password?
                    </Link>
                </div>
                <Button type="submit" className="w-full h-11 bg-[#FDBF33] text-black hover:bg-[#FDBF33]/90 mt-4" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>
            </form>

            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline font-semibold text-gray-800">
                    Sign up
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
