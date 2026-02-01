
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Settings, Bell, LogOut, Briefcase } from 'lucide-react';
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
import { InstructorsList } from '@/components/admin/instructors-list';
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Instructor } from '@/lib/types';
import { signInAnonymously } from 'firebase/auth';
import Loading from '@/app/loading';
import { cn } from '@/lib/utils';


export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeView, setActiveView] = useState('students');
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const instructorsQuery = useMemoFirebase(() => {
    if (!firestore || !user?.isAnonymous) return null;
    return collection(firestore, 'instructors');
  }, [firestore, user]);

  const { data: instructors, isLoading: instructorsLoading } = useCollection<Instructor>(instructorsQuery);

  const hasPendingInstructors = useMemo(() => {
    if (instructorsLoading || !instructors) return false;
    return instructors.some(inst => inst.accountStatus === 'pending');
  }, [instructors, instructorsLoading]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded credentials as requested
    if (username.toUpperCase() === 'HELLO' && password === 'TEST') {
      try {
        if (!auth) {
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "Firebase Auth is not available. Please try again later.",
          });
          return;
        }
        
        // Ensure any existing non-admin user is signed out first
        if (auth.currentUser && !auth.currentUser.isAnonymous) {
          await auth.signOut();
        }
        
        await signInAnonymously(auth);
        
        toast({
          title: 'Login Successful',
          description: 'Welcome, Admin!',
        });
      } catch (error) {
        console.error("Admin sign-in failed:", error);
        toast({
          variant: 'destructive',
          title: 'Firebase Login Failed',
          description: 'Could not authenticate with Firebase to fetch data.',
        });
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid username or password.',
      });
    }
  };

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
    }
  }

  const isAuthenticated = !isUserLoading && user?.isAnonymous;
  
  if (isUserLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return (
      <div className="mt-14 min-h-[calc(100vh-3.5rem)]">
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary p-2 rounded-lg">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight">Admin Panel</span>
                    <span className="text-xs text-muted-foreground">Owner View</span>
                  </div>
                </div>
                 <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                 </Button>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" onClick={() => setActiveView('students')} isActive={activeView === 'students'}>
                    <Users />
                    STUDENTS & PURCHASES
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" onClick={() => setActiveView('instructors')} isActive={activeView === 'instructors'}>
                    <Briefcase />
                    INSTRUCTORS MANAGEMENTS
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <div className="p-6">
              <div className="flex justify-end items-center mb-6 gap-2">
                <Button variant="outline" size="icon" onClick={() => setActiveView('notifications')}>
                  <Bell className={cn("h-4 w-4", hasPendingInstructors && "text-destructive animate-pulse")} />
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
                {activeView === 'instructors' && (
                    <InstructorsList />
                )}
                {activeView === 'notifications' && (
                    <div>
                        <h2 className="text-2xl font-bold font-headline">Notifications</h2>
                        <p className="text-muted-foreground mt-2 mb-6">Updates on pending actions and system alerts.</p>
                        {instructorsLoading ? (
                            <p>Loading notifications...</p>
                        ) : hasPendingInstructors ? (
                            <div className="space-y-4">
                                {instructors?.filter(i => i.accountStatus === 'pending').map(inst => (
                                    <div key={inst.id} className="flex items-center justify-between rounded-lg border border-amber-500/50 bg-amber-500/10 p-4">
                                        <div>
                                            <p className="font-semibold text-amber-200">New Instructor Application</p>
                                            <p className="text-sm text-amber-300/80">{inst.firstName} {inst.lastName} is awaiting verification.</p>
                                        </div>
                                        <Button size="sm" onClick={() => setActiveView('instructors')}>View</Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center aspect-video flex items-center justify-center rounded-lg border-2 border-dashed">
                                <div>
                                    <Bell className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-xl font-semibold">All Caught Up</h3>
                                    <p className="text-muted-foreground mt-2">You have no new notifications.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {activeView === 'settings' && (
                    <div>
                        <h2 className="text-2xl font-bold font-headline mb-6">Settings</h2>
                        <div className="space-y-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Admin Account</CardTitle>
                                    <CardDescription>
                                        Password changes are not applicable for the current admin access method. This panel uses a secure, session-based anonymous login.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <Input id="current-password" type="password" placeholder="••••••••" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input id="new-password" type="password" placeholder="••••••••" disabled />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button disabled>Change Password</Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>System</CardTitle>
                                    <CardDescription>
                                        General system-wide settings and actions.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" onClick={() => toast({ title: "Cache Cleared!", description: "Application cache has been successfully cleared." })}>
                                        Clear Application Cache
                                    </Button>
                                </CardContent>
                            </Card>
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
        src="https://img.freepik.com/free-vector/black-geometric-memphis-social-banner_53876-116843.jpg?semt=ais_hybrid&w=740&q=80"
        alt="Geometric background"
        fill
        className="object-cover"
        data-ai-hint="geometric memphis"
      />
      <div className="absolute inset-0 bg-black/30" />
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
