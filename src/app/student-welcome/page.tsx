import Image from 'next/image';
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
    </div>
  );
}
