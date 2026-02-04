"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AddTransactionDialogProps {
  onSuccess?: () => void
  defaultType?: "income" | "expense"
}

const commonCategories = {
  income: ["Freelance", "Salary", "Consulting", "Sales", "Other"],
  expense: [
    "Business Tools",
    "Marketing",
    "Office & Supplies",
    "Meals",
    "Professional Services",
    "Software",
    "Travel",
    "Utilities",
    "Other",
  ],
}

export function AddTransactionDialog({
  onSuccess,
  defaultType = "expense",
}: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [type, setType] = useState<"income" | "expense">(defaultType)
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [note, setNote] = useState("")
  const [useCustomCategory, setUseCustomCategory] = useState(false)

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setAmount("")
      setCategory("")
      setCustomCategory("")
      setNote("")
      setUseCustomCategory(false)
      setDate(new Date().toISOString().split("T")[0])
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const finalCategory = useCustomCategory ? customCategory : category

      if (!finalCategory || !amount || !date) {
        toast.error("Please fill in all required fields")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          category: finalCategory,
          date,
          note: note || undefined,
          source: "manual",
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create transaction")
      }

      toast.success(
        `${type === "income" ? "Income" : "Expense"} added successfully`
      )
      setOpen(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error creating transaction:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create transaction"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add {type === "income" ? "Income" : "Expense"}</DialogTitle>
          <DialogDescription>
            Record a new {type === "income" ? "income" : "expense"} transaction
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Type Selector */}
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) => {
                  setType(value as "income" | "expense")
                  setCategory("")
                  setCustomCategory("")
                  setUseCustomCategory(false)
                }}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="grid gap-2">
              <Label htmlFor="amount">
                Amount <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Select
                  value={useCustomCategory ? "custom" : category}
                  onValueChange={(value) => {
                    if (value === "custom") {
                      setUseCustomCategory(true)
                    } else {
                      setUseCustomCategory(false)
                      setCategory(value)
                    }
                  }}
                  disabled={useCustomCategory}
                >
                  <SelectTrigger id="category" className="flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(commonCategories[type] || []).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">+ Custom Category</SelectItem>
                  </SelectContent>
                </Select>
                {useCustomCategory && (
                  <Input
                    placeholder="Enter category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="flex-1"
                    required
                  />
                )}
              </div>
            </div>

            {/* Date */}
            <div className="grid gap-2">
              <Label htmlFor="date">
                Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Note */}
            <div className="grid gap-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Input
                id="note"
                placeholder="Add a note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add {type === "income" ? "Income" : "Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
