
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Script from 'next/script';
import { OnboardingGuard } from '@/components/onboarding-guard';
import { cn } from '@/lib/utils';
import { CustomCursor } from '@/components/custom-cursor';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isFullScreenPage = ['/student-welcome', '/welcome-video-2', '/profile-setup', '/getting-started', '/activation', '/admin', '/creation-success', '/live-classroom', '/dashboard', '/studio', '/explore'].includes(pathname);

  useEffect(() => {
    console.log("%c████████ STOP! ████████", "color: red; font-size: 40px; font-weight: bold; font-family: monospace;");
    console.log("%cThis is a secure system. All activity is monitored.", "color: yellow; font-size: 16px; font-family: monospace;");
    console.log("%cUnauthorized access attempts, including use of developer tools for inspection or network interception, are strictly prohibited and will be logged.", "color: orange; font-size: 12px;");
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Aviraj Info Tech - Your Gateway to Cybersecurity Mastery</title>
        <meta name="description" content="Aviraj Info Tech offers expert-led courses in cybersecurity, from ethical hacking to advanced network defense." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet" />
        <Script src="https://meet.jit.si/external_api.js" async />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <OnboardingGuard>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 relative">{children}</main>
              {!isFullScreenPage && <Footer />}
            </div>
            <Toaster />
            <CustomCursor />
          </OnboardingGuard>
        </FirebaseClientProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
