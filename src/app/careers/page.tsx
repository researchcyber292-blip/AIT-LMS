import { Briefcase } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers - Aviraj Info Tech',
};

export default function CareersPage() {
  return (
    <div className="container py-24 text-center">
      <Briefcase className="mx-auto h-24 w-24 text-muted-foreground/50" />
      <h1 className="mt-8 text-4xl font-bold font-headline">Careers Page Coming Soon</h1>
      <p className="text-muted-foreground mt-4">We're working on our careers page. Please check back later for exciting opportunities.</p>
    </div>
  );
}
