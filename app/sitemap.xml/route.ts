import { NextResponse } from 'next/server'
import { generateSitemap } from '@/lib/seo'

export async function GET() {
  try {
    const sitemap = await generateSitemap()
    
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate sitemap' }, { status: 500 })
  }
}