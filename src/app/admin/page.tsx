'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, LogOut, LayoutDashboard, Users, Settings, Bell } from 'lucide-react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarInset 
} from '@/components/ui/sidebar';


export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('example1');
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
      <div className="mt-14 min-h-[calc(100vh-3.5rem)]">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary p-2 rounded-lg">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold tracking-tight">Admin Panel</span>
                  <span className="text-xs text-muted-foreground">Owner View</span>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView('example1')} isActive={activeView === 'example1'}>
                    <LayoutDashboard />
                    EXAMPLE-1
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView('example2')} isActive={activeView === 'example2'}>
                    <Users />
                    EXAMPLE-2
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveView('example3')} isActive={activeView === 'example3'}>
                    <Settings />
                    EXAMPLE-3
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setIsAuthenticated(false)}>
                    <LogOut />
                    Logout
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset>
            <div className="p-6">
              <div className="flex justify-end items-center mb-6 gap-2">
                <Button variant="outline" size="icon">
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
              
              <div className="aspect-video bg-card border rounded-lg flex items-center justify-center p-8">
                {activeView === 'example1' && (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold font-headline">Content for EXAMPLE-1</h2>
                        <p className="text-muted-foreground mt-2">This is the main content area for the first example.</p>
                    </div>
                )}
                {activeView === 'example2' && (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold font-headline">Content for EXAMPLE-2</h2>
                        <p className="text-muted-foreground mt-2">This is the main content area for the second example.</p>
                    </div>
                )}
                {activeView === 'example3' && (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold font-headline">Content for EXAMPLE-3</h2>
                        <p className="text-muted-foreground mt-2">This is the main content area for the third example.</p>
                    </div>
                )}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
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
