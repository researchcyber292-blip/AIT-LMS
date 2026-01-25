'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function ProfileSetupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Just convert to uppercase
    setUsername(value.toUpperCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        title: "Invalid Input",
        description: "Please enter your original full name.",
      });
      return;
    }

    // If valid, proceed
    router.push('/getting-started');
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <video
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      >
        <source src="/2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 flex items-center justify-start">
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
              />
              <Button
                type="submit"
                size="icon"
                className="h-12 w-12 flex-shrink-0 rounded-full bg-white/10 text-white transition-all group-hover:bg-white/20"
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
