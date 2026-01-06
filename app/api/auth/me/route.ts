import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { connectToDB } from "@/lib/mongoose"
import Admin from "@/models/Admin"

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    await connectToDB()
    const admin = await Admin.findById(user.userId).select("username email subscriptionTier subscriptionStatus")

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        userId: admin._id,
        username: admin.username,
        email: admin.email,
        subscriptionTier: admin.subscriptionTier,
        subscriptionStatus: admin.subscriptionStatus,
      },
    })
  } catch (error: any) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 })
  }
}
