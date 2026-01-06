import { connectToDB } from "@/lib/mongoose"

export async function GET() {
  try {
    await connectToDB()
    return Response.json({ 
      message: 'Database connected successfully', 
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return Response.json({ 
      error: 'Database connection failed', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}