"use client"

import { useState } from "react"
import { SettingsSidebar, type SettingsTab } from "@/components/settings/settings-sidebar"
import { AccountTab } from "@/components/settings/account-tab"
import { SecurityTab } from "@/components/settings/security-tab"
import { FinancialProfileTab } from "@/components/settings/financial-profile-tab"
import { ConnectedAccountsTab } from "@/components/settings/connected-accounts-tab"
import { NotificationsTab } from "@/components/settings/notifications-tab"
import { BillingTab } from "@/components/settings/billing-tab"
import { DataPrivacyTab } from "@/components/settings/data-privacy-tab"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account")
  const [formData, setFormData] = useState({
    fullName: "John Doe",
    businessName: "John's Freelance Services",
    email: "john@example.com",
    timezone: "America/New_York",
    currency: "USD",
  })

  const ActiveTabContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountTab formData={formData} setFormData={setFormData} />
      case "security":
        return <SecurityTab />
      case "profile":
        return <FinancialProfileTab />
      case "accounts":
        return <ConnectedAccountsTab />
      case "notifications":
        return <NotificationsTab />
      case "billing":
        return <BillingTab />
      case "privacy":
        return <DataPrivacyTab />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Account control and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="flex-1">
            <ActiveTabContent />
          </div>
        </div>
      </div>
    </div>
  )
}
