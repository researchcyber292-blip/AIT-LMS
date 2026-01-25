import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Getting Started - Aviraj Info Tech',
};

export default function GettingStartedPage() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full">
      <Image
        src="/PAGE-3.png"
        alt="Getting Started"
        fill
        className="object-cover"
      />
    </div>
  );
}
