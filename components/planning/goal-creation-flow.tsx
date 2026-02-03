"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface GoalCreationFlowProps {
  onCancel: () => void
  onSave: (goal: {
    name: string
    targetAmount: number
    targetDate?: string
    monthlyContribution: number
  }) => void
}

const goalTemplates = [
  { name: "Emergency Fund", defaultAmount: 10000, description: "3-6 months of expenses" },
  { name: "Tax Reserve", defaultAmount: 6000, description: "Quarterly tax payments" },
  { name: "Equipment / Tool Purchase", defaultAmount: 5000, description: "Business equipment" },
  { name: "Buffer for Low Months", defaultAmount: 3000, description: "Revenue fluctuation buffer" },
  { name: "Custom", defaultAmount: 0, description: "Define your own goal" },
]

export function GoalCreationFlow({ onCancel, onSave }: GoalCreationFlowProps) {
  const [step, setStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [goalName, setGoalName] = useState("")
  const [targetAmount, setTargetAmount] = useState(0)
  const [targetDate, setTargetDate] = useState("")
  const [monthlyContribution, setMonthlyContribution] = useState(0)

  const selectedTemplateData = goalTemplates.find((t) => t.name === selectedTemplate)

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template)
    const templateData = goalTemplates.find((t) => t.name === template)
    if (templateData) {
      setGoalName(templateData.name === "Custom" ? "" : templateData.name)
      setTargetAmount(templateData.defaultAmount)
    }
  }

  const calculateSuggestedContribution = () => {
    if (!targetDate || !targetAmount) return 0
    const months = Math.ceil(
      (new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
    )
    return months > 0 ? Math.ceil(targetAmount / months) : 0
  }

  const handleNext = () => {
    if (step === 1) {
      if (selectedTemplate && goalName && targetAmount > 0) {
        setStep(2)
        // Auto-suggest contribution if target date is set
        if (targetDate) {
          const suggested = calculateSuggestedContribution()
          if (suggested > 0) {
            setMonthlyContribution(suggested)
          }
        }
      }
    } else if (step === 2) {
      if (monthlyContribution > 0) {
        onSave({
          name: goalName,
          targetAmount,
          targetDate: targetDate || undefined,
          monthlyContribution,
        })
      }
    }
  }

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Create Saving Goal</CardTitle>
        <CardDescription>
          {step === 1 ? "Step 1: Define your goal" : "Step 2: Set contribution plan"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 ? (
          <>
            <div className="space-y-2">
              <Label>Goal Type</Label>
              <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a goal type" />
                </SelectTrigger>
                <SelectContent>
                  {goalTemplates.map((template) => (
                    <SelectItem key={template.name} value={template.name}>
                      {template.name} {template.description && `(${template.description})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Goal Name</Label>
              <Input
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g., Emergency Fund"
              />
            </div>

            <div className="space-y-2">
              <Label>Target Amount</Label>
              <Input
                type="number"
                value={targetAmount || ""}
                onChange={(e) => setTargetAmount(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label>Target Date (Optional)</Label>
              <Input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
              {targetDate && (
                <p className="text-xs text-muted-foreground">
                  Suggested: ${calculateSuggestedContribution().toLocaleString()}/month to reach target
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <p className="text-sm font-medium text-foreground">{goalName}</p>
              <p className="text-sm text-muted-foreground">Target: ${targetAmount.toLocaleString()}</p>
              {targetDate && <p className="text-sm text-muted-foreground">By: {targetDate}</p>}
            </div>

            <div className="space-y-2">
              <Label>Monthly Contribution</Label>
              <Input
                type="number"
                value={monthlyContribution || ""}
                onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
              <div className="flex gap-2 text-xs">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMonthlyContribution(Math.ceil(targetAmount * 0.1))}
                >
                  10% of target
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMonthlyContribution(Math.ceil(targetAmount / 12))}
                >
                  Equal over 12 months
                </Button>
              </div>
            </div>

            {targetDate && monthlyContribution > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  At ${monthlyContribution.toLocaleString()}/month, you'll reach your goal{" "}
                  {targetDate && new Date(targetDate) > new Date()
                    ? `by ${targetDate}`
                    : `in ${Math.ceil(targetAmount / monthlyContribution)} months`}
                  .
                </p>
              </div>
            )}
          </>
        )}

        <div className="flex gap-2 pt-4">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
          )}
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleNext} className="flex-1" disabled={step === 1 && (!selectedTemplate || !goalName || targetAmount <= 0)}>
            {step === 1 ? "Next" : "Create Goal"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
