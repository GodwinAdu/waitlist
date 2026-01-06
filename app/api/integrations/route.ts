import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import Integration from "@/models/Integration"
import { requireAuth } from "@/lib/auth"
import { postToSocial, syncWithCRM } from "@/lib/integrations"

export async function GET() {
  try {
    const user = await requireAuth()
    await connectToDB()
    
    const integrations = await Integration.find({ adminId: user.userId })
    return NextResponse.json({ integrations })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch integrations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { type, provider, credentials, settings, action } = await request.json()
    
    await connectToDB()

    if (action === 'connect') {
      const integration = await Integration.create({
        adminId: user.userId,
        type,
        provider,
        credentials,
        settings: settings || {}
      })
      
      return NextResponse.json({ integration }, { status: 201 })
    }

    if (action === 'post_social') {
      const { content, platforms } = await request.json()
      const results = await postToSocial(user.userId, content, platforms)
      return NextResponse.json({ results })
    }

    if (action === 'sync_crm') {
      const { userData } = await request.json()
      await syncWithCRM(user.userId, userData)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Integration API error:", error)
    return NextResponse.json({ error: "Integration failed" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuth()
    const { id, isActive, settings } = await request.json()
    
    await connectToDB()
    
    const integration = await Integration.findOneAndUpdate(
      { _id: id, adminId: user.userId },
      { isActive, settings },
      { new: true }
    )
    
    return NextResponse.json({ integration })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update integration" }, { status: 500 })
  }
}