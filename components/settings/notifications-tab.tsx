"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export function NotificationsTab() {
  const [budgetAlerts, setBudgetAlerts] = useState(true)
  const [largeTransactions, setLargeTransactions] = useState(true)
  const [lowBalance, setLowBalance] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(true)
  const [emailDelivery, setEmailDelivery] = useState(true)
  const [inAppDelivery, setInAppDelivery] = useState(true)

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Control how and when you receive alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-foreground mb-4">Alert Categories</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Budget Alerts</p>
                <p className="text-sm text-muted-foreground">When you exceed budget limits</p>
              </div>
              <Switch checked={budgetAlerts} onCheckedChange={setBudgetAlerts} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Large Transactions</p>
                <p className="text-sm text-muted-foreground">Transactions above your threshold</p>
              </div>
              <Switch checked={largeTransactions} onCheckedChange={setLargeTransactions} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Low Balance</p>
                <p className="text-sm text-muted-foreground">When balance drops below set amount</p>
              </div>
              <Switch checked={lowBalance} onCheckedChange={setLowBalance} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Weekly Summary</p>
                <p className="text-sm text-muted-foreground">Financial overview every Monday</p>
              </div>
              <Switch checked={weeklySummary} onCheckedChange={setWeeklySummary} />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground mb-4">Delivery Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">In-App</p>
                <p className="text-sm text-muted-foreground">Notifications in FinsWize</p>
              </div>
              <Switch checked={inAppDelivery} onCheckedChange={setInAppDelivery} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">Delivered to your email address</p>
              </div>
              <Switch checked={emailDelivery} onCheckedChange={setEmailDelivery} />
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            Turning off alerts may cause you to miss important financial events. We recommend keeping critical alerts enabled.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
