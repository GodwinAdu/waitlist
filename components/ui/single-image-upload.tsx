"use client"

import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Image from "next/image"

interface SingleImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onRemove: () => void
}

export default function SingleImageUpload({ value, onChange, onRemove }: SingleImageUploadProps) {
  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative">
          <div className="relative h-32 w-32 rounded-lg overflow-hidden border">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            onClick={onRemove}
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <UploadButton<OurFileRouter, "imageUploader">
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res?.[0]) {
              onChange(res[0].url)
            }
          }}
          onUploadError={(error: Error) => {
            console.error("Upload error:", error)
            alert("Upload failed")
          }}
          appearance={{
            button: "bg-primary text-primary-foreground hover:bg-primary/90 ut-ready:bg-primary ut-uploading:cursor-not-allowed ut-uploading:bg-primary/50",
            allowedContent: "text-muted-foreground text-xs"
          }}
        />
      )}
    </div>
  )
}