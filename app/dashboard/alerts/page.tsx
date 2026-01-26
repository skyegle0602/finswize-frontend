"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Bell, AlertCircle, CheckCircle, Settings, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Alert {
  id: string
  type: "warning" | "info" | "success" | "critical"
  category: string
  title: string
  message: string
  timestamp: string
  read: boolean
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "critical",
      category: "Budget",
      title: "Marketing Budget Exceeded",
      message: "You've spent $1,240 of your $1,200 marketing budget this month.",
      timestamp: "2025-01-15T10:30:00",
      read: false,
    },
    {
      id: "2",
      type: "warning",
      category: "Budget",
      title: "Business Tools Budget Alert",
      message: "You've used 85% of your business tools budget. $225 remaining.",
      timestamp: "2025-01-14T15:45:00",
      read: false,
    },
    {
      id: "3",
      type: "info",
      category: "Transaction",
      title: "Large Transaction Detected",
      message: "A transaction of $850 was recorded for 'Adobe Creative Cloud Annual'.",
      timestamp: "2025-01-13T09:20:00",
      read: true,
    },
    {
      id: "4",
      type: "success",
      category: "Goal",
      title: "Savings Milestone Reached",
      message: "Congratulations! You've reached 70% of your Emergency Fund goal.",
      timestamp: "2025-01-12T14:00:00",
      read: true,
    },
    {
      id: "5",
      type: "info",
      category: "Insight",
      title: "Spending Pattern Detected",
      message: "Your coffee shop expenses are up 40% this month compared to last month.",
      timestamp: "2025-01-11T11:30:00",
      read: true,
    },
    {
      id: "6",
      type: "warning",
      category: "Budget",
      title: "Monthly Spending Pace",
      message: "You're on track to exceed your total monthly budget by $300 at current spending rate.",
      timestamp: "2025-01-10T08:15:00",
      read: true,
    },
  ])

  const [alertSettings, setAlertSettings] = useState({
    budgetAlerts: true,
    goalMilestones: true,
    largeTransactions: true,
    spendingPatterns: true,
    emailNotifications: false,
    pushNotifications: true,
  })

  const unreadCount = alerts.filter((alert) => !alert.read).length

  const markAsRead = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, read: true } : alert)))
  }

  const markAllAsRead = () => {
    setAlerts(alerts.map((alert) => ({ ...alert, read: true })))
  }

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
  }

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-chart-3" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-accent" />
      default:
        return <Bell className="w-5 h-5 text-primary" />
    }
  }

  const getAlertBorderColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "border-destructive/20 bg-destructive/5"
      case "warning":
        return "border-chart-3/20 bg-chart-3/5"
      case "success":
        return "border-accent/20 bg-accent/5"
      default:
        return "border-primary/20 bg-primary/5"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Stay informed about your financial activity</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead} className="bg-transparent">
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            All
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">No alerts yet</p>
                <p className="text-sm text-muted-foreground">You'll see notifications about your finances here</p>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id} className={`${getAlertBorderColor(alert.type)} ${!alert.read ? "border-l-4" : ""}`}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{alert.title}</h3>
                            {!alert.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" aria-label="Unread" />
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {alert.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(alert.timestamp)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{alert.message}</p>
                      {!alert.read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)}>
                          Mark as Read
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {alerts.filter((alert) => !alert.read).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="w-12 h-12 text-accent mb-4" />
                <p className="text-lg font-medium text-foreground mb-2">All caught up!</p>
                <p className="text-sm text-muted-foreground">You have no unread alerts</p>
              </CardContent>
            </Card>
          ) : (
            alerts
              .filter((alert) => !alert.read)
              .map((alert) => (
                <Card
                  key={alert.id}
                  className={`${getAlertBorderColor(alert.type)} ${!alert.read ? "border-l-4" : ""}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{alert.title}</h3>
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" aria-label="Unread" />
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {alert.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatTimestamp(alert.timestamp)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => deleteAlert(alert.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">{alert.message}</p>
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(alert.id)}>
                          Mark as Read
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Alert Preferences
              </CardTitle>
              <CardDescription>Customize which alerts you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Alert Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="budget-alerts" className="text-sm font-medium">
                        Budget Alerts
                      </Label>
                      <p className="text-xs text-muted-foreground">Get notified when approaching budget limits</p>
                    </div>
                    <Switch
                      id="budget-alerts"
                      checked={alertSettings.budgetAlerts}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, budgetAlerts: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="goal-milestones" className="text-sm font-medium">
                        Goal Milestones
                      </Label>
                      <p className="text-xs text-muted-foreground">Celebrate when you reach savings milestones</p>
                    </div>
                    <Switch
                      id="goal-milestones"
                      checked={alertSettings.goalMilestones}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, goalMilestones: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="large-transactions" className="text-sm font-medium">
                        Large Transactions
                      </Label>
                      <p className="text-xs text-muted-foreground">Alert for transactions over $500</p>
                    </div>
                    <Switch
                      id="large-transactions"
                      checked={alertSettings.largeTransactions}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, largeTransactions: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="spending-patterns" className="text-sm font-medium">
                        Spending Patterns
                      </Label>
                      <p className="text-xs text-muted-foreground">AI insights about your spending habits</p>
                    </div>
                    <Switch
                      id="spending-patterns"
                      checked={alertSettings.spendingPatterns}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, spendingPatterns: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications" className="text-sm font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={alertSettings.emailNotifications}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, emailNotifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications" className="text-sm font-medium">
                        Push Notifications
                      </Label>
                      <p className="text-xs text-muted-foreground">Receive alerts in the app</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={alertSettings.pushNotifications}
                      onCheckedChange={(checked) => setAlertSettings({ ...alertSettings, pushNotifications: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
