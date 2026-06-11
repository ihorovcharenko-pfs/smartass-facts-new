'use client'

import { useState } from 'react'
import '../styles/Share.scss'

interface ShareCardProps {
  score: number
  total: number
  category: string
}

function ShareCard({ score, total, category }: ShareCardProps) {
  const [copied, setCopied] = useState(false)

  const shareText = `I scored ${score}/${total} on "${category}" — can you beat me? Play at https://smartassfacts.com 🧠`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText })
        return
      } catch {
        // User cancelled or not supported — fall through to clipboard
      }
    }
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard not available
    }
  }

  return (
    <button className="share-btn" onClick={handleShare}>
      {copied ? '✅ Copied!' : '📤 Share my score'}
    </button>
  )
}

export default ShareCard
