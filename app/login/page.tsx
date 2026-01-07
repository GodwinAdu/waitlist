"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Rocket, ArrowRight, Sparkles, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      router.push("/admin")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mobile-viewport bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-20 -left-20 sm:top-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-20 right-1/3 sm:bottom-40 w-40 h-40 sm:w-80 sm:h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative flex mobile-viewport items-center justify-center mobile-container">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 sm:mb-6">
              <div className="relative">
                <Rocket className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 animate-bounce" />
                <div className="absolute inset-0 h-6 w-6 sm:h-8 sm:w-8 bg-purple-400/20 rounded-full blur-md" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                WaitlistPro
              </span>
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm backdrop-blur-sm mb-4">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
              <span className="text-purple-200">Welcome back!</span>
            </div>
          </div>

          {/* Login Card */}
          <Card className="border-white/10 bg-black/20 backdrop-blur-xl shadow-2xl shadow-purple-500/10 mobile-card">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="mx-auto mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl text-white">Admin Login</CardTitle>
              <CardDescription className="text-gray-300 text-sm">
                Sign in to manage your waitlist projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {error && (
                  <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-400 backdrop-blur-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-200 text-sm">Username</Label>
                  <Input
                    id="username"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter your username"
                    className="mobile-input border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20 backdrop-blur-sm h-11 sm:h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200 text-sm">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    className="mobile-input border-white/20 bg-white/5 text-white placeholder:text-gray-400 focus:border-purple-500/50 focus:ring-purple-500/20 backdrop-blur-sm h-11 sm:h-10"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full touch-friendly bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 group text-sm sm:text-base" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                      Signing in...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link 
                      href="/register" 
                      className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Create one now
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Back to Home */}
          <div className="mt-4 sm:mt-6 text-center mobile-safe">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-400 hover:text-purple-400 transition-colors touch-friendly"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}