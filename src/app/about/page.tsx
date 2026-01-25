'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

const formSchema = z.object({
  role: z.enum(['instructor', 'owner'], {
    required_error: "You need to select a role.",
  }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function AdminLoginPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            role: "instructor",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Handle login logic here
        console.log(values);
    }

  return (
    <div className="min-h-screen w-full bg-background text-foreground grid grid-cols-1 md:grid-cols-2">
      {/* Left Branding Panel */}
      <div className="hidden md:flex flex-col items-center justify-center bg-muted/40 p-10 text-center border-r">
          <ShieldCheck className="w-16 h-16 text-primary mb-6" />
          <h1 className="font-headline text-4xl font-bold text-foreground">Aviraj Info Tech</h1>
          <p className="mt-2 text-lg text-muted-foreground">Admin Portal</p>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground/80">
              This area is restricted. Please login with your authorized credentials.
          </p>
      </div>

      {/* Right Form Panel */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
            <div className="mb-8 text-center md:text-left">
              <h2 className="font-headline text-3xl font-bold tracking-tight">Admin Sign In</h2>
              <p className="text-muted-foreground mt-2">Enter your details to access the dashboard.</p>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>I am an...</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex gap-6"
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="instructor" id="role-instructor" />
                                </FormControl>
                                <FormLabel htmlFor="role-instructor" className="font-normal cursor-pointer">
                                  Instructor
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="owner" id="role-owner" />
                                </FormControl>
                                <FormLabel htmlFor="role-owner" className="font-normal cursor-pointer">
                                  Owner
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="admin@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between">
                                  <FormLabel>Password</FormLabel>
                                   <Link href="#" className="text-sm font-medium text-primary hover:underline">
                                      Forgot password?
                                  </Link>
                                </div>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full !mt-8" size="lg">
                        Sign In
                    </Button>
                </form>
            </Form>
        </div>
      </div>
    </div>
  );
}
