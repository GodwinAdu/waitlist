import { NextResponse } from "next/server"
import crypto from "crypto"
import Admin from "@/models/Admin"
import { connectToDB } from "@/lib/mongoose"
import { sendEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')
    
    if (!signature) {
      return NextResponse.json({ error: "No signature provided" }, { status: 400 })
    }

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex')

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const event = JSON.parse(body)
    
    await connectToDB()

    switch (event.event) {
      case 'charge.success':
        await handleSuccessfulPayment(event.data)
        break
        
      case 'charge.failed':
        await handleFailedPayment(event.data)
        break
        
      case 'subscription.disable':
        await handleSubscriptionDisabled(event.data)
        break
        
      default:
        console.log('Unhandled webhook event:', event.event)
    }

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function handleSuccessfulPayment(data: any) {
  const reference = data.reference
  const tier = data.metadata?.tier
  const amount = data.amount / 100

  if (!tier) return

  const admin = await Admin.findOne({ 'paymentHistory.reference': reference })
  if (!admin) return

  const now = new Date()
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + 1)

  await Admin.findByIdAndUpdate(admin._id, {
    subscriptionTier: tier,
    subscriptionStatus: "active",
    subscriptionStartDate: now,
    subscriptionEndDate: endDate,
  })

  // Send confirmation email
  await sendEmail({
    to: admin.email,
    subject: "Subscription Activated",
    html: `
      <h2>Your subscription has been activated!</h2>
      <p>Thank you for upgrading to ${tier}. Your subscription is now active.</p>
      <p>Amount paid: GHS ${amount}</p>
    `
  })
}

async function handleFailedPayment(data: any) {
  const reference = data.reference
  
  const admin = await Admin.findOne({ 'paymentHistory.reference': reference })
  if (!admin) return

  // Send failure notification
  await sendEmail({
    to: admin.email,
    subject: "Payment Failed",
    html: `
      <h2>Payment Failed</h2>
      <p>Your recent payment attempt failed. Please try again or contact support.</p>
      <p>Reference: ${reference}</p>
    `
  })
}

async function handleSubscriptionDisabled(data: any) {
  const customerCode = data.customer.customer_code
  
  const admin = await Admin.findOne({ subscriptionReference: customerCode })
  if (!admin) return

  await Admin.findByIdAndUpdate(admin._id, {
    subscriptionStatus: "cancelled"
  })

  // Send cancellation email
  await sendEmail({
    to: admin.email,
    subject: "Subscription Cancelled",
    html: `
      <h2>Subscription Cancelled</h2>
      <p>Your subscription has been cancelled. You can reactivate it anytime from your billing page.</p>
    `
  })
}