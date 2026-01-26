import type { FC } from "react"
import AboutCard from "./about-card"
import StatCard from "./stat-card"
import { Card, CardContent } from "@/components/ui/card"

interface AboutInfo {
  title: string
  description: string
}

interface Stat {
  value: string
  label: string
  valueColor: string
}

const aboutInfo: AboutInfo[] = [
  {
    title: "Our Mission",
    description:
      "We believe that every freelancer and small business owner deserves access to sophisticated financial tools. FinsWize combines cutting-edge AI technology with intuitive design to make financial management simple, smart, and accessible.",
  },
  {
    title: "Why Choose Us",
    description:
      "Unlike traditional finance apps, FinsWize is built specifically for the unique needs of freelancers and SMBs. Our AI learns from your spending patterns to provide personalized insights that help you make better financial decisions.",
  },
]

const stats: Stat[] = [
  {
    value: "10K+",
    label: "Active Users",
    valueColor: "text-primary",
  },
  {
    value: "$50M+",
    label: "Money Managed",
    valueColor: "text-accent",
  },
  {
    value: "98%",
    label: "Satisfaction Rate",
    valueColor: "text-chart-4",
  },
]

const AboutSection: FC = () => {
  return (
    <section id="about" className="container mx-auto px-4 py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About FinsWize</h2>
          <p className="text-lg text-muted-foreground">
            Empowering freelancers and small businesses with intelligent financial management
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {aboutInfo.map((info, index) => (
            <AboutCard key={index} title={info.title} description={info.description} />
          ))}
        </div>

        <Card>
          <CardContent className="p-8 text-center">
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  value={stat.value}
                  label={stat.label}
                  valueColor={stat.valueColor}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default AboutSection
