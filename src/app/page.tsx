'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Video, FileText, HelpCircle, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 pt-14">
        {/* Hero Section */}
        <section 
          className="relative"
        >
          <Image
            src="/background.png"
            alt="Abstract background pattern"
            fill
            className="object-cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-background/60" />

          <div className="container relative px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-12 md:py-24">
              <div className="text-center md:text-left">
                <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                  Bharat's <span className="text-primary">Trusted &</span><br/>
                  <span className="text-primary">Affordable</span><br/>
                  Educational Platform
                </h1>
                <p className="mt-6 max-w-xl mx-auto md:mx-0 text-lg text-foreground/80">
                  Unlock your potential by signing up with Aviraj Info Tech-
                  The most affordable learning solution
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <Button asChild size="lg" className="rounded-md px-10 py-6 text-lg">
                    <Link href="/courses">
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
               <div className="relative h-96 md:h-full w-full flex items-center justify-center">
                      {/* Left Character (CEO) */}
                      <div className="relative transform -translate-x-16 translate-y-8">
                          {/* Dashed Circle */}
                          <div className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow"></div>
                          {/* Floating Dots */}
                          <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-orange-400 rounded-full"></div>
                          <div className="absolute -top-4 right-8 w-5 h-5 bg-blue-400 rounded-full"></div>
                          
                          {/* Image Container */}
                          <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg">
                              <Image
                                  src="/ceo.png"
                                  alt="Avanish Sir, CEO"
                                  width={224}
                                  height={224}
                                  className="object-cover absolute top-[-40px]"
                              />
                          </div>
                          {/* Speech Bubble */}
                          <div className="absolute bottom-12 left-[80%] w-56 bg-indigo-900 text-white p-3 rounded-lg shadow-xl z-10">
                              <p className="text-sm">"AIT is where students learn with love and can grow with guidance."</p>
                              {/* Triangle */}
                              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-indigo-900 border-b-8 border-b-transparent"></div>
                          </div>
                      </div>

                      {/* Right Character (Student) */}
                      <div className="relative transform translate-x-32 -translate-y-10">
                          {/* Dashed Circle */}
                          <div className="absolute -inset-4 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow [animation-direction:reverse]"></div>
                          {/* Floating Dots */}
                          <div className="absolute -top-4 -left-4 w-4 h-4 bg-pink-400 rounded-full"></div>
                          <div className="absolute -bottom-4 right-0 w-6 h-6 bg-cyan-400 rounded-full"></div>

                          {/* Image Container */}
                          <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-white shadow-lg">
                              <Image
                                  src="/student.png"
                                  alt="Student"
                                  width={224}
                                  height={224}
                                  className="object-cover"
                              />
                          </div>
                          {/* Speech Bubble */}
                          <div className="absolute top-8 right-[80%] w-48 bg-white text-black p-3 rounded-lg shadow-xl z-10">
                              <p className="text-sm">"Avanish Sir, What is AIT?"</p>
                              {/* Triangle */}
                              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-white border-b-8 border-b-transparent"></div>
                          </div>
                      </div>
                </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="relative -mt-40">
                  <Card className="shadow-2xl">
                    <CardContent className="p-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                       <div className="text-center flex flex-col items-center gap-2">
                           <div className="p-3 bg-red-100 rounded-lg">
                               <Video className="h-6 w-6 text-red-500"/>
                           </div>
                           <h3 className="font-bold text-lg">Daily Live</h3>
                           <p className="text-sm text-muted-foreground">Interactive classes</p>
                       </div>
                       <div className="text-center flex flex-col items-center gap-2">
                           <div className="p-3 bg-blue-100 rounded-lg">
                               <FileText className="h-6 w-6 text-blue-500"/>
                           </div>
                           <h3 className="font-bold text-lg">10 Million +</h3>
                           <p className="text-sm text-muted-foreground">Tests, sample papers & notes</p>
                       </div>
                       <div className="text-center flex flex-col items-center gap-2">
                           <div className="p-3 bg-purple-100 rounded-lg">
                               <HelpCircle className="h-6 w-6 text-purple-500"/>
                           </div>
                           <h3 className="font-bold text-lg">24 x 7</h3>
                           <p className="text-sm text-muted-foreground">Doubt solving sessions</p>
                       </div>
                       <div className="text-center flex flex-col items-center gap-2">
                           <div className="p-3 bg-yellow-100 rounded-lg">
                               <Award className="h-6 w-6 text-yellow-500"/>
                           </div>
                           <h3 className="font-bold text-lg">100 +</h3>
                           <p className="text-sm text-muted-foreground">Offline centres</p>
                       </div>
                    </CardContent>
                  </Card>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
