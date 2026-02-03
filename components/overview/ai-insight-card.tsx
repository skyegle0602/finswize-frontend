"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, ArrowRight } from "lucide-react"
import Link from "next/link"

interface AIInsightCardProps {
  title: string
  description: string
  dataSource: string
  timeBounded: string
  viewDetailsHref: string
  adjustBudgetHref: string
}

export function AIInsightCard({
  title,
  description,
  dataSource,
  timeBounded,
  viewDetailsHref,
  adjustBudgetHref,
}: AIInsightCardProps) {
  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <CardTitle>AI Insight</CardTitle>
        </div>
        <CardDescription>Your personalized financial recommendation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{description}</p>
            <div className="text-xs text-muted-foreground mb-1">
              <span className="font-medium">Based on:</span> {dataSource}
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Time period:</span> {timeBounded}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={viewDetailsHref}>
              <Button className="gap-2">
                View Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href={adjustBudgetHref}>
              <Button variant="outline">Adjust Budget</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
