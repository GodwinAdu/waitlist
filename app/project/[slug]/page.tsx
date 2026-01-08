import { notFound } from "next/navigation"
import { use } from "react"
import crypto from "crypto"
import Image from "next/image"
import dynamic from "next/dynamic"
import { Metadata } from "next"

import WaitlistUser from "@/models/WaitlistUser"
import { WaitlistForm } from "@/components/waitlist/waitlist-form"
import { CountdownTimer } from "@/components/waitlist/countdown-timer"
import { Leaderboard } from "@/components/gamification/leaderboard"
import { LiveSignups } from "@/components/gamification/live-signups"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { Users, Clock, Trophy, Zap } from "lucide-react"

import { projectBySlug } from "@/actions/project.actions"
import { selectVariant } from "@/lib/ab-testing"
import { ABTestVariant } from "@/components/ab-test/variant"
import { generateMetaTags, generateStructuredData } from "@/lib/seo"
import MediaGallery from "@/components/waitlist/media-gallery"

// const MediaGallery = dynamic(
//   () => import("@/components/waitlist/media-gallery"),
//   { ssr: false }
// )

/* -------------------------------------------------------------------------- */
/*                                  METADATA                                  */
/* -------------------------------------------------------------------------- */

interface ProjectPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ ref?: string }>
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await projectBySlug(slug)

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
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
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.twitterTitle,
      description: meta.twitterDescription,
      images: meta.twitterImage ? [meta.twitterImage] : [],
    },
  }
}

/* -------------------------------------------------------------------------- */
/*                                  PAGE WRAP                                 */
/* -------------------------------------------------------------------------- */

export default function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const { slug } = use(params)
  const { ref } = use(searchParams)

  return <ProjectPageContent slug={slug} referralCode={ref} />
}

/* -------------------------------------------------------------------------- */
/*                               PAGE CONTENT                                 */
/* -------------------------------------------------------------------------- */

async function ProjectPageContent({
  slug,
  referralCode,
}: {
  slug: string
  referralCode?: string
}) {
  const project = await projectBySlug(slug)
  if (!project) notFound()

  const totalSignups = await WaitlistUser.countDocuments({
    projectId: project._id,
  })

  /* ----------------------------- A/B TESTING ------------------------------ */
  if (project.abTestEnabled && project.variants?.length) {
    const sessionId = crypto.randomBytes(16).toString("hex")
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
        .select("name createdAt")
        .lean()
    : []

  const leaderboard = project.showLeaderboard
    ? await WaitlistUser.find({
        projectId: project._id,
        referralCount: { $gt: 0 },
      })
        .sort({ referralCount: -1 })
        .limit(10)
        .select("name referralCount tier")
        .lean()
    : []

  const hasMedia =
    project.images?.length || project.videos?.length

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
  {/* MAIN */}
  <main className="mx-auto w-full max-w-[100vw] px-3 py-6 sm:px-6 sm:py-12">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">

      {/* LEFT CONTENT */}
      <section className="lg:col-span-2 space-y-6">

        {/* HERO */}
        <div className="text-center space-y-3 px-1 sm:px-0">
          <Badge className="mx-auto text-xs">🚀 Early Access</Badge>

          <h2 className="text-lg sm:text-3xl lg:text-4xl font-bold leading-snug max-w-[90vw] mx-auto">
            {project.description}
          </h2>

          {project.tagline && (
            <p className="text-xs sm:text-base text-gray-300 max-w-[88vw] mx-auto">
              {project.tagline}
            </p>
          )}
        </div>

        {/* MEDIA */}
        {hasMedia && (
          <Card className="bg-black/30 border-white/10">
            <CardContent className="p-2 sm:p-4">
              <div className="w-full overflow-hidden rounded-xl aspect-video max-h-[220px] sm:max-h-[420px]">
                <MediaGallery
                  images={project.images || []}
                  videos={project.videos || []}
                  projectName={project.name}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* FEATURES */}
        {project.features?.length > 0 && (
          <Card className="bg-black/30 border-white/10">
            <CardContent className="p-3 sm:p-6">
              <h3 className="text-base sm:text-xl font-semibold mb-3">
                What’s Coming
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                {project.features.map((f: any, i: number) => (
                  <div
                    key={i}
                    className="p-3 sm:p-4 rounded-lg border border-white/10 bg-white/5"
                  >
                    <h4 className="text-sm sm:text-base font-semibold mb-1">
                      {f.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* GAMIFICATION */}
        {project.gamificationEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {project.showLeaderboard && (
              <Card className="bg-black/30 border-white/10">
                <CardContent className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-semibold mb-2">
                    🏆 Leaderboard
                  </h3>
                  <Leaderboard
                    projectId={project._id.toString()}
                    primaryColor={project.primaryColor}
                  />
                </CardContent>
              </Card>
            )}

            {project.showLiveSignups && (
              <Card className="bg-black/30 border-white/10">
                <CardContent className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-semibold mb-2">
                    ⚡ Live Signups
                  </h3>
                  <LiveSignups
                    projectId={project._id.toString()}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="w-full">

        {/* MOBILE WAITLIST */}
        <div className="lg:hidden">
          <details className="rounded-xl bg-black/40 border border-white/10">
            <summary className="p-3 text-sm font-semibold cursor-pointer">
              Join the Waitlist 🚀
            </summary>
            <div className="p-3">
              <WaitlistForm
                projectId={project._id.toString()}
                primaryColor={project.primaryColor}
                projectName={project.name}
                projectDescription={project.description}
              />
            </div>
          </details>
        </div>

        {/* DESKTOP WAITLIST */}
        <div className="hidden lg:block sticky top-6">
          <Card className="bg-black/40 border-white/10">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">
                Join the Waitlist
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Early access • No spam • Cancel anytime
              </p>
              <WaitlistForm
                projectId={project._id.toString()}
                primaryColor={project.primaryColor}
                projectName={project.name}
                projectDescription={project.description}
              />
            </CardContent>
          </Card>
        </div>

      </aside>
    </div>
  </main>
</div>

  )
}
