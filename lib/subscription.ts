// Subscription plans and limits
export const SUBSCRIPTION_PLANS = {
  free: {
    name: "Free",
    price: 0,
    currency: "GHS",
    maxProjects: 3,
    maxWaitlistUsers: 50,
    features: [
      "Up to 3 projects",
      "50 waitlist users per project",
      "Basic analytics",
      "Email notifications",
      "Referral system",
    ],
  },
  pro: {
    name: "Pro",
    price: 50,
    currency: "GHS",
    maxProjects: 20,
    maxWaitlistUsers: 1000,
    features: [
      "Up to 20 projects",
      "1,000 waitlist users per project",
      "Advanced analytics",
      "Priority email support",
      "Custom branding",
      "CSV export",
      "All gamification features",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 200,
    currency: "GHS",
    maxProjects: -1, // unlimited
    maxWaitlistUsers: -1, // unlimited
    features: [
      "Unlimited projects",
      "Unlimited waitlist users",
      "Advanced analytics & reports",
      "Dedicated support",
      "Custom domain support",
      "API access",
      "White-label options",
      "Priority features",
    ],
  },
} as const

export type SubscriptionTier = keyof typeof SUBSCRIPTION_PLANS

const GRACE_PERIOD_DAYS = 10

export function getSubscriptionLimits(tier: SubscriptionTier) {
  return {
    maxProjects: SUBSCRIPTION_PLANS[tier].maxProjects,
    maxWaitlistUsers: SUBSCRIPTION_PLANS[tier].maxWaitlistUsers,
  }
}

export function isSubscriptionActive(status: string, endDate?: Date): boolean {
  if (status === 'active') return true
  if (!endDate) return false
  
  const now = new Date()
  const gracePeriodEnd = new Date(endDate)
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + GRACE_PERIOD_DAYS)
  
  return now <= gracePeriodEnd
}

export function isInGracePeriod(status: string, endDate?: Date): boolean {
  if (status === 'active' || !endDate) return false
  
  const now = new Date()
  const gracePeriodEnd = new Date(endDate)
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + GRACE_PERIOD_DAYS)
  
  return now > endDate && now <= gracePeriodEnd
}

export function getDaysLeftInGracePeriod(endDate: Date): number {
  const now = new Date()
  const gracePeriodEnd = new Date(endDate)
  gracePeriodEnd.setDate(gracePeriodEnd.getDate() + GRACE_PERIOD_DAYS)
  
  const daysLeft = Math.ceil((gracePeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, daysLeft)
}

export function canCreateProject(tier: SubscriptionTier, currentProjectCount: number, status: string, endDate?: Date): boolean {
  if (!isSubscriptionActive(status, endDate)) return false
  
  const limits = getSubscriptionLimits(tier)
  if (limits.maxProjects === -1) return true
  return currentProjectCount < limits.maxProjects
}

export function canAddWaitlistUser(tier: SubscriptionTier, currentUserCount: number, status: string, endDate?: Date): boolean {
  if (!isSubscriptionActive(status, endDate)) return false
  
  const limits = getSubscriptionLimits(tier)
  if (limits.maxWaitlistUsers === -1) return true
  return currentUserCount < limits.maxWaitlistUsers
}
