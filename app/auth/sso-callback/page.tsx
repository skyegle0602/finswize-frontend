"use client";

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function SSOCallbackPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && userId) {
      // User is authenticated, redirect to dashboard
      router.push('/dashboard');
    }
  }, [isLoaded, userId, router]);

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
      {/* Required for sign-up flows - Clerk's bot sign-up protection */}
      <div id="clerk-captcha" />
    </div>
  );
}
