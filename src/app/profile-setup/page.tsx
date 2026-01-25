'use client';

import Image from 'next/image';
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
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full">
      <Image
        src="/PAGE-2.png"
        alt="Profile Setup"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 flex items-center bg-black/40">
        <div className="container">
          <div className="w-full max-w-lg pl-4 md:pl-16">
            <form className="mt-8 flex items-center gap-4" onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Enter your username"
                className="h-14 flex-1 rounded-lg border-2 border-white/30 bg-black/50 px-6 text-lg text-white backdrop-blur-sm placeholder:text-white/60 focus:border-white/50 focus:ring-0"
              />
              <Button
                type="submit"
                size="icon"
                className="h-14 w-14 flex-shrink-0 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/20"
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
