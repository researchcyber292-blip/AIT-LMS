
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Suspense } from 'react';
import { Lock } from 'lucide-react';
import { adminCredentials, type AdminCategory } from '@/lib/admin-credentials';

function AdminLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const category = searchParams.get('category');

  if (!category || !(category in adminCredentials)) {
    return (
        <div className="text-center text-white">
            <h1 className="text-2xl font-bold">Invalid Admin Category</h1>
            <p>Please return to the previous page and select a valid category.</p>
            <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
    );
  }
  
  const categoryName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const expectedCreds = adminCredentials[category as AdminCategory];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (username === expectedCreds.username && password === expectedCreds.password) {
      toast({
        title: 'Login Successful',
        description: `Welcome, ${categoryName} Admin!`,
      });
      // Redirect to a dynamic console page
      router.push(`/admin/console/${category}`);
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid username or password for this category.',
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm z-10 border-primary/20 bg-card/50 backdrop-blur-sm shadow-lg shadow-primary/10">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
            <Lock className="h-8 w-8" />
        </div>
        <CardTitle className="font-headline text-2xl">{categoryName} Console</CardTitle>
        <CardDescription>Enter your administrator credentials.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="off"
              className="bg-transparent border-white/20 h-12"
            />
          </div>
          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
              className="bg-transparent border-white/20 h-12"
            />
          </div>
          <Button type="submit" className="w-full h-12 !mt-6" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Enter Console'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function AdminLoginPage() {
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
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <AdminLoginPageContent />
            </Suspense>
        </div>
    );
}
