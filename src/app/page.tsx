'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [showOverlay, setShowOverlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onVideoEnd = () => {
      setShowOverlay(true);
    };

    // Add the event listener for when the video ends
    video.addEventListener('ended', onVideoEnd);

    // Attempt to play the video automatically
    video.play().catch(error => {
      // If autoplay is blocked by the browser, show the overlay immediately.
      console.error("Video autoplay was prevented:", error);
      setShowOverlay(true);
    });

    // Cleanup the event listener when the component unmounts
    return () => {
      video.removeEventListener('ended', onVideoEnd);
    };
  }, []); // The empty array ensures this effect runs only once on mount

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute top-1/2 left-1/2 min-h-full min-w-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* This overlay will appear with a fade-in effect when the video ends */}
      {showOverlay && (
        <div className="absolute inset-0 flex animate-in fade-in duration-1000 flex-col items-center justify-center bg-black/60 text-center text-white">
          <h1 className="font-headline text-5xl font-bold tracking-tight drop-shadow-xl md:text-7xl">
            AVIRAJ INFO TECH
          </h1>
          <p className="mt-4 max-w-2xl font-body text-xl text-gray-200 drop-shadow-lg md:text-2xl">
            CYBER SECURITY COURSES
          </p>
        </div>
      )}
    </div>
  );
}
