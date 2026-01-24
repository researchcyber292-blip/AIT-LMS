'use client';

import { useRef, useEffect } from 'react';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // We need to wait for the video's metadata to be loaded to get its duration.
    video.onloadedmetadata = () => {
      const handleScroll = () => {
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or more
          const scrollPosition = window.scrollY;
          const windowHeight = window.innerHeight;
          
          // Let the animation play out over the first screen height
          const scrollFraction = Math.min(scrollPosition / (windowHeight * 0.8), 1);
          
          video.currentTime = video.duration * scrollFraction;
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Set initial time in case the page is reloaded at a scroll position
      handleScroll();

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center">
        <video
          ref={videoRef}
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover -z-20"
          poster="https://images.pexels.com/videos/5361042/pictures/pexels-photo-5361042.jpeg"
          preload="auto"
        >
          <source src="https://videos.pexels.com/video-files/5361042/5361042-hd_1920_1080_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute top-0 left-0 w-full h-full bg-background/60 -z-10"></div>
      </section>

      {/* This div creates scroll space */}
      <div className="h-screen"></div>
    </div>
  );
}
