'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// Schema for validation
const activationSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits."),
  alternateMobileNumber: z.string().optional(),
  motherName: z.string().min(1, { message: "Mother's name is required." }),
  fatherName: z.string().min(1, { message: "Father's name is required." }),
  alternateEmail: z.string().email("Invalid email address.").refine(email => email.endsWith('@gmail.com'), {
    message: "Please enter a valid Gmail address. Temporary emails are not allowed."
  }),
  password: z.string()
    .min(8, "Password must be at least 8 characters long.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character."),
});

type ActivationFormValues = z.infer<typeof activationSchema>;

export default function ActivationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ActivationFormValues>({
    resolver: zodResolver(activationSchema),
    defaultValues: {
      mobileNumber: '',
      alternateMobileNumber: '',
      motherName: '',
      fatherName: '',
      alternateEmail: '',
      password: '',
    },
  });

  function onSubmit(data: ActivationFormValues) {
    console.log(data);
    toast({
      title: "Activation Complete!",
      description: "Your account details have been saved.",
    });
    router.push('/dashboard');
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] w-full overflow-hidden flex items-center justify-center p-4">
      <video
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      >
        <source src="/4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 w-full max-w-4xl">
        <Card className="bg-black/50 border-white/20 text-white backdrop-blur-md">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Final Activation Step</CardTitle>
            <CardDescription className="text-white/70">Please provide the following details to secure your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Alternate Mobile Number */}
                  <FormField
                    control={form.control}
                    name="alternateMobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Mobile Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter alternate mobile number" {...field} className="bg-white/10 border-white/30 focus:border-white text-white placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Mobile Number */}
                  <FormField
                    control={form.control}
                    name="mobileNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your 10-digit mobile number" {...field} className="bg-white/10 border-white/30 focus:border-white text-white placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Father's Name */}
                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Father's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your father's name" {...field} className="bg-white/10 border-white/30 focus:border-white text-white placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   {/* Mother's Name */}
                   <FormField
                    control={form.control}
                    name="motherName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mother's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your mother's name" {...field} className="bg-white/10 border-white/30 focus:border-white text-white placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Create a Strong Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} className="bg-white/10 border-white/30 focus:border-white text-white placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   {/* Alternate Email */}
                   <FormField
                    control={form.control}
                    name="alternateEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Alternate Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="example@gmail.com" {...field} className="bg-white/10 border-white/30 focus:border-white text-white placeholder:text-white/50" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg rounded-full border-2 border-white/30 bg-black/50 backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/20">
                  Complete Activation
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
