import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import Template from "@/models/Template"

export async function GET() {
  try {
    await connectToDB()
    const templates = await Template.find({ $or: [{ isPremium: false }, { isPremium: true }] })
    return NextResponse.json({ templates })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await connectToDB()
    
    const template = await Template.create(body)
    return NextResponse.json({ template }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
  }
}