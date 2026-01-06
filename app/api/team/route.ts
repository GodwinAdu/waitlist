import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import TeamMember from "@/models/Team"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const user = await requireAuth()
    await connectToDB()
    const members = await TeamMember.find({ adminId: user.userId })
    return NextResponse.json({ members })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    const { email, role, permissions } = await request.json()
    await connectToDB()
    
    const member = await TeamMember.create({
      adminId: user.userId,
      email,
      role,
      permissions,
      invitedBy: user.userId
    })
    
    return NextResponse.json({ member }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to invite member" }, { status: 500 })
  }
}