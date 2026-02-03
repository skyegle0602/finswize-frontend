import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FC } from "react"

interface AboutCardProps {
  title: string
  description: string
}

const AboutCard: FC<AboutCardProps> = ({ title, description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-card-foreground mb-3">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

export default AboutCard
