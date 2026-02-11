'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleUpload = () => {
    if (!selectedFile) {
        toast({
            variant: 'destructive',
            title: 'No File Selected',
            description: 'Please choose a video file to upload.',
        });
        return;
    }
    // Backend logic will be added in the next steps.
    toast({
        title: 'Upload Initiated (Frontend)',
        description: `${selectedFile.name} is ready for backend processing.`,
    });
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline">Upload Video Content</h1>
            <p className="mt-2 text-muted-foreground">
                Select a video file from your device to upload to the platform.
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
                     <Button onClick={handleUpload} className="w-full" disabled={!selectedFile}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload Video
                    </Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
