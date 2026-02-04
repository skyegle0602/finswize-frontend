"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Loader2 } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { CurrentSituationSummary } from "@/components/planning/current-situation-summary"
import { BudgetCard } from "@/components/planning/budget-card"
import { SavingGoalCard } from "@/components/planning/saving-goal-card"
import { GoalCreationFlow } from "@/components/planning/goal-creation-flow"
import { AdjustGoalModal } from "@/components/planning/adjust-goal-modal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
}

interface Budget {
  id: string
  category: string
  currentLimit: number
  spentThisMonth: number
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
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [activeTab, setActiveTab] = useState("budgets")

  // Calculate current month date range
  const getCurrentMonthRange = () => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return {
      startDate: startOfMonth.toISOString().split("T")[0],
      endDate: endOfMonth.toISOString().split("T")[0],
    }
  }

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const { startDate, endDate } = getCurrentMonthRange()
      const response = await fetch(`/api/transactions?startDate=${startDate}&endDate=${endDate}`)
      if (response.ok) {
        const data = await response.json()
        setTransactions(data.transactions || [])
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  // Calculate base financial data from transactions
  const financialData = useMemo(() => {
    let monthlyIncome = 0
    let monthlyExpenses = 0
    const categorySpending = new Map<string, number>()

    transactions.forEach((t) => {
      if (t.type === "income") {
        monthlyIncome += t.amount
      } else {
        monthlyExpenses += t.amount
        const current = categorySpending.get(t.category) || 0
        categorySpending.set(t.category, current + t.amount)
      }
    })

    const monthlySurplus = monthlyIncome - monthlyExpenses
    // Simple runway calculation: assume current cash = 3 months of expenses (placeholder)
    // In real app, you'd fetch actual cash balance
    const estimatedCash = monthlyExpenses * 3
    const monthlyBurn = monthlyExpenses - monthlyIncome
    const runway = monthlyBurn > 0 ? estimatedCash / monthlyBurn : Infinity

    return {
      monthlyIncome,
      monthlyExpenses,
      monthlySurplus,
      runway,
      categorySpending,
    }
  }, [transactions])

  // Budgets state - initialized from categories with expenses
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [savedBudgets, setSavedBudgets] = useState<Budget[]>([]) // Track saved state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSavingBudgets, setIsSavingBudgets] = useState(false)

  // Fetch saved budgets from database
  const fetchSavedBudgets = async () => {
    try {
      const response = await fetch("/api/budgets")
      if (response.ok) {
        const data = await response.json()
        return data.budgets || []
      }
    } catch (error) {
      console.error("Error fetching saved budgets:", error)
    }
    return []
  }

  useEffect(() => {
    const initializeBudgets = async () => {
      // First, try to load saved budgets from database
      const savedBudgetsFromDB = await fetchSavedBudgets()
      
      // Create a map of saved budgets by category
      const savedBudgetMap = new Map(
        savedBudgetsFromDB.map((b: any) => [b.category, b.monthlyLimit])
      )

      // Initialize budgets from categories that have expenses
      const budgetCategories = Array.from(financialData.categorySpending.entries()).map(
        ([category, spent], index) => {
          // Use saved limit if exists, otherwise calculate default
          const savedLimit = savedBudgetMap.get(category)
          const defaultLimit = Math.max(spent * 1.5, 500) // Set limit 50% above current spend, min $500
          const currentLimit: number = typeof savedLimit === 'number' ? savedLimit : defaultLimit
          
          return {
            id: savedBudgetsFromDB.find((b: any) => b.category === category)?.id || `budget-${index}`,
            category,
            currentLimit,
            spentThisMonth: spent,
          }
        }
      )
      
      setBudgets(budgetCategories)
      setSavedBudgets(budgetCategories) // Initialize saved state
      setHasUnsavedChanges(false) // No changes initially
    }

    if (financialData.categorySpending.size > 0) {
      initializeBudgets()
    }
  }, [financialData.categorySpending])

  // Goals state
  const [goals, setGoals] = useState<SavingGoal[]>([])
  const [showGoalCreation, setShowGoalCreation] = useState(false)
  const [isLoadingGoals, setIsLoadingGoals] = useState(false)
  const [adjustingGoal, setAdjustingGoal] = useState<SavingGoal | null>(null)
  const [pausingGoalId, setPausingGoalId] = useState<string | null>(null)
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null)

  // Fetch saved goals from database
  const fetchSavedGoals = async () => {
    try {
      setIsLoadingGoals(true)
      const response = await fetch("/api/saving-goals")
      if (response.ok) {
        const data = await response.json()
        return data.goals || []
      }
    } catch (error) {
      console.error("Error fetching saved goals:", error)
    } finally {
      setIsLoadingGoals(false)
    }
    return []
  }

  // Load goals on component mount
  useEffect(() => {
    const loadGoals = async () => {
      const savedGoals = await fetchSavedGoals()
      setGoals(
        savedGoals.map((g: any) => ({
          id: g.id,
          name: g.name,
          targetAmount: g.targetAmount,
          savedAmount: g.savedAmount,
          monthlyContribution: g.monthlyContribution,
          targetDate: g.targetDate,
          isPaused: g.isPaused,
        }))
      )
    }
    loadGoals()
  }, [])

  const handleCreateGoal = async (goalData: {
    name: string
    targetAmount: number
    targetDate?: string
    monthlyContribution: number
  }) => {
    try {
      const response = await fetch("/api/saving-goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...goalData,
          savedAmount: 0,
          isPaused: false,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create saving goal")
      }

      const data = await response.json()
      const newGoal: SavingGoal = {
        id: data.goal.id,
        name: data.goal.name,
        targetAmount: data.goal.targetAmount,
        savedAmount: data.goal.savedAmount,
        monthlyContribution: data.goal.monthlyContribution,
        targetDate: data.goal.targetDate,
        isPaused: data.goal.isPaused,
      }
      setGoals([...goals, newGoal])
      setShowGoalCreation(false)
      toast.success("Saving goal created successfully")
    } catch (error) {
      console.error("Error creating saving goal:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to create saving goal"
      )
    }
  }

  const handleAdjustGoal = async (updatedData: {
    id: string
    monthlyContribution: number
    targetDate?: string
  }) => {
    try {
      const response = await fetch(`/api/saving-goals/${updatedData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monthlyContribution: updatedData.monthlyContribution,
          targetDate: updatedData.targetDate,
        }),
      })

      if (!response.ok) {
        let errorMessage = "Failed to update saving goal"
        try {
          const error = await response.json()
          errorMessage = error.error || error.message || errorMessage
        } catch (parseError) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      setGoals(
        goals.map((g) =>
          g.id === updatedData.id
            ? {
                ...g,
                monthlyContribution: data.goal.monthlyContribution,
                targetDate: data.goal.targetDate,
              }
            : g
        )
      )
      toast.success("Goal updated successfully")
    } catch (error) {
      console.error("Error updating saving goal:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update saving goal"
      toast.error(errorMessage)
      throw error
    }
  }

  const handlePauseGoal = async (goalId: string) => {
    // Prevent double-clicks
    if (pausingGoalId === goalId) return

    try {
      const goal = goals.find((g) => g.id === goalId)
      if (!goal) {
        toast.error("Goal not found")
        return
      }

      setPausingGoalId(goalId)
      const newPauseStatus = !goal.isPaused

      const response = await fetch(`/api/saving-goals/${goalId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPaused: newPauseStatus,
        }),
      })

      if (!response.ok) {
        let errorMessage = "Failed to update saving goal"
        try {
          const error = await response.json()
          errorMessage = error.error || error.message || errorMessage
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      // Update the goal state with the saved status from database
      setGoals(
        goals.map((g) =>
          g.id === goalId
            ? {
                ...g,
                isPaused: data.goal.isPaused,
              }
            : g
        )
      )
      
      // Show success message based on the saved status
      toast.success(
        data.goal.isPaused ? "Goal paused successfully" : "Goal resumed successfully"
      )
    } catch (error) {
      console.error("Error updating saving goal pause status:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update saving goal"
      toast.error(errorMessage)
    } finally {
      setPausingGoalId(null)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    // Prevent double-clicks
    if (deletingGoalId === goalId) return

    // Confirm deletion
    if (!confirm("Are you sure you want to delete this saving goal? This action cannot be undone.")) {
      return
    }

    try {
      setDeletingGoalId(goalId)

      const response = await fetch(`/api/saving-goals/${goalId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        let errorMessage = "Failed to delete saving goal"
        try {
          const error = await response.json()
          errorMessage = error.error || error.message || errorMessage
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Remove goal from local state
      setGoals(goals.filter((g) => g.id !== goalId))
      
      toast.success("Goal deleted successfully")
    } catch (error) {
      console.error("Error deleting saving goal:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to delete saving goal"
      toast.error(errorMessage)
    } finally {
      setDeletingGoalId(null)
    }
  }

  // Calculate budget impact
  const calculateBudgetImpact = (budget: Budget, newBudget: number) => {
    const delta = newBudget - budget.currentLimit
    const newMonthlyExpenses = financialData.monthlyExpenses + delta
    const newMonthlySurplus = financialData.monthlyIncome - newMonthlyExpenses
    const estimatedCash = financialData.monthlyExpenses * 3
    const monthlyBurn = newMonthlyExpenses - financialData.monthlyIncome
    const newRunway = monthlyBurn > 0 ? estimatedCash / monthlyBurn : Infinity

    let risk: "low" | "medium" | "high" = "low"
    if (newRunway < 3) risk = "high"
    else if (newRunway < 6) risk = "medium"

    return {
      monthlySurplus: newMonthlySurplus,
      runway: newRunway,
      risk,
    }
  }

  const handleBudgetChange = (budgetId: string, newBudget: number) => {
    const updatedBudgets = budgets.map((b) => (b.id === budgetId ? { ...b, currentLimit: newBudget } : b))
    setBudgets(updatedBudgets)
    
    // Check if there are unsaved changes
    const hasChanges = updatedBudgets.some(
      (b) => {
        const saved = savedBudgets.find((sb) => sb.id === b.id)
        return saved && saved.currentLimit !== b.currentLimit
      }
    )
    setHasUnsavedChanges(hasChanges)
  }

  const handleResetChanges = () => {
    setBudgets([...savedBudgets])
    setHasUnsavedChanges(false)
  }

  const handleSaveChanges = async () => {
    try {
      setIsSavingBudgets(true)

      // Prepare budgets data for API
      const budgetsToSave = budgets.map((budget) => ({
        category: budget.category,
        monthlyLimit: budget.currentLimit,
      }))

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ budgets: budgetsToSave }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save budgets")
      }

      const data = await response.json()
      
      // Update saved budgets state with the response (includes IDs from DB)
      const updatedSavedBudgets = budgets.map((budget) => {
        const saved = data.budgets.find((b: any) => b.category === budget.category)
        return {
          ...budget,
          id: saved?.id || budget.id,
        }
      })

      setSavedBudgets(updatedSavedBudgets)
      setHasUnsavedChanges(false)
      
      toast.success("Budgets saved successfully")
    } catch (error) {
      console.error("Error saving budgets:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to save budgets"
      )
    } finally {
      setIsSavingBudgets(false)
    }
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Planning</h1>
          <p className="text-muted-foreground">Help me decide what to do next without breaking my finances</p>
          <p className="text-sm text-muted-foreground mt-1">
            All calculations are based on your manually entered transactions.
          </p>
        </div>

        {/* Current Situation Summary */}
        <div className="mb-6">
          <CurrentSituationSummary
            monthlySurplus={financialData.monthlySurplus}
            runway={financialData.runway}
            monthlyExpenses={financialData.monthlyExpenses}
          />
        </div>

        {/* What are you planning? */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
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

              {budgets.length === 0 ? (
                <Card className="rounded-xl border">
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">
                      Add some expense transactions to see your budgets here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Simulation Mode Indicator (Default State) */}
                  {!hasUnsavedChanges && (
                    <Card className="rounded-xl border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 mb-6">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                            Simulation mode active — Adjust sliders to preview changes
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Unsaved Changes Indicator */}
                  {hasUnsavedChanges && (
                    <Card className="rounded-xl border bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 mb-6">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                              You have unsaved changes — Click "Save changes" to apply your new budget limits
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetChanges}
                            className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100"
                          >
                            Reset
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budgets.map((budget) => {
                      const savedBudget = savedBudgets.find((sb) => sb.id === budget.id)
                      const hasChanged = savedBudget && savedBudget.currentLimit !== budget.currentLimit
                      
                      return (
                        <BudgetCard
                          key={budget.id}
                          category={budget.category}
                          currentLimit={budget.currentLimit}
                          spentThisMonth={budget.spentThisMonth}
                          onBudgetChange={(newBudget: number) => handleBudgetChange(budget.id, newBudget)}
                          impact={calculateBudgetImpact(budget, budget.currentLimit)}
                          isModified={hasChanged}
                        />
                      )
                    })}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    <div className="flex gap-3">
                      <Button
                        variant={hasUnsavedChanges ? "outline" : "default"}
                        className={`flex-1 ${!hasUnsavedChanges ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                        disabled={!hasUnsavedChanges}
                      >
                        {hasUnsavedChanges ? "Simulate only" : "✓ Simulation mode active"}
                      </Button>
                      <Button
                        className={`flex-1 ${hasUnsavedChanges ? "bg-green-600 hover:bg-green-700" : ""}`}
                        disabled={!hasUnsavedChanges || isSavingBudgets}
                        onClick={handleSaveChanges}
                      >
                        {isSavingBudgets ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : hasUnsavedChanges ? (
                          "💾 Save changes"
                        ) : (
                          "Save changes"
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className={`flex-1 ${!hasUnsavedChanges ? "text-blue-600 dark:text-blue-400 font-medium" : "text-muted-foreground"}`}>
                        {hasUnsavedChanges
                          ? "Preview impact without changing budgets"
                          : "✓ Currently in simulation mode — Adjust sliders to see changes"}
                      </span>
                      <span className={`flex-1 ${hasUnsavedChanges ? "text-yellow-600 dark:text-yellow-400 font-medium" : "text-muted-foreground"}`}>
                        {hasUnsavedChanges
                          ? "⚠ Apply these limits going forward"
                          : "Apply these limits going forward"}
                      </span>
                    </div>
                  </div>
                </>
              )}
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
                  {goals.length === 0 ? (
                    <Card className="rounded-xl border col-span-2">
                      <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground mb-4">No saving goals yet.</p>
                        <Button onClick={() => setShowGoalCreation(true)} className="gap-2">
                          <Plus className="w-4 h-4" />
                          Create your first goal
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    goals.map((goal) => {
                      const monthsRemaining = goal.targetDate
                        ? Math.ceil(
                            (new Date(goal.targetDate).getTime() - new Date().getTime()) /
                              (1000 * 60 * 60 * 24 * 30)
                          )
                        : Math.ceil((goal.targetAmount - goal.savedAmount) / goal.monthlyContribution)

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
                          isPausing={pausingGoalId === goal.id}
                          isDeleting={deletingGoalId === goal.id}
                          impact={{
                            freeCashReduction: goal.monthlyContribution,
                            runwayImpact: -(goal.monthlyContribution / (financialData.monthlyExpenses - financialData.monthlyIncome)) * 12,
                          }}
                          onAdjust={() => setAdjustingGoal(goal)}
                          onPause={() => handlePauseGoal(goal.id)}
                          onDelete={() => handleDeleteGoal(goal.id)}
                          onAskAI={() => {
                            router.push(`/dashboard/advice?context=saving-goal&goalId=${goal.id}`)
                          }}
                        />
                      )
                    })
                  )}
                </div>
              )}
            </div>
          </TabsContent>

        </Tabs>
      </div>

      {/* Adjust Goal Modal */}
      {adjustingGoal && (
        <AdjustGoalModal
          open={!!adjustingGoal}
          onOpenChange={(open) => !open && setAdjustingGoal(null)}
          goal={adjustingGoal}
          onSave={handleAdjustGoal}
        />
      )}
    </div>
  )
}
