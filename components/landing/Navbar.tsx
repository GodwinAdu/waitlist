"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Rocket, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="relative z-50 border-b border-white/10 bg-black/20 backdrop-blur-xl">
            <div className="mobile-container flex h-16 max-w-7xl mx-auto items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 animate-bounce" />
                        <div className="absolute inset-0 h-5 w-5 sm:h-6 sm:w-6 bg-purple-400/20 rounded-full blur-md" />
                    </div>
                    <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                        WaitlistPro
                    </span>
                </div>
                
                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center gap-4">
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

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="sm:hidden touch-friendly p-2 text-gray-300 hover:text-white transition-colors"
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="sm:hidden border-t border-white/10 bg-black/40 backdrop-blur-xl">
                    <div className="mobile-container py-4 space-y-3">
                        <Button asChild variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
                            <Link href="/how-to-use" onClick={() => setIsOpen(false)}>How to Use</Link>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
                            <Link href="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
                        </Button>
                        <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                            <Link href="/register" onClick={() => setIsOpen(false)}>Get Started</Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    )
}
