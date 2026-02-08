'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, User, Plus, MoreVertical, Check, Video, Lock, Mic, Users, MessageSquare, MoreHorizontal, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { UserProfile, ChatMessage } from '@/lib/types';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';


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

function getInitials(name: string | null | undefined): string {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1 && names[names.length - 1]) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
}

function WorldChatView() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [messageToEdit, setMessageToEdit] = useState<ChatMessage | null>(null);
    const [editedText, setEditedText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const messagesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'public_chat'), orderBy('timestamp', 'asc'));
    }, [firestore]);

    const { data: messages, isLoading: messagesLoading } = useCollection<ChatMessage>(messagesQuery);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || !firestore || isSending) return;

        setIsSending(true);
        const messageText = newMessage;
        setNewMessage('');

        const messageData = {
            text: messageText,
            userId: user.uid,
            userName: user.displayName || 'Anonymous',
            userAvatar: user.photoURL || null,
            timestamp: serverTimestamp()
        };

        try {
            await addDoc(collection(firestore, 'public_chat'), messageData);
        } catch (error: any) {
            console.error("Error sending message:", error);
            toast({ variant: 'destructive', title: "Send failed", description: "You may not have permission to send messages." });
            setNewMessage(messageText); // Re-populate input on error
        } finally {
            setIsSending(false);
        }
    };
    
    const handleDeleteMessage = async (messageId: string) => {
        if (!firestore || !messageId) {
            toast({ variant: 'destructive', title: "Error", description: "Cannot delete message." });
            return;
        };
        try {
            await deleteDoc(doc(firestore, 'public_chat', messageId));
            toast({ title: "Message Deleted" });
        } catch (error) {
            console.error("Error deleting message:", error);
            toast({ variant: 'destructive', title: "Delete failed", description: "You may not have permission to delete this message." });
        }
    };
    
    const handleUpdateMessage = async () => {
        if (!firestore || !messageToEdit || !editedText.trim()) return;

        const messageRef = doc(firestore, 'public_chat', messageToEdit.id);
        try {
            await updateDoc(messageRef, {
                text: editedText
            });
            toast({ title: "Message Updated" });
            setMessageToEdit(null);
            setEditedText('');
        } catch (error) {
            console.error("Error updating message:", error);
            toast({ variant: 'destructive', title: "Update failed", description: "You may not have permission to edit this message." });
        }
    };
    
    return (
        <>
            <header className="flex items-center justify-between p-2 h-16 border-b border-white/10 bg-[#202c33] z-10">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-white p-1">
                        <AvatarImage src="/avirajinfotech.png" alt="World Chat" className="object-contain" />
                        <AvatarFallback className="bg-emerald-600 text-white"><Users className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-gray-100">World Chat</h3>
                        <p className="text-xs text-emerald-400">Talk with everyone on the platform</p>
                    </div>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="self-center bg-[#182229] text-[#8696a0] text-xs px-3 py-2 rounded-lg flex items-center gap-2 max-w-max mx-auto">
                    <MessageSquare className="h-3 w-3"/>
                    <span>This is a public channel. Messages are visible to all users.</span>
                </div>

                {messagesLoading && <div className="text-center text-gray-400">Loading messages...</div>}
                {!messagesLoading && messages?.map((message, index) => {
                     const isCurrentUser = message.userId === user?.uid;
                     return (
                         <div key={message.id || index} className={cn("flex items-end gap-2 group", isCurrentUser ? "justify-end" : "justify-start")}>
                            {!isCurrentUser && (
                                 <Avatar className="h-8 w-8">
                                     <AvatarImage src={message.userAvatar || undefined} alt={message.userName} />
                                     <AvatarFallback>{getInitials(message.userName)}</AvatarFallback>
                                 </Avatar>
                            )}
                            <div className={cn("max-w-md p-2 px-3 rounded-2xl", isCurrentUser ? "bg-[#005c4b] rounded-br-none" : "bg-[#202c33] rounded-bl-none")}>
                                 {!isCurrentUser && <p className="text-xs font-semibold text-primary pb-1">{message.userName}</p>}
                                <p className="text-white text-sm whitespace-pre-wrap">{message.text}</p>
                                <p className="text-xs text-white/50 text-right mt-1">
                                    {message.timestamp ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true }) : 'sending...'}
                                </p>
                            </div>
                            {isCurrentUser && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuItem onClick={() => {
                                                setMessageToEdit(message);
                                                setEditedText(message.text);
                                            }}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDeleteMessage(message.id)} className="text-destructive">
                                                 <Trash2 className="mr-2 h-4 w-4" />
                                                <span>Delete</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                           )}
                         </div>
                     );
                })}
                <div ref={messagesEndRef} />
            </div>
            <footer className="px-4 py-2 bg-[#202c33] z-10 flex items-center gap-3">
                <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-3">
                    <div className="flex-1 relative">
                        <Input 
                            placeholder="Type a message in World Chat" 
                            className="bg-[#2a3942] rounded-lg border-transparent h-10 px-4 text-white" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={isSending}
                            autoComplete="off"
                        />
                    </div>
                    <Button type="submit" variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full" disabled={isSending || !newMessage.trim()}>
                        <Send className="h-5 w-5" />
                    </Button>
                </form>
            </footer>
             <Dialog open={!!messageToEdit} onOpenChange={(open) => !open && setMessageToEdit(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Message</DialogTitle>
                    </DialogHeader>
                    <Textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setMessageToEdit(null)}>Cancel</Button>
                        <Button onClick={handleUpdateMessage}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

const aitContacts = [
    { id: 'ait_hacking', name: 'AIT HACKING', photoURL: '/avirajinfotech.png', verified: true, email: 'hacking@avirajinfotech.com' },
    { id: 'ait_coding', name: 'AIT CODING', photoURL: '/avirajinfotech.png', verified: true, email: 'coding@avirajinfotech.com' },
    { id: 'ait_datascience', name: 'AIT DATA SCIENCE', photoURL: '/avirajinfotech.png', verified: true, email: 'ds@avirajinfotech.com' },
];

export default function MessagingPage() {
    const { user: currentUser, isUserLoading } = useUser();
    const firestore = useFirestore();
    const router = useRouter();
    const [activeChat, setActiveChat] = useState<UserProfile | typeof aitContacts[0] | 'public' | null>('public');
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

    const filteredUsersAndContacts = useMemo(() => {
        if (!users) return { ait: [], students: [] };
        
        const lowerCaseQuery = searchQuery.toLowerCase();

        const filteredAit = aitContacts.filter(c => 
            c.name.toLowerCase().includes(lowerCaseQuery)
        );

        const filteredStudents = users.filter(user =>
            user.id !== currentUser?.uid &&
            user.name.toLowerCase().includes(lowerCaseQuery)
        );

        return { ait: filteredAit, students: filteredStudents };
    }, [users, searchQuery, currentUser]);
    
    if (isLoading) {
        return <Loading />;
    }
    
    if (!currentUser) {
        return null;
    }

    const renderUserButton = (user: UserProfile | typeof aitContacts[0]) => {
        const isActive = activeChat && typeof activeChat === 'object' && activeChat.id === user.id;
        const isVerified = 'verified' in user && user.verified;

        return (
            <button
                key={user.id}
                onClick={() => setActiveChat(user)}
                className={cn(
                    "w-full flex items-center gap-3 p-2 text-left h-[72px] transition-colors border-b border-white/5",
                    isActive ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
                )}
            >
                <Avatar className="h-12 w-12">
                    <AvatarImage src={user.photoURL} alt={user.name} className={cn(isVerified && 'p-1 object-contain')} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-100 truncate flex items-center gap-1.5">
                            {user.name}
                            {isVerified && <CheckCircle className="h-4 w-4 text-blue-400" />}
                        </p>
                        <p className="text-xs text-gray-400">Yesterday</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <Check className="h-4 w-4 text-blue-400"/>
                        <p className="text-sm text-gray-400 truncate">Click to see messages</p>
                    </div>
                </div>
            </button>
        );
    };

    return (
        <div className="h-screen w-screen flex bg-[#0b141a] text-gray-300 pt-16">
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
                        {['All', 'Unread', 'Favourites'].map(filter => (
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
                    <button
                        onClick={() => setActiveChat('public')}
                        className={cn(
                            "w-full flex items-center gap-3 p-2 text-left h-[72px] transition-colors border-b border-white/5",
                            activeChat === 'public' ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
                        )}
                    >
                        <Avatar className="h-12 w-12 bg-white p-1.5">
                            <AvatarImage src="/avirajinfotech.png" alt="World Chat" className="object-contain" />
                            <AvatarFallback className="bg-emerald-600 text-white"><Users className="h-6 w-6" /></AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold text-gray-100 truncate">World Chat</p>
                            <p className="text-sm text-gray-400 truncate">Talk with everyone on the platform</p>
                        </div>
                    </button>
                    {isLoading ? <UserListSkeleton /> : (
                        <>
                            {filteredUsersAndContacts.ait.map(renderUserButton)}
                            {filteredUsersAndContacts.students.map(renderUserButton)}
                        </>
                    )}
                </ScrollArea>
            </aside>

            <main className="flex-1 flex flex-col" style={{ backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFNJREFUSEtjZKAxYKSyeQMDw6CgoADGAbAMHEDA+ExyF4yB4T81j0ZkARhMhKk4gB8NYNnBAAyYgUj8Nxn+H4n/ZsNA/D8S/82GYQAxAwAD91GA/es02QAAAABJRU5ErkJggg==')`, backgroundBlendMode: 'soft-light', backgroundColor: '#0b141a' }}>
                {activeChat === 'public' ? (
                   <WorldChatView />
                ) : activeChat && typeof activeChat === 'object' ? (
                    <>
                        <header className="flex items-center justify-between p-2 h-16 border-b border-white/10 bg-[#202c33] z-10">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={activeChat.photoURL} alt={activeChat.name} className={cn(('verified' in activeChat && activeChat.verified) && 'p-1 object-contain')}/>
                                    <AvatarFallback>{getInitials(activeChat.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-gray-100 flex items-center gap-1.5">
                                        {activeChat.name}
                                        {'verified' in activeChat && activeChat.verified && <CheckCircle className="h-4 w-4 text-blue-400" />}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"><Video className="h-5 w-5"/></Button>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"><Search className="h-5 w-5"/></Button>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"><MoreVertical className="h-5 w-5"/></Button>
                            </div>
                        </header>
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-end">
                           <div className="self-center bg-[#182229] text-[#8696a0] text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                                <Lock className="h-3 w-3"/>
                                <span>Messages and calls are end-to-end encrypted. Click to learn more.</span>
                           </div>
                           <p className="text-center text-xs text-muted-foreground py-4">Private messaging functionality coming soon.</p>
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
                                <MessageSquare className="h-20 w-20 text-gray-500" />
                            </div>
                            <h2 className="mt-4 text-2xl font-light text-gray-200">Aviraj Info Tech Support</h2>
                            <p className="mt-2 text-sm text-gray-400">
                                Join the World Chat to talk with the community, <br/> or select a user to start a private conversation.
                            </p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
