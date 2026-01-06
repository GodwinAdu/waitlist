import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import WaitlistUser from "@/models/WaitlistUser"
import Project from "@/models/Project"
import { requireAuth } from "@/lib/auth"
import mongoose from "mongoose"

// Export waitlist as CSV
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    await connectToDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Verify project ownership
    const project = await Project.findOne({ _id: id, adminId: user.userId })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Get all waitlist users
    const users = await WaitlistUser.find({ projectId: id }).sort({ position: 1 }).lean()

    // Generate CSV
    const csvHeader = "Position,Name,Email,Phone,Role,Message,Notified,Joined Date\n"
    const csvRows = users
      .map((user: any) => {
        return [
          user.position,
          `"${user.name}"`,
          user.email,
          user.phone || "",
          user.role || "",
          user.message ? `"${user.message.replace(/"/g, '""')}"` : "",
          user.isNotified ? "Yes" : "No",
          new Date(user.createdAt).toISOString(),
        ].join(",")
      })
      .join("\n")

    const csv = csvHeader + csvRows

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${project.slug}-waitlist-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Export waitlist error:", error)
    return NextResponse.json({ error: "Failed to export waitlist" }, { status: 500 })
  }
}
