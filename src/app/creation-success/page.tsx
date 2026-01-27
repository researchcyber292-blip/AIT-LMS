
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function CreationSuccessPage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background p-4 text-center">
      <div className="w-full max-w-md">
        <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
        <h1 className="mt-8 font-headline text-3xl font-bold text-foreground md:text-4xl">
          You have successfully created your account!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Welcome to Aviraj Info Tech. You're all set to start your learning journey.
        </p>
        <Button asChild size="lg" className="mt-12 rounded-full px-10 py-6 text-lg">
          <Link href="/dashboard">
            Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
