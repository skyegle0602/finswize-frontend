"use client";

import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const { signIn, isLoaded } = useSignIn();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email"); // Track which step we're on

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signIn) {
      setError("Service is not ready. Please try again.");
      return;
    }

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Create sign-in attempt first
      const signInAttempt = await signIn.create({
        identifier: email,
      });

      // Get the email address ID from the user
      if (signInAttempt.supportedFirstFactors) {
        // Find the email factor
        const emailFactor = signInAttempt.supportedFirstFactors.find(
          (factor) => factor.strategy === "reset_password_email_code"
        );

        if (emailFactor) {
          // Prepare the reset password factor
          await signInAttempt.prepareFirstFactor({
            strategy: "reset_password_email_code",
            emailAddressId: emailFactor.emailAddressId,
          });

          // Move to code verification step
          setStep("code");
          setLoading(false);
        } else {
          throw new Error("Password reset is not available for this account.");
        }
      } else {
        throw new Error("Unable to initiate password reset. Please try again.");
      }
    } catch (err: any) {
      console.error("Password reset error:", err);
      setLoading(false);

      if (err && typeof err === 'object' && 'errors' in err) {
        const clerkError = err as { errors: Array<{ message: string }> };
        setError(clerkError.errors[0]?.message || "Failed to send reset email. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to send reset email. Please try again.");
      }
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signIn) {
      setError("Service is not ready. Please try again.");
      return;
    }

    if (!code || code.length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Attempt to verify the code
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code,
      });

      // Check if verification was successful
      if (result.status === "needs_new_password") {
        // Code verified, redirect to set new password page
        // We'll pass the signIn session state via URL or use Clerk's state
        router.push("/auth/set-new-password");
      } else {
        setError("Verification failed. Please check your code and try again.");
        setLoading(false);
      }
    } catch (err: any) {
      console.error("Code verification error:", err);
      setLoading(false);

      if (err && typeof err === 'object' && 'errors' in err) {
        const clerkError = err as { errors: Array<{ message: string }> };
        setError(clerkError.errors[0]?.message || "Verification failed. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
      }
    }
  };

  const handleResend = async () => {
    if (!isLoaded || !signIn) {
      setError("Service is not ready. Please try again.");
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Re-create sign-in attempt
      const signInAttempt = await signIn.create({
        identifier: email,
      });

      if (signInAttempt.supportedFirstFactors) {
        const emailFactor = signInAttempt.supportedFirstFactors.find(
          (factor) => factor.strategy === "reset_password_email_code"
        );

        if (emailFactor) {
          await signInAttempt.prepareFirstFactor({
            strategy: "reset_password_email_code",
            emailAddressId: emailFactor.emailAddressId,
          });
          setError(null);
          alert("Verification code has been resent to your email.");
        }
      }
      setLoading(false);
    } catch (err) {
      console.error("Resend error:", err);
      setError("Failed to resend code. Please try again.");
      setLoading(false);
    }
  };

  // Code verification step
  if (step === "code") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
          {/* Email Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-8 w-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">
            Verify your code
          </h1>

          {/* Message */}
          <p className="mb-6 text-center text-sm text-gray-600">
            We&apos;ve sent a verification code to{" "}
            <span className="font-medium text-gray-900">{email}</span>
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleCodeSubmit} className="mb-6">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setCode(value);
                }}
                placeholder="Enter 6-digit code"
                required
                disabled={loading || !isLoaded}
                className="w-full rounded-lg border border-gray-200 py-3 px-4 text-center text-2xl font-mono tracking-widest placeholder:text-gray-400 focus:border-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={!isLoaded || loading || code.length !== 6}
              className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mb-6 text-center">
            <button
              type="button"
              onClick={handleResend}
              disabled={!isLoaded || loading}
              className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Didn&apos;t receive the code? <span className="font-medium">Resend</span>
            </button>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to email
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Email input step
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-sm">
        {/* Back Link */}
        <Link
          href="/auth/login"
          className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to sign in
        </Link>

        {/* Title */}
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Reset your password
        </h1>

        {/* Subtitle */}
        <p className="mb-6 text-sm text-gray-600">
          Enter your email address and we&apos;ll send you a verification code to reset your password.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailSubmit}>
          {/* Email Input */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || !isLoaded}
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm placeholder:text-gray-400 focus:border-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isLoaded || loading}
            className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send verification code"}
          </button>
        </form>
      </div>
    </div>
  );
}
