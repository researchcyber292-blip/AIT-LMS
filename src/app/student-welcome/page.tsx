
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function StudentWelcomePage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/welcome-video-2');
  };

  return (
    <div className="relative mt-14 h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <video
        src="/1.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      {/* The dark overlay has been removed to make the video full brightness */}
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 text-center">
        <Button 
          onClick={handleStart} 
          size="lg" 
          className="rounded-full border-2 border-white/30 bg-white/10 px-12 py-6 text-lg font-bold text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/20"
        >
          Start
        </Button>
      </div>
    </div>
  );
}
