"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BADGES } from "@/lib/gamification"

interface LeaderboardEntry {
  _id: string
  name: string
  referralCount: number
  tier: string
  points: number
  badges: string[]
}

interface LeaderboardProps {
  projectId: string
  primaryColor?: string
}

const TIER_COLORS = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#ffd700",
  platinum: "#e5e4e2",
}

const TIER_EMOJIS = {
  bronze: "🥉",
  silver: "🥈",
  gold: "🥇",
  platinum: "💎",
}

export function Leaderboard({ projectId, primaryColor }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/leaderboard`)
        const data = await response.json()
        setLeaderboard(data.leaderboard || [])
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000)
    return () => clearInterval(interval)
  }, [projectId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Referrers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">No referrals yet. Be the first!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Top Referrers</span>
          <span className="text-2xl">🏆</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <div
              key={entry._id}
              className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-white"
                  style={{ backgroundColor: primaryColor || "#3b82f6" }}
                >
                  {index + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{entry.name}</p>
                    <span style={{ color: TIER_COLORS[entry.tier as keyof typeof TIER_COLORS] }}>
                      {TIER_EMOJIS[entry.tier as keyof typeof TIER_EMOJIS]}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">{entry.referralCount} referrals</p>
                    <span className="text-xs">•</span>
                    <p className="text-xs text-muted-foreground">{entry.points} points</p>
                  </div>
                  {entry.badges.length > 0 && (
                    <div className="mt-1 flex gap-1">
                      {entry.badges.map((badgeId) => {
                        const badge = Object.values(BADGES).find((b) => b.id === badgeId)
                        return badge ? (
                          <span key={badgeId} title={badge.name} className="text-base">
                            {badge.icon}
                          </span>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
