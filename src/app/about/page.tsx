'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

// SVG for X Icon
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// SVG for Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A7.94 7.94 0 0 1 24 36c-4.418 0-8-3.582-8-8h-8c0 6.627 5.373 12 12 12z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 36.45 44 30.634 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
);


// SVG for Apple Icon
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.01,2.07c-2.45,0-4.32,1.86-4.32,4.32s0,4.32,0,4.32c0.01,0,1.88-0.02,4.33-0.02s4.32-1.85,4.32-4.32 S14.45,2.07,12.01,2.07z M12.01,4c1.17,0,2.15,0.9,2.15,2.15c0,1.25-0.98,2.15-2.15,2.15c-1.17,0-2.15-0.9-2.15-2.15 C9.86,4.9,10.84,4,12.01,4z" />
        <path d="M19.16,8.38c-0.64-0.63-1.49-0.8-2.4-0.8c-0.66,0-1.3,0.11-1.9,0.33c-0.6,0.22-1.14,0.52-1.63,0.9 c-0.41,0.32-0.85,0.73-1.31,1.23c-0.45,0.5-0.8,0.9-1.04,1.19c-0.34-0.4-0.78-0.89-1.3-1.47c-0.6-0.64-1.28-1.1-2.02-1.38 c-0.81-0.3-1.66-0.33-2.52-0.12c-1.79,0.45-3.08,1.88-3.08,3.83c0,1.09,0.4,2.15,1.17,3.15c0.68,0.88,1.52,1.66,2.5,2.33 c0.98,0.67,1.96,1.2,2.94,1.59c0.9,0.35,1.69,0.53,2.35,0.53s1.45-0.18,2.35-0.53c0.98-0.39,1.96-0.92,2.94-1.59 c0.98-0.67,1.82-1.45,2.5-2.33c0.77-1,1.17-2.06,1.17-3.15C22.24,10.26,20.95,8.83,19.16,8.38z" />
    </svg>
);


export default function SignUpPage() {
  return (
    <div className="min-h-screen w-full bg-black text-gray-200">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <XIcon className="h-7 w-7 text-white" />
          </Link>
          <Button variant="ghost" className="rounded-full border border-gray-800 bg-gray-900/50 px-4 py-1.5 text-sm font-medium text-gray-300 hover:bg-gray-800">
            You are signing into Grok <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* Left Side: Form */}
        <div className="flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h1 className="mb-8 text-4xl font-bold tracking-tight text-white">
              Create your account
            </h1>
            <div className="flex flex-col gap-4">
               <Button size="lg" variant="outline" className="h-14 w-full justify-center border-gray-700 bg-transparent text-lg font-medium text-white hover:bg-gray-900 hover:text-white">
                <GoogleIcon className="mr-2 h-6 w-6" /> Sign up with Google
              </Button>
              <Button size="lg" variant="outline" className="h-14 w-full justify-center border-gray-700 bg-transparent text-lg font-medium text-white hover:bg-gray-900 hover:text-white">
                <AppleIcon className="mr-2 h-6 w-6" /> Sign up with Apple
              </Button>
              <div className="my-2 flex items-center">
                  <div className="flex-grow border-t border-gray-700"></div>
                  <span className="mx-4 flex-shrink text-xs text-gray-500">or</span>
                  <div className="flex-grow border-t border-gray-700"></div>
              </div>
              <Button size="lg" className="h-14 w-full justify-center bg-white text-lg font-bold text-black hover:bg-gray-200">
                Create account
              </Button>
            </div>
             <p className="mt-4 text-center text-xs text-gray-500">
                By signing up, you agree to the <Link href="#" className="underline hover:text-white">Terms of Service</Link> and <Link href="#" className="underline hover:text-white">Privacy Policy</Link>, including <Link href="#" className="underline hover:text-white">Cookie Use</Link>.
            </p>
            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-white hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Graphic */}
        <div className="relative hidden items-center justify-center md:flex">
             <Image
                src="https://picsum.photos/seed/loginbg/1000/1200"
                alt="Abstract background"
                fill
                className="object-cover opacity-20"
                data-ai-hint="abstract logo gradient"
            />
             <div className="absolute inset-0 bg-gradient-to-l from-gray-900/50 via-black to-black"></div>
        </div>
      </div>
    </div>
  );
}
