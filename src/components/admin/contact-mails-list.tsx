
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError, useUser } from '@/firebase';
import { collection, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import type { ContactSubmission } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Eye } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export function ContactMailsList() {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [submissionToDelete, setSubmissionToDelete] = useState<ContactSubmission | null>(null);
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const submissionsQuery = useMemoFirebase(() => {
    if (!user || !user.isAnonymous || !firestore) return null;
    return query(collection(firestore, 'contact_submissions'), orderBy('submittedAt', 'desc'));
  }, [firestore, user]);

  const { data: submissions, isLoading, error } = useCollection<ContactSubmission>(submissionsQuery);

  const handleDelete = async (submissionId: string) => {
    if (!firestore) return;
    const docRef = doc(firestore, 'contact_submissions', submissionId);
    try {
        await deleteDoc(docRef);
        toast({ title: "Submission Deleted" });
    } catch (e: any) {
        const permissionError = new FirestorePermissionError({ path: docRef.path, operation: 'delete' });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Deletion Failed', description: 'Could not delete submission due to insufficient permissions.' });
    } finally {
        setSubmissionToDelete(null);
    }
  };
  
  const formatDate = (timestamp: { seconds: number; nanoseconds: number; } | null) => {
    if (!timestamp) return 'N/A';
    try {
        const date = new Date(timestamp.seconds * 1000);
        return `${format(date, 'MMM d, yyyy, h:mm a')} (${formatDistanceToNow(date, { addSuffix: true })})`;
    } catch(e) {
        return 'Invalid Date';
    }
  };

  const renderLoading = () => (
    <TableBody>
      {[...Array(3)].map((_, i) => (
        <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-40" /></TableCell>
            <TableCell><Skeleton className="h-4 w-48" /></TableCell>
            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-8 w-36" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Contact Form Submissions</h2>
        <p className="text-muted-foreground mb-6">View and manage messages from your visitors.</p>
        
        {error && <div className="text-destructive-foreground bg-destructive p-4 rounded-md">Error loading submissions: {error.message}</div>}

        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>From</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {isLoading ? renderLoading() : (
                    <TableBody>
                    {(submissions || []).map((submission) => (
                        <TableRow key={submission.id}>
                            <TableCell>{`${submission.firstName} ${submission.lastName}`}</TableCell>
                            <TableCell>{submission.email}</TableCell>
                            <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                            <TableCell className="text-right">
                               <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setSelectedSubmission(submission)}>
                                    <Eye className="mr-2 h-4 w-4" /> View
                                  </Button>
                                  <Button variant="destructive" size="sm" onClick={() => setSubmissionToDelete(submission)}>
                                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </Button>
                               </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                )}
            </Table>
             {(!isLoading && (!submissions || submissions.length === 0)) && (
                <div className="text-center p-8 text-muted-foreground">No contact submissions yet.</div>
            )}
        </div>

        {selectedSubmission && (
            <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Message from {selectedSubmission.firstName}</DialogTitle>
                        <DialogDescription>
                            Submitted on {formatDate(selectedSubmission.submittedAt)}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 text-sm max-h-[70vh] overflow-y-auto pr-4">
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="text-muted-foreground">Full Name</span>
                            <span>{`${selectedSubmission.firstName} ${selectedSubmission.lastName}`}</span>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="text-muted-foreground">Email</span>
                            <a href={`mailto:${selectedSubmission.email}`} className="text-primary hover:underline break-all">{selectedSubmission.email}</a>
                        </div>
                        <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="text-muted-foreground">Mobile Number</span>
                            <a href={`tel:${selectedSubmission.mobileNumber}`} className="text-primary hover:underline">{selectedSubmission.mobileNumber}</a>
                        </div>
                         <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="text-muted-foreground">Company Size</span>
                            <span>{selectedSubmission.companySize || 'Not provided'}</span>
                        </div>
                         <div className="grid grid-cols-[120px_1fr] gap-2">
                            <span className="text-muted-foreground">Demo Requested</span>
                            <span>{selectedSubmission.scheduleDemo ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <span className="text-muted-foreground">Message</span>
                            <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">{selectedSubmission.message}</div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )}

        <AlertDialog open={!!submissionToDelete} onOpenChange={(open) => !open && setSubmissionToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete this message. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => submissionToDelete && handleDelete(submissionToDelete.id)}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Yes, Delete Message
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
