import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('session-id')?.value
  
  if (!sessionId) {
    sessionId = crypto.randomBytes(16).toString('hex')
  }
  
  return sessionId
}

export async function setSessionId(sessionId: string) {
  const cookieStore = await cookies()
  cookieStore.set('session-id', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })
}

export function selectVariant(variants: any[], sessionId: string): any {
  if (!variants || variants.length === 0) return null
  
  // Use session ID to consistently assign same variant to same user
  const hash = crypto.createHash('md5').update(sessionId).digest('hex')
  const hashInt = parseInt(hash.substring(0, 8), 16)
  const percentage = hashInt % 100
  
  let cumulativeTraffic = 0
  for (const variant of variants) {
    cumulativeTraffic += variant.traffic
    if (percentage < cumulativeTraffic) {
      return variant
    }
  }
  
  return variants[0] // fallback
}