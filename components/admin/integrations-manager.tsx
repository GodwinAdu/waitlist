'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { 
  Twitter, 
  Linkedin, 
  Facebook, 
  Mail, 
  Phone, 
  Calendar,
  CreditCard,
  Settings,
  Plus
} from 'lucide-react'

export default function IntegrationsManager() {
  const [integrations, setIntegrations] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'social',
    provider: 'twitter',
    credentials: {}
  })

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    try {
      const response = await fetch('/api/integrations')
      const data = await response.json()
      setIntegrations(data.integrations || [])
    } catch (error) {
      console.error('Failed to fetch integrations:', error)
    }
  }

  const connectIntegration = async () => {
    try {
      const response = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, action: 'connect' })
      })
      
      if (response.ok) {
        fetchIntegrations()
        setShowForm(false)
        setFormData({ type: 'social', provider: 'twitter', credentials: {} })
      }
    } catch (error) {
      console.error('Failed to connect integration:', error)
    }
  }

  const toggleIntegration = async (id: string, isActive: boolean) => {
    try {
      await fetch('/api/integrations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive })
      })
      fetchIntegrations()
    } catch (error) {
      console.error('Failed to toggle integration:', error)
    }
  }

  const getProviderIcon = (provider: string) => {
    const icons = {
      twitter: Twitter,
      linkedin: Linkedin,
      facebook: Facebook,
      hubspot: Mail,
      salesforce: Mail,
      stripe: CreditCard,
      paypal: CreditCard,
      twilio: Phone,
      calendly: Calendar
    }
    const Icon = icons[provider as keyof typeof icons] || Settings
    return <Icon className="h-5 w-5" />
  }

  const getProviderColor = (provider: string) => {
    const colors = {
      twitter: 'bg-blue-500/20 text-blue-200 border-blue-500/30',
      linkedin: 'bg-blue-600/20 text-blue-200 border-blue-600/30',
      facebook: 'bg-blue-700/20 text-blue-200 border-blue-700/30',
      hubspot: 'bg-orange-500/20 text-orange-200 border-orange-500/30',
      salesforce: 'bg-cyan-500/20 text-cyan-200 border-cyan-500/30',
      stripe: 'bg-purple-500/20 text-purple-200 border-purple-500/30',
      paypal: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30',
      twilio: 'bg-red-500/20 text-red-200 border-red-500/30',
      calendly: 'bg-green-500/20 text-green-200 border-green-500/30'
    }
    return colors[provider as keyof typeof colors] || 'bg-gray-500/20 text-gray-200 border-gray-500/30'
  }

  const integrationTypes = [
    { value: 'social', label: 'Social Media', providers: ['twitter', 'linkedin', 'facebook'] },
    { value: 'crm', label: 'CRM', providers: ['hubspot', 'salesforce'] },
    { value: 'payment', label: 'Payment', providers: ['stripe', 'paypal'] },
    { value: 'sms', label: 'SMS', providers: ['twilio'] },
    { value: 'calendar', label: 'Calendar', providers: ['calendly'] }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Integrations</h2>
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </div>

      {showForm && (
        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Connect Integration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Type</Label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, provider: integrationTypes.find(t => t.value === e.target.value)?.providers[0] || '' })}
                className="w-full h-9 bg-black/20 border border-white/10 rounded-md px-3 text-white"
              >
                {integrationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-gray-300">Provider</Label>
              <select
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                className="w-full h-9 bg-black/20 border border-white/10 rounded-md px-3 text-white"
              >
                {integrationTypes.find(t => t.value === formData.type)?.providers.map((provider) => (
                  <option key={provider} value={provider}>
                    {provider.charAt(0).toUpperCase() + provider.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-gray-300">API Key / Access Token</Label>
              <Input
                type="password"
                placeholder="Enter your API key or access token"
                onChange={(e) => setFormData({ 
                  ...formData, 
                  credentials: { ...formData.credentials, accessToken: e.target.value }
                })}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={connectIntegration} className="bg-green-600 hover:bg-green-700">
                Connect
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {integrations.map((integration) => (
          <Card key={integration._id} className="border-white/10 bg-black/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {getProviderIcon(integration.provider)}
                    <div>
                      <h3 className="text-white font-semibold capitalize">
                        {integration.provider}
                      </h3>
                      <p className="text-gray-400 text-sm capitalize">{integration.type}</p>
                    </div>
                  </div>
                  <Badge className={getProviderColor(integration.provider)}>
                    {integration.provider}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Active</span>
                    <Switch
                      checked={integration.isActive}
                      onCheckedChange={(checked) => toggleIntegration(integration._id, checked)}
                    />
                  </div>
                  <Badge className={integration.isActive ? 'bg-green-500/20 text-green-200' : 'bg-gray-500/20 text-gray-200'}>
                    {integration.isActive ? 'Connected' : 'Disabled'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}