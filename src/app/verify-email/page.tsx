
'use client';

import { useAuth, useUser } from '@/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MailCheck, Hourglass, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/app/loading';

export default function VerifyEmailPage() {
    const { user, isUserLoading } = useUser();
    const auth = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        // If user is loaded and email is verified, redirect them away.
        if (!isUserLoading && user?.emailVerified) {
            router.replace('/dashboard'); // OnboardingGuard will handle final destination
        }
    }, [user, isUserLoading, router]);
    
    const handleResendVerification = async () => {
        if (user) {
            try {
                await sendEmailVerification(user);
                toast({
                    title: "Verification Email Sent",
                    description: "A new link has been sent to your email address.",
                });
            } catch (error: any) {
                toast({
                    variant: 'destructive',
                    title: 'Error Sending Email',
                    description: error.message,
                });
            }
        }
    };
    
    if (isUserLoading) {
        return <Loading />;
    }

    return (
        <div className="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center py-12 text-center">
            <div className="w-full max-w-md">
                <MailCheck className="mx-auto h-20 w-20 text-primary" />
                <h1 className="mt-8 font-headline text-3xl font-bold text-foreground md:text-4xl">
                    Verify Your Email
                </h1>
                <p className="mt-4 text-muted-foreground">
                    We've sent a verification link to <span className="font-bold text-foreground">{user?.email || 'your email address'}</span>. Please check your inbox and click the link to activate your account.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <Button onClick={handleResendVerification} disabled={isUserLoading}>
                        <Hourglass className="mr-2 h-4 w-4" />
                        Resend Verification Link
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href="/login">
                            Go to Login
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
                 <p className="mt-8 text-xs text-muted-foreground">
                    Once verified, you can log in to complete your profile setup. If you don't see the email, please check your spam folder.
                </p>
            </div>
        </div>
    );
}
