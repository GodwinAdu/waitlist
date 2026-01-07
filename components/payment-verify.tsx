"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function PaymentVerifyClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

   useEffect(() => {
     const reference = searchParams.get("reference")
 
     if (!reference) {
       setStatus("error")
       setMessage("Invalid payment reference")
       return
     }
 
     async function verifyPayment() {
       try {
         const response = await fetch("/api/subscription/verify?reference=" + reference)
         const data = await response.json()
 
         if (response.ok) {
           setStatus("success")
           setMessage("Payment successful! Your subscription has been activated.")
         } else {
           setStatus("error")
           setMessage(data.error || "Payment verification failed")
         }
       } catch (error) {
         setStatus("error")
         setMessage("An error occurred while verifying payment")
       }
     }
 
     verifyPayment()
   }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Verification</CardTitle>
          <CardDescription className="text-center">
            Please wait while we verify your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <p className="text-muted-foreground">Verifying your payment...</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <p className="font-medium text-green-600">{message}</p>
              <Button onClick={() => router.push("/")} className="w-full">
                Go to Home
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-16 w-16 text-red-500" />
              <p className="font-medium text-red-600">{message}</p>
              <Button onClick={() => router.back()} variant="outline" className="w-full">
                Go Back
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
