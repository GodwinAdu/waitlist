'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Download, Crown } from 'lucide-react'

export default function TemplateMarketplace() {
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      const data = await response.json()
      setTemplates(data.templates || [])
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    }
  }

  const categories = ['all', 'saas', 'ecommerce', 'startup', 'mobile', 'crypto']

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Template Marketplace</h2>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template._id} className="border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 relative">
              {template.preview && (
                <img 
                  src={template.preview} 
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              )}
              {template.isPremium && (
                <Badge className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-200 border-yellow-500/30">
                  <Crown className="mr-1 h-3 w-3" />
                  Premium
                </Badge>
              )}
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm">{template.rating}</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm">{template.description}</p>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Download className="h-4 w-4" />
                  {template.downloads} downloads
                </div>
                <div className="flex items-center gap-2">
                  {template.isPremium && (
                    <span className="text-lg font-bold text-white">
                      ${template.price}
                    </span>
                  )}
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                    {template.isPremium ? 'Buy' : 'Use'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}