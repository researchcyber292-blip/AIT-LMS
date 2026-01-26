
'use client';

import { usePathname } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster";
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SecurityInterceptor } from '@/components/security-interceptor';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import Script from 'next/script';
import { OnboardingGuard } from '@/components/onboarding-guard';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isFullScreenPage = pathname === '/student-welcome' || pathname === '/profile-setup' || pathname === '/getting-started' || pathname === '/activation' || pathname === '/admin';

  return (
    <html lang="en" className="dark">
      <head>
        <title>Aviraj Info Tech - Your Gateway to Cybersecurity Mastery</title>
        <meta name="description" content="Aviraj Info Tech offers expert-led courses in cybersecurity, from ethical hacking to advanced network defense." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Audiowide&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <OnboardingGuard>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              {!isFullScreenPage && <Footer />}
            </div>
            <SecurityInterceptor />
            <Toaster />
          </OnboardingGuard>
        </FirebaseClientProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
