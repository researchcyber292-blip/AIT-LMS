
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';


export function StudentsList() {
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<UserProfile | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();
  const studentsQuery = useMemoFirebase(() => collection(firestore, 'users'), [firestore]);
  const { data: students, isLoading, error } = useCollection<UserProfile>(studentsQuery);


  const getInitials = (name: string) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }
  
  const handleDeleteStudent = async () => {
    if (!studentToDelete || !firestore) return;

    const userDocRef = doc(firestore, 'users', studentToDelete.id);
    const enrollmentsColRef = collection(firestore, 'users', studentToDelete.id, 'enrollments');
    

    try {
      const batch = writeBatch(firestore);
      // Get all enrollment documents for the user
      const enrollmentsSnapshot = await getDocs(enrollmentsColRef);
      
      // Add each enrollment document to the batch for deletion
      enrollmentsSnapshot.forEach((enrollmentDoc) => {
        batch.delete(enrollmentDoc.ref);
      });

      // Add the main user document to the batch for deletion
      batch.delete(userDocRef);

      // Commit the batch to delete everything atomically
      await batch.commit();

      toast({
        title: 'User Data Deleted',
        description: `The profile for ${studentToDelete.name} and all related data have been removed.`,
      });
    } catch (e: any) {
        // Instead of a generic console log, we create a detailed contextual error
        // to help diagnose the exact security rule that is failing.
        const permissionError = new FirestorePermissionError({
          path: `users/${studentToDelete.id}`, // The root of the delete operation
          operation: 'delete',
        });

        // Emit the error to the global listener, which will display it in the dev overlay.
        errorEmitter.emit('permission-error', permissionError);

        toast({
            variant: 'destructive',
            title: 'Deletion Failed',
            description: 'Could not remove user data due to insufficient permissions.',
        });
    } finally {
      setStudentToDelete(null);
    }
  };


  const renderLoading = () => (
    <TableBody>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
            <TableCell>
                <Skeleton className="h-10 w-10 rounded-full" />
            </TableCell>
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
                <Skeleton className="h-8 w-36" />
            </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Secure View: Students & Enrollment</h2>
        
        {error && <div className="text-destructive-foreground bg-destructive p-4 rounded-md">Error loading students: {error.message}</div>}

        <div className="rounded-lg border bg-card">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Avatar</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Onboarding Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                {isLoading ? renderLoading() : (
                    <TableBody>
                    {(students || []).map((student) => (
                        <TableRow key={student.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={student.photoURL} />
                                    <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">{student.username}</div>
                            </TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 text-xs rounded-full capitalize ${student.onboardingStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {student.onboardingStatus.replace('_', ' ')}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                               <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                                      View Details
                                  </Button>
                                  <Button variant="destructive" size="sm" onClick={() => setStudentToDelete(student)}>
                                      Delete
                                  </Button>
                               </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                )}
            </Table>
             {(!isLoading && (!students || students.length === 0)) && (
                <div className="text-center p-8 text-muted-foreground">No student data found.</div>
            )}
        </div>
        
        {/* View Details Dialog */}
        {selectedStudent && (
            <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Student Details</DialogTitle>
                        <DialogDescription>
                            Full information for {selectedStudent.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 text-sm">
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">User ID</span>
                            <span className="font-mono text-xs break-all">{selectedStudent.id}</span>
                        </div>
                         <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Full Name</span>
                            <span>{selectedStudent.name}</span>
                        </div>
                         <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Username</span>
                            <span>{selectedStudent.username}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Email</span>
                            <span className="break-all">{selectedStudent.email}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Alternate Email</span>
                            <span>{selectedStudent.alternateEmail || 'N/A'}</span>
                        </div>
                         <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Mobile Number</span>
                            <span>{selectedStudent.mobileNumber || 'N/A'}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Mother's Name</span>
                            <span>{selectedStudent.motherName || 'N/A'}</span>
                        </div>
                        <div className="grid grid-cols-[150px_1fr] items-center gap-4">
                            <span className="text-muted-foreground">Father's Name</span>
                            <span>{selectedStudent.fatherName || 'N/A'}</span>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!studentToDelete} onOpenChange={(open) => !open && setStudentToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the Firestore document for <strong>{studentToDelete?.name}</strong> and all associated data (like enrollments).
                        This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteStudent} className="bg-destructive hover:bg-destructive/90">
                        Yes, Delete User Data
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
