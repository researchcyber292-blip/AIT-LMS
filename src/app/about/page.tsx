'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function AdminLoginPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Handle login logic here
        console.log(values);
    }

  return (
    <div className="bg-background text-foreground">
      <div className="container flex min-h-screen items-center justify-center py-12">
        <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          
          {/* Left Side: Form */}
          <div className="flex flex-col justify-center">
              <Link href="/" className="mb-8 self-start">
                  <Image
                      src="/image.png"
                      alt="Aviraj Info Tech Logo"
                      width={28}
                      height={28}
                      className="rounded-full"
                  />
              </Link>
            <h1 className="font-headline text-3xl font-bold text-left">
              Admin Log In
            </h1>

            <div className="mt-8 max-w-sm">
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Username or Email</FormLabel>
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
                                  <FormLabel>Password</FormLabel>
                                  <FormControl>
                                      <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <div className="flex items-center justify-between pt-2">
                           <Link href="#" className="text-sm font-medium text-primary hover:underline">
                              Forgot password?
                          </Link>
                      </div>
                      <Button type="submit" className="w-full !mt-6">
                          Login
                      </Button>
                  </form>
              </Form>
            </div>


            <p className="mt-8 text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/activation" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Right Side: Graphic */}
          <div className="hidden md:flex items-center justify-center relative h-full">
             {/* Background image removed as requested */}
          </div>
        </div>
      </div>
    </div>
  );
}
