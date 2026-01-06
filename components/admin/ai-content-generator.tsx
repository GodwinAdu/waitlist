'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Copy, RefreshCw } from 'lucide-react'

interface AIContentGeneratorProps {
  projectId: string
}

export default function AIContentGenerator({ projectId }: AIContentGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [content, setContent] = useState('')
  const [tokens, setTokens] = useState(0)
  const [formData, setFormData] = useState({
    type: 'email',
    prompt: ''
  })

  const generateContent = async () => {
    setGenerating(true)
    try {
      const response = await fetch(`/api/ai/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, action: 'generate' })
      })
      
      const data = await response.json()
      if (data.error) {
        console.error('AI generation error:', data.error)
        return
      }
      setContent(data.content)
      setTokens(data.tokens)
    } catch (error) {
      console.error('AI generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  const copyContent = () => {
    navigator.clipboard.writeText(content)
  }

  const contentTypes = [
    { value: 'email', label: 'Email Campaign' },
    { value: 'landing_page', label: 'Landing Page Copy' },
    { value: 'social_post', label: 'Social Media Post' },
    { value: 'ad_copy', label: 'Advertisement Copy' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-purple-400" />
        <h2 className="text-2xl font-bold text-white">AI Content Generator</h2>
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          Powered by GPT
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Generate Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Content Type</Label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-9 bg-black/20 border border-white/10 rounded-md px-3 text-white"
              >
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-gray-300">Prompt</Label>
              <Textarea
                value={formData.prompt}
                onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                placeholder="Describe what you want to generate..."
                className="bg-black/20 border-white/10 text-white min-h-[100px]"
              />
            </div>

            <Button 
              onClick={generateContent} 
              disabled={generating || !formData.prompt}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {generating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Generated Content</CardTitle>
              {content && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/20 text-blue-200">
                    {tokens} tokens
                  </Badge>
                  <Button size="sm" onClick={copyContent} variant="ghost">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {content ? (
              <div className="bg-black/30 rounded-lg p-4 text-gray-300 whitespace-pre-wrap">
                {content}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                Generated content will appear here
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}