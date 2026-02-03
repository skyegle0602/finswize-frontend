"use client"

import { useEffect } from "react"

/**
 * Suppresses non-critical Clerk API errors that don't affect functionality.
 * Handles:
 * - 403 permission error for site_integration/template_list (background request)
 * - 404 errors for sessions that are being refreshed/created (timing issues)
 */
export function ErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections (like Clerk API errors)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      
      // Check if this is the non-critical Clerk site integration error
      if (
        error?.reqInfo?.path === "/site_integration/template_list" ||
        (error?.code === 403 && error?.message === "permission error" && error?.reqInfo?.pathPrefix === "/site_integration")
      ) {
        // Suppress this specific error - it's non-critical and doesn't affect signup/login
        event.preventDefault()
        return
      }
      
      // Suppress 404 errors for session endpoints during session creation/refresh
      // These can happen due to timing issues when Clerk is establishing sessions
      if (
        error?.code === 404 &&
        (error?.reqInfo?.path?.includes("/sessions/") || 
         error?.reqInfo?.path?.includes("/client/sessions/"))
      ) {
        // This is a timing issue - Clerk will retry or create a new session
        // Suppress to avoid console noise
        event.preventDefault()
        return
      }
      
      // Let other errors through normally
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return null
}
