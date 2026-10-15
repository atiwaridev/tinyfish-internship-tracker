import React, { useState } from 'react'
import { ExternalLink, Cpu, Eye, Copy, Check } from 'lucide-react'

export function JobCard({ job, onScanAgent, onViewDetail }) {
  const [copied, setCopied] = useState(false)

  const initials = (job.company || 'Co')
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleCopyLink = (e) => {
    e.stopPropagation()
    if (job.apply_url) {
      navigator.clipboard.writeText(job.apply_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const isAgentVerified = Boolean(job.agent_verification?.success)

  return (
    <div className="group rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:border-neutral-300 dark:hover:border-neutral-700 p-4 transition-all duration-150 flex flex-col justify-between shadow-xs">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-start gap-2.5 min-w-0 flex-1">
            <div className="h-8 w-8 shrink-0 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h3
                onClick={() => onViewDetail && onViewDetail(job)}
                className="font-medium text-neutral-900 dark:text-white text-sm group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors line-clamp-1 cursor-pointer hover:underline"
                title="Click to view full description"
              >
                {job.title}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="text-neutral-800 dark:text-neutral-300 font-medium truncate">{job.company}</span>
                <span className="text-neutral-300 dark:text-neutral-600">•</span>
                <span className="truncate">{job.location}</span>
              </div>
            </div>
          </div>

          {/* Badges / Match Score */}
          <div className="shrink-0 flex flex-col items-end gap-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60">
              {job.match_score}% match
            </span>
            {isAgentVerified && (
              <span
                className="inline-flex items-center gap-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/50"
                title={`Verified by TinyFish Agent (Run ID: ${job.agent_verification?.run_id})`}
              >
                <Cpu className="h-2.5 w-2.5 text-purple-600 dark:text-purple-400" />
                <span>Agent Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Snippet */}
        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-3">
          {job.snippet}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
            {job.source_portal}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
            {job.seniority}
          </span>
          {(job.skills || []).map((skill, idx) => (
            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 text-neutral-600 dark:text-neutral-400">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800/70 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onViewDetail && onViewDetail(job)}
            className="inline-flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            title="Preview full description extracted by TinyFish Fetch"
          >
            <Eye className="h-3 w-3 text-neutral-400 dark:text-neutral-500" />
            <span>Details</span>
          </button>

          <span className="text-neutral-300 dark:text-neutral-700">•</span>

          <button
            type="button"
            onClick={() => onScanAgent && onScanAgent(job)}
            className="inline-flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            title="Execute TinyFish Agent browser automation on this listing"
          >
            <Cpu className="h-3 w-3 text-neutral-400 dark:text-neutral-500" />
            <span>Agent Scan</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            title="Copy Apply Link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors shadow-xs"
          >
            <span>Apply</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
