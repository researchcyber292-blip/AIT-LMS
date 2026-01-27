
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import imageData from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useUser, useFirestore, updateUserProfile } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const { placeholderImages } = imageData;
const avatars = placeholderImages.filter(img => img.id.startsWith('avatar-'));

export default function AvatarSelectionPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const handleSelectAvatar = (avatarId: string) => {
    setSelectedAvatar(avatarId);
  };
  
  const handleContinue = async () => {
    if (!selectedAvatar) {
        toast({ variant: 'destructive', title: 'Please select an avatar.' });
        return;
    }
    if (!user) {
        toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to select an avatar.'});
        router.push('/login');
        return;
    }

    setIsLoading(true);
    const avatarData = avatars.find(a => a.id === selectedAvatar);
    if (avatarData) {
        try {
            // Update Firebase Auth profile
            await updateProfile(user, { photoURL: avatarData.imageUrl });
            
            // Update Firestore document and mark onboarding as complete
            updateUserProfile(firestore, user.uid, {
                photoURL: avatarData.imageUrl,
                onboardingStatus: 'active',
            });
            
            router.push('/creation-success');
        } catch (error: any) {
            console.error("Failed to update profile:", error);
            toast({ variant: 'destructive', title: 'Update Failed', description: error.message });
            setIsLoading(false);
        }
    } else {
        toast({ variant: 'destructive', title: 'Invalid Avatar', description: 'The selected avatar could not be found.' });
        setIsLoading(false);
    }
  };

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-headline text-4xl font-bold">Choose Your Avatar</h1>
        <p className="mt-4 text-muted-foreground">Select a profile picture to represent you across the platform.</p>
      </div>

      <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 max-w-5xl mx-auto">
        {avatars.map(avatar => (
          <div
            key={avatar.id}
            onClick={() => handleSelectAvatar(avatar.id)}
            className={cn(
              "relative aspect-square rounded-full overflow-hidden border-4 cursor-pointer transition-all duration-300",
              selectedAvatar === avatar.id ? 'border-primary scale-110 shadow-lg' : 'border-transparent hover:border-primary/50'
            )}
          >
            <Image
              src={avatar.imageUrl}
              alt={avatar.description}
              fill
              className="object-cover"
              data-ai-hint={avatar.imageHint}
              sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            />
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Button size="lg" onClick={handleContinue} disabled={!selectedAvatar || isLoading}>
          {isLoading ? 'Saving...' : 'Finish Setup'}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
