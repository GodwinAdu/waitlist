import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import Project from "@/models/Project"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    await connectToDB()
    
    const project = await Project.findOne({ slug, isActive: true }).lean()
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
    
    return NextResponse.json({ project })
  } catch (error) {
    console.error("Get project by slug error:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}