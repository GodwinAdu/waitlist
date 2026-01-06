import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Rocket, ArrowRight, Shield, CheckCircle, Star } from "lucide-react"

export function CTASection() {
    return (
        <section className="relative py-20 sm:py-32">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-pink-900/20 to-purple-900/20" />
            <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-6 py-3 backdrop-blur-sm animate-pulse">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    <span className="font-medium text-purple-200">Join 10,000+ successful launches</span>
                </div>

                <h2 className="mb-6 text-4xl font-bold text-white sm:text-6xl">
                    Ready to Launch Your
                    <br />
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                        Next Big Thing?
                    </span>
                </h2>

                <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
                    Join thousands of creators who trust WaitlistPro to build anticipation and drive growth.
                </p>

                <Button asChild size="lg" className="group h-16 px-12 text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 transform hover:scale-105">
                    <Link href="/register">
                        <Rocket className="mr-3 h-6 w-6 transition-transform group-hover:rotate-12" />
                        Start Building Today
                        <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </Button>

                <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-400" />
                        <span>Enterprise-grade security</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>99.9% uptime guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span>5-star customer support</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
