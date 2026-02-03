'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase, useUser, errorEmitter, FirestorePermissionError } from '@/firebase';
import { collection, doc, addDoc, deleteDoc, getDocs } from 'firebase/firestore';
import type { UserProfile, Enrollment } from '@/lib/types';
import { COURSES } from '@/data/content';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';

export function ManualEnrollment() {
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [studentEnrollments, setStudentEnrollments] = useState<Enrollment[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { toast } = useToast();

  const studentsQuery = useMemoFirebase(() => {
    if (!user || !user.isAnonymous || !firestore) return null;
    return collection(firestore, 'users');
  }, [firestore, user]);

  const { data: students, isLoading: isCollectionLoading } = useCollection<UserProfile>(studentsQuery);
  const isLoading = isAuthLoading || isCollectionLoading;

  const handleManageClick = async (student: UserProfile) => {
    setSelectedStudent(student);
    if (firestore) {
      setIsLoadingEnrollments(true);
      const enrollmentsQuery = collection(firestore, 'users', student.id, 'enrollments');
      try {
        const snapshot = await getDocs(enrollmentsQuery);
        const enrollments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Enrollment));
        setStudentEnrollments(enrollments);
      } catch (e) {
         const permissionError = new FirestorePermissionError({ path: `users/${student.id}/enrollments`, operation: 'list' });
         errorEmitter.emit('permission-error', permissionError);
         toast({ variant: 'destructive', title: 'Permission Denied', description: 'Could not fetch enrollments.' });
      } finally {
        setIsLoadingEnrollments(false);
      }
    }
  };

  const handleEnroll = async (student: UserProfile, courseId: string) => {
    if (!firestore) return;
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return;

    try {
        const enrollmentsCol = collection(firestore, 'users', student.id, 'enrollments');
        const enrollmentData: Omit<Enrollment, 'id'> = {
          studentId: student.id,
          courseId: course.id,
          enrollmentDate: new Date().toISOString(),
          purchaseDate: new Date().toISOString(),
          price: 0, // Admin grant
          razorpayPaymentId: 'admin_grant',
          razorpayOrderId: `admin_${Date.now()}`,
        };
        const newDocRef = await addDoc(enrollmentsCol, enrollmentData);
        setStudentEnrollments([...studentEnrollments, { id: newDocRef.id, ...enrollmentData }]);
        toast({ title: "Enrollment Successful", description: `${student.name} has been enrolled in ${course.title}.` });
    } catch(e) {
        const permissionError = new FirestorePermissionError({ path: `users/${student.id}/enrollments`, operation: 'create', requestResourceData: { courseId } });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Enrollment Failed', description: 'Could not enroll student. Check permissions.' });
    }
  };

  const handleUnenroll = async (student: UserProfile, courseId: string) => {
    if (!firestore) return;
    const course = COURSES.find(c => c.id === courseId);
    const enrollment = studentEnrollments.find(e => e.courseId === courseId);
    if (!enrollment || !course) return;
    
    try {
        const enrollmentDocRef = doc(firestore, 'users', student.id, 'enrollments', enrollment.id);
        await deleteDoc(enrollmentDocRef);
        setStudentEnrollments(studentEnrollments.filter(e => e.id !== enrollment.id));
        toast({ title: "Unenrolled", description: `${student.name} has been unenrolled from ${course.title}.` });
    } catch (e) {
        const permissionError = new FirestorePermissionError({ path: `users/${student.id}/enrollments/${enrollment.id}`, operation: 'delete' });
        errorEmitter.emit('permission-error', permissionError);
        toast({ variant: 'destructive', title: 'Unenroll Failed', description: 'Could not unenroll student. Check permissions.' });
    }
  };
  
  const renderLoading = () => (
    <TableBody>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-8 w-36" /></TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold font-headline mb-4">Manual Course Enrollment</h2>
      <p className="text-muted-foreground mb-6">Manually enroll or unenroll students from any course.</p>
      
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {isLoading ? renderLoading() : (
            <TableBody>
              {(students || []).map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleManageClick(student)}>
                      Manage Courses
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
        {(!isLoading && (!students || students.length === 0)) && (
          <div className="text-center p-8 text-muted-foreground">No students found.</div>
        )}
      </div>

      {selectedStudent && (
        <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <DialogTitle>Manage Enrollments for {selectedStudent.name}</DialogTitle>
              <DialogDescription>
                Select courses to enroll or unenroll this student.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96 pr-6">
               {isLoadingEnrollments ? <div className="text-center p-8">Loading courses...</div> : (
                  <div className="py-4 space-y-2">
                    {COURSES.map(course => {
                      const isEnrolled = studentEnrollments.some(e => e.courseId === course.id);
                      return (
                        <div key={course.id} className="flex items-center justify-between rounded-md border p-4">
                          <div>
                            <p className="font-semibold">{course.title}</p>
                            <p className="text-sm text-muted-foreground">{course.category} - ₹{course.price}</p>
                          </div>
                          {isEnrolled ? (
                            <Button variant="destructive" size="sm" onClick={() => handleUnenroll(selectedStudent, course.id)}>
                              Unenroll
                            </Button>
                          ) : (
                            <Button variant="default" size="sm" onClick={() => handleEnroll(selectedStudent, course.id)}>
                              <Plus className="mr-2 h-4 w-4" /> Enroll
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
               )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
