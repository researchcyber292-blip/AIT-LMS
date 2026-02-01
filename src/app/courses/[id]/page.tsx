
'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { COURSES } from '@/data/content';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, User, BarChart, Clock, Radio } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { createRazorpayOrder } from '@/ai/flows/create-razorpay-order';
import { doc, setDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import type { Enrollment, LiveSession } from '@/lib/types';


// This is a client component, so we can't use generateMetadata directly.
// However, we can fetch the data and set the title dynamically in the component.
// For SEO, it would be better to fetch this data in a parent Server Component if possible.

// export async function generateStaticParams() {
//   return COURSES.map(course => ({
//     id: course.id,
//   }));
// }

const generateRoomName = (courseId: string) => `AVIRAJ-${courseId.toUpperCase()}-${Math.random().toString(36).substring(2, 9)}`;


declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const course = COURSES.find(c => c.id === params.id);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check enrollment status
  const enrollmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'enrollments');
  }, [firestore, user]);
  const { data: enrollments, isLoading: enrollmentsLoading } = useCollection<Enrollment>(enrollmentsQuery);
  const isEnrolled = enrollments?.some(e => e.courseId === course?.id) || false;

  // Check live session status
  const sessionDocRef = useMemoFirebase(() => (course && firestore) ? doc(firestore, 'live_sessions', course.id) : null, [firestore, course]);
  const { data: liveSession, isLoading: sessionLoading } = useDoc<LiveSession>(sessionDocRef);
  
  if (!course) {
    notFound();
  }
  
  const isInstructor = user?.uid === course.instructor.id;
  const isLoading = enrollmentsLoading || sessionLoading;

  // Handler for starting a class
  const handleStartClass = async () => {
    if (!firestore || !user || !course || !sessionDocRef) return;
    setIsProcessing(true);
    
    const roomName = liveSession?.roomName || generateRoomName(course.id);
    const sessionData: LiveSession = {
      isLive: true,
      roomName,
      instructorId: user.uid,
      courseId: course.id,
    };
    
    try {
      await setDoc(sessionDocRef, sessionData);
      toast({ title: 'Stream Started!', description: 'Redirecting to the classroom...' });
      router.push(`/live-classroom?room=${roomName}&courseTitle=${course.title}&instructor=true`);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not start the stream.' });
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for ending a class
  const handleEndClass = async () => {
    if (!firestore || !sessionDocRef) return;
    setIsProcessing(true);
    try {
      await updateDoc(sessionDocRef, { isLive: false });
      toast({ title: 'Stream Ended', description: 'The live session has been closed.' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not end the stream.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJoinClass = () => {
    if (liveSession?.roomName) {
      router.push(`/live-classroom?room=${liveSession.roomName}&courseTitle=${course.title}&instructor=${isInstructor}`);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: 'Cannot find the classroom. It may have ended.' });
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    if (!user || !firestore) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to purchase a course.',
        variant: 'destructive',
      });
      setIsProcessing(false);
      return;
    }

    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.error("Razorpay Key ID is not defined.");
      toast({
        title: 'Configuration Error',
        description: 'Payment system is not configured. Please contact support.',
        variant: 'destructive',
      });
      setIsProcessing(false);
      return;
    }
    
    try {
      const order = await createRazorpayOrder({
        amount: course.price * 100, // Amount in paise
        currency: "INR",
        // A unique receipt ID for this transaction
        receipt: `receipt_${course.id}_${user.uid}_${Date.now()}`
      });

      // Step 2: Use the server-generated order_id to open the checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount, // Use amount from server response
        currency: order.currency,
        name: "Aviraj Info Tech",
        description: `Purchase: ${course.title}`,
        image: "/image.png",
        order_id: order.id, // Use the secure order_id from the server
        handler: async function (response: any) {
          toast({
            title: 'Payment Successful!',
            description: 'Your enrollment is being processed.',
          });
          
           // Securely create enrollment record after successful payment
          const enrollmentData: Omit<Enrollment, 'id'> = {
            studentId: user.uid,
            courseId: course.id,
            enrollmentDate: new Date().toISOString(),
            purchaseDate: new Date().toISOString(),
            price: course.price,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
          };
          
          // This should ideally be a backend function for security, but for now we do it client-side.
          const enrollmentsCol = collection(firestore, 'users', user.uid, 'enrollments');
          await addDoc(enrollmentsCol, enrollmentData);
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
      
      rzp.on('payment.failed', function (response: any) {
          console.error("Payment Failed:", response);
          toast({
              variant: "destructive",
              title: "Payment Failed",
              description: response.error.description || "An unknown error occurred.",
          });
      });

      rzp.open();

    } catch (error: any) {
        console.error("Failed to create Razorpay order:", error);
        toast({
          variant: 'destructive',
          title: 'Payment Error',
          description: error.message || 'Could not initiate the payment process. Please try again.',
        });
    } finally {
        setIsProcessing(false);
    }
  };

  const renderActionButtons = () => {
    if (isLoading) {
      return <Button size="lg" className="w-full" disabled>Loading...</Button>;
    }

    // Instructor has top priority
    if (isInstructor) {
      if (liveSession?.isLive) {
        return (
          <div className="flex flex-col gap-2">
            <Button onClick={handleJoinClass} size="lg" className="w-full">
              <Radio className="mr-2 h-5 w-5 animate-pulse text-red-500" />
              Join Live Stream
            </Button>
             <Button onClick={handleEndClass} size="sm" variant="destructive" className="w-full" disabled={isProcessing}>
              {isProcessing ? 'Ending...' : 'End Stream for All'}
            </Button>
          </div>
        );
      }
      return (
        <Button onClick={handleStartClass} size="lg" className="w-full" disabled={isProcessing}>
          {isProcessing ? 'Starting...' : 'Start Live Stream'}
        </Button>
      );
    }
    
    // Handle Student and Guest views
    if (liveSession?.isLive) {
      if (!user) {
        return (
            <Button asChild size="lg" className="w-full">
                <Link href="/login">Login to Join Stream</Link>
            </Button>
        );
      }
      if (isEnrolled) {
        return (
            <Button onClick={handleJoinClass} size="lg" className="w-full">
                <Radio className="mr-2 h-5 w-5 animate-pulse text-red-500" />
                Join Live Stream
            </Button>
        );
      }
      // User is logged in, but not enrolled
      return (
           <Button onClick={handlePayment} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Buy Now to Join Stream'}
           </Button>
      );
    }
    
    // Class is NOT live
    if (isEnrolled) {
        return (
            <Button size="lg" className="w-full" disabled>
                Stream has not started yet
            </Button>
        );
    }
    
    // Default for anyone not enrolled when class is not live
    return (
       <Button onClick={handlePayment} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Buy Now with UPI/Google Pay'}
       </Button>
    );
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
              {renderActionButtons()}
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
                <AvatarImage src={course.instructor.image} alt={`${course.instructor.firstName} ${course.instructor.lastName}`} data-ai-hint={course.instructor.imageHint} />
                <AvatarFallback>{`${course.instructor.firstName.charAt(0)}${course.instructor.lastName.charAt(0)}`}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{course.instructor.firstName} {course.instructor.lastName}</p>
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
