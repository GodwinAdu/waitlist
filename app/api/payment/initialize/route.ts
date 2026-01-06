import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import WaitlistUser from "@/models/WaitlistUser"
import Project from "@/models/Project"
import { initializePaystackPayment } from "@/lib/paystack"

export async function POST(request: Request) {
  try {
    const { userId, tierName } = await request.json()

    if (!userId || !tierName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await connectToDB()

    const user = await WaitlistUser.findById(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const project = await Project.findById(user.projectId)
    if (!project || !project.subscriptionEnabled) {
      return NextResponse.json({ error: "Subscriptions not enabled" }, { status: 400 })
    }

    const tier = project.subscriptionTiers?.find((t) => t.name === tierName && t.isActive)
    if (!tier) {
      return NextResponse.json({ error: "Subscription tier not found" }, { status: 404 })
    }

    const paymentData = await initializePaystackPayment(user.email, tier.price, {
      userId: user._id.toString(),
      projectId: project._id.toString(),
      tierName: tier.name,
    })

    return NextResponse.json(paymentData)
  } catch (error) {
    console.error("[v0] Payment initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}
