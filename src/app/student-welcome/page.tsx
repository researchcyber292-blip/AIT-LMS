import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome - Aviraj Info Tech',
};

export default function StudentWelcomePage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      >
        <source src="/1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 flex items-end justify-center bg-black/30 pb-24">
        <Link 
          href="/profile-setup" 
          className="rounded-full border-2 border-white/30 bg-transparent px-16 py-2 text-lg font-semibold tracking-widest text-white/70 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
        >
          START
        </Link>
      </div>
    </div>
  );
}
