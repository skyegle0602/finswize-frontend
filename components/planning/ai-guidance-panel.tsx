"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Sparkles } from "lucide-react"

interface AIGuidancePanelProps {
  insights: string[]
  actions?: Array<{
    label: string
    onClick: () => void
  }>
}

export function AIGuidancePanel({ insights, actions }: AIGuidancePanelProps) {
  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <CardTitle>AI Guidance</CardTitle>
        </div>
        <CardDescription>Personalized recommendations based on your plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex gap-3">
            <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-sm text-foreground leading-relaxed">{insight}</p>
          </div>
        ))}

        {actions && actions.length > 0 && (
          <div className="pt-4 border-t border-border space-y-2">
            {actions.map((action, index) => (
              <Button key={index} variant="outline" size="sm" onClick={action.onClick} className="w-full justify-start">
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
