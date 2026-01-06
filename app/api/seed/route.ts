import { NextResponse } from "next/server"
import { seedTemplates } from "@/lib/seed-templates"

export async function POST() {
  try {
    const result = await seedTemplates()
    
    if (result.success) {
      return NextResponse.json({ 
        message: `Successfully seeded ${result.count} templates`,
        success: true 
      })
    } else {
      return NextResponse.json({ 
        error: "Failed to seed templates",
        details: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ 
      error: "Seeding failed",
      details: error 
    }, { status: 500 })
  }
}