
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/types';
import Loading from '@/app/loading';
import { createUserProfile } from '@/firebase/user';

const ONBOARDING_ROUTES = [
  '/student-welcome',
  '/welcome',
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
    // Primary guard: Wait for both user auth and profile fetch to settle.
    if (isUserLoading || (user && isProfileLoading)) {
      return; // Still loading, do nothing.
    }

    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isOnboardingRoute = ONBOARDING_ROUTES.includes(pathname);
    
    // SCENARIO 1: No authenticated user.
    if (!user) {
      // If user is not logged in but tries to access a protected route, redirect to login.
      if (isOnboardingRoute || pathname === '/dashboard') {
        router.replace('/login');
      }
      // Otherwise, allow access to public pages.
      return;
    }

    // From here, we know `user` is authenticated.
    
    // SCENARIO 2: User is authenticated, but their profile doesn't exist in Firestore yet.
    if (!userProfile) {
      // Create the profile. The `useDoc` hook will automatically update `userProfile`
      // on the next render, which will trigger this `useEffect` again.
      createUserProfile(firestore, user).catch(error => {
        console.error("OnboardingGuard: Failed to create user profile. User may be stuck.", error);
        // Optionally, redirect to an error page or show a toast.
      });
      // Return here and wait for the re-render caused by profile creation.
      return;
    }

    // From here, we know `user` is authenticated AND `userProfile` exists.

    // SCENARIO 3: User is authenticated and has a profile. Handle onboarding redirects.
    const { onboardingStatus } = userProfile;
    
    // Define the required page for each onboarding status.
    const requiredStep = {
      'new': '/welcome',
      'profile_complete': '/getting-started',
      'username_complete': '/activation',
      'active': null, // null means onboarding is complete.
    }[onboardingStatus];

    // If onboarding is NOT complete...
    if (requiredStep) {
      // ...and the user is not on the correct step, redirect them.
      if (pathname !== requiredStep) {
        router.replace(requiredStep);
      }
    } 
    // If onboarding IS complete...
    else {
      // ...and the user is on an auth or onboarding page, redirect them to the home page.
      if (isAuthRoute || isOnboardingRoute) {
        router.replace('/');
      }
    }

  }, [user, userProfile, isUserLoading, isProfileLoading, pathname, router, firestore]);

  // Show a loading screen for any non-auth page while we're figuring out the user's state.
  if ((isUserLoading || (user && isProfileLoading)) && !AUTH_ROUTES.includes(pathname)) {
    return <Loading />;
  }

  return <>{children}</>;
}
