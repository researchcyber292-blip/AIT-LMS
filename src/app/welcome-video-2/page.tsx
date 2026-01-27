'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function WelcomeVideo2Page() {
  const router = useRouter();

  const handleNext = () => {
    // I'll assume the next step is profile setup for now.
    router.push('/profile-setup');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        src="/2.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 text-center">
        <Button 
          onClick={handleNext} 
          size="lg" 
          className="rounded-full border-2 border-white/30 bg-white/10 px-12 py-6 text-lg font-bold text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/20"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
