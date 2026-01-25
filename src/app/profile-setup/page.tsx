'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileSetupPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <div className="absolute inset-0 flex items-end">
        <div className="container">
          <div className="w-full max-w-lg pl-4 pb-40 md:pl-16">
            <form className="flex items-center gap-4" onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Enter your username"
                className="h-14 flex-1 rounded-lg border-2 border-white/30 bg-black/50 px-6 text-lg text-white backdrop-blur-sm placeholder:text-white/60 focus:border-white/50 focus:ring-0"
              />
              <Button
                type="submit"
                size="icon"
                className="h-14 w-14 flex-shrink-0 rounded-full border-2 border-white/30 bg-black/50 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10"
              >
                <span className="sr-only">Next</span>
                <ArrowRight className="h-6 w-6 text-white" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
