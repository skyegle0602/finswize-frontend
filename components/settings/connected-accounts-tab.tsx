"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, AlertTriangle } from "lucide-react"

export function ConnectedAccountsTab() {
  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>Manage your connected financial accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-foreground">Chase Business Checking</p>
              <p className="text-sm text-muted-foreground">****1234</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Connected</span>
              <Button size="sm" variant="ghost">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Last synced: 5 minutes ago</p>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-foreground">Stripe</p>
              <p className="text-sm text-muted-foreground">Payment processing</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">Connected</span>
              <Button size="sm" variant="ghost">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Last synced: 1 hour ago</p>
        </div>

        <div className="pt-4 border-t border-border">
          <Button variant="outline" className="w-full">
            Connect New Account
          </Button>
        </div>

        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-900">
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Disconnecting accounts will stop automatic transaction imports and may affect AI insights.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
