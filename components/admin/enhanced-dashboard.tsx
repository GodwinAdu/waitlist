'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ABAnalytics from '@/components/admin/ab-analytics'
import AdvancedAnalytics from '@/components/admin/advanced-analytics'
import EmailCampaigns from '@/components/admin/email-campaigns'
import TemplateMarketplace from '@/components/admin/template-marketplace'
import TeamManagement from '@/components/admin/team-management'
import WebhookManagement from '@/components/admin/webhook-management'
import AIContentGenerator from '@/components/admin/ai-content-generator'
import HeatmapVisualization from '@/components/admin/heatmap-visualization'
import IntegrationsManager from '@/components/admin/integrations-manager'
import { 
  BarChart3, 
  Mail, 
  Layout, 
  Users, 
  Webhook, 
  TestTube,
  Globe,
  Crown,
  Settings,
  Sparkles,
  Activity,
  Zap
} from 'lucide-react'
import { Button } from '../ui/button'
import Link from 'next/link'

interface EnhancedDashboardProps {
  projectId?: string
}

export default function EnhancedDashboard({ projectId }: EnhancedDashboardProps) {
  const [activeTab, setActiveTab] = useState('analytics')

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ab-testing', label: 'A/B Testing', icon: TestTube },
    { id: 'ai-content', label: 'AI Content', icon: Sparkles },
    { id: 'heatmaps', label: 'Heatmaps', icon: Activity },
    { id: 'campaigns', label: 'Email Campaigns', icon: Mail },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'templates', label: 'Templates', icon: Layout },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'webhooks', label: 'Webhooks', icon: Webhook },
    { id: 'seo', label: 'SEO Tools', icon: Globe },
    { id: 'enterprise', label: 'Enterprise', icon: Crown }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Enhanced Dashboard
                </h1>
                <p className="text-gray-300 mt-2">Comprehensive analytics and management tools</p>
              </div>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link href="/admin">
                  ← Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-11 bg-black/20 backdrop-blur-sm border border-white/10">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="analytics" className="space-y-6">
              <AdvancedAnalytics projectId={projectId || 'demo'} />
            </TabsContent>

            <TabsContent value="ab-testing" className="space-y-6">
              <ABAnalytics projectId={projectId || 'demo'} />
            </TabsContent>

            <TabsContent value="ai-content" className="space-y-6">
              <AIContentGenerator projectId={projectId || 'demo'} />
            </TabsContent>

            <TabsContent value="heatmaps" className="space-y-6">
              <HeatmapVisualization projectId={projectId || 'demo'} />
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-6">
              {projectId && projectId !== 'demo' ? (
                <EmailCampaigns projectId={projectId} />
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>Please select a specific project to manage email campaigns.</p>
                  <p className="text-sm mt-2">Navigate to /admin/enhanced/[projectId] with a real project ID.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="integrations" className="space-y-6">
              <IntegrationsManager />
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="mb-4">
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/seed', { method: 'POST' })
                      const data = await response.json()
                      if (data.success) {
                        window.location.reload()
                      }
                    } catch (error) {
                      console.error('Seeding failed:', error)
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Load Sample Templates
                </button>
              </div>
              <TemplateMarketplace />
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <TeamManagement />
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-6">
              <WebhookManagement />
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO Tools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold">Meta Tags</h3>
                      <p className="text-gray-300 text-sm">Optimize your page titles and descriptions</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold">Schema Markup</h3>
                      <p className="text-gray-300 text-sm">Structured data for better search visibility</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold">Sitemap Generation</h3>
                      <p className="text-gray-300 text-sm">Automatic XML sitemap creation</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold">Performance Monitoring</h3>
                      <p className="text-gray-300 text-sm">Core Web Vitals tracking</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="enterprise" className="space-y-6">
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    Enterprise Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">White-label Solution</h3>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• Custom domain mapping</li>
                        <li>• Remove branding</li>
                        <li>• Custom favicon</li>
                        <li>• Brand customization</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">API Access</h3>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• RESTful API endpoints</li>
                        <li>• Webhook integrations</li>
                        <li>• Real-time data sync</li>
                        <li>• Custom integrations</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Advanced Security</h3>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• Two-factor authentication</li>
                        <li>• Audit logs</li>
                        <li>• GDPR compliance</li>
                        <li>• Data encryption</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-white font-semibold">Premium Support</h3>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        <li>• Dedicated support team</li>
                        <li>• Priority response</li>
                        <li>• Custom development</li>
                        <li>• Training sessions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}