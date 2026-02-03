"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface MonthlyProfitCalculatorProps {
  monthlyIncome: number
  monthlyExpenses: number
  estimatedTaxes?: number
}

export function MonthlyProfitCalculator({
  monthlyIncome,
  monthlyExpenses,
  estimatedTaxes = 0,
}: MonthlyProfitCalculatorProps) {
  const netProfit = monthlyIncome - monthlyExpenses - estimatedTaxes
  const profitMargin = monthlyIncome > 0 ? (netProfit / monthlyIncome) * 100 : 0

  const getProfitState = () => {
    if (profitMargin > 20) return { color: "text-green-600", icon: TrendingUp, label: "Healthy" }
    if (profitMargin > 0) return { color: "text-yellow-600", icon: TrendingUp, label: "Positive" }
    return { color: "text-red-600", icon: TrendingDown, label: "Negative" }
  }

  const state = getProfitState()
  const StateIcon = state.icon

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Monthly Profit</CardTitle>
        <CardDescription>Am I actually making money?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
              <p className={`text-3xl font-bold ${state.color}`}>
                {netProfit >= 0 ? "+" : ""}${netProfit.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StateIcon className={`w-6 h-6 ${state.color}`} />
              <span className={`text-sm font-medium ${state.color}`}>{state.label}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Profit Margin</p>
              <p className={`text-xl font-bold ${state.color}`}>{profitMargin.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">After Taxes</p>
              <p className="text-xl font-bold text-foreground">${netProfit.toLocaleString()}</p>
            </div>
          </div>

          {profitMargin < 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900">
                <strong>Action needed:</strong> You're spending more than you earn. Review expenses or increase revenue to reach profitability.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
