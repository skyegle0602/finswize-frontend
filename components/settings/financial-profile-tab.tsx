"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function FinancialProfileTab() {
  const [userType, setUserType] = useState("freelancer")
  const [incomeRange, setIncomeRange] = useState("3000-5000")
  const [riskTolerance, setRiskTolerance] = useState("medium")
  const [primaryGoal, setPrimaryGoal] = useState("save")

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Financial Profile</CardTitle>
        <CardDescription>This helps FinWise give better advice</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Business Type</Label>
          <RadioGroup value={userType} onValueChange={setUserType}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="freelancer" id="freelancer" />
              <Label htmlFor="freelancer" className="cursor-pointer">
                Freelancer
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="smb" id="smb" />
              <Label htmlFor="smb" className="cursor-pointer">
                Small Business Owner
              </Label>
            </div>
          </RadioGroup>
          <p className="text-xs text-muted-foreground">Why we ask this: Helps us tailor recommendations to your business model.</p>
        </div>

        <div className="space-y-2">
          <Label>Country</Label>
          <Select defaultValue="us">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="ca">Canada</SelectItem>
              <SelectItem value="uk">United Kingdom</SelectItem>
              <SelectItem value="au">Australia</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Used for tax calculations and compliance.</p>
        </div>

        <div className="space-y-2">
          <Label>Industry</Label>
          <Select defaultValue="tech">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Monthly Income Range</Label>
          <Select value={incomeRange} onValueChange={setIncomeRange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2000">$0 - $2,000</SelectItem>
              <SelectItem value="2000-3000">$2,000 - $3,000</SelectItem>
              <SelectItem value="3000-5000">$3,000 - $5,000</SelectItem>
              <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
              <SelectItem value="10000+">$10,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Typical Monthly Expenses</Label>
          <Input type="number" placeholder="3840" />
          <p className="text-xs text-muted-foreground">Average monthly spending</p>
        </div>

        <div className="space-y-3">
          <Label>Risk Tolerance</Label>
          <RadioGroup value={riskTolerance} onValueChange={setRiskTolerance}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low" className="cursor-pointer">
                Low - Prefer stability
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="cursor-pointer">
                Medium - Balanced approach
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high" className="cursor-pointer">
                High - Growth focused
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Primary Goal</Label>
          <RadioGroup value={primaryGoal} onValueChange={setPrimaryGoal}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="save" id="save" />
              <Label htmlFor="save" className="cursor-pointer">
                Save - Build reserves
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grow" id="grow" />
              <Label htmlFor="grow" className="cursor-pointer">
                Grow - Expand business
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stability" id="stability" />
              <Label htmlFor="stability" className="cursor-pointer">
                Stability - Maintain current pace
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tax" id="tax" />
              <Label htmlFor="tax" className="cursor-pointer">
                Tax Optimization
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="pt-4 border-t border-border">
          <Button>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}
