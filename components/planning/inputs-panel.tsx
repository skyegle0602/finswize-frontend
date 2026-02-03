"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, X } from "lucide-react"
import { useState } from "react"

interface Expense {
  id: string
  name: string
  amount: number
  isRecurring: boolean
}

interface InputsPanelProps {
  revenueChange: number
  onRevenueChange: (value: number) => void
  expenses: Expense[]
  onAddExpense: () => void
  onRemoveExpense: (id: string) => void
  onUpdateExpense: (id: string, updates: Partial<Expense>) => void
  adjustTaxReserve: boolean
  onToggleTaxReserve: (value: boolean) => void
}

export function InputsPanel({
  revenueChange,
  onRevenueChange,
  expenses,
  onAddExpense,
  onRemoveExpense,
  onUpdateExpense,
  adjustTaxReserve,
  onToggleTaxReserve,
}: InputsPanelProps) {
  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Adjust Plan</CardTitle>
        <CardDescription>Change inputs to see impact</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Revenue Change */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-foreground">Monthly Revenue Change</label>
            <span className="text-lg font-bold text-foreground">
              {revenueChange >= 0 ? "+" : ""}
              {revenueChange}%
            </span>
          </div>
          <Slider value={[revenueChange]} onValueChange={(v) => onRevenueChange(v[0])} min={-50} max={50} step={5} className="w-full" />
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => onRevenueChange(-20)}>
              -20%
            </Button>
            <Button variant="outline" size="sm" onClick={() => onRevenueChange(10)}>
              +10%
            </Button>
            <Button variant="outline" size="sm" onClick={() => onRevenueChange(20)}>
              +20%
            </Button>
          </div>
        </div>

        {/* Expenses */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-foreground">Expenses</label>
            <Button variant="outline" size="sm" onClick={onAddExpense} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Expense
            </Button>
          </div>
          <div className="space-y-2">
            {expenses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No additional expenses</p>
            ) : (
              expenses.map((expense) => (
                <div key={expense.id} className="flex items-center gap-2 p-2 border rounded-lg">
                  <input
                    type="text"
                    placeholder="Expense name"
                    value={expense.name}
                    onChange={(e) => onUpdateExpense(expense.id, { name: e.target.value })}
                    className="flex-1 text-sm border border-input rounded px-2 py-1 bg-background"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={expense.amount || ""}
                    onChange={(e) => onUpdateExpense(expense.id, { amount: parseFloat(e.target.value) || 0 })}
                    className="w-24 text-sm border border-input rounded px-2 py-1 bg-background"
                  />
                  <span className="text-sm text-muted-foreground">/mo</span>
                  <Button variant="ghost" size="sm" onClick={() => onRemoveExpense(expense.id)} className="h-8 w-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tax Reserve Toggle */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div>
            <label className="text-sm font-medium text-foreground">Adjust tax reserve</label>
            <p className="text-xs text-muted-foreground">Conservative default ON</p>
          </div>
          <Switch checked={adjustTaxReserve} onCheckedChange={onToggleTaxReserve} />
        </div>
      </CardContent>
    </Card>
  )
}
