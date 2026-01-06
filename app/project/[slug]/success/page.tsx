"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AchievementBadges } from "@/components/gamification/achievement-badget"
import { CopyButton } from "@/components/copy-button"

const TIER_COLORS = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#ffd700",
  platinum: "#e5e4e2",
}

const TIER_NAMES = {
  bronze: "Bronze Member",
  silver: "Silver Member",
  gold: "Gold Member",
  platinum: "Platinum Member",
}

interface SuccessPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    position?: string
    referralCode?: string
    tier?: string
    points?: string
    badges?: string
  }>
}

export default function SuccessPage({ params, searchParams }: SuccessPageProps) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [slug, setSlug] = useState<string>("")
  const [urlParams, setUrlParams] = useState<any>({})

  useEffect(() => {
    const getParams = async () => {
      const { slug: slugParam } = await params
      const searchParamsData = await searchParams
      setSlug(slugParam)
      setUrlParams(searchParamsData)
      
      try {
        const response = await fetch(`/api/projects/slug/${slugParam}`)
        if (!response.ok) {
          notFound()
          return
        }
        const data = await response.json()
        setProject(data.project)
      } catch (error) {
        console.error("Failed to fetch project:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    getParams()
  }, [params, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-muted to-background py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    notFound()
  }

  const { position, referralCode, tier, points, badges } = urlParams

  const badgesList = badges ? badges.split(",") : []
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/project/${slug}?ref=${referralCode}`
  const shareText = `I just joined the waitlist for ${project.name}! Join me using my referral link.`

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background py-20">
      <div className="mx-auto max-w-3xl px-6">
        <Card className="border-2" style={{ borderColor: project.primaryColor }}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✅
            </div>
            <CardTitle className="text-3xl font-bold">You're on the list!</CardTitle>
            <p className="text-muted-foreground">Thank you for joining {project.name}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Position & Tier */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">Your Position</p>
                <p className="text-3xl font-bold" style={{ color: project.primaryColor }}>
                  #{position}
                </p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">Current Tier</p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: TIER_COLORS[tier as keyof typeof TIER_COLORS] || "#cd7f32" }}
                >
                  {TIER_NAMES[tier as keyof typeof TIER_NAMES] || "Bronze Member"}
                </p>
              </div>
            </div>

            {/* Points */}
            <div className="rounded-lg border bg-gradient-to-r from-primary/10 to-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Points</p>
              <p className="text-4xl font-bold" style={{ color: project.primaryColor }}>
                {points || 0}
              </p>
            </div>

            {/* Achievements */}
            {badgesList.length > 0 && (
              <div>
                <AchievementBadges badges={badgesList} />
              </div>
            )}

            {/* Referral Section */}
            {project.gamificationEnabled && referralCode && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-3 text-center text-lg font-semibold">Climb the Ranks!</h3>
                <p className="mb-4 text-center text-sm text-muted-foreground">
                  Share your unique referral link to earn points and unlock higher tiers
                </p>

                <div className="mb-4 rounded-lg bg-muted p-3">
                  <p className="break-all text-center text-sm font-mono">{shareUrl}</p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <CopyButton shareUrl={shareUrl} primaryColor={project.primaryColor} />
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Share on Twitter
                    </a>
                  </Button>
                </div>

                <div className="mt-4 space-y-2 text-center text-xs text-muted-foreground">
                  <p>🥉 Bronze: 0-4 referrals</p>
                  <p>🥈 Silver: 5-9 referrals</p>
                  <p>🥇 Gold: 10-24 referrals</p>
                  <p>💎 Platinum: 25+ referrals</p>
                </div>
              </div>
            )}

            <div className="pt-4 text-center">
              <Button asChild variant="outline">
                <Link href={`/project/${slug}`}>Back to Project Page</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
