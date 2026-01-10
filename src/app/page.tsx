import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap, Layout, Rocket, Check, X } from "lucide-react"
import { VideoLoop } from "@/components/ui/video-loop"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Navbar Placeholder */}
      <header className="px-6 py-4 flex items-center justify-between border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="font-bold text-xl tracking-tight">Workfolio</div>
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button variant="ghost">Log In</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 px-6 text-center overflow-hidden">
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <VideoLoop
              src="/hero-anime.png"
              className="opacity-60"
              overlayOpacity={0.6}
            />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto space-y-8">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 backdrop-blur-sm bg-white/10">
              Now with Gemini AI
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Build a portfolio that <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">grows with you.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              An AI-powered portfolio system that helps developers present their skills, experience, and growth — beautifully and intelligently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/sign-up">
                <Button size="lg" className="h-12 px-8 text-lg group">
                  Create Your Portfolio
                  <Sparkles className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" />
                </Button>
              </Link>
              <Link href="#pricing">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg bg-background/50 backdrop-blur-sm">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ValueCard
                icon={<Sparkles className="w-6 h-6 text-yellow-500" />}
                title="AI-assisted writing"
                desc="Powered by Google Gemini to rewrite bios and enhance project descriptions."
              />
              <ValueCard
                icon={<Zap className="w-6 h-6 text-blue-500" />}
                title="Smart experience categorization"
                desc="Automatically group your history into meaningful sections like Engineering, Design, etc."
              />
              <ValueCard
                icon={<Layout className="w-6 h-6 text-purple-500" />}
                title="Fully customizable sections"
                desc="Tailor your portfolio structure to tell your unique story."
              />
              <ValueCard
                icon={<Rocket className="w-6 h-6 text-red-500" />}
                title="Deploy-ready portfolios"
                desc="Get a production-ready portfolio that is SEO optimized and fast."
              />
              <ValueCard
                icon={<Sparkles className="w-6 h-6 text-indigo-500" />}
                title="Pro tools"
                desc="Advanced analytics, premium themes, and unlimited history for serious developers."
              />
            </div>
          </div>
        </section>

        {/* Free vs Pro */}
        <section id="pricing" className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Choose your path</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="border rounded-2xl p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold">Free</h3>
                  <p className="text-muted-foreground">For getting started</p>
                </div>
                <div className="text-4xl font-bold">$0</div>
                <ul className="space-y-3">
                  <FeatureItem text="Basic portfolio" />
                  <FeatureItem text="1 experience section" />
                  <FeatureItem text="Manual editing" />
                  <FeatureItem text="Public portfolio" />
                  <FeatureItem text="AI Features" check={false} />
                  <FeatureItem text="Detailed Analytics" check={false} />
                </ul>
                <Link href="/sign-up" className="w-full block">
                  <Button variant="secondary" className="w-full">Start Free</Button>
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="border rounded-2xl p-8 space-y-6 relative border-primary bg-primary/5 shadow-xl">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  💎 Pro Feature
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">Pro</h3>
                  <p className="text-muted-foreground">For serious developers</p>
                </div>
                <div className="text-4xl font-bold">$10<span className="text-base font-normal text-muted-foreground">/mo</span></div>
                <ul className="space-y-3">
                  <FeatureItem text="Unlimited sections" />
                  <FeatureItem text="AI-powered writing" />
                  <FeatureItem text="Experience categorization" />
                  <FeatureItem text="Project enhancement" />
                  <FeatureItem text="Profile analytics" />
                  <FeatureItem text="Premium themes" />
                  <FeatureItem text="Delete & advanced editing" />
                </ul>
                <Link href="/sign-up?plan=pro" className="w-full block">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 transition-all">
                    Join Pro — Build Faster
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="py-20 border-t bg-muted/20">
          <div className="max-w-3xl mx-auto text-center px-6 space-y-6">
            <h2 className="text-3xl font-bold">Limited Time Offer</h2>
            <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-700 dark:text-yellow-400 p-6 rounded-xl">
              <p className="text-lg font-medium">🎉 First 100 users get <span className="font-bold">50% off Pro</span></p>
              <p className="text-sm opacity-80 mt-2">After that, pricing returns to standard.</p>
            </div>
            <Link href="/sign-up?plan=pro">
              <Button size="lg" className="h-14 px-10 text-xl font-semibold shadow-lg">
                Join Pro — Build Faster
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Workfolio. All rights reserved.
      </footer>
    </div>
  )
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 bg-secondary rounded-lg w-fit">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{desc}</p>
    </div>
  )
}

function FeatureItem({ text, check = true }: { text: string, check?: boolean }) {
  return (
    <li className="flex items-center gap-3">
      {check ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/50" />
      )}
      <span className={check ? "" : "text-muted-foreground/60"}>{text}</span>
    </li>
  )
}