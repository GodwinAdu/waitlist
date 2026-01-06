"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface RecentSignup {
  _id: string
  name: string
  createdAt: string
}

interface LiveSignupsProps {
  projectId: string
}

export function LiveSignups({ projectId }: LiveSignupsProps) {
  const [signups, setSignups] = useState<RecentSignup[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSignups = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/recent-signups`)
        const data = await response.json()
        setSignups(data.recentSignups || [])
      } catch (error) {
        console.error("Failed to fetch signups:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSignups()
    // Refresh every 10 seconds
    const interval = setInterval(fetchSignups, 10000)
    return () => clearInterval(interval)
  }, [projectId])

  if (isLoading) {
    return null
  }

  if (signups.length === 0) {
    return null
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
          </span>
          Recent Signups
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {signups.map((signup) => (
            <div key={signup._id} className="flex items-center justify-between text-sm">
              <span className="font-medium">{signup.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(signup.createdAt), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
