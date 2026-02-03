"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface RunwayPreviewProps {
  currentCash: number
  monthlyExpenses: number
  monthlyRevenue: number
}

export function RunwayPreview({ currentCash, monthlyExpenses, monthlyRevenue }: RunwayPreviewProps) {
  const [revenueDrop, setRevenueDrop] = useState([100])

  // Calculate runway assuming revenue drops to X% of current
  const adjustedRevenue = (monthlyRevenue * revenueDrop[0]) / 100
  const monthlyBurn = monthlyExpenses - adjustedRevenue
  const runway = monthlyBurn > 0 ? currentCash / monthlyBurn : Infinity
  const isLowRunway = runway < 6

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Cash Runway</CardTitle>
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

        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Months of runway</span>
            <span className={`text-3xl font-bold ${runway < 3 ? "text-red-600" : runway < 6 ? "text-yellow-600" : "text-green-600"}`}>
              {runway === Infinity ? "∞" : runway.toFixed(1)}
            </span>
          </div>
          {isLowRunway && (
            <p className="text-xs text-yellow-600 mt-2">Runway below 6 months — consider action</p>
          )}
        </div>

        <Link href={`/dashboard/planning?scenario=runway&revenue=${revenueDrop[0]}`}>
          <Button variant="outline" className="w-full gap-2">
            Open scenario in Planning
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
