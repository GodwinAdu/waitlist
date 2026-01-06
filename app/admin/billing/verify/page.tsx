"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function VerifySubscriptionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const reference = searchParams.get("reference")
    if (!reference) {
      setStatus("error")
      setMessage("No payment reference found")
      return
    }

    verifyPayment(reference)
  }, [searchParams])

  const verifyPayment = async (reference: string) => {
    try {
      const response = await fetch(`/api/subscription/verify?reference=${reference}`)
      const data = await response.json()

      if (!response.ok) {
        setStatus("error")
        setMessage(data.error || "Payment verification failed")
        return
      }

      setStatus("success")
      setMessage(data.message)
    } catch (error) {
      setStatus("error")
      setMessage("Failed to verify payment")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === "loading" && <Loader2 className="h-16 w-16 animate-spin text-primary" />}
            {status === "success" && <CheckCircle className="h-16 w-16 text-green-500" />}
            {status === "error" && <XCircle className="h-16 w-16 text-red-500" />}
          </div>
          <CardTitle>
            {status === "loading" && "Verifying Payment"}
            {status === "success" && "Subscription Activated!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status !== "loading" && (
            <Button onClick={() => router.push("/admin/billing")} className="w-full">
              Go to Billing
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
