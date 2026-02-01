
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import JitsiMeeting from '@/components/live-class/jitsi-meeting';
import { useUser } from '@/firebase';
import Loading from '@/app/loading';
import { Button } from '@/components/ui/button';
import { Radio, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function LiveClassroom() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isUserLoading } = useUser();

    const roomName = searchParams.get('room');
    const courseTitle = searchParams.get('courseTitle');
    const isInstructor = searchParams.get('instructor') === 'true';

    // Set a default user name if the user is not logged in or name is not available
    const userName = user?.displayName || `Guest-${Math.random().toString(36).substring(2, 6)}`;

    if (isUserLoading) {
        return <Loading />;
    }

    if (!roomName) {
        return (
            <div className="container py-24 text-center">
                <h1 className="text-2xl font-bold">Invalid Classroom</h1>
                <p className="text-muted-foreground mt-2">No room name was provided.</p>
                <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        );
    }
    
    return (
        <div className="h-screen w-screen flex flex-col bg-background">
             <div className="flex justify-between items-center p-4 border-b">
                <div>
                    <h1 className="font-headline text-xl font-bold flex items-center gap-2">
                        <Radio className="h-5 w-5 text-red-500 animate-pulse" />
                        {courseTitle || 'Live Class'}
                    </h1>
                    <p className="text-xs text-muted-foreground">Room: {roomName}</p>
                </div>
                <Button variant="destructive" onClick={() => router.back()}>Leave Stream</Button>
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
                    userName={userName}
                />
            </div>
        </div>
    );
}

// Wrap the main component in Suspense to handle the useSearchParams hook
export default function LiveClassroomPage() {
    return (
        <Suspense fallback={<Loading />}>
            <LiveClassroom />
        </Suspense>
    );
}
