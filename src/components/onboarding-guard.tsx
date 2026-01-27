
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/types';
import Loading from '@/app/loading';
import { createUserProfile } from '@/firebase/user';

// The authentication routes that a logged-in user should be redirected away from.
const AUTH_ROUTES = ['/login', '/about'];
// The old onboarding routes. Logged-in users should also be redirected away from these.
const ONBOARDING_ROUTES = ['/welcome', '/profile-setup', '/getting-started', '/activation'];

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
  
  const isLoading = isUserLoading || (user && isProfileLoading);

  useEffect(() => {
    if (isLoading) {
      return; // Wait until loading is complete before running any logic.
    }

    // SCENARIO 1: No authenticated user.
    if (!user) {
      // If user tries to access a protected page like the dashboard, send them to login.
      if (pathname.startsWith('/dashboard')) {
        router.replace('/login');
      }
      return; // Otherwise, allow access to public pages.
    }

    // --- From this point, we know there IS an authenticated user ---

    // SCENARIO 2: New user without a profile document.
    if (!userProfile) {
      // Create their profile. The useDoc hook will see the new document on the
      // next render, `isLoading` will become false, and this useEffect will run again.
      createUserProfile(firestore, user).catch(err => {
        console.error("OnboardingGuard: Failed to create user profile.", err);
      });
      return; // Wait for profile creation.
    }

    // SCENARIO 3: Logged-in user with a profile.
    const isOnAuthPage = AUTH_ROUTES.includes(pathname);
    const isOnOldOnboardingPage = ONBOARDING_ROUTES.includes(pathname);

    // If the user is on an auth page or an old, now-unused onboarding page,
    // redirect them to the homepage.
    if (isOnAuthPage || isOnOldOnboardingPage) {
      router.replace('/');
    }

  }, [isLoading, user, userProfile, pathname, router, firestore]);

  // Only show a loading spinner on protected routes while we are verifying the user's auth state.
  if (isLoading && pathname.startsWith('/dashboard')) {
    return <Loading />;
  }

  return <>{children}</>;
}
