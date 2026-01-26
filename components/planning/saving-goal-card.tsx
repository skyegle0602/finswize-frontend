"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Pause, MoreVertical } from "lucide-react"
import { useState } from "react"

interface SavingGoalCardProps {
  id: string
  name: string
  targetAmount: number
  savedAmount: number
  monthlyContribution: number
  targetDate?: string
  isPaused?: boolean
  impact?: {
    freeCashReduction: number
    runwayImpact: number
  }
  onAdjust: () => void
  onPause: () => void
  onAskAI: () => void
}

export function SavingGoalCard({
  name,
  targetAmount,
  savedAmount,
  monthlyContribution,
  targetDate,
  isPaused = false,
  impact,
  onAdjust,
  onPause,
  onAskAI,
}: SavingGoalCardProps) {
  const progress = (savedAmount / targetAmount) * 100
  const isOnTrack = !isPaused && progress > 0

  return (
    <Card className={`rounded-xl border ${isPaused ? "opacity-60" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{name}</CardTitle>
          {isPaused && (
            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded">Paused</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Target</span>
            <span className="font-medium text-foreground">${targetAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Saved</span>
            <span className="font-medium text-foreground">
              ${savedAmount.toLocaleString()} ({progress.toFixed(0)}%)
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Monthly contribution</span>
            <span className="font-medium text-foreground">${monthlyContribution.toLocaleString()}</span>
          </div>
          {targetDate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Target date</span>
              <span className="font-medium text-foreground">{targetDate}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">On track:</span>
            {isOnTrack ? (
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                Yes
              </span>
            ) : (
              <span className="text-muted-foreground">No</span>
            )}
          </div>
        </div>

        {impact && (
          <div className="p-3 bg-muted/30 rounded-lg space-y-1">
            <p className="text-xs font-medium text-foreground mb-2">Impact</p>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Reduces free cash by</span>
              <span className="font-medium text-foreground">${impact.freeCashReduction.toLocaleString()} / month</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Runway impact</span>
              <span className="font-medium text-foreground">
                {impact.runwayImpact >= 0 ? "+" : ""}
                {impact.runwayImpact.toFixed(1)} months
              </span>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={onAdjust} className="flex-1">
            Adjust
          </Button>
          <Button variant="outline" size="sm" onClick={onPause} className="flex-1">
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button variant="outline" size="sm" onClick={onAskAI}>
            Ask AI
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
