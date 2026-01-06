'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, MousePointer, Activity } from 'lucide-react'

interface HeatmapProps {
  projectId: string
}

export default function HeatmapVisualization({ projectId }: HeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState('7d')
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    fetchHeatmapData()
  }, [projectId, timeRange])

  useEffect(() => {
    if (heatmapData.length > 0) {
      renderHeatmap()
    }
  }, [heatmapData])

  const fetchHeatmapData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/heatmap?projectId=${projectId}&timeRange=${timeRange}`)
      const data = await response.json()
      setHeatmapData(data.heatmapData || [])
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderHeatmap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Find max intensity for normalization
    const maxIntensity = Math.max(...heatmapData.map(d => d.intensity))

    // Draw heatmap points
    heatmapData.forEach(point => {
      const intensity = point.intensity / maxIntensity
      const radius = Math.max(10, intensity * 30)
      
      // Create gradient
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, radius
      )
      
      gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity * 0.8})`)
      gradient.addColorStop(0.5, `rgba(255, 255, 0, ${intensity * 0.4})`)
      gradient.addColorStop(1, 'rgba(255, 255, 0, 0)')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI)
      ctx.fill()
    })
  }

  const totalClicks = heatmapData.reduce((sum, point) => sum + point.intensity, 0)
  const hotspots = heatmapData.filter(point => point.intensity > 5).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-orange-400" />
          <h2 className="text-2xl font-bold text-white">Heatmap Analytics</h2>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={timeRange === '7d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            size="sm"
            variant={timeRange === '30d' ? 'default' : 'outline'}
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Clicks</p>
                <p className="text-2xl font-bold text-white">{totalClicks}</p>
              </div>
              <MousePointer className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Hot Spots</p>
                <p className="text-2xl font-bold text-white">{hotspots}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Sessions</p>
                <p className="text-2xl font-bold text-white">{heatmapData.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Click Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500 mx-auto mb-4" />
                <p className="text-gray-300">Loading heatmap...</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="w-full h-96 bg-gray-900 rounded-lg border border-white/10"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="bg-red-500/20 text-red-200">High Activity</Badge>
                <Badge className="bg-yellow-500/20 text-yellow-200">Medium Activity</Badge>
                <Badge className="bg-blue-500/20 text-blue-200">Low Activity</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}