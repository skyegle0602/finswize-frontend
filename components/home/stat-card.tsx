import { Card, CardContent } from "@/components/ui/card"
import type { FC } from "react"

interface StatCardProps {
  value: string
  label: string
  valueColor?: string
}

const StatCard: FC<StatCardProps> = ({ value, label, valueColor = "text-primary" }) => {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold ${valueColor} mb-2`}>{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

export default StatCard
