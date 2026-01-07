"use client"

import { Button } from "@/components/ui/button"
import { Share2, MessageCircle, Facebook, Linkedin, Send, Mail } from "lucide-react"

interface SocialShareProps {
  shareUrl: string
  shareText: string
  projectName: string
  primaryColor: string
}

export function SocialShare({ shareUrl, shareText, projectName, primaryColor }: SocialShareProps) {
  const platforms = [
    {
      name: "Twitter",
      icon: Share2,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "#1DA1F2"
    },
    {
      name: "WhatsApp", 
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: "#25D366"
    },
    {
      name: "Facebook",
      icon: Facebook, 
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      color: "#1877F2"
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "#0A66C2"
    },
    {
      name: "Telegram",
      icon: Send,
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
      color: "#0088CC"
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent(`Join ${projectName} Waitlist`)}&body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: "#EA4335"
    }
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
      {platforms.map((platform) => {
        const Icon = platform.icon
        return (
          <Button
            key={platform.name}
            asChild
            variant="outline"
            className="bg-transparent hover:bg-white/10 border-white/20 text-white hover:text-white transition-all duration-300 group"
          >
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 justify-center"
            >
              <Icon 
                className="h-4 w-4 transition-colors duration-300" 
                style={{ color: platform.color }}
              />
              <span className="text-xs sm:text-sm">{platform.name}</span>
            </a>
          </Button>
        )
      })}
    </div>
  )
}