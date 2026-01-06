import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import WaitlistUser from "@/models/WaitlistUser"
import Project from "@/models/Project"
import { requireAuth } from "@/lib/auth"
import mongoose from "mongoose"
import { sendEmail } from "@/lib/email"

// Send notification emails to waitlist users
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await request.json()
    const { userIds, subject, message } = body

    await connectToDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Verify project ownership
    const project = await Project.findOne({ _id: id, adminId: user.userId })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Validation
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: "User IDs are required" }, { status: 400 })
    }

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message are required" }, { status: 400 })
    }

    // Get users to notify
    const users = await WaitlistUser.find({
      _id: { $in: userIds },
      projectId: id,
    })

    if (users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 })
    }

    // Send emails
    const results = await Promise.allSettled(
      users.map(async (waitlistUser) => {
        await sendEmail({
          to: waitlistUser.email,
          subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: ${project.primaryColor};">${project.name}</h1>
              <p>Hi ${waitlistUser.name},</p>
              <div style="margin: 20px 0;">
                ${message.replace(/\n/g, "<br>")}
              </div>
              <p>Best regards,<br>${project.name} Team</p>
            </div>
          `,
        })

        // Mark as notified
        await WaitlistUser.findByIdAndUpdate(waitlistUser._id, {
          isNotified: true,
          notifiedAt: new Date(),
        })
      }),
    )

    const successCount = results.filter((r) => r.status === "fulfilled").length
    const failureCount = results.filter((r) => r.status === "rejected").length

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failureCount,
      message: `Sent ${successCount} notifications successfully`,
    })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Send notification error:", error)
    return NextResponse.json({ error: "Failed to send notifications" }, { status: 500 })
  }
}

// Mark users as notified without sending emails
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await request.json()
    const { userIds } = body

    await connectToDB()

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 })
    }

    // Verify project ownership
    const project = await Project.findOne({ _id: id, adminId: user.userId })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Update users
    const result = await WaitlistUser.updateMany(
      { _id: { $in: userIds }, projectId: id },
      { isNotified: true, notifiedAt: new Date() },
    )

    return NextResponse.json({
      success: true,
      updated: result.modifiedCount,
    })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Mark notified error:", error)
    return NextResponse.json({ error: "Failed to mark users as notified" }, { status: 500 })
  }
}
