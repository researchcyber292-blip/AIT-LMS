'use client';

import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { COURSES } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, User, BarChart, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';


// This is a client component, so we can't use generateMetadata directly.
// However, we can fetch the data and set the title dynamically in the component.
// For SEO, it would be better to fetch this data in a parent Server Component if possible.

// export async function generateStaticParams() {
//   return COURSES.map(course => ({
//     id: course.id,
//   }));
// }


declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const course = COURSES.find(c => c.id === params.id);
  const { user } = useUser();
  const { toast } = useToast();

  if (!course) {
    notFound();
  }

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to purchase a course.',
        variant: 'destructive',
      });
      // Here you might want to redirect to a login page
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.error("Razorpay Key ID is not defined.");
      toast({
        title: 'Configuration Error',
        description: 'Payment system is not configured. Please contact support.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real application, you would first create an order on your server
    // and get the order_id. The server would call Razorpay's Orders API.
    // For this example, we'll proceed directly to checkout, which is not recommended for production.
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: course.price * 100, // Amount in paise
      currency: "INR",
      name: "Aviraj Info Tech",
      description: `Purchase: ${course.title}`,
      image: "/image.png", // Your logo
      // order_id: order.id, // From your server
      handler: function (response: any) {
        // This is where the server-to-server verification happens.
        // The client should NOT assume the payment is valid.
        // We just inform the user and wait for the backend to update Firestore.
        console.log('Razorpay Response:', response);
        toast({
          title: 'Payment Successful!',
          description: 'Your enrollment is being processed. You will have access shortly.',
        });
      },
      prefill: {
        name: user.displayName || "Valued Student",
        email: user.email || "",
        contact: user.phoneNumber || "",
      },
      notes: {
        courseId: course.id,
        userId: user.uid,
      },
      theme: {
        color: "#3498db"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  return (
    <div className="container py-12 md:py-16">
       {typeof document !== 'undefined' && (
        <title>{`${course.title} - CyberLearn`}</title>
      )}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Left column (sticky on desktop) */}
        <div className="md:col-span-1 md:sticky md:top-24 h-fit">
          <div className="rounded-xl border bg-card shadow-lg overflow-hidden">
            <Image
              src={course.image}
              alt={course.title}
              width={600}
              height={400}
              className="w-full object-cover"
              data-ai-hint={course.imageHint}
            />
            <div className="p-6">
              <p className="mb-4 text-4xl font-bold font-headline text-primary">₹{course.price}</p>
              <Button onClick={handlePayment} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Buy Now with UPI/Google Pay
              </Button>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                    <BarChart className="h-5 w-5 text-primary" />
                    <span>Level: {course.category}</span>
                </li>
                <li className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>~20 Hours to complete</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 rounded-xl border bg-card p-6 shadow">
            <h3 className="font-headline text-lg font-semibold">Instructor</h3>
            <div className="mt-4 flex items-center gap-4">
              <Avatar>
                <AvatarImage src={course.instructor.image} alt={course.instructor.name} data-ai-hint={course.instructor.imageHint} />
                <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{course.instructor.name}</p>
                <p className="text-sm text-muted-foreground">{course.instructor.title}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{course.instructor.bio}</p>
          </div>
        </div>
        
        {/* Right column */}
        <div className="md:col-span-2">
            <Badge variant="secondary" className="mb-2">{course.category}</Badge>
            <h1 className="font-headline text-4xl font-bold tracking-tight lg:text-5xl">{course.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{course.longDescription}</p>

            <div className="mt-10">
                <h2 className="font-headline text-2xl font-semibold border-l-4 border-primary pl-4">What You'll Learn</h2>
                <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {course.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-accent" />
                    <span>{obj}</span>
                    </li>
                ))}
                </ul>
            </div>

            <div className="mt-10">
                <h2 className="font-headline text-2xl font-semibold border-l-4 border-primary pl-4">Course Curriculum</h2>
                <Accordion type="single" collapsible className="mt-4 w-full">
                {course.curriculum.map((item, i) => (
                    <AccordionItem value={`item-${i}`} key={i}>
                    <AccordionTrigger className="text-left font-medium hover:no-underline">{item.title}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                        {item.content}
                    </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </div>
        </div>
      </div>
    </div>
  );
}