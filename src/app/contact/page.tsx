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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
  email: z.string().email('Please enter a valid email.'),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, { message: 'Please enter a valid 10-digit mobile number.' }),
  companySize: z.string().optional(),
  message: z.string()
    .min(1, 'A message is required.')
    .refine((value) => value.trim().split(/\s+/).length >= 25, {
      message: 'Your message must be at least 25 words long.',
    }),
  scheduleDemo: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobileNumber: '',
      companySize: undefined,
      message: '',
      scheduleDemo: false,
    },
  });

  async function onSubmit(values: FormValues) {
    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Database Error',
        description: 'Could not connect to the database. Please try again later.',
      });
      return;
    }
    
    form.control.disabled = true;

    try {
      const submissionsCol = collection(firestore, 'contact_submissions');
      await addDoc(submissionsCol, {
        ...values,
        submittedAt: serverTimestamp(),
      });
      
      toast({
        title: 'Form Submitted!',
        description: 'Thank you for reaching out. We will get back to you shortly.',
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'There was an error submitting your message. Please try again.',
      });
    } finally {
        form.control.disabled = false;
    }
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-background pt-14 text-foreground">
      
      <div className="container relative z-10 px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <span className="mb-4 inline-block rounded-full border border-primary/50 bg-primary/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-primary">
            Contact Us
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl font-headline">
            Let's Start a Conversation
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Have a question or need assistance? Fill out the form, or reach out to us directly through the contact details below. We're here to help.
          </p>
        </div>

        <div className="mt-16 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 items-start">
            
            {/* Left side: Contact Info */}
            <div className="md:sticky md:top-28">
              <div className="space-y-8">
                {/* Card for Email */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                      <Mail className="h-6 w-6 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-xl">Email</h3>
                  </div>
                  <div className="mt-4 pl-16 space-y-2 text-muted-foreground">
                    <p><a href="mailto:contact@avirajinfotech.com" className="hover:text-primary transition-colors">contact@avirajinfotech.com</a></p>
                    <p><a href="mailto:info@avirajinfotech.com" className="hover:text-primary transition-colors">info@avirajinfotech.com</a></p>
                  </div>
                </div>
  
                {/* Card for Phone */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                      <Phone className="h-6 w-6 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-xl">Phone</h3>
                  </div>
                  <div className="mt-4 pl-16 space-y-2 text-muted-foreground">
                    <p><a href="tel:+919389477179" className="hover:text-primary transition-colors">+91 9389477179</a></p>
                    <p><a href="tel:+917531941016" className="hover:text-primary transition-colors">+91 7531941016</a></p>
                  </div>
                </div>
                
                {/* Card for Office Hour */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                      <Clock className="h-6 w-6 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-xl">Office Hour</h3>
                  </div>
                  <div className="mt-4 pl-16 space-y-2 text-muted-foreground">
                    <p>9AM - 6PM (Mon-Sat)</p>
                    <p>Online Support: 24/7</p>
                  </div>
                </div>
  
                {/* Card for Location */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg shrink-0">
                      <MapPin className="h-6 w-6 text-primary"/>
                    </div>
                    <h3 className="font-semibold text-xl">Location</h3>
                  </div>
                  <div className="mt-4 pl-16 space-y-2 text-muted-foreground">
                    <p>Pithoragarh, Uttarakhand, India</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side: Form */}
            <div className="w-full text-left">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
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
                              <Input placeholder="Enter your first name" {...field} disabled={form.formState.isSubmitting} />
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
                              <Input placeholder="Enter your last name" {...field} disabled={form.formState.isSubmitting} />
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
                              <Input placeholder="Enter work email" {...field} disabled={form.formState.isSubmitting}/>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="mobileNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your mobile number" {...field} disabled={form.formState.isSubmitting} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="sm:col-span-2">
                        <FormField
                          control={form.control}
                          name="companySize"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company size</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={form.formState.isSubmitting}>
                                <FormControl>
                                  <SelectTrigger>
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
                    </div>

                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Please describe your needs in at least 25 words."
                                className="min-h-[120px]"
                                {...field}
                                disabled={form.formState.isSubmitting}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="my-6 border-t border-border"></div>

                    <FormField
                      control={form.control}
                      name="scheduleDemo"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-muted/50">
                          <div className="space-y-0.5">
                            <FormLabel>Schedule a Demo Call</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Our manager will contact you shortly to help with all your questions.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={form.formState.isSubmitting}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="pt-4">
                        <Button type="submit" size="lg" className="w-full font-bold text-base h-12" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                     <p className="mt-4 text-center text-xs text-muted-foreground">
                        By contacting us you agree to our{' '}
                        <Link href="#" className="underline hover:text-primary">
                            Terms
                        </Link>{' '}
                        and{' '}
                        <Link href="#" className="underline hover:text-primary">
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
    </div>
  );
}
