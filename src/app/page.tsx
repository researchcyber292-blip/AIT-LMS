'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { WhyChooseUs } from '@/components/landing/why-choose-us';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
    const mainRef = useRef(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (document.querySelector('.choose-us-section')) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.choose-us-section',
                        start: 'top top',
                        end: 'bottom bottom',
                        scrub: 1.5, // A bit of smoothing
                        pin: '.sticky-container',
                    },
                });

                // Stage 1: Fade out surrounding text and reveal image in 'O'
                const startFadeTime = 'start';
                tl.to(['.why-to', '.letter', '.us'], {
                    opacity: 0,
                    duration: 1,
                }, startFadeTime);
                tl.to('.choose-o-image-wrapper', {
                    opacity: 1,
                    duration: 0.5,
                }, `${startFadeTime}+=0.5`);

                // Stage 2: Zoom 'O' to fill screen and morph to rectangle
                const zoomTime = 'start+=1';
                tl.to('.choose-o', {
                    width: '100vw',
                    height: '100vh',
                    borderRadius: '0px',
                    borderWidth: '0px',
                    ease: 'power1.inOut',
                    duration: 2,
                }, zoomTime);
                
                // ALSO MORPH THE INNER IMAGE WRAPPER TO A RECTANGLE
                tl.to('.choose-o-image-wrapper', {
                    borderRadius: '0px',
                    ease: 'power1.inOut',
                    duration: 2,
                }, zoomTime);

                // Stage 3: Hold full screen view for a moment
                tl.to({}, {duration: 2});

                // Stage 4: Shrink image down, move to the right, and fade in the final text
                const shrinkTime = 'shrink';
                tl.to('.choose-o', {
                    width: 'min(45vw, 550px)', // The final width of the image
                    height: 'min(60vh, 420px)',// The final height of the image
                    x: '25vw', // Move it to the right half of the screen
                    ease: 'power2.inOut',
                    duration: 2,
                }, shrinkTime);

                tl.to('.final-text-container', {
                    opacity: 1,
                    ease: 'power2.inOut',
                    duration: 2,
                }, `${shrinkTime}+=1`); // Fade in the text after the shrink starts
                
                // Fade out the now-empty text container at the end of the shrink
                tl.to('.animated-text-container', {
                  opacity: 0,
                  duration: 1,
                }, shrinkTime)
            }
        }, mainRef);
        return () => ctx.revert();
    }, []);

  return (
    <div ref={mainRef}>
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
            <div className="bg-card border rounded-lg shadow-lg flex flex-col overflow-hidden">
              <div className="relative w-full aspect-[4/3]">
                <Image 
                  src="https://picsum.photos/seed/workspace/600/450"
                  alt="Live testing environment"
                  fill
                  className="object-cover"
                  data-ai-hint="live environment cyber"
                />
              </div>
              <div className="p-8 text-center flex flex-col flex-1">
                <h2 className="font-headline text-3xl font-bold flex-1 flex items-center justify-center min-h-[6rem]">Live Testing Environment with our Professional Teachers</h2>
                <Link href="/courses" className="mt-6 block w-full rounded-full border border-primary/40 bg-primary/20 py-3 text-center font-medium text-white backdrop-blur-sm transition-colors hover:border-primary/60 hover:bg-primary/30">
                    Open Workspace
                </Link>
              </div>
            </div>
            {/* Right Rectangle */}
            <div className="bg-card border rounded-lg shadow-lg flex flex-col overflow-hidden">
              <div className="relative w-full aspect-[4/3]">
                <Image 
                  src="https://picsum.photos/seed/teaching/600/450"
                  alt="Instructor teaching"
                  fill
                  className="object-cover"
                  data-ai-hint="teaching online"
                />
              </div>
              <div className="p-8 text-center flex flex-col flex-1">
                <h2 className="font-headline text-3xl font-bold">For Instructors</h2>
                <p className="mt-4 text-muted-foreground flex-1">Join our team of experts and share your knowledge with the world.</p>
                <Link href="/about" className="mt-6 block w-full rounded-full border border-primary/40 bg-primary/20 py-3 text-center font-medium text-white backdrop-blur-sm transition-colors hover:border-primary/60 hover:bg-primary/30">
                    Become an Instructor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <WhyChooseUs />
    </div>
  );
}
