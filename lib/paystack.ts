interface PaystackInitializeResponse {
  status: boolean
  message: string
  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

interface PaystackVerifyResponse {
  status: boolean
  message: string
  data: {
    reference: string
    amount: number
    status: string
    paid_at: string
    metadata: {
      email: string
      userId: string
      projectId: string
      tierName: string
    }
  }
}

export async function initializePaystackPayment(
  email: string,
  amount: number,
  metadata: {
    userId: string
    projectId: string
    tierName: string
  },
): Promise<PaystackInitializeResponse> {
  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: amount * 100, // Paystack expects amount in pesewas (kobo)
      currency: "GHS",
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
      metadata: {
        ...metadata,
        email,
      },
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to initialize payment")
  }

  return response.json()
}

export async function verifyPaystackPayment(reference: string): Promise<PaystackVerifyResponse> {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to verify payment")
  }

  return response.json()
}
