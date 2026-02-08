
'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { UserProfile } from "@/lib/types";

const registerSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters.' }),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit Indian mobile number.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      mobileNumber: '',
      email: '',
      password: '',
    },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const handleRegister = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: data.username });

      // Create user profile in Firestore
      const userProfileData = {
        id: user.uid,
        name: data.username,
        username: data.username,
        email: data.email,
        mobileNumber: data.mobileNumber,
        onboardingStatus: 'active', // Go straight to active
        publicChatStats: {
          messageCount: 0,
          weekStartTimestamp: new Date(0) // Initialize with a past date
        }
      };
      await setDoc(doc(firestore, "users", user.uid), userProfileData);

      toast({
        title: "Account Created Successfully!",
        description: "Welcome! You are now logged in.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      let description = "An unexpected error occurred during registration.";
      switch (error.code) {
        case "auth/email-already-in-use":
          description = "This email is already registered. Please try logging in.";
          break;
        case "auth/weak-password":
          description = "The password is too weak. Please choose a stronger password.";
          break;
        default:
          description = error.message;
          break;
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description,
      });
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
            <h1 className="text-5xl font-light">Sign Up</h1>
            <p className="text-gray-400 mt-2 mb-8">Create your account to get started.</p>
            
            <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-sm text-gray-400">Username</Label>
                <Input
                  id="username"
                  type="text"
                  {...register("username")}
                  disabled={isLoading}
                  className="w-full mt-2 bg-[#1F1F1F] border-0 rounded-lg text-white placeholder-gray-500 h-12 px-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
              </div>
              <div>
                <Label htmlFor="mobileNumber" className="text-sm text-gray-400">Mobile Number</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  {...register("mobileNumber")}
                  disabled={isLoading}
                  className="w-full mt-2 bg-[#1F1F1F] border-0 rounded-lg text-white placeholder-gray-500 h-12 px-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                />
                {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber.message}</p>}
              </div>
              <div>
                <Label htmlFor="email" className="text-sm text-gray-400">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  disabled={isLoading}
                  className="w-full mt-2 bg-[#1F1F1F] border-0 rounded-lg text-white placeholder-gray-500 h-12 px-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="password" className="text-sm text-gray-400">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  disabled={isLoading}
                  className="w-full mt-2 bg-[#1F1F1F] border-0 rounded-lg text-white placeholder-gray-500 h-12 px-4 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              
              <Button type="submit" className="w-full h-12 !mt-6 font-semibold bg-blue-600 hover:bg-blue-700 text-white text-base rounded-lg" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

    