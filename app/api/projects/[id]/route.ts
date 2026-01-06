import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import Project from "@/models/Project"
import WaitlistUser from "@/models/WaitlistUser"
import EmailCampaign from "@/models/EmailCampaign"
import { requireAuth } from "@/lib/auth"
import mongoose from "mongoose"

// Get a specific project
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    await connectToDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    const project = await Project.findOne({ _id: id, adminId: user.userId })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({ project })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Get project error:", error)
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 })
  }
}

// Update a project
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await request.json()
    await connectToDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Find project and verify ownership
    const project = await Project.findOne({ _id: id, adminId: user.userId })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // If slug is being updated, check for duplicates
    if (body.slug && body.slug !== project.slug) {
      const existingProject = await Project.findOne({ slug: body.slug })
      if (existingProject) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
      }
    }

    // Update project
    const updatedProject = await Project.findByIdAndUpdate(id, body, { new: true })

    return NextResponse.json({ project: updatedProject })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Update project error:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

// Delete a project
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    await connectToDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Find project and verify ownership
    const project = await Project.findOne({ _id: id, adminId: user.userId })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Delete all related data
    await Promise.all([
      WaitlistUser.deleteMany({ projectId: id }),
      EmailCampaign.deleteMany({ projectId: id }),
      Project.findByIdAndDelete(id)
    ])

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Delete project error:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
