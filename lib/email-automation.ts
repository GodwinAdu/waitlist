import nodemailer from 'nodemailer'
import EmailCampaign from '@/models/EmailCampaign'
import WaitlistUser from '@/models/WaitlistUser'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

export async function sendCampaign(campaignId: string) {
  try {
    const campaign = await EmailCampaign.findById(campaignId).populate('projectId')
    if (!campaign) throw new Error('Campaign not found')

    const users = await WaitlistUser.find({
      projectId: campaign.projectId,
      ...(campaign.settings.filters || {})
    })

    let sent = 0
    for (const user of users) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: user.email,
          subject: campaign.subject,
          html: campaign.content.replace(/{{name}}/g, user.name)
        })
        sent++
      } catch (error) {
        console.error(`Failed to send to ${user.email}:`, error)
      }
    }

    await EmailCampaign.findByIdAndUpdate(campaignId, {
      status: 'sent',
      sentAt: new Date(),
      'recipients.total': users.length,
      'recipients.sent': sent
    })

    return { success: true, sent }
  } catch (error) {
    console.error('Campaign send error:', error)
    return { success: false, error: (error as Error).message }
  }
}

export async function scheduleWelcomeEmail(userId: string, projectId: string) {
  try {
    const welcomeCampaign = await EmailCampaign.findOne({
      projectId,
      type: 'welcome',
      status: 'scheduled'
    })

    if (welcomeCampaign) {
      const user = await WaitlistUser.findById(userId)
      if (user) {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: user.email,
          subject: welcomeCampaign.subject,
          html: welcomeCampaign.content.replace(/{{name}}/g, user.name)
        })
      }
    }
  } catch (error) {
    console.error('Welcome email error:', error)
  }
}