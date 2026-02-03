"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"
import { useState, KeyboardEvent } from "react"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
  placeholder?: string
}

const exampleQuestions = [
  "Can I afford to hire someone?",
  "Why did my profit drop?",
  "What should I focus on this month?",
  "Is my runway healthy?",
]

export function ChatInput({ onSend, isLoading = false, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim())
      setMessage("")
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder || "Ask about cash flow, expenses, hiring, or future plans..."}
          disabled={isLoading}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={isLoading || !message.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {exampleQuestions.map((question, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={() => {
              setMessage(question)
              setTimeout(() => handleSend(), 100)
            }}
            disabled={isLoading}
            className="text-xs"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  )
}
