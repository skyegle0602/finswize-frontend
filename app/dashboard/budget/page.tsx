"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Plus, Edit, TrendingUp, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface BudgetCategory {
  id: string
  name: string
  budgeted: number
  spent: number
  color: string
}

export default function BudgetPage() {
  const [categories, setCategories] = useState<BudgetCategory[]>([
    { id: "1", name: "Business Tools", budgeted: 1500, spent: 1240, color: "bg-chart-1" },
    { id: "2", name: "Marketing", budgeted: 1200, spent: 980, color: "bg-chart-2" },
    { id: "3", name: "Office & Supplies", budgeted: 800, spent: 620, color: "bg-chart-3" },
    { id: "4", name: "Professional Services", budgeted: 700, spent: 580, color: "bg-chart-4" },
    { id: "5", name: "Travel", budgeted: 500, spent: 320, color: "bg-chart-5" },
    { id: "6", name: "Other", budgeted: 300, spent: 100, color: "bg-muted-foreground" },
  ])

  const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const percentageSpent = Math.round((totalSpent / totalBudgeted) * 100)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Budget Management</h1>
          <p className="text-muted-foreground">Track and manage your spending by category</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Budget Category</DialogTitle>
              <DialogDescription>Create a new category to track your spending</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input id="category-name" placeholder="e.g., Software Subscriptions" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget-amount">Monthly Budget</Label>
                <Input id="budget-amount" type="number" placeholder="500" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Budget Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Monthly Budget Overview</CardTitle>
          <CardDescription>Your total spending across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-3xl font-bold text-foreground">${totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-semibold text-muted-foreground">${totalBudgeted.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Budget Used</span>
                <span className="font-medium text-foreground">{percentageSpent}%</span>
              </div>
              <Progress value={percentageSpent} className="h-3" />
            </div>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <TrendingUp className="w-5 h-5 text-accent" />
              <p className="text-sm text-foreground leading-relaxed">
                You're staying within budget! You have ${(totalBudgeted - totalSpent).toLocaleString()} remaining this
                month.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Budget by Category</h2>
        <div className="grid gap-4">
          {categories.map((category) => {
            const percentage = Math.round((category.spent / category.budgeted) * 100)
            const isOverBudget = percentage > 100
            const isNearLimit = percentage > 85 && percentage <= 100

            return (
              <Card key={category.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${category.color}`} />
                          <h3 className="font-semibold text-foreground">{category.name}</h3>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-foreground">${category.spent.toLocaleString()}</span>
                          <span className="text-sm text-muted-foreground">
                            of ${category.budgeted.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit {category.name}</DialogTitle>
                            <DialogDescription>Update your budget for this category</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-budget">Monthly Budget</Label>
                              <Input
                                id="edit-budget"
                                type="number"
                                defaultValue={category.budgeted}
                                placeholder="500"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Spent</span>
                        <span
                          className={`font-medium ${
                            isOverBudget ? "text-destructive" : isNearLimit ? "text-chart-3" : "text-foreground"
                          }`}
                        >
                          {percentage}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min(percentage, 100)}
                        className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
                      />
                    </div>

                    {isOverBudget && (
                      <div className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                        <p className="text-xs text-foreground leading-relaxed">
                          Over budget by ${(category.spent - category.budgeted).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {isNearLimit && !isOverBudget && (
                      <div className="flex items-center gap-2 p-2 bg-chart-3/10 border border-chart-3/20 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-chart-3 flex-shrink-0" />
                        <p className="text-xs text-foreground leading-relaxed">
                          Approaching budget limit. ${(category.budgeted - category.spent).toLocaleString()} remaining.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* AI Recommendations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>AI Budget Recommendations</CardTitle>
          <CardDescription>Personalized suggestions to optimize your spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3 p-4 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground mb-1">Reduce Marketing Spend</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You're spending 82% of your marketing budget. Consider reviewing your ad campaigns for better ROI.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground mb-1">Optimize Software Subscriptions</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Based on your usage patterns, you could save $200/month by switching to annual billing for your
                  business tools.
                </p>
              </div>
            </div>

            <div className="flex gap-3 p-4 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground mb-1">Increase Emergency Fund Allocation</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  You have room in your budget to increase savings by $300/month without impacting your lifestyle.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
