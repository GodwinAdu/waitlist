import Project from '@/models/Project'

export function generateMetaTags(project: any) {
  return {
    title: project.seo?.title || `${project.name} - Join the Waitlist`,
    description: project.seo?.description || project.description,
    keywords: project.seo?.keywords?.join(', ') || `${project.name}, waitlist, launch`,
    ogTitle: project.seo?.title || project.name,
    ogDescription: project.seo?.description || project.description,
    ogImage: project.seo?.ogImage || project.logo,
    ogUrl: `${process.env.NEXT_PUBLIC_APP_URL}/project/${project.slug}`,
    twitterCard: 'summary_large_image',
    twitterTitle: project.seo?.title || project.name,
    twitterDescription: project.seo?.description || project.description,
    twitterImage: project.seo?.ogImage || project.logo
  }
}

export function generateStructuredData(project: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: project.name,
    description: project.description,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/project/${project.slug}`,
    image: project.logo,
    publisher: {
      '@type': 'Organization',
      name: project.whiteLabel?.brandName || 'Waitlist Platform'
    },
    datePublished: project.createdAt,
    dateModified: project.updatedAt
  }
}

export async function generateSitemap() {
  const projects = await Project.find({ isActive: true }).select('slug updatedAt')
  
  const urls = [
    {
      url: process.env.NEXT_PUBLIC_APP_URL,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 1.0
    },
    ...projects.map(project => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/project/${project.slug}`,
      lastmod: project.updatedAt.toISOString(),
      changefreq: 'weekly',
      priority: 0.8
    }))
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`).join('')}
</urlset>`

  return sitemap
}