import { ReactNode } from 'react'

interface MobileLayoutProps {
  children: ReactNode
  className?: string
  withBackground?: boolean
}

export function MobileLayout({ children, className = '', withBackground = true }: MobileLayoutProps) {
  return (
    <div className={`mobile-viewport ${withBackground ? 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950' : ''} ${className}`}>
      {withBackground && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 -left-20 sm:top-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          <div className="absolute bottom-20 right-1/3 sm:bottom-40 w-40 h-40 sm:w-80 sm:h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>
      )}
      <div className="relative">
        {children}
      </div>
    </div>
  )
}

interface MobileContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl'
}

export function MobileContainer({ children, className = '', maxWidth = '7xl' }: MobileContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl'
  }

  return (
    <div className={`mobile-container ${maxWidthClasses[maxWidth]} mx-auto ${className}`}>
      {children}
    </div>
  )
}