
'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import JitsiMeeting from '@/components/live-class/jitsi-meeting';
import Loading from '@/app/loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ClassroomContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, isUserLoading } = useUser();

    const roomName = searchParams.get('room');
    const courseTitle = searchParams.get('courseTitle');
    const isInstructorParam = searchParams.get('instructor') === 'true';

    if (isUserLoading) {
        return <Loading />;
    }

    if (!roomName || !user) {
        return (
            <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
                <Card className="w-full max-w-lg text-center">
                    <CardHeader>
                        <div className="mx-auto bg-destructive/10 text-destructive p-3 rounded-full w-fit mb-4">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <CardTitle>Invalid Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">The classroom link is invalid or has expired. Please return to the course page and try again.</p>
                        <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="relative pt-14">
             <JitsiMeeting
                roomName={roomName}
                userName={user.displayName || 'Student'}
                isInstructor={isInstructorParam}
            />
        </div>
    );
}


export default function LiveClassroomPage() {
    return (
        <Suspense fallback={<Loading />}>
            <ClassroomContent />
        </Suspense>
    );
}
