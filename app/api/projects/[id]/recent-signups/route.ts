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

    // Get last 5 signups
    const recentSignups = await WaitlistUser.find({ projectId: id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name createdAt")
      .lean()

    return NextResponse.json({ recentSignups })
  } catch (error: any) {
    console.error("Recent signups error:", error)
    return NextResponse.json({ error: "Failed to fetch recent signups" }, { status: 500 })
  }
}
