'use client';

import { useState } from 'react';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, Radio, Video, Info } from 'lucide-react';
import Loading from '@/app/loading';
import type { Instructor } from '@/lib/types';
import Link from 'next/link';
import JitsiMeeting from '@/components/live-class/jitsi-meeting';

export default function LiveClassesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isJoining, setIsJoining] = useState(false);
  
  const roomName = 'avirajinfotech-cybersecurity-classlive';

  const instructorDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'instructors', user.uid);
  }, [firestore, user]);
  const { data: instructor, isLoading: isInstructorProfileLoading } = useDoc<Instructor>(instructorDocRef);

  const isLoading = isUserLoading || isInstructorProfileLoading;

  const handleStartSession = () => {
    setIsJoining(true);
  };
  
  const handleJoinSession = () => {
    setIsJoining(true);
  };
  
  const handleEndSession = () => {
      setIsJoining(false);
  }

  const isInstructor = user && instructor;

  if (isJoining) {
    return (
        <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col pt-14">
            <div className="flex justify-between items-center p-4 border-b bg-card gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="font-headline text-xl font-bold flex items-center gap-2">
                        <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                        Live Session
                    </h1>
                    <p className="text-xs text-muted-foreground">Room: {roomName}</p>
                </div>
                <Button variant="destructive" onClick={handleEndSession}>Leave Session</Button>
            </div>
            
            {isInstructor && (
              <Alert variant="default" className="m-4 border-amber-500/50 bg-amber-500/10 text-amber-200 [&>svg]:text-amber-400">
                <Info className="h-4 w-4" />
                <AlertTitle className="font-bold">Instructor Moderator Guide</AlertTitle>
                <AlertDescription className="text-amber-300/90">
                  To get moderator controls (mute users, screen share), click the **"I am the host"** button that appears in the meeting window. If a login popup is blocked, open <a href="https://meet.jit.si" target="_blank" rel="noopener noreferrer" className="underline font-semibold">meet.jit.si</a> in a new tab, log in with Google, then return here and refresh the page.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex-1 w-full bg-black">
                <JitsiMeeting
                    roomName={roomName}
                    userName={user?.displayName || `Guest-${Math.random().toString(36).substring(2, 6)}`}
                    onMeetingEnd={handleEndSession}
                />
            </div>
        </div>
    );
  }

  if (isLoading) {
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
          Start or join the live cybersecurity session.
        </p>
        
        <div className="mt-12 space-y-8">
            {isInstructor && (
                 <div className="p-6 border rounded-lg bg-card">
                    <h2 className="font-headline text-2xl font-bold flex items-center justify-center gap-2">
                        <Mic className="h-6 w-6" />
                        Instructor Control Panel
                    </h2>
                    <p className="mt-2 text-muted-foreground">Start the live session for students.</p>
                    <Button onClick={handleStartSession} size="lg" className="mt-6 px-10 py-6 text-lg">
                        Start Live Stream
                    </Button>
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
