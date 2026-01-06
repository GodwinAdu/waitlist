import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateContent(type: string, prompt: string, context?: any) {
  try {
    const systemPrompts = {
      email: "You are an expert email marketer. Create compelling email content that drives engagement.",
      landing_page: "You are a conversion optimization expert. Create high-converting landing page copy.",
      social_post: "You are a social media expert. Create engaging social media posts that drive traffic.",
      ad_copy: "You are a digital advertising expert. Create compelling ad copy that converts."
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompts[type as keyof typeof systemPrompts] },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.7
    })

    return {
      content: response.choices[0]?.message?.content || '',
      tokens: response.usage?.total_tokens || 0
    }
  } catch (error) {
    console.error('AI content generation error:', error)
    throw error
  }
}

export async function analyzeUserSegments(users: any[]) {
  try {
    const userSummary = users.map(u => ({
      role: u.role,
      referrals: u.referralCount,
      tier: u.tier,
      signupDate: u.createdAt
    }))

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: "You are a data analyst. Analyze user data and suggest marketing segments." 
        },
        { 
          role: 'user', 
          content: `Analyze this user data and suggest 3-5 marketing segments: ${JSON.stringify(userSummary.slice(0, 100))}` 
        }
      ],
      max_tokens: 300
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('User segmentation error:', error)
    return 'Unable to analyze segments'
  }
}

export async function predictConversions(analyticsData: any) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: "You are a predictive analytics expert. Analyze trends and predict future conversions." 
        },
        { 
          role: 'user', 
          content: `Based on this data, predict next week's signups: ${JSON.stringify(analyticsData)}` 
        }
      ],
      max_tokens: 200
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Prediction error:', error)
    return 'Unable to generate predictions'
  }
}