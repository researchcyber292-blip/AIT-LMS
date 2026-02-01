'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export default function InstructorPendingPage() {
  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12 text-center">
      <div className="w-full max-w-lg">
        <Clock className="mx-auto h-20 w-20 text-amber-500" />
        <h1 className="mt-8 font-headline text-3xl font-bold text-foreground md:text-4xl">
          Application Submitted
        </h1>
        <p className="mt-4 text-muted-foreground">
          Thank you for applying! Your application is now under review by our team. We will notify you via email once your account has been approved.
        </p>
        <div className="mt-8">
            <Button asChild>
                <Link href="/">
                    Return to Home
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
