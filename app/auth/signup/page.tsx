"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSignUp } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles } from "lucide-react"
import GoogleSignInButton from "@/components/auth/google-signin-button"

export default function SignupPage() {
  const router = useRouter()
  const { signUp, isLoaded, setActive } = useSignUp()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoaded || !signUp) {
      setError("Authentication service is not ready. Please refresh the page.")
      return
    }

    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      // Prepare signup data - ensure firstName is not empty
      const firstName = name.trim().split(" ")[0] || name.trim() || "User"
      const lastName = name.trim().split(" ").slice(1).join(" ") || ""

      // Validate that we have required fields
      if (!email.trim() || !password.trim() || !firstName.trim()) {
        setError("Please fill in all required fields")
        setIsLoading(false)
        return
      }

      const result = await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName: firstName,
        lastName: lastName,
      })

      if (result.status === "complete" && setActive && result.createdSessionId) {
        // Account is fully created - redirect to onboarding
        sessionStorage.setItem("signupName", name)
        sessionStorage.setItem("signupEmail", email)
        
        try {
          // Set the active session and wait for it to be established
          await setActive({ session: result.createdSessionId })
          // Small delay to ensure session is fully established
          await new Promise(resolve => setTimeout(resolve, 100))
          
          router.push("/onboarding")
          router.refresh()
        } catch (sessionErr: any) {
          console.error("Session activation error:", sessionErr)
          // If session activation fails, still redirect - Clerk will handle auth state
          router.push("/onboarding")
          router.refresh()
        }
      } else if (result.status === "missing_requirements") {
        // Email verification is required - we MUST complete this to create the account
        // Prepare email verification and show the modal
        try {
          await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
          // Show verification modal - account will be created after verification
          setIsLoading(false) // Stop loading so the input field is enabled
          setPendingVerification(true)
        } catch (prepErr: any) {
          // If preparation fails, show error
          console.error("Verification preparation error:", prepErr)
          setError(prepErr.errors?.[0]?.message || "Failed to send verification code. Please try again.")
          setIsLoading(false)
        }
      } else {
        // Unexpected status
        console.error("Unexpected signup status:", result.status)
        setError("Unexpected response. Please try again.")
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error("Signup error:", err)
      // Better error handling
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message || "Failed to create account")
      } else if (err.message) {
        setError(err.message)
      } else {
        setError("Failed to create account. Please check your information and try again.")
      }
      setIsLoading(false)
    }
  }

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isLoaded || !setActive || !signUp) {
      setError("Authentication service is not ready. Please refresh the page.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      })

      console.log("Verification result:", result.status, "Session ID:", result.createdSessionId || signUp.createdSessionId)

      // Check if verification was successful
      // After verification, the status should be "complete"
      if (result.status === "complete" || signUp.status === "complete") {
        // Store name in sessionStorage to use in onboarding
        sessionStorage.setItem("signupName", name)
        sessionStorage.setItem("signupEmail", email)
        
        // Get the session ID from result or signUp object
        const sessionId = result.createdSessionId || signUp.createdSessionId
        
        console.log("Setting active session:", sessionId)
        
        if (sessionId && setActive) {
          try {
            // Set the active session and wait for it to be established
            await setActive({ session: sessionId })
            console.log("Session activated successfully")
            // Small delay to ensure session is fully established
            await new Promise(resolve => setTimeout(resolve, 300))
          } catch (sessionErr: any) {
            console.error("Session activation error:", sessionErr)
            // Continue with redirect even if setActive fails
          }
        }
        
        console.log("Redirecting to onboarding...")
        // Always redirect to onboarding after successful verification
        // Use both router and window.location as fallback
        try {
          router.push("/onboarding")
          router.refresh()
          // Fallback: if router doesn't work, use window.location
          setTimeout(() => {
            if (window.location.pathname !== "/onboarding") {
              console.log("Router redirect failed, using window.location")
              window.location.href = "/onboarding"
            }
          }, 500)
        } catch (redirectErr) {
          console.error("Redirect error:", redirectErr)
          // Fallback to window.location
          window.location.href = "/onboarding"
        }
      } else {
        // Verification incomplete - show what status we got
        console.log("Verification incomplete. Status:", result.status, "SignUp status:", signUp.status)
        setError(`Verification incomplete (status: ${result.status}). Please check your code and try again.`)
        setIsLoading(false)
      }
    } catch (err: any) {
      console.error("Verification error:", err)
      setError(err.errors?.[0]?.message || err.message || "Verification failed. Please check your code and try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold text-foreground">FinWise</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {pendingVerification ? "Verify your email" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {pendingVerification
                ? "We sent a verification code to your email"
                : "Get started with your free trial today"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingVerification ? (
              <form onSubmit={handleVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    disabled={isLoading}
                    maxLength={6}
                    autoFocus
                    className="text-center text-lg tracking-widest"
                  />
                </div>
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!isLoaded || !signUp) return
                      try {
                        setIsLoading(true)
                        setError(null)
                        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
                        setError(null)
                        alert("Verification code has been resent to your email.")
                      } catch (err: any) {
                        setError(err.errors?.[0]?.message || "Failed to resend code. Please try again.")
                      } finally {
                        setIsLoading(false)
                      }
                    }}
                    disabled={isLoading}
                    className="text-sm text-primary hover:underline disabled:opacity-50"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Continue to Setup"}
              </Button>
              <p className="text-xs text-center text-muted-foreground leading-relaxed">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
              </form>
            )}
            {/* Required for Clerk's bot sign-up protection */}
            <div id="clerk-captcha" />
          </CardContent>
          {!pendingVerification && (
            <CardFooter className="flex flex-col gap-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>
              <GoogleSignInButton isLoading={isLoading} mode="sign-up" />
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
