'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 text-center">
      <div className="w-full max-w-3xl">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-8 font-headline text-2xl font-bold uppercase tracking-wider text-foreground md:text-4xl">
          You have successfully logged in to
        </h1>
        <p className="mt-2 font-stylish text-3xl text-primary md:text-5xl">
          Aviraj Info Tech Cyber Security Console
        </p>
        <Button asChild size="lg" className="mt-12 rounded-full px-10 py-6 text-lg">
          <Link href="/profile-setup">
            Begin Setup <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
