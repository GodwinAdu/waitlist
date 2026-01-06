import { notFound } from "next/navigation"
import { use } from "react"
import WaitlistUser from "@/models/WaitlistUser"
import { WaitlistForm } from "@/components/waitlist/waitlist-form"
import { CountdownTimer } from "@/components/waitlist/countdown-timer"
import { Leaderboard } from "@/components/gamification/leaderboard"
import { LiveSignups } from "@/components/gamification/live-signups"
import MediaGallery from "@/components/waitlist/media-gallery"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Trophy, Zap } from "lucide-react"
import { projectBySlug } from "@/actions/project.actions"
import { selectVariant } from "@/lib/ab-testing"
import { ABTestVariant } from "@/components/ab-test/variant"
import { generateMetaTags, generateStructuredData } from "@/lib/seo"
import { Metadata } from "next"
import crypto from "crypto"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string }>
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await projectBySlug(slug)
  
  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.'
    }
  }

  const meta = generateMetaTags(project)
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: meta.ogImage ? [{ url: meta.ogImage }] : [],
      url: meta.ogUrl,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.twitterTitle,
      description: meta.twitterDescription,
      images: meta.twitterImage ? [meta.twitterImage] : []
    }
  }
}

export default function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const { slug } = use(params)
  const { ref } = use(searchParams)

  return <ProjectPageContent slug={slug} referralCode={ref} />
}

async function ProjectPageContent({ slug, referralCode }: { slug: string; referralCode?: string }) {
  const project = await projectBySlug(slug)
  if (!project) {
    notFound()
  }

  const totalSignups = await WaitlistUser.countDocuments({ projectId: project._id })
  
  // A/B Testing Logic
  if (project.abTestEnabled && project.variants && project.variants.length > 0) {
    const sessionId = crypto.randomBytes(16).toString('hex')
    const selectedVariant = selectVariant(project.variants, sessionId)
    
    return (
      <ABTestVariant 
        project={project}
        variant={selectedVariant}
        sessionId={sessionId}
        totalSignups={totalSignups}
        referralCode={referralCode}
      />
    )
  }
  const recentSignups = project.showLiveSignups 
    ? await WaitlistUser.find({ projectId: project._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name createdAt')
        .lean()
    : []

  const leaderboard = project.showLeaderboard
    ? await WaitlistUser.find({ projectId: project._id, referralCount: { $gt: 0 } })
        .sort({ referralCount: -1 })
        .limit(10)
        .select('name referralCount tier')
        .lean()
    : []

  const hasMedia = (project.images && project.images.length > 0) || (project.videos && project.videos.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 sm:gap-4">
                {project.logo && (
                  <img 
                    src={project.logo} 
                    alt={`${project.name} logo`}
                    className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    {project.name}
                  </h1>
                  {project.tagline && (
                    <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">{project.tagline}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/30 text-xs">
                  <Users className="mr-1 h-3 w-3" />
                  <span className="hidden sm:inline">{totalSignups} joined</span>
                  <span className="sm:hidden">{totalSignups}</span>
                </Badge>
                {project.launchDate && (
                  <Badge className="bg-pink-500/20 text-pink-200 border-pink-500/30 text-xs">
                    <Clock className="mr-1 h-3 w-3" />
                    <span className="hidden sm:inline">Launching Soon</span>
                    <span className="sm:hidden">Soon</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-12">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(generateStructuredData(project))
            }}
          />
          <div className="grid gap-6 sm:gap-12 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-12">
              {/* Hero Section */}
              <div className="text-center space-y-4 sm:space-y-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed mb-6 sm:mb-8 md:mb-10 tracking-tight italic">
                    {project.description}
                  </h2>
                  
                  {project.tagline && (
                    <div className="max-w-3xl mx-auto">
                      <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed font-light">
                        {project.tagline}
                      </p>
                    </div>
                  )}
                </div>
                
                {project.launchDate && (
                  <div className="flex justify-center mt-6 sm:mt-12">
                    <CountdownTimer 
                      launchDate={project.launchDate}
                    />
                  </div>
                )}
              </div>

              {/* Media Gallery */}
              {hasMedia && (
                <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-8">
                    <MediaGallery 
                      images={project.images || []}
                      videos={project.videos || []}
                      projectName={project.name}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Features */}
              {project.features && project.features.length > 0 && (
                <Card className="border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 p-4 sm:p-8 text-center border-b border-white/5">
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">What's Coming</h3>
                      <p className="text-gray-300 text-sm sm:text-base">Features that will transform your experience</p>
                    </div>
                    
                    <div className="p-4 sm:p-8">
                      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                        {project.features.map((feature: any, index: number) => (
                          <div key={index} className="group relative p-4 sm:p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-500/20">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-start gap-3 sm:gap-4">
                              {feature.icon && (
                                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-300">
                                  {feature.icon}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base sm:text-lg font-semibold text-white group-hover:text-purple-200 transition-colors duration-300 mb-1 sm:mb-2">
                                  {feature.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Gamification Sections */}
              {project.gamificationEnabled && (
                <div className="grid gap-4 sm:gap-8 sm:grid-cols-2">
                  {/* Leaderboard */}
                  {project.showLeaderboard && leaderboard.length > 0 && (
                    <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-3 sm:mb-4">
                          <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                          <h3 className="text-base sm:text-lg font-semibold text-white">Top Referrers</h3>
                        </div>
                        <Leaderboard 
                          projectId={project._id.toString()}
                          primaryColor={project.primaryColor}
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Live Signups */}
                  {project.showLiveSignups && recentSignups.length > 0 && (
                    <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Zap className="h-5 w-5 text-green-400" />
                          <h3 className="text-lg font-semibold text-white">Recent Signups</h3>
                        </div>
                        <LiveSignups 
                          projectId={project._id.toString()}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - Waitlist Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <Card className="border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden shadow-2xl shadow-purple-500/10">
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 border-b border-white/10">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Join the Waitlist</h3>
                      <p className="text-gray-300 text-sm">Be among the first to experience something amazing</p>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <WaitlistForm 
                      projectId={project._id.toString()}
                      primaryColor={project.primaryColor}
                      projectName={project.name}
                      projectDescription={project.description}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}