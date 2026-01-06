import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import WaitlistUser from "@/models/WaitlistUser"
import Project from "@/models/Project"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    await connectToDB()

    const project = await Project.findById(id)
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Get top 10 referrers
    const leaderboard = await WaitlistUser.find({ projectId: id })
      .sort({ referralCount: -1, createdAt: 1 })
      .limit(10)
      .select("name referralCount tier points badges createdAt")
      .lean()

    return NextResponse.json({ leaderboard })
  } catch (error: any) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}
