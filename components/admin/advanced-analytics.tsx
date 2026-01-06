'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Users, Globe, Clock, MousePointer, Eye } from 'lucide-react'

interface AdvancedAnalyticsProps {
  projectId: string
}

export default function AdvancedAnalytics({ projectId }: AdvancedAnalyticsProps) {
  const [analytics, setAnalytics] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [projectId])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/analytics`)
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center p-4">Loading analytics...</div>

  const metrics = [
    {
      title: 'Total Signups',
      value: analytics.totalSignups || 0,
      change: '+12%',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate || 0}%`,
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      title: 'Page Views',
      value: analytics.pageViews || 0,
      change: '+8%',
      icon: Eye,
      color: 'text-purple-400'
    },
    {
      title: 'Avg. Time on Page',
      value: `${analytics.avgTimeOnPage || 0}s`,
      change: '+15s',
      icon: Clock,
      color: 'text-orange-400'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border-white/10 bg-black/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">{metric.title}</p>
                  <p className="text-2xl font-bold text-white">{metric.value}</p>
                  <Badge className="bg-green-500/20 text-green-200 border-green-500/30 mt-1">
                    {metric.change}
                  </Badge>
                </div>
                <metric.icon className={`h-8 w-8 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(analytics.geographic && analytics.geographic.length > 0) ? 
                analytics.geographic.map((country: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{country.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full"
                          style={{ width: `${Math.round(country.percentage)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">{country.count}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-center py-4">No geographic data available</p>
                )
              }
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(analytics.trafficSources && analytics.trafficSources.length > 0) ? 
                analytics.trafficSources.map((source: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{source.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${Math.round(source.percentage)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400">{source.count}</span>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 text-center py-4">No traffic source data available</p>
                )
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Signup Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-400 text-center py-4">Funnel tracking requires additional implementation</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}