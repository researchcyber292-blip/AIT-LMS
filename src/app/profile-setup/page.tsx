import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile Setup - Aviraj Info Tech',
};

export default function ProfileSetupPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full">
      <Image
        src="/PAGE-2.png"
        alt="Profile Setup"
        fill
        className="object-cover"
      />
    </div>
  );
}
