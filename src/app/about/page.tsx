'use client';

import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define the validation schema for the sign-up form
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms of service." }),
  }),
});

export default function SignUpPage() {
    // Initialize the form with react-hook-form and Zod for validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            terms: false,
        },
    });

    // Handle form submission
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Your sign-up logic will go here
        console.log("Sign up values:", values);
    }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      {/* Left side: Sign-up Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Create an Account</h1>
                <p className="text-balance text-muted-foreground mt-2">
                Enter your details to get started.
                </p>
            </div>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        autoComplete="email"
                                        placeholder="name@example.com"
                                        {...field}
                                    />
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
                                    <Input type="password" autoComplete="new-password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name="terms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the <Link href="#" className="underline">terms & conditions</Link>
                            </FormLabel>
                             <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                </form>
            </Form>

            <div className="mt-6 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  Sign in
                </Link>
            </div>
        </div>
      </div>

      {/* Right side: Placeholder for Image/Video */}
      <div className="hidden bg-muted lg:block">
        {/*
          MANUAL EDIT:
          You can add an Image or a Video component here.
          For example, using Next.js Image component:
          
          import Image from 'next/image';
          
          <Image
            src="/your-image-path.jpg"
            alt="Descriptive alt text"
            fill
            className="object-cover"
          />

          Or for a video:

          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/your-video.mp4" type="video/mp4" />
          </video>
        */}
      </div>
    </div>
  );
}
