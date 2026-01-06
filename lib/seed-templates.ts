import { connectToDB } from '@/lib/mongoose'
import Template from '@/models/Template'

const sampleTemplates = [
  {
    name: 'SaaS Launch',
    category: 'saas',
    description: 'Perfect for software product launches with clean design and conversion focus',
    preview: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400',
    isPremium: false,
    price: 0,
    downloads: 1250,
    rating: 4.8,
    config: {
      layout: 'centered',
      colors: { primary: '#3b82f6', secondary: '#1e40af', accent: '#06b6d4' },
      fonts: { heading: 'Inter', body: 'Inter' },
      sections: ['hero', 'features', 'pricing', 'testimonials']
    }
  },
  {
    name: 'E-commerce Store',
    category: 'ecommerce',
    description: 'Optimized for product launches and online store waitlists',
    preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    isPremium: true,
    price: 29,
    downloads: 890,
    rating: 4.9,
    config: {
      layout: 'grid',
      colors: { primary: '#f59e0b', secondary: '#d97706', accent: '#92400e' },
      fonts: { heading: 'Poppins', body: 'Open Sans' },
      sections: ['hero', 'product-showcase', 'features', 'social-proof']
    }
  },
  {
    name: 'Startup MVP',
    category: 'startup',
    description: 'Minimal and modern design for early-stage startups',
    preview: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
    isPremium: false,
    price: 0,
    downloads: 2100,
    rating: 4.7,
    config: {
      layout: 'minimal',
      colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a855f7' },
      fonts: { heading: 'Montserrat', body: 'Source Sans Pro' },
      sections: ['hero', 'problem-solution', 'early-access']
    }
  },
  {
    name: 'Mobile App Launch',
    category: 'mobile',
    description: 'Designed specifically for mobile app pre-launch campaigns',
    preview: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    isPremium: true,
    price: 39,
    downloads: 650,
    rating: 4.6,
    config: {
      layout: 'mobile-first',
      colors: { primary: '#10b981', secondary: '#059669', accent: '#047857' },
      fonts: { heading: 'Roboto', body: 'Roboto' },
      sections: ['hero', 'app-preview', 'features', 'download-links']
    }
  },
  {
    name: 'Crypto Project',
    category: 'crypto',
    description: 'Bold design for cryptocurrency and blockchain projects',
    preview: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
    isPremium: true,
    price: 49,
    downloads: 420,
    rating: 4.5,
    config: {
      layout: 'dark-theme',
      colors: { primary: '#f97316', secondary: '#ea580c', accent: '#dc2626' },
      fonts: { heading: 'Orbitron', body: 'Space Mono' },
      sections: ['hero', 'tokenomics', 'roadmap', 'community']
    }
  },
  {
    name: 'Course Launch',
    category: 'education',
    description: 'Perfect for online courses and educational content',
    preview: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400',
    isPremium: false,
    price: 0,
    downloads: 980,
    rating: 4.4,
    config: {
      layout: 'educational',
      colors: { primary: '#6366f1', secondary: '#4f46e5', accent: '#7c3aed' },
      fonts: { heading: 'Nunito', body: 'Lato' },
      sections: ['hero', 'curriculum', 'instructor', 'testimonials']
    }
  }
]

export async function seedTemplates() {
  try {
    await connectToDB()
    
    // Clear existing templates
    await Template.deleteMany({})
    
    // Insert sample templates
    await Template.insertMany(sampleTemplates)
    
    console.log('✅ Templates seeded successfully!')
    return { success: true, count: sampleTemplates.length }
  } catch (error) {
    console.error('❌ Template seeding failed:', error)
    return { success: false, error }
  }
}