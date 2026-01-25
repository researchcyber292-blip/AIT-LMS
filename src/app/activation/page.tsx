'use client';

import Link from 'next/link';

export default function ActivationPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <video
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      >
        <source src="/4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 flex items-end justify-center pb-24">
        <Link
          href="/dashboard"
          className="rounded-full border-2 border-white/30 bg-black/50 px-16 py-2 text-lg font-semibold tracking-widest text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/20"
        >
          GO TO DASHBOARD
        </Link>
      </div>
    </div>
  );
}
