'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, MoreVertical, Circle, Compass, Bell } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

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
      <div className="relative flex min-h-[calc(100vh-3.5rem)] mt-14 items-center justify-center bg-background text-white">
        <Image
          src="https://images.unsplash.com/photo-1593455048013-333c151b8d64?q=80&w=1920&auto=format&fit=crop"
          alt="Wireframe background"
          fill
          className="object-cover"
          data-ai-hint="digital wireframe architecture"
        />
        <div className="absolute inset-0 bg-black/70" />

        {/* Top Right Controls */}
        <div className="absolute top-8 right-8 flex items-center gap-4 text-white/70">
            <Button variant="ghost" size="icon" className="text-white/70 hover:bg-white/10 hover:text-white">
                <Bell className="h-5 w-5" />
            </Button>
            <Circle className="h-5 w-5 opacity-50" />
            <Circle className="h-5 w-5 opacity-50" />
            <div className="h-24">
                <Slider
                    defaultValue={[50]}
                    max={100}
                    step={1}
                    orientation="vertical"
                    className="data-[orientation=vertical]:w-2"
                />
            </div>
            <Circle className="h-5 w-5 opacity-50" />
            <Circle className="h-5 w-5 opacity-50" />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 hover:text-white">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/80 border-white/20 text-white">
                    <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">Settings</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsAuthenticated(false)} className="cursor-pointer focus:bg-white/10 focus:text-white">Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        
        {/* Bottom Left Controls */}
        <div className="absolute bottom-8 left-8">
            <Button variant="ghost" size="icon" className="text-white/70 hover:bg-white/10 hover:text-white">
                <Compass className="h-6 w-6" />
            </Button>
        </div>

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
