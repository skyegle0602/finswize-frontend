"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"

export function SecurityTab() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Keep your account and financial data safe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Change Password</h3>
            <p className="text-sm text-muted-foreground mb-4">Update your password to keep your account secure.</p>
            <Button variant="outline">Change Password</Button>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  We strongly recommend enabling 2FA for financial accounts.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {twoFactorEnabled && <Check className="w-5 h-5 text-green-600" />}
                <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
              </div>
            </div>
            {twoFactorEnabled && (
              <p className="text-xs text-green-600 mt-2">2FA is enabled. Your account is more secure.</p>
            )}
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground mb-2">Active Sessions</h3>
            <p className="text-sm text-muted-foreground mb-4">Manage devices where you're signed in.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Windows PC • Chrome</p>
                  <p className="text-xs text-muted-foreground">Current session • Last active: Now</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">iPhone • Safari</p>
                  <p className="text-xs text-muted-foreground">Last active: 2 hours ago</p>
                </div>
                <Button size="sm" variant="ghost">
                  Sign Out
                </Button>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full">
              Sign Out of All Devices
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
