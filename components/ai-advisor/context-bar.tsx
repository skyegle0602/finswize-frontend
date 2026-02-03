"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"

interface ContextBarProps {
  lastSynced: string
  cashBalance: number
  runway: number
  alertCount: number
}

export function ContextBar({ lastSynced, cashBalance, runway, alertCount }: ContextBarProps) {
  return (
    <Card className="rounded-xl border mb-6">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Based on your data as of</span>
            <span className="font-medium text-foreground">{lastSynced}</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-muted-foreground">Cash:</span>
              <span className="font-medium text-foreground ml-1">${cashBalance.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Runway:</span>
              <span className="font-medium text-foreground ml-1">{runway.toFixed(1)} months</span>
            </div>
            {alertCount > 0 && (
              <Link href="/dashboard/alerts" className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">{alertCount} alert{alertCount > 1 ? "s" : ""} need attention</span>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
