'use client';

import Link from "next/link";
import Image from "next/image";
import imageData from '@/lib/placeholder-images.json';
import { ArrowRight } from "lucide-react";

const signupImage = imageData.placeholderImages.find(img => img.id === 'login-clouds');

export default function SignUpPage() {

  return (
    <div className="w-full min-h-screen bg-[#F8F7FA]">
       <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
          <div className="flex flex-col items-center justify-center p-8">
             <div className="w-full max-w-sm">
                <h1 className="text-4xl font-light text-[#333] mb-4">create account</h1>
                <p className="text-muted-foreground mb-8">Choose your role to get started.</p>
                
                <div className="space-y-6">
                    <Link href="/student-welcome" className="block">
                        <div className="group flex items-center justify-between rounded-lg border-2 border-gray-200 p-6 hover:border-[#4B0082] transition-all">
                            <div>
                                <h2 className="text-lg font-semibold text-[#333] group-hover:text-[#4B0082]">Sign up as a Student</h2>
                                <p className="text-sm text-muted-foreground">Access courses, track progress, and join our community.</p>
                            </div>
                            <ArrowRight className="h-6 w-6 text-gray-300 group-hover:text-[#4B0082] transition-colors" />
                        </div>
                    </Link>

                     <Link href="/instructor-signup" className="block">
                        <div className="group flex items-center justify-between rounded-lg border-2 border-gray-200 p-6 hover:border-[#4B0082] transition-all">
                            <div>
                                <h2 className="text-lg font-semibold text-[#333] group-hover:text-[#4B0082]">Become an Instructor</h2>
                                <p className="text-sm text-muted-foreground">Create courses, share your knowledge, and earn money.</p>
                            </div>
                            <ArrowRight className="h-6 w-6 text-gray-300 group-hover:text-[#4B0082] transition-colors" />
                        </div>
                    </Link>
                </div>
                
                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-[#4B0082] hover:text-[#3A006A] underline">
                        Log in
                    </Link>
                </p>
             </div>
          </div>
          <div className="hidden md:block relative">
             {signupImage && (
                <Image
                  src={signupImage.imageUrl}
                  alt={signupImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={signupImage.imageHint}
                />
             )}
          </div>
       </div>
    </div>
  );
}
