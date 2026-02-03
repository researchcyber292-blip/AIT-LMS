
'use client';

import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';
import type { UserProfile, Instructor } from '@/lib/types';
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
  '/password-reminder'
];

const INSTRUCTOR_ONBOARDING_PAGES = [
  '/instructor-avatar-selection',
  '/instructor-pending-verification',
  '/instructor-access-denied',
];

// Pages accessible to anyone, logged in or not.
const PUBLIC_PAGES = ['/', '/login', '/about', '/courses', '/explore', '/programs', '/certifications', '/contact', '/admin', '/instructor-signup'];

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);
  
  const instructorDocRef = useMemoFirebase(() => user ? doc(firestore, 'instructors', user.uid) : null, [firestore, user]);
  const { data: instructorProfile, isLoading: isInstructorProfileLoading } = useDoc<Instructor>(instructorDocRef);

  const isLoading = isUserLoading || (user && (isProfileLoading || isInstructorProfileLoading));

  useEffect(() => {
    if (isLoading) {
      return;
    }
    
    // --- User is NOT Logged In ---
    if (!user) {
      const isAllowedGuestPage = 
        PUBLIC_PAGES.includes(pathname) || 
        pathname.startsWith('/courses/') || 
        pathname.startsWith('/instructors/') ||
        PRE_AUTH_ONBOARDING_PAGES.includes(pathname) ||
        // Allow access to status pages if they somehow land there logged out
        INSTRUCTOR_ONBOARDING_PAGES.includes(pathname);

      if (!isAllowedGuestPage) {
        router.replace('/login');
      }
      return;
    }

    // --- User IS Logged In ---

    // Handle Admin
    if (user.isAnonymous) {
      return; 
    }

    // Handle Instructor Flow
    if (instructorProfile) {
        const { accountStatus, photoURL } = instructorProfile;

        if (accountStatus === 'pending') {
            if (pathname !== '/instructor-pending-verification') router.replace('/instructor-pending-verification');
            return;
        }
        if (accountStatus === 'rejected' || accountStatus === 'banned') {
            const targetPath = `/instructor-access-denied?status=${accountStatus}`;
            // use startsWith to handle potential query param changes
            if (!pathname.startsWith('/instructor-access-denied')) {
                router.replace(targetPath);
            }
            return;
        }
        if (accountStatus === 'active') {
            if (!photoURL) {
                // First time login after approval, needs to select avatar
                if (pathname !== '/instructor-avatar-selection') {
                    router.replace('/instructor-avatar-selection');
                }
            } else {
                // Fully onboarded instructor, should not be on setup pages
                if (INSTRUCTOR_ONBOARDING_PAGES.includes(pathname)) {
                    router.replace('/dashboard');
                }
            }
        }
        return; // Allow access to other pages if active and onboarded
    }

    // Handle Student Flow
    if (userProfile) {
        const status = userProfile.onboardingStatus || 'new';

        if (status === 'active') {
            const isOnboardingPage = PRE_AUTH_ONBOARDING_PAGES.includes(pathname) || POST_AUTH_ONBOARDING_PAGES.includes(pathname);
            if (isOnboardingPage) {
                router.replace('/dashboard');
            }
        } else {
            const requiredStepMap: { [key: string]: string } = {
                'new': '/student-welcome',
                'profile_complete': '/getting-started',
                'username_complete': '/avatar-selection',
            };
            const requiredStep = requiredStepMap[status] || '/student-welcome';
            
            const isAllowedInProgressPage = 
                PUBLIC_PAGES.includes(pathname) || 
                pathname.startsWith('/courses/') || 
                pathname.startsWith('/instructors/') || 
                POST_AUTH_ONBOARDING_PAGES.includes(pathname);

            if (pathname !== requiredStep && !isAllowedInProgressPage) {
                router.replace(requiredStep);
            }
        }
        return;
    }

  }, [isLoading, user, userProfile, instructorProfile, pathname, router]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
