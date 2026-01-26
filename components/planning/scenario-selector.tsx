"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Lock } from "lucide-react"
import { useState } from "react"

interface Scenario {
  id: string
  name: string
  isCurrent: boolean
  isLocked?: boolean
}

interface ScenarioSelectorProps {
  scenarios: Scenario[]
  onSelectScenario: (id: string) => void
  onCreateNew: () => void
}

export function ScenarioSelector({ scenarios, onSelectScenario, onCreateNew }: ScenarioSelectorProps) {
  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Scenarios</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {scenarios.map((scenario) => (
          <Button
            key={scenario.id}
            variant={scenario.isCurrent ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => !scenario.isLocked && onSelectScenario(scenario.id)}
            disabled={scenario.isLocked}
          >
            {scenario.isLocked && <Lock className="w-4 h-4 mr-2" />}
            {scenario.name}
          </Button>
        ))}
        <Button variant="outline" className="w-full justify-start gap-2" onClick={onCreateNew}>
          <Plus className="w-4 h-4" />
          Create new scenario
        </Button>
      </CardContent>
    </Card>
  )
}
