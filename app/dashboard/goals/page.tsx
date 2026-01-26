"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Plus, Target, Calendar, TrendingUp, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  color: string
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      targetAmount: 10000,
      currentAmount: 6800,
      deadline: "2025-12-31",
      category: "emergency",
      color: "bg-chart-1",
    },
    {
      id: "2",
      name: "New Equipment",
      targetAmount: 5000,
      currentAmount: 2300,
      deadline: "2025-08-15",
      category: "business",
      color: "bg-chart-2",
    },
    {
      id: "3",
      name: "Tax Reserve",
      targetAmount: 8000,
      currentAmount: 4200,
      deadline: "2026-04-15",
      category: "tax",
      color: "bg-chart-3",
    },
  ])

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const overallProgress = Math.round((totalSaved / totalTarget) * 100)

  const calculateMonthsRemaining = (deadline: string) => {
    const today = new Date()
    const target = new Date(deadline)
    const months = Math.max(
      0,
      (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth()),
    )
    return months
  }

  const calculateMonthlySavingsNeeded = (goal: SavingsGoal) => {
    const remaining = goal.targetAmount - goal.currentAmount
    const months = calculateMonthsRemaining(goal.deadline)
    return months > 0 ? Math.ceil(remaining / months) : remaining
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Savings Goals</h1>
          <p className="text-muted-foreground">Track your progress toward financial milestones</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
              <DialogDescription>Set a new financial target to work toward</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="goal-name">Goal Name</Label>
                <Input id="goal-name" placeholder="e.g., Emergency Fund" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-amount">Target Amount</Label>
                <Input id="target-amount" type="number" placeholder="10000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-amount">Current Amount</Label>
                <Input id="current-amount" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Target Date</Label>
                <Input id="deadline" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency Fund</SelectItem>
                    <SelectItem value="business">Business Investment</SelectItem>
                    <SelectItem value="tax">Tax Reserve</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Savings Progress</CardTitle>
          <CardDescription>Your total progress across all goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Saved</p>
                <p className="text-3xl font-bold text-foreground">${totalSaved.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Target</p>
                <p className="text-2xl font-semibold text-muted-foreground">${totalTarget.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
            <div className="flex items-center gap-2 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
              <p className="text-sm text-foreground leading-relaxed">
                Great progress! You're ${(totalTarget - totalSaved).toLocaleString()} away from reaching all your goals.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Goals */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Your Goals</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => {
            const progress = Math.round((goal.currentAmount / goal.targetAmount) * 100)
            const monthsRemaining = calculateMonthsRemaining(goal.deadline)
            const monthlySavings = calculateMonthlySavingsNeeded(goal)
            const isOnTrack = progress >= 50 || monthsRemaining > 6

            return (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${goal.color} rounded-lg flex items-center justify-center`}>
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{goal.name}</CardTitle>
                        <CardDescription className="capitalize">{goal.category}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-foreground">${goal.currentAmount.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground">of ${goal.targetAmount.toLocaleString()}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{progress}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">Deadline</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(goal.deadline).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </p>
                      <p className="text-xs text-muted-foreground">{monthsRemaining} months left</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs">Monthly Need</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">${monthlySavings.toLocaleString()}/mo</p>
                      <p className="text-xs text-muted-foreground">to reach goal</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      isOnTrack ? "bg-accent/10 border border-accent/20" : "bg-chart-3/10 border border-chart-3/20"
                    }`}
                  >
                    <TrendingUp className={`w-4 h-4 flex-shrink-0 ${isOnTrack ? "text-accent" : "text-chart-3"}`} />
                    <p className="text-xs text-foreground leading-relaxed">
                      {isOnTrack ? "You're on track to reach this goal!" : "Consider increasing monthly contributions"}
                    </p>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent">
                    Add Contribution
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* AI Recommendations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Smart Savings Suggestions</CardTitle>
          <CardDescription>AI-powered recommendations to help you reach your goals faster</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3 p-4 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground mb-1">Automate Your Savings</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Set up automatic transfers of $500/month to reach your Emergency Fund goal 2 months earlier.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground mb-1">Optimize Tax Reserve</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on your income, consider increasing your tax reserve to $10,000 to avoid surprises.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground mb-1">New Goal Suggestion</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You have extra budget capacity. Consider starting a retirement savings goal of $500/month.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
