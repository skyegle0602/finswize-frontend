"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Lightbulb } from "lucide-react"
import { useState } from "react"

interface CashRunwayCalculatorProps {
  currentCash: number
  monthlyExpenses: number
  monthlyRevenue?: number
}

export function CashRunwayCalculator({ currentCash, monthlyExpenses, monthlyRevenue = 0 }: CashRunwayCalculatorProps) {
  const [revenueDrop, setRevenueDrop] = useState([100])

  // Calculate runway assuming revenue drops to X% of current
  const adjustedRevenue = (monthlyRevenue * revenueDrop[0]) / 100
  const monthlyBurn = monthlyExpenses - adjustedRevenue
  const runway = monthlyBurn > 0 ? currentCash / monthlyBurn : Infinity
  const breakEvenPoint = monthlyExpenses

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <CardTitle>Cash Runway</CardTitle>
        </div>
        <CardDescription>How long can you survive if revenue drops?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-foreground">Assume revenue drops to</label>
            <span className="text-lg font-bold text-foreground">{revenueDrop[0]}%</span>
          </div>
          <Slider value={revenueDrop} onValueChange={setRevenueDrop} min={0} max={100} step={5} className="w-full" />
        </div>

        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Months of runway</span>
            <span className={`text-2xl font-bold ${runway < 3 ? "text-red-600" : runway < 6 ? "text-yellow-600" : "text-green-600"}`}>
              {runway === Infinity ? "∞" : runway.toFixed(1)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly burn rate</span>
            <span className="text-lg font-semibold text-foreground">
              ${monthlyBurn > 0 ? monthlyBurn.toLocaleString() : "0"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Break-even revenue needed</span>
            <span className="text-lg font-semibold text-foreground">${breakEvenPoint.toLocaleString()}</span>
          </div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>At your current pace:</strong> {revenueDrop[0] < 50
              ? `If revenue drops to ${revenueDrop[0]}%, you have ${runway.toFixed(1)} months before running out of cash. Consider reducing expenses by $${Math.abs(monthlyBurn - monthlyExpenses * 0.8).toFixed(0)} to extend runway.`
              : `With revenue at ${revenueDrop[0]}% of current, your runway is ${runway.toFixed(1)} months.`}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
