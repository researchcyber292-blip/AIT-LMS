
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, Film, Link as LinkIcon, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useFirestore, useUser, useAuth, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query } from 'firebase/firestore';
import { uploadToHostinger } from '@/app/actions/upload';
import type { Video } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { signInAnonymously, setPersistence, browserLocalPersistence } from 'firebase/auth';
import Loading from '@/app/loading';

// --- Admin Login Component ---

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

function AdminLoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const auth = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            try {
                await setPersistence(auth, browserLocalPersistence);
                await signInAnonymously(auth);
                toast({ title: "Admin Access Granted" });
                onLoginSuccess();
            } catch (error) {
                console.error("Admin sign-in failed:", error);
                toast({ variant: 'destructive', title: 'Login Failed', description: 'Could not start an admin session.' });
                setIsLoading(false);
            }
        } else {
            toast({ variant: 'destructive', title: 'Access Denied', description: 'Invalid credentials.' });
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-12 md:py-16 flex justify-center items-center min-h-[calc(100vh-10rem)]">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle className="mt-4 text-2xl font-bold">Admin Authentication</CardTitle>
                    <CardDescription>Please log in to upload videos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                        </div>
                        <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
                            {isLoading ? 'Authenticating...' : 'Enter Upload Area'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

// --- Uploader Component (original page content) ---

function UploaderComponent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [videosLoading, setVideosLoading] = useState(true);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const fetchVideos = useCallback(async () => {
    if (!firestore || !user) return;
    setVideosLoading(true);
    try {
      const videosQuery = query(collection(firestore, 'course_videos'));
      const querySnapshot = await getDocs(videosQuery);
      const videosData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Video));
      videosData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setVideos(videosData);
    } catch (error: any) {
      console.error("Error fetching videos:", error);
      const permissionError = new FirestorePermissionError({
        operation: 'list',
        path: 'course_videos',
      });
      errorEmitter.emit('permission-error', permissionError);

      toast({
        variant: 'destructive',
        title: 'Error fetching videos',
        description: error.message || 'You might not have permission to view the video list.',
      });
    } finally {
      setVideosLoading(false);
    }
  }, [firestore, toast, user]);

  useEffect(() => {
    if (user && user.isAnonymous) {
        fetchVideos();
    }
  }, [user, fetchVideos]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        // Set default title from filename without extension
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please select a video file.',
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !videoTitle || !videoCategory) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please select a video file and provide a title and category.',
        });
        return;
    }

    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in as an admin to upload a video.',
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('category', videoCategory);

    try {
        const result = await uploadToHostinger(formData);

        if (result.success && result.url) {
            await addDoc(collection(firestore, 'course_videos'), {
                url: result.url,
                fileName: result.url.split('/').pop() || 'video.mp4',
                title: videoTitle,
                category: videoCategory,
                uploaderId: user.uid,
                createdAt: serverTimestamp(),
            });

            toast({
                title: 'Upload Complete!',
                description: `${selectedFile.name} is now available on Hostinger.`,
            });
            
            setSelectedFile(null);
            setVideoTitle('');
            setVideoCategory('');
            setPreviewUrl(null);
            const fileInput = document.getElementById('video-upload') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }

            // Re-fetch the videos list to show the new one
            await fetchVideos();

        } else {
             toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: result.error || 'An unknown error occurred during upload.',
            });
        }
    } catch (error: any) {
        toast({
            variant: 'destructive',
            title: 'Upload Error',
            description: error.message || 'An unexpected error occurred.',
        });
    } finally {
        setIsUploading(false);
    }
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline">Upload Video Content</h1>
            <p className="mt-2 text-muted-foreground">
                Select a video file to upload to your Hostinger storage via SFTP.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Video Uploader</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="video-upload">1. Select Video File</Label>
                        <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} className="cursor-pointer"/>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="video-category">2. Course Category</Label>
                        <Input id="video-category" placeholder="e.g., python, ethical-hacking" value={videoCategory} onChange={(e) => setVideoCategory(e.target.value)} disabled={!selectedFile} />
                    </div>
                </div>

                {previewUrl && (
                    <div className="space-y-4">
                         <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="video-title">3. Video Title</Label>
                            <Input id="video-title" placeholder="Enter a title for the video" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
                        </div>
                        <h3 className="font-semibold">Video Preview</h3>
                        <div className="rounded-lg border bg-black aspect-video overflow-hidden">
                             <video
                                key={previewUrl}
                                controls
                                className="w-full h-full object-contain"
                            >
                                <source src={previewUrl} type={selectedFile?.type} />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                )}
                
                <div className="pt-4">
                     <Button onClick={handleUpload} className="w-full" disabled={!selectedFile || !videoTitle || !videoCategory || isUploading}>
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Upload to Hostinger
                          </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Uploaded Videos</CardTitle>
          </CardHeader>
          <CardContent>
            {videosLoading && (
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            )}
            {!videosLoading && videos && videos.length > 0 ? (
              <div className="space-y-2">
                {videos.map((video: Video) => (
                  <div key={video.id} className="flex items-center justify-between rounded-lg border p-3 gap-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Film className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="overflow-hidden">
                        <p className="font-medium truncate">{video.title}</p>
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline truncate flex items-center gap-1"
                        >
                          <LinkIcon className="h-3 w-3" />
                          {video.url}
                        </a>
                      </div>
                    </div>
                     <Badge variant="secondary">{video.category}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              !videosLoading && <p className="py-8 text-center text-sm text-muted-foreground">No videos have been uploaded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


// --- Main Page Component ---

export default function UploadPage() {
  const { user, isUserLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the current user is our anonymous admin
    if (!isUserLoading && user && user.isAnonymous) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user, isUserLoading]);

  if (isUserLoading) {
    return <Loading />;
  }

  // If user is an admin, show the uploader, otherwise show the login page.
  if (isAdmin) {
    return <UploaderComponent />;
  }
  
  return <AdminLoginPage onLoginSuccess={() => setIsAdmin(true)} />;
}
