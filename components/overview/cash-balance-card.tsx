"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface CashBalanceCardProps {
  balance: number
  lastUpdated?: string
  onRefresh?: () => void
}

export function CashBalanceCard({ balance, lastUpdated, onRefresh }: CashBalanceCardProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await onRefresh?.()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <Link href="/dashboard/spending?filter=last30days&type=cash">
      <Card className="rounded-xl border cursor-pointer hover:border-primary/50 transition-colors">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cash Balance</CardTitle>
            {onRefresh && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  handleRefresh()
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground mb-1">${balance.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Available now</p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-1">Updated {lastUpdated}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
