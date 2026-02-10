
'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/app/loading';
import { Film } from 'lucide-react';

// A simple, direct video player component for the new API-based streaming.
// It no longer needs to fetch blobs.
function StreamedVideoPlayer({ src }: { src: string }) {
  return (
    <video controls className="h-full w-full" controlsList="nodownload">
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

// Updated list of videos. The 'src' now points to our new API route.
// NOTE: These names must match the video file names in your Hostinger 'course_vault' folder.
const videos = [
  { id: 1, title: "Module 1: The Threat Landscape", src: "/api/video/video.mp4" },
  { id: 2, title: "Module 2: Protecting Your Digital Identity", src: "/api/video/2.mp4" },
  { id: 3, title: "Module 3: Safe Browsing & Email", src: "/api/video/3.mp4" },
  { id: 4, title: "Module 4: Device & Network Security", src: "/api/video/4.mp4" },
];

export default function VideoVaultPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <Loading />;
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold">High-Security Video Vault</h1>
        <p className="mt-2 text-muted-foreground">
          Your exclusive access to our secure video content.
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
          {videos.map((video) => (
            <div key={video.id} className="overflow-hidden rounded-lg border bg-background shadow-lg">
                <div className="aspect-video bg-black">
                    {/* Use the new, simpler video player */}
                    <StreamedVideoPlayer src={video.src} />
                </div>
                <div className="p-4">
                    <h3 className="font-headline text-lg font-semibold flex items-center gap-2">
                        <Film className="h-5 w-5 text-primary" />
                        {video.title}
                    </h3>
                </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 rounded-md border border-amber-500/50 bg-amber-500/10 p-4 text-sm text-amber-300">
        <h4 className="font-bold text-amber-200">Security Implementation Note</h4>
        <p className="mt-2">
          This page now streams videos through a secure API route (<code className="bg-amber-900/50 px-1 py-0.5 rounded">/api/video/...</code>) that acts as a proxy to your Hostinger storage. 
          The direct link to the video files on Hostinger is not exposed to the end-user. 
          For this to work, ensure you have uploaded your videos to the <code className="bg-amber-900/50 px-1 py-0.5 rounded">/public_html/course_vault/</code> directory on your Hostinger server. The API currently has a placeholder for authorization; you must replace it with a real check to ensure only paid users can access the content.
        </p>
      </div>
    </div>
  );
}
