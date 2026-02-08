
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, User, Plus, MoreVertical, Briefcase, User as UserIcon } from 'lucide-react';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser, useAuth } from '@/firebase';
import type { UserProfile, ChatMessage, Instructor } from '@/lib/types';
import { User } from 'firebase/auth';
import { collection, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, getDoc, writeBatch, where, runTransaction } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, MessageSquare, MoreHorizontal, Trash2, Users } from 'lucide-react';


const VerifiedTick = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
        <path fill="currentColor" fillRule="evenodd" d="M10.4521 1.31159C11.2522 0.334228 12.7469 0.334225 13.5471 1.31159L14.5389 2.52304L16.0036 1.96981C17.1853 1.52349 18.4796 2.2708 18.6839 3.51732L18.9372 5.06239L20.4823 5.31562C21.7288 5.51992 22.4761 6.81431 22.0298 7.99598L21.4765 9.46066L22.688 10.4525C23.6653 11.2527 23.6653 12.7473 22.688 13.5475L21.4765 14.5394L22.0298 16.004C22.4761 17.1857 21.7288 18.4801 20.4823 18.6844L18.9372 18.9376L18.684 20.4827C18.4796 21.7292 17.1853 22.4765 16.0036 22.0302L14.5389 21.477L13.5471 22.6884C12.7469 23.6658 11.2522 23.6658 10.4521 22.6884L9.46022 21.477L7.99553 22.0302C6.81386 22.4765 5.51948 21.7292 5.31518 20.4827L5.06194 18.9376L3.51687 18.6844C2.27035 18.4801 1.52305 17.1857 1.96937 16.004L2.5226 14.5394L1.31115 13.5475C0.333786 12.7473 0.333782 11.2527 1.31115 10.4525L2.5226 9.46066L1.96937 7.99598C1.52304 6.81431 2.27036 5.51992 3.51688 5.31562L5.06194 5.06239L5.31518 3.51732C5.51948 2.2708 6.81387 1.52349 7.99553 1.96981L9.46022 2.52304L10.4521 1.31159ZM11.2071 16.2071L18.2071 9.20712L16.7929 7.79291L10.5 14.0858L7.20711 10.7929L5.79289 12.2071L9.79289 16.2071C9.98043 16.3947 10.2348 16.5 10.5 16.5C10.7652 16.5 11.0196 16.3947 11.2071 16.2071Z" clipRule="evenodd"></path>
    </svg>
);


function getInitials(name: string | null | undefined): string {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1 && names[names.length - 1]) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
}

function WorldChatView({ userRole }: { userRole: 'student' | 'instructor' }) {
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
        
        // Instructors and admins have no message limit.
        if (userRole === 'instructor') {
            setNewMessage(''); // Optimistically clear input
            const isAdmin = user.isAnonymous;
            const adminRoleKey = isAdmin ? localStorage.getItem('adminChatRole') : null;
            const adminContact = adminRoleKey ? aitContacts.find(c => c.id.startsWith(`ait_${adminRoleKey.split('-')[0]}`)) : null;

            const messageData = {
                text: messageText,
                userId: user.uid,
                userName: isAdmin && adminContact ? adminContact.name : (user.displayName || 'Anonymous'),
                userAvatar: isAdmin && adminContact ? adminContact.photoURL : (user.photoURL || null),
                timestamp: serverTimestamp(),
                isInstructor: true
            };

            try {
                await addDoc(collection(firestore, 'public_chat'), messageData);
            } catch (error: any) {
                console.error("Error sending message:", error);
                toast({ variant: 'destructive', title: "Send failed", description: "You may not have permission to send messages." });
                setNewMessage(messageText); // Restore message on failure
            } finally {
                setIsSending(false);
            }
            return;
        }

        // --- Student message limit logic ---
        try {
            await runTransaction(firestore, async (transaction) => {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userDoc = await transaction.get(userDocRef);

                if (!userDoc.exists()) {
                    throw new Error("User profile not found.");
                }

                const userData = userDoc.data() as UserProfile;
                const stats = userData.publicChatStats;
                const now = new Date();
                const weekInMs = 7 * 24 * 60 * 60 * 1000;
                
                let isNewWeek = false;
                const isFirstEverMessage = !stats || !stats.weekStartTimestamp || (stats.weekStartTimestamp as any)?.toDate().getTime() === 0;

                if (!isFirstEverMessage) {
                    const weekStartDate = (stats.weekStartTimestamp as any).toDate();
                    if (now.getTime() - weekStartDate.getTime() > weekInMs) {
                        isNewWeek = true;
                    }
                }
                
                const messageData = {
                    text: messageText,
                    userId: user.uid,
                    userName: user.displayName || 'Anonymous',
                    userAvatar: user.photoURL || null,
                    timestamp: serverTimestamp(),
                };

                if (isFirstEverMessage || isNewWeek) {
                    // Can send, will reset counter to 1
                    const newMessageRef = doc(collection(firestore, 'public_chat'));
                    transaction.set(newMessageRef, messageData);
                    transaction.update(userDocRef, {
                        publicChatStats: { messageCount: 1, weekStartTimestamp: serverTimestamp() }
                    });
                    setNewMessage('');
                } else {
                    // Same week, check count
                    if (stats.messageCount < 50) {
                        const newMessageRef = doc(collection(firestore, 'public_chat'));
                        transaction.set(newMessageRef, messageData);
                        transaction.update(userDocRef, {
                            publicChatStats: {
                                messageCount: stats.messageCount + 1,
                                weekStartTimestamp: stats.weekStartTimestamp
                            }
                        });
                        setNewMessage('');
                    } else {
                        throw new Error("You have reached your weekly message limit of 50 messages.");
                    }
                }
            });
        } catch (error: any) {
            console.error("Error in send message transaction:", error);
            toast({
                variant: 'destructive',
                title: "Message Not Sent",
                description: error.message || "An error occurred.",
            });
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
                    <Avatar className="h-10 w-10 bg-white p-1.5">
                        <AvatarImage src="/image.png" alt="World Chat" className="object-contain" />
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
                     const isInstructor = message.isInstructor;
                     return (
                         <div key={message.id || index} className={cn("flex items-end gap-2 group", isCurrentUser ? "justify-end" : "justify-start")}>
                            {!isCurrentUser && (
                                 <Avatar className="h-8 w-8">
                                     <AvatarImage src={message.userAvatar || undefined} alt={message.userName} />
                                     <AvatarFallback>{getInitials(message.userName)}</AvatarFallback>
                                 </Avatar>
                            )}
                            <div className={cn("max-w-md p-2 px-3 rounded-2xl", isCurrentUser ? "bg-[#005c4b] rounded-br-none" : "bg-[#202c33] rounded-bl-none")}>
                                 {!isCurrentUser && (
                                    <p className={cn("text-xs font-semibold pb-1 flex items-center gap-1.5", isInstructor ? "text-yellow-400" : "text-primary")}>
                                        {message.userName}
                                        {isInstructor && <VerifiedTick className="h-4 w-4 text-blue-400" />}
                                    </p>
                                )}
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

function PrivateChatView({ chatPartner, currentUser, userRole }: { chatPartner: UserProfile | typeof aitContacts[0], currentUser: User, userRole: 'student' | 'instructor' }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const chatId = useMemo(() => {
        if (!currentUser) return null;
        const ids = [currentUser.uid, chatPartner.id].sort();
        return ids.join('_');
    }, [currentUser.uid, chatPartner.id]);

    const messagesQuery = useMemoFirebase(() => {
        if (!firestore || !chatId) return null;
        return query(collection(firestore, 'private_chats', chatId, 'messages'), orderBy('timestamp', 'asc'));
    }, [firestore, chatId]);

    const { data: messages, isLoading: messagesLoading } = useCollection<ChatMessage>(messagesQuery);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || !firestore || !chatId || isSending) return;

        setIsSending(true);
        const messageText = newMessage;
        setNewMessage('');
        
        const isAdmin = userRole === 'instructor' && currentUser?.isAnonymous;
        const adminRole = isAdmin ? localStorage.getItem('adminChatRole') : null;
        const adminContact = adminRole ? aitContacts.find(c => c.id.startsWith(`ait_${adminRole.split('-')[0]}`)) : null;

        const messageData: Omit<ChatMessage, 'id' | 'timestamp'> = {
            text: messageText,
            userId: currentUser.uid,
            userName: isAdmin && adminContact ? adminContact.name : (currentUser.displayName || 'Anonymous'),
            userAvatar: isAdmin && adminContact ? adminContact.photoURL : (currentUser.photoURL || null),
            isRead: false,
            ...(isAdmin && { isInstructor: true })
        };

        try {
            await addDoc(collection(firestore, 'private_chats', chatId, 'messages'), {
                ...messageData,
                timestamp: serverTimestamp()
            });
        } catch (error: any) {
            console.error("Error sending private message:", error);
            toast({ variant: 'destructive', title: "Send failed", description: "You may not have permission to send messages." });
            setNewMessage(messageText);
        } finally {
            setIsSending(false);
        }
    };
    
    return (
        <>
            <header className="flex items-center justify-between p-2 h-16 border-b border-white/10 bg-[#202c33] z-10">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={chatPartner.photoURL || undefined} alt={chatPartner.name || ''} className={cn(('verified' in chatPartner && chatPartner.verified) && 'p-1.5 object-contain')} />
                        <AvatarFallback>{getInitials(chatPartner.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-gray-100 flex items-center gap-1.5">
                            {chatPartner.name}
                            {'verified' in chatPartner && chatPartner.verified && <VerifiedTick className="h-4 w-4 text-blue-400" />}
                        </h3>
                        <p className="text-xs text-emerald-400">Online</p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </header>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messagesLoading && <div className="text-center text-gray-400">Loading messages...</div>}
                {!messagesLoading && messages?.map((message, index) => {
                     const isCurrentUser = message.userId === currentUser?.uid;
                     const isInstructor = message.isInstructor;
                     return (
                         <div key={message.id || index} className={cn("flex items-end gap-2 group", isCurrentUser ? "justify-end" : "justify-start")}>
                            {!isCurrentUser && (
                                 <Avatar className="h-8 w-8">
                                     <AvatarImage src={message.userAvatar || undefined} alt={message.userName} />
                                     <AvatarFallback>{getInitials(message.userName)}</AvatarFallback>
                                 </Avatar>
                            )}
                            <div className={cn("max-w-md p-2 px-3 rounded-2xl", isCurrentUser ? "bg-[#005c4b] rounded-br-none" : "bg-[#202c33] rounded-bl-none")}>
                                 {!isCurrentUser && <p className={cn("text-xs font-semibold pb-1 flex items-center gap-1.5", isInstructor ? "text-yellow-400" : "text-primary")}>
                                     {message.userName}
                                     {isInstructor && <VerifiedTick className="h-4 w-4 text-blue-400" />}
                                 </p>}
                                <p className="text-white text-sm whitespace-pre-wrap">{message.text}</p>
                                <p className="text-xs text-white/50 text-right mt-1">
                                    {message.timestamp ? formatDistanceToNow(message.timestamp.toDate(), { addSuffix: true }) : 'sending...'}
                                </p>
                            </div>
                         </div>
                     );
                })}
                <div ref={messagesEndRef} />
            </div>
            <footer className="px-4 py-2 bg-[#202c33] z-10 flex items-center gap-3">
                <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-3">
                    <div className="flex-1 relative">
                        <Input 
                            placeholder={`Message ${chatPartner.name}`}
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
        </>
    )
}

const aitContacts = [
    { id: 'ait_ethical-hacking_support', name: 'AIT HACKING', photoURL: '/image.png', verified: true, email: 'hacking@avirajinfotech.com' },
    { id: 'ait_coding_support', name: 'AIT CODING', photoURL: '/image.png', verified: true, email: 'coding@avirajinfotech.com' },
    { id: 'ait_data-science_support', name: 'AIT DATA SCIENCE', photoURL: '/image.png', verified: true, email: 'ds@avirajinfotech.com' },
    { id: 'ait_full-stack-dev_support', name: 'AIT FULL STACK DEV', photoURL: '/image.png', verified: true, email: 'webdev@avirajinfotech.com' },
    { id: 'ait_ai-ml_support', name: 'AIT AI & ML', photoURL: '/image.png', verified: true, email: 'aiml@avirajinfotech.com' },
    { id: 'ait_robotics-tech_support', name: 'AIT ROBOTICS & TECH', photoURL: '/image.png', verified: true, email: 'robotics@avirajinfotech.com' },
];

function AitContactButton({ contact, activeChatId, onSelectChat }: { contact: typeof aitContacts[0], activeChatId: string, onSelectChat: (contact: any) => void }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const isActive = activeChatId === contact.id;

    const chatId = useMemo(() => {
        if (!user) return null;
        const ids = [user.uid, contact.id].sort();
        return ids.join('_');
    }, [user, contact.id]);

    const unreadQuery = useMemoFirebase(() => {
        if (!firestore || !user || !chatId) return null;
        return query(
            collection(firestore, 'private_chats', chatId, 'messages'),
            where('userId', '==', contact.id),
            where('isRead', '==', false)
        );
    }, [firestore, user, chatId, contact.id]);

    const { data: unreadMessages } = useCollection(unreadQuery);
    const unreadCount = unreadMessages?.length || 0;

    useEffect(() => {
        if (isActive && unreadMessages && unreadMessages.length > 0 && firestore && chatId) {
            const batch = writeBatch(firestore);
            unreadMessages.forEach(msg => {
                const msgRef = doc(firestore, 'private_chats', chatId, 'messages', msg.id);
                batch.update(msgRef, { isRead: true });
            });
            batch.commit().catch(err => {
                console.error("Failed to mark messages as read:", err);
            });
        }
    }, [isActive, unreadMessages, firestore, chatId]);


    return (
        <button
            onClick={() => onSelectChat(contact)}
            className={cn(
                "w-full flex items-center gap-3 p-2 text-left h-[72px] transition-colors border-b border-white/5 relative",
                isActive ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
            )}
        >
            <Avatar className="h-12 w-12">
                <AvatarImage src={contact.photoURL} alt={contact.name || ''} className={'p-1.5 object-contain'} />
                <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-gray-100 truncate flex items-center gap-1.5">
                    {contact.name}
                    <VerifiedTick className="h-4 w-4 text-blue-400" />
                </p>
                <p className="text-sm text-gray-400 truncate">
                    Official AIT Support
                </p>
            </div>
            {unreadCount > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                </div>
            )}
        </button>
    );
}

function ChatSidebar({ userRole, activeChatId, onSelectChat }: { userRole: 'student' | 'instructor', activeChatId: string | 'public', onSelectChat: (contact: UserProfile | typeof aitContacts[0] | 'public') => void }) {
    const [searchQuery, setSearchQuery] = useState('');
    const firestore = useFirestore();

    const studentsQuery = useMemoFirebase(() => {
        if (userRole !== 'instructor' || !firestore) return null;
        return collection(firestore, 'users');
    }, [userRole, firestore]);
    const { data: students, isLoading: studentsLoading } = useCollection<UserProfile>(studentsQuery);

    const contacts = useMemo(() => {
        if (userRole === 'instructor') {
             if (!students) return [];
             return students.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return aitContacts.filter(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [students, searchQuery, userRole]);

    return (
        <aside className="w-full max-w-sm h-full border-r border-white/10 bg-[#111b21] flex flex-col">
            <header className="p-3 h-16 flex items-center justify-between border-b border-white/10 bg-[#202c33]">
                <h2 className="font-semibold text-xl text-gray-200">Chats</h2>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full">
                        <Plus className="h-5 w-5"/>
                    </Button>
                </div>
            </header>
            <div className="p-2 border-b border-white/10">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-[#202c33] rounded-lg border-transparent focus:bg-[#2a3942] h-9"
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                 <button
                    onClick={() => onSelectChat('public')}
                    className={cn(
                        "w-full flex items-center gap-3 p-2 text-left h-[72px] transition-colors border-b border-white/5",
                        activeChatId === 'public' ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
                    )}
                >
                    <Avatar className="h-12 w-12 bg-white p-1.5">
                        <AvatarImage src="/image.png" alt="World Chat" className="object-contain" />
                        <AvatarFallback className="bg-emerald-600 text-white"><Users className="h-6 w-6" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <p className="font-semibold text-gray-100 truncate">World Chat</p>
                        <p className="text-sm text-gray-400 truncate">Public channel for all users</p>
                    </div>
                </button>
                {userRole === 'instructor' && studentsLoading && (
                    <div className="p-4 text-center text-sm text-muted-foreground">Loading students...</div>
                )}

                {userRole === 'student' && contacts.map(contact => (
                    <AitContactButton key={contact.id} contact={contact as typeof aitContacts[0]} activeChatId={activeChatId} onSelectChat={onSelectChat} />
                ))}

                {userRole === 'instructor' && contacts.map(contact => (
                     <button
                        key={contact.id}
                        onClick={() => onSelectChat(contact as UserProfile)}
                        className={cn(
                            "w-full flex items-center gap-3 p-2 text-left h-[72px] transition-colors border-b border-white/5",
                            activeChatId === contact.id ? "bg-[#2a3942]" : "hover:bg-[#202c33]"
                        )}
                    >
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={(contact as UserProfile).photoURL} alt={contact.name || ''} />
                            <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-semibold text-gray-100 truncate">{contact.name}</p>
                            <p className="text-sm text-gray-400 truncate">{contact.email}</p>
                        </div>
                    </button>
                ))}
            </ScrollArea>
        </aside>
    );
}

function ChatView({ userRole }: { userRole: 'student' | 'instructor' }) {
    const [activeChat, setActiveChat] = useState<UserProfile | typeof aitContacts[0] | 'public'>('public');
    const { user } = useUser();

    const handleSelectChat = (contact: UserProfile | typeof aitContacts[0] | 'public') => {
        setActiveChat(contact);
    };
  
    if (!user) return <Loading />;

    const activeChatId = activeChat === 'public' ? 'public' : activeChat.id;
    
    return (
        <div className="h-screen w-screen flex bg-[#0b141a] text-gray-300">
            <ChatSidebar userRole={userRole} activeChatId={activeChatId} onSelectChat={handleSelectChat} />
            <main className="flex-1 flex flex-col" style={{ backgroundImage: `url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFNJREFUSEtjZKAxYKSyeQMDw6CgoADGAbAMHEDA+ExyF4yB4T81j0ZkARhMhKk4gB8NYNnBAAyYgUj8Nxn+H4n/ZsNA/D8S/82GYQAxAwAD91GA/es02QAAAABJRU5ErkJggg==')`, backgroundBlendMode: 'soft-light', backgroundColor: '#0b141a' }}>
                 {activeChat === 'public' ? (
                    <WorldChatView userRole={userRole} />
                 ) : (
                    <PrivateChatView chatPartner={activeChat} currentUser={user} userRole={userRole} />
                 )}
            </main>
        </div>
    );
}

function RoleSelectionView({ onSelectStudent }: { onSelectStudent: () => void }) {
    const router = useRouter();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md text-center">
                <h1 className="text-4xl font-bold font-headline">Support Center</h1>
                <p className="text-muted-foreground mt-2 mb-8">How would you like to log in?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="hover:border-primary hover:shadow-lg transition-all cursor-pointer" onClick={onSelectStudent}>
                        <CardHeader className="items-center">
                            <div className="p-4 bg-primary/10 rounded-full mb-2">
                                <UserIcon className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>I'm a Student</CardTitle>
                        </CardHeader>
                    </Card>
                     <Card className="hover:border-primary hover:shadow-lg transition-all cursor-pointer" onClick={() => router.push('/instructor-login')}>
                        <CardHeader className="items-center">
                             <div className="p-4 bg-primary/10 rounded-full mb-2">
                                <Briefcase className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle>I'm an Instructor</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function LoginView({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ variant: 'destructive', title: 'Login Failed', description: 'Please enter both email and password.' });
      return;
    }
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Login Successful' });
    } catch (error: any) {
      let description = 'An unexpected error occurred.';
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          description = 'Invalid email or password.';
          break;
        default:
          description = error.message;
          break;
      }
      toast({ variant: 'destructive', title: 'Login Failed', description });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Student Login</CardTitle>
                <CardDescription>Enter your credentials to access the support chat.</CardDescription>
            </CardHeader>
            <CardContent>
                 <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
                    </div>
                     <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required />
                    </div>
                    <Button type="submit" className="w-full !mt-6" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Log in'}
                    </Button>
                 </form>
            </CardContent>
            <CardContent>
                 <Button variant="link" onClick={onBack} className="p-0 h-auto">
                    Back to role selection
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}

export default function MessagingPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const [showStudentLogin, setShowStudentLogin] = useState(false);
    const [userRole, setUserRole] = useState<'student' | 'instructor' | null>(null);

    const isSpecialAdmin = user?.isAnonymous;

    const userDocRef = useMemoFirebase(() => (user && !isSpecialAdmin) ? doc(firestore, 'users', user.uid) : null, [firestore, user, isSpecialAdmin]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

    const instructorDocRef = useMemoFirebase(() => (user && !isSpecialAdmin) ? doc(firestore, 'instructors', user.uid) : null, [firestore, user, isSpecialAdmin]);
    const { data: instructorProfile, isLoading: isInstructorProfileLoading } = useDoc<Instructor>(instructorDocRef);

    const isLoading = isUserLoading || (user && !isSpecialAdmin && (isProfileLoading || isInstructorProfileLoading));

    useEffect(() => {
        if (isLoading) {
            return;
        }

        if (!user) {
            setUserRole(null);
            localStorage.removeItem('adminChatRole');
            return;
        }

        if (user.isAnonymous) {
             const adminChatRole = localStorage.getItem('adminChatRole');
             if (adminChatRole) {
                setUserRole('instructor');
                return;
             }
        }
        
        if (instructorProfile) {
            setUserRole('instructor');
        } else if (userProfile || user) { // Check for userProfile or just authenticated user
            setUserRole('student');
        } else {
            setUserRole(null);
        }

    }, [isLoading, user, userProfile, instructorProfile]);


    if (isLoading || (user && !userRole && !showStudentLogin)) {
        return <Loading />;
    }

    if (!userRole) {
        if (showStudentLogin) {
            return <LoginView onBack={() => setShowStudentLogin(false)} />;
        }
        return <RoleSelectionView onSelectStudent={() => setShowStudentLogin(true)} />;
    }

    return <ChatView userRole={userRole} />;
}

    