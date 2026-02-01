
'use client';

import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/firebase';
import Loading from '@/app/loading';

export default function LiveClassesPage() {
  const { isUserLoading } = useUser();

  if (isUserLoading) {
    return <Loading />;
  }
  
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-12 md:py-16 text-center">
      <div className="max-w-2xl w-full">
        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
          <Video className="h-8 w-8" />
        </div>
        <h1 className="font-headline text-4xl font-bold">Live Classroom</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Join the public cybersecurity session.
        </p>
        
        <div className="mt-12 space-y-8">
            <div className="p-8 border rounded-lg bg-card">
                 <h2 className="font-headline text-2xl font-bold">Join the Public Stream</h2>
                 <p className="mt-2 text-muted-foreground">Click the button below to enter the live session.</p>
                 <Button asChild size="lg" className="mt-6">
                    <Link href="/live-classroom?room=avirajinfotech-cybersecurity-classlive">
                        Join Live Stream
                    </Link>
                 </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
                Want to host your own sessions? <Link href="/instructor-signup" className="underline text-primary">Become an instructor</Link>.
            </p>
        </div>
      </div>
    </div>
  );
}
