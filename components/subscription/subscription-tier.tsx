"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Loader2 } from "lucide-react"
import type { ISubscriptionTier } from "@/models/Project"

interface SubscriptionTiersProps {
  tiers: ISubscriptionTier[]
  userId: string
  primaryColor?: string
}

export function SubscriptionTiers({ tiers, userId, primaryColor }: SubscriptionTiersProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (tierName: string) => {
    setLoading(tierName)

    try {
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          tierName,
        }),
      })

      const data = await response.json()

      if (response.ok && data.data?.authorization_url) {
        window.location.href = data.data.authorization_url
      } else {
        alert("Failed to initialize payment. Please try again.")
        setLoading(null)
      }
    } catch (error) {
      console.error("[v0] Payment error:", error)
      alert("An error occurred. Please try again.")
      setLoading(null)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tiers
        .filter((tier) => tier.isActive)
        .map((tier) => (
          <Card key={tier.name} className="flex flex-col">
            <CardHeader>
              <CardTitle style={{ color: primaryColor }}>{tier.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">
                  {tier.currency} {tier.price.toFixed(2)}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                style={{ backgroundColor: primaryColor }}
                onClick={() => handleSubscribe(tier.name)}
                disabled={loading !== null}
              >
                {loading === tier.name ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe Now"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
    </div>
  )
}
