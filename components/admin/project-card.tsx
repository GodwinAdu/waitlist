"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Edit, Trash2, Users, ExternalLink, Share, Copy, Sparkles, Settings } from "lucide-react"
import Link from "next/link"
import type { IProject } from "@/models/Project"
import { toast } from "@/components/ui/toast"

interface ProjectCardProps {
  project: IProject & { _id: string }
  onDelete: (id: string) => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const projectUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/project/${project.slug}`
  const shareMessage = `🚀 Check out ${project.name}! ${project.description.slice(0, 100)}... Join the waitlist now: ${projectUrl}`

  const copyProjectLink = () => {
    navigator.clipboard.writeText(projectUrl)
    toast.success('Project link copied to clipboard!')
  }

  const shareProject = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`
    window.open(twitterUrl, '_blank')
  }
  return (
    <Card className="group border-white/10 bg-black/20 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg text-white group-hover:text-purple-200 transition-colors">{project.name}</CardTitle>
            <CardDescription className="mt-1 text-gray-400 flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              /project/{project.slug}
            </CardDescription>
          </div>
          <div 
            className="h-8 w-8 rounded-full border-2 border-white/20 shadow-lg" 
            style={{ backgroundColor: project.primaryColor || "#8b5cf6" }} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-6 line-clamp-2 text-sm text-gray-300">{project.description}</p>
        
        {/* Share Section */}
        <div className="mb-4 p-3 rounded-lg border border-purple-500/30 bg-purple-500/10">
          <p className="text-xs text-purple-200 mb-2 font-medium">Share your waitlist:</p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={copyProjectLink}
              className="flex-1 border-purple-500/50 text-purple-200 hover:text-white hover:bg-purple-500/20 text-xs"
            >
              <Copy className="mr-1 h-3 w-3" />
              Copy Link
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={shareProject}
              className="flex-1 border-purple-500/50 text-purple-200 hover:text-white hover:bg-purple-500/20 text-xs"
            >
              <Share className="mr-1 h-3 w-3" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button asChild size="sm" variant="outline" className="border-purple-500/50 text-purple-200 hover:text-white hover:bg-purple-500/20 transition-all duration-300">
            <Link href={`/project/${project.slug}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-blue-500/50 text-blue-200 hover:text-white hover:bg-blue-500/20 transition-all duration-300">
            <Link href={`/admin/projects/${project._id}/waitlist`}>
              <Users className="mr-2 h-4 w-4" />
              Waitlist
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-green-500/50 text-green-200 hover:text-white hover:bg-green-500/20 transition-all duration-300">
            <Link href={`/admin/projects/${project._id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="border-orange-500/50 text-orange-200 hover:text-white hover:bg-orange-500/20 transition-all duration-300">
            <Link href={`/admin/projects/${project._id}/settings`}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
        
        <div className="mt-3">
          <Button asChild size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Link href={`/admin/enhanced/${project._id}`}>
              <Sparkles className="mr-2 h-4 w-4" />
              Enhanced Dashboard
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}