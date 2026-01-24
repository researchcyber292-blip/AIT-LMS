
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Mail, Apple } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin Login - Aviraj Info Tech',
  description: 'Admin login page for Aviraj Info Tech.',
};

const XLogo = () => (
    <svg viewBox="0 0 1200 1227" fill="none" className="h-4 w-4">
        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.406 618.384L144.011 79.6904H308.21L603.699 501.078L651.458 570.522L1040.99 1160.31H876.792L569.165 687.854V687.828Z" fill="currentColor"></path>
    </svg>
);

const GoogleLogo = () => (
    <svg viewBox="0 0 48 48" className="h-5 w-5">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C41.38,36.401,44,31.259,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

export default function AdminLoginPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container flex min-h-[calc(100vh-10rem)] items-center justify-center py-12">
        <div className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          
          {/* Left Side: Form */}
          <div className="flex flex-col justify-center">
              <Link href="/" className="mb-8 self-start">
                  <Image
                      src="/image.png"
                      alt="Aviraj Info Tech Logo"
                      width={28}
                      height={28}
                      className="rounded-full"
                  />
              </Link>
            <h1 className="font-headline text-3xl font-bold text-left">
              Log into your account
            </h1>

            <div className="mt-8 flex flex-col gap-3 max-w-sm">
                <Button variant="default" className="w-full justify-center bg-primary-foreground text-background hover:bg-primary-foreground/90 text-sm font-semibold py-6">
                    <XLogo />
                    Login with X
                </Button>
                <Button variant="outline" className="w-full justify-center bg-transparent text-sm py-6">
                    <Mail />
                    Login with email
                </Button>
                <Button variant="outline" className="w-full justify-center bg-transparent text-sm py-6">
                    <GoogleLogo />
                    Login with Google
                </Button>
                <Button variant="outline" className="w-full justify-center bg-transparent text-sm py-6">
                    <Apple />
                    Login with Apple
                </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/activation" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* Right Side: Graphic */}
          <div className="hidden md:flex items-center justify-center relative h-full">
             <Image
                src="/image.png"
                alt="Aviraj Info Tech Background Logo"
                width={400}
                height={400}
                className="object-contain opacity-5"
                data-ai-hint="logo background"
              />
          </div>
        </div>
      </div>
      <div className="container pb-6 text-center w-full">
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
            By continuing, you agree to Aviraj Info Tech's{' '}
            <Link href="#" className="underline">
                Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline">
                Privacy Policy
            </Link>
            .
            </p>
      </div>
    </div>
  );
}
