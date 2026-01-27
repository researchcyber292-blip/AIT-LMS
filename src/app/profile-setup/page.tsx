
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore } from '@/firebase';
import { updateUserProfile } from '@/firebase/user';
import Image from 'next/image';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Just convert to uppercase
    setUsername(value.toUpperCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore) {
      toast({ variant: "destructive", title: "You must be logged in." });
      return;
    }

    const validationRegex = /^[A-Z\s]+$/;

    if (!username.trim()) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Username cannot be empty.",
        });
        return;
    }
    
    if (!validationRegex.test(username)) {
      toast({
        variant: "destructive",
        title: "Invalid Name",
        description: "Please enter a valid full name. Numbers and special characters are not allowed.",
      });
      return;
    }

    setIsLoading(true);

    updateUserProfile(firestore, user.uid, {
      name: username,
      onboardingStatus: 'profile_complete',
    });
    
    // Optimistically navigate to the next step.
    router.push('/getting-started');
  };

  return (
    <div className="relative mt-14 h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <Image
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxjeWJlcnNlY3VyaXR5JTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NjkxNzU5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cybersecurity background"
          fill
          className="object-cover"
          data-ai-hint="cybersecurity background"
      />
      <div className="absolute inset-0 flex items-end justify-start pb-40">
        <div className="container">
          <div className="w-full max-w-md">
            <form className="group flex items-center gap-4 rounded-full border-2 border-white/20 bg-black/30 p-2 backdrop-blur-sm transition-all focus-within:border-white/50 focus-within:bg-black/50" onSubmit={handleSubmit}>
              <Input
                name="username"
                type="text"
                placeholder="ENTER YOUR FULL NAME"
                value={username}
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
                <span className="sr-only">Next</span>
                <ArrowRight className="h-6 w-6" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
