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
  onMeetingEnd?: () => void;
}

export default function JitsiMeeting({ roomName, userName, onMeetingEnd }: JitsiMeetingProps) {
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
        
        if (onMeetingEnd) {
            api.addEventListener('videoConferenceLeft', () => {
              onMeetingEnd();
            });
        }
        
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

  }, [roomName, userName, toast, onMeetingEnd]);
  
  if (!jitsiContainerRef) {
      return <Loading />;
  }

  return <div ref={jitsiContainerRef} className="h-full w-full" />;
}
