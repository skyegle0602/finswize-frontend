"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CurrentSituationSummaryProps {
  monthlySurplus: number
  runway: number
  monthlyExpenses: number
}

export function CurrentSituationSummary({
  monthlySurplus,
  runway,
  monthlyExpenses,
}: CurrentSituationSummaryProps) {
  return (
    <Card className="rounded-xl border bg-muted/30">
      <CardHeader>
        <CardTitle>Current Situation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Monthly Surplus (estimated)</p>
            <p className={`text-lg font-bold ${monthlySurplus >= 0 ? "text-green-600" : "text-red-600"}`}>
              {monthlySurplus >= 0 ? "+" : ""}${Math.round(monthlySurplus).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Runway (based on current spending)</p>
            <p className="text-lg font-bold text-foreground">
              {runway === Infinity ? "∞" : Math.round(runway)} months
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Monthly Expenses</p>
            <p className="text-lg font-bold text-foreground">${Math.round(monthlyExpenses).toLocaleString()}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
          Based on manually recorded transactions
        </p>
      </CardContent>
    </Card>
  )
}
