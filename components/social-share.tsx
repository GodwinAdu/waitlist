"use client"

import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon
} from 'react-share'
import { Share2 } from 'lucide-react'

interface SocialShareProps {
  shareUrl: string
  shareText: string
  projectName: string
  primaryColor: string
}

export function SocialShare({ shareUrl, shareText, projectName, primaryColor }: SocialShareProps) {
  const iconSize = 44
  const iconProps = {
    size: iconSize,
    round: true
  }

  // Create catchy share messages for different platforms
  const catchyMessage = `🚀 Just joined the ${projectName} waitlist! Be part of something amazing - secure your spot now! 🎯`
  const emailSubject = `🔥 Don't miss out on ${projectName}!`
  const emailBody = `Hey! I just secured my spot on the ${projectName} waitlist and thought you'd love this too! \n\n${shareText}\n\nJoin me here: ${shareUrl}\n\nLimited spots available - don't wait! 🚀`

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Share2 className="h-5 w-5 text-white/80" />
          <h3 className="text-lg font-semibold text-white">Spread the Word</h3>
        </div>
        <p className="text-white/70 text-sm mb-4">
          Help your friends discover {projectName} and earn rewards for every referral!
        </p>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 justify-items-center">
        <div className="group cursor-pointer">
          <TwitterShareButton url={shareUrl} title={catchyMessage}>
            <TwitterIcon {...iconProps} className="transition-transform group-hover:scale-110" />
          </TwitterShareButton>
        </div>
        
        <div className="group cursor-pointer">
          <FacebookShareButton url={shareUrl} hashtag={`#${projectName.replace(/\s+/g, '')}`}>
            <FacebookIcon {...iconProps} className="transition-transform group-hover:scale-110" />
          </FacebookShareButton>
        </div>
        
        <div className="group cursor-pointer">
          <LinkedinShareButton url={shareUrl} title={catchyMessage}>
            <LinkedinIcon {...iconProps} className="transition-transform group-hover:scale-110" />
          </LinkedinShareButton>
        </div>
        
        <div className="group cursor-pointer">
          <WhatsappShareButton url={shareUrl} title={catchyMessage}>
            <WhatsappIcon {...iconProps} className="transition-transform group-hover:scale-110" />
          </WhatsappShareButton>
        </div>
        
        <div className="group cursor-pointer">
          <TelegramShareButton url={shareUrl} title={catchyMessage}>
            <TelegramIcon {...iconProps} className="transition-transform group-hover:scale-110" />
          </TelegramShareButton>
        </div>
        
        <div className="group cursor-pointer">
          <EmailShareButton
            url={shareUrl}
            subject={emailSubject}
            body={emailBody}
          >
            <EmailIcon {...iconProps} className="transition-transform group-hover:scale-110" />
          </EmailShareButton>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-white/60 text-xs">
          💡 Tip: Share with friends to climb the leaderboard and unlock exclusive rewards!
        </p>
      </div>
    </div>
  )
}