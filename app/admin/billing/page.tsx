"use client"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2, CreditCard, Crown, Shield, Rocket, Sparkles, TrendingUp } from "lucide-react"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription"

export default function BillingPage() {
  const [currentSubscription, setCurrentSubscription] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processingTier, setProcessingTier] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [subscriptionRes, userRes] = await Promise.all([fetch("/api/admin/subscription"), fetch("/api/auth/me")])

      if (subscriptionRes.ok) {
        const data = await subscriptionRes.json()
        setCurrentSubscription(data)
      }

      if (userRes.ok) {
        const userData = await userRes.json()
        setCurrentUser(userData.user)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubscribe = async (tier: string) => {
    if (!currentUser?.email) {
      alert("Unable to process subscription. Please try logging in again.")
      return
    }

    setProcessingTier(tier)
    try {
      const response = await fetch("/api/subscription/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier,
          email: currentUser.email,
        }),
      })

      if (!response.ok) throw new Error("Failed to initialize subscription")

      const data = await response.json()
      window.location.href = data.authorizationUrl
    } catch (error) {
      console.error("Error subscribing:", error)
      alert("Failed to initialize subscription")
    } finally {
      setProcessingTier(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <AdminHeader />
        <main className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500 mx-auto mb-4" />
            <p className="text-gray-300">Loading billing information...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-40 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <AdminHeader />
      
      <main className="relative mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm backdrop-blur-sm mb-4">
            <CreditCard className="h-4 w-4 text-purple-400" />
            <span className="text-purple-200">Subscription Management</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Billing & Subscription</h2>
          <p className="text-gray-300">Manage your subscription plan and billing information</p>
        </div>

        {/* Current Plan Card */}
        {currentSubscription && (
          <Card className="mb-8 border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Crown className="h-5 w-5 text-yellow-400" />
                Current Plan
              </CardTitle>
              <CardDescription className="text-gray-300">Your active subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold capitalize text-white">{currentSubscription.tier}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={currentSubscription.status === "active" ? "bg-green-600" : "bg-red-600"}>
                      {currentSubscription.status === "active" ? "Active" : "Expired"}
                    </Badge>
                    {currentSubscription.endDate && (
                      <span className="text-sm text-gray-300">
                        Expires: {new Date(currentSubscription.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg px-4 py-2">
                    {SUBSCRIPTION_PLANS[currentSubscription.tier as keyof typeof SUBSCRIPTION_PLANS].price === 0
                      ? "Free"
                      : `₵${SUBSCRIPTION_PLANS[currentSubscription.tier as keyof typeof SUBSCRIPTION_PLANS].price}/month`}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Plans */}
        <div className="mb-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm backdrop-blur-sm mb-4">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-purple-200">Choose Your Plan</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">Upgrade Your Experience</h3>
            <p className="text-gray-300">Scale your waitlist projects with advanced features</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan], index) => (
              <Card key={key} className={`group relative overflow-hidden transition-all duration-500 hover:scale-105 ${
                currentSubscription?.tier === key 
                  ? 'border-purple-500/50 bg-gradient-to-b from-purple-900/30 to-pink-900/30 shadow-2xl shadow-purple-500/20 scale-105' 
                  : 'border-white/10 bg-black/20 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10'
              }`}>
                {key === 'pro' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${
                    key === 'free' ? 'bg-gradient-to-br from-gray-600 to-gray-800' :
                    key === 'pro' ? 'bg-gradient-to-br from-purple-600 to-pink-600' :
                    'bg-gradient-to-br from-indigo-600 to-purple-600'
                  }`}>
                    {key === 'free' && <Rocket className="h-8 w-8 text-white" />}
                    {key === 'pro' && <Crown className="h-8 w-8 text-white" />}
                    {key === 'enterprise' && <Shield className="h-8 w-8 text-white" />}
                  </div>
                  
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-4xl font-bold text-white mt-4">
                    {plan.price === 0 ? "Free" : `₵${plan.price}`}
                    {plan.price > 0 && <span className="text-lg text-gray-400 font-normal">/month</span>}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="mb-8 space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-400" />
                        <span className="text-sm text-gray-300 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {currentSubscription?.tier === key ? (
                    <Button disabled className="w-full bg-gray-600 text-gray-300">
                      Current Plan
                    </Button>
                  ) : key === "free" ? (
                    <Button disabled variant="outline" className="w-full border-gray-600 text-gray-400">
                      Downgrade Not Available
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleSubscribe(key)} 
                      disabled={processingTier === key} 
                      className={`w-full transition-all duration-300 ${
                        key === 'pro' 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-purple-500/50' 
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                      }`}
                    >
                      {processingTier === key ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Upgrade Now"
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment History */}
        {currentSubscription?.paymentHistory && currentSubscription.paymentHistory.length > 0 && (
          <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-5 w-5 text-purple-400" />
                Payment History
              </CardTitle>
              <CardDescription className="text-gray-300">Your past transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSubscription.paymentHistory.map((payment: any, index: number) => (
                  <div key={index} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0">
                    <div>
                      <p className="font-medium text-white">
                        {payment.currency} {payment.amount}
                      </p>
                      <p className="text-sm text-gray-400">{new Date(payment.paidAt).toLocaleDateString()}</p>
                    </div>
                    <Badge className={payment.status === "success" ? "bg-green-600" : "bg-gray-600"}>
                      {payment.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}