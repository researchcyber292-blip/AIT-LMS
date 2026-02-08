'use client';

import { useState, useMemo, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, User } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

function UserListSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2 w-32" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function MessagingPage() {
    const { user: currentUser, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const usersQuery = useMemoFirebase(() => {
        if (!firestore || !currentUser) return null;
        return collection(firestore, 'users');
    }, [firestore, currentUser]);

    const { data: users, isLoading: isCollectionLoading } = useCollection<UserProfile>(usersQuery);
    const isLoading = isUserLoading || isCollectionLoading;
    
    useEffect(() => {
        if (!isUserLoading && !currentUser) {
          router.replace('/login');
        }
    }, [currentUser, isUserLoading, router]);

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        return users.filter(user =>
            user.id !== currentUser?.uid &&
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery, currentUser]);

    const getInitials = (name: string | null) => {
        if (!name) return '??';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`;
        }
        return name.substring(0, 2);
    }
    
    if (isLoading) {
        return <Loading />;
    }
    
    if (!currentUser) {
        return null;
    }

    return (
        <div className="h-[calc(100vh-3.5rem)] mt-14 flex">
            {/* Left Sidebar - User List */}
            <aside className="w-full max-w-xs h-full border-r bg-card flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="font-headline text-2xl font-bold">Support Chat</h2>
                    <p className="text-sm text-muted-foreground">Connect with students &amp; support</p>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-2">
                    {isLoading ? <UserListSkeleton /> : (
                        filteredUsers.map(user => (
                            <button
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={cn(
                                    "w-full flex items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted",
                                    selectedUser?.id === user.id && "bg-accent/10"
                                )}
                            >
                                <Avatar>
                                    <AvatarImage src={user.photoURL} alt={user.name} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{user.name}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{user.email}</p>
                                </div>
                            </button>
                        ))
                    )}
                    </div>
                </ScrollArea>
            </aside>

            {/* Right Panel - Chat Area */}
            <main className="flex-1 flex flex-col bg-muted/20">
                {selectedUser ? (
                    <>
                        <header className="flex items-center gap-3 p-3 border-b bg-card shadow-sm z-10">
                            <Avatar>
                                <AvatarImage src={selectedUser.photoURL} alt={selectedUser.name} />
                                <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">{selectedUser.name}</h3>
                                <p className="text-xs text-muted-foreground">Ask your doubts here</p>
                            </div>
                        </header>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`}}>
                            {/* Example Messages */}
                            <div className="flex items-end gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={selectedUser.photoURL} />
                                    <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                                </Avatar>
                                <div className="bg-card rounded-lg p-3 max-w-md shadow-sm">
                                    <p className="text-sm">Hello! I have a question about the Ethical Hacking course.</p>
                                </div>
                            </div>
                            <div className="flex items-end gap-2 justify-end">
                                <div className="bg-accent text-accent-foreground rounded-lg p-3 max-w-md shadow-sm">
                                    <p className="text-sm">Hi there! I can help with that. What would you like to know?</p>
                                </div>
                                <Avatar className="h-8 w-8">
                                     <AvatarImage src={currentUser.photoURL || undefined} />
                                    <AvatarFallback>{getInitials(currentUser.displayName || '')}</AvatarFallback>
                                </Avatar>
                            </div>
                            <p className="text-center text-xs text-muted-foreground py-4">Messaging functionality coming soon.</p>
                        </div>
                        <footer className="p-3 border-t bg-card/80 backdrop-blur-sm z-10">
                            <div className="relative">
                                <Input placeholder="Type your message..." className="pr-12 h-12 rounded-full" />
                                <Button size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full">
                                    <Send className="h-4 w-4" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`}}>
                        <div>
                            <User className="h-16 w-16 text-muted-foreground mx-auto" />
                            <h2 className="mt-4 text-xl font-semibold">Select a User</h2>
                            <p className="mt-1 text-muted-foreground">Choose someone from the left panel to start a conversation.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
