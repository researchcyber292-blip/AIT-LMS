'use client';

import { useState } from 'react';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Mic, Radio, Video } from 'lucide-react';
import Loading from '@/app/loading';
import type { Instructor } from '@/lib/types';
import Link from 'next/link';
import JitsiMeeting from '@/components/live-class/jitsi-meeting';

export default function LiveClassesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [session, setSession] = useState<{roomName: string, isInstructor: boolean, password?: string} | null>(null);
  
  const roomName = 'avirajinfotech-cybersecurity-classlive';

  const instructorDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'instructors', user.uid);
  }, [firestore, user]);
  const { data: instructor, isLoading: isInstructorProfileLoading } = useDoc<Instructor>(instructorDocRef);

  const isLoading = isUserLoading || isInstructorProfileLoading;

  const handleStartSession = () => {
    // Generate a simple password to claim moderator status automatically
    const sessionPassword = Math.random().toString(36).substring(2, 10);
    setSession({ roomName: roomName, isInstructor: true, password: sessionPassword });
  };
  
  const handleJoinSession = () => {
    setSession({ roomName: roomName, isInstructor: false });
  };

  const handleEndSession = () => {
      setSession(null);
  }

  if (session) {
    return (
        <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col pt-14">
            <div className="flex justify-between items-center p-4 border-b bg-card gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="font-headline text-xl font-bold flex items-center gap-2">
                        <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                        Live Session
                    </h1>
                    <p className="text-xs text-muted-foreground">Room: {session.roomName}</p>
                </div>
                <Button variant="destructive" onClick={handleEndSession}>End Session</Button>
            </div>
            <div className="flex-1 w-full bg-black">
                <JitsiMeeting
                    roomName={session.roomName}
                    userName={user?.displayName || `Guest-${Math.random().toString(36).substring(2, 6)}`}
                    onMeetingEnd={handleEndSession}
                    isInstructor={session.isInstructor}
                    password={session.password}
                />
            </div>
        </div>
    );
  }

  if (isLoading) {
    return <Loading />;
  }
  
  const isInstructor = user && instructor;

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-12 md:py-16 text-center">
      <div className="max-w-2xl w-full">
        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
          <Video className="h-8 w-8" />
        </div>
        <h1 className="font-headline text-4xl font-bold">Live Classroom</h1>
        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
          Start or join the live cybersecurity session. Instructors can start a new class, and students can join.
        </p>
        
        <div className="mt-12 space-y-8">
            {isInstructor && (
                 <div className="p-6 border rounded-lg bg-card">
                    <h2 className="font-headline text-2xl font-bold flex items-center justify-center gap-2">
                        <Mic className="h-6 w-6" />
                        Instructor Control Panel
                    </h2>
                    <p className="mt-2 text-muted-foreground">Start a new secure, moderated live session.</p>
                    <Button onClick={handleStartSession} size="lg" className="mt-6 px-10 py-6 text-lg">
                        Start a Live Stream
                    </Button>
                     <p className="text-xs text-muted-foreground mt-4">
                        You will automatically become the moderator.
                    </p>
                </div>
            )}

            <div className="p-6 border rounded-lg bg-card">
                 <h2 className="font-headline text-2xl font-bold">Join the Public Stream</h2>
                 <p className="mt-2 text-muted-foreground">Click the button below to enter the live session.</p>
                 <Button onClick={handleJoinSession} size="lg" className="mt-6">
                    Join Live Stream
                 </Button>
            </div>
            
            {!isLoading && !isInstructor && (
                 <p className="text-sm text-muted-foreground">
                    Want to host your own sessions? <Link href="/instructor-signup" className="underline text-primary">Become an instructor</Link>.
                 </p>
            )}
        </div>
      </div>
    </div>
  );
}
