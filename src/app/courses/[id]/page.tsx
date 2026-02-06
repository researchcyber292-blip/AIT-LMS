
'use client';

import { notFound, useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, BarChart, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { createRazorpayOrder } from '@/ai/flows/create-razorpay-order';
import { verifyRazorpayPayment } from '@/ai/flows/verify-razorpay-payment';
import { collection, addDoc, doc } from 'firebase/firestore';
import type { Enrollment, Instructor, Course } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Loading from '@/app/loading';


declare global {
  interface Window {
    Razorpay: any;
  }
}

function LiveInstructorProfile({ instructorId }: { instructorId: string }) {
    const firestore = useFirestore();
    
    const instructorDocRef = useMemoFirebase(() => {
        if (!firestore || !instructorId) return null;
        return doc(firestore, 'instructors', instructorId);
    }, [firestore, instructorId]);

    const { data: instructor, isLoading, error } = useDoc<Instructor>(instructorDocRef);

    if (isLoading) {
        return (
            <div className="mt-8 rounded-xl border bg-card p-6 shadow">
                <Skeleton className="h-6 w-2/4 mb-4" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-40" />
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                </div>
            </div>
        );
    }
    
    if (error || !instructor) {
        return (
             <div className="mt-8 rounded-xl border border-destructive/20 bg-destructive/10 p-6 shadow text-center">
                 <p className="text-sm text-destructive-foreground">Could not load instructor details.</p>
             </div>
        );
    }
    
    const getInitials = (firstName: string, lastName: string) => `${firstName.charAt(0)}${lastName.charAt(0)}`;
    
    return (
        <div className="mt-8 rounded-xl border bg-card p-6 shadow">
            <h3 className="font-headline text-lg font-semibold">Instructor</h3>
            <div className="mt-4 flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={instructor.photoURL} alt={`${instructor.firstName} ${instructor.lastName}`} />
                    <AvatarFallback>{getInitials(instructor.firstName, instructor.lastName)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-xl">{instructor.firstName} {instructor.lastName}</p>
                    <p className="text-sm text-primary">{instructor.title}</p>
                </div>
            </div>
            {instructor.bio && <p className="mt-4 text-sm text-muted-foreground">{instructor.bio}</p>}
            {instructor.qualifications && (
                <div className="mt-4">
                    <h4 className="font-semibold text-sm">Qualifications</h4>
                    <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">{instructor.qualifications}</p>
                </div>
            )}
      </div>
    );
}

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch course data from Firestore
  const courseDocRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, 'courses', params.id);
  }, [firestore, params.id]);

  const { data: course, isLoading: isCourseLoading } = useDoc<Course>(courseDocRef);

  // Check enrollment status
  const enrollmentsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'enrollments');
  }, [firestore, user]);
  const { data: enrollments, isLoading: enrollmentsLoading } = useCollection<Enrollment>(enrollmentsQuery);
  
  const isEnrolled = enrollments?.some(e => e.courseId === course?.id) || false;
  
  const isLoading = isCourseLoading || enrollmentsLoading;

  const handlePayment = async () => {
    if (!course) return;
    setIsProcessing(true);
    if (!user || !firestore) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to purchase a course.',
        variant: 'destructive',
      });
      setIsProcessing(false);
      router.push('/login');
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
        receipt: `receipt_${course.id}_${user.uid}_${Date.now()}`
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Aviraj Info Tech",
        description: `Purchase: ${course.title}`,
        image: "/image.png",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verification = await verifyRazorpayPayment({
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verification.isVerified) {
              toast({
                title: 'Payment Verified!',
                description: 'Your enrollment is being processed.',
              });

              const enrollmentData: Omit<Enrollment, 'id'> = {
                studentId: user.uid,
                courseId: course.id,
                enrollmentDate: new Date().toISOString(),
                purchaseDate: new Date().toISOString(),
                price: course.price,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              };

              const enrollmentsCol = collection(firestore, 'users', user.uid, 'enrollments');
              await addDoc(enrollmentsCol, enrollmentData);
              toast({
                  title: "Enrollment Successful!",
                  description: "You now have access to this course."
              });

            } else {
              toast({
                variant: "destructive",
                title: "Payment Verification Failed",
                description: "Signature mismatch. If you have been charged, please contact support.",
              });
            }
          } catch (error: any) {
            console.error("Payment verification error:", error);
            toast({
              variant: "destructive",
              title: "Verification Error",
              description: error.message || "An error occurred during payment verification. Please contact support.",
            });
          } finally {
            setIsProcessing(false);
          }
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
        },
        modal: {
            ondismiss: function() {
                setIsProcessing(false);
            }
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
          setIsProcessing(false);
      });

      rzp.open();

    } catch (error: any) {
        console.error("Failed to create Razorpay order:", error);
        toast({
          variant: 'destructive',
          title: 'Payment Error',
          description: error.message || 'Could not initiate the payment process. Please try again.',
        });
        setIsProcessing(false);
    }
  };

  const renderActionButtons = () => {
    if (isLoading) {
      return <Button size="lg" className="w-full" disabled>Loading...</Button>;
    }
    
    if (isEnrolled) {
        return (
            <Button size="lg" className="w-full" disabled>
                You are Enrolled
            </Button>
        );
    }
    
    return (
       <Button onClick={handlePayment} size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Buy Now with UPI/Google Pay'}
       </Button>
    );
  };
  
  if (isLoading) {
      return <Loading />;
  }

  if (!course) {
    // This can happen briefly on load or if the ID is invalid.
    // notFound() will throw an error and engage Next.js's 404 logic.
    notFound();
  }

  return (
    <div className="container py-12 md:py-16">
       {typeof document !== 'undefined' && (
        <title>{`${course.title} - CyberLearn`}</title>
      )}
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
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

              <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                      <span className="bg-card px-2 text-muted-foreground">OR</span>
                  </div>
              </div>

              <div className="space-y-2">
                  <Label htmlFor="redeem-code">Have a Code?</Label>
                  <div className="flex gap-2">
                      <Input id="redeem-code" placeholder="Enter Redeem Code" disabled />
                      <Button variant="secondary" disabled>Apply</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Redeem code functionality is coming soon.</p>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                    <BarChart className="h-5 w-5 text-primary" />
                    <span>Level: {course.level}</span>
                </li>
                <li className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>~20 Hours to complete</span>
                </li>
              </ul>
            </div>
          </div>
          
          {course.instructorId && <LiveInstructorProfile instructorId={course.instructorId} />}
        </div>
        
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
