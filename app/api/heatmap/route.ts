import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import HeatmapData from "@/models/HeatmapData"
import { generateHeatmapVisualization } from "@/lib/heatmap"

export async function POST(request: Request) {
  try {
    const { projectId, sessionId, events, viewport, userAgent } = await request.json()
    
    await connectToDB()
    
    await HeatmapData.findOneAndUpdate(
      { projectId, sessionId },
      {
        $push: { events: { $each: events } },
        viewport,
        userAgent
      },
      { upsert: true }
    )
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Heatmap tracking error:", error)
    return NextResponse.json({ error: "Failed to track heatmap data" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const timeRange = searchParams.get('timeRange') || '7d'
    
    if (!projectId) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 })
    }
    
    const heatmapData = await generateHeatmapVisualization(projectId, timeRange)
    
    return NextResponse.json({ heatmapData })
  } catch (error: any) {
    console.error("Heatmap API error:", error)
    return NextResponse.json({ error: "Failed to generate heatmap" }, { status: 500 })
  }
}