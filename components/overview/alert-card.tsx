"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Alert {
  id: string
  type: "budget" | "runway" | "tax" | "subscription"
  severity: "red" | "yellow" | "blue"
  title: string
  description: string
  actionHref: string
  actionLabel: string
}

interface AlertCardProps {
  alerts: Alert[]
}

export function AlertCard({ alerts }: AlertCardProps) {
  // Sort by severity: red → yellow → blue
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityOrder = { red: 0, yellow: 1, blue: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })

  // Max 3 alerts
  const displayAlerts = sortedAlerts.slice(0, 3)

  const getSeverityStyles = (severity: Alert["severity"]) => {
    switch (severity) {
      case "red":
        return "bg-red-50 border-red-200 text-red-900"
      case "yellow":
        return "bg-yellow-50 border-yellow-200 text-yellow-900"
      case "blue":
        return "bg-blue-50 border-blue-200 text-blue-900"
    }
  }

  const getSeverityDot = (severity: Alert["severity"]) => {
    switch (severity) {
      case "red":
        return "bg-red-600"
      case "yellow":
        return "bg-yellow-600"
      case "blue":
        return "bg-blue-600"
    }
  }

  return (
    <div className="space-y-4">
      {displayAlerts.map((alert) => (
        <div key={alert.id} className={`p-4 border rounded-lg ${getSeverityStyles(alert.severity)}`}>
          <div className="flex items-start gap-3">
            <div className={`w-2 h-2 ${getSeverityDot(alert.severity)} rounded-full mt-1.5 shrink-0`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1">{alert.title}</p>
              <p className="text-xs leading-relaxed mb-2 opacity-90">{alert.description}</p>
              <Link href={alert.actionHref}>
                <Button variant="outline" size="sm" className="w-full">
                  {alert.actionLabel}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {alerts.length > 3 && (
        <Link href="/dashboard/alerts">
          <Button variant="ghost" size="sm" className="w-full">
            View All Alerts ({alerts.length})
          </Button>
        </Link>
      )}
    </div>
  )
}
