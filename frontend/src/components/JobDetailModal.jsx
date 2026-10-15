import React, { useState } from 'react'
import { Button } from './ui/Button'
import { X, ExternalLink, Copy, Check, FileText, CheckCircle2, Sparkles, Building, MapPin } from 'lucide-react'

export function JobDetailModal({ isOpen, onClose, job }) {
  if (!isOpen || !job) return null

  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    if (job.apply_url) {
      navigator.clipboard.writeText(job.apply_url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Clean markdown for preview if available
  const markdownContent = job.page_markdown || job.snippet || "Full job description available on application portal."

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] flex flex-col shadow-2xl text-left overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                {job.source_portal}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                {job.seniority}
              </span>
              <span className="text-[11px] font-mono font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 px-2 py-0.5 rounded">
                {job.match_score}% match
              </span>
            </div>

            <h2 className="text-base font-semibold text-neutral-900 dark:text-white truncate">
              {job.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1 text-neutral-800 dark:text-neutral-300 font-medium">
                <Building className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />
                {job.company}
              </span>
              <span className="text-neutral-300 dark:text-neutral-600">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />
                {job.location}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Match Rationale Card */}
          <div className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-800 dark:text-neutral-200">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Match Scoring Breakdown</span>
            </div>
            <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
              {(job.match_reasons || []).map((reason, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400/80 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Identified Competencies */}
          <div>
            <span className="block text-[11px] font-mono text-neutral-500 uppercase mb-1.5">
              Identified Skills & Technologies
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(job.skills || []).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Full Markdown Extracted by TinyFish Fetch */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-900 dark:text-white">
                <FileText className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />
                <span>Job Description & Requirements</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500">
                TinyFish Fetch Extracted
              </span>
            </div>

            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-black/60 border border-neutral-200 dark:border-neutral-800 font-mono text-xs text-neutral-800 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
              {markdownContent}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-[#161619]/60 flex items-center justify-between gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyLink}
            className="h-8 text-xs border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-white dark:bg-transparent shadow-xs"
          >
            {copied ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                <span>Copied Link</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Apply Link</span>
              </span>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              Close
            </Button>
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-md text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors shadow-xs"
            >
              <span>Apply on {job.source_portal}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
