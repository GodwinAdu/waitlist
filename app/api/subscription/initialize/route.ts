import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { tier, email } = body

    if (!tier || !["pro", "enterprise"].includes(tier)) {
      return NextResponse.json({ error: "Invalid subscription tier" }, { status: 400 })
    }

    const plan = SUBSCRIPTION_PLANS[tier as keyof typeof SUBSCRIPTION_PLANS]

    // Initialize Paystack payment
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: plan.price * 100, // Paystack expects amount in kobo (pesewas for GHS)
        currency: "GHS",
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/billing/verify`,
        metadata: {
          userId: user.userId,
          tier,
          plan_name: plan.name,
        },
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status) {
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
    }

    return NextResponse.json({
      authorizationUrl: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Initialize subscription error:", error)
    return NextResponse.json({ error: "Failed to initialize subscription" }, { status: 500 })
  }
}
