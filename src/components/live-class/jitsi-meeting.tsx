'use client';

import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import Loading from '@/app/loading';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

interface JitsiMeetingProps {
  roomName: string;
  userName: string;
  onMeetingEnd: () => void;
  isInstructor?: boolean;
  password?: string;
}

export default function JitsiMeeting({ roomName, userName, onMeetingEnd, isInstructor, password }: JitsiMeetingProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Function to initialize Jitsi
    const startJitsi = () => {
      try {
        const domain = 'meet.jit.si';
        const options = {
          roomName: roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: userName
          },
          configOverwrite: {
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TILE_VIEW_MAX_COLUMNS: 8,
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = api;
        
        api.addEventListener('videoConferenceLeft', () => {
          onMeetingEnd();
        });

        api.addEventListener('videoConferenceJoined', () => {
            // For instructors, automatically set the password to claim moderator status.
            if (isInstructor && password) {
                api.executeCommand('password', password);
            }
        });
        
        // This listener is a fallback in case the room already required a password.
        api.addEventListener('passwordRequired', () => {
             if (isInstructor && password) {
                api.executeCommand('password', password);
            }
        });

        // This listener gives us explicit confirmation of moderator status.
        api.addEventListener('moderationStatusChanged', (event: { status: 'granted' | 'revoked' }) => {
            if (event.status === 'granted' && isInstructor) {
                 toast({
                    title: "You are the session moderator",
                    description: "You have full control. Use the shield icon to enable the lobby, mute others, and manage the class.",
                    duration: 15000,
                });
            }
        });
        
      } catch (error) {
        console.error('Failed to initialize Jitsi Meet:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load the classroom. Please try again later.',
        });
      }
    };
    
    if (!window.JitsiMeetExternalAPI) {
        toast({
            variant: 'destructive',
            title: 'Loading Error',
            description: 'Live class script not found. Please refresh the page.',
        });
        return;
    }
    
    if (jitsiContainerRef.current) {
        startJitsi();
    }

    return () => {
      jitsiApiRef.current?.dispose();
    };

  }, [roomName, userName, toast, onMeetingEnd, isInstructor, password]);
  
  if (!jitsiContainerRef) {
      return <Loading />;
  }

  return <div ref={jitsiContainerRef} className="h-full w-full" />;
}
