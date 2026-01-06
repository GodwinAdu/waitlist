"use server"

import { connectToDB } from "@/lib/mongoose"
import Admin from "@/models/Admin"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export async function initializePaymentAction(plan: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect("/login")
    }

    const plans = {
      pro: { amount: 5000, name: "Pro Plan" }, // 50 GHS in pesewas
      enterprise: { amount: 20000, name: "Enterprise Plan" } // 200 GHS in pesewas
    }

    const selectedPlan = plans[plan as keyof typeof plans]
    if (!selectedPlan) {
      return { error: "Invalid plan selected" }
    }

    await connectToDB()

    const admin = await Admin.findById(user.userId)
    if (!admin) {
      return { error: "User not found" }
    }

    // Initialize Paystack payment
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: admin.email,
        amount: selectedPlan.amount,
        currency: "GHS",
        metadata: {
          userId: user.userId,
          plan,
          planName: selectedPlan.name,
        },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/billing?verify=true`,
      }),
    })

    const data = await response.json()

    if (!data.status) {
      return { error: "Failed to initialize payment" }
    }

    redirect(data.data.authorization_url)
  } catch (error) {
    console.error("Initialize payment error:", error)
    return { error: "Payment initialization failed" }
  }
}

export async function verifyPaymentAction(reference: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      redirect("/login")
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    })

    const data = await response.json()

    if (!data.status || data.data.status !== "success") {
      return { error: "Payment verification failed" }
    }

    await connectToDB()

    const { plan } = data.data.metadata
    const subscriptionEndDate = new Date()
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30) // 30 days

    // Update admin subscription
    await Admin.findByIdAndUpdate(user.userId, {
      subscriptionTier: plan,
      subscriptionStatus: "active",
      subscriptionReference: reference,
      subscriptionStartDate: new Date(),
      subscriptionEndDate,
      $push: {
        paymentHistory: {
          reference,
          amount: data.data.amount,
          plan,
          date: new Date(),
          status: "success",
        },
      },
    })

    redirect("/admin/billing?success=true")
  } catch (error) {
    console.error("Verify payment error:", error)
    return { error: "Payment verification failed" }
  }
}