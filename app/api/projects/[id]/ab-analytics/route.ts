import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import ABTestView from "@/models/ABTestView"
import { requireAuth } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth()
    const { id } = await params
    await connectToDB()

    const analytics = await ABTestView.aggregate([
      { $match: { projectId: id } },
      {
        $group: {
          _id: "$variantId",
          views: { $sum: 1 },
          conversions: { $sum: { $cond: ["$converted", 1, 0] } }
        }
      },
      {
        $addFields: {
          conversionRate: {
            $cond: [
              { $eq: ["$views", 0] },
              0,
              { $multiply: [{ $divide: ["$conversions", "$views"] }, 100] }
            ]
          }
        }
      }
    ])

    return NextResponse.json({ analytics })
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}