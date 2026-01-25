'use client';

import Link from "next/link";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define the validation schema for the login form
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
    // Initialize the form with react-hook-form and Zod for validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Handle form submission
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Your sign-in logic will go here
        console.log("Login values:", values);
    }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      {/* Left side: Login Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Sign in</h1>
                <p className="text-balance text-muted-foreground mt-2">
                Enter your credentials to access your account.
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
                                <div className="flex items-center justify-between">
                                    <FormLabel>Password</FormLabel>
                                    <div className="text-sm">
                                        <Link
                                            href="#"
                                            className="font-medium text-primary hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                                <FormControl>
                                    <Input type="password" autoComplete="current-password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                </form>
            </Form>

            <div className="mt-6 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/about" className="font-semibold text-primary hover:underline">
                  Sign up
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
