'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Eye, MousePointer } from 'lucide-react'

interface ABAnalyticsProps {
  projectId: string
}

export default function ABAnalytics({ projectId }: ABAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [projectId])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/ab-analytics`)
      const data = await response.json()
      setAnalytics(data.analytics || [])
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center p-4">Loading analytics...</div>

  const winner = analytics.reduce((prev, current) => 
    (prev.conversionRate > current.conversionRate) ? prev : current, analytics[0])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {analytics.map((variant) => (
          <Card key={variant._id} className="border-white/10 bg-black/20 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white">Variant {variant._id}</CardTitle>
                {variant._id === winner?._id && (
                  <Badge className="bg-green-500/20 text-green-200 border-green-500/30">
                    Winner
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">{variant.views} views</span>
              </div>
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">{variant.conversions} conversions</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-400" />
                <span className="text-lg font-bold text-white">
                  {variant.conversionRate.toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}