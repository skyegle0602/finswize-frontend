"use client"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import type { FC } from "react"

interface HeaderProps {
  className?: string
  isLoggedIn?: boolean
}

const Header: FC<HeaderProps> = ({ className, isLoggedIn }) => {
  return (
    <header className={`border-b border-border ${className || ""}`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">FinsWize</span>
          </div>
          <nav className="hidden md:flex items-center gap-x-16">
            <Link href="#features" className="text-xl text-black-400 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-xl text-black-400 transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-xl text-black-40 transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-8">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-green-600 text-white text-xl">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button size="lg" className="bg-green-600 text-white text-xl">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-blue-500 text-white text-xl">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
      </div>
    </header>
  )
}

export default Header
