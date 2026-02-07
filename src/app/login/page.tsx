'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import imageData from '@/lib/placeholder-images.json';

const loginImage = imageData.placeholderImages.find(img => img.id === 'login-clouds');

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="w-full min-h-screen bg-[#F8F7FA]">
       <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
          <div className="flex flex-col items-center justify-center p-8">
             <div className="w-full max-w-sm">
                <h1 className="text-4xl font-light text-[#333] mb-8">log in</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                   <div className="relative">
                       <User className="absolute top-1/2 -translate-y-1/2 left-0 h-5 w-5 text-muted-foreground" />
                       <input
                           id="email"
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           disabled={isLoading}
                           required
                           placeholder="Username"
                           autoComplete="email"
                           className="w-full pl-8 pb-2 border-b-2 border-gray-200 bg-transparent text-base focus:outline-none focus:border-[#4B0082] transition-colors"
                       />
                   </div>
                   <div className="relative">
                       <Lock className="absolute top-1/2 -translate-y-1/2 left-0 h-5 w-5 text-muted-foreground" />
                       <input
                           id="password"
                           type={showPassword ? "text" : "password"}
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           disabled={isLoading}
                           required
                           placeholder="Password"
                           autoComplete="current-password"
                           className="w-full pl-8 pb-2 border-b-2 border-gray-200 bg-transparent text-base focus:outline-none focus:border-[#4B0082] transition-colors"
                       />
                       <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                       </button>
                   </div>
                   <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember-me" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(checked as boolean)} />
                            <label htmlFor="remember-me" className="font-medium text-muted-foreground leading-none">Remember me</label>
                        </div>
                        <Link
                            href="#"
                            className="font-medium text-muted-foreground hover:text-[#4B0082]"
                            >
                            Forgot Password?
                        </Link>
                    </div>
                   <Button type="submit" className="w-full h-12 mt-4 font-bold bg-[#4B0082] hover:bg-[#3A006A] text-white text-lg" disabled={isLoading}>
                       {isLoading ? 'Logging in...' : 'Log in'}
                   </Button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                    or{' '}
                    <Link href="/signup" className="font-semibold text-[#4B0082] hover:text-[#3A006A] underline">
                        Sign up
                    </Link>
                </p>
             </div>
          </div>
          <div className="hidden md:block relative">
             {loginImage && (
                <Image
                  src={loginImage.imageUrl}
                  alt={loginImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={loginImage.imageHint}
                />
             )}
          </div>
       </div>
    </div>
  );
}
