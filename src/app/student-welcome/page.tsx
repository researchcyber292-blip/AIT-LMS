'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function StudentWelcomePage() {
  const auth = useAuth();
  const router = useRouter();

  const handleStart = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // The OnboardingGuard will take over after successful sign-in
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Google Sign-In Error", error);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <video
        src="/1.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-20 text-center">
        <Button onClick={handleStart} size="lg" className="rounded-full px-12 py-6 text-lg font-bold">
          Start
        </Button>
      </div>
    </div>
  );
}
