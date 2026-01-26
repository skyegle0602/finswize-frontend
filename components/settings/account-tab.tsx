"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Check, X, Edit2 } from "lucide-react"

interface AccountTabProps {
  formData: {
    fullName: string
    businessName: string
    email: string
    timezone: string
    currency: string
  }
  setFormData: (data: any) => void
}

export function AccountTab({ formData, setFormData }: AccountTabProps) {
  const [editingField, setEditingField] = useState<string | null>(null)

  const handleSave = (field: string) => {
    setEditingField(null)
    // TODO: Save to backend
  }

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Basic identity & business info</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Full Name</Label>
          {editingField === "fullName" ? (
            <div className="flex gap-2">
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                autoFocus
              />
              <Button size="sm" onClick={() => handleSave("fullName")}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-foreground">{formData.fullName}</span>
              <Button size="sm" variant="ghost" onClick={() => setEditingField("fullName")}>
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Business Name</Label>
          {editingField === "businessName" ? (
            <div className="flex gap-2">
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                autoFocus
              />
              <Button size="sm" onClick={() => handleSave("businessName")}>
                <Check className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditingField(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-foreground">{formData.businessName}</span>
              <Button size="sm" variant="ghost" onClick={() => setEditingField("businessName")}>
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Email Address</Label>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-foreground">{formData.email}</span>
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">Verified</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support if needed.</p>
        </div>

        <div className="space-y-2">
          <Label>Time Zone</Label>
          <Select value={formData.timezone} onValueChange={(value) => setFormData({ ...formData, timezone: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
              <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
              <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
              <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Currency</Label>
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-foreground">{formData.currency}</span>
            <span className="text-xs text-muted-foreground">Auto-detected</span>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">Last updated: January 24, 2025</p>
        </div>
      </CardContent>
    </Card>
  )
}
