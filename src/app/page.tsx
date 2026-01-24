'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sectionRef.current) return;
    
    let tl: gsap.core.Timeline | undefined;

    const setupScrollAnimation = () => {
      // Ensure video duration is available
      if (video.duration) {
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            pin: true,
          },
        });

        tl.to(video, {
          currentTime: video.duration,
        });
      }
    };

    // Wait for metadata to load to get video duration
    video.addEventListener('loadedmetadata', setupScrollAnimation);

    // If metadata is already loaded, run it.
    if (video.readyState >= 1) {
      setupScrollAnimation();
    }

    return () => {
      video.removeEventListener('loadedmetadata', setupScrollAnimation);
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  }, []);

  return (
    <div>
      <section ref={sectionRef} className="relative h-screen flex items-center justify-center text-center">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover -z-20"
          poster="https://images.pexels.com/videos/5361042/pictures/pexels-photo-5361042.jpeg"
        >
          {/* 
            Your video goes here. Place your video file in the `public` folder 
            and update the src path. For example, if your video is `my-video.mp4`, 
            the path would be `/my-video.mp4`.
          */}
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-background/60 -z-10"></div>
        <div className="z-10 p-8 bg-black/50 rounded-lg text-center">
            <h1 className="text-4xl font-bold text-white font-headline">Video Scroll Effect</h1>
            <p className="text-white/80 mt-2">Replace the placeholder at <code className="bg-white/20 px-2 py-1 rounded-md font-code text-sm">public/video.mp4</code> with your own video.</p>
        </div>
      </section>

      {/* This div creates scroll space */}
      <div className="h-screen"></div>
    </div>
  );
}
