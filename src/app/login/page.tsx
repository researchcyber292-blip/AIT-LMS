
'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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

      // Check if user is an instructor first
      let docRef = doc(firestore, 'instructors', user.uid);
      let userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        const instructorData = userDoc.data();
        if (instructorData.accountStatus === 'pending') {
          router.push('/instructor-pending-verification');
        } else if (instructorData.accountStatus === 'rejected' || instructorData.accountStatus === 'banned') {
          router.push(`/instructor-access-denied?status=${instructorData.accountStatus}`);
        } else if (instructorData.accountStatus === 'active' && !instructorData.photoURL) {
          router.push('/instructor-avatar-selection');
        } else {
          toast({ title: 'Login Successful' });
          router.push('/dashboard');
        }
        return; // Stop execution after handling instructor
      }
      
      // If not an instructor, check if user is a student
      docRef = doc(firestore, 'users', user.uid);
      userDoc = await getDoc(docRef);

      if (userDoc.exists()) {
        toast({ title: 'Login Successful' });
        router.push('/dashboard');
        return; // Stop execution after handling student
      }
      
      // If user document doesn't exist in either collection
      await auth.signOut();
      toast({ variant: 'destructive', title: 'Login Failed', description: 'This account is not registered. Please sign up.' });

    } catch (error: any) {
      let description = 'An unexpected error occurred.';
      switch (error.code) {
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
    <div className="w-full min-h-screen bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        <div className="hidden md:block relative">
            <Image
                src="/login.png"
                alt="Cyber security concept"
                fill
                className="object-cover"
            />
        </div>
        <div className="w-full bg-[#0D0D0D] text-white flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 z-0" style={{backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
            <div className="w-full max-w-sm z-10">
                <h1 className="text-5xl font-light">Log in</h1>
                <p className="text-gray-400 mt-2 mb-8">Welcome back! Please enter your details.</p>
                
                <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <Label htmlFor="email" className="text-sm text-gray-400">E-mail</Label>
                    <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                    autoComplete="email"
                    className="w-full mt-2 bg-[#1F1F1F] border-0 rounded-lg text-white placeholder-gray-500 h-12 px-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                    />
                </div>
                <div>
                    <Label htmlFor="password" className="text-sm text-gray-400">Password</Label>
                    <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    autoComplete="current-password"
                    className="w-full mt-2 bg-[#1F1F1F] border-0 rounded-lg text-white placeholder-gray-500 h-12 px-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                    />
                </div>
                
                <div className="flex items-center justify-end text-sm pt-2">
                    <Link
                        href="#"
                        className="font-medium text-blue-500 hover:underline"
                        >
                        Forgot Password?
                    </Link>
                </div>

                <Button type="submit" className="w-full h-12 !mt-6 font-semibold bg-blue-600 hover:bg-blue-700 text-white text-base rounded-lg" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Log in'}
                </Button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link href="/register" className="font-semibold text-blue-500 hover:underline">
                    Sign up
                </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
