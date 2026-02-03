"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Edit2, Check, X } from "lucide-react"
import { useState } from "react"

interface Transaction {
  id: string
  date: string
  merchant: string
  category: string
  amount: number
  account: string
  isPersonal: boolean
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-01-24",
    merchant: "Adobe Creative Cloud",
    category: "Business Tools",
    amount: -52.99,
    account: "Business Checking",
    isPersonal: false,
  },
  {
    id: "2",
    date: "2025-01-23",
    merchant: "Google Ads",
    category: "Marketing",
    amount: -320.50,
    account: "Business Checking",
    isPersonal: false,
  },
  {
    id: "3",
    date: "2025-01-22",
    merchant: "Starbucks",
    category: "Meals",
    amount: -8.50,
    account: "Business Checking",
    isPersonal: true,
  },
  {
    id: "4",
    date: "2025-01-21",
    merchant: "Client Payment - Acme Corp",
    category: "Revenue",
    amount: 2500.00,
    account: "Business Checking",
    isPersonal: false,
  },
  {
    id: "5",
    date: "2025-01-20",
    merchant: "Office Depot",
    category: "Office & Supplies",
    amount: -145.30,
    account: "Business Checking",
    isPersonal: false,
  },
]

export default function SpendingPage() {
  const [transactions, setTransactions] = useState(mockTransactions)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState("")

  const categories = ["Business Tools", "Marketing", "Meals", "Office & Supplies", "Revenue", "Professional Services"]

  const handleEditCategory = (id: string, currentCategory: string) => {
    setEditingId(id)
    setEditCategory(currentCategory)
  }

  const handleSaveCategory = (id: string) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, category: editCategory } : t))
    )
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditCategory("")
  }

  const filteredTransactions = transactions.filter(
    (t) =>
      t.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Spending</h1>
          <p className="text-muted-foreground">Source of truth & correction</p>
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
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="rounded-xl border">
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Merchant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Account</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-border hover:bg-muted/50 group">
                      <td className="py-3 px-4 text-sm text-foreground">{transaction.date}</td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">{transaction.merchant}</td>
                      <td className="py-3 px-4">
                        {editingId === transaction.id ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={editCategory}
                              onChange={(e) => setEditCategory(e.target.value)}
                              className="text-sm border border-input rounded px-2 py-1 bg-background"
                              autoFocus
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
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
                          transaction.amount > 0 ? "text-green-600" : "text-foreground"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.account}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            transaction.isPersonal
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {transaction.isPersonal ? "Personal" : "Business"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
