"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

interface BudgetCardProps {
  category: string
  currentLimit: number
  spentThisMonth: number
  onBudgetChange: (newBudget: number) => void
  impact?: {
    monthlySurplus: number
    runway: number
    risk: "low" | "medium" | "high"
  }
  isModified?: boolean
}

export function BudgetCard({
  category,
  currentLimit,
  spentThisMonth,
  onBudgetChange,
  impact,
  isModified = false,
}: BudgetCardProps) {
  const [newBudget, setNewBudget] = useState(currentLimit)
  const [inputValue, setInputValue] = useState(currentLimit.toString())
  const remaining = newBudget - spentThisMonth

  // Sync internal state when currentLimit changes from parent (e.g., after reset)
  useEffect(() => {
    setNewBudget(currentLimit)
    setInputValue(currentLimit.toString())
  }, [currentLimit])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Allow empty input while typing
    if (value === "") {
      setInputValue("")
      return
    }

    // Only allow numbers
    if (!/^\d*\.?\d*$/.test(value)) {
      return
    }

    setInputValue(value)
    const numValue = parseFloat(value)
    
    // Input is independent - allow any positive value for simulation
    if (!isNaN(numValue) && numValue >= 0) {
      setNewBudget(numValue)
      onBudgetChange(numValue)
    }
  }

  const handleInputBlur = () => {
    // On blur, ensure input has a valid value
    const numValue = parseFloat(inputValue)
    if (isNaN(numValue) || numValue < 0) {
      // Reset to current budget if invalid
      setInputValue(newBudget.toString())
      onBudgetChange(newBudget)
    } else {
      // Accept any valid positive value (no clamping for input)
      setNewBudget(numValue)
      setInputValue(numValue.toString())
      onBudgetChange(numValue)
    }
  }


  const getRiskColor = (risk?: string) => {
    switch (risk) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      default:
        return "text-green-600"
    }
  }

  const getRiskLabel = (risk?: string) => {
    switch (risk) {
      case "high":
        return "High"
      case "medium":
        return "Medium"
      default:
        return "Low"
    }
  }

  return (
    <Card className={`rounded-xl border ${isModified ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{category} Budget</CardTitle>
          {isModified && (
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium">
              Modified
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Spent this month</span>
            <span className="font-medium text-foreground">${Math.round(spentThisMonth).toLocaleString()}</span>
          </div>
        </div>

        <div>
          <label htmlFor={`budget-${category}`} className="text-sm font-medium text-foreground mb-3 block">
            Monthly limit
          </label>
          
          {/* Number Input - Primary Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">$</span>
            <Input
              id={`budget-${category}`}
              type="text"
              inputMode="decimal"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              className="text-lg font-semibold h-10"
              placeholder="0"
            />
          </div>
        </div>

        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Remaining budget this month</span>
            <span className={`font-medium ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${Math.round(remaining).toLocaleString()}
            </span>
          </div>
        </div>

        {impact && (
          <div className="p-4 bg-muted/30 rounded-lg space-y-2">
            <p className="text-xs font-medium text-foreground mb-2">Impact Preview</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated monthly surplus</span>
              <span className="font-medium text-foreground">
                {impact.monthlySurplus >= 0 ? "+" : ""}${Math.round(impact.monthlySurplus).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated runway</span>
              <span className="font-medium text-foreground">
                {impact.runway === Infinity ? "∞" : Math.round(impact.runway)} months
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Risk level</span>
              <span className={`flex items-center gap-1 font-medium ${getRiskColor(impact.risk)}`}>
                {impact.risk === "high" && <AlertTriangle className="w-3 h-3" />}
                {getRiskLabel(impact.risk)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
