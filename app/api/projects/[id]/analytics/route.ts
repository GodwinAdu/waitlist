import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import WaitlistUser from "@/models/WaitlistUser"
import Project from "@/models/Project"
import { requireAuth } from "@/lib/auth"
import mongoose from "mongoose"

// Get analytics for a project
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

    // Get total signups
    const totalSignups = await WaitlistUser.countDocuments({ projectId: id })

    // Get signups by role
    const signupsByRole = await WaitlistUser.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $project: { role: "$_id", count: 1, _id: 0 } },
    ])

    // Get daily signups for last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailySignups = await WaitlistUser.aggregate([
      {
        $match: {
          projectId: new mongoose.Types.ObjectId(id),
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", count: 1, _id: 0 } },
    ])

    // Get referral stats
    const totalReferrals = await WaitlistUser.countDocuments({
      projectId: id,
      referredBy: { $ne: null },
    })

    // Get notified count
    const notifiedCount = await WaitlistUser.countDocuments({
      projectId: id,
      isNotified: true,
    })

    // Get geographic distribution
    const geographic = await WaitlistUser.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(id), country: { $ne: null } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: "$_id",
          count: 1,
          percentage: { $multiply: [{ $divide: ["$count", totalSignups] }, 100] },
          _id: 0
        }
      }
    ])

    // Get traffic sources
    const trafficSources = await WaitlistUser.aggregate([
      { $match: { projectId: new mongoose.Types.ObjectId(id), trafficSource: { $ne: null } } },
      { $group: { _id: "$trafficSource", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: "$_id",
          count: 1,
          percentage: { $multiply: [{ $divide: ["$count", totalSignups] }, 100] },
          _id: 0
        }
      }
    ])

    return NextResponse.json({
      totalSignups,
      signupsByRole,
      dailySignups,
      totalReferrals,
      notifiedCount,
      geographic,
      trafficSources,
    })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    console.error("Get analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
