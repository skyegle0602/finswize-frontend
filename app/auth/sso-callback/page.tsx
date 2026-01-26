"use client";

import { AuthenticateWithRedirectCallback, useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Module-level singleton to persist across React strict mode double renders
let isInitialized = false;

export default function SSOCallbackPage() {
  const [mounted, setMounted] = useState(false);
  const initRef = useRef(false);
  const redirectRef = useRef(false);
  const { isLoaded: authLoaded, isSignedIn, userId } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Only mount once, even with React strict mode
    if (initRef.current || isInitialized) {
      return;
    }

    initRef.current = true;
    isInitialized = true;
    setMounted(true);

    // Prevent cleanup from resetting in strict mode
    return () => {
      // Don't reset - keep initialized state
    };
  }, []);

  // Fallback redirect check - if user is authenticated but still on this page
  useEffect(() => {
    if (!mounted || redirectRef.current) return;
    
    // Wait for auth to be fully loaded
    if (!authLoaded || !userLoaded) return;

    // If user is signed in, redirect them
    if (isSignedIn && userId) {
      redirectRef.current = true;
      
      // Check if this is a new user (no onboarding data) or existing user
      // For new users, redirect to onboarding; for existing, to dashboard
      const isNewUser = !user?.publicMetadata?.onboardingCompleted;
      
      const redirectPath = isNewUser ? '/onboarding' : '/dashboard';
      
      // Use a small delay to ensure session is fully established
      setTimeout(() => {
        router.push(redirectPath);
        router.refresh();
      }, 300);
    }
  }, [mounted, authLoaded, userLoaded, isSignedIn, userId, user, router]);

  // Only render the callback component once
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
          <p className="text-gray-600">Completing authentication...</p>
        </div>
        {/* Required for Clerk's bot sign-up protection */}
        <div id="clerk-captcha" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
      <AuthenticateWithRedirectCallback
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/onboarding"
      />
      {/* Required for Clerk's bot sign-up protection */}
      <div id="clerk-captcha" />
    </div>
  );
}
