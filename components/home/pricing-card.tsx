import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import type { FC } from "react"

interface PricingCardProps {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant?: "default" | "outline" | "secondary"
  isPopular?: boolean
  isPrimary?: boolean
  checkIconColor?: string
  textColor?: string
}

const PricingCard: FC<PricingCardProps> = ({
  name,
  price,
  period,
  description,
  features,
  buttonText,
  buttonVariant = "outline",
  isPopular = false,
  isPrimary = false,
  checkIconColor = "text-accent",
  textColor,
}) => {
  const cardClassName = isPrimary
    ? "bg-primary border-2 border-primary relative"
    : "bg-card border border-border"

  const titleColor = isPrimary ? "text-primary-foreground" : "text-card-foreground"
  const priceColor = isPrimary ? "text-primary-foreground" : "text-foreground"
  const descColor = isPrimary ? "text-primary-foreground/80" : "text-muted-foreground"
  const featureTextColor = isPrimary ? "text-primary-foreground/90" : textColor || "text-muted-foreground"

  return (
    <Card className={cardClassName}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
          Most Popular
        </div>
      )}
      <CardHeader className="mb-6">
        <CardTitle className={`text-xl font-semibold ${titleColor} mb-2`}>{name}</CardTitle>
        <div className="flex items-baseline gap-1 mb-4">
          <span className={`text-4xl font-bold ${priceColor}`}>{price}</span>
          <span className={descColor}>/{period}</span>
        </div>
        <p className={`text-sm ${descColor}`}>{description}</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className={`w-5 h-5 ${checkIconColor} shrink-0 mt-0.5`} />
              <span className={`text-sm ${featureTextColor}`}>{feature}</span>
            </li>
          ))}
        </ul>
        <Link href="/auth/signup">
          <Button variant={buttonVariant} className={isPrimary ? "w-full" : "w-full bg-transparent"}>
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export default PricingCard
