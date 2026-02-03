"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Lightbulb, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface TaxSetAsideCalculatorProps {
  monthlyIncome: number
  country?: string
}

export function TaxSetAsideCalculator({ monthlyIncome, country = "us" }: TaxSetAsideCalculatorProps) {
  const [taxRate, setTaxRate] = useState([25])
  const [selectedCountry, setSelectedCountry] = useState(country)

  // Estimated tax rates by country (simplified)
  const countryTaxRates: Record<string, number> = {
    us: 25,
    ca: 30,
    uk: 20,
    au: 32,
  }

  const annualIncome = monthlyIncome * 12
  const estimatedTaxRate = selectedCountry ? countryTaxRates[selectedCountry] || 25 : taxRate[0]
  const monthlyTaxReserve = (annualIncome * (estimatedTaxRate / 100)) / 12
  const quarterlyTaxReserve = monthlyTaxReserve * 3

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <CardTitle>Tax Set-Aside</CardTitle>
        </div>
        <CardDescription>How much should you save for taxes?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Country</label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
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
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-foreground">Estimated Tax Rate</label>
            <span className="text-lg font-bold text-foreground">{estimatedTaxRate}%</span>
          </div>
          <Slider
            value={[estimatedTaxRate]}
            onValueChange={(value) => setTaxRate(value)}
            min={15}
            max={45}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-2">Conservative estimate recommended</p>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Monthly Reserve</span>
            <span className="text-2xl font-bold text-foreground">${monthlyTaxReserve.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Quarterly Payment</span>
            <span className="text-lg font-semibold text-foreground">${quarterlyTaxReserve.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Annual Tax Estimate</span>
            <span className="text-lg font-semibold text-foreground">${(annualIncome * (estimatedTaxRate / 100)).toLocaleString()}</span>
          </div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Recommendation:</strong> Set aside ${monthlyTaxReserve.toFixed(0)} each month. This covers your
            estimated tax liability and prevents surprises at tax time.
          </p>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-900">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            <strong>Note:</strong> Tax rates vary by income level and deductions. Consult a tax professional for accurate
            estimates.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
