"use client"

import { ContextBar } from "@/components/ai-advisor/context-bar"
import { ChatMessage } from "@/components/ai-advisor/chat-message"
import { QuickActions } from "@/components/ai-advisor/quick-actions"
import { ChatInput } from "@/components/ai-advisor/chat-input"
import { useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"

interface Message {
  id: string
  isAI: boolean
  message: string
  reason?: string
  actions?: Array<{
    label: string
    href?: string
    onClick?: () => void
    variant?: "default" | "outline"
  }>
  dataSource?: string
  suggestedNextStep?: string
}

export default function AIAdvisorPage() {
  const searchParams = useSearchParams()
  const context = searchParams.get("context")
  const goalId = searchParams.get("goalId")

  // Mock data - in production, this would come from your backend
  const lastSynced = "Jan 24, 2025"
  const cashBalance = 12450
  const runway = 4.2
  const alertCount = 2

  // Fetch saving goal data if context is provided
  const [goalData, setGoalData] = useState<any>(null)
  const [isLoadingGoal, setIsLoadingGoal] = useState(false)

  useEffect(() => {
    if (context === "saving-goal" && goalId) {
      setIsLoadingGoal(true)
      fetch(`/api/saving-goals/${goalId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.goal) {
            setGoalData(data.goal)
          }
        })
        .catch((error) => {
          console.error("Error fetching goal:", error)
        })
        .finally(() => {
          setIsLoadingGoal(false)
        })
    }
  }, [context, goalId])

  // Generate data-driven first message
  const getInitialMessage = (): Message => {
    // If context is saving-goal, show goal-specific message
    if (context === "saving-goal" && goalData) {
      const progress = (goalData.savedAmount / goalData.targetAmount) * 100
      const remaining = goalData.targetAmount - goalData.savedAmount
      const monthsNeeded = goalData.monthlyContribution > 0 
        ? Math.ceil(remaining / goalData.monthlyContribution)
        : Infinity
      
      return {
        id: "1",
        isAI: true,
        message: `I see you're working on your "${goalData.name}" goal. You've saved $${goalData.savedAmount.toLocaleString()} of $${goalData.targetAmount.toLocaleString()} (${progress.toFixed(0)}% complete).`,
        reason: goalData.isPaused
          ? "This goal is currently paused. Would you like to resume it or adjust your plan?"
          : monthsNeeded !== Infinity
          ? `At your current rate of $${goalData.monthlyContribution.toLocaleString()}/month, you'll reach your goal in about ${monthsNeeded} month${monthsNeeded > 1 ? "s" : ""}.`
          : "Consider setting a monthly contribution to track your progress.",
        actions: [
          { label: "Adjust goal", href: `/dashboard/planning?tab=goals&goalId=${goalId}`, variant: "default" },
          { label: "View planning", href: "/dashboard/planning", variant: "outline" },
        ],
        dataSource: `Based on your "${goalData.name}" saving goal`,
        suggestedNextStep: goalData.isPaused ? "Resume or adjust your goal in Planning" : "Adjust your monthly contribution to reach your goal faster",
      }
    }

    // Default message
    const runwayText = runway < 3 ? "below the safe zone" : runway < 6 ? "needs attention" : "is healthy"
    const alertText = alertCount > 0 ? `${alertCount} alert${alertCount > 1 ? "s" : ""} may affect your cash flow this month` : "no urgent alerts"
    
    return {
      id: "1",
      isAI: true,
      message: `You currently have ${runway.toFixed(1)} months of runway. ${alertCount > 0 ? `${alertCount} alert${alertCount > 1 ? "s" : ""} may affect your cash flow this month.` : "Your finances look stable."}`,
      reason: alertCount > 0 
        ? "Want me to explain them or help you plan next steps?"
        : "Want to explore growth scenarios or review your spending?",
      actions: alertCount > 0
        ? [
            { label: "Explain alerts", href: "/dashboard/alerts", variant: "default" },
            { label: "Plan next steps", href: "/dashboard/planning", variant: "outline" },
          ]
        : [
            { label: "Explore scenarios", href: "/dashboard/planning", variant: "default" },
            { label: "Review spending", href: "/dashboard/spending", variant: "outline" },
          ],
      dataSource: `Based on transactions from Jan 1–24, 2025`,
      suggestedNextStep: alertCount > 0 ? "Open alerts to resolve issues" : "Create a planning scenario",
    }
  }

  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Initialize messages when goal data is loaded or on mount
  useEffect(() => {
    if (context === "saving-goal") {
      if (!isLoadingGoal) {
        setMessages([getInitialMessage()])
      }
    } else {
      setMessages([getInitialMessage()])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalData, isLoadingGoal, context])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()

    // Simple rule-based responses (in production, this would call your AI API)
    if (lowerMessage.includes("hire") || lowerMessage.includes("afford")) {
      return {
        id: Date.now().toString(),
        isAI: true,
        message: "Yes — you can afford this.",
        reason: `Adding a $120/month expense reduces your runway from ${runway.toFixed(1)} → ${(runway - 0.4).toFixed(1)} months.`,
        actions: [
          { label: "View scenario", href: "/dashboard/planning", variant: "default" },
          { label: "Adjust budget", href: "/dashboard/planning", variant: "outline" },
        ],
        dataSource: "Based on current cash balance and monthly expenses",
        suggestedNextStep: "Open a planning scenario to simulate this change",
      }
    }

    if (lowerMessage.includes("profit") || lowerMessage.includes("drop")) {
      return {
        id: Date.now().toString(),
        isAI: true,
        message: "Your profit dropped due to increased marketing spend.",
        reason: "Google Ads expenses increased by $320 this month, while revenue stayed flat.",
        actions: [
          { label: "View transactions", href: "/dashboard/spending", variant: "default" },
          { label: "Review marketing", href: "/dashboard/spending", variant: "outline" },
        ],
        dataSource: "Based on transactions from Jan 1–24, 2025",
        suggestedNextStep: "Review marketing transactions to identify optimization opportunities",
      }
    }

    if (lowerMessage.includes("runway") || lowerMessage.includes("healthy")) {
      const isHealthy = runway >= 6
      return {
        id: Date.now().toString(),
        isAI: true,
        message: isHealthy ? "Your runway is healthy." : "Your runway needs attention.",
        reason: isHealthy
          ? `You have ${runway.toFixed(1)} months of runway, which is above the 6-month safety threshold.`
          : `You have ${runway.toFixed(1)} months of runway. Consider reducing expenses or increasing revenue to reach 6 months.`,
        actions: [
          { label: "Open planning", href: "/dashboard/planning", variant: "default" },
          { label: "View details", href: "/dashboard", variant: "outline" },
        ],
        dataSource: "Based on current cash balance and monthly burn rate",
        suggestedNextStep: isHealthy ? "Explore growth scenarios" : "Plan cost reduction to extend runway",
      }
    }

    if (lowerMessage.includes("focus") || lowerMessage.includes("month")) {
      return {
        id: Date.now().toString(),
        isAI: true,
        message: "Focus on extending your runway and reviewing your alerts.",
        reason: `You have ${alertCount} alert${alertCount > 1 ? "s" : ""} that need attention, and your runway is below 6 months.`,
        actions: [
          { label: "View alerts", href: "/dashboard/alerts", variant: "default" },
          { label: "Plan improvements", href: "/dashboard/planning", variant: "outline" },
        ],
        dataSource: "Based on your current financial snapshot and active alerts",
        suggestedNextStep: alertCount > 0 ? "Open alerts to resolve issues first" : "Open planning to extend runway",
      }
    }

    if (lowerMessage.includes("subscription") || lowerMessage.includes("recurring")) {
      return {
        id: Date.now().toString(),
        isAI: true,
        message: "You have several subscriptions that could be optimized.",
        reason: "Personal subscriptions like Netflix and gym membership cost $65/month. Consider canceling to improve profit margin.",
        actions: [
          { label: "Review subscriptions", href: "/dashboard/planning", variant: "default" },
          { label: "View spending", href: "/dashboard/spending", variant: "outline" },
        ],
        dataSource: "Based on recurring transactions from Jan 1–24, 2025",
        suggestedNextStep: "Review subscriptions in Planning to identify savings",
      }
    }

    // Default response
    return {
      id: Date.now().toString(),
      isAI: true,
      message: "I can help you understand your finances better.",
      reason: "Try asking about your runway, profit, expenses, or alerts. I can also help you plan scenarios.",
      actions: [
        { label: "Check runway", href: "/dashboard/planning", variant: "outline" },
        { label: "View alerts", href: "/dashboard/alerts", variant: "outline" },
      ],
      dataSource: "Based on your financial data",
      suggestedNextStep: "Open planning to explore scenarios",
    }
  }

  const handleSend = async (userMessage: string) => {
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      isAI: false,
      message: userMessage,
    }
    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage)
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 800)
  }

  const handleQuickAction = (action: string) => {
    // Could trigger a specific question or action
    console.log("Quick action clicked:", action)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Advisor</h1>
          <p className="text-muted-foreground">Your thinking partner for financial decisions</p>
        </div>

        {/* Context Bar */}
        <ContextBar
          lastSynced={lastSynced}
          cashBalance={cashBalance}
          runway={runway}
          alertCount={alertCount}
        />

        {/* Chat Area */}
        <div className="mb-6">
          <div className="space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto pb-4">
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                isAI={msg.isAI}
                message={msg.message}
                reason={msg.reason}
                actions={msg.actions}
                dataSource={msg.dataSource}
                suggestedNextStep={msg.suggestedNextStep}
              />
            ))}
            {isLoading && (
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex-1">
                  <div className="rounded-xl border p-4 bg-muted/30">
                    <p className="text-muted-foreground">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActions alertCount={alertCount} runway={runway} onActionClick={handleQuickAction} />

        {/* Chat Input */}
        <div className="mt-6">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
