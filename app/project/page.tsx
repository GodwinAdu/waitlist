import { notFound } from "next/navigation"
import Project from "@/models/Project"
import { WaitlistForm } from "@/components/waitlist/waitlist-form"
import { CountdownTimer } from "@/components/waitlist/countdown-timer"
import { Leaderboard } from "@/components/gamification/leaderboard"
import { LiveSignups } from "@/components/gamification/live-signups"
import Image from "next/image"
import { connectToDB } from "@/lib/mongoose"
import { SubscriptionTiers } from "@/components/subscription/subscription-tier"

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  await connectToDB()
  const project = await Project.findOne({ slug, isActive: true }).lean()

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-b from-muted to-background py-20"
        style={
          project.backgroundImage
            ? {
                backgroundImage: `url(${project.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      >
        {project.backgroundImage && <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />}

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="text-center">
                {project.logo && (
                  <div className="mb-6 flex justify-center">
                    <Image
                      src={project.logo || "/placeholder.svg"}
                      alt={project.name}
                      width={80}
                      height={80}
                      className="rounded-xl"
                    />
                  </div>
                )}

                <h1 className="mb-4 text-balance text-5xl font-bold" style={{ color: project.primaryColor }}>
                  {project.name}
                </h1>

                {project.tagline && (
                  <p className="mb-6 text-balance text-xl text-muted-foreground">{project.tagline}</p>
                )}

                <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg leading-relaxed">{project.description}</p>
              </div>

              {project.launchDate && new Date(project.launchDate) > new Date() && (
                <div className="mb-8">
                  <CountdownTimer launchDate={new Date(project.launchDate)} />
                </div>
              )}

              <div className="mx-auto max-w-md">
                <WaitlistForm projectId={project._id.toString()} primaryColor={project.primaryColor} />
              </div>
            </div>

            {project.gamificationEnabled && (
              <div className="space-y-6">
                {project.showLiveSignups && <LiveSignups projectId={project._id.toString()} />}
                {project.showLeaderboard && (
                  <Leaderboard projectId={project._id.toString()} primaryColor={project.primaryColor} />
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscription Tiers Section */}
      {project.subscriptionEnabled && project.subscriptionTiers && project.subscriptionTiers.length > 0 && (
        <section className="bg-muted py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-4 text-center text-3xl font-bold">Subscription Plans</h2>
            <p className="mb-12 text-center text-muted-foreground">
              Choose a plan that works best for you and get priority access
            </p>
            <SubscriptionTiers tiers={project.subscriptionTiers} userId="" primaryColor={project.primaryColor} />
          </div>
        </section>
      )}

      {/* Features Section */}
      {project.features && project.features.length > 0 && (
        <section className="bg-background py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="mb-12 text-center text-3xl font-bold">Features</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {project.features.map((feature: any, index: number) => (
                <div key={index} className="rounded-lg border bg-card p-6 shadow-sm">
                  {feature.icon && <div className="mb-3 text-4xl">{feature.icon}</div>}
                  <h3 className="mb-2 text-xl font-semibold" style={{ color: project.primaryColor }}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
