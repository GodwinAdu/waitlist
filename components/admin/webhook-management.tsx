'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Webhook, Plus, Settings, Trash2 } from 'lucide-react'

export default function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    url: '',
    events: ['signup', 'conversion'],
    secret: '',
    isActive: true
  })

  useEffect(() => {
    fetchWebhooks()
  }, [])

  const fetchWebhooks = async () => {
    try {
      const response = await fetch('/api/webhooks')
      const data = await response.json()
      setWebhooks(data.webhooks || [])
    } catch (error) {
      console.error('Failed to fetch webhooks:', error)
    }
  }

  const createWebhook = async () => {
    try {
      const response = await fetch('/api/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        fetchWebhooks()
        setShowForm(false)
        setFormData({ url: '', events: ['signup'], secret: '', isActive: true })
      }
    } catch (error) {
      console.error('Failed to create webhook:', error)
    }
  }

  const eventOptions = [
    { value: 'signup', label: 'New Signup' },
    { value: 'conversion', label: 'Conversion' },
    { value: 'referral', label: 'Referral' },
    { value: 'launch', label: 'Project Launch' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Webhooks</h2>
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Webhook
        </Button>
      </div>

      {showForm && (
        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Create Webhook</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Endpoint URL</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://your-app.com/webhook"
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Events</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {eventOptions.map((event) => (
                  <label key={event.value} className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={formData.events.includes(event.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, events: [...formData.events, event.value] })
                        } else {
                          setFormData({ ...formData, events: formData.events.filter(ev => ev !== event.value) })
                        }
                      }}
                      className="rounded"
                    />
                    {event.label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-gray-300">Secret (optional)</Label>
              <Input
                value={formData.secret}
                onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                placeholder="webhook_secret_key"
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createWebhook} className="bg-green-600 hover:bg-green-700">
                Create Webhook
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {webhooks.map((webhook) => (
          <Card key={webhook._id} className="border-white/10 bg-black/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Webhook className="h-5 w-5 text-purple-400" />
                    <span className="text-white font-medium">{webhook.url}</span>
                  </div>
                  <div className="flex gap-2">
                    {webhook.events.map((event: string) => (
                      <Badge key={event} className="bg-blue-500/20 text-blue-200 border-blue-500/30">
                        {event}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Failures: {webhook.failureCount}</span>
                    {webhook.lastTriggered && (
                      <span>Last: {new Date(webhook.lastTriggered).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={webhook.isActive} />
                  <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}