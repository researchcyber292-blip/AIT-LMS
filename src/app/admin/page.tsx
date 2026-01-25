'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded credentials as requested
    if (username.toUpperCase() === 'HELLO' && password === 'TEST') {
      setIsAuthenticated(true);
      toast({
        title: 'Login Successful',
        description: 'Welcome, Admin!',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid username or password.',
      });
    }
  };

  if (isAuthenticated) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-background text-white">
         <Image
          src="https://picsum.photos/seed/adminwelcome/1920/1080"
          alt="Abstract background"
          fill
          className="object-cover"
          data-ai-hint="abstract technology"
        />
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
        <div className="relative container text-center">
          <h1 className="text-4xl font-bold font-headline drop-shadow-md">Welcome, Admin!</h1>
          <p className="text-white/80 mt-4 drop-shadow-md">This is your secure admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <Image
        src="https://picsum.photos/seed/universe/1920/1080"
        alt="Universe background"
        fill
        className="object-cover"
        data-ai-hint="universe stars"
      />
      <div className="absolute inset-0 bg-black/60" />
      <Card className="w-full max-w-sm z-10 border-white/10 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                <Shield className="h-8 w-8" />
            </div>
          <CardTitle className="font-headline text-2xl">Admin Console</CardTitle>
          <CardDescription>Enter your credentials to access the panel.</CardDescription>
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
                className="bg-transparent border-white/20"
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
                autoComplete="current-password"
                className="bg-transparent border-white/20"
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
