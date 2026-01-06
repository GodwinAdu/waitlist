'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { WaitlistForm } from '@/components/waitlist/waitlist-form'
import { Clock, Users } from 'lucide-react'

interface ABTestVariantProps {
  project: any
  variant: any
  sessionId: string
  totalSignups: number
  referralCode?: string
}

export function ABTestVariant({ project, variant, sessionId, totalSignups, referralCode }: ABTestVariantProps) {
  const [tracked, setTracked] = useState(false)

  useEffect(() => {
    if (!tracked) {
      // Set session cookie on client side
      document.cookie = `session-id=${sessionId}; path=/; max-age=${60 * 60 * 24 * 30}`
      
      // Track view
      fetch('/api/ab-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project._id,
          variantId: variant.id,
          sessionId,
          userAgent: navigator.userAgent,
          ipAddress: '',
        }),
      })
      setTracked(true)
    }
  }, [project._id, variant.id, sessionId, tracked])

  const handleConversion = () => {
    fetch('/api/ab-test', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: project._id,
        sessionId,
      }),
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {project.logo && (
                  <img src={project.logo} alt={`${project.name} logo`} className="h-12 w-12 rounded-lg object-cover" />
                )}
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {project.name}
                  </h1>
                  {project.tagline && <p className="text-gray-300">{project.tagline}</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                  <Users className="mr-1 h-3 w-3" />
                  {totalSignups} joined
                </Badge>
                {project.launchDate && (
                  <Badge className="bg-pink-500/20 text-pink-200 border-pink-500/30">
                    <Clock className="mr-1 h-3 w-3" />
                    Launching Soon
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
                {variant.headline || project.description}
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                {variant.description || project.description}
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Join the Waitlist</h3>
                    <p className="text-gray-300">Be the first to know when we launch</p>
                  </div>
                  
                  <div onClick={handleConversion}>
                    <WaitlistForm 
                      projectId={project._id.toString()}
                      primaryColor={variant.primaryColor || project.primaryColor}
                      projectName={project.name}
                      projectDescription={variant.description || project.description}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}