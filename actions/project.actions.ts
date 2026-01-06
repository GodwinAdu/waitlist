"use server"

import { connectToDB } from "@/lib/mongoose"
import Project from "@/models/Project"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProjectAction(formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect("/login")
    }

    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const tagline = formData.get("tagline") as string

    if (!name || !description) {
      return { error: "Name and description are required" }
    }

    await connectToDB()

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const project = await Project.create({
      name,
      slug,
      description,
      tagline,
      adminId: user.userId,
    })

    revalidatePath("/admin/projects")
    redirect(`/admin/projects/${project._id}`)
  } catch (error) {
    console.error("Create project error:", error)
    return { error: "Failed to create project" }
  }
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect("/login")
    }

    await connectToDB()

    const updateData: any = {}
    const fields = ["name", "description", "tagline", "primaryColor", "launchDate"]
    
    fields.forEach(field => {
      const value = formData.get(field) as string
      if (value) updateData[field] = value
    })

    await Project.findOneAndUpdate(
      { _id: projectId, adminId: user.userId },
      updateData
    )

    revalidatePath(`/admin/projects/${projectId}`)
    return { success: true }
  } catch (error) {
    console.error("Update project error:", error)
    return { error: "Failed to update project" }
  }
}

export async function deleteProjectAction(projectId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect("/login")
    }

    await connectToDB()

    await Project.findOneAndDelete({
      _id: projectId,
      adminId: user.userId,
    })

    revalidatePath("/admin/projects")
    redirect("/admin/projects")
  } catch (error) {
    console.error("Delete project error:", error)
    return { error: "Failed to delete project" }
  }
}


export async function projectBySlug(slug: string) {
  try {
     await connectToDB()
  
  const project = await Project.findOne({ slug, isActive: true }).lean()
  if (!project) {
    throw new Error("Project not found")
  }

  return JSON.parse(JSON.stringify(project ))
  } catch (error) {
    console.error("Error fetching project by slug:", error)
    throw error
  }
} 