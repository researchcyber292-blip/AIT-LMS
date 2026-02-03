'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import JitsiMeeting from '@/components/live-class/jitsi-meeting';
import { useUser } from '@/firebase';
import Loading from '@/app/loading';
import { Button } from '@/components/ui/button';
import { Radio } from 'lucide-react';

function LiveClassroom() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const [userName, setUserName] = useState('');

    const roomName = searchParams.get('room');
    const courseTitle = searchParams.get('courseTitle');

    // Generate a stable guest name only on the client to avoid hydration mismatch
    useEffect(() => {
        if (user?.displayName) {
            setUserName(user.displayName);
        } else if (!isUserLoading) {
            // This now only runs on the client after the initial render
            setUserName(`Guest-${Math.random().toString(36).substring(2, 6)}`);
        }
    }, [user, isUserLoading]);


    if (isUserLoading || !userName) {
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
