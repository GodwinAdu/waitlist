import { NextResponse } from "next/server"
import Admin from "@/models/Admin"
import { requireAuth } from "@/lib/auth"
import { connectToDB } from "@/lib/mongoose"

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 })
    }

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    const paystackData = await paystackResponse.json()

    if (!paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    await connectToDB()

    const tier = paystackData.data.metadata.tier
    const amount = paystackData.data.amount / 100 // Convert from kobo to cedis

    // Update admin subscription
    const now = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1) // 1 month subscription

    await Admin.findByIdAndUpdate(user.userId, {
      subscriptionTier: tier,
      subscriptionStatus: "active",
      subscriptionReference: reference,
      subscriptionStartDate: now,
      subscriptionEndDate: endDate,
      $push: {
        paymentHistory: {
          reference,
          amount,
          currency: "GHS",
          status: "success",
          paidAt: now,
        },
      },
    })

    return NextResponse.json({
      success: true,
      tier,
      message: "Subscription activated successfully",
    })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Verify payment error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}