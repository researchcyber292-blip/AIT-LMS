'use client';

import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, User } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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
    const { user: currentUser } = useUser();
    const firestore = useFirestore();
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'users');
    }, [firestore]);

    const { data: users, isLoading } = useCollection<UserProfile>(usersQuery);

    const filteredUsers = useMemo(() => {
        if (!users) return [];
        // Filter out the current user and apply search query
        return users.filter(user =>
            user.id !== currentUser?.uid &&
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery, currentUser]);

    const getInitials = (name: string) => {
        if (!name) return '??';
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`;
        }
        return name.substring(0, 2);
    }

    return (
        <div className="h-[calc(100vh-3.5rem)] mt-14 flex">
            {/* Left Sidebar - User List */}
            <aside className="w-full max-w-xs h-full border-r bg-card flex flex-col">
                <div className="p-4 border-b">
                    <h2 className="font-headline text-2xl font-bold">A-Message</h2>
                    <p className="text-sm text-muted-foreground">Connect with others</p>
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
                                    selectedUser?.id === user.id && "bg-muted"
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
            <main className="flex-1 flex flex-col bg-background">
                {selectedUser ? (
                    <>
                        <header className="flex items-center gap-3 p-4 border-b">
                            <Avatar>
                                <AvatarImage src={selectedUser.photoURL} alt={selectedUser.name} />
                                <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-semibold">{selectedUser.name}</h3>
                                <p className="text-xs text-muted-foreground">Ask your doubts here</p>
                            </div>
                        </header>
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                            {/* Placeholder for messages */}
                            <p className="text-muted-foreground">Messaging functionality coming soon.</p>
                            <p className="text-sm text-muted-foreground">You can start a conversation with {selectedUser.name}.</p>
                        </div>
                        <footer className="p-4 border-t">
                            <div className="relative">
                                <Input placeholder="Type your message..." className="pr-12 h-12" />
                                <Button size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8">
                                    <Send className="h-4 w-4" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </div>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center">
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