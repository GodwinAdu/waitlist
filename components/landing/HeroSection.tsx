import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Sparkles, Rocket, ArrowRight, CheckCircle } from "lucide-react"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
            <div className="relative mobile-container max-w-7xl mx-auto py-16 sm:py-24 lg:py-32">
                <div className="text-center">
                    <div className="mb-6 sm:mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm backdrop-blur-sm">
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400 animate-spin" />
                        <span className="text-purple-200">Trusted by 10,000+ creators</span>
                        <Badge className="ml-1 sm:ml-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs px-2 py-0.5">New</Badge>
                    </div>

                    <h1 className="mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                        <span className="text-white">Build Epic</span>
                        <br />
                        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                            Waitlists
                        </span>
                    </h1>

                    <p className="mx-auto mb-8 sm:mb-12 max-w-2xl lg:max-w-3xl text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-300 leading-relaxed">
                        Create stunning waitlist experiences with gamification, real-time analytics, and automated campaigns.
                        <span className="block sm:inline text-white font-semibold mt-1 sm:mt-0 sm:ml-1">Launch faster, grow bigger.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center">
                        <Button asChild size="lg" className="group h-12 sm:h-14 px-6 sm:px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-105 text-sm sm:text-base">
                            <Link href="/register">
                                <Rocket className="mr-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-12" />
                                Start Building Free
                                <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 border-purple-500/50 text-purple-200 hover:text-white hover:bg-purple-500/20 backdrop-blur-sm transition-all duration-300 text-sm sm:text-base">
                            <Link href="/login">View Demo</Link>
                        </Button>
                    </div>

                    <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-400">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                            <span>Free forever plan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                            <span>Setup in 2 minutes</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
