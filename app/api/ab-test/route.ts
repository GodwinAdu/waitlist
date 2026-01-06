import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import ABTestView from "@/models/ABTestView"

export async function POST(request: Request) {
  try {
    const { projectId, variantId, sessionId, userAgent, ipAddress } = await request.json()

    await connectToDB()

    // Check if view already exists for this session
    const existingView = await ABTestView.findOne({ projectId, sessionId })
    
    if (existingView) {
      return NextResponse.json({ success: true, existing: true })
    }

    // Create new view
    await ABTestView.create({
      projectId,
      variantId,
      sessionId,
      userAgent,
      ipAddress,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("A/B test view error:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { projectId, sessionId } = await request.json()

    await connectToDB()

    // Mark as converted
    await ABTestView.findOneAndUpdate(
      { projectId, sessionId },
      { converted: true, convertedAt: new Date() }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("A/B test conversion error:", error)
    return NextResponse.json({ error: "Failed to track conversion" }, { status: 500 })
  }
}