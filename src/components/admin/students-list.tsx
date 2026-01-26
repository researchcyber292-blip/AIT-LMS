
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MOCK_STUDENTS } from '@/data/mock-students';
import type { UserProfile } from '@/lib/types';


export function StudentsList() {
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }

  return (
    <div>
        <h2 className="text-2xl font-bold font-headline mb-4">Secure View: Students & Enrollment</h2>
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
                <TableBody>
                {MOCK_STUDENTS.map((student) => (
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
                            <span className={`px-2 py-1 text-xs rounded-full ${student.onboardingStatus === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {student.onboardingStatus}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => setSelectedStudent(student)}>
                                View Details
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
        
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
                            <span className="font-mono">{selectedStudent.id}</span>
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
                            <span>{selectedStudent.email}</span>
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
    </div>
  );
}
