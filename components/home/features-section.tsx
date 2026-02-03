import { TrendingUp, Target, Bell, Sparkles } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { FC } from "react"
import FeatureCard from "./feature-card"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
  iconBgColor: string
  iconColor: string
}

const features: Feature[] = [
  {
    icon: TrendingUp,
    title: "AI-Guided Budgeting",
    description: "Smart categorization and personalized budget recommendations based on your spending patterns",
    iconBgColor: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Target,
    title: "Smart Savings Goals",
    description: "Set realistic goals with AI suggestions and track your progress with visual insights",
    iconBgColor: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: Bell,
    title: "Spending Alerts",
    description: "Real-time notifications about overspending and unusual transactions to stay in control",
    iconBgColor: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  {
    icon: Sparkles,
    title: "Personalized Advice",
    description: "AI-driven financial recommendations tailored to your income, expenses, and goals",
    iconBgColor: "bg-chart-4/10",
    iconColor: "text-chart-4",
  },
]

const FeaturesSection: FC = () => {
  return (
    <section id="features" className="container mx-auto px-4 py-20 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Manage Your Finances
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI-driven features designed specifically for freelancers and small business owners
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconBgColor={feature.iconBgColor}
              iconColor={feature.iconColor}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
