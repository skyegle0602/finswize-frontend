"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Lightbulb, TrendingUp } from "lucide-react"
import { useState } from "react"

interface RevenueGrowthCalculatorProps {
  currentRevenue: number
  currentExpenses: number
  currentCash: number
}

export function RevenueGrowthCalculator({
  currentRevenue,
  currentExpenses,
  currentCash,
}: RevenueGrowthCalculatorProps) {
  const [growthRate, setGrowthRate] = useState([10])
  const [newExpenses, setNewExpenses] = useState([0])

  const newRevenue = currentRevenue * (1 + growthRate[0] / 100)
  const adjustedExpenses = currentExpenses + newExpenses[0]
  const newMonthlyProfit = newRevenue - adjustedExpenses
  const currentMonthlyProfit = currentRevenue - currentExpenses
  const profitChange = newMonthlyProfit - currentMonthlyProfit
  const newRunway = adjustedExpenses > 0 ? currentCash / adjustedExpenses : Infinity

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <CardTitle>Revenue Growth Scenario</CardTitle>
        </div>
        <CardDescription>What if your income grows by 10–30%?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-foreground">Revenue Growth</label>
            <span className="text-lg font-bold text-foreground">+{growthRate[0]}%</span>
          </div>
          <Slider value={growthRate} onValueChange={setGrowthRate} min={0} max={50} step={5} className="w-full" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-foreground">Additional Expenses</label>
            <span className="text-lg font-bold text-foreground">${newExpenses[0].toLocaleString()}</span>
          </div>
          <Slider value={newExpenses} onValueChange={setNewExpenses} min={0} max={2000} step={100} className="w-full" />
          <p className="text-xs text-muted-foreground mt-2">Optional: Account for hiring, marketing, etc.</p>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">New Monthly Revenue</span>
            <span className="text-xl font-bold text-foreground">${newRevenue.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">New Monthly Profit</span>
            <span className={`text-xl font-bold ${newMonthlyProfit > 0 ? "text-green-600" : "text-red-600"}`}>
              ${newMonthlyProfit.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Profit Change</span>
            <span className={`text-lg font-semibold ${profitChange > 0 ? "text-green-600" : "text-red-600"}`}>
              {profitChange >= 0 ? "+" : ""}${profitChange.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">New Runway</span>
            <span className="text-lg font-semibold text-foreground">
              {newRunway === Infinity ? "∞" : newRunway.toFixed(1)} months
            </span>
          </div>
        </div>

        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-900">
            <strong>Impact:</strong> {growthRate[0] > 0
              ? `Growing revenue by ${growthRate[0]}% increases your monthly profit by $${profitChange.toLocaleString()}, extending your runway to ${newRunway.toFixed(1)} months.`
              : "Adjust the sliders to see how revenue growth affects your finances."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
