"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { AchievementBadges } from "../gamification/achievement-badget"
import { SocialShare } from "@/components/social-share"


interface WaitlistFormProps {
  projectId: string
  primaryColor?: string
  projectName?: string
  projectDescription?: string
}

export function WaitlistForm({ projectId, primaryColor, projectName, projectDescription }: WaitlistFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [position, setPosition] = useState<number | null>(null)
  const [referralCode, setReferralCode] = useState("")
  const [tier, setTier] = useState("")
  const [points, setPoints] = useState(0)
  const [badges, setBadges] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    message: "",
    referralCode: typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("ref") || "" : "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          ...formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist")
      }

      setIsSuccess(true)
      setPosition(data.position)
      setReferralCode(data.referralCode)
      setTier(data.tier)
      setPoints(data.points)
      setBadges(data.badges || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    const referralLink = `${window.location.origin}${window.location.pathname}?ref=${referralCode}`
    const shareMessage = `🚀 I just joined the waitlist for ${projectName || 'this amazing project'}! ${projectDescription ? projectDescription.slice(0, 100) + '...' : 'Don\'t miss out!'} Join me and let\'s be among the first to experience it! ${referralLink}`

    const tierEmojis = {
      bronze: "🥉",
      silver: "🥈",
      gold: "🥇",
      platinum: "💎",
    }

    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="mb-4 text-6xl">🎉</div>
          <h3 className="mb-2 text-2xl font-bold">You're on the list!</h3>
          <div className="mb-4 space-y-1">
            <p className="text-muted-foreground">You're #{position} in line</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{tierEmojis[tier as keyof typeof tierEmojis]}</span>
              <p className="font-semibold capitalize">{tier} Tier</p>
              <span className="text-sm text-muted-foreground">• {points} points</span>
            </div>
          </div>

          {badges.length > 0 && (
            <div className="mx-auto mb-6 max-w-md">
              <AchievementBadges badges={badges} />
            </div>
          )}

          <div className="mx-auto max-w-md space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="mb-2 text-sm font-medium">Share with friends to earn more points and climb the tiers:</p>
              <div className="flex gap-2 mb-4">
                <Input value={referralLink} readOnly className="text-xs" />
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink)
                    // toast.success('Link copied to clipboard!')
                  }}
                >
                  Copy
                </Button>
              </div>
              
              <SocialShare 
                shareUrl={referralLink}
                shareText={shareMessage}
                projectName={projectName || 'this project'}
                primaryColor={primaryColor || '#8b5cf6'}
              />
              
              <p className="mt-4 text-xs text-muted-foreground text-center">Earn 50 points for each referral!</p>
            </div>

            <div className="text-left text-sm text-muted-foreground">
              <p className="mb-1 font-semibold">Tier Benefits:</p>
              <ul className="space-y-1 text-xs">
                <li>🥉 Bronze: Standard access</li>
                <li>🥈 Silver (5+ referrals): Priority support</li>
                <li>🥇 Gold (10+ referrals): Early features & exclusive content</li>
                <li>💎 Platinum (25+ referrals): VIP benefits & lifetime perks</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {formData.referralCode && (
            <div className="rounded-md bg-primary/10 p-3 text-sm">
              <p className="font-medium">You were referred! You and your friend will both earn bonus points.</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">I'm interested as a... (optional)</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="">Select an option</option>
              <option value="user">User</option>
              <option value="developer">Developer</option>
              <option value="investor">Investor</option>
              <option value="partner">Partner</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us what you're most excited about..."
              className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting} style={{ backgroundColor: primaryColor }}>
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
