'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { Instructor, Wallet } from '@/lib/types';
import Link from 'next/link';

const instructorSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  motherName: z.string().min(1, "Mother's name is required."),
  fatherName: z.string().min(1, "Father's name is required."),
  age: z.coerce.number().min(18, 'You must be at least 18 years old.'),
  email: z.string().email('Invalid Gmail address.').refine(val => val.endsWith('@gmail.com'), 'Only @gmail.com addresses are allowed.'),
  alternateEmail: z.string().email('Invalid alternate email.').optional().or(z.literal('')),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits.'),
  alternateMobileNumber: z.string().regex(/^\d{10}$/, 'Alternate mobile must be 10 digits.').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type InstructorFormValues = z.infer<typeof instructorSchema>;

export default function InstructorSignUpPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      motherName: '',
      fatherName: '',
      age: '' as any, // Changed from undefined to fix controlled input error
      email: '',
      alternateEmail: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      password: '',
    },
  });

  async function onSubmit(data: InstructorFormValues) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const instructorProfile: Instructor = {
        id: user.uid,
        firstName: data.firstName,
        lastName: data.lastName,
        motherName: data.motherName,
        fatherName: data.fatherName,
        age: data.age,
        email: data.email,
        alternateEmail: data.alternateEmail,
        mobileNumber: data.mobileNumber,
        alternateMobileNumber: data.alternateMobileNumber,
        isVerified: false,
        accountStatus: 'pending',
      };

      const walletData: Wallet = {
        id: user.uid,
        currentBalance: 0,
        totalEarned: 0,
        pendingWithdrawal: 0,
      };

      await setDoc(doc(firestore, 'instructors', user.uid), instructorProfile);
      await setDoc(doc(firestore, 'wallets', user.uid), walletData);

      toast({
        title: 'Application Submitted!',
        description: 'Please check your email to verify your account. Your application is now pending review.',
      });

      router.push('/instructor-pending-verification');
    } catch (error: any) {
      let errorMessage = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or log in.';
      }
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: errorMessage,
      });
    }
  }

  return (
    <div className="relative min-h-screen w-full bg-background">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold font-headline">Instructor Registration</h1>
            <p className="mt-2 text-muted-foreground">Join our team of experts and start sharing your knowledge.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <FormField control={form.control} name="firstName" render={({ field }) => (
                <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="lastName" render={({ field }) => (
                <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="motherName" render={({ field }) => (
                <FormItem><FormLabel>Mother's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="fatherName" render={({ field }) => (
                <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="age" render={({ field }) => (
                <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="mobileNumber" render={({ field }) => (
                <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
               <FormField control={form.control} name="alternateMobileNumber" render={({ field }) => (
                <FormItem><FormLabel>Alternate Mobile (Optional)</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Gmail</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="alternateEmail" render={({ field }) => (
                <FormItem><FormLabel>Alternate Gmail (Optional)</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              
              <div className="md:col-span-2">
                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Submitting...' : 'Create Account & Submit for Review'}
                </Button>
              </div>
            </form>
          </Form>
           <p className="mt-8 text-center text-sm text-gray-400">
              Already have an instructor account?{" "}
              <Link href="/login" className="font-semibold text-white hover:underline">
                Sign in
              </Link>
            </p>
        </div>
      </div>
    </div>
  );
}
