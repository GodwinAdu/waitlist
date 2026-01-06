"use server"

import { connectToDB } from "@/lib/mongoose"
import Project from "@/models/Project"
import WaitlistUser from "@/models/WaitlistUser"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function joinWaitlistAction(formData: FormData) {
  let isSuccess = false
  let newReferralCode = ""
  let projectSlug = ""

  try {
    projectSlug = formData.get("projectSlug") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const role = formData.get("role") as string
    const referralCode = formData.get("referralCode") as string

    if (!name || !email) {
      return { error: "Name and email are required" }
    }

    await connectToDB()

    const project = await Project.findOne({ slug: projectSlug })
    if (!project) {
      return { error: "Project not found" }
    }

    // Check if email already exists
    const existingUser = await WaitlistUser.findOne({
      projectId: project._id,
      email,
    })

    if (existingUser) {
      return { error: "Email already registered for this waitlist" }
    }

    // Handle referral
    let referredBy = null
    if (referralCode) {
      const referrer = await WaitlistUser.findOne({
        projectId: project._id,
        referralCode,
      })
      if (referrer) {
        referredBy = referrer._id
        // Increment referrer's count
        await WaitlistUser.findByIdAndUpdate(referrer._id, {
          $inc: { referralCount: 1 }
        })
      }
    }

    // Generate unique referral code
    newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    // Get position in waitlist
    const position = await WaitlistUser.countDocuments({ projectId: project._id }) + 1

    await WaitlistUser.create({
      projectId: project._id,
      name,
      email,
      phone,
      role,
      referralCode: newReferralCode,
      referredBy,
      position,
    } as any)

    revalidatePath(`/project/${projectSlug}`)
    isSuccess = true
  } catch (error) {
    console.error("Join waitlist error:", error)
    return { error: "Failed to join waitlist" }
  }

  if (isSuccess) {
    redirect(`/project/${projectSlug}/success?code=${newReferralCode}`)
  }
}

export async function notifyUsersAction(projectId: string, userIds: string[]) {
  try {
    await connectToDB()

    await WaitlistUser.updateMany(
      { _id: { $in: userIds }, projectId },
      {
        isNotified: true,
        notifiedAt: new Date()
      }
    )

    revalidatePath(`/admin/projects/${projectId}/waitlist`)
    return { success: true }
  } catch (error) {
    console.error("Notify users error:", error)
    return { error: "Failed to notify users" }
  }
}