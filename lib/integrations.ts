import Integration from '@/models/Integration'

export async function postToSocial(adminId: string, content: string, platforms: string[]) {
  try {
    const integrations = await Integration.find({
      adminId,
      type: 'social',
      provider: { $in: platforms },
      isActive: true
    })

    const results = []

    for (const integration of integrations) {
      try {
        let result
        
        switch (integration.provider) {
          case 'twitter':
            result = await postToTwitter(integration.credentials, content)
            break
          case 'linkedin':
            result = await postToLinkedIn(integration.credentials, content)
            break
          case 'facebook':
            result = await postToFacebook(integration.credentials, content)
            break
        }
        
        results.push({ platform: integration.provider, success: true, result })
      } catch (error) {
        results.push({ platform: integration.provider, success: false, error: (error as Error).message })
      }
    }

    return results
  } catch (error) {
    console.error('Social posting error:', error)
    throw error
  }
}

async function postToTwitter(credentials: any, content: string) {
  const response = await fetch('https://api.twitter.com/2/tweets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: content })
  })
  
  return await response.json()
}

async function postToLinkedIn(credentials: any, content: string) {
  const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      author: `urn:li:person:${credentials.personId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text: content },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
    })
  })
  
  return await response.json()
}

async function postToFacebook(credentials: any, content: string) {
  const response = await fetch(`https://graph.facebook.com/v18.0/${credentials.pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: content,
      access_token: credentials.accessToken
    })
  })
  
  return await response.json()
}

export async function syncWithCRM(adminId: string, userData: any) {
  try {
    const crmIntegrations = await Integration.find({
      adminId,
      type: 'crm',
      isActive: true
    })

    for (const integration of crmIntegrations) {
      switch (integration.provider) {
        case 'hubspot':
          await syncToHubSpot(integration.credentials, userData)
          break
        case 'salesforce':
          await syncToSalesforce(integration.credentials, userData)
          break
      }
    }
  } catch (error) {
    console.error('CRM sync error:', error)
  }
}

async function syncToHubSpot(credentials: any, userData: any) {
  const response = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        email: userData.email,
        firstname: userData.name.split(' ')[0],
        lastname: userData.name.split(' ').slice(1).join(' '),
        phone: userData.phone,
        company: userData.role
      }
    })
  })
  
  return await response.json()
}

async function syncToSalesforce(credentials: any, userData: any) {
  const response = await fetch(`${credentials.instanceUrl}/services/data/v58.0/sobjects/Lead/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${credentials.accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      FirstName: userData.name.split(' ')[0],
      LastName: userData.name.split(' ').slice(1).join(' ') || 'Unknown',
      Email: userData.email,
      Phone: userData.phone,
      Company: userData.role || 'Unknown'
    })
  })
  
  return await response.json()
}