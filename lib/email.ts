import nodemailer from "nodemailer"
import Project from "@/models/Project"
import { connectToDB } from "@/lib/mongoose"
import { decrypt } from "@/lib/encryption"

interface EmailOptions {
  to: string
  subject: string
  html: string
  projectId?: string
}

export async function sendEmail({ to, subject, html, projectId }: EmailOptions) {
  try {
    let transporter
    
    if (projectId) {
      await connectToDB()
      const project = await Project.findById(projectId)
      
      if (project?.emailSettings?.smtpHost) {
        transporter = nodemailer.createTransport({
          host: project.emailSettings.smtpHost,
          port: project.emailSettings.smtpPort || 587,
          secure: project.emailSettings.smtpPort === 465,
          auth: {
            user: project.emailSettings.smtpUser,
            pass: project.emailSettings.smtpPassword ? decrypt(project.emailSettings.smtpPassword) : '',
          },
        })
        
        const info = await transporter.sendMail({
          from: `${project.emailSettings.fromName || project.name} <${project.emailSettings.fromEmail || project.emailSettings.smtpUser}>`,
          to,
          subject,
          html,
        })
        
        console.log("Email sent with project settings:", info.messageId)
        return { success: true, messageId: info.messageId }
      }
    }
    
    // Fallback to global settings
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_PORT === "465",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    })

    console.log("Email sent with global settings:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error: any) {
    console.error("Email error:", error)
    throw new Error("Failed to send email")
  }
}
