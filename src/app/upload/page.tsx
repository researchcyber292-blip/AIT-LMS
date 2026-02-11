
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Film, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { uploadToFirebaseStorage } from '@/app/actions/upload';
import type { Video } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const videosQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(collection(firestore, 'videos'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: videos, isLoading: videosLoading } = useCollection<Video>(videosQuery);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
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
    if (!selectedFile) {
        toast({
            variant: 'destructive',
            title: 'No File Selected',
            description: 'Please choose a video file to upload.',
        });
        return;
    }

    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be logged in to upload a video.',
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
        const result = await uploadToFirebaseStorage(formData);

        if (result.success && result.url && result.fileName) {
            await addDoc(collection(firestore, 'videos'), {
                url: result.url,
                fileName: result.fileName,
                title: selectedFile.name,
                uploaderId: user.uid,
                createdAt: serverTimestamp(),
            });

            toast({
                title: 'Upload Complete!',
                description: `${selectedFile.name} is now available.`,
            });
            
            // Reset file input after successful upload and db record
            setSelectedFile(null);
            setPreviewUrl(null);
            const fileInput = document.getElementById('video-upload') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }

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
                Select a video file to upload to your Firebase Storage.
            </p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Video Uploader</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="video-upload">Select Video</Label>
                    <div className="flex gap-2">
                        <Input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} className="cursor-pointer"/>
                    </div>
                </div>

                {previewUrl && (
                    <div className="space-y-4">
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
                     <Button onClick={handleUpload} className="w-full" disabled={!selectedFile || isUploading}>
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Upload to Firebase
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
                    {/* Delete button can be added here later */}
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
