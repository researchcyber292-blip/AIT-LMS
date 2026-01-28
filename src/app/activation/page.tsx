
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ArrowRight } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';

const activationSchema = z.object({
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit Indian mobile number.' }),
  alternateMobileNumber: z.union([z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit Indian mobile number.' }), z.string().length(0)]).optional(),
  motherName: z.string().regex(/^[a-zA-Z\s]+$/, { message: 'Please enter a valid name.' }).min(1, { message: "Mother's name is required." }),
  fatherName: z.string().regex(/^[a-zA-Z\s]+$/, { message: 'Please enter a valid name.' }).min(1, { message: "Father's name is required." }),
  email: z.string().email({ message: 'Invalid email address.' }).min(1, 'Email is required.').refine(val => val.endsWith('@gmail.com'), { message: 'Only @gmail.com addresses are allowed.' }),
  password: z.string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' }),
});

type ActivationFormValues = z.infer<typeof activationSchema>;

export default function ActivationPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  
  const form = useForm<ActivationFormValues>({
    resolver: zodResolver(activationSchema),
    defaultValues: {
      mobileNumber: '',
      alternateMobileNumber: '',
      motherName: '',
      fatherName: '',
      email: '',
      password: '',
    },
  });

  const { formState: { errors, isSubmitting }, handleSubmit } = form;

  async function onSubmit(data: ActivationFormValues) {
    try {
      const name = localStorage.getItem('onboardingName');
      const username = localStorage.getItem('onboardingUsername');

      if (!name || !username) {
        toast({
            variant: "destructive",
            title: "Onboarding Error",
            description: "Missing name or username. Please start the sign-up process again.",
        });
        router.push('/student-welcome');
        return;
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      const userProfile: UserProfile = {
        id: user.uid,
        name,
        username,
        email: data.email,
        mobileNumber: data.mobileNumber,
        alternateMobileNumber: data.alternateMobileNumber || '',
        motherName: data.motherName,
        fatherName: data.fatherName,
        alternateEmail: '', // This field is no longer on the form
        onboardingStatus: 'username_complete',
      };

      await setDoc(doc(firestore, 'users', user.uid), userProfile);

      toast({
        title: 'Account Created! Please Verify Your Email.',
        description: 'Check your inbox for a verification link to activate your account.',
      });

      router.push('/verify-email');
    } catch (error: any) {
        let errorMessage = 'An unexpected error occurred. Please try again.';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. If you deleted this user, you must also remove them from the Firebase Authentication console to sign up again.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        toast({
            variant: 'destructive',
            title: 'Activation Failed',
            description: errorMessage,
        });
    }
  }
  
  const inputs = [
      { name: 'mobileNumber', placeholder: 'ENTER YOUR 10-DIGIT MOBILE NUMBER', type: 'text' },
      { name: 'motherName', placeholder: "ENTER YOUR MOTHER'S NAME", type: 'text' },
      { name: 'fatherName', placeholder: "ENTER YOUR FATHER'S NAME", type: 'text' },
      { name: 'email', placeholder: 'ENTER YOUR VALID GMAIL', type: 'email' },
      { name: 'password', placeholder: 'CREATE A PASSWORD', type: 'password' },
      { name: 'alternateMobileNumber', placeholder: 'ALTERNATE MOBILE (OPTIONAL)', type: 'text' },
  ] as const;

  return (
    <div className="relative mt-14 h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <video
        src="/4.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 flex items-end justify-start bg-black/30 pb-20">
        <div className="w-full max-w-4xl px-8">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inputs.map(({ name, placeholder, type }) => (
                    <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <div className={`group flex items-center gap-2 rounded-full border-2 ${errors[name] ? 'border-destructive' : 'border-white/20'} bg-black/30 p-1.5 backdrop-blur-sm transition-all focus-within:border-white/50 focus-within:bg-black/50`}>
                                    <Input
                                        {...field}
                                        type={type}
                                        placeholder={placeholder}
                                        disabled={isSubmitting}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (name === 'motherName' || name === 'fatherName') {
                                                value = value.toUpperCase();
                                            }
                                            field.onChange(value);
                                        }}
                                        className="h-11 flex-1 rounded-full border-none bg-transparent px-5 text-sm text-white placeholder:text-white/50 focus:ring-0"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="pl-5 text-sm font-bold text-destructive-foreground" />
                            </FormItem>
                        )}
                    />
                ))}
                
                <div className="md:col-span-2 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full h-12 bg-white/10 text-white transition-all hover:bg-white/20 border-2 border-white/20"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating Account...' : 'Create & Verify Account'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
