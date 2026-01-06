"use client"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  shareUrl: string
  primaryColor: string
}

export function CopyButton({ shareUrl, primaryColor }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
  }

  return (
    <Button
      className="flex-1"
      style={{ backgroundColor: primaryColor }}
      onClick={handleCopy}
    >
      Copy Link
    </Button>
  )
}