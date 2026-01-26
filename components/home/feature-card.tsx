import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import type { FC } from "react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  iconBgColor?: string
  iconColor?: string
}

const FeatureCard: FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  iconBgColor = "bg-primary/10",
  iconColor = "text-primary",
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center mb-4`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

export default FeatureCard
