import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, CheckCircle, Rocket, Users, Settings, BarChart3, Mail, Crown, Sparkles, Zap } from "lucide-react"

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-40 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <Rocket className="h-6 w-6 text-purple-400 animate-bounce" />
              <div className="absolute inset-0 h-6 w-6 bg-purple-400/20 rounded-full blur-md" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              WaitlistPro
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button asChild variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
              <Link href="/how-to-use">How to Use</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-purple-400 animate-spin" />
            <span className="text-purple-200">Step-by-Step Guide</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            How to Use
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> WaitlistPro</span>
          </h1>
          <p className="mb-12 text-lg text-gray-300 sm:text-xl">
            Get started in minutes. Follow our simple guide to create your first waitlist and start building hype for your launch.
          </p>
          <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-105 group">
            <Link href="/register">
              Start Building Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Steps Section */}
      <section className="relative px-4 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 text-center">
            <Badge className="mb-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-200 border-purple-500/30">
              <Zap className="mr-2 h-4 w-4" />
              Simple Process
            </Badge>
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">Get Started in 5 Simple Steps</h2>
            <p className="text-lg text-gray-300">
              From signup to launch, here's everything you need to know
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {[
              {
                number: 1,
                icon: Users,
                title: "Create Your Account",
                description: "Sign up for free at /register. No credit card required. You'll start with the Free plan that includes 3 projects and 50 users per project.",
                features: ["Instant account activation", "Free plan with 3 projects", "50 waitlist users per project"],
                gradient: "from-blue-500/20 to-cyan-500/20",
                iconColor: "text-blue-400",
                border: "border-blue-500/30"
              },
              {
                number: 2,
                icon: Settings,
                title: "Create Your First Project",
                description: "From your admin dashboard, click \"New Project\" to create your first waitlist. Add your project details, branding, and launch date.",
                features: ["Project name and description", "Custom branding and colors", "Launch date and features"],
                gradient: "from-purple-500/20 to-pink-500/20",
                iconColor: "text-purple-400",
                border: "border-purple-500/30"
              },
              {
                number: 3,
                icon: Crown,
                title: "Customize Your Landing Page",
                description: "Personalize your waitlist page with your brand colors, logo, and messaging. Enable gamification features like referrals and leaderboards.",
                features: ["Upload logo and set colors", "Enable referral system", "Configure leaderboard and badges"],
                gradient: "from-yellow-500/20 to-amber-500/20",
                iconColor: "text-yellow-400",
                border: "border-yellow-500/30"
              },
              {
                number: 4,
                icon: Rocket,
                title: "Share Your Waitlist",
                description: "Get your unique project URL (e.g., /project/your-project-slug) and start sharing it with your audience across social media, email, and other channels.",
                features: ["Unique project URL", "Social media sharing", "Email campaigns"],
                gradient: "from-green-500/20 to-emerald-500/20",
                iconColor: "text-green-400",
                border: "border-green-500/30"
              }
            ].map((step, index) => (
              <Card key={index} className={`group relative overflow-hidden border-0 bg-gradient-to-br ${step.gradient} backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20`}>
                <div className={`absolute inset-0 border ${step.border} rounded-lg opacity-50`} />
                <div className="absolute -left-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-bold text-white shadow-lg">
                  {step.number}
                </div>
                <CardHeader className="relative">
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-black/20 ${step.iconColor} backdrop-blur-sm transition-transform group-hover:scale-110`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-purple-200 transition-colors">{step.title}</CardTitle>
                  <CardDescription className="text-gray-300 leading-relaxed">{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}

            {/* Step 5 - Full Width */}
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 lg:col-span-2">
              <div className="absolute inset-0 border border-indigo-500/30 rounded-lg opacity-50" />
              <div className="absolute -left-4 -top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-bold text-white shadow-lg">
                5
              </div>
              <CardHeader className="relative">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex gap-4">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-black/20 text-indigo-400 backdrop-blur-sm transition-transform group-hover:scale-110">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-black/20 text-indigo-400 backdrop-blur-sm transition-transform group-hover:scale-110">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white group-hover:text-purple-200 transition-colors">Monitor & Launch</CardTitle>
                    <CardDescription className="text-gray-300 leading-relaxed">
                      Track your signups with real-time analytics, manage your waitlist users, and send launch notifications when you're ready to go live.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-3 font-semibold text-white">Analytics & Insights</h4>
                    <ul className="space-y-2 text-sm">
                      {["Real-time signup tracking", "Referral performance", "User engagement metrics"].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-3 font-semibold text-white">Launch Management</h4>
                    <ul className="space-y-2 text-sm">
                      {["Bulk email notifications", "CSV export for external tools", "User management dashboard"].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">Pro Tips for Success</h2>
            <p className="text-lg text-gray-300">
              Maximize your waitlist performance with these proven strategies
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { emoji: "🎯", title: "Create Urgency", description: "Set a launch date and use countdown timers to create urgency. Limited spots or early bird bonuses work great too." },
              { emoji: "🏆", title: "Gamify the Experience", description: "Enable referral rewards, leaderboards, and achievement badges to encourage users to share and engage more." },
              { emoji: "📱", title: "Share Everywhere", description: "Promote your waitlist on social media, in your email signature, on your website, and in relevant communities." },
              { emoji: "📊", title: "Monitor Performance", description: "Check your analytics regularly to see which channels drive the most signups and optimize your strategy." }
            ].map((tip, index) => (
              <Card key={index} className="border-white/10 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg text-white group-hover:text-purple-200 transition-colors">
                    <span className="text-2xl">{tip.emoji}</span>
                    {tip.title}
                  </CardTitle>
                  <CardDescription className="text-gray-300 leading-relaxed">
                    {tip.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-6 py-3 backdrop-blur-sm animate-pulse">
            <Sparkles className="h-5 w-5 text-purple-400" />
            <span className="font-medium text-purple-200">Ready to get started?</span>
          </div>
          
          <h2 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
            Ready to Create Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Waitlist?</span>
          </h2>
          
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
            Start building anticipation for your launch today. It takes less than 5 minutes to get started.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-105 group">
              <Link href="/register">
                Start Building Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 border-purple-500/50 text-purple-200 hover:text-white hover:bg-purple-500/20 backdrop-blur-sm transition-all duration-300">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Rocket className="h-5 w-5 text-purple-400" />
                <div className="absolute inset-0 h-5 w-5 bg-purple-400/20 rounded-full blur-md" />
              </div>
              <span className="font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                WaitlistPro
              </span>
            </div>
            <p className="text-sm text-gray-400">
              © 2024 WaitlistPro. Built with ❤️ for creators worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}