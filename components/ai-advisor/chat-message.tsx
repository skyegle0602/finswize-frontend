"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, User } from "lucide-react"
import Link from "next/link"

interface ActionButton {
  label: string
  href?: string
  onClick?: () => void
  variant?: "default" | "outline"
}

interface ChatMessageProps {
  isAI: boolean
  message: string
  reason?: string
  actions?: ActionButton[]
  dataSource?: string
  suggestedNextStep?: string
}

export function ChatMessage({ isAI, message, reason, actions, dataSource, suggestedNextStep }: ChatMessageProps) {
  if (isAI) {
    return (
      <div className="flex gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 space-y-2">
          <Card className="rounded-xl border">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Answer - Bold */}
                <p className="font-semibold text-foreground leading-relaxed">{message}</p>
                {/* Reason - 1 line */}
                {reason && <p className="text-sm text-muted-foreground">{reason}</p>}
                {/* Actions */}
                {actions && actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    {actions.map((action, index) => {
                      if (action.href) {
                        return (
                          <Link key={index} href={action.href}>
                            <Button variant={action.variant || "outline"} size="sm">
                              {action.label}
                            </Button>
                          </Link>
                        )
                      }
                      return (
                        <Button key={index} variant={action.variant || "outline"} size="sm" onClick={action.onClick}>
                          {action.label}
                        </Button>
                      )
                    })}
                  </div>
                )}
                {/* Traceability hint */}
                {dataSource && (
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border italic">
                    {dataSource}
                  </p>
                )}
                {/* Suggested next step */}
                {suggestedNextStep && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span>👉</span>
                      <span className="font-medium">Suggested next step:</span>
                      <span>{suggestedNextStep}</span>
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 mb-4 justify-end">
      <div className="flex-1 max-w-[80%]">
        <Card className="rounded-xl border bg-muted/30">
          <CardContent className="p-4">
            <p className="text-foreground leading-relaxed">{message}</p>
          </CardContent>
        </Card>
      </div>
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
        <User className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  )
}
