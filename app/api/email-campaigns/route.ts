import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import EmailCampaign from "@/models/EmailCampaign"
import { requireAuth } from "@/lib/auth"
import Project from "@/models/Project"

export async function GET() {
  try {
    const user = await requireAuth()
    console.log("User ID:", user.userId)
    await connectToDB()
    
    const campaigns = await EmailCampaign.find({ createdBy: user.userId })
      .populate({path:'projectId', model:Project, select:'name slug'})
      .sort({ createdAt: -1 })

      console.log("Campaigns:", campaigns)
    
    return NextResponse.json({ campaigns })
  } catch (error: any) {
    console.error("Email campaigns fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    console.log("Received campaign data:", body)
    
    if (!body.projectId || !body.name || !body.subject || !body.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    await connectToDB()
    
    const campaign = await EmailCampaign.create({
      ...body,
      createdBy: user.userId
    })
    
    return NextResponse.json({ campaign }, { status: 201 })
  } catch (error: any) {
    console.error("Email campaign creation error:", error)
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 })
  }
}