
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, LayoutDashboard, Users, Settings, Bell } from 'lucide-react';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarInset 
} from '@/components/ui/sidebar';
import { StudentsList } from '@/components/admin/students-list';


export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState('students');
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
                  <SidebarMenuButton size="lg" onClick={() => setActiveView('students')} isActive={activeView === 'students'}>
                    <Users />
                    STUDENTS/ENROLL
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" onClick={() => setActiveView('example2')} isActive={activeView === 'example2'}>
                    <LayoutDashboard />
                    EXAMPLE-2
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" onClick={() => setActiveView('example3')} isActive={activeView === 'example3'}>
                    <Settings />
                    EXAMPLE-3
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <div className="p-6">
              <div className="flex justify-end items-center mb-6 gap-2">
                <Button variant="outline" size="icon" onClick={() => setActiveView('notifications')}>
                  <Bell className="h-4 w-4" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <Button variant="outline" onClick={() => setActiveView('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
              
              <div className="bg-card border rounded-lg p-8">
                {activeView === 'students' && (
                    <StudentsList />
                )}
                {activeView === 'example2' && (
                    <div className="text-center aspect-video flex items-center justify-center">
                        <div>
                            <h2 className="text-2xl font-bold font-headline">Secure View: EXAMPLE-2</h2>
                            <p className="text-muted-foreground mt-2">Content for Example 2 is displayed here.</p>
                        </div>
                    </div>
                )}
                {activeView === 'example3' && (
                    <div className="text-center aspect-video flex items-center justify-center">
                        <div>
                            <h2 className="text-2xl font-bold font-headline">Secure View: EXAMPLE-3</h2>
                            <p className="text-muted-foreground mt-2">Content for Example 3 is displayed here.</p>
                        </div>
                    </div>
                )}
                {activeView === 'notifications' && (
                    <div className="text-center aspect-video flex items-center justify-center">
                        <div>
                            <h2 className="text-2xl font-bold font-headline">Secure View: Notifications</h2>
                            <p className="text-muted-foreground mt-2">Notifications content is displayed here.</p>
                        </div>
                    </div>
                )}
                {activeView === 'settings' && (
                    <div className="text-center aspect-video flex items-center justify-center">
                        <div>
                            <h2 className="text-2xl font-bold font-headline">Secure View: Settings</h2>
                            <p className="text-muted-foreground mt-2">Settings content is displayed here.</p>
                        </div>
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
                autoComplete="off"
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
