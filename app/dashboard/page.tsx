"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, TrendingUp, TrendingDown, DollarSign, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
}

interface MonthlyStats {
  income: number
  expenses: number
  net: number
  expensesByCategory: { category: string; amount: number }[]
}

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#0088fe",
  "#00c49f",
  "#ffbb28",
  "#ff8042",
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<MonthlyStats>({
    income: 0,
    expenses: 0,
    net: 0,
    expensesByCategory: [],
  })
  const [hasTransactions, setHasTransactions] = useState(false)

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

  const fetchMonthlyStats = async () => {
    try {
      setIsLoading(true)
      const { startDate, endDate } = getCurrentMonthRange()

      // Fetch transactions for current month
      const response = await fetch(
        `/api/transactions?startDate=${startDate}&endDate=${endDate}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      const data = await response.json()
      const transactions: Transaction[] = data.transactions || []

      setHasTransactions(transactions.length > 0)

      // Calculate stats
      let income = 0
      let expenses = 0
      const categoryMap = new Map<string, number>()

      transactions.forEach((t) => {
        if (t.type === "income") {
          income += t.amount
        } else {
          expenses += t.amount
          const current = categoryMap.get(t.category) || 0
          categoryMap.set(t.category, current + t.amount)
        }
      })

      // Convert category map to array
      const expensesByCategory = Array.from(categoryMap.entries())
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)

      setStats({
        income,
        expenses,
        net: income - expenses,
        expensesByCategory,
      })
    } catch (error) {
      console.error("Error fetching monthly stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMonthlyStats()
  }, [])

  // Empty state
  if (!isLoading && !hasTransactions) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Overview</h1>
            <p className="text-muted-foreground">How am I doing right now?</p>
          </div>

          <Card className="rounded-xl border max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <DollarSign className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-2">
                    Start by adding your income and expenses
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Add your first transaction to see your financial overview
                  </p>
                </div>
                <AddTransactionDialog onSuccess={fetchMonthlyStats} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Overview</h1>
          <p className="text-muted-foreground">How am I doing right now?</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Financial Health Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Monthly Income */}
              <Card className="rounded-xl border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Monthly Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-3xl font-bold text-green-600">
                        ${stats.income.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        From transactions this month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Expenses */}
              <Card className="rounded-xl border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Monthly Expenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-3xl font-bold text-red-600">
                        ${stats.expenses.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        From transactions this month
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Net Balance / Monthly Profit */}
              <Card className="rounded-xl border">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Net Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <DollarSign
                      className={`w-5 h-5 ${
                        stats.net >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-3xl font-bold ${
                          stats.net >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {stats.net >= 0 ? "+" : ""}
                        ${stats.net.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Income − Expenses
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Simple Chart - Expenses by Category */}
            {stats.expensesByCategory.length > 0 && (
              <Card className="rounded-xl border">
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.expensesByCategory}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ category, percent }) =>
                            `${category} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={120}
                          fill="#8884d8"
                          dataKey="amount"
                        >
                          {stats.expensesByCategory.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) =>
                            `$${value.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                          }
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
