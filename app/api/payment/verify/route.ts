import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import WaitlistUser from "@/models/WaitlistUser"
import { verifyPaystackPayment } from "@/lib/paystack"

export async function POST(request: Request) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: "Missing payment reference" }, { status: 400 })
    }

    const verification = await verifyPaystackPayment(reference)

    if (!verification.status || verification.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    await connectToDB()

    const { userId, tierName } = verification.data.metadata

    const user = await WaitlistUser.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    user.isPaid = true
    user.subscriptionTier = tierName
    user.paystackReference = reference
    user.paymentVerifiedAt = new Date()
    await user.save()

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      user: {
        id: user._id,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        isPaid: user.isPaid,
      },
    })
  } catch (error) {
    console.error("[v0] Payment verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
