
'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, DocumentData } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import type { UserProfile } from '@/lib/types';
import Loading from '@/app/loading';

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
    if (isUserLoading || isProfileLoading) {
      return; // Wait for user and profile data to load
    }
    
    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isOnboardingRoute = ONBOARDING_ROUTES.includes(pathname);

    if (user && userProfile) { // User is logged in and has a profile document
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
    } else if (!user && !isUserLoading) { // User is not logged in
        if (isOnboardingRoute || pathname === '/dashboard') {
            // Protect onboarding and dashboard pages
            router.replace('/login');
        }
    }

  }, [user, userProfile, isUserLoading, isProfileLoading, pathname, router]);

  // Show a loading screen while we determine the user's status and redirect.
  if ((isUserLoading || (user && isProfileLoading)) && !AUTH_ROUTES.includes(pathname)) {
    return <Loading />;
  }

  return <>{children}</>;
}
