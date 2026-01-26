"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, Plus, CreditCard, ArrowRight } from "lucide-react"
import Link from "next/link"

interface QuickActionsProps {
  alertCount: number
  runway: number
  onActionClick?: (action: string) => void
}

export function QuickActions({ alertCount, runway, onActionClick }: QuickActionsProps) {
  // Context-aware actions with conditional logic
  const actions = []
  
  // Priority 1: Alerts (if they exist)
  if (alertCount > 0) {
    actions.push({
      label: "Explain my alerts",
      href: "/dashboard/alerts",
      icon: AlertTriangle,
      variant: "default" as const,
    })
  }
  
  // Priority 2: Runway (if low)
  if (runway < 3) {
    actions.push({
      label: "Plan cost reduction",
      href: "/dashboard/planning",
      icon: TrendingUp,
      variant: "default" as const,
    })
  } else if (runway < 6) {
    actions.push({
      label: "Check my runway",
      href: "/dashboard/planning",
      icon: TrendingUp,
      variant: "outline" as const,
    })
  }
  
  // Priority 3: Growth scenarios (if no urgent issues)
  if (alertCount === 0 && runway >= 6) {
    actions.push({
      label: "Explore growth scenarios",
      href: "/dashboard/planning",
      icon: TrendingUp,
      variant: "outline" as const,
    })
  }
  
  // Always available actions
  actions.push(
    {
      label: "Plan a new expense",
      href: "/dashboard/planning",
      icon: Plus,
      variant: "outline" as const,
    },
    {
      label: "Review subscriptions",
      href: "/dashboard/planning",
      icon: CreditCard,
      variant: "outline" as const,
    }
  )

  return (
    <div className="border-t border-border pt-4 mt-6">
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon
          if (action.href) {
            return (
              <Link key={index} href={action.href}>
                <Button variant={action.variant} className="gap-2" onClick={() => onActionClick?.(action.label)}>
                  <Icon className="w-4 h-4" />
                  {action.label}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )
          }
          return (
            <Button
              key={index}
              variant={action.variant}
              className="gap-2"
              onClick={() => onActionClick?.(action.label)}
            >
              <Icon className="w-4 h-4" />
              {action.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
