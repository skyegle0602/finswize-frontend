import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import FeaturesSection from "@/components/home/features-section"
import PricingSection from "@/components/home/pricing-section"
import AboutSection from "@/components/home/about-section"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header isLoggedIn={false} />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm mb-6">
            <span className="w-2 h-2 bg-accent rounded-full"></span>
            AI-Powered Financial Intelligence
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Smart Finance Management for Freelancers & SMBs
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Take control of your finances with AI-guided budgeting, smart savings goals, and personalized advice
            tailored to your business needs.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className=" text-white text-sm gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* About Section */}
      <AboutSection />

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-primary rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg text-primary-foreground/90 mb-8">
            Join thousands of freelancers and small businesses managing their finances smarter with FinWise
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary" className="text-white text-sm gap-2">
              Start Your Free Trial <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  )
}
