"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Save, Mail, Gamepad2, CreditCard, Palette, Search, Plus, X, Settings, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface CustomField {
  id: string
  name: string
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea'
  required: boolean
  options?: string[]
  validation?: string
}

interface SubscriptionTier {
  name: string
  price: number
  currency: string
  benefits: string[]
  isActive: boolean
}

interface Props {
  params: Promise<{ id: string }>
}

export default function ProjectSettingsPage({ params }: Props) {
  const router = useRouter()
  const [projectId, setProjectId] = useState<string>("")
  const [projectName, setProjectName] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [newKeyword, setNewKeyword] = useState("")
  const [settings, setSettings] = useState({
    // Email Settings
    emailSettings: {
      smtpHost: "",
      smtpPort: 587,
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "",
      fromName: ""
    },
    // Gamification Settings
    gamificationEnabled: true,
    showLeaderboard: true,
    showLiveSignups: true,
    // A/B Testing
    abTestEnabled: false,
    variants: [],
    // Custom Fields
    customFields: [] as CustomField[],
    // Subscription Settings
    subscriptionEnabled: false,
    subscriptionTiers: [] as SubscriptionTier[],
    // White Label Settings
    whiteLabel: {
      enabled: false,
      domain: "",
      favicon: "",
      brandName: ""
    },
    // SEO Settings
    seo: {
      title: "",
      description: "",
      keywords: [] as string[],
      ogImage: ""
    }
  })

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params
      setProjectId(id)
      fetchProject(id)
    }
    getParams()
  }, [params])

  const fetchProject = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      const data = await response.json()
      if (data.project) {
        const project = data.project
        setProjectName(project.name)
        setSettings({
          emailSettings: project.emailSettings || {
            smtpHost: "",
            smtpPort: 587,
            smtpUser: "",
            smtpPassword: "",
            fromEmail: "",
            fromName: ""
          },
          gamificationEnabled: project.gamificationEnabled ?? true,
          showLeaderboard: project.showLeaderboard ?? true,
          showLiveSignups: project.showLiveSignups ?? true,
          abTestEnabled: project.abTestEnabled ?? false,
          variants: project.variants || [],
          customFields: project.customFields || [],
          subscriptionEnabled: project.subscriptionEnabled ?? false,
          subscriptionTiers: project.subscriptionTiers || [],
          whiteLabel: project.whiteLabel || {
            enabled: false,
            domain: "",
            favicon: "",
            brandName: ""
          },
          seo: project.seo || {
            title: "",
            description: "",
            keywords: [],
            ogImage: ""
          }
        })
      }
    } catch (error) {
      console.error("Failed to fetch project:", error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert("Settings saved successfully!")
      } else {
        alert("Failed to save settings")
      }
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  const addCustomField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      name: 'New Field',
      type: 'text',
      required: false
    }
    setSettings({ ...settings, customFields: [...settings.customFields, newField] })
  }

  const removeCustomField = (index: number) => {
    const newFields = settings.customFields.filter((_, i) => i !== index)
    setSettings({ ...settings, customFields: newFields })
  }

  const addSubscriptionTier = () => {
    const newTier: SubscriptionTier = {
      name: 'New Tier',
      price: 0,
      currency: 'GHS',
      benefits: [],
      isActive: true
    }
    setSettings({ ...settings, subscriptionTiers: [...settings.subscriptionTiers, newTier] })
  }

  const removeSubscriptionTier = (index: number) => {
    const newTiers = settings.subscriptionTiers.filter((_, i) => i !== index)
    setSettings({ ...settings, subscriptionTiers: newTiers })
  }

  const addKeyword = () => {
    const keyword = newKeyword.trim()
    if (keyword && !settings.seo.keywords.includes(keyword)) {
      setSettings({ ...settings, seo: { ...settings.seo, keywords: [...settings.seo.keywords, keyword] } })
      setNewKeyword('')
    }
  }

  const removeKeyword = (index: number) => {
    const newKeywords = settings.seo.keywords.filter((_, i) => i !== index)
    setSettings({ ...settings, seo: { ...settings.seo, keywords: newKeywords } })
  }

  const handleDeleteProject = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE"
      })
      
      if (response.ok) {
        router.push("/admin")
      } else {
        alert("Failed to delete project")
      }
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete project")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <Link href={`/admin`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Project Settings</h1>
            <p className="text-gray-300">Configure your project settings and preferences</p>
          </div>
        </div>

        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="email" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
              <Gamepad2 className="h-4 w-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="subscription" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
              <Palette className="h-4 w-4" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2 data-[state=active]:bg-purple-600">
              <Search className="h-4 w-4" />
              SEO
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6">
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure SMTP settings for project-specific emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-200">SMTP Host</Label>
                    <Input
                      value={settings.emailSettings.smtpHost}
                      onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, smtpHost: e.target.value } })}
                      placeholder="smtp.gmail.com"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-200">SMTP Port</Label>
                    <Input
                      type="number"
                      value={settings.emailSettings.smtpPort}
                      onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, smtpPort: parseInt(e.target.value) } })}
                      placeholder="587"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-200">SMTP User</Label>
                    <Input
                      value={settings.emailSettings.smtpUser}
                      onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, smtpUser: e.target.value } })}
                      placeholder="your-email@gmail.com"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-200">SMTP Password</Label>
                    <Input
                      type="password"
                      value={settings.emailSettings.smtpPassword}
                      onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, smtpPassword: e.target.value } })}
                      placeholder="App-specific password"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-200">From Email</Label>
                    <Input
                      value={settings.emailSettings.fromEmail}
                      onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, fromEmail: e.target.value } })}
                      placeholder="noreply@yourproject.com"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-200">From Name</Label>
                    <Input
                      value={settings.emailSettings.fromName}
                      onChange={(e) => setSettings({ ...settings, emailSettings: { ...settings.emailSettings, fromName: e.target.value } })}
                      placeholder="Your Project Name"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  Feature Settings
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure gamification and interactive features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                  <div>
                    <Label className="text-white font-medium">Gamification</Label>
                    <p className="text-sm text-gray-300">Enable referral system and rewards</p>
                  </div>
                  <Switch
                    checked={settings.gamificationEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, gamificationEnabled: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                  <div>
                    <Label className="text-white font-medium">Leaderboard</Label>
                    <p className="text-sm text-gray-300">Show top referrers publicly</p>
                  </div>
                  <Switch
                    checked={settings.showLeaderboard}
                    onCheckedChange={(checked) => setSettings({ ...settings, showLeaderboard: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                  <div>
                    <Label className="text-white font-medium">Live Signups</Label>
                    <p className="text-sm text-gray-300">Display recent signups in real-time</p>
                  </div>
                  <Switch
                    checked={settings.showLiveSignups}
                    onCheckedChange={(checked) => setSettings({ ...settings, showLiveSignups: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                  <div>
                    <Label className="text-white font-medium">A/B Testing</Label>
                    <p className="text-sm text-gray-300">Test different versions of your landing page</p>
                  </div>
                  <Switch
                    checked={settings.abTestEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, abTestEnabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Custom Fields
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Add custom fields to your waitlist form
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {settings.customFields.map((field, index) => (
                  <div key={field.id} className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                    <div>
                      <p className="text-white font-medium">{field.name}</p>
                      <p className="text-sm text-gray-300">{field.type} {field.required && '(required)'}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomField(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addCustomField}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Custom Field
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Subscription & Billing
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Configure subscription tiers and billing options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                  <div>
                    <Label className="text-white font-medium">Enable Subscriptions</Label>
                    <p className="text-sm text-gray-300">Allow users to subscribe to premium tiers</p>
                  </div>
                  <Switch
                    checked={settings.subscriptionEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, subscriptionEnabled: checked })}
                  />
                </div>
                {settings.subscriptionEnabled && (
                  <div className="space-y-4">
                    {settings.subscriptionTiers.map((tier, index) => (
                      <div key={index} className="p-4 rounded-lg border border-purple-500/30 bg-purple-500/10">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-purple-200 font-medium">{tier.name}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSubscriptionTier(index)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-purple-300 text-sm">{tier.price} {tier.currency}/month</p>
                        <p className="text-purple-300 text-sm">{tier.benefits.length} benefits</p>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={addSubscriptionTier}
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Subscription Tier
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  White Label & Branding
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Customize branding and white-label options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                  <div>
                    <Label className="text-white font-medium">White Label Mode</Label>
                    <p className="text-sm text-gray-300">Remove branding and use custom domain</p>
                  </div>
                  <Switch
                    checked={settings.whiteLabel.enabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, whiteLabel: { ...settings.whiteLabel, enabled: checked } })}
                  />
                </div>
                {settings.whiteLabel.enabled && (
                  <div className="space-y-4 p-4 rounded-lg border border-purple-500/30 bg-purple-500/10">
                    <div className="space-y-2">
                      <Label className="text-purple-200">Custom Domain</Label>
                      <Input
                        value={settings.whiteLabel.domain}
                        onChange={(e) => setSettings({ ...settings, whiteLabel: { ...settings.whiteLabel, domain: e.target.value } })}
                        placeholder="your-domain.com"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-purple-200">Brand Name</Label>
                      <Input
                        value={settings.whiteLabel.brandName}
                        onChange={(e) => setSettings({ ...settings, whiteLabel: { ...settings.whiteLabel, brandName: e.target.value } })}
                        placeholder="Your Brand"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-purple-200">Favicon URL</Label>
                      <Input
                        value={settings.whiteLabel.favicon}
                        onChange={(e) => setSettings({ ...settings, whiteLabel: { ...settings.whiteLabel, favicon: e.target.value } })}
                        placeholder="https://example.com/favicon.ico"
                        className="bg-white/5 border-white/20 text-white"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  SEO & Metadata
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Optimize your project for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-200">SEO Title</Label>
                  <Input
                    value={settings.seo.title}
                    onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, title: e.target.value } })}
                    placeholder="Your Project - Join the Waitlist"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-200">Meta Description</Label>
                  <Textarea
                    value={settings.seo.description}
                    onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, description: e.target.value } })}
                    placeholder="Join our waitlist to be the first to know when we launch..."
                    className="bg-white/5 border-white/20 text-white min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-200">Keywords</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {settings.seo.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-200">
                        {keyword}
                        <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => removeKeyword(index)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add keyword"
                      className="bg-white/5 border-white/20 text-white"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addKeyword()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addKeyword}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-200">Open Graph Image</Label>
                  <Input
                    value={settings.seo.ogImage}
                    onChange={(e) => setSettings({ ...settings, seo: { ...settings.seo, ogImage: e.target.value } })}
                    placeholder="https://example.com/og-image.jpg"
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-red-500/30 bg-red-500/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-300">
              Permanently delete this project and all associated data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-red-500/30">
                <DialogHeader>
                  <DialogTitle className="text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Delete Project
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Are you absolutely sure you want to delete <span className="font-semibold text-white">{projectName}</span>?
                    <br /><br />
                    This action will permanently delete:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>All waitlist users and their data</li>
                      <li>All email campaigns and analytics</li>
                      <li>All project settings and configurations</li>
                      <li>All associated files and media</li>
                    </ul>
                    <br />
                    <span className="text-red-400 font-semibold">This action cannot be undone.</span>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(false)}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteProject}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete Forever"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <div className="flex gap-4 sticky bottom-6">
          <Button onClick={handleSave} disabled={isLoading} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </div>
  )
}