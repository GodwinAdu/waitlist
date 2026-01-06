"use server"

import { connectToDB } from "@/lib/mongoose"
import Project from "@/models/Project"
import WaitlistUser from "@/models/WaitlistUser"
import Admin from "@/models/Admin"
import { getCurrentUser } from "@/lib/auth"

export async function getProjectsAction() {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    await connectToDB()

    const projects = await Project.find({ adminId: user.userId })
      .sort({ createdAt: -1 })
      .lean()

    return JSON.parse(JSON.stringify(projects))
  } catch (error) {
    console.error("Get projects error:", error)
    return null
  }
}

export async function getProjectByIdAction(projectId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    await connectToDB()

    const project = await Project.findOne({
      _id: projectId,
      adminId: user.userId,
    }).lean()

    return project ? JSON.parse(JSON.stringify(project)) : null
  } catch (error) {
    console.error("Get project error:", error)
    return null
  }
}

export async function getProjectBySlugAction(slug: string) {
  try {
    await connectToDB()

    const project = await Project.findOne({ slug }).lean()
    return project ? JSON.parse(JSON.stringify(project)) : null
  } catch (error) {
    console.error("Get project by slug error:", error)
    return null
  }
}

export async function getWaitlistUsersAction(projectId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    await connectToDB()

    // Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      adminId: user.userId,
    })

    if (!project) return null

    const users = await WaitlistUser.find({ projectId })
      .sort({ createdAt: -1 })
      .lean()

    return JSON.parse(JSON.stringify(users))
  } catch (error) {
    console.error("Get waitlist users error:", error)
    return null
  }
}

export async function getProjectAnalyticsAction(projectId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    await connectToDB()

    // Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      adminId: user.userId,
    })

    if (!project) return null

    const totalSignups = await WaitlistUser.countDocuments({ projectId })
    const notifiedCount = await WaitlistUser.countDocuments({ 
      projectId, 
      isNotified: true 
    })

    // Get daily signups for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailySignups = await WaitlistUser.aggregate([
      {
        $match: {
          projectId: project._id,
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    return {
      totalSignups,
      notifiedCount,
      dailySignups: JSON.parse(JSON.stringify(dailySignups))
    }
  } catch (error) {
    console.error("Get analytics error:", error)
    return null
  }
}

export async function getUserSubscriptionAction() {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    await connectToDB()

    const admin = await Admin.findById(user.userId)
      .select('subscriptionTier subscriptionStatus subscriptionEndDate paymentHistory')
      .lean()

    return admin ? JSON.parse(JSON.stringify(admin)) : null
  } catch (error) {
    console.error("Get subscription error:", error)
    return null
  }
}