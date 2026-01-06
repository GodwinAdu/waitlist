'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2 } from 'lucide-react'

interface ABTestFormProps {
  abTestEnabled: boolean
  variants: any[]
  onAbTestEnabledChange: (enabled: boolean) => void
  onVariantsChange: (variants: any[]) => void
}

export default function ABTestForm({ abTestEnabled, variants, onAbTestEnabledChange, onVariantsChange }: ABTestFormProps) {
  const addVariant = () => {
    const newVariant = {
      id: Date.now().toString(),
      name: `Variant ${variants.length + 1}`,
      isControl: variants.length === 0,
      traffic: 50,
      headline: '',
      description: '',
      primaryColor: '#3b82f6',
      ctaText: 'Join Waitlist'
    }
    onVariantsChange([...variants, newVariant])
  }

  const removeVariant = (index: number) => {
    onVariantsChange(variants.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    onVariantsChange(updated)
  }

  return (
    <Card className="border-white/10 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">A/B Testing</CardTitle>
            <p className="text-gray-300 text-sm">Test different versions to optimize conversions</p>
          </div>
          <Switch
            checked={abTestEnabled}
            onCheckedChange={onAbTestEnabledChange}
          />
        </div>
      </CardHeader>
      
      {abTestEnabled && (
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-300">Create variants to test different headlines, colors, and CTAs</p>
            <Button onClick={addVariant} size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Variant
            </Button>
          </div>

          {variants.map((variant, index) => (
            <Card key={variant.id} className="border-white/20 bg-black/10">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Variant name"
                    value={variant.name}
                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                    className="bg-black/20 border-white/10 text-white"
                  />
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-gray-400">Traffic %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={variant.traffic}
                      onChange={(e) => updateVariant(index, 'traffic', parseInt(e.target.value))}
                      className="w-20 bg-black/20 border-white/10 text-white"
                    />
                    {variants.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeVariant(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-400">Headline</Label>
                    <Input
                      placeholder="Custom headline"
                      value={variant.headline}
                      onChange={(e) => updateVariant(index, 'headline', e.target.value)}
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">CTA Text</Label>
                    <Input
                      placeholder="Join Waitlist"
                      value={variant.ctaText}
                      onChange={(e) => updateVariant(index, 'ctaText', e.target.value)}
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-400">Description</Label>
                  <Input
                    placeholder="Custom description"
                    value={variant.description}
                    onChange={(e) => updateVariant(index, 'description', e.target.value)}
                    className="bg-black/20 border-white/10 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      )}
    </Card>
  )
}