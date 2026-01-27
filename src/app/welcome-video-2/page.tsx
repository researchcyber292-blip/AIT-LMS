
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';

export default function WelcomeVideo2Page() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Since authentication is removed, we'll just navigate.
    // The next step in the original flow was /getting-started.
    router.push('/getting-started');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert to uppercase to maintain consistency with the original design
    setName(e.target.value.toUpperCase());
  };

  return (
    <div className="relative mt-14 h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <video
        src="/2.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex h-full items-end justify-start pb-48">
        <div className="container">
          <div className="w-full max-w-md">
            <form className="group flex items-center gap-4 rounded-full border-2 border-white/20 bg-black/30 p-2 backdrop-blur-sm transition-all focus-within:border-white/50 focus-within:bg-black/50" onSubmit={handleSubmit}>
              <Input
                name="username"
                type="text"
                placeholder="ENTER YOUR FULL NAME"
                value={name}
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
