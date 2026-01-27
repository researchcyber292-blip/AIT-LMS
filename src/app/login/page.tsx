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
              {role === 'student' && (
                <>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-700" /></div>
                    <div className="relative flex justify-center text-sm"><span className="bg-black px-2 uppercase text-muted-foreground">Login as a Student</span></div>
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
                    LOGIN WITH AIT
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
