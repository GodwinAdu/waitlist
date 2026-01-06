import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import Webhook from "@/models/Webhook"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const user = await requireAuth()
    await connectToDB()
    const webhooks = await Webhook.find().populate('projectId')
    return NextResponse.json({ webhooks })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch webhooks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    await connectToDB()
    
    const webhook = await Webhook.create(body)
    return NextResponse.json({ webhook }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create webhook" }, { status: 500 })
  }
}