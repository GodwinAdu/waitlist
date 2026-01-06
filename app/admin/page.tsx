"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin/admin-header"
import { ProjectCard } from "@/components/admin/project-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import VideoTutorialDialog from "@/components/admin/video-tutorial-dialog"
import { Plus, AlertCircle, Crown, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import type { IProject } from "@/models/Project"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription"
import { toast } from "@/components/ui/toast"

export default function AdminDashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<(IProject & { _id: string })[]>([])
  const [subscription, setSubscription] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  console.log(projects,"projects")

  const fetchData = async () => {
    try {
      const [projectsRes, subscriptionRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/admin/subscription"),
      ])

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData.projects)
      }

      if (subscriptionRes.ok) {
        const subscriptionData = await subscriptionRes.json()
        setSubscription(subscriptionData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete project")

      setProjects(projects.filter((p) => p._id !== id))
      toast.success('Project deleted successfully!')
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error('Failed to delete project')
    }
  }

  const currentPlan = subscription ? SUBSCRIPTION_PLANS[subscription.tier as keyof typeof SUBSCRIPTION_PLANS] : null
  const projectLimit = currentPlan?.maxProjects === -1 ? "Unlimited" : currentPlan?.maxProjects
  const isAtLimit = currentPlan && currentPlan.maxProjects !== -1 && projects.length >= currentPlan.maxProjects

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-40 right-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <AdminHeader />
      
      <main className="relative mx-auto max-w-7xl p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm backdrop-blur-sm mb-4">
            <Sparkles className="h-4 w-4 text-purple-400" />
            <span className="text-purple-200">Welcome back!</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Manage your waitlist projects and track your growth</p>
        </div>
       

        {/* Subscription Card */}
        {subscription && (
          <Card className="mb-8 border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Crown className="h-5 w-5 text-yellow-400" />
                    Current Plan: <span className="capitalize text-purple-200">{subscription.tier}</span>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {projects.length} of {projectLimit} projects used
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${subscription.tier === "free" ? "bg-gray-600" : "bg-gradient-to-r from-purple-600 to-pink-600"} text-white`}>
                    {currentPlan?.price === 0 ? "Free" : `₵${currentPlan?.price}/month`}
                  </Badge>
                  {subscription.tier === "free" && (
                    <Button asChild size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      <Link href="/admin/billing">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Upgrade
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Projects Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white">Your Projects</h2>
            <p className="mt-1 text-gray-300">Create and manage your waitlist projects</p>
          </div>
          <div className="flex gap-3">
            <VideoTutorialDialog />
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
              <Link href="/admin/enhanced">
                <Sparkles className="mr-2 h-4 w-4" />
                Enhanced Dashboard
              </Link>
            </Button>
            <Button 
              asChild 
              disabled={!!isAtLimit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
            >
              <Link href="/admin/projects/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
          </div>
        </div>

        {/* Limit Warning */}
        {isAtLimit && (
          <Card className="mb-8 border-orange-500/50 bg-orange-500/10 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-orange-400" />
                <div className="flex-1">
                  <CardTitle className="text-orange-400">Project Limit Reached</CardTitle>
                  <CardDescription className="text-orange-300">
                    You've reached the maximum of {currentPlan?.maxProjects} projects on the {subscription.tier} plan.
                    Upgrade to create more projects.
                  </CardDescription>
                </div>
                <Button asChild className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white">
                  <Link href="/admin/billing">Upgrade Now</Link>
                </Button>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500 mx-auto mb-4" />
              <p className="text-gray-300">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <Card className="py-20 text-center border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">No projects yet</h3>
            <p className="mb-6 text-gray-300">Create your first waitlist project to get started</p>
            <Button 
              asChild 
              disabled={!!isAtLimit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              <Link href="/admin/projects/new">Create your first project</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}