'use client';

import { useState, useMemo, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, User, Plus, MoreVertical, Check, Video, Lock, Mic } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { UserProfile } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';

function UserListSkeleton() {
    return (
        <div className="space-y-2 px-2">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 h-[72px]">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-2 w-12" />
                        </div>
                        <Skeleton className="h-3 w-3/4" />
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
    const [activeFilter, setActiveFilter] = useState('All');

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
        <div className="h-[calc(100vh-3.5rem)] mt-14 flex bg-[#0b141a] text-gray-300">
            {/* Left Sidebar - Chat List */}
            <aside className="w-full max-w-sm h-full border-r border-white/10 bg-[#111b21] flex flex-col">
                <header className="p-3 h-16 flex items-center justify-between border-b border-white/10 bg-[#202c33]">
                    <h2 className="font-semibold text-xl text-gray-200">Chats</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                            <Plus className="h-5 w-5"/>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                            <MoreVertical className="h-5 w-5"/>
                        </Button>
                    </div>
                </header>
                <div className="p-2 border-b border-white/10">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search or start a new chat"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-[#202c33] rounded-lg border-transparent focus:bg-[#2a3942] h-9"
                        />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        {['All', 'Unread', 'Favourites', 'Groups'].map(filter => (
                             <Button 
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                variant="ghost"
                                className={cn(
                                    "rounded-full h-8 px-3 text-sm",
                                    activeFilter === filter ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                                )}
                             >
                                 {filter}
                             </Button>
                        ))}
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    {isLoading ? <UserListSkeleton /> : (
                        filteredUsers.map(user => (
                            <button
                                key={user.id}
                                onClick={() => setSelectedUser(user)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-2 text-left h-[72px] transition-colors border-b border-white/5",
                                    selectedUser?.id === user.id ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
                                )}
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={user.photoURL} alt={user.name} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-gray-100 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-400">Yesterday</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Check className="h-4 w-4 text-blue-400"/>
                                        <p className="text-sm text-gray-400 truncate">Click to see messages</p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </ScrollArea>
            </aside>

            {/* Right Panel - Chat Area */}
            <main className="flex-1 flex flex-col" style={{ backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFNJREFUSEtjZKAxYKSyeQMDw6CgoADGAbAMHEDA+ExyF4yB4T81j0ZkARhMhKk4gB8NYNnBAAyYgUj8Nxn+H4n/ZsNA/D8S/82GYQAxAwAD91GA/es02QAAAABJRU5ErkJggg==')`, backgroundBlendMode: 'soft-light', backgroundColor: '#0b141a' }}>
                {selectedUser ? (
                    <>
                        <header className="flex items-center justify-between p-2 h-16 border-b border-white/10 bg-[#202c33] z-10">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={selectedUser.photoURL} alt={selectedUser.name} />
                                    <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-gray-100">{selectedUser.name}</h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"><Video className="h-5 w-5"/></Button>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"><Search className="h-5 w-5"/></Button>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"><MoreVertical className="h-5 w-5"/></Button>
                            </div>
                        </header>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-end">
                            <div className="self-center bg-[#005c4b]/80 text-white/90 text-xs px-2 py-1 rounded-md">
                                28/01/2026
                            </div>
                           <div className="self-center bg-[#182229] text-[#8696a0] text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                                <Lock className="h-3 w-3"/>
                                <span>Messages and calls are end-to-end encrypted. Click to learn more.</span>
                           </div>
                           <p className="text-center text-xs text-muted-foreground py-4">Messaging functionality coming soon.</p>
                        </div>
                        <footer className="px-4 py-2 bg-[#202c33] z-10 flex items-center gap-3">
                            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                                <Plus className="h-6 w-6" />
                            </Button>
                            <div className="flex-1 relative">
                                <Input placeholder="Type a message" className="bg-[#2a3942] rounded-lg border-transparent h-10 px-4 text-white" />
                            </div>
                             <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                                <Mic className="h-6 w-6" />
                            </Button>
                        </footer>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center">
                        <div className='max-w-md'>
                            <div className="mx-auto bg-gray-700/20 p-6 rounded-full w-fit mb-6">
                                <User className="h-20 w-20 text-gray-500" />
                            </div>
                            <h2 className="mt-4 text-2xl font-light text-gray-200">Aviraj Info Tech Chat</h2>
                            <p className="mt-2 text-sm text-gray-400">
                                Send and receive messages with end-to-end encryption. <br/> Select a user from the left to begin a conversation.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
    