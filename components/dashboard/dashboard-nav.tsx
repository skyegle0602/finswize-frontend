"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sparkles, LayoutDashboard, Wallet, Calendar, Bell, Lightbulb, Settings, LogOut } from "lucide-react" 

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/spending", label: "Spending", icon: Wallet },
  { href: "/dashboard/planning", label: "Planning", icon: Calendar },
  { href: "/dashboard/alerts", label: "Alerts", icon: Bell },
  { href: "/dashboard/advice", label: "AI Advisor", icon: Lightbulb },
]

export function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (


    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">FinsWize</span>
        </Link>
      </div>

      <nav className="flex flex-col flex-1 p-8 space-y-8">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-4 text-xl font-poppins", isActive && "bg-secondary")}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <Link href="/dashboard/settings">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>
    </div>
  )
}
