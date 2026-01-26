"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, CreditCard, Calendar, Crown } from "lucide-react"

interface PricingPlan {
  id: string
  name: string
  price: number
  billingPeriod: "monthly" | "annual"
  description: string
  features: string[]
  popular?: boolean
  current?: boolean
}

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const plans: PricingPlan[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      billingPeriod: "monthly",
      description: "Perfect for getting started with basic financial tracking",
      features: [
        "Basic budget tracking",
        "Up to 3 savings goals",
        "Monthly spending reports",
        "Email support",
        "Mobile app access",
      ],
      current: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: billingCycle === "monthly" ? 12 : 120,
      billingPeriod: billingCycle,
      description: "Advanced features for serious financial management",
      features: [
        "Everything in Free",
        "Unlimited savings goals",
        "AI-powered insights",
        "Real-time spending alerts",
        "Custom budget categories",
        "Priority support",
        "Export financial reports",
      ],
      popular: true,
    },
    {
      id: "business",
      name: "Business",
      price: billingCycle === "monthly" ? 29 : 290,
      billingPeriod: billingCycle,
      description: "Complete solution for small businesses and teams",
      features: [
        "Everything in Pro",
        "Multi-user access (up to 5)",
        "Advanced tax planning",
        "Invoice tracking",
        "Expense categorization",
        "Dedicated account manager",
        "API access",
        "Custom integrations",
      ],
    },
  ]

  const currentPlan = plans.find((plan) => plan.current)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Subscription & Billing</h1>
        <p className="text-muted-foreground">Manage your plan and billing information</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Current Plan: {currentPlan?.name}
              </CardTitle>
              <CardDescription className="mt-2">
                {currentPlan?.name === "Free"
                  ? "You're on the free plan. Upgrade to unlock more features!"
                  : `Your ${currentPlan?.name} plan renews on March 15, 2025`}
              </CardDescription>
            </div>
            {currentPlan?.name !== "Free" && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Active
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Monthly Cost</p>
              <p className="text-2xl font-bold text-foreground">
                ${currentPlan?.price || 0}
                <span className="text-sm font-normal text-muted-foreground">/month</span>
              </p>
            </div>
            {currentPlan?.name !== "Free" && (
              <div className="flex gap-2">
                <Button variant="outline" className="bg-transparent">
                  Manage Billing
                </Button>
                <Button variant="ghost">Cancel Plan</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span
          className={`text-sm ${billingCycle === "monthly" ? "font-semibold text-foreground" : "text-muted-foreground"}`}
        >
          Monthly
        </span>
        <button
          onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            billingCycle === "annual" ? "bg-primary" : "bg-muted"
          }`}
        >
          <span
            className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
              billingCycle === "annual" ? "translate-x-7" : ""
            }`}
          />
        </button>
        <span
          className={`text-sm ${billingCycle === "annual" ? "font-semibold text-foreground" : "text-muted-foreground"}`}
        >
          Annual
        </span>
        {billingCycle === "annual" && <Badge className="bg-accent text-accent-foreground">Save 17%</Badge>}
      </div>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular ? "border-primary shadow-lg scale-105" : ""
            } ${plan.current ? "border-accent" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
            )}
            {plan.current && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-accent text-accent-foreground">Current Plan</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription className="min-h-12">{plan.description}</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.billingPeriod === "monthly" ? "month" : "year"}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.current ? (
                <Button variant="outline" className="w-full bg-transparent" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  {plan.name === "Free" ? "Downgrade" : "Upgrade to " + plan.name}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Method & Billing History */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
            <CardDescription>Manage your payment information</CardDescription>
          </CardHeader>
          <CardContent>
            {currentPlan?.name === "Free" ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground mb-4">No payment method on file</p>
                <Button variant="outline" className="bg-transparent">
                  Add Payment Method
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2026</p>
                  </div>
                  <Badge variant="secondary">Default</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Update Card
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Add New Card
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Billing History
            </CardTitle>
            <CardDescription>View your past invoices</CardDescription>
          </CardHeader>
          <CardContent>
            {currentPlan?.name === "Free" ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">No billing history yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {[
                  { date: "Feb 15, 2025", amount: "$12.00", status: "Paid" },
                  { date: "Jan 15, 2025", amount: "$12.00", status: "Paid" },
                  { date: "Dec 15, 2024", amount: "$12.00", status: "Paid" },
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{invoice.amount}</p>
                      <p className="text-xs text-muted-foreground">{invoice.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                        {invoice.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full bg-transparent">
                  View All Invoices
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Feature Comparison</CardTitle>
          <CardDescription>See what's included in each plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground">Feature</th>
                  <th className="text-center py-3 px-4 font-medium text-foreground">Free</th>
                  <th className="text-center py-3 px-4 font-medium text-foreground">Pro</th>
                  <th className="text-center py-3 px-4 font-medium text-foreground">Business</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Budget Tracking", free: true, pro: true, business: true },
                  { feature: "Savings Goals", free: "3", pro: "Unlimited", business: "Unlimited" },
                  { feature: "AI Insights", free: false, pro: true, business: true },
                  { feature: "Spending Alerts", free: false, pro: true, business: true },
                  { feature: "Multi-user Access", free: false, pro: false, business: true },
                  { feature: "Tax Planning", free: false, pro: false, business: true },
                  { feature: "API Access", free: false, pro: false, business: true },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 px-4 text-sm text-foreground">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="w-5 h-5 text-accent mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )
                      ) : (
                        <span className="text-sm text-foreground">{row.free}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.pro === "boolean" ? (
                        row.pro ? (
                          <Check className="w-5 h-5 text-accent mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )
                      ) : (
                        <span className="text-sm text-foreground">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {typeof row.business === "boolean" ? (
                        row.business ? (
                          <Check className="w-5 h-5 text-accent mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )
                      ) : (
                        <span className="text-sm text-foreground">{row.business}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
