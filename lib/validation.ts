export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) && email.length <= 254
  },
  
  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  },
  
  password: (password: string): boolean => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /\d/.test(password)
  },
  
  slug: (slug: string): boolean => {
    const slugRegex = /^[a-z0-9-]+$/
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 50
  },
  
  url: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
}

export function sanitizeInput(input: string): string {
  // Basic XSS protection without DOMPurify
  return input
    .trim()
    .replace(/[<>"'&]/g, (match) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      }
      return entities[match] || match
    })
}

export function validateRequired(fields: Record<string, any>): string[] {
  const errors: string[] = []
  
  for (const [key, value] of Object.entries(fields)) {
    if (!value || (typeof value === 'string' && !value.trim())) {
      errors.push(`${key} is required`)
    }
  }
  
  return errors
}

export function validateEmail(email: string): string[] {
  const errors: string[] = []
  
  if (!email) {
    errors.push('Email is required')
  } else if (!validators.email(email)) {
    errors.push('Invalid email format')
  }
  
  return errors
}

export function validatePassword(password: string): string[] {
  const errors: string[] = []
  
  if (!password) {
    errors.push('Password is required')
  } else if (!validators.password(password)) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, and number')
  }
  
  return errors
}