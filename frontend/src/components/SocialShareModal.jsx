import React, { useState } from 'react'
import { Button } from './ui/Button'
import { X, Copy, Check, Share2, ExternalLink } from 'lucide-react'

export function SocialShareModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const [copiedX, setCopiedX] = useState(false)
  const [copiedLi, setCopiedLi] = useState(false)

  const xPostText = 
`Excited to share my build for the TinyFish x TechnoJam Bounty Drop 001 at Galgotias University!

Built TinyFish Career Scout — an agentic internship & job discovery engine chaining 3 TinyFish endpoints:
• TinyFish Search: Live ATS discovery across Greenhouse, Lever, Ashby, Workday
• TinyFish Fetch: Clean DOM markdown extraction
• TinyFish Agent: Autonomous browser validation & structured parsing

Zero mock data. Built with Python & shadcn/ui.

@Tiny_Fish #TechnoJam #AIThatClicks #AIWebAgents #OpenSource #GalgotiasUniversity`

  const linkedinPostText = 
`Excited to present my submission for the TinyFish x Team TechnoJam Bounty Drop 001 ("AI That Clicks.") at Galgotias University!

Instead of manually checking dozens of company career pages every week, I built "TinyFish Career Scout" — an agentic job discovery and matching engine that pulls live, verified openings directly from ATS platforms.

Key highlights:
• Chained 3+ TinyFish endpoints: Search for live ATS discovery, Fetch for headless DOM markdown distillation, and Agent for autonomous browser parsing.
• Normalizes and deduplicates multi-portal postings using Pandas with match relevance scoring.
• 100% live web data with zero fallback dummy listings.
• Minimalist, high-performance interface built with shadcn/ui and Python Starlette.

Huge thanks to TinyFish (@tinyfish-ai) and Team TechnoJam for hosting this workshop!

#TinyFish #TechnoJam #AIThatClicks #WebAgents #SoftwareEngineering #Python #GalgotiasUniversity #OpenSource`

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text)
    if (type === 'x') {
      setCopiedX(true)
      setTimeout(() => setCopiedX(false), 2000)
    } else {
      setCopiedLi(true)
      setTimeout(() => setCopiedLi(false), 2000)
    }
  }

  const launchX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(xPostText)}`
    window.open(url, '_blank')
  }

  const launchLinkedIn = () => {
    const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(linkedinPostText)}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-xl border border-neutral-800 bg-[#121214] p-6 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Social Submission Helper</h2>
              <p className="text-xs text-neutral-400">
                Bounty Requirement 6: Post on LinkedIn and X tagging TinyFish
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4 my-4 max-h-[55vh] overflow-y-auto pr-1">
          {/* Post for X */}
          <div className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white">Post on X (Twitter)</span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(xPostText, 'x')}
                  className="h-7 text-xs text-neutral-300 hover:text-white px-2.5"
                >
                  {copiedX ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  {copiedX ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  size="sm"
                  onClick={launchX}
                  className="h-7 text-xs bg-white text-black hover:bg-neutral-200 font-medium px-2.5"
                >
                  <span>Post to X</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            <textarea
              readOnly
              value={xPostText}
              rows={5}
              className="w-full text-xs font-mono bg-black/50 border border-neutral-800 rounded p-2 text-neutral-300 focus:outline-none resize-none"
            />
          </div>

          {/* Post for LinkedIn */}
          <div className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-white">Post on LinkedIn</span>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(linkedinPostText, 'li')}
                  className="h-7 text-xs text-neutral-300 hover:text-white px-2.5"
                >
                  {copiedLi ? <Check className="h-3 w-3 text-emerald-400 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                  {copiedLi ? 'Copied' : 'Copy'}
                </Button>
                <Button
                  size="sm"
                  onClick={launchLinkedIn}
                  className="h-7 text-xs bg-white text-black hover:bg-neutral-200 font-medium px-2.5"
                >
                  <span>Post to LinkedIn</span>
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            <textarea
              readOnly
              value={linkedinPostText}
              rows={6}
              className="w-full text-xs font-mono bg-black/50 border border-neutral-800 rounded p-2 text-neutral-300 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-end">
          <Button onClick={onClose} size="sm" variant="secondary" className="text-xs h-8">
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}
