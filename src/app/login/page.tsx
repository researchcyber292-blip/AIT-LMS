'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [role, setRole] = useState<'student' | 'instructor'>('student');

  return (
    <div className="min-h-screen w-full bg-black text-gray-200">
      {/* Main Content */}
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left Side: Form */}
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">
              Log into your account
            </h1>
            
            <div className="mb-6">
                <p className="mb-3 font-medium text-center">I am logging in as a...</p>
                <RadioGroup defaultValue="student" onValueChange={(value: 'student' | 'instructor') => setRole(value)} className="grid grid-cols-2 gap-4">
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
              {role === 'student' && (
                <>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-700" /></div>
                    <div className="relative flex justify-center text-sm"><span className="bg-black px-2 uppercase text-muted-foreground">Login as a Student</span></div>
                  </div>
                  <Button size="lg" variant="outline" className="h-14 w-full justify-center border-gray-700 bg-transparent text-lg font-medium text-white hover:bg-gray-900 hover:text-white">
                    <svg viewBox="0 0 48 48" className="mr-2 h-6 w-6">
                        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                        <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A7.94 7.94 0 0 1 24 36c-4.418 0-8-3.582-8-8h-8c0 6.627 5.373 12 12 12z" />
                        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.45 44 30.634 44 24c0-1.341-.138-2.65-.389-3.917z" />
                    </svg> Login with Google
                  </Button>
                </>
              )}

              {role === 'instructor' && (
                <>
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-700" /></div>
                        <div className="relative flex justify-center text-sm"><span className="bg-black px-2 uppercase text-muted-foreground">Login as an Instructor</span></div>
                    </div>
                    <Button size="lg" className="h-14 w-full justify-center border border-gray-700 bg-black text-base font-bold text-white hover:bg-gray-800">
                        <div className="relative h-7 w-7 mr-2 rounded-full overflow-hidden flex items-center justify-center">
                            <Image
                                src="/image.png"
                                alt="Aviraj Info Tech Logo"
                                width={28}
                                height={28}
                                className="object-contain"
                            />
                        </div>
                        Aviraj Info Tech Console
                    </Button>
                </>
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

        {/* Right Side: Graphic */}
        <div className="relative hidden items-center justify-center md:flex">
             <Image
                src="https://picsum.photos/seed/loginbg/1000/1200"
                alt="Abstract background"
                fill
                className="object-cover opacity-20"
                data-ai-hint="abstract logo gradient"
            />
             <div className="absolute inset-0 bg-gradient-to-l from-gray-900/50 via-black to-black"></div>
        </div>
      </div>
    </div>
  );
}
