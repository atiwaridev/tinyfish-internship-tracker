import React from 'react'
import { ExternalLink } from 'lucide-react'

export function JobTable({ jobs }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] shadow-xs">
      <table className="w-full text-left text-xs">
        <thead className="bg-neutral-50 dark:bg-[#161619] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
          <tr>
            <th className="py-2.5 px-3.5">ROLE & COMPANY</th>
            <th className="py-2.5 px-3.5">LOCATION</th>
            <th className="py-2.5 px-3.5">PORTAL</th>
            <th className="py-2.5 px-3.5">SENIORITY</th>
            <th className="py-2.5 px-3.5">MATCH</th>
            <th className="py-2.5 px-3.5 text-right">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200/80 dark:divide-neutral-800/80 text-neutral-800 dark:text-neutral-200">
          {jobs.map((job) => (
            <tr key={job.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
              <td className="py-2.5 px-3.5">
                <div className="font-medium text-neutral-900 dark:text-white text-xs">{job.title}</div>
                <div className="text-neutral-500 dark:text-neutral-400 text-[11px]">{job.company}</div>
              </td>
              <td className="py-2.5 px-3.5 text-neutral-700 dark:text-neutral-300 text-xs">
                {job.location}
              </td>
              <td className="py-2.5 px-3.5">
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {job.source_portal}
                </span>
              </td>
              <td className="py-2.5 px-3.5 text-neutral-600 dark:text-neutral-400 text-xs">
                {job.seniority}
              </td>
              <td className="py-2.5 px-3.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                {job.match_score}%
              </td>
              <td className="py-2.5 px-3.5 text-right">
                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-medium transition-colors shadow-xs"
                >
                  <span>Apply</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
