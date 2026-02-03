
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

// Pages accessible to anyone, logged in or not.
const PUBLIC_PAGES = ['/', '/login', '/about', '/courses', '/explore', '/programs', '/certifications', '/contact', '/admin', '/instructor-signup', '/instructor-pending-verification', '/live-classes'];

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  // Check for both student and instructor profiles.
  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);
  
  const instructorDocRef = useMemoFirebase(() => user ? doc(firestore, 'instructors', user.uid) : null, [firestore, user]);
  const { data: instructorProfile, isLoading: isInstructorProfileLoading } = useDoc<Instructor>(instructorDocRef);

  const isLoading = isUserLoading || (user && (isProfileLoading || isInstructorProfileLoading));

  useEffect(() => {
    if (isLoading) {
      return; // Wait until all auth and profile data is loaded.
    }
    
    // --- User is NOT Logged In ---
    if (!user) {
      const isAllowedGuestPage = 
        PUBLIC_PAGES.includes(pathname) || 
        pathname.startsWith('/courses/') || 
        pathname.startsWith('/instructors/') || 
        PRE_AUTH_ONBOARDING_PAGES.includes(pathname);

      // If trying to access a protected page, redirect to login.
      if (!isAllowedGuestPage) {
        router.replace('/login');
      }
      return;
    }

    // --- User IS Logged In ---

    // If it's an admin or an instructor, the student onboarding guard should not apply.
    if (user.isAnonymous || instructorProfile) {
        // But if an instructor tries to access a student-only onboarding page, redirect them.
        const isStudentOnboardingPage = PRE_AUTH_ONBOARDING_PAGES.includes(pathname) || POST_AUTH_ONBOARDING_PAGES.includes(pathname);
        if (instructorProfile && isStudentOnboardingPage) {
            router.replace('/dashboard'); // or instructor dashboard
        }
      return;
    }

    // Handle student onboarding status.
    const status = userProfile?.onboardingStatus || 'new';

    if (status === 'active') {
      // Onboarding is complete. Redirect away from any onboarding page.
      const isOnboardingPage = PRE_AUTH_ONBOARDING_PAGES.includes(pathname) || POST_AUTH_ONBOARDING_PAGES.includes(pathname);
      if (isOnboardingPage) {
          router.replace('/dashboard');
      }
    } else {
      // Onboarding is IN-PROGRESS.
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

      // If the user is not on their required step OR a page they are allowed to see while onboarding, redirect them.
      if (pathname !== requiredStep && !isAllowedInProgressPage) {
         router.replace(requiredStep);
      }
    }
  }, [isLoading, user, userProfile, instructorProfile, pathname, router]);

  if (isLoading) {
    return <Loading />;
  }

  return <>{children}</>;
}
