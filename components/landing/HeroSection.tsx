import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Sparkles, Rocket, ArrowRight, CheckCircle } from "lucide-react"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
            <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-32 lg:py-40">
                <div className="text-center">
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm backdrop-blur-sm">
                        <Sparkles className="h-4 w-4 text-purple-400 animate-spin" />
                        <span className="text-purple-200">Trusted by 10,000+ creators worldwide</span>
                        <Badge className="ml-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">New</Badge>
                    </div>

                    <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        <span className="text-white">Build Epic</span>
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                            Waitlists
                        </span>
                    </h1>

                    <p className="mx-auto mb-12 max-w-3xl text-lg text-gray-300 sm:text-xl lg:text-2xl">
                        Create stunning waitlist experiences with gamification, real-time analytics, and automated campaigns.
                        <span className="text-white font-semibold">Launch faster, grow bigger.</span>
                    </p>

                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button asChild size="lg" className="group h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-105">
                            <Link href="/register">
                                <Rocket className="mr-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                                Start Building Free
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-14 px-8 border-purple-500/50 text-purple-200 hover:text-white hover:bg-purple-500/20 backdrop-blur-sm transition-all duration-300">
                            <Link href="/login">View Demo</Link>
                        </Button>
                    </div>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Free forever plan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span>Setup in 2 minutes</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
