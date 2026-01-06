import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Star, Rocket, Crown, Shield, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription"

export function PricingSection() {
    return (
        <section className="relative py-20 sm:py-32">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-transparent" />
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                <div className="text-center mb-20">
                    <Badge className="mb-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-200 border-purple-500/30">
                        <Star className="mr-2 h-4 w-4" />
                        Transparent Pricing
                    </Badge>
                    <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                        Choose Your
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Growth Plan</span>
                    </h2>
                    <p className="mx-auto max-w-3xl text-lg text-gray-300 sm:text-xl">
                        Start free and scale seamlessly. No hidden fees, no surprises.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan], index) => (
                        <Card key={key} className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 ${key === 'pro'
                                ? 'border-purple-500/50 bg-gradient-to-b from-purple-900/30 to-pink-900/30 shadow-2xl shadow-purple-500/20 lg:scale-105'
                                : 'border-white/10 bg-black/20 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10'
                            }`}>
                            {key === 'pro' && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg animate-pulse">
                                        <Star className="mr-1 h-3 w-3" />
                                        Most Popular
                                    </Badge>
                                </div>
                            )}

                            <CardHeader className="relative text-center">
                                <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${key === 'free' ? 'bg-gradient-to-br from-gray-600 to-gray-800' :
                                        key === 'pro' ? 'bg-gradient-to-br from-purple-600 to-pink-600' :
                                            'bg-gradient-to-br from-indigo-600 to-purple-600'
                                    }`}>
                                    {key === 'free' && <Rocket className="h-8 w-8 text-white" />}
                                    {key === 'pro' && <Crown className="h-8 w-8 text-white" />}
                                    {key === 'enterprise' && <Shield className="h-8 w-8 text-white" />}
                                </div>

                                <CardTitle className="text-2xl text-white capitalize">{plan.name}</CardTitle>

                                <div className="mt-6">
                                    <span className="text-5xl font-bold text-white">
                                        {plan.price === 0 ? 'Free' : `₵${plan.price}`}
                                    </span>
                                    {plan.price > 0 && <span className="text-lg text-gray-400">/month</span>}
                                </div>

                                <CardDescription className="mt-4 text-gray-300">
                                    {key === 'free' && 'Perfect for getting started and testing ideas'}
                                    {key === 'pro' && 'Ideal for growing businesses and serious creators'}
                                    {key === 'enterprise' && 'Built for large organizations and agencies'}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="relative">
                                <ul className="mb-8 space-y-4">
                                    {plan.features.map((feature, featureIndex) => (
                                        <li key={featureIndex} className="flex items-start gap-3">
                                            <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                                            <span className="text-sm leading-relaxed text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button asChild className={`w-full transition-all duration-300 group ${key === 'pro'
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/50'
                                        : 'border-purple-500/50 text-purple-200 hover:text-white hover:bg-purple-500/20'
                                    }`} variant={key === 'pro' ? 'default' : 'outline'}>
                                    <Link href="/register">
                                        {key === 'free' ? 'Start Free' : key === 'pro' ? 'Go Pro' : 'Contact Sales'}
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
