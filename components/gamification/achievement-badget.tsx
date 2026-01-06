import { BADGES } from "@/lib/gamification"

interface AchievementBadgesProps {
  badges: string[]
}

export function AchievementBadges({ badges }: AchievementBadgesProps) {
  if (!badges || badges.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Your Achievements</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {badges.map((badgeId) => {
          const badge = Object.values(BADGES).find((b) => b.id === badgeId)
          if (!badge) return null

          return (
            <div key={badgeId} className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm">
              <div className="text-3xl">{badge.icon}</div>
              <div>
                <p className="font-semibold">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
