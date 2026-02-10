
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
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError, useUser } from '@/firebase';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import type { UserProfile, Enrollment } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { COURSES } from '@/data/content';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';


export function StudentsList() {
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<UserProfile | null>(null);
  const [studentEnrollments, setStudentEnrollments] = useState<Enrollment[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { toast } = useToast();

  const studentsQuery = useMemoFirebase(() => {
    if (!user || !user.isAnonymous) return null;
    return collection(firestore, 'users');
  }, [firestore, user]);

  const { data: students, isLoading: isCollectionLoading, error } = useCollection<UserProfile>(studentsQuery);
  const isLoading = isAuthLoading || isCollectionLoading;

  const handleViewDetails = async (student: UserProfile) => {
    setSelectedStudent(student);
    if (student) {
      setIsLoadingEnrollments(true);
      setStudentEnrollments([]);
      if (firestore) {
        const enrollmentsQuery = collection(firestore, 'users', student.id, 'enrollments');
        try {
          const snapshot = await getDocs(enrollmentsQuery);
          const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment));
          setStudentEnrollments(enrollments);
        } catch (err: any) {
          const permissionError = new FirestorePermissionError({
            path: `users/${student.id}/enrollments`,
            operation: 'list',
          });
          errorEmitter.emit('permission-error', permissionError);
          toast({
            variant: 'destructive',
            title: 'Error loading enrollments',
            description: 'Could not fetch enrollment data due to insufficient permissions.',
          });
        } finally {
          setIsLoadingEnrollments(false);
        }
      }
    }
  };


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
      const enrollmentsSnapshot = await getDocs(enrollmentsColRef);
      for (const enrollmentDoc of enrollmentsSnapshot.docs) {
        await deleteDoc(enrollmentDoc.ref);
      }
      await deleteDoc(userDocRef);

      toast({
        title: 'User Data Deleted from Firestore',
        description: `IMPORTANT: The data for ${studentToDelete.name} has been removed. To complete deletion and allow this email to be re-used, you must now manually delete this user from the Firebase Authentication console.`,
        duration: 9000,
      });
    } catch (e: any) {
        const permissionError = new FirestorePermissionError({
          path: e.path || `users/${studentToDelete.id}`,
          operation: 'delete',
        });
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
        <h2 className="text-2xl font-bold font-headline mb-4">Secure View: Students & Purchases</h2>
        
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
                                    <AvatarImage src={student.photoURL || undefined} />
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
                                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(student)}>
                                      View Details
                                  </Button>
                                  <Button variant="destructive" size="icon" onClick={() => setStudentToDelete(student)}>
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete Student</span>
                                  </Button>
                               </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                )}
            </Table>
             {(!isLoading && (!students || students.length === 0)) && (
                <div className="text-center p-8 text-muted-foreground">No student data found. The admin user may not be authenticated.</div>
            )}
        </div>
        
        {selectedStudent && (
            <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Student Details</DialogTitle>
                        <DialogDescription>
                            Full information and purchase history for {selectedStudent.name}.
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
                            <span className="text-muted-foreground">Mobile Number</span>
                            <span>{selectedStudent.mobileNumber || 'N/A'}</span>
                        </div>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="mb-2 font-medium">Course Enrollments</h4>
                        {isLoadingEnrollments ? (
                            <div className="text-center p-4 text-sm text-muted-foreground">Loading enrollments...</div>
                        ) : studentEnrollments.length > 0 ? (
                            <ScrollArea className="h-64">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Course</TableHead>
                                            <TableHead>Instructor</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {studentEnrollments.map((enrollment) => {
                                            const course = COURSES.find(c => c.id === enrollment.courseId);
                                            const instructorName = course?.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Official';
                                            return (
                                                <TableRow key={enrollment.id}>
                                                    <TableCell className="font-medium">{course?.title || enrollment.courseId}</TableCell>
                                                    <TableCell>{instructorName}</TableCell>
                                                    <TableCell>₹{enrollment.price}</TableCell>
                                                    <TableCell>{new Date(enrollment.purchaseDate).toLocaleDateString()}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        ) : (
                            <div className="text-center p-4 text-sm text-muted-foreground">No enrollments found.</div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        )}

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


