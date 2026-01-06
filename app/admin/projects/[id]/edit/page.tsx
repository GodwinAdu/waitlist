"use client"

import type React from "react"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import MediaUpload from "@/components/admin/media-upload"
import ABTestForm from "@/components/admin/ab-test-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    primaryColor: "#3b82f6",
    logo: "",
    backgroundImage: "",
    launchDate: "",
    images: [] as string[],
    videos: [] as string[],
    abTestEnabled: false,
    variants: [] as any[],
  })

  const [features, setFeatures] = useState<Array<{ title: string; description: string; icon: string }>>([])

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${id}`)
      if (!response.ok) throw new Error("Failed to fetch project")
      const data = await response.json()
      const project = data.project

      setFormData({
        name: project.name,
        slug: project.slug,
        tagline: project.tagline || "",
        description: project.description,
        primaryColor: project.primaryColor || "#3b82f6",
        logo: project.logo || "",
        backgroundImage: project.backgroundImage || "",
        launchDate: project.launchDate ? new Date(project.launchDate).toISOString().slice(0, 16) : "",
        images: project.images || [],
        videos: project.videos || [],
        abTestEnabled: project.abTestEnabled || false,
        variants: project.variants || [],
      })

      setFeatures(project.features || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          features: features.filter((f) => f.title && f.description),
          launchDate: formData.launchDate || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update project")
      }

      router.push("/admin")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addFeature = () => {
    setFeatures([...features, { title: "", description: "", icon: "" }])
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const updateFeature = (index: number, field: string, value: string) => {
    const updated = [...features]
    updated[index] = { ...updated[index], [field]: value }
    setFeatures(updated)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader />
        <main className="mx-auto max-w-4xl p-6">
          <div className="text-center">Loading project...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="mx-auto max-w-4xl p-6">
        <div className="mb-6">
          <Button asChild variant="ghost" size="sm" className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <h2 className="text-3xl font-bold">Edit Project</h2>
          <p className="mt-1 text-muted-foreground">Update your project details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential details about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="My Awesome App"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/project/</span>
                  <Input
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="my-awesome-app"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="The best app for your needs"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your project in detail..."
                  className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>Customize the look of your landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    className="h-12 w-20"
                  />
                  <Input
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    placeholder="#3b82f6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input
                  id="logo"
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backgroundImage">Background Image URL</Label>
                <Input
                  id="backgroundImage"
                  type="url"
                  value={formData.backgroundImage}
                  onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                  placeholder="https://example.com/background.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="launchDate">Launch Date (optional)</Label>
                <Input
                  id="launchDate"
                  type="datetime-local"
                  value={formData.launchDate}
                  onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Features</CardTitle>
                  <CardDescription>Highlight key features of your project</CardDescription>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={addFeature}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {features.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">No features added yet</p>
              ) : (
                features.map((feature, index) => (
                  <div key={index} className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <Label>Feature {index + 1}</Label>
                      <Button type="button" size="sm" variant="ghost" onClick={() => removeFeature(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Feature title"
                      value={feature.title}
                      onChange={(e) => updateFeature(index, "title", e.target.value)}
                    />
                    <Input
                      placeholder="Feature description"
                      value={feature.description}
                      onChange={(e) => updateFeature(index, "description", e.target.value)}
                    />
                    <Input
                      placeholder="Icon emoji (optional)"
                      value={feature.icon}
                      onChange={(e) => updateFeature(index, "icon", e.target.value)}
                    />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <MediaUpload
            images={formData.images}
            videos={formData.videos}
            onImagesChange={(images) => setFormData({ ...formData, images })}
            onVideosChange={(videos) => setFormData({ ...formData, videos })}
          />

          <ABTestForm
            abTestEnabled={formData.abTestEnabled}
            variants={formData.variants}
            onAbTestEnabledChange={(enabled) => setFormData({ ...formData, abTestEnabled: enabled })}
            onVariantsChange={(variants) => setFormData({ ...formData, variants })}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin">Cancel</Link>
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
