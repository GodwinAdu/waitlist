// Gamification logic and utilities

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
}

export const BADGES: Record<string, Badge> = {
  early_bird: {
    id: "early_bird",
    name: "Early Bird",
    description: "One of the first 100 to join",
    icon: "🐦",
  },
  first_referral: {
    id: "first_referral",
    name: "Connector",
    description: "Made your first referral",
    icon: "🤝",
  },
  influencer: {
    id: "influencer",
    name: "Influencer",
    description: "Referred 5 or more people",
    icon: "⭐",
  },
  super_influencer: {
    id: "super_influencer",
    name: "Super Influencer",
    description: "Referred 10 or more people",
    icon: "🌟",
  },
  legend: {
    id: "legend",
    name: "Legend",
    description: "Referred 25 or more people",
    icon: "👑",
  },
}

export function calculateTier(referralCount: number): "bronze" | "silver" | "gold" | "platinum" {
  if (referralCount >= 25) return "platinum"
  if (referralCount >= 10) return "gold"
  if (referralCount >= 5) return "silver"
  return "bronze"
}

export function calculatePoints(referralCount: number, position: number): number {
  let points = 0

  // Base points for joining
  points += 10

  // Referral points
  points += referralCount * 50

  // Early bird bonus (first 100 get bonus points)
  if (position <= 100) {
    points += 100 - position
  }

  return points
}

export function awardBadges(referralCount: number, position: number): string[] {
  const badges: string[] = []

  if (position <= 100) {
    badges.push(BADGES.early_bird.id)
  }

  if (referralCount >= 1) {
    badges.push(BADGES.first_referral.id)
  }

  if (referralCount >= 5) {
    badges.push(BADGES.influencer.id)
  }

  if (referralCount >= 10) {
    badges.push(BADGES.super_influencer.id)
  }

  if (referralCount >= 25) {
    badges.push(BADGES.legend.id)
  }

  return badges
}
