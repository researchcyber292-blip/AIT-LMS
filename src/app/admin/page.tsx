
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Briefcase, Code, BarChart3, Bot, Cpu, Fingerprint, ArrowRight } from 'lucide-react';
import { adminCredentials } from '@/lib/admin-credentials';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ADMIN_ID = "admins@ait.com";

const categoryIcons: { [key: string]: React.ElementType } = {
  'ethical-hacking': Shield,
  'data-science': BarChart3,
  'full-stack-dev': Code,
  'ai-ml': Bot,
  'robotics-tech': Cpu,
  'coding': Briefcase,
};

export default function AdminCategorySelectionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [instructorId, setInstructorId] = useState('');
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleIdCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (instructorId.toLowerCase() === ADMIN_ID) {
      setIsIdVerified(true);
    } else {
      toast({
        variant: 'destructive',
        title: 'Access Denied',
        description: 'The provided Instructor ID is not valid.',
      });
    }
    setIsLoading(false);
  };

  const handleCategorySelect = (category: string) => {
    router.push(`/admin/login?category=${category}`);
  };

  if (!isIdVerified) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
        <Image
          src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYmVyJTIwc2VjdXJpdHklMjBoYWNrZXJ8ZW58MHx8fHwxNzcxMjYxMjMzfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Cyber security background"
          fill
          className="object-cover"
          data-ai-hint="cyber security hacker"
        />
        <div className="absolute inset-0 bg-black/60" />
        <Card className="w-full max-w-md z-10 border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg shadow-primary/10">
          <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                  <Fingerprint className="h-8 w-8" />
              </div>
              <CardTitle className="font-headline text-2xl">Instructor Console Access</CardTitle>
              <CardDescription>Please enter your administrative ID to proceed.</CardDescription>
          </CardHeader>
          <CardContent>
              <form onSubmit={handleIdCheck} className="space-y-4">
                  <div className="space-y-2">
                      <Input
                          id="instructorId"
                          type="text"
                          placeholder="Instructor ID"
                          value={instructorId}
                          onChange={(e) => setInstructorId(e.target.value)}
                          required
                          autoComplete="off"
                          className="bg-transparent border-white/20 h-12 text-center"
                      />
                  </div>
                  <Button type="submit" className="w-full h-12 !mt-6" disabled={isLoading}>
                      {isLoading ? 'Verifying...' : 'Proceed'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
              </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
       <Image
        src="https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjYmVyJTIwc2VjdXJpdHklMjBoYWNrZXJ8ZW58MHx8fHwxNzcxMjYxMjMzfDA&ixlib=rb-4.1.0&q=80&w=1080"
        alt="Cyber security background"
        fill
        className="object-cover"
        data-ai-hint="cyber security hacker"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="z-10 w-full max-w-4xl text-center">
        <h1 className="font-headline text-4xl font-bold text-white">Select Instructor Console</h1>
        <p className="mt-2 mb-8 text-muted-foreground">Choose the administrative panel you want to access.</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.keys(adminCredentials).map((category) => {
            const Icon = categoryIcons[category] || Shield;
            const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return (
              <Card
                key={category}
                onClick={() => handleCategorySelect(category)}
                className="group cursor-pointer bg-card/70 backdrop-blur-md border-white/10 text-white hover:border-primary hover:bg-primary/10 transition-all duration-300"
              >
                <CardContent className="p-6 flex flex-col items-start text-left h-full">
                    <div className="p-3 bg-primary/10 rounded-lg border border-primary/20 mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-grow">
                        <h3 className="font-headline text-xl font-bold">{categoryName}</h3>
                        <p className="text-sm text-muted-foreground mt-1">Access the {categoryName} panel</p>
                    </div>
                    <div className="w-full mt-4 flex items-center justify-end text-sm font-semibold text-primary/80 group-hover:text-primary">
                        <span>Login</span>
                        <ArrowRight className="h-4 w-4 ml-2 transform transition-transform group-hover:translate-x-1" />
                    </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
