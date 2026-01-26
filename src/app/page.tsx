'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 min-h-full min-w-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-center text-white">
          <h1 className="font-stylish text-5xl font-bold tracking-tight drop-shadow-xl md:text-7xl">
            AVIRAJ INFO TECH
          </h1>
          <p className="mt-6 max-w-2xl font-body text-2xl text-gray-200 drop-shadow-lg md:text-3xl">
            CYBER SECURITY COURSES
          </p>
          <Link
            href="/courses"
            className="mt-10 rounded-full border border-white/40 bg-black/20 px-10 py-3 text-lg font-medium text-white backdrop-blur-md transition-all hover:border-white/70 hover:bg-white/10"
          >
            Get Started
          </Link>

          <div className="absolute bottom-10 animate-bounce">
            <a href="#main-content" aria-label="Scroll to next section">
                <ArrowDown className="h-8 w-8 text-white/70" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div id="main-content" className="bg-background scroll-mt-14 py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Rectangle */}
            <div className="bg-card border rounded-lg shadow-lg h-[600px] flex flex-col items-center justify-center p-8 text-center">
              <h2 className="font-headline text-3xl font-bold">For Students</h2>
              <p className="mt-4 text-muted-foreground">Enroll in our courses and start your journey in cybersecurity.</p>
              <Button asChild className="mt-6">
                <Link href="/courses">Browse Courses</Link>
              </Button>
            </div>
            {/* Right Rectangle */}
            <div className="bg-card border rounded-lg shadow-lg h-[600px] flex flex-col items-center justify-center p-8 text-center">
              <h2 className="font-headline text-3xl font-bold">For Instructors</h2>
              <p className="mt-4 text-muted-foreground">Join our team of experts and share your knowledge with the world.</p>
              <Button asChild variant="secondary" className="mt-6">
                <Link href="/about">Become an Instructor</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
