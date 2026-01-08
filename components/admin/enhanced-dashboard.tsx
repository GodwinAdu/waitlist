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
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-pink-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative">
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  Enhanced Dashboard
                </h1>
                <p className="text-gray-300 mt-1 sm:mt-2 text-sm sm:text-base">Comprehensive analytics and management tools</p>
              </div>
              <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 text-sm w-full sm:w-auto">
                <Link href="/admin">
                  ← Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-2 py-4 sm:px-6 sm:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            {/* Mobile Dropdown */}
            <div className="sm:hidden">
              <select 
                value={activeTab} 
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/20 border border-white/10 text-white text-sm"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Tabs */}
            <TabsList className="hidden sm:grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 bg-black/20 backdrop-blur-sm border border-white/10 gap-1">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-1 sm:gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3"
                >
                  <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden md:inline truncate">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
              <AdvancedAnalytics projectId={projectId || 'demo'} />
            </TabsContent>

            <TabsContent value="ab-testing" className="space-y-4 sm:space-y-6">
              <ABAnalytics projectId={projectId || 'demo'} />
            </TabsContent>

            <TabsContent value="ai-content" className="space-y-4 sm:space-y-6">
              <AIContentGenerator projectId={projectId || 'demo'} />
            </TabsContent>

            <TabsContent value="heatmaps" className="space-y-4 sm:space-y-6">
              <HeatmapVisualization projectId={projectId || 'demo'} />
            </TabsContent>

            <TabsContent value="campaigns" className="space-y-4 sm:space-y-6">
              {projectId && projectId !== 'demo' ? (
                <EmailCampaigns projectId={projectId} />
              ) : (
                <div className="text-center py-6 sm:py-8 text-gray-400 px-4">
                  <p className="text-sm sm:text-base">Please select a specific project to manage email campaigns.</p>
                  <p className="text-xs sm:text-sm mt-2">Navigate to /admin/enhanced/[projectId] with a real project ID.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4 sm:space-y-6">
              <IntegrationsManager />
            </TabsContent>

            <TabsContent value="templates" className="space-y-4 sm:space-y-6">
              <div className="mb-3 sm:mb-4">
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
                  className="w-full sm:w-auto px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs sm:text-sm"
                >
                  Load Sample Templates
                </button>
              </div>
              <TemplateMarketplace />
            </TabsContent>

            <TabsContent value="team" className="space-y-4 sm:space-y-6">
              <TeamManagement />
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-4 sm:space-y-6">
              <WebhookManagement />
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 sm:space-y-6">
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                    SEO Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Meta Tags</h3>
                      <p className="text-gray-300 text-xs sm:text-sm">Optimize your page titles and descriptions</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Schema Markup</h3>
                      <p className="text-gray-300 text-xs sm:text-sm">Structured data for better search visibility</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Sitemap Generation</h3>
                      <p className="text-gray-300 text-xs sm:text-sm">Automatic XML sitemap creation</p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Performance Monitoring</h3>
                      <p className="text-gray-300 text-xs sm:text-sm">Core Web Vitals tracking</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="enterprise" className="space-y-4 sm:space-y-6">
              <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    Enterprise Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-white font-semibold text-sm sm:text-base">White-label Solution</h3>
                      <ul className="space-y-1 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
                        <li>• Custom domain mapping</li>
                        <li>• Remove branding</li>
                        <li>• Custom favicon</li>
                        <li>• Brand customization</li>
                      </ul>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-white font-semibold text-sm sm:text-base">API Access</h3>
                      <ul className="space-y-1 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
                        <li>• RESTful API endpoints</li>
                        <li>• Webhook integrations</li>
                        <li>• Real-time data sync</li>
                        <li>• Custom integrations</li>
                      </ul>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Advanced Security</h3>
                      <ul className="space-y-1 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
                        <li>• Two-factor authentication</li>
                        <li>• Audit logs</li>
                        <li>• GDPR compliance</li>
                        <li>• Data encryption</li>
                      </ul>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="text-white font-semibold text-sm sm:text-base">Premium Support</h3>
                      <ul className="space-y-1 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
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