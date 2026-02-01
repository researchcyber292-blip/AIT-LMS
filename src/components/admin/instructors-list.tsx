
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
import { Button } from '@/components/ui/button';
import { useCollection, useFirestore, useMemoFirebase, errorEmitter, FirestorePermissionError, useUser } from '@/firebase';
import { collection, doc, updateDoc } from 'firebase/firestore';
import type { Instructor } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

export function InstructorsList() {
  const firestore = useFirestore();
  const { user, isUserLoading: isAuthLoading } = useUser();
  const { toast } = useToast();

  const instructorsQuery = useMemoFirebase(() => {
    if (!user || !user.isAnonymous) return null;
    return collection(firestore, 'instructors');
  }, [firestore, user]);

  const { data: instructors, isLoading: isCollectionLoading, error } = useCollection<Instructor>(instructorsQuery);
  const isLoading = isAuthLoading || isCollectionLoading;

  const handleUpdateStatus = async (instructorId: string, newStatus: 'active' | 'rejected') => {
    if (!firestore) return;

    const instructorDocRef = doc(firestore, 'instructors', instructorId);
    
    try {
      await updateDoc(instructorDocRef, { 
        accountStatus: newStatus,
        isVerified: newStatus === 'active' // Also verify if activating
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
                <Skeleton className="h-8 w-36" />
            </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
  
  const statusVariant = (status: 'pending' | 'active' | 'rejected') => {
      switch(status) {
          case 'active': return 'default';
          case 'pending': return 'secondary';
          case 'rejected': return 'destructive';
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
                                {instructor.accountStatus === 'pending' && (
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(instructor.id, 'active')}>
                                            <Check className="mr-2 h-4 w-4" /> Approve
                                        </Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(instructor.id, 'rejected')}>
                                            <X className="mr-2 h-4 w-4" /> Reject
                                        </Button>
                                    </div>
                                )}
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
    </div>
  );
}
