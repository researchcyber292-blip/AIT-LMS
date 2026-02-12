
'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  motherName: z.string().min(1, "Mother's name is required."),
  fatherName: z.string().min(1, "Father's name is required."),
  email: z.string().email('Invalid email address.'),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.'),
  alternateMobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number.').optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      motherName: '',
      fatherName: '',
      email: '',
      mobileNumber: '',
      alternateMobileNumber: '',
      password: '',
    },
  });

  const { formState: { isSubmitting } } = form;

  const handleRegister = async (data: RegisterFormValues) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      const fullName = `${data.firstName} ${data.lastName}`;
      await updateProfile(user, { displayName: fullName });

      const userProfileData = {
        id: user.uid,
        name: fullName,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        motherName: data.motherName,
        fatherName: data.fatherName,
        mobileNumber: data.mobileNumber,
        alternateMobileNumber: data.alternateMobileNumber,
        onboardingStatus: 'active',
        publicChatStats: {
          messageCount: 0,
          weekStartTimestamp: new Date(0)
        }
      };
      await setDoc(doc(firestore, "users", user.uid), userProfileData);

      toast({
        title: "Account Created Successfully!",
        description: "Welcome! You are now being redirected to your dashboard.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      let description = "An unexpected error occurred during registration.";
      if (error.code === "auth/email-already-in-use") {
        description = "This email is already registered. Please try logging in.";
      }
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description,
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        <div className="hidden md:block relative">
            <Image
                src="/login.png"
                alt="Cyber security concept"
                fill
                className="object-cover"
            />
        </div>
        <div className="w-full bg-[#0D0D0D] text-white flex items-center justify-center p-4 relative">
          <div className="absolute inset-0 z-0" style={{backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
          <div className="w-full max-w-4xl z-10 py-12 px-8 overflow-y-auto h-full">
            <h1 className="text-4xl font-light">Create Your Account</h1>
            <p className="text-gray-400 mt-2 mb-8">Join the community and start learning.</p>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRegister)} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} disabled={isSubmitting} className="bg-[#1F1F1F] border-0" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} disabled={isSubmitting} className="bg-[#1F1F1F] border-0" /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="motherName" render={({ field }) => (
                      <FormItem><FormLabel>Mother's Name</FormLabel><FormControl><Input {...field} disabled={isSubmitting} className="bg-[#1F1F1F] border-0" /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name="fatherName" render={({ field }) => (
                      <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input {...field} disabled={isSubmitting} className="bg-[#1F1F1F] border-0" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="mobileNumber" render={({ field }) => (
                      <FormItem><FormLabel>Mobile Number</FormLabel><FormControl><Input type="tel" {...field} disabled={isSubmitting} className="bg-[#1F1F1F] border-0" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="alternateMobileNumber" render={({ field }) => (
                      <FormItem><FormLabel>Alternate Mobile (Optional)</FormLabel><FormControl><Input type="tel" {...field} disabled={isSubmitting} className="bg-[#1F1F1F] border-0" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} disabled={isSubmitting} className="bg-[#1F1F1F] border-0" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>Create a Password</FormLabel><FormControl><Input type="password" {...field} disabled={isSubmitting} className="bg-[#1F1F1F] border-0" /></FormControl><FormMessage /></FormItem>
                  )} />
                
                  <div className="md:col-span-2">
                    <Button type="submit" className="w-full h-12 mt-4 font-semibold bg-blue-600 hover:bg-blue-700 text-white text-base rounded-lg" disabled={isSubmitting}>
                      {isSubmitting ? "Creating Account..." : "Sign Up"}
                    </Button>
                  </div>
              </form>
            </Form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-500 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
