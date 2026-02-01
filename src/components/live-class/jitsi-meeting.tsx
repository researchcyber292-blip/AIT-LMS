
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
  isInstructor: boolean;
}

export default function JitsiMeeting({ roomName, userName, isInstructor }: JitsiMeetingProps) {
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
            startWithVideoMuted: false, // Start with video on for a better experience
            disableInviteFunctions: true, // Prevents students from inviting others
            prejoinPageEnabled: false, // Go straight into the meeting
          },
          interfaceConfigOverwrite: {
            // Customize the toolbar for students vs instructors
            TOOLBAR_BUTTONS: isInstructor
              ? [
                  'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                  'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                  'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                  'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                  'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                  'security' // Enable security options for instructor (lobby, password)
                ]
              : [
                  'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                  'fodeviceselection', 'hangup', 'profile', 'chat', 'raisehand',
                  'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                  'tileview', 'videobackgroundblur', 'help'
                ],
            SETTINGS_SECTIONS: [ 'devices', 'language', 'moderator', 'profile', 'sounds' ],
            SHOW_CHROME_EXTENSION_BANNER: false,
            SHOW_JITSI_WATERMARK: false, // Hide Jitsi watermark
            TILE_VIEW_MAX_COLUMNS: 8,
          },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        jitsiApiRef.current = api;

        // When the instructor (moderator) joins, they can be prompted to set up lobby
        if (isInstructor) {
          api.addEventListener('videoConferenceJoined', () => {
            toast({
              title: "You are the instructor",
              description: "Click the shield icon to enable the lobby and secure your class.",
            });
          });
        }
        
        // Clean up the meeting when the component unmounts
        return () => {
          jitsiApiRef.current?.dispose();
        };

      } catch (error) {
        console.error('Failed to initialize Jitsi Meet:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not load the classroom. Please try again later.',
        });
      }
    };
    
    // Check if the Jitsi API script is already loaded
    if (window.JitsiMeetExternalAPI) {
        if (jitsiContainerRef.current) {
            startJitsi();
        }
    } else {
        // Jitsi script not loaded, this should not happen if added to layout
        console.error('Jitsi script not found.');
        toast({
            variant: 'destructive',
            title: 'Loading Error',
            description: 'Failed to load the live class script. Please refresh the page.',
        });
    }

    // Cleanup function to remove API
    return () => {
      jitsiApiRef.current?.dispose();
    };

  }, [roomName, userName, isInstructor, toast]);
  
  if (!jitsiContainerRef) {
      return <Loading />;
  }

  return <div ref={jitsiContainerRef} style={{ height: '100%', width: '100%' }} />;
}
