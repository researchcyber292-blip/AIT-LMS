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
          <source src="https://videos.pexels.com/video-files/853880/853880-hd_1920_1080_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-background/60 -z-10"></div>
      </section>

      {/* This div creates scroll space */}
      <div className="h-screen"></div>
    </div>
  );
}
