"use client";

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';

// Module-level singleton to persist across React strict mode double renders
let isInitialized = false;

export default function SSOCallbackPage() {
  const [mounted, setMounted] = useState(false);
  const initRef = useRef(false);

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
