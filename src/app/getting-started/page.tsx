
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { updateUserProfile } from '@/firebase/user';

export default function GettingStartedPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ variant: "destructive", title: "You must be logged in." });
      return;
    }

    // Allows letters, numbers, underscore, dot. Must contain @ followed by exactly 3 digits.
    const validationRegex = /^[a-zA-Z0-9_.]+@[0-9]{3}$/;

    if (!userId.trim()) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Username cannot be empty.",
        });
        return;
    }
    
    if (!validationRegex.test(userId)) {
      toast({
        variant: "destructive",
        title: "Invalid Username",
        description: "Invalid format. Username must end with '@' followed by 3 numbers. Underscores and dots are allowed.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateUserProfile(firestore, user.uid, {
        username: userId,
        onboardingStatus: 'username_complete',
      });
      router.push('/activation');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your username. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mt-14 h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <video
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      >
        <source src="/3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 flex items-end justify-start pb-40">
        <div className="container">
          <div className="w-full max-w-md">
            <form className="group flex items-center gap-4 rounded-full border-2 border-white/20 bg-black/30 p-2 backdrop-blur-sm transition-all focus-within:border-white/50 focus-within:bg-black/50" onSubmit={handleSubmit}>
              <Input
                name="userId"
                type="text"
                placeholder="CREATE A USERNAME (e.g., user.name@123)"
                value={userId}
                onChange={handleChange}
                className="h-12 flex-1 rounded-full border-none bg-transparent px-6 text-lg text-white placeholder:text-white/50 focus:ring-0"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className="h-12 w-12 flex-shrink-0 rounded-full bg-white/10 text-white transition-all group-hover:bg-white/20"
                disabled={isLoading}
              >
                <span className="sr-only">Finish Setup</span>
                <ArrowRight className="h-6 w-6" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
