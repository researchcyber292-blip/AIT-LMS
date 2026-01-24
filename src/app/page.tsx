'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !sectionRef.current) return;
    
    let tl: gsap.core.Timeline | undefined;

    const onVideoMetadataLoaded = () => {
      setVideoLoaded(true);
      if (video.duration) {
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=5000',
            scrub: 1,
            pin: true,
          },
        });

        tl.to(video, {
          currentTime: video.duration,
        });
      }
    };
    
    const onVideoError = () => {
      setVideoLoaded(false);
    }

    video.addEventListener('loadedmetadata', onVideoMetadataLoaded);
    video.addEventListener('error', onVideoError);

    if (video.readyState >= 1) {
      onVideoMetadataLoaded();
    }

    return () => {
      video.removeEventListener('loadedmetadata', onVideoMetadataLoaded);
      video.removeEventListener('error', onVideoError);
      if (tl) {
        tl.scrollTrigger?.kill();
        tl.kill();
      }
    };
  }, []);

  return (
    <div>
      <section ref={sectionRef} className="relative h-screen w-full bg-black flex items-center justify-center">
        {!videoLoaded && (
          <div className="absolute z-10 text-center text-white p-4">
            <h2 className="text-2xl font-bold">Video not found</h2>
            <p className="mt-2">Please make sure you have placed your video file at <code className="bg-gray-800 p-1 rounded">public/video.mp4</code>.</p>
          </div>
        )}
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500"
          style={{ opacity: videoLoaded ? 1 : 0 }}
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      {/* This div creates scroll space for the animation */}
      <div className="h-[5000px]"></div>
    </div>
  );
}
