import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/mongoose"
import EmailCampaign from "@/models/EmailCampaign"
import WaitlistUser from "@/models/WaitlistUser"
import { requireAuth } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

interface Props {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, { params }: Props) {
  try {
    const user = await requireAuth()
    const { id } = await params
    
    await connectToDB()
    
    const campaign = await EmailCampaign.findOne({ 
      _id: id, 
      createdBy: user.userId 
    })
    
    if (!campaign || !campaign.projectId) {
      return NextResponse.json({ error: "Campaign not found or missing project" }, { status: 404 })
    }
    
    console.log('Campaign projectId:', campaign.projectId)
    
    const waitlistUsers = await WaitlistUser.find({ 
      projectId: campaign.projectId 
    })
    
    let sentCount = 0
    
    for (const waitlistUser of waitlistUsers) {
      try {
        await sendEmail({
          to: waitlistUser.email,
          subject: campaign.subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Hello ${waitlistUser.name}!</h2>
              <div style="line-height: 1.6;">
                ${campaign.content.replace(/\n/g, '<br>')}
              </div>
            </div>
          `
        })
        sentCount++
      } catch (error) {
        console.error(`Failed to send email to ${waitlistUser.email}:`, error)
      }
    }
    
    await EmailCampaign.findByIdAndUpdate(id, {
      status: 'sent',
      sentAt: new Date(),
      recipients: sentCount
    })
    
    return NextResponse.json({ 
      success: true,
      sent: sentCount,
      total: waitlistUsers.length
    })
    
  } catch (error: any) {
    console.error("Send campaign error:", error)
    return NextResponse.json({ error: "Failed to send campaign" }, { status: 500 })
  }
}