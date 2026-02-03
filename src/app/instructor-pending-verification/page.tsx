'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, Mail } from 'lucide-react';

export default function InstructorPendingPage() {
  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12 text-center">
      <div className="w-full max-w-lg">
        <Clock className="mx-auto h-20 w-20 text-amber-500" />
        <h1 className="mt-8 font-headline text-3xl font-bold text-foreground md:text-4xl">
          Approval Pending
        </h1>
        <p className="mt-4 text-muted-foreground">
          Your instructor account is currently awaiting approval from our team. You will be notified via email once the review is complete.
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <Button asChild variant="secondary">
                <Link href="/">
                    Return to Home
                </Link>
            </Button>
            <Button asChild>
                <Link href="/contact">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Support
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
