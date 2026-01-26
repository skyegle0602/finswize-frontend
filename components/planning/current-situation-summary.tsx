"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CurrentSituationSummaryProps {
  cashBalance: number
  monthlyProfit: number
  runway: number
  monthlyRevenue: number
  monthlyExpenses: number
}

export function CurrentSituationSummary({
  cashBalance,
  monthlyProfit,
  runway,
  monthlyRevenue,
  monthlyExpenses,
}: CurrentSituationSummaryProps) {
  return (
    <Card className="rounded-xl border bg-muted/30">
      <CardHeader>
        <CardTitle>Current Situation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Cash Balance</p>
            <p className="text-lg font-bold text-foreground">${cashBalance.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Monthly Profit</p>
            <p className={`text-lg font-bold ${monthlyProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {monthlyProfit >= 0 ? "+" : ""}${monthlyProfit.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Runway</p>
            <p className="text-lg font-bold text-foreground">{runway.toFixed(1)} months</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Monthly Expenses</p>
            <p className="text-lg font-bold text-foreground">${monthlyExpenses.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
