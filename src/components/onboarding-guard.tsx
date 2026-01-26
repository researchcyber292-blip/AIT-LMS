
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/types';
import Loading from '@/app/loading';
import { createUserProfile } from '@/firebase/user';

const ONBOARDING_ROUTES = [
  '/student-welcome',
  '/profile-setup',
  '/getting-started',
  '/activation',
];

const AUTH_ROUTES = ['/login', '/about'];

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  useEffect(() => {
    // Wait for auth and profile loading to settle
    if (isUserLoading || (user && isProfileLoading)) {
      return;
    }

    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isOnboardingRoute = ONBOARDING_ROUTES.includes(pathname);

    // Case 1: User is NOT authenticated
    if (!user) {
      if (isOnboardingRoute || pathname === '/dashboard') {
        // Protect onboarding and dashboard pages from unauthenticated users
        router.replace('/login');
      }
      // Otherwise, allow access to public pages
      return;
    }

    // From here, we know `user` is authenticated.

    // Case 2: User is authenticated, but the profile is still being created.
    if (!userProfile) {
      // The useDoc hook will then pick up the new document and re-run this effect.
      // We ensure the profile is created only once.
      createUserProfile(firestore, user);
      // Don't do anything else, wait for the re-render which will handle the redirect.
      return;
    }

    // From here, we know `user` and `userProfile` are available.

    // Case 3: User is authenticated and has a profile. Let's check onboarding status.
    const { onboardingStatus } = userProfile;

    const requiredStep = {
      'new': '/student-welcome',
      'profile_complete': '/getting-started',
      'username_complete': '/activation',
      'active': null, // Onboarding complete
    }[onboardingStatus];

    // If onboarding is NOT complete
    if (requiredStep) {
      if (pathname !== requiredStep) {
        router.replace(requiredStep);
      }
    } 
    // If onboarding IS complete (`requiredStep` is null)
    else {
      // Redirect away from auth or onboarding pages to the dashboard.
      if (isAuthRoute || isOnboardingRoute) {
        router.replace('/dashboard');
      }
    }
  }, [user, userProfile, isUserLoading, isProfileLoading, pathname, router, firestore]);

  // Show a loading screen while we determine the user's status and redirect.
  // This covers the initial auth check and the profile fetch for logged-in users.
  if ((isUserLoading || (user && isProfileLoading)) && !AUTH_ROUTES.includes(pathname)) {
    return <Loading />;
  }

  return <>{children}</>;
}
