import Webhook from '@/models/Webhook'
import crypto from 'crypto'

export async function triggerWebhooks(projectId: string, event: string, data: any) {
  try {
    const webhooks = await Webhook.find({ 
      projectId, 
      events: event, 
      isActive: true 
    })

    for (const webhook of webhooks) {
      try {
        const payload = {
          event,
          data,
          timestamp: new Date().toISOString(),
          projectId
        }

        const signature = webhook.secret 
          ? crypto.createHmac('sha256', webhook.secret).update(JSON.stringify(payload)).digest('hex')
          : undefined

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'User-Agent': 'Waitlist-Webhook/1.0',
          ...(webhook.headers || {}),
          ...(signature && { 'X-Webhook-Signature': `sha256=${signature}` })
        }

        const response = await fetch(webhook.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          await Webhook.findByIdAndUpdate(webhook._id, {
            lastTriggered: new Date(),
            failureCount: 0
          })
        } else {
          await Webhook.findByIdAndUpdate(webhook._id, {
            $inc: { failureCount: 1 }
          })
        }
      } catch (error) {
        await Webhook.findByIdAndUpdate(webhook._id, {
          $inc: { failureCount: 1 }
        })
      }
    }
  } catch (error) {
    console.error('Webhook trigger error:', error)
  }
}