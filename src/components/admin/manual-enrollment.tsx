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

  const plans = [
    { name: 'Beginner', price: '599/M', category: 'Beginner' as const },
    { name: 'Pro', price: '2999/3M', category: 'Intermediate' as const },
    { name: 'Advanced', price: '4999/6M', category: 'Advanced' as const }
  ];

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

  const handleEnrollInPlan = async (student: UserProfile, category: 'Beginner' | 'Intermediate' | 'Advanced') => {
    if (!firestore) return;

    const coursesToEnroll = COURSES.filter(c => c.category === category);
    if (coursesToEnroll.length === 0) {
      toast({ variant: 'destructive', title: 'No Courses', description: `No courses found for the ${category} plan.` });
      return;
    }

    try {
      const newEnrollments: Enrollment[] = [];
      for (const course of coursesToEnroll) {
        if (studentEnrollments.some(e => e.courseId === course.id)) continue;

        const enrollmentsCol = collection(firestore, 'users', student.id, 'enrollments');
        const enrollmentData: Omit<Enrollment, 'id'> = {
          studentId: student.id,
          courseId: course.id,
          enrollmentDate: new Date().toISOString(),
          purchaseDate: new Date().toISOString(),
          price: 0, // Admin grant
          razorpayPaymentId: 'admin_grant_plan',
          razorpayOrderId: `admin_plan_${Date.now()}`,
        };
        const newDocRef = await addDoc(enrollmentsCol, enrollmentData);
        newEnrollments.push({ id: newDocRef.id, ...enrollmentData });
      }
      setStudentEnrollments(prev => [...prev, ...newEnrollments]);
      toast({ title: "Enrollment Successful", description: `${student.name} has been enrolled in the ${category} plan.` });
    } catch(e) {
      const permissionError = new FirestorePermissionError({ path: `users/${student.id}/enrollments`, operation: 'create' });
      errorEmitter.emit('permission-error', permissionError);
      toast({ variant: 'destructive', title: 'Enrollment Failed', description: 'Could not enroll student. Check permissions.' });
    }
  };
  
  const handleUnenrollFromPlan = async (student: UserProfile, category: 'Beginner' | 'Intermediate' | 'Advanced') => {
    if (!firestore) return;
    
    const enrollmentsToCancel = studentEnrollments.filter(e => {
        const course = COURSES.find(c => c.id === e.courseId);
        return course?.category === category;
    });

    if (enrollmentsToCancel.length === 0) {
        toast({ variant: "destructive", title: "Not Enrolled", description: `${student.name} is not enrolled in any ${category} courses.` });
        return;
    }

    try {
        for (const enrollment of enrollmentsToCancel) {
            const enrollmentDocRef = doc(firestore, 'users', student.id, 'enrollments', enrollment.id);
            await deleteDoc(enrollmentDocRef);
        }
        
        setStudentEnrollments(prev => prev.filter(e => !enrollmentsToCancel.some(cancelled => cancelled.id === e.id)));
        toast({ title: "Unenrolled from Plan", description: `${student.name} has been unenrolled from the ${category} plan.` });
    } catch (e) {
        const permissionError = new FirestorePermissionError({ path: `users/${student.id}/enrollments`, operation: 'delete' });
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
      <p className="text-muted-foreground mb-6">Manually enroll or unenroll students from any course plan.</p>
      
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
                      Manage Plans
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
              <DialogTitle>Manage Plans for {selectedStudent.name}</DialogTitle>
              <DialogDescription>
                Select plans to enroll or unenroll this student.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96 pr-6">
               {isLoadingEnrollments ? <div className="text-center p-8">Loading plans...</div> : (
                  <div className="py-4 space-y-2">
                    {plans.map(plan => {
                      const planCourses = COURSES.filter(c => c.category === plan.category);
                      const enrolledInPlanCourses = studentEnrollments.filter(e => planCourses.some(pc => pc.id === e.courseId));
                      const isEnrolled = planCourses.length > 0 && enrolledInPlanCourses.length >= planCourses.length;
                      
                      return (
                        <div key={plan.name} className="flex items-center justify-between rounded-md border p-4">
                          <div>
                            <p className="font-semibold">{plan.name}</p>
                            <p className="text-sm text-muted-foreground">{plan.price}</p>
                          </div>
                          {isEnrolled ? (
                            <Button variant="destructive" size="sm" onClick={() => handleUnenrollFromPlan(selectedStudent, plan.category)}>
                              Unenroll
                            </Button>
                          ) : (
                            <Button variant="default" size="sm" onClick={() => handleEnrollInPlan(selectedStudent, plan.category)}>
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
