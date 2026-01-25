'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ArrowRight } from 'lucide-react';

const activationSchema = z.object({
  mobileNumber: z.string().regex(/^\d{10}$/, { message: 'Mobile number must be 10 digits.' }),
  alternateMobileNumber: z.union([z.string().regex(/^\d{10}$/, { message: 'Must be 10 digits if provided.' }), z.string().length(0)]).optional(),
  motherName: z.string().regex(/^[a-zA-Z\s]+$/, { message: 'Please enter a valid name.' }).min(1, { message: "Mother's name is required." }),
  fatherName: z.string().regex(/^[a-zA-Z\s]+$/, { message: 'Please enter a valid name.' }).min(1, { message: "Father's name is required." }),
  alternateEmail: z.string().email({ message: 'Invalid email address.' }).refine(val => val.endsWith('@gmail.com'), { message: 'Only @gmail.com addresses are allowed.' }),
  password: z.string()
    .min(8, { message: 'Password must be 8+ characters.' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain a letter.' })
    .regex(/[0-9]/, { message: 'Password must contain a number.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain a special character.' }),
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

  const { formState: { errors } } = form;

  function onSubmit(data: ActivationFormValues) {
    console.log('Final Activation Data:', data);
    toast({
      title: 'Activation Complete!',
      description: 'Your account details have been saved.',
    });
    router.push('/dashboard');
  }
  
  const inputs = [
      { name: 'mobileNumber', placeholder: 'ENTER YOUR 10-DIGIT MOBILE NUMBER', type: 'text' },
      { name: 'alternateMobileNumber', placeholder: 'ALTERNATE MOBILE (OPTIONAL)', type: 'text' },
      { name: 'motherName', placeholder: "ENTER YOUR MOTHER'S NAME", type: 'text' },
      { name: 'fatherName', placeholder: "ENTER YOUR FATHER'S NAME", type: 'text' },
      { name: 'alternateEmail', placeholder: 'ALTERNATE EMAIL (GMAIL ONLY)', type: 'email' },
      { name: 'password', placeholder: 'CREATE A STRONG PASSWORD', type: 'password' },
  ] as const;

  return (
    <div className="relative mt-14 h-[calc(100vh-3.5rem)] w-full overflow-hidden">
      <video
        autoPlay
        muted
        playsInline
        className="absolute top-0 left-0 h-full w-full object-cover"
      >
        <source src="/4.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 flex items-end justify-start bg-black/30 pb-20">
        <div className="w-full max-w-4xl px-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inputs.map(({ name, placeholder, type }) => (
                    <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                            <FormItem>
                            <FormControl>
                                <div className={`group flex items-center gap-2 rounded-full border-2 ${errors[name] ? 'border-destructive' : 'border-white/20'} bg-black/30 p-1.5 backdrop-blur-sm transition-all focus-within:border-white/50 focus-within:bg-black/50`}>
                                    <Input
                                        {...field}
                                        type={type}
                                        placeholder={placeholder}
                                        onChange={(e) => {
                                            let value = e.target.value;
                                            if (name === 'motherName' || name === 'fatherName') {
                                                value = value.toUpperCase();
                                            }
                                            field.onChange(value);
                                        }}
                                        className="h-11 flex-1 rounded-full border-none bg-transparent px-5 text-sm text-white placeholder:text-white/50 focus:ring-0"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="pl-5 text-sm font-bold text-destructive-foreground" />
                            </FormItem>
                        )}
                    />
                ))}
                
                <div className="md:col-span-2 pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full rounded-full h-12 bg-white/10 text-white transition-all hover:bg-white/20 border-2 border-white/20"
                  >
                    Activate Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
