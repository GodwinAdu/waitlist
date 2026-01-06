'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react'

interface MediaGalleryProps {
  images: string[]
  videos: string[]
  projectName: string
}

export default function MediaGallery({ images, videos, projectName }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const allMedia = [
    ...images.map((url, index) => ({ type: 'image' as const, url, index })),
    ...videos.map((url, index) => ({ type: 'video' as const, url, index: index + images.length }))
  ]

  const navigate = (direction: 'prev' | 'next') => {
    if (allMedia.length === 0) return
    setCurrentIndex(prev => 
      direction === 'next' 
        ? (prev + 1) % allMedia.length
        : (prev - 1 + allMedia.length) % allMedia.length
    )
  }

  const getVideoEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0]
      return `https://www.youtube.com/embed/${videoId}`
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]
      return `https://player.vimeo.com/video/${videoId}`
    }
    return url
  }

  if (allMedia.length === 0) return null

  const currentMedia = allMedia[currentIndex]

  return (
    <>
      <div className="relative">
        {/* Main Media Display */}
        <div className="relative rounded-xl overflow-hidden bg-black/20 border border-white/10">
          {currentMedia.type === 'image' ? (
            <img 
              src={currentMedia.url} 
              alt={`${projectName} media ${currentIndex + 1}`}
              className="w-full h-auto object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNjAgMTIwQzE3Ny42NzMgMTIwIDE5MiAxMDUuNjczIDE5MiA4OEMxOTIgNzAuMzI3MyAxNzcuNjczIDU2IDE2MCA1NkMxNDIuMzI3IDU2IDEyOCA3MC4zMjczIDEyOCA4OEMxMjggMTA1LjY3MyAxNDIuMzI3IDEyMCAxNjAgMTIwWiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg=='
              }}
            />
          ) : (
            <div className="w-full">
              {currentMedia.url.includes('youtube.com') || currentMedia.url.includes('youtu.be') || currentMedia.url.includes('vimeo.com') ? (
                <div className="aspect-video">
                  <iframe
                    src={getVideoEmbedUrl(currentMedia.url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video 
                  src={currentMedia.url}
                  className="w-full h-auto"
                  controls
                  preload="metadata"
                />
              )}
            </div>
          )}

          {/* Navigation Arrows */}
          {allMedia.length > 1 && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                onClick={() => navigate('prev')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                onClick={() => navigate('next')}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Media Type Indicator */}
          <div className="absolute top-3 left-3">
            <Badge className="bg-black/50 text-white border-white/20">
              {currentMedia.type === 'video' ? (
                <><Play className="mr-1 h-3 w-3" /> Video</>
              ) : (
                <>📷 Image</>
              )}
            </Badge>
          </div>

          {/* Fullscreen Button */}
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
            onClick={() => setIsFullscreen(true)}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Media Counter & Dots */}
        {allMedia.length > 1 && (
          <div className="flex items-center justify-between mt-4">
            <Badge variant="outline" className="text-gray-300 border-white/20">
              {currentIndex + 1} of {allMedia.length}
            </Badge>
            
            <div className="flex gap-2">
              {allMedia.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-purple-400 w-6' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
            {currentMedia.type === 'image' ? (
              <img 
                src={currentMedia.url} 
                alt={`${projectName} media ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="w-full max-w-5xl aspect-video">
                {currentMedia.url.includes('youtube.com') || currentMedia.url.includes('youtu.be') || currentMedia.url.includes('vimeo.com') ? (
                  <iframe
                    src={getVideoEmbedUrl(currentMedia.url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video 
                    src={currentMedia.url}
                    className="w-full h-full"
                    controls
                    autoPlay
                  />
                )}
              </div>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setIsFullscreen(false)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}
    </>
  )
}