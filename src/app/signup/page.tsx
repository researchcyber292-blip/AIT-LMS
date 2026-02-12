
'use client';

import Link from "next/link";
import Image from "next/image";
import imageData from '@/lib/placeholder-images.json';
import { ArrowRight, User, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const signupImage = imageData.placeholderImages.find(img => img.id === 'hero-background-pastel');

export default function SignUpPage() {

  return (
    <div className="relative w-full min-h-screen">
       {signupImage && (
          <Image
            src={signupImage.imageUrl}
            alt={signupImage.description}
            fill
            className="object-cover"
            data-ai-hint={signupImage.imageHint}
          />
       )}
       <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
       
       <div className="relative flex flex-col items-center justify-center min-h-screen p-8 pt-24">
          <div className="w-full max-w-2xl text-center">
            <h1 className="text-4xl font-bold font-headline text-primary">Join Our Community</h1>
            <p className="text-muted-foreground mt-2 mb-10 text-lg">Choose your path and let's get started on your journey.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link href="/register">
                    <Card className="group text-left h-full transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 cursor-pointer">
                        <CardHeader>
                            <div className="p-3 bg-blue-100 dark:bg-primary/10 rounded-full w-fit mb-4">
                                <User className="h-8 w-8 text-blue-600 dark:text-primary" />
                            </div>
                            <CardTitle className="font-headline">Sign up as a Student</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Access courses, track progress, and join a vibrant learning community.</CardDescription>
                            <div className="flex items-center mt-6 font-semibold text-primary">
                                Get Started <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/instructor-signup">
                     <Card className="group text-left h-full transition-all duration-300 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 cursor-pointer">
                        <CardHeader>
                            <div className="p-3 bg-blue-100 dark:bg-primary/10 rounded-full w-fit mb-4">
                                <Briefcase className="h-8 w-8 text-blue-600 dark:text-primary" />
                            </div>
                            <CardTitle className="font-headline">Become an Instructor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Create courses, share your knowledge, and build your brand.</CardDescription>
                            <div className="flex items-center mt-6 font-semibold text-primary">
                                Start Teaching <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
            
            <p className="mt-12 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                    Log in
                </Link>
            </p>
          </div>
       </div>
    </div>
  );
}
