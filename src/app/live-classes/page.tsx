'use client';

import { useState } from 'react';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Mic, Video } from 'lucide-react';
import Loading from '@/app/loading';
import type { Instructor } from '@/lib/types';
import Link from 'next/link';

export default function LiveClassesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Check if the current user is an instructor
  const instructorDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'instructors', user.uid);
  }, [firestore, user]);
  const { data: instructor, isLoading: isInstructorLoading } = useDoc<Instructor>(instructorDocRef);

  const isLoading = isUserLoading || isInstructorLoading;

  if (isLoading) {
    return <Loading />;
  }

  // If the current user is an instructor...
  if (user && instructor) {
    if (isSessionActive) {
      // Show the Jitsi iframe if a session has been started
      return (
        <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col pt-14">
          <div className="flex justify-between items-center p-4 border-b bg-card">
            <h1 className="font-headline text-xl font-bold">Moderated Live Session</h1>
            <Button variant="destructive" onClick={() => setIsSessionActive(false)}>End Session</Button>
          </div>
          <div className="flex-1 w-full bg-black">
            <iframe
              src="https://moderated.jitsi.net/"
              allow="camera; microphone; fullscreen; display-capture"
              className="w-full h-full border-0"
              title="Jitsi Meet Moderated Session"
            ></iframe>
          </div>
        </div>
      );
    }

    // Show the "Start Session" button to the instructor
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-12 md:py-16 text-center">
        <div>
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <Mic className="h-8 w-8" />
            </div>
            <h1 className="font-headline text-4xl font-bold">Instructor Control Panel</h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Start a new moderated live session. You will automatically become the host.
            </p>
            <div className="mt-12">
            <Button onClick={() => setIsSessionActive(true)} size="lg" className="px-10 py-6 text-lg">
                Start a Live Session
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
                A new room will be created automatically. <br/>
                Share the room URL with your students to have them join.
            </p>
            </div>
        </div>
      </div>
    );
  }

  // If the user is a student or not logged in...
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-24 text-center">
      <div>
        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <Video className="h-8 w-8" />
        </div>
        <h1 className="font-headline text-4xl font-bold">Live Classes</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
            Only instructors can start a live class from this page. Students should ask their instructor for the session link to join.
        </p>
        <Button asChild className="mt-8">
            <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    </div>
  );
}
