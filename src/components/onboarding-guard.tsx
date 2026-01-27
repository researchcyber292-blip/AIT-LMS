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
  '/creation-success'
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
    
    const isPublicPage = PUBLIC_PAGES.includes(pathname) || pathname.startsWith('/courses/');
    const isPreAuthOnboarding = PRE_AUTH_ONBOARDING_PAGES.includes(pathname);
    const isPostAuthOnboarding = POST_AUTH_ONBOARDING_PAGES.includes(pathname);

    if (!user) {
      // --- User is NOT Logged In ---
      // If trying to access a protected page (not public and not pre-auth onboarding), redirect to login.
      if (!isPublicPage && !isPreAuthOnboarding) {
        router.replace('/login');
      }
      // Otherwise, allow access to public pages and the initial parts of onboarding.
    } else {
      // --- User IS Logged In ---
      const status = userProfile?.onboardingStatus || 'new';

      if (status === 'active') {
        // Onboarding is complete.
        // If they try to go back to any onboarding page, redirect them to the dashboard.
        if (isPreAuthOnboarding || isPostAuthOnboarding) {
            router.replace('/dashboard');
        }
        // Otherwise, allow access to any other page.
      } else {
        // Onboarding is IN-PROGRESS.
        const requiredStepMap: { [key: string]: string } = {
          'new': '/student-welcome',
          'profile_complete': '/getting-started', // This status might be part of a legacy flow.
          'username_complete': '/avatar-selection',
        };
        const requiredStep = requiredStepMap[status] || '/student-welcome';

        // If the user is not on their required step, redirect them.
        if (pathname !== requiredStep) {
            // But allow access to public pages if they want to browse.
            if (!isPublicPage) {
               router.replace(requiredStep);
            }
        }
      }
    }
  }, [isLoading, user, userProfile, pathname, router]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
