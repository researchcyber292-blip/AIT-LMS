'use client';

import Image from "next/image"
import Link from "next/link"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import imageData from '@/lib/placeholder-images.json';


const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms of service." }),
  }),
});


export default function SignUpPage() {
    const { placeholderImages } = imageData;
    const bgImage = placeholderImages.find(img => img.id === 'auth-background');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            terms: false,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Handle sign up logic here
        console.log(values);
    }
    
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="relative flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Sign up</h1>
            <p className="text-balance text-muted-foreground">
              Register as a member to experience.
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the <Link href="#" className="underline">terms of service</Link>
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
          <div className="mt-4 text-center text-sm">
            Already a member?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
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
    </div>
  )
}
