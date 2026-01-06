import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import Admin from "@/models/Admin"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const user = await requireAuth()
    await connectToDB()

    const admin = await Admin.findById(user.userId).select(
      "subscriptionTier subscriptionStatus subscriptionStartDate subscriptionEndDate paymentHistory",
    )

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({
      tier: admin.subscriptionTier,
      status: admin.subscriptionStatus,
      startDate: admin.subscriptionStartDate,
      endDate: admin.subscriptionEndDate,
      paymentHistory: admin.paymentHistory,
    })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Get subscription error:", error)
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 })
  }
}
