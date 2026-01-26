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
            const targetO = document.querySelector('.choose-o-target');
            const animator = document.querySelector('.choose-o-animator') as HTMLElement;
            const animatorImage = document.querySelector('.animator-image');
            
            const finalContentContainer = document.querySelector('.final-content-container') as HTMLElement;
            const finalTargetO = finalContentContainer.querySelector('.final-o-target-new');
            const featuresGrid = document.querySelector('.features-grid');
            const finalImageWrapper = document.querySelector('.final-image-wrapper');

            if (!targetO || !animator || !animatorImage || !animator.parentElement || !finalContentContainer || !finalTargetO || !featuresGrid || !finalImageWrapper) return;
            
            // --- Pre-calculate final position of the 'O' ---
            // 1. Temporarily move the final container to its end state (visible and at the top).
            gsap.set(finalContentContainer, { top: '140px', yPercent: 0, opacity: 1 });
            // 2. Get the coordinates of the target 'O' in that final state.
            const finalRect = finalTargetO.getBoundingClientRect();
            // 2a. Set the text 'O' to be invisible initially.
            gsap.set(finalTargetO, { opacity: 0 }); 
            const parentRect = animator.parentElement.getBoundingClientRect();
            const finalO_position = {
                width: finalRect.width,
                height: finalRect.height,
                left: finalRect.left - parentRect.left,
                top: finalRect.top - parentRect.top,
            };
            // 3. Reset the final container to its starting state (centered and invisible).
            gsap.set(finalContentContainer, { top: '50%', yPercent: -50, opacity: 0 });
            // --- End pre-calculation ---

            // Set initial animator position based on the "CHOOSE" text 'O'
            const setInitialPosition = () => {
                if (!targetO) return;
                const rect = targetO.getBoundingClientRect();
                const parentRect = animator.parentElement!.getBoundingClientRect();

                gsap.set(animator, {
                    width: rect.width,
                    height: rect.height,
                    left: rect.left - parentRect.left,
                    top: rect.top - parentRect.top,
                    visibility: 'hidden',
                });
            };
            
            setInitialPosition();
            window.addEventListener('resize', setInitialPosition);

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: '.choose-us-section',
                    start: 'top top',
                    end: '+=600%',
                    scrub: 1.5,
                    pin: '.sticky-container',
                    invalidateOnRefresh: true, // This re-runs the layout effect on resize, recalculating everything.
                },
            });

            // Stage 1: Reveal animator and fade image in, while fading text out.
            tl.to(['.why-to', '.letter', '.us'], {
                opacity: 0,
                duration: 0.5,
            }, 'start')
            .set(animator, { visibility: 'visible' }, 'start')
            .to(animatorImage, { opacity: 1, duration: 0.5 }, 'start');

            // Stage 2: Zoom animator to fill the screen.
            const zoomTime = 'start';
            tl.to(animator, {
                width: '100vw',
                height: '100vh',
                top: 0,
                left: 0,
                borderRadius: '0px',
                borderWidth: '0px',
                ease: 'power1.inOut',
                duration: 2,
            }, zoomTime);
            
            tl.to(animator.querySelector('.relative'), {
                borderRadius: '0px',
                ease: 'power1.inOut',
                duration: 2,
            }, zoomTime);

            // Stage 3: Hold the full screen view
            tl.to({}, {duration: 1});

            // --- REBUILT FINAL SEQUENCE ---
            const finalSequenceTime = 'finalSequence';

            // Step A: Shrink circle to its PRE-CALCULATED final position.
            tl.to(animator, {
                duration: 2,
                ease: 'power2.inOut',
                width: finalO_position.width,
                height: finalO_position.height,
                left: finalO_position.left,
                top: finalO_position.top,
                borderRadius: '9999px',
                borderWidth: '8px'
            }, finalSequenceTime);
            tl.to(animator.querySelector('.relative'), {
                borderRadius: '9999px',
                ease: 'power2.inOut',
                duration: 2,
            }, finalSequenceTime);

            // Step B: AT THE SAME TIME, move the final content container up into its final position.
            tl.to(finalContentContainer, {
                top: '140px',
                yPercent: 0,
                opacity: 1,
                ease: "power2.inOut",
                duration: 2
            }, finalSequenceTime);
            
            // Step C: After the circle and text are in place, fade the circle image out and the text 'O' in.
            const fadeSwapTime = `${finalSequenceTime}+=1.5`;
            tl.to(animatorImage, { opacity: 0, duration: 0.5 }, fadeSwapTime)
              .to(finalTargetO, { opacity: 1, duration: 0.5 }, fadeSwapTime)
              .set(animator, { visibility: 'hidden' });


            // Step D: Reveal the features.
            const revealFeaturesTime = `${finalSequenceTime}+=2.2`;
            gsap.set(featuresGrid, { y: 50, opacity: 0 }); // Set initial state for reveal
            
            tl.to(featuresGrid, {
                opacity: 1,
                y: 0,
                ease: "power2.out",
                duration: 1.5
            }, revealFeaturesTime);

            // Step E: Reveal the image on more scroll.
            tl.to(finalImageWrapper, {
                opacity: 1,
                ease: 'power2.out',
                duration: 1.5
            }, `${revealFeaturesTime}+=1.5`);

            // Cleanup function to remove the event listener.
            return () => {
                window.removeEventListener('resize', setInitialPosition);
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
