import { NextResponse } from "next/server"
import WaitlistUser from "@/models/WaitlistUser"
import Project from "@/models/Project"
import Admin from "@/models/Admin"
import crypto from "crypto"
import { calculateTier, calculatePoints, awardBadges } from "@/lib/gamification"
import { canAddWaitlistUser } from "@/lib/subscription"
import { connectToDB } from "@/lib/mongoose"
import { triggerWebhooks } from "@/lib/webhooks"
import { scheduleWelcomeEmail } from "@/lib/email-automation"
import { rateLimit } from "@/lib/rate-limit"
import { validateRequired, validateEmail, validators, sanitizeInput } from "@/lib/validation"

const waitlistRateLimit = rateLimit({ windowMs: 5 * 60 * 1000, maxRequests: 3 })

// Join waitlist
export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResponse = await waitlistRateLimit(request as any)
    if (rateLimitResponse) return rateLimitResponse

    const body = await request.json()
    const { projectId, referralCode } = body
    const name = sanitizeInput(body.name || '')
    const email = sanitizeInput(body.email || '').toLowerCase()
    const phone = sanitizeInput(body.phone || '')
    const role = sanitizeInput(body.role || '')
    const message = sanitizeInput(body.message || '')

    // Get analytics data from headers
    const userAgent = request.headers.get('user-agent') || ''
    const referer = request.headers.get('referer') || ''
    const xForwardedFor = request.headers.get('x-forwarded-for')
    const xRealIp = request.headers.get('x-real-ip')
    const ipAddress = xForwardedFor?.split(',')[0] || xRealIp || ''
    
    // Determine traffic source from referer
    let trafficSource = 'Direct'
    if (referer) {
      if (referer.includes('facebook.com') || referer.includes('fb.com')) trafficSource = 'Facebook'
      else if (referer.includes('twitter.com') || referer.includes('t.co')) trafficSource = 'Twitter'
      else if (referer.includes('instagram.com')) trafficSource = 'Instagram'
      else if (referer.includes('linkedin.com')) trafficSource = 'LinkedIn'
      else if (referer.includes('google.com')) trafficSource = 'Google'
      else if (referer.includes('youtube.com')) trafficSource = 'YouTube'
      else if (referralCode) trafficSource = 'Referral'
      else trafficSource = 'Website'
    }
    
    // Get real country from IP geolocation
    let country = 'Unknown'
    if (ipAddress && ipAddress !== '127.0.0.1' && ipAddress !== '::1') {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ipAddress}?fields=country`)
        const geoData = await geoResponse.json()
        if (geoData.country) {
          country = geoData.country
        }
      } catch (error) {
        console.log('Geolocation failed, using default')
        country = 'Unknown'
      }
    }

    // Validation
    const requiredErrors = validateRequired({ projectId, name, email })
    if (requiredErrors.length > 0) {
      return NextResponse.json({ error: requiredErrors[0] }, { status: 400 })
    }

    const emailErrors = validateEmail(email)
    if (emailErrors.length > 0) {
      return NextResponse.json({ error: emailErrors[0] }, { status: 400 })
    }

    if (phone && !validators.phone(phone)) {
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    if (name.length < 2 || name.length > 50) {
      return NextResponse.json({ error: "Name must be 2-50 characters" }, { status: 400 })
    }

    await connectToDB()

    // Verify project exists and is active
    const project = await Project.findOne({ _id: projectId, isActive: true })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const admin = await Admin.findById(project.adminId)
    if (!admin) {
      return NextResponse.json({ error: "Project owner not found" }, { status: 404 })
    }

    const currentUserCount = await WaitlistUser.countDocuments({ projectId })
    if (!canAddWaitlistUser(admin.subscriptionTier, currentUserCount, admin.subscriptionStatus, admin.subscriptionEndDate)) {
      return NextResponse.json(
        {
          error: "Waitlist signups are temporarily disabled. The project owner needs to renew their subscription.",
        },
        { status: 403 },
      )
    }

    // Check for duplicate email in this project
    const existingUser = await WaitlistUser.findOne({ projectId, email })
    if (existingUser) {
      return NextResponse.json({ error: "You have already joined this waitlist" }, { status: 409 })
    }

    // Get current position (highest position + 1)
    const lastUser = await WaitlistUser.findOne({ projectId }).sort({ position: -1 })
    const position = lastUser ? lastUser.position + 1 : 1

    let referredBy = undefined
    if (referralCode) {
      const referrer = await WaitlistUser.findOne({ projectId, referralCode })
      if (referrer) {
        referredBy = referrer._id

        // Update referrer's referral count
        const newReferralCount = referrer.referralCount + 1

        // Recalculate tier, points, and badges for referrer
        const newTier = calculateTier(newReferralCount)
        const newPoints = calculatePoints(newReferralCount, referrer.position)
        const newBadges = awardBadges(newReferralCount, referrer.position)

        await WaitlistUser.findByIdAndUpdate(referrer._id, {
          referralCount: newReferralCount,
          tier: newTier,
          points: newPoints,
          badges: newBadges,
        })
      }
    }

    // Generate unique referral code for this user
    const userReferralCode = crypto.randomBytes(4).toString("hex")

    const tier = calculateTier(0)
    const points = calculatePoints(0, position)
    const badges = awardBadges(0, position)

    // Create waitlist user
    const waitlistUser = await WaitlistUser.create({
      projectId,
      name,
      email,
      phone,
      role,
      message,
      referredBy,
      referralCode: userReferralCode,
      position,
      referralCount: 0,
      tier,
      points,
      badges,
      // Analytics data
      country,
      trafficSource,
      userAgent,
      ipAddress,
    })

    // Trigger webhooks
    await triggerWebhooks(projectId, 'signup', {
      user: {
        id: waitlistUser._id,
        name,
        email,
        position,
        tier,
        points
      }
    })

    // Schedule welcome email
    await scheduleWelcomeEmail(waitlistUser._id.toString(), projectId)

    return NextResponse.json(
      {
        success: true,
        position,
        referralCode: userReferralCode,
        tier,
        points,
        badges,
        message: "Successfully joined the waitlist!",
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Join waitlist error:", error)
    return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 })
  }
}
