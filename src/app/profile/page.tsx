
'use client';

import { useState } from 'react';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, Trash2 } from 'lucide-react';
import Loading from '@/app/loading';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : name.substring(0, 2);
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);

    try {
      // Step 1: Delete Firestore document
      // Note: This does not delete subcollections like 'enrollments'.
      // A Cloud Function triggered by user deletion is the recommended way to handle that.
      await deleteDoc(doc(firestore, 'users', user.uid));

      // Step 2: Delete the user from Firebase Auth
      await deleteUser(user);

      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
      });
      // onAuthStateChanged will handle the redirect to the login page automatically.
    } catch (error: any) {
      console.error('Error deleting account:', error);
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/requires-recent-login') {
        description =
          'This is a sensitive operation. Please sign out and sign back in before trying again.';
      }
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description,
      });
    } finally {
      setIsDeleting(false);
      setConfirmationText('');
    }
  };

  if (isUserLoading || !user) {
    return <Loading />;
  }

  const isConfirmationMatch = confirmationText === 'DELETE';

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24 border-4 border-primary">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || ''} />
            <AvatarFallback className="text-3xl">
              {getInitials(user.displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h1 className="font-headline text-3xl font-bold">{user.displayName}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Card className="mt-12">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>View and manage your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <p className="font-medium">Sign Out</p>
                <p className="text-sm text-muted-foreground">End your current session.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => auth.signOut()}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription className="text-destructive/80">
              These actions are permanent and cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-card p-4">
              <div className="space-y-0.5">
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <AlertDialog onOpenChange={(open) => !open && setConfirmationText('')}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove your data from our servers. To confirm, please type{' '}
                      <span className="font-bold text-foreground">DELETE</span> in the box below.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Label htmlFor="delete-confirm" className="sr-only">
                      Confirmation
                    </Label>
                    <Input
                      id="delete-confirm"
                      value={confirmationText}
                      onChange={(e) => setConfirmationText(e.target.value)}
                      placeholder="DELETE"
                      className="border-destructive focus-visible:ring-destructive"
                      autoComplete="off"
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={!isConfirmationMatch || isDeleting}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      {isDeleting ? 'Deleting...' : 'I understand, delete my account'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
