"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { toast } from "sonner"

interface AdjustGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal: {
    id: string
    name: string
    targetAmount: number
    savedAmount: number
    monthlyContribution: number
    targetDate?: string
  }
  onSave: (updatedGoal: {
    id: string
    monthlyContribution: number
    targetDate?: string
  }) => Promise<void>
}

type GoalHealth = "on-track" | "behind" | "aggressive"

export function AdjustGoalModal({
  open,
  onOpenChange,
  goal,
  onSave,
}: AdjustGoalModalProps) {
  const [monthlyContribution, setMonthlyContribution] = useState(
    goal.monthlyContribution.toString()
  )
  const [targetDate, setTargetDate] = useState(
    goal.targetDate || ""
  )
  const [isSaving, setIsSaving] = useState(false)

  // Reset form when goal changes or modal opens
  useEffect(() => {
    if (open) {
      setMonthlyContribution(goal.monthlyContribution.toString())
      setTargetDate(goal.targetDate || "")
    }
  }, [open, goal])

  // Calculate timeline and health
  const calculateGoalMetrics = () => {
    const monthly = parseFloat(monthlyContribution) || 0
    const remaining = goal.targetAmount - goal.savedAmount
    const monthsNeeded = monthly > 0 ? Math.ceil(remaining / monthly) : Infinity

    // Calculate projected completion date
    const today = new Date()
    const projectedDate = new Date(today)
    projectedDate.setMonth(projectedDate.getMonth() + monthsNeeded)

    // Calculate goal health
    let health: GoalHealth = "on-track"
    if (goal.targetDate) {
      const targetDateObj = new Date(goal.targetDate)
      const monthsUntilTarget = Math.ceil(
        (targetDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)
      )

      if (monthsNeeded > monthsUntilTarget) {
        health = "behind" // Need more time than available
      } else if (monthsNeeded < monthsUntilTarget * 0.7) {
        health = "aggressive" // Much faster than target
      } else {
        health = "on-track"
      }
    } else {
      // No target date - consider aggressive if saving too fast
      if (monthsNeeded < 6) {
        health = "aggressive"
      } else {
        health = "on-track"
      }
    }

    return {
      remaining,
      monthsNeeded,
      projectedDate,
      health,
    }
  }

  const metrics = calculateGoalMetrics()

  const handleSave = async () => {
    const monthly = parseFloat(monthlyContribution)
    if (isNaN(monthly) || monthly <= 0) {
      toast.error("Monthly contribution must be greater than 0")
      return
    }

    try {
      setIsSaving(true)
      await onSave({
        id: goal.id,
        monthlyContribution: monthly,
        targetDate: targetDate || undefined,
      })
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in parent (toast notification)
      // Don't close modal on error so user can retry
    } finally {
      setIsSaving(false)
    }
  }

  const getHealthColor = (health: GoalHealth) => {
    switch (health) {
      case "on-track":
        return "text-green-600"
      case "behind":
        return "text-red-600"
      case "aggressive":
        return "text-yellow-600"
    }
  }

  const getHealthLabel = (health: GoalHealth) => {
    switch (health) {
      case "on-track":
        return "On track"
      case "behind":
        return "Behind schedule"
      case "aggressive":
        return "Aggressive"
    }
  }

  const getHealthIcon = (health: GoalHealth) => {
    switch (health) {
      case "on-track":
        return <CheckCircle2 className="w-4 h-4" />
      case "behind":
        return <AlertCircle className="w-4 h-4" />
      case "aggressive":
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adjust Goal: {goal.name}</DialogTitle>
          <DialogDescription>
            Update your monthly contribution and target date. We'll recalculate your timeline automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Status (Read-only) */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <h4 className="text-sm font-medium text-foreground">Current Status</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Target amount</span>
                <p className="font-medium text-foreground">
                  ${goal.targetAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Saved so far</span>
                <p className="font-medium text-foreground">
                  ${goal.savedAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-contribution">Monthly contribution</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">$</span>
                <Input
                  id="monthly-contribution"
                  type="text"
                  inputMode="decimal"
                  value={monthlyContribution}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setMonthlyContribution(value)
                    }
                  }}
                  className="text-lg font-semibold"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-date">Target date (optional)</Label>
              <Input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          {/* Calculated Metrics */}
          <div className="space-y-3 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="text-sm font-medium text-foreground">Projected Timeline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Remaining amount</span>
                <span className="font-medium text-foreground">
                  ${metrics.remaining.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Months needed</span>
                <span className="font-medium text-foreground">
                  {metrics.monthsNeeded === Infinity ? "∞" : metrics.monthsNeeded} months
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Projected completion</span>
                <span className="font-medium text-foreground">
                  {metrics.monthsNeeded === Infinity
                    ? "Never"
                    : metrics.projectedDate.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-blue-200 dark:border-blue-800">
                <span className="text-muted-foreground">Goal health</span>
                <span
                  className={`flex items-center gap-1 font-medium ${getHealthColor(metrics.health)}`}
                >
                  {getHealthIcon(metrics.health)}
                  {getHealthLabel(metrics.health)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
