
'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import Loading from '@/app/loading';
import { useEffect } from 'react';

// These pages are part of the onboarding flow BEFORE a user account is created.
const PRE_AUTH_ONBOARDING_PAGES = [
  '/student-welcome',
  '/welcome-video-2',
  '/getting-started',
  '/activation'
];

// These pages are part of the onboarding flow AFTER a user account is created but before it's 'active'.
const POST_AUTH_ONBOARDING_PAGES = [
  '/avatar-selection',
  '/creation-success',
  '/verify-email' // The new verification page is part of the post-auth flow.
];

// Pages accessible to anyone, logged in or not.
const PUBLIC_PAGES = ['/', '/login', '/about', '/courses', '/programs', '/certifications', '/contact', '/admin'];

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const isLoading = isUserLoading || (user && isProfileLoading);

  useEffect(() => {
    if (isLoading) {
      return; // Wait until all auth and profile data is loaded.
    }
    
    // --- User is NOT Logged In ---
    if (!user) {
      const isAllowedGuestPage = 
        PUBLIC_PAGES.includes(pathname) || 
        pathname.startsWith('/courses/') || 
        PRE_AUTH_ONBOARDING_PAGES.includes(pathname);

      // If trying to access a protected page, redirect to login.
      if (!isAllowedGuestPage) {
        router.replace('/login');
      }
      return;
    }

    // --- User IS Logged In ---

    // Step 1: Handle email verification. This is the highest priority.
    if (!user.emailVerified) {
      // If email is not verified, force user to the verification page.
      if (pathname !== '/verify-email') {
        router.replace('/verify-email');
      }
      return; // Stop further execution until email is verified.
    }

    // Step 2: Handle onboarding status for VERIFIED users.
    const status = userProfile?.onboardingStatus || 'new';

    if (status === 'active') {
      // Onboarding is complete. Redirect away from any onboarding page.
      const isOnboardingPage = PRE_AUTH_ONBOARDING_PAGES.includes(pathname) || POST_AUTH_ONBOARDING_PAGES.includes(pathname);
      if (isOnboardingPage) {
          router.replace('/dashboard');
      }
    } else {
      // Onboarding is IN-PROGRESS for a verified user.
      const requiredStepMap: { [key: string]: string } = {
        'new': '/student-welcome', // Should not be hit if profile exists, but as a fallback.
        'profile_complete': '/getting-started',
        'username_complete': '/avatar-selection',
      };
      const requiredStep = requiredStepMap[status] || '/student-welcome';
      
      const isPublicPage = PUBLIC_PAGES.includes(pathname) || pathname.startsWith('/courses/');

      // If the user is not on their required step, redirect them.
      // We allow them to browse public pages freely.
      if (pathname !== requiredStep && !isPublicPage) {
         router.replace(requiredStep);
      }
    }
  }, [isLoading, user, userProfile, pathname, router]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
