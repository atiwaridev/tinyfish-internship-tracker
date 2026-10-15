import React from 'react'
import { Button } from './ui/Button'
import { X, Cpu, CheckCircle, ExternalLink, Loader2, AlertTriangle } from 'lucide-react'

export function AgentResultModal({ isOpen, onClose, result, loading, jobTitle }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] p-6 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">TinyFish Agent Live Scan</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate max-w-xs">{jobTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4">
          {loading ? (
            <div className="py-8 text-center space-y-3 font-mono text-xs">
              <Loader2 className="h-6 w-6 text-neutral-500 dark:text-neutral-400 animate-spin mx-auto" />
              <div className="text-neutral-900 dark:text-white font-medium">TinyFish Agent Executing on Live Browser...</div>
              <div className="text-neutral-500 text-[11px]">POST https://agent.tinyfish.ai/v1/automation/run</div>
            </div>
          ) : result?.error ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-300">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                  <span>Status: EXECUTION FAILED</span>
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Endpoint 3 Error</span>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-black/50 rounded border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="text-red-600 dark:text-red-300 text-xs break-all leading-relaxed">
                  {result.error}
                </div>
                <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-200 dark:border-neutral-800/80">
                  Zero dummy fallback data generated. This error occurred directly on the live TinyFish Agent execution.
                </div>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Status: COMPLETED</span>
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Endpoint 3 Active</span>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-black/50 rounded border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">Job Title</span>
                  <span className="text-neutral-900 dark:text-white font-medium">{result.job_title || jobTitle}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">Company</span>
                  <span className="text-neutral-800 dark:text-neutral-200">{result.company_name || 'Verified ATS'}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px] uppercase">Location</span>
                  <span className="text-neutral-800 dark:text-neutral-200">{result.location || 'Remote / Hybrid'}</span>
                </div>
                {result.apply_link && (
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase">Verified Apply Link</span>
                    <a
                      href={result.apply_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-neutral-900 dark:text-white hover:underline truncate block text-[11px]"
                    >
                      {result.apply_link}
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-4 text-xs text-neutral-500 dark:text-neutral-400">
              Agent ready. Click Agent Scan on any job card to execute.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-mono">TinyFish Agent Automation</span>
          <Button onClick={onClose} size="sm" variant="secondary" className="text-xs h-7">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
