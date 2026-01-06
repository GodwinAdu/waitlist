'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { UploadButton, UploadDropzone } from '@uploadthing/react'
import { useUploadThing } from '@/lib/uploadthing'
import { Upload, X, Image, Video } from 'lucide-react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

interface MediaUploadProps {
  images: string[]
  videos: string[]
  onImagesChange: (images: string[]) => void
  onVideosChange: (videos: string[]) => void
}

export default function MediaUpload({ images, videos, onImagesChange, onVideosChange }: MediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const removeVideo = (index: number) => {
    onVideosChange(videos.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      {/* Images Section */}
      <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-5 w-5 text-purple-400" />
            <Label className="text-lg font-semibold text-white">Project Images</Label>
            <Badge variant="outline" className="text-xs text-purple-300 border-purple-500/30">
              {images.length} images
            </Badge>
          </div>
          
          <div className="space-y-4">
            <UploadDropzone<OurFileRouter, "imageUploader">
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  const newImages = res.map(file => file.url)
                  onImagesChange([...images, ...newImages])
                }
              }}
              onUploadError={(error: Error) => {
                alert(`Upload failed: ${error.message}`)
              }}
              className="border-dashed border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10"
              appearance={{
                label: "text-purple-200",
                allowedContent: "text-purple-300",
                button: "bg-purple-600 hover:bg-purple-700"
              }}
            />
            
            {images.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {images.map((image, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <img 
                          src={image} 
                          alt={`Project image ${index + 1}`}
                          className="h-12 w-12 rounded object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{image}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeImage(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Videos Section */}
      <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Video className="h-5 w-5 text-pink-400" />
            <Label className="text-lg font-semibold text-white">Project Videos</Label>
            <Badge variant="outline" className="text-xs text-pink-300 border-pink-500/30">
              {videos.length} videos
            </Badge>
          </div>
          
          <div className="space-y-4">
            <UploadDropzone<OurFileRouter, "videoUploader">
              endpoint="videoUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  const newVideos = res.map(file => file.url)
                  onVideosChange([...videos, ...newVideos])
                }
              }}
              onUploadError={(error: Error) => {
                alert(`Upload failed: ${error.message}`)
              }}
              className="border-dashed border-pink-500/30 bg-pink-500/5 hover:bg-pink-500/10"
              appearance={{
                label: "text-pink-200",
                allowedContent: "text-pink-300",
                button: "bg-pink-600 hover:bg-pink-700"
              }}
            />
            
            {videos.length > 0 && (
              <div className="space-y-3">
                {videos.map((video, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <div className="flex h-12 w-12 items-center justify-center rounded bg-pink-500/20">
                          <Video className="h-6 w-6 text-pink-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{video}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeVideo(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
        <div className="flex items-start gap-3">
          <Upload className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="text-sm text-blue-200">
            <p className="font-medium mb-1">Upload Tips:</p>
            <ul className="space-y-1 text-blue-300">
              <li>• Images: Max 4MB each, up to 10 files</li>
              <li>• Videos: Max 32MB each, up to 5 files</li>
              <li>• Drag & drop or click to upload</li>
              <li>• Files are hosted securely on UploadThing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}