import type { FC } from "react"
import PricingCard from "./pricing-card"

interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant: "default" | "outline" | "secondary"
  isPopular?: boolean
  isPrimary?: boolean
  checkIconColor: string
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    price: "$0",
    period: "month",
    description: "Perfect for getting started",
    features: [
      "Basic budgeting tools",
      "Up to 3 savings goals",
      "Basic spending alerts",
      "Monthly financial reports",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline",
    checkIconColor: "text-accent",
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "month",
    description: "For serious freelancers",
    features: [
      "Everything in Free",
      "Unlimited savings goals",
      "AI-powered insights",
      "Advanced spending alerts",
      "Priority support",
    ],
    buttonText: "Start Free Trial",
    buttonVariant: "secondary",
    isPopular: true,
    isPrimary: true,
    checkIconColor: "text-primary-foreground",
  },
  {
    name: "Business",
    price: "$29.99",
    period: "month",
    description: "For growing businesses",
    features: [
      "Everything in Pro",
      "Multi-user access",
      "Advanced analytics",
      "Custom integrations",
      "Dedicated account manager",
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline",
    checkIconColor: "text-accent",
  },
]

const PricingSection: FC = () => {
  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. Start free, upgrade anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard
              key={index}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              buttonText={plan.buttonText}
              buttonVariant={plan.buttonVariant}
              isPopular={plan.isPopular}
              isPrimary={plan.isPrimary}
              checkIconColor={plan.checkIconColor}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
