"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function OnboardingPage() {
  const router = useRouter()
  const { isLoaded: authLoaded, userId } = useAuth()
  const { user, isLoaded: userLoaded } = useUser()
  const [step, setStep] = useState(1)
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    businessType: "",
    monthlyIncome: "",
    currency: "USD",
    financialGoals: [] as string[],
  })

  useEffect(() => {
    if (!authLoaded || !userLoaded) return

    // Check if user is authenticated
    if (!userId) {
      router.push("/auth/signup")
      return
    }

    // Get user info from Clerk or sessionStorage
    if (user) {
      const firstName = user.firstName || ""
      const lastName = user.lastName || ""
      setDisplayName(`${firstName} ${lastName}`.trim() || user.emailAddresses[0]?.emailAddress || "")
    } else {
      // Fallback to sessionStorage for email/password signups
      const name = sessionStorage.getItem("signupName")
      if (name) {
        setDisplayName(name)
      }
    }
  }, [authLoaded, userLoaded, userId, user, router])

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      setIsLoading(true)
      setError(null)

      try {
        // TODO: Save onboarding data to your backend API
        // Example: await fetch('/api/user/onboarding', { method: 'POST', body: JSON.stringify({ ...formData, displayName }) })
        
        // Clear sessionStorage
        sessionStorage.removeItem("signupName")
        sessionStorage.removeItem("signupEmail")
        sessionStorage.removeItem("signupPassword")

        // Redirect to dashboard after completing onboarding
        router.push("/dashboard")
        router.refresh()
      } catch (err: any) {
        setError(err.message || "Failed to complete onboarding")
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/auth/signup")
    }
  }

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      financialGoals: prev.financialGoals.includes(goal)
        ? prev.financialGoals.filter((g) => g !== goal)
        : [...prev.financialGoals, goal],
    }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-semibold text-foreground">FinsWize</span>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-8 bg-primary" : i < step ? "w-2 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "Tell us about your business"}
              {step === 2 && "Your financial situation"}
              {step === 3 && "Set your goals"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Help us personalize your experience"}
              {step === 2 && "This helps us provide better recommendations"}
              {step === 3 && "What would you like to achieve?"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>What best describes you?</Label>
                  <RadioGroup
                    value={formData.businessType}
                    onValueChange={(value) => setFormData({ ...formData, businessType: value })}
                  >
                    <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="freelancer" id="freelancer" />
                      <Label htmlFor="freelancer" className="flex-1 cursor-pointer">
                        <div className="font-medium">Freelancer</div>
                        <div className="text-sm text-muted-foreground">Independent contractor or consultant</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="small-business" id="small-business" />
                      <Label htmlFor="small-business" className="flex-1 cursor-pointer">
                        <div className="font-medium">Small Business Owner</div>
                        <div className="text-sm text-muted-foreground">Running a small business with employees</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="side-hustle" id="side-hustle" />
                      <Label htmlFor="side-hustle" className="flex-1 cursor-pointer">
                        <div className="font-medium">Side Hustle</div>
                        <div className="text-sm text-muted-foreground">Part-time business alongside main job</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="income">Average Monthly Income</Label>
                  <div className="flex gap-2">
                    <Input
                      id="income"
                      type="number"
                      placeholder="5000"
                      value={formData.monthlyIncome}
                      onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                      className="flex-1"
                    />
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="px-3 py-2 border border-input rounded-md bg-background"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                  <p className="text-sm text-muted-foreground">This helps us provide accurate budget recommendations</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>What are your financial goals? (Select all that apply)</Label>
                  <div className="space-y-2">
                    {[
                      {
                        id: "save-emergency",
                        label: "Build Emergency Fund",
                        description: "Save 3-6 months of expenses",
                      },
                      { id: "reduce-expenses", label: "Reduce Expenses", description: "Cut unnecessary spending" },
                      { id: "grow-business", label: "Grow Business", description: "Invest in business expansion" },
                      {
                        id: "plan-retirement",
                        label: "Plan for Retirement",
                        description: "Long-term financial security",
                      },
                    ].map((goal) => (
                      <div
                        key={goal.id}
                        className="flex items-center space-x-3 border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          id={goal.id}
                          checked={formData.financialGoals.includes(goal.id)}
                          onCheckedChange={() => toggleGoal(goal.id)}
                        />
                        <Label htmlFor={goal.id} className="flex-1 cursor-pointer">
                          <div className="font-medium">{goal.label}</div>
                          <div className="text-sm text-muted-foreground">{goal.description}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <Button variant="ghost" onClick={handleBack} disabled={isLoading} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={handleNext} disabled={isLoading} className="gap-2">
                {isLoading ? "Creating account..." : step === 3 ? "Complete Setup" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
