"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Edit2, Check, X, Trash2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { AddTransactionDialog } from "@/components/transactions/add-transaction-dialog"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  category: string
  date: string
  note?: string
  source: string
  createdAt: string
  updatedAt: string
}

export default function SpendingPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState("")
  const [categories, setCategories] = useState<string[]>([])
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filterType !== "all") {
        params.append("type", filterType)
      }
      if (filterCategory !== "all") {
        params.append("category", filterCategory)
      }

      const response = await fetch(`/api/transactions?${params.toString()}`)
      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error("Error fetching transactions:", error)
      toast.error("Failed to load transactions")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/transactions/categories")
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchTransactions()
    fetchCategories()
  }, [filterType, filterCategory])

  const handleEditCategory = (id: string, currentCategory: string) => {
    setEditingId(id)
    setEditCategory(currentCategory)
  }

  const handleSaveCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category: editCategory }),
      })

      if (!response.ok) {
        throw new Error("Failed to update category")
      }

      toast.success("Category updated successfully")
      setEditingId(null)
      fetchTransactions()
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category")
    }
  }

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return
    }

    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete transaction")
      }

      toast.success("Transaction deleted successfully")
      fetchTransactions()
    } catch (error) {
      console.error("Error deleting transaction:", error)
      toast.error("Failed to delete transaction")
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditCategory("")
  }

  const filteredTransactions = transactions.filter(
    (t) =>
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Spending</h1>
            <p className="text-muted-foreground">Source of truth & correction</p>
          </div>
          <AddTransactionDialog onSuccess={fetchTransactions} />
        </div>

        {/* Sticky Filters */}
        <Card className="rounded-xl border mb-6 sticky top-4 z-10">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="rounded-xl border">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No transactions found</p>
                <AddTransactionDialog onSuccess={fetchTransactions} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Note</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-border hover:bg-muted/50 group">
                        <td className="py-3 px-4 text-sm text-foreground">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              transaction.type === "income"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            }`}
                          >
                            {transaction.type === "income" ? "Income" : "Expense"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {editingId === transaction.id ? (
                            <div className="flex items-center gap-2">
                              <Select
                                value={editCategory}
                                onValueChange={setEditCategory}
                              >
                                <SelectTrigger className="w-[180px] h-8 text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                      {cat}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleSaveCategory(transaction.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCancelEdit}
                                className="h-6 w-6 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-foreground">{transaction.category}</span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditCategory(transaction.id, transaction.category)}
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </td>
                        <td
                          className={`py-3 px-4 text-sm font-medium text-right ${
                            transaction.type === "income"
                              ? "text-green-600 dark:text-green-400"
                              : "text-foreground"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {transaction.note || "-"}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
