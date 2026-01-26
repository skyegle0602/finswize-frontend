"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Lightbulb, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface Subscription {
  id: string
  name: string
  amount: number
  frequency: "monthly" | "yearly"
  category: string
  isActive: boolean
  riskLevel?: "low" | "medium" | "high"
}

interface SubscriptionAnalyzerProps {
  monthlyRevenue: number
}

const mockSubscriptions: Subscription[] = [
  { id: "1", name: "Adobe Creative Cloud", amount: 52.99, frequency: "monthly", category: "Business Tools", isActive: true, riskLevel: "low" },
  { id: "2", name: "Slack Pro", amount: 8.75, frequency: "monthly", category: "Business Tools", isActive: true, riskLevel: "low" },
  { id: "3", name: "Netflix", amount: 15.99, frequency: "monthly", category: "Personal", isActive: true, riskLevel: "high" },
  { id: "4", name: "Gym Membership", amount: 49.99, frequency: "monthly", category: "Personal", isActive: true, riskLevel: "medium" },
  { id: "5", name: "Domain & Hosting", amount: 12.00, frequency: "monthly", category: "Business Tools", isActive: true, riskLevel: "low" },
]

export function SubscriptionAnalyzer({ monthlyRevenue }: SubscriptionAnalyzerProps) {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions)

  const activeSubscriptions = subscriptions.filter((s) => s.isActive)
  const monthlyTotal = activeSubscriptions.reduce((sum, s) => sum + s.amount, 0)
  const revenuePercentage = monthlyRevenue > 0 ? (monthlyTotal / monthlyRevenue) * 100 : 0
  const riskySubscriptions = activeSubscriptions.filter((s) => s.riskLevel === "high" || s.category === "Personal")

  const toggleSubscription = (id: string) => {
    setSubscriptions(subscriptions.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)))
  }

  const newTotal = subscriptions.filter((s) => s.isActive).reduce((sum, s) => sum + s.amount, 0)
  const savings = monthlyTotal - newTotal

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <CardTitle>Subscriptions & Fixed Costs</CardTitle>
        </div>
        <CardDescription>What recurring costs are dragging you down?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Fixed Costs</span>
            <span className="text-2xl font-bold text-foreground">${newTotal.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">% of Revenue</span>
            <span className={`text-lg font-semibold ${revenuePercentage > 20 ? "text-red-600" : "text-foreground"}`}>
              {revenuePercentage.toFixed(1)}%
            </span>
          </div>
          {savings > 0 && (
            <div className="mt-2 pt-2 border-t border-border">
              <p className="text-sm text-green-600 font-medium">Potential savings: ${savings.toLocaleString()}/month</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                subscription.riskLevel === "high" ? "bg-yellow-50 border-yellow-200" : "bg-card border-border"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{subscription.name}</p>
                  {subscription.riskLevel === "high" && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded">Risky</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  ${subscription.amount}/{subscription.frequency === "monthly" ? "mo" : "yr"} • {subscription.category}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">${subscription.amount}</span>
                <Switch checked={subscription.isActive} onCheckedChange={() => toggleSubscription(subscription.id)} />
              </div>
            </div>
          ))}
        </div>

        {riskySubscriptions.length > 0 && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-900">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              <strong>AI Suggestion:</strong> You have {riskySubscriptions.length} personal subscriptions costing $
              {riskySubscriptions.reduce((sum, s) => sum + s.amount, 0).toFixed(2)}/month. Consider canceling to improve
              your profit margin.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
