'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [role, setRole] = useState<'student' | 'instructor'>('student');

  return (
    <div className="w-full bg-background text-foreground pt-14">
      {/* Main Content */}
      <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 md:grid-cols-2">
        {/* Left Side: Form */}
        <div className="flex flex-col items-center justify-center p-8">
          
          <div className="w-full max-w-md">
            <h1 className="mb-8 text-4xl font-headline font-bold tracking-tight text-foreground">
              Create your account
            </h1>
            
            <div className="mb-6">
                <p className="mb-3 font-medium text-center">I am creating an account for a...</p>
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
                    <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-border" /></div>
                    <div className="relative flex justify-center text-sm"><span className="bg-background px-2 uppercase text-muted-foreground">Sign up as a Student</span></div>
                  </div>
                  <Button asChild size="lg" className="h-14 w-full justify-center border border-input bg-background text-base font-bold text-foreground hover:bg-muted">
                    <Link href="/student-welcome">
                      <div className="relative h-7 w-7 mr-2 rounded-full overflow-hidden flex items-center justify-center">
                          <Image
                              src="/image.png"
                              alt="Aviraj Info Tech Logo"
                              width={28}
                              height={28}
                              className="object-contain"
                          />
                      </div>
                      CREATE WITH AIT CONSOLE
                    </Link>
                  </Button>
                </>
              )}

              {role === 'instructor' && (
                <>
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-border" /></div>
                        <div className="relative flex justify-center text-sm"><span className="bg-background px-2 uppercase text-muted-foreground">Sign up as an Instructor</span></div>
                    </div>
                    <Button asChild size="lg" className="h-14 w-full justify-center border border-input bg-background text-base font-bold text-foreground hover:bg-muted">
                        <Link href="/instructor-signup">
                            <div className="relative h-7 w-7 mr-2 rounded-full overflow-hidden flex items-center justify-center">
                                <Image
                                    src="/image.png"
                                    alt="Aviraj Info Tech Logo"
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                />
                            </div>
                            Create Instructor Account
                        </Link>
                    </Button>
                </>
              )}
            </div>
             <p className="mt-4 text-center text-xs text-muted-foreground">
                By signing up, you agree to the <Link href="#" className="underline hover:text-primary">Terms of Service</Link> and <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>, including <Link href="#" className="underline hover:text-primary">Cookie Use</Link>.
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
