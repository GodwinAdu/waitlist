"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, CreditCard, LayoutDashboard, Rocket } from "lucide-react"
import Link from "next/link"

export function AdminHeader() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      })

      if (response.ok) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative">
              <Rocket className="h-6 w-6 text-purple-400" />
              <div className="absolute inset-0 h-6 w-6 bg-purple-400/20 rounded-full blur-md" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              WaitlistPro
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300" asChild>
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300" asChild>
              <Link href="/admin/billing">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Link>
            </Button>
          </nav>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout} 
          disabled={isLoggingOut}
          className="text-gray-300 hover:text-white hover:bg-red-500/20 transition-all duration-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </header>
  )
}