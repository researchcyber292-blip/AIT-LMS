
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
    const handleRedirects = async () => {
      // Wait for auth and profile loading to settle
      if (isUserLoading || (user && isProfileLoading)) {
        return;
      }

      const isAuthRoute = AUTH_ROUTES.includes(pathname);
      const isOnboardingRoute = ONBOARDING_ROUTES.includes(pathname);

      // Case 1: User is NOT authenticated
      if (!user) {
        if (isOnboardingRoute || pathname === '/dashboard') {
          router.replace('/login');
        }
        return;
      }

      // Case 2: User is authenticated, check for profile.
      let profile = userProfile;
      if (!profile) {
        try {
          // Await profile creation to prevent race conditions.
          await createUserProfile(firestore, user);
          // The useDoc hook will cause a re-render with the new profile.
          // For this first pass, we can assume the status is 'new' to speed up redirection.
          profile = { onboardingStatus: 'new' } as UserProfile;
        } catch (error) {
          console.error("OnboardingGuard: Failed to create user profile, blocking onboarding.", error);
          // If profile creation fails, we can't proceed.
          return;
        }
      }
      
      // If we are still here, we have a user and a profile (or a placeholder for it).
      const { onboardingStatus } = profile;
      
      const requiredStep = {
        'new': '/welcome',
        'profile_complete': '/getting-started',
        'username_complete': '/activation',
        'active': null, // Onboarding complete
      }[onboardingStatus];

      if (requiredStep) {
        if (pathname !== requiredStep) {
          router.replace(requiredStep);
        }
      } else { // Onboarding is complete
        if (isAuthRoute || isOnboardingRoute) {
          router.replace('/dashboard');
        }
      }
    };

    handleRedirects();

  }, [user, userProfile, isUserLoading, isProfileLoading, pathname, router, firestore]);

  if ((isUserLoading || (user && isProfileLoading)) && !AUTH_ROUTES.includes(pathname)) {
    return <Loading />;
  }

  return <>{children}</>;
}
