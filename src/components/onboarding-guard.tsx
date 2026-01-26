
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

    // Case 1: User is authenticated, but no profile document exists yet.
    // This is their first time through the flow. Create the profile.
    if (user && !userProfile) {
      // The useDoc hook will then pick up the new document and re-run this effect.
      createUserProfile(firestore, user);
      // Don't do anything else, wait for the re-render which will handle the redirect.
      return;
    }
    
    // Case 2: User is authenticated AND has a profile document.
    if (user && userProfile) {
      if (isAuthRoute) {
        router.replace('/dashboard'); // Logged-in users shouldn't be on auth pages
        return;
      }
      
      const { onboardingStatus } = userProfile;

      const requiredStep = {
        'new': '/student-welcome',
        'profile_complete': '/getting-started',
        'username_complete': '/activation',
        'active': null, // Onboarding complete
      }[onboardingStatus];

      if (requiredStep && pathname !== requiredStep) {
        router.replace(requiredStep);
      } else if (!requiredStep && isOnboardingRoute) {
        // User is active but trying to access an onboarding page
        router.replace('/dashboard');
      }
    } 
    // Case 3: User is not authenticated.
    else if (!user) {
        if (isOnboardingRoute || pathname === '/dashboard') {
            // Protect onboarding and dashboard pages
            router.replace('/login');
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
