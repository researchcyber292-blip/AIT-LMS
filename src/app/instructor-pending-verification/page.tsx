'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, MailCheck } from 'lucide-react';

export default function InstructorPendingPage() {
  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12 text-center">
      <div className="w-full max-w-lg">
        <div className="flex justify-center items-center gap-4">
            <MailCheck className="h-16 w-16 text-primary" />
            <Clock className="h-16 w-16 text-amber-500" />
        </div>
        <h1 className="mt-8 font-headline text-3xl font-bold text-foreground md:text-4xl">
          Application Submitted & Verification Pending
        </h1>
        <p className="mt-4 text-muted-foreground">
          Thank you for applying! We've sent a verification link to your email. Please click it to confirm your address. Your application is now under review by our team, and we will notify you once your account is approved.
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
