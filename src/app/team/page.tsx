import { HardHat } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Team - Aviraj Info Tech',
};

export default function TeamPage() {
  return (
    <div className="container py-24 text-center">
      <HardHat className="mx-auto h-24 w-24 text-muted-foreground/50" />
      <h1 className="mt-8 text-4xl font-bold font-headline">Under Construction</h1>
      <p className="text-muted-foreground mt-4">Our team page is currently being built. Check back soon!</p>
    </div>
  );
}
