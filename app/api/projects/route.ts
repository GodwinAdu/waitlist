import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import Project from "@/models/Project"
import Admin from "@/models/Admin"
import { requireAuth } from "@/lib/auth"
import { canCreateProject } from "@/lib/subscription"

// Get all projects for the authenticated admin
export async function GET() {
  try {
    const user = await requireAuth()
    console.log("User:", user)
    await connectToDB()

    const projects = await Project.find({ }).sort({ createdAt: -1 })

    console.log("Projects:", projects)

    return NextResponse.json({ projects })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

// Create a new project
export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const body = await request.json()

    const { name, slug, description, tagline, logo, primaryColor, backgroundImage, launchDate, features, images, videos, abTestEnabled, variants } = body

    // Validation
    if (!name || !slug || !description) {
      return NextResponse.json({ error: "Name, slug, and description are required" }, { status: 400 })
    }

    await connectToDB()

    const admin = await Admin.findById(user.userId)
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 })
    }

    const projectCount = await Project.countDocuments({ adminId: user.userId })
    if (!canCreateProject(admin.subscriptionTier, projectCount, admin.subscriptionStatus, admin.subscriptionEndDate)) {
      return NextResponse.json(
        {
          error: "Cannot create projects. Please renew your subscription to continue.",
          currentTier: admin.subscriptionTier,
        },
        { status: 403 },
      )
    }

    // Check if slug already exists
    const existingProject = await Project.findOne({ slug })
    if (existingProject) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
    }

    // Create project
    const project = await Project.create({
      name,
      slug: slug.toLowerCase().trim(),
      description,
      tagline,
      logo,
      primaryColor,
      backgroundImage,
      launchDate,
      features,
      images: images || [],
      videos: videos || [],
      abTestEnabled: abTestEnabled || false,
      variants: variants || [],
      adminId: user.userId,
    })

    return NextResponse.json({ project }, { status: 201 })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Create project error:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
