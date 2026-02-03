
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Please enter a valid email.'),
  companySize: z.string().optional(),
  scheduleDemo: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      companySize: undefined,
      scheduleDemo: false,
    },
  });

  function onSubmit(values: FormValues) {
    console.log(values);
    toast({
      title: 'Form Submitted!',
      description: 'Thank you for reaching out. We will get back to you shortly.',
    });
    form.reset();
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-3.5rem)] overflow-hidden bg-[#0A0F1E] pt-14 text-white">
      {/* Background Sphere */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-gradient-to-br from-blue-900/80 via-blue-800/40 to-transparent rounded-full blur-3xl opacity-50"></div>
      
      <div className="container relative z-10 flex flex-col items-center justify-center px-4 py-12 md:py-16 text-center">
        <div className="max-w-2xl">
          <span className="mb-4 inline-block rounded-full border border-blue-400/50 bg-blue-500/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-blue-300">
            Contacts
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl font-headline">
            Get in Touch with Us
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Please fill out the form below to share your feedback or request
            information about our services.
          </p>
        </div>

        <div className="mt-12 w-full max-w-2xl text-left">
          <div className="rounded-2xl border border-white/10 bg-gray-900/50 p-6 shadow-2xl shadow-blue-500/10 backdrop-blur-lg sm:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} className="bg-white/5 border-white/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} className="bg-white/5 border-white/20" />
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
                        <FormLabel>Work email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter work email" {...field} className="bg-white/5 border-white/20" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/5 border-white/20">
                              <SelectValue placeholder="Select Company size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-1000">201-1000 employees</SelectItem>
                            <SelectItem value="1000+">1000+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="my-6 border-t border-white/10"></div>

                <FormField
                  control={form.control}
                  name="scheduleDemo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg p-3 shadow-sm bg-black/20">
                      <div className="space-y-0.5">
                        <FormLabel>Schedule a Demo Call</FormLabel>
                        <p className="text-sm text-gray-400">
                          Our manager will contact you shortly to help with all your questions.
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="pt-4">
                    <Button type="submit" size="lg" className="w-full bg-[#0091FF] hover:bg-[#007de8] text-white font-bold text-base h-12">
                        Submit
                    </Button>
                </div>
                 <p className="mt-4 text-center text-xs text-gray-500">
                    By contacting with us you agree to our{' '}
                    <Link href="#" className="underline hover:text-white">
                        Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="underline hover:text-white">
                        Privacy Policy
                    </Link>
                    .
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
