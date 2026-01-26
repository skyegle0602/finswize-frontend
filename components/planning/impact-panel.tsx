"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

interface ImpactPanelProps {
  runway: number
  monthlyProfit: number
  previousProfit: number
  riskWarnings: string[]
  aiSummary: string
}

export function ImpactPanel({ runway, monthlyProfit, previousProfit, riskWarnings, aiSummary }: ImpactPanelProps) {
  const profitChange = monthlyProfit - previousProfit
  const isProfitPositive = monthlyProfit > 0
  const isRunwayLow = runway < 3
  const isRunwayMedium = runway >= 3 && runway < 6

  return (
    <div className="space-y-6">
      {/* Cash Runway - Hero Metric */}
      <Card className="rounded-xl border">
        <CardHeader>
          <CardTitle>Cash Runway</CardTitle>
          <CardDescription>Months until cash runs out</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className={`text-5xl font-bold mb-2 ${isRunwayLow ? "text-red-600" : isRunwayMedium ? "text-yellow-600" : "text-green-600"}`}>
              {runway === Infinity ? "∞" : runway.toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground">months</p>
          </div>
          {/* Visual timeline */}
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full ${isRunwayLow ? "bg-red-600" : isRunwayMedium ? "bg-yellow-600" : "bg-green-600"}`}
              style={{ width: `${Math.min((runway / 12) * 100, 100)}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Profit - Before vs After */}
      <Card className="rounded-xl border">
        <CardHeader>
          <CardTitle>Monthly Profit</CardTitle>
          <CardDescription>Before vs after this plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">Previous</span>
              <span className="text-lg font-semibold text-foreground">${previousProfit.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <span className="text-sm text-muted-foreground">New</span>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${isProfitPositive ? "text-green-600" : "text-red-600"}`}>
                  ${monthlyProfit.toLocaleString()}
                </span>
                {profitChange !== 0 && (
                  <span className={`text-sm flex items-center gap-1 ${profitChange > 0 ? "text-green-600" : "text-red-600"}`}>
                    {profitChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {profitChange >= 0 ? "+" : ""}
                    {profitChange.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Signals */}
      {riskWarnings.length > 0 && (
        <Card className="rounded-xl border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <CardTitle>Risk Signals</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {riskWarnings.map((warning, index) => (
                <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-900">{warning}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Summary */}
      <Card className="rounded-xl border">
        <CardHeader>
          <CardTitle>AI Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">{aiSummary}</p>
        </CardContent>
      </Card>
    </div>
  )
}
