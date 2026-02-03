"use client"

import { Card, CardContent } from "@/components/ui/card"
import { User, Shield, Wallet, Link2, Bell, CreditCard, Database } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export type SettingsTab = "account" | "security" | "profile" | "accounts" | "notifications" | "billing" | "privacy"

interface SettingsTabItem {
  id: SettingsTab
  label: string
  icon: LucideIcon
}

interface SettingsSidebarProps {
  activeTab: SettingsTab
  onTabChange: (tab: SettingsTab) => void
}

const settingsTabs: SettingsTabItem[] = [
  { id: "account", label: "Account", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "profile", label: "Financial Profile", icon: Wallet },
  { id: "accounts", label: "Connected Accounts", icon: Link2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "privacy", label: "Data & Privacy", icon: Database },
]

export function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div className="lg:w-64 shrink-0">
      <Card className="rounded-xl border">
        <CardContent className="p-2">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </CardContent>
      </Card>
    </div>
  )
}
