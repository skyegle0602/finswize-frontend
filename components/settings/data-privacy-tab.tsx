"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"

export function DataPrivacyTab() {
  return (
    <Card className="rounded-xl border">
      <CardHeader>
        <CardTitle>Data & Privacy</CardTitle>
        <CardDescription>Control your data and privacy settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-foreground mb-2">Export Data</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Download all your financial data in CSV format for backup or analysis.
          </p>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export All Data
          </Button>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground mb-2">Data Usage</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Your financial data is used to provide AI-powered insights and recommendations. We never sell your data to
            third parties.
          </p>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-foreground">
              <strong>AI Training:</strong> Your anonymized transaction patterns may be used to improve our AI models.
              Personal identifiers are never included.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground mb-2 text-destructive">Delete Account</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
