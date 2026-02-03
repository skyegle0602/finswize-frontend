"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

interface MonthlyProfitCardProps {
  monthlyIncome: number
  monthlyExpenses: number
  estimatedTaxes: number
  previousMonthProfit?: number
}

export function MonthlyProfitCard({
  monthlyIncome,
  monthlyExpenses,
  estimatedTaxes,
  previousMonthProfit,
}: MonthlyProfitCardProps) {
  const netProfit = monthlyIncome - monthlyExpenses - estimatedTaxes
  const profitMargin = monthlyIncome > 0 ? (netProfit / monthlyIncome) * 100 : 0
  const profitChange = previousMonthProfit !== undefined ? netProfit - previousMonthProfit : 0
  const isNegative = netProfit < 0

  return (
    <Link href="/dashboard/planning?view=profit&month=current">
      <Card className={`rounded-xl border cursor-pointer hover:border-primary/50 transition-colors ${isNegative ? "border-red-200 bg-red-50/30" : ""}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className={`text-3xl font-bold ${isNegative ? "text-red-600" : "text-foreground"}`}>
                {netProfit >= 0 ? "+" : ""}${netProfit.toLocaleString()}
              </div>
              {previousMonthProfit !== undefined && profitChange !== 0 && (
                <div className={`flex items-center gap-1 text-sm ${profitChange > 0 ? "text-green-600" : "text-red-600"}`}>
                  {profitChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{profitChange >= 0 ? "+" : ""}${Math.abs(profitChange).toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Profit margin</span>
              <span className={`font-semibold ${isNegative ? "text-red-600" : "text-foreground"}`}>
                {profitMargin.toFixed(1)}%
              </span>
            </div>
            {isNegative && (
              <p className="text-xs text-red-600 mt-2">Expenses exceed revenue this month</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
