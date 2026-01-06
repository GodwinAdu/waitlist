'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Mail, Send, Users, Eye } from 'lucide-react'

interface EmailCampaignsProps {
  projectId: string
}

export default function EmailCampaigns({ projectId }: EmailCampaignsProps) {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    type: 'custom',
    projectId
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/email-campaigns')
      const data = await response.json()
      setCampaigns(data.campaigns || [])
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    }
  }

  const createCampaign = async () => {
    try {
      const campaignData = {
        ...formData,
        projectId // Ensure projectId is always included
      }
      
      console.log('Sending campaign data:', campaignData)
      
      const response = await fetch('/api/email-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      })
      
      if (response.ok) {
        fetchCampaigns()
        setShowForm(false)
        setFormData({ name: '', subject: '', content: '', type: 'custom', projectId })
      } else {
        const error = await response.json()
        console.error('Campaign creation failed:', error)
      }
    } catch (error) {
      console.error('Failed to create campaign:', error)
    }
  }

  const sendCampaign = async (campaignId: string) => {
    try {
      const response = await fetch(`/api/email-campaigns/${campaignId}/send`, {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert(`Campaign sent successfully! ${data.sent} emails sent out of ${data.total} users.`)
        fetchCampaigns()
      } else {
        alert(`Failed to send campaign: ${data.error}`)
      }
    } catch (error) {
      console.error('Failed to send campaign:', error)
      alert('Failed to send campaign')
    }
  }

  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-200',
    scheduled: 'bg-blue-500/20 text-blue-200',
    sent: 'bg-green-500/20 text-green-200',
    paused: 'bg-yellow-500/20 text-yellow-200'
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Email Campaigns</h2>
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Mail className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      {showForm && (
        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Create Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Campaign Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Subject Line</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-gray-300">Content</Label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full h-32 bg-black/20 border border-white/10 rounded-md p-3 text-white"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createCampaign} className="bg-green-600 hover:bg-green-700">
                Create Campaign
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {campaigns.map((campaign) => (
          <Card key={campaign._id} className="border-white/10 bg-black/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                  <p className="text-gray-300">{campaign.subject}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                      {campaign.status}
                    </Badge>
                    {campaign.status === 'draft' && (
                      <Button 
                        size="sm" 
                        onClick={() => sendCampaign(campaign._id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="mr-1 h-3 w-3" />
                        Send Now
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex gap-4 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {campaign.recipients?.total || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Send className="h-4 w-4" />
                    {campaign.recipients?.sent || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {campaign.recipients?.opened || 0}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}