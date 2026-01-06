import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Rocket } from "lucide-react"

export function Navbar() {
    return (
        <nav className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Rocket className="h-6 w-6 text-purple-400 animate-bounce" />
                        <div className="absolute inset-0 h-6 w-6 bg-purple-400/20 rounded-full blur-md" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        WaitlistPro
                    </span>
                </div>
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
    )
}
