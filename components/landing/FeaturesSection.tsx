import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Zap, Users, BarChart3, Mail, Crown, Shield } from "lucide-react"

export function FeaturesSection() {
    return (
        <section className="relative py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="text-center mb-20">
                    <Badge className="mb-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-200 border-purple-500/30">
                        <Zap className="mr-2 h-4 w-4" />
                        Powerful Features
                    </Badge>
                    <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                        Everything You Need to
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Succeed</span>
                    </h2>
                    <p className="mx-auto max-w-3xl text-lg text-gray-300 sm:text-xl">
                        From beautiful landing pages to advanced analytics, we&#39;ve built the complete toolkit for modern launches.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {[
                        {
                            icon: Users,
                            title: "Multi-Project Hub",
                            description: "Manage unlimited projects from one powerful dashboard. Scale from startup to enterprise.",
                            gradient: "from-blue-500/20 to-cyan-500/20",
                            iconColor: "text-blue-400",
                            border: "border-blue-500/30"
                        },
                        {
                            icon: Zap,
                            title: "Gamification Engine",
                            description: "Boost engagement with referral systems, leaderboards, badges, and tier-based rewards.",
                            gradient: "from-purple-500/20 to-pink-500/20",
                            iconColor: "text-purple-400",
                            border: "border-purple-500/30"
                        },
                        {
                            icon: BarChart3,
                            title: "Real-time Analytics",
                            description: "Track every metric that matters. Conversion rates, user behavior, and growth insights.",
                            gradient: "from-green-500/20 to-emerald-500/20",
                            iconColor: "text-green-400",
                            border: "border-green-500/30"
                        },
                        {
                            icon: Mail,
                            title: "Smart Automation",
                            description: "Automated email sequences, notifications, and personalized user journeys.",
                            gradient: "from-orange-500/20 to-red-500/20",
                            iconColor: "text-orange-400",
                            border: "border-orange-500/30"
                        },
                        {
                            icon: Crown,
                            title: "Brand Customization",
                            description: "White-label solutions with custom domains, themes, and complete brand control.",
                            gradient: "from-yellow-500/20 to-amber-500/20",
                            iconColor: "text-yellow-400",
                            border: "border-yellow-500/30"
                        },
                        {
                            icon: Shield,
                            title: "Enterprise Security",
                            description: "Bank-grade security with JWT authentication, encrypted data, and GDPR compliance.",
                            gradient: "from-indigo-500/20 to-violet-500/20",
                            iconColor: "text-indigo-400",
                            border: "border-indigo-500/30"
                        }
                    ].map((feature, index) => (
                        <Card key={index} className={`group relative overflow-hidden border-0 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20`}>
                            <div className={`absolute inset-0 border ${feature.border} rounded-lg opacity-50`} />
                            <CardHeader className="relative">
                                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-black/20 ${feature.iconColor} backdrop-blur-sm transition-transform group-hover:scale-110`}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl text-white group-hover:text-purple-200 transition-colors">{feature.title}</CardTitle>
                                <CardDescription className="text-gray-300 leading-relaxed">{feature.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
