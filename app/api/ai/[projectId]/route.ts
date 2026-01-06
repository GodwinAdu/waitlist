import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import AIContent from "@/models/AIContent"
import { requireAuth } from "@/lib/auth"
import { generateContent, analyzeUserSegments, predictConversions } from "@/lib/ai"

interface Props {
  params: Promise<{ projectId: string }>
}

export async function POST(request: Request, { params }: Props) {
  try {
    const user = await requireAuth()
    const { projectId } = await params
    const { type, prompt, action } = await request.json()
    
    await connectToDB()

    if (action === 'generate') {
      if (!type || !prompt) {
        return NextResponse.json({ error: "Missing required fields: type and prompt are required" }, { status: 400 })
      }

      if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json({ error: "Invalid projectId format" }, { status: 400 })
      }

      const aiContent = await AIContent.create({
        projectId,
        type,
        prompt,
        createdBy: user.userId,
        status: 'generating'
      })

      try {
        const result = await generateContent(type, prompt)
        
        await AIContent.findByIdAndUpdate(aiContent._id, {
          generatedContent: result.content,
          tokens: result.tokens,
          status: 'completed'
        })

        return NextResponse.json({ 
          content: result.content,
          tokens: result.tokens,
          id: aiContent._id
        })
      } catch (error) {
        await AIContent.findByIdAndUpdate(aiContent._id, { status: 'failed' })
        throw error
      }
    }

    if (action === 'analyze_segments') {
      const { users } = await request.json()
      const analysis = await analyzeUserSegments(users)
      return NextResponse.json({ analysis })
    }

    if (action === 'predict') {
      const { analyticsData } = await request.json()
      const prediction = await predictConversions(analyticsData)
      return NextResponse.json({ prediction })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("AI API error:", error)
    return NextResponse.json({ error: "AI processing failed" }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: Props) {
  try {
    const user = await requireAuth()
    const { projectId } = await params
    
    await connectToDB()
    
    const contents = await AIContent.find({ 
      createdBy: user.userId,
      projectId
    }).sort({ createdAt: -1 })
    
    return NextResponse.json({ contents })
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch AI content" }, { status: 500 })
  }
}