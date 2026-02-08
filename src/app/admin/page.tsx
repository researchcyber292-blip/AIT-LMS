
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { signInAnonymously, signOut, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, UserCheck, Mail, UserPlus, LogOut, Shield } from 'lucide-react';
import { StudentsList } from '@/components/admin/students-list';
import { InstructorsList } from '@/components/admin/instructors-list';
import { ContactMailsList } from '@/components/admin/contact-mails-list';
import { ManualEnrollment } from '@/components/admin/manual-enrollment';
import Loading from '@/app/loading';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Hardcoded credentials for the admin panel
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin@ait.admin.admin";

function AdminLoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const auth = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            try {
                // Ensure persistence to keep the admin session
                await setPersistence(auth, browserLocalPersistence);
                await signInAnonymously(auth);
                toast({ title: "Admin Access Granted" });
                onLoginSuccess();
            } catch (error) {
                console.error("Admin sign-in failed:", error);
                toast({ variant: 'destructive', title: 'Login Failed', description: 'Could not start an admin session.' });
                setIsLoading(false);
            }
        } else {
            toast({ variant: 'destructive', title: 'Access Denied', description: 'Invalid credentials.' });
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center px-4">
            <Image
                src="https://images.unsplash.com/photo-1558005550-ab1c48325608?w=1080"
                alt="Server room background"
                fill
                className="object-cover"
                data-ai-hint="servers data center"
            />
            <div className="absolute inset-0 bg-black/70" />
            <Card className="z-10 w-full max-w-sm border-primary/20 bg-card/50 shadow-lg backdrop-blur-sm">
                <CardHeader className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle className="mt-4 text-2xl font-bold">Admin Console</CardTitle>
                    <CardDescription>Enter your credentials to manage the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={isLoading} />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
                        </div>
                        <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
                            {isLoading ? 'Authenticating...' : 'Enter Admin Console'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

function AdminDashboard() {
    const [activeView, setActiveView] = useState('students');
    const auth = useAuth();

    const menuItems = [
        { id: 'students', label: 'Students & Purchases', icon: Users },
        { id: 'instructors', label: 'Instructor Management', icon: UserCheck },
        { id: 'enrollment', label: 'Manual Enrollment', icon: UserPlus },
        { id: 'mails', label: 'Contact Submissions', icon: Mail },
    ];

    const renderActiveView = () => {
        switch (activeView) {
            case 'students':
                return <StudentsList />;
            case 'instructors':
                return <InstructorsList />;
            case 'enrollment':
                return <ManualEnrollment />;
            case 'mails':
                return <ContactMailsList />;
            default:
                return <StudentsList />;
        }
    };
    
    return (
        <div className="flex min-h-screen bg-muted/40 pt-16">
            <aside className="hidden md:flex w-72 flex-col border-r bg-background">
                <div className="border-b p-4">
                    <h2 className="text-2xl font-bold font-headline">Admin Panel</h2>
                </div>
                <nav className="flex-1 space-y-2 p-4">
                    {menuItems.map(item => (
                        <Button
                            key={item.id}
                            variant={activeView === item.id ? 'secondary' : 'ghost'}
                            className="w-full justify-start"
                            onClick={() => setActiveView(item.id)}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Button>
                    ))}
                </nav>
                <div className="mt-auto border-t p-4">
                    <Button variant="outline" className="w-full justify-start" onClick={() => signOut(auth)}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>
            <main className="flex-1 p-6 lg:p-8">
                {renderActiveView()}
            </main>
        </div>
    );
}


export default function AdminPage() {
    const { user, isUserLoading } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    
    // This effect determines if the logged-in user is our special anonymous admin
    useEffect(() => {
        if (!isUserLoading) {
            // A user is considered an admin if they are logged in and their session is anonymous
            setIsAdmin(!!user && user.isAnonymous);
        }
    }, [user, isUserLoading]);
    
    if (isUserLoading) {
        return <Loading />;
    }

    if (isAdmin) {
        return <AdminDashboard />;
    }

    // Pass setIsAdmin to update the state upon successful login
    return <AdminLoginPage onLoginSuccess={() => setIsAdmin(true)} />;
}
