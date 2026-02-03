"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { useState, useMemo } from "react"
import { CurrentSituationSummary } from "@/components/planning/current-situation-summary"
import { BudgetCard } from "@/components/planning/budget-card"
import { SavingGoalCard } from "@/components/planning/saving-goal-card"
import { GoalCreationFlow } from "@/components/planning/goal-creation-flow"
import { AIGuidancePanel } from "@/components/planning/ai-guidance-panel"
import { ScenarioSelector } from "@/components/planning/scenario-selector"
import { InputsPanel } from "@/components/planning/inputs-panel"
import { ImpactPanel } from "@/components/planning/impact-panel"

interface Budget {
  id: string
  category: string
  currentLimit: number
  avgSpend: number
  trend: number
}

interface SavingGoal {
  id: string
  name: string
  targetAmount: number
  savedAmount: number
  monthlyContribution: number
  targetDate?: string
  isPaused: boolean
}

export default function PlanningPage() {
  // Base financial data
  const baseRevenue = 5200
  const baseExpenses = 3840
  const baseCash = 12450
  const baseTaxRate = 0.25
  const monthlyProfit = baseRevenue - baseExpenses - (baseRevenue * baseTaxRate) / 12
  const runway = baseCash / (baseExpenses + (baseRevenue * baseTaxRate) / 12 - baseRevenue)

  // Budgets state
  const [budgets, setBudgets] = useState<Budget[]>([
    { id: "1", category: "Marketing", currentLimit: 1200, avgSpend: 1050, trend: 15 },
    { id: "2", category: "Software", currentLimit: 500, avgSpend: 480, trend: -5 },
    { id: "3", category: "Office", currentLimit: 300, avgSpend: 320, trend: 10 },
  ])

  // Goals state
  const [goals, setGoals] = useState<SavingGoal[]>([
    {
      id: "1",
      name: "Emergency Fund",
      targetAmount: 10000,
      savedAmount: 6800,
      monthlyContribution: 500,
      targetDate: "2025-06-01",
      isPaused: false,
    },
    {
      id: "2",
      name: "Tax Reserve",
      targetAmount: 6000,
      savedAmount: 2400,
      monthlyContribution: 500,
      targetDate: "2025-04-15",
      isPaused: false,
    },
  ])

  const [showGoalCreation, setShowGoalCreation] = useState(false)
  const [activeTab, setActiveTab] = useState("budgets")

  // Scenario state (for Scenarios tab)
  const [scenarios, setScenarios] = useState([
    { id: "current", name: "Current", isCurrent: true, isLocked: true },
  ])
  const [activeScenarioId, setActiveScenarioId] = useState("current")
  const [revenueChange, setRevenueChange] = useState(0)
  const [expenses, setExpenses] = useState<any[]>([])
  const [adjustTaxReserve, setAdjustTaxReserve] = useState(true)

  // Calculate impact for scenarios
  const scenarioImpact = useMemo(() => {
    const newRevenue = baseRevenue * (1 + revenueChange / 100)
    const additionalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0)
    const newExpenses = baseExpenses + additionalExpenses
    const monthlyTax = adjustTaxReserve ? (newRevenue * baseTaxRate) / 12 : 0
    const monthlyProfit = newRevenue - newExpenses - monthlyTax
    const previousProfit = baseRevenue - baseExpenses - (adjustTaxReserve ? (baseRevenue * baseTaxRate) / 12 : 0)
    const monthlyBurn = newExpenses + monthlyTax - newRevenue
    const runway = monthlyBurn > 0 ? baseCash / monthlyBurn : Infinity

    const warnings: string[] = []
    if (runway < 3) warnings.push("Runway drops below 3 months — high risk")
    if (monthlyProfit < 0) warnings.push("Profit becomes negative — unsustainable")
    if (additionalExpenses > baseExpenses * 0.2) warnings.push("Fixed costs increase by more than 20%")

    let aiSummary = ""
    if (runway >= 6 && monthlyProfit > 0) {
      aiSummary = `This plan is sustainable. You'll maintain ${runway.toFixed(1)} months of runway with a healthy profit margin.`
    } else if (runway >= 3 && monthlyProfit > 0) {
      aiSummary = `This plan is workable but tight. Consider increasing revenue by ${Math.ceil((baseExpenses * 1.1 - newRevenue) / baseRevenue * 100)}% to extend runway to 6 months.`
    } else if (monthlyProfit < 0) {
      aiSummary = `This plan is not sustainable — expenses exceed revenue. Reduce costs by $${Math.abs(monthlyProfit).toFixed(0)}/month or increase revenue to break even.`
    } else {
      aiSummary = `Runway is below 3 months — high risk. Reduce expenses or increase revenue immediately.`
    }

    return { runway, monthlyProfit, previousProfit, riskWarnings: warnings, aiSummary }
  }, [revenueChange, expenses, adjustTaxReserve, baseRevenue, baseExpenses, baseCash, baseTaxRate])

  // Calculate budget impact
  const calculateBudgetImpact = (budget: Budget, newBudget: number) => {
    const delta = newBudget - budget.currentLimit
    const newMonthlyExpenses = baseExpenses + delta
    const newMonthlyProfit = baseRevenue - newMonthlyExpenses - (baseRevenue * baseTaxRate) / 12
    const newRunway = baseCash / (newMonthlyExpenses + (baseRevenue * baseTaxRate) / 12 - baseRevenue)

    let risk: "low" | "moderate" | "high" = "low"
    if (newRunway < 3) risk = "high"
    else if (newRunway < 6) risk = "moderate"

    return {
      monthlyProfit: newMonthlyProfit,
      runway: newRunway,
      risk,
    }
  }

  const handleBudgetChange = (budgetId: string, newBudget: number) => {
    setBudgets(budgets.map((b) => (b.id === budgetId ? { ...b, currentLimit: newBudget } : b)))
  }

  const handleCreateGoal = (goalData: {
    name: string
    targetAmount: number
    targetDate?: string
    monthlyContribution: number
  }) => {
    const newGoal: SavingGoal = {
      id: Date.now().toString(),
      ...goalData,
      savedAmount: 0,
      isPaused: false,
    }
    setGoals([...goals, newGoal])
    setShowGoalCreation(false)
  }

  const handlePauseGoal = (goalId: string) => {
    setGoals(goals.map((g) => (g.id === goalId ? { ...g, isPaused: !g.isPaused } : g)))
  }

  // AI Guidance insights
  const aiInsights = useMemo(() => {
    const insights: string[] = []
    const actions: Array<{ label: string; onClick: () => void }> = []

    // Budget insights
    if (activeTab === "budgets") {
      const totalGoalContributions = goals.filter((g) => !g.isPaused).reduce((sum, g) => sum + g.monthlyContribution, 0)
      const totalBudgets = budgets.reduce((sum, b) => sum + b.currentLimit, 0)

      if (totalBudgets > baseRevenue * 0.8) {
        insights.push("Your total budgets exceed 80% of revenue. Consider reducing some categories to maintain profitability.")
        actions.push({
          label: "Make this safer",
          onClick: () => {
            // Auto-reduce budgets by 10%
            setBudgets(budgets.map((b) => ({ ...b, currentLimit: Math.floor(b.currentLimit * 0.9) })))
          },
        })
      }

      if (totalGoalContributions + totalBudgets > baseRevenue) {
        insights.push(
          `Your goals and budgets total $${(totalGoalContributions + totalBudgets).toLocaleString()}/month, exceeding your revenue. Consider pausing a goal or reducing budgets.`
        )
        actions.push({
          label: "Suggest alternative plan",
          onClick: () => {
            // Suggest pausing oldest goal
            const oldestGoal = goals.find((g) => !g.isPaused)
            if (oldestGoal) {
              handlePauseGoal(oldestGoal.id)
            }
          },
        })
      }
    }

    // Goal insights
    if (activeTab === "goals") {
      const activeGoals = goals.filter((g) => !g.isPaused)
      const totalContributions = activeGoals.reduce((sum, g) => sum + g.monthlyContribution, 0)

      if (totalContributions > monthlyProfit * 0.5) {
        insights.push(
          `Your goal contributions ($${totalContributions.toLocaleString()}/month) are ${((totalContributions / monthlyProfit) * 100).toFixed(0)}% of your profit. This is aggressive but manageable.`
        )
      }

      goals.forEach((goal) => {
        if (!goal.isPaused && goal.targetDate) {
          const monthsRemaining = Math.ceil(
            (new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)
          )
          const needed = Math.ceil((goal.targetAmount - goal.savedAmount) / monthsRemaining)
          if (needed > goal.monthlyContribution * 1.2) {
            insights.push(
              `"${goal.name}" needs $${needed.toLocaleString()}/month to reach target, but you're contributing $${goal.monthlyContribution.toLocaleString()}. Consider increasing contribution or extending the deadline.`
            )
            actions.push({
              label: `Delay "${goal.name}" by 2 months`,
              onClick: () => {
                const newDate = new Date(goal.targetDate!)
                newDate.setMonth(newDate.getMonth() + 2)
                setGoals(
                  goals.map((g) =>
                    g.id === goal.id ? { ...g, targetDate: newDate.toISOString().split("T")[0] } : g
                  )
                )
              },
            })
          }
        }
      })
    }

    return { insights, actions }
  }, [activeTab, budgets, goals, monthlyProfit, baseRevenue])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Planning</h1>
          <p className="text-muted-foreground">Help me decide what to do next without breaking my finances</p>
        </div>

        {/* Current Situation Summary */}
        <div className="mb-6">
          <CurrentSituationSummary
            cashBalance={baseCash}
            monthlyProfit={monthlyProfit}
            runway={runway}
            monthlyRevenue={baseRevenue}
            monthlyExpenses={baseExpenses}
          />
        </div>

        {/* What are you planning? */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          </TabsList>

          {/* Budgets Tab */}
          <TabsContent value="budgets" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Budgets</h2>
                  <p className="text-sm text-muted-foreground">Adjust future spending limits and see impact before committing</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((budget) => (
                  <BudgetCard
                    key={budget.id}
                    category={budget.category}
                    currentLimit={budget.currentLimit}
                    avgSpend={budget.avgSpend}
                    trend={budget.trend}
                    onBudgetChange={(newBudget) => {
                      // Impact is calculated in BudgetCard component
                    }}
                    impact={calculateBudgetImpact(budget, budget.currentLimit)}
                  />
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Button variant="outline" className="flex-1">
                  Simulate only
                </Button>
                <Button className="flex-1">Save changes</Button>
              </div>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Saving Goals</h2>
                  <p className="text-sm text-muted-foreground">Turn abstract saving into predictable, safe commitments</p>
                </div>
                <Button onClick={() => setShowGoalCreation(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Goal
                </Button>
              </div>

              {showGoalCreation ? (
                <div className="mb-6">
                  <GoalCreationFlow
                    onCancel={() => setShowGoalCreation(false)}
                    onSave={handleCreateGoal}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {goals.map((goal) => {
                    const totalContributions = goals.filter((g) => !g.isPaused).reduce((sum, g) => sum + g.monthlyContribution, 0)
                    const runwayImpact = -(goal.monthlyContribution / (baseExpenses - baseRevenue)) * 12

                    return (
                      <SavingGoalCard
                        key={goal.id}
                        id={goal.id}
                        name={goal.name}
                        targetAmount={goal.targetAmount}
                        savedAmount={goal.savedAmount}
                        monthlyContribution={goal.monthlyContribution}
                        targetDate={goal.targetDate}
                        isPaused={goal.isPaused}
                        impact={{
                          freeCashReduction: goal.monthlyContribution,
                          runwayImpact,
                        }}
                        onAdjust={() => {
                          // TODO: Open edit modal
                          console.log("Adjust goal", goal.id)
                        }}
                        onPause={() => handlePauseGoal(goal.id)}
                        onAskAI={() => {
                          // TODO: Open AI Advisor with goal context
                          console.log("Ask AI about goal", goal.id)
                        }}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Scenarios Tab */}
          <TabsContent value="scenarios" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-6">
                <ScenarioSelector
                  scenarios={scenarios}
                  onSelectScenario={(id) => setActiveScenarioId(id)}
                  onCreateNew={() => {
                    const newId = `scenario-${Date.now()}`
                    setScenarios([...scenarios, { id: newId, name: `New Scenario ${scenarios.length}`, isCurrent: false }])
                    setActiveScenarioId(newId)
                  }}
                />
                <InputsPanel
                  revenueChange={revenueChange}
                  onRevenueChange={setRevenueChange}
                  expenses={expenses}
                  onAddExpense={() => {
                    setExpenses([...expenses, { id: Date.now().toString(), name: "", amount: 0, isRecurring: true }])
                  }}
                  onRemoveExpense={(id) => setExpenses(expenses.filter((e) => e.id !== id))}
                  onUpdateExpense={(id, updates) => {
                    setExpenses(expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)))
                  }}
                  adjustTaxReserve={adjustTaxReserve}
                  onToggleTaxReserve={setAdjustTaxReserve}
                />
              </div>

              <div className="lg:col-span-2">
                <ImpactPanel
                  runway={scenarioImpact.runway}
                  monthlyProfit={scenarioImpact.monthlyProfit}
                  previousProfit={scenarioImpact.previousProfit}
                  riskWarnings={scenarioImpact.riskWarnings}
                  aiSummary={scenarioImpact.aiSummary}
                />

                <div className="mt-6 flex gap-3">
                  <Button variant="outline" className="flex-1">
                    Save scenario
                  </Button>
                  <Button className="flex-1">Apply to plan</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Guidance Panel */}
        {(aiInsights.insights.length > 0 || aiInsights.actions.length > 0) && (
          <div className="mt-8">
            <AIGuidancePanel insights={aiInsights.insights} actions={aiInsights.actions} />
          </div>
        )}
      </div>
    </div>
  )
}
