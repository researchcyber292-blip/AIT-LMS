
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, ArrowRight } from 'lucide-react';
import JitsiMeeting from '@/components/live-class/jitsi-meeting';

export default function LiveClassesPage() {
    const [roomName, setRoomName] = useState('');
    const [userName, setUserName] = useState('');
    const [showMeeting, setShowMeeting] = useState(false);
    const [isInstructor, setIsInstructor] = useState(false);
    
    // Function to generate a random room name for the instructor
    const handleStartStream = () => {
        const newRoomName = `Aviraj-Live-${Math.random().toString(36).substring(2, 9)}`;
        setRoomName(newRoomName);
        setIsInstructor(true);
        setShowMeeting(true);
        if (userName.trim() === '') {
            setUserName('Instructor');
        }
    };

    // Function to join a stream using the entered room name
    const handleJoinStream = () => {
        if (roomName.trim() === '') {
            alert('Please enter a stream name to join.');
            return;
        }
        setIsInstructor(false);
        setShowMeeting(true);
        if (userName.trim() === '') {
            setUserName('Guest');
        }
    };

    if (showMeeting) {
        // The Jitsi component will be rendered, taking up the page.
        return (
            <div className="container py-8 md:py-12">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="font-headline text-2xl font-bold">Live Classroom</h1>
                    <Button variant="destructive" onClick={() => setShowMeeting(false)}>Leave Stream</Button>
                </div>
                <div className="aspect-video w-full border rounded-lg overflow-hidden bg-black">
                    <JitsiMeeting
                        roomName={roomName}
                        userName={userName}
                        isInstructor={isInstructor}
                    />
                </div>
                 <div className="mt-4 text-center text-muted-foreground">
                    <p>You are in room: <span className="font-bold text-primary">{roomName}</span> as <span className="font-bold text-primary">{userName}</span></p>
                    {isInstructor && <p>As the instructor, you have moderator controls.</p>}
                 </div>
            </div>
        );
    }
    
    // The initial view to start or join a stream
    return (
        <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-12">
            <Card className="w-full max-w-lg">
                <CardHeader className="text-center">
                     <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                        <Video className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-2xl">Live Classroom</CardTitle>
                    <CardDescription>Start a new stream as an instructor or join an existing one.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                         <Input
                            placeholder="Enter Your Name (Optional)"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="text-center"
                        />
                    </div>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Instructor</span></div>
                    </div>

                    <Button onClick={handleStartStream} size="lg" className="w-full">
                        Start a New Live Stream
                    </Button>
                    
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Student / Guest</span></div>
                    </div>
                    
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter Stream Name to Join"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                        />
                        <Button onClick={handleJoinStream}>
                            Join <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
