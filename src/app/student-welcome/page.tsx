import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Welcome - Aviraj Info Tech',
};

export default function StudentWelcomePage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full">
      <Image
        src="/PAGE-1.png"
        alt="Welcome"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-end justify-center pb-[20%]">
        <Link 
          href="/profile-setup" 
          className="rounded-xl border-2 border-white/30 bg-transparent px-28 py-3 text-3xl font-semibold tracking-[0.3em] text-white/70 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
        >
          START
        </Link>
      </div>
    </div>
  );
}
