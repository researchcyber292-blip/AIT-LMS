
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import imageData from '@/lib/placeholder-images.json';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const { placeholderImages } = imageData;
const avatars = placeholderImages.filter(img => img.id.startsWith('avatar-'));

export default function AvatarSelectionPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const router = useRouter();

  const handleSelectAvatar = (avatarId: string) => {
    setSelectedAvatar(avatarId);
  };
  
  const handleContinue = () => {
    if(selectedAvatar) {
        // In a real app, you would save this avatar preference to the user's profile
        router.push('/creation-success');
    }
  };

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="font-headline text-4xl font-bold">Choose Your Avatar</h1>
        <p className="mt-4 text-muted-foreground">Select a profile picture to represent you across the platform.</p>
      </div>

      <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 max-w-5xl mx-auto">
        {avatars.slice(0, 11).map(avatar => (
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
        <Button size="lg" onClick={handleContinue} disabled={!selectedAvatar}>
          Finish Setup <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
