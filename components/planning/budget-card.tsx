"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface BudgetCardProps {
  category: string
  currentLimit: number
  avgSpend: number
  trend: number // percentage change
  onBudgetChange: (newBudget: number) => void
  impact?: {
    monthlyProfit: number
    runway: number
    risk: "low" | "moderate" | "high"
  }
}

export function BudgetCard({
  category,
  currentLimit,
  avgSpend,
  trend,
  onBudgetChange,
  impact,
}: BudgetCardProps) {
  const [newBudget, setNewBudget] = useState(currentLimit)
  const isIncreasing = trend > 0
  const TrendIcon = isIncreasing ? TrendingUp : TrendingDown

  const handleSliderChange = (value: number[]) => {
    const newValue = value[0]
    setNewBudget(newValue)
    onBudgetChange(newValue)
  }

  // Calculate impact for the current slider value
  const calculateImpact = (budgetValue: number) => {
    // This is a simplified calculation - in production, this would come from props or context
    const delta = budgetValue - currentLimit
    const baseRevenue = 5200
    const baseExpenses = 3840
    const baseCash = 12450
    const baseTaxRate = 0.25
    
    const newMonthlyExpenses = baseExpenses + delta
    const newMonthlyProfit = baseRevenue - newMonthlyExpenses - (baseRevenue * baseTaxRate) / 12
    const newRunway = baseCash / (newMonthlyExpenses + (baseRevenue * baseTaxRate) / 12 - baseRevenue)

    let risk: "low" | "moderate" | "high" = "low"
    if (newRunway < 3) risk = "high"
    else if (newRunway < 6) risk = "moderate"

    return {
      monthlyProfit: newMonthlyProfit,
      runway: newRunway,
      risk,
    }
  }

  const currentImpact = calculateImpact(newBudget)

  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "high":
        return "text-red-600"
      case "moderate":
        return "text-yellow-600"
      default:
        return "text-green-600"
    }
  }

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>{category} Budget</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Current limit</span>
            <span className="font-medium text-foreground">${currentLimit.toLocaleString()} / month</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Avg spend (last 3 months)</span>
            <div className="flex items-center gap-1">
              <span className="font-medium text-foreground">${avgSpend.toLocaleString()}</span>
              <span className={`flex items-center gap-1 ${isIncreasing ? "text-red-600" : "text-green-600"}`}>
                <TrendIcon className="w-3 h-3" />
                <span>{Math.abs(trend)}%</span>
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-foreground">New budget</label>
            <span className="text-lg font-bold text-foreground">${newBudget.toLocaleString()}</span>
          </div>
          <Slider
            value={[newBudget]}
            onValueChange={handleSliderChange}
            min={Math.max(0, currentLimit * 0.5)}
            max={currentLimit * 2}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>${Math.max(0, currentLimit * 0.5).toLocaleString()}</span>
            <span>${(currentLimit * 2).toLocaleString()}</span>
          </div>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg space-y-2">
          <p className="text-xs font-medium text-foreground mb-2">Impact Preview</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Monthly profit</span>
            <span className="font-medium text-foreground">
              ${currentImpact.monthlyProfit >= 0 ? "+" : ""}
              {currentImpact.monthlyProfit.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Runway</span>
            <span className="font-medium text-foreground">{currentImpact.runway.toFixed(1)} months</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Risk</span>
            <span className={`flex items-center gap-1 font-medium ${getRiskColor(currentImpact.risk)}`}>
              {currentImpact.risk === "high" && <AlertTriangle className="w-3 h-3" />}
              {currentImpact.risk.charAt(0).toUpperCase() + currentImpact.risk.slice(1)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
