"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Lightbulb, ArrowRight } from "lucide-react"
import Link from "next/link"
import { CashBalanceCard } from "@/components/overview/cash-balance-card"
import { MonthlyProfitCard } from "@/components/overview/monthly-profit-card"
import { RunwayPreview } from "@/components/overview/runway-preview"
import { AIInsightCard } from "@/components/overview/ai-insight-card"
import { AlertCard } from "@/components/overview/alert-card"

export default function DashboardPage() {
  // Mock data - in production, this would come from your backend
  const currentCash = 12450
  const monthlyRevenue = 5200
  const monthlyExpenses = 3840
  const estimatedTaxes = 520
  const previousMonthProfit = 1200 // Mock previous month profit
  const lastUpdated = "2 hours ago"

  // Mock alerts - in production, fetch from /alerts/active?limit=3
  const alerts = [
    {
      id: "1",
      type: "budget" as const,
      severity: "red" as const,
      title: "Budget Exceeded",
      description: "Marketing budget is at 92% with 5 days remaining",
      actionHref: "/dashboard/alerts?resolve=budget",
      actionLabel: "Adjust Budget",
    },
    {
      id: "2",
      type: "runway" as const,
      severity: "yellow" as const,
      title: "Low Cash Warning",
      description: "Runway below 6 months. Consider reducing expenses.",
      actionHref: "/dashboard/planning?scenario=cost-reduction",
      actionLabel: "Plan Cost Reduction",
    },
    {
      id: "3",
      type: "tax" as const,
      severity: "blue" as const,
      title: "Tax Reserve",
      description: "Q1 tax payment due in 12 days. $2,400 recommended.",
      actionHref: "/dashboard/planning?scenario=tax-reserve",
      actionLabel: "Create Tax Plan",
    },
  ]

  const handleRefreshCash = async () => {
    // TODO: Call /summary/cash API
    console.log("Refreshing cash balance...")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Overview</h1>
          <p className="text-muted-foreground">How am I doing right now?</p>
        </div>

        {/* Financial Health Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CashBalanceCard balance={currentCash} lastUpdated={lastUpdated} onRefresh={handleRefreshCash} />

          <MonthlyProfitCard
            monthlyIncome={monthlyRevenue}
            monthlyExpenses={monthlyExpenses}
            estimatedTaxes={estimatedTaxes}
            previousMonthProfit={previousMonthProfit}
          />

          <RunwayPreview
            currentCash={currentCash}
            monthlyExpenses={monthlyExpenses}
            monthlyRevenue={monthlyRevenue}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Primary AI Insight - Only 1 insight */}
          <div className="lg:col-span-2">
            <AIInsightCard
              title="Marketing spend is trending up"
              description="Your marketing expenses increased 15% this month. Based on your current revenue, this pace is sustainable, but consider reviewing ROI on recent campaigns."
              dataSource="Marketing transactions from Jan 1–24"
              timeBounded="This month"
              viewDetailsHref="/dashboard/spending?category=marketing&period=month"
              adjustBudgetHref="/dashboard/planning?prefill=marketing-budget"
            />
          </div>

          {/* Upcoming Risks - Max 3 alerts, severity ordered */}
          <Card className="rounded-xl border">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <CardTitle>Upcoming Risks</CardTitle>
              </div>
              <CardDescription>Alerts that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertCard alerts={alerts} />
            </CardContent>
          </Card>
        </div>

        {/* CTA: Connect Overview → AI Advisor → Planning */}
        <Card className="rounded-xl border bg-muted/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-1">What should I focus on this month?</h3>
                <p className="text-sm text-muted-foreground">Get personalized guidance based on your current financial situation</p>
              </div>
              <Link href="/dashboard/advice?context=overview">
                <Button className="gap-2">
                  Ask AI Advisor
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
