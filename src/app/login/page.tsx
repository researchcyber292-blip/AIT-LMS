'use client';

import Image from "next/image"
import Link from "next/link"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import imageData from '@/lib/placeholder-images.json';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
    const { placeholderImages } = imageData;
    const bgImage = placeholderImages.find(img => img.id === 'auth-background');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Handle sign in logic here
        console.log(values);
    }

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
       <div className="relative hidden bg-muted lg:block">
        {bgImage && (
            <Image
                src={bgImage.imageUrl}
                alt="Futuristic industrial background"
                fill
                className="object-cover"
                data-ai-hint={bgImage.imageHint}
            />
        )}
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign in</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                type="email"
                                placeholder="m@example.com"
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
                        <FormItem className="grid gap-2">
                             <div className="flex items-center">
                                <FormLabel>Password</FormLabel>
                                <Link
                                    href="#"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/about" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
