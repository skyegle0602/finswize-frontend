"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function BillingTab() {
  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Billing & Subscription</CardTitle>
        <CardDescription>Manage your plan and payment method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-foreground">Pro Plan</p>
              <p className="text-sm text-muted-foreground">$9.99/month</p>
            </div>
            <Button variant="outline">Change Plan</Button>
          </div>
          <p className="text-sm text-muted-foreground">Renews on February 24, 2025</p>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4">Payment Method</h3>
          <div className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Visa •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/2026</p>
              </div>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-4">Invoices</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">January 2025</p>
                <p className="text-xs text-muted-foreground">$9.99</p>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">December 2024</p>
                <p className="text-xs text-muted-foreground">$9.99</p>
              </div>
              <Button size="sm" variant="ghost">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
