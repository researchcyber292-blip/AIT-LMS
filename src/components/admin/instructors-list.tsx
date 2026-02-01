
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
import { collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { Instructor } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Check, X, Ban, Trash2, Eye } from 'lucide-react';
import { Separator } from '../ui/separator';

export function InstructorsList() {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [instructorToBan, setInstructorToBan] = useState<Instructor | null>(null);
  const [instructorToDelete, setInstructorToDelete] = useState<Instructor | null>(null);
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { toast } = useToast();

  const instructorsQuery = useMemoFirebase(() => {
    if (!user || !user.isAnonymous) return null;
    return collection(firestore, 'instructors');
  }, [firestore, user]);

  const { data: instructors, isLoading: isCollectionLoading, error } = useCollection<Instructor>(instructorsQuery);
  const isLoading = isAuthLoading || isCollectionLoading;

  const handleUpdateStatus = async (instructorId: string, newStatus: 'active' | 'rejected' | 'banned') => {
    if (!firestore) return;

    const instructorDocRef = doc(firestore, 'instructors', instructorId);
    
    try {
      await updateDoc(instructorDocRef, { 
        accountStatus: newStatus,
        isVerified: newStatus === 'active'
      });
      toast({
        title: 'Instructor Updated',
        description: `The instructor has been ${newStatus}.`,
      });
    } catch (e: any) {
        const permissionError = new FirestorePermissionError({
          path: instructorDocRef.path,
          operation: 'update',
          requestResourceData: { accountStatus: newStatus },
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: 'Could not update instructor due to insufficient permissions.',
        });
    }
  };

  const handleDeleteInstructor = async (instructor: Instructor) => {
    if (!firestore) return;

    const instructorDocRef = doc(firestore, 'instructors', instructor.id);
    const walletDocRef = doc(firestore, 'wallets', instructor.id);
    
    try {
      await deleteDoc(instructorDocRef);
      await deleteDoc(walletDocRef);
      
      toast({
        title: 'Instructor Data Deleted',
        description: `Firestore data for ${instructor.firstName} ${instructor.lastName} has been removed. To complete deletion, remove them from Firebase Authentication manually.`,
      });
    } catch (e: any) {
        const permissionError = new FirestorePermissionError({
          path: e.path || `instructors/${instructor.id}`,
          operation: 'delete',
        });
        errorEmitter.emit('permission-error', permissionError);

        toast({
            variant: 'destructive',
            title: 'Deletion Failed',
            description: 'Could not remove instructor data due to insufficient permissions.',
        });
    } finally {
      setInstructorToDelete(null);
    }
  };

  const renderLoading = () => (
    <TableBody>
      {[...Array(3)].map((_, i) => (
        <TableRow key={i}>
            <TableCell>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-3 w-24" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-48" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
            </TableCell>
            <TableCell className="text-right">
                <Skeleton className="h-8 w-48" />
            </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
  
  const statusVariant = (status: 'pending' | 'active' | 'rejected' | 'banned') => {
      switch(status) {
          case 'active': return 'default';
          case 'pending': return 'secondary';
          case 'rejected': return 'destructive';
          case 'banned': return 'destructive';
          default: return 'outline';
      }
  }

  return (
    <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Instructor Management</h2>
        <p className="text-muted-foreground mb-6">Review pending applications and manage instructor accounts.</p>
        
        {error && <div className="text-destructive-foreground bg-destructive p-4 rounded-md">Error loading instructors: {error.message}</div>}

        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Instructor</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                {isLoading ? renderLoading() : (
                    <TableBody>
                    {(instructors || []).map((instructor) => (
                        <TableRow key={instructor.id}>
                            <TableCell>
                                <div className="font-medium">{instructor.firstName} {instructor.lastName}</div>
                            </TableCell>
                            <TableCell>{instructor.email}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant(instructor.accountStatus)} className="capitalize">
                                    {instructor.accountStatus}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                               <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="icon" onClick={() => setSelectedInstructor(instructor)}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View Details</span>
                                  </Button>
                                  {instructor.accountStatus === 'pending' && (
                                      <>
                                          <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(instructor.id, 'active')}>
                                              <Check className="mr-2 h-4 w-4" /> Approve
                                          </Button>
                                          <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(instructor.id, 'rejected')}>
                                              <X className="mr-2 h-4 w-4" /> Reject
                                          </Button>
                                      </>
                                  )}
                                  {instructor.accountStatus === 'active' && (
                                    <Button variant="destructive" size="sm" onClick={() => setInstructorToBan(instructor)}>
                                        <Ban className="mr-2 h-4 w-4" /> Ban
                                    </Button>
                                  )}
                                  {(instructor.accountStatus === 'banned' || instructor.accountStatus === 'rejected') && (
                                    <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(instructor.id, 'active')}>
                                        <Check className="mr-2 h-4 w-4" /> {instructor.accountStatus === 'banned' ? 'Unban' : 'Approve'}
                                    </Button>
                                  )}
                                  <Button variant="destructive" size="icon" onClick={() => setInstructorToDelete(instructor)}>
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete Instructor</span>
                                  </Button>
                               </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                )}
            </Table>
             {(!isLoading && (!instructors || instructors.length === 0)) && (
                <div className="text-center p-8 text-muted-foreground">No instructor data found.</div>
            )}
        </div>

        {selectedInstructor && (
            <Dialog open={!!selectedInstructor} onOpenChange={(open) => !open && setSelectedInstructor(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Instructor Details</DialogTitle>
                        <DialogDescription>
                            Full information for {selectedInstructor.firstName} {selectedInstructor.lastName}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 text-sm">
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">First Name</span>
                            <span>{selectedInstructor.firstName}</span>
                        </div>
                         <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Last Name</span>
                            <span>{selectedInstructor.lastName}</span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Mother's Name</span>
                            <span>{selectedInstructor.motherName}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Father's Name</span>
                            <span>{selectedInstructor.fatherName}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Age</span>
                            <span>{selectedInstructor.age}</span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Email</span>
                            <span className="break-all">{selectedInstructor.email}</span>
                        </div>
                         <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Alternate Email</span>
                            <span className="break-all">{selectedInstructor.alternateEmail || 'N/A'}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Mobile Number</span>
                            <span>{selectedInstructor.mobileNumber || 'N/A'}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Alternate Mobile</span>
                            <span>{selectedInstructor.alternateMobileNumber || 'N/A'}</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )}

        <AlertDialog open={!!instructorToBan} onOpenChange={(open) => !open && setInstructorToBan(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to ban this instructor?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will set the account status to 'banned', immediately revoking instructor privileges.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            if (instructorToBan) {
                                handleUpdateStatus(instructorToBan.id, 'banned');
                                setInstructorToBan(null);
                            }
                        }}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Yes, Ban Instructor
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!instructorToDelete} onOpenChange={(open) => !open && setInstructorToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the Firestore data for <strong>{instructorToDelete?.firstName} {instructorToDelete?.lastName}</strong> (including their Profile and Wallet). This action cannot be undone. You must also manually delete them from Firebase Authentication.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            if (instructorToDelete) {
                                handleDeleteInstructor(instructorToDelete);
                            }
                        }}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Yes, Delete Instructor Data
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
