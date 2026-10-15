import React from 'react'
import { Check, Circle, Loader2, AlertCircle } from 'lucide-react'

export function PipelineProgress({ steps, loading, durationMs, totalJobs, mode }) {
  if (!loading && (!steps || steps.length === 0)) {
    return null
  }

  const defaultSteps = [
    { step: 1, name: "TinyFish Search", detail: "Scanning ATS portals for active URLs", status: loading ? "active" : "success" },
    { step: 2, name: "TinyFish Fetch", detail: "Headless DOM markdown extraction", status: loading ? "pending" : "success" },
    { step: 3, name: "TinyFish Agent", detail: "Semantic parsing and seniority matching", status: loading ? "pending" : "success" },
    { step: 4, name: "Pandas Engine", detail: "Deduplication and relevance scoring", status: loading ? "pending" : "success" }
  ]

  const activeSteps = (steps && steps.length > 0) ? steps : defaultSteps

  return (
    <div className="max-w-3xl mx-auto px-4 mb-6">
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] p-3 text-xs font-mono shadow-xs">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-neutral-900 dark:text-neutral-200 font-medium">PIPELINE TELEMETRY</span>
            <span className="text-neutral-300 dark:text-neutral-600">•</span>
            <span>3 Endpoints Chained</span>
          </div>
          {durationMs !== undefined && (
            <div>
              <span>Latency: </span>
              <span className="text-neutral-900 dark:text-white font-medium">{durationMs}ms</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {activeSteps.map((s, idx) => {
            const isCompleted = s.status === 'success' || s.status === 'ready'
            const isError = s.status === 'error'

            return (
              <div
                key={idx}
                className={`p-2 rounded border transition-colors ${
                  isError
                    ? 'border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20'
                    : 'border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] uppercase font-mono ${isError ? 'text-red-600 dark:text-red-400' : 'text-neutral-500'}`}>
                    Step {idx + 1}
                  </span>
                  {isError ? (
                    <AlertCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                  ) : isCompleted ? (
                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  ) : loading ? (
                    <Loader2 className="h-3 w-3 text-neutral-500 dark:text-neutral-400 animate-spin" />
                  ) : (
                    <Circle className="h-2 w-2 text-neutral-400 dark:text-neutral-500" />
                  )}
                </div>
                <div className={`font-medium text-xs truncate ${isError ? 'text-red-700 dark:text-red-300' : 'text-neutral-800 dark:text-neutral-200'}`}>
                  {s.name}
                </div>
                <div className={`text-[11px] truncate mt-0.5 ${isError ? 'text-red-600/90 dark:text-red-400/90' : 'text-neutral-500'}`} title={s.detail}>
                  {s.detail}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
