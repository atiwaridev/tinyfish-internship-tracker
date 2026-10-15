import React, { useState } from 'react'
import { Button } from './ui/Button'
import { X, Search, FileText, Cpu, Check, Layers, ExternalLink } from 'lucide-react'

export function ArchitectureModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const [activeTab, setActiveTab] = useState('pipeline')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl border border-neutral-800 bg-[#121214] p-6 shadow-2xl text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">How TinyFish is Used</h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">
                  Chained Pipeline
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Bounty Requirement 5: Explanation of Search, Fetch, and Agent
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

        {/* Tab navigation */}
        <div className="flex items-center gap-2 mt-4 mb-4 border-b border-neutral-800/80 pb-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Architecture Pipeline
          </button>
          <button
            onClick={() => setActiveTab('spec')}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'spec'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            API Specifications
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'pipeline' ? (
          <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
            {/* Step 1 */}
            <div className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/30">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Search className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="font-medium text-white text-xs">1. TinyFish Search API</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">GET api.search.tinyfish.ai</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Queries live ATS domains (Greenhouse, Lever, Ashby, Workday) via the Search API. Returns real-time ranked results with URLs and titles without maintaining static site scrapers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/30">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="font-medium text-white text-xs">2. TinyFish Fetch API</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">POST api.fetch.tinyfish.ai</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Renders JavaScript-heavy career pages in headless Chromium. Removes cookie banners, navigation, and boilerplate, returning clean semantic Markdown in the <code>text</code> field.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/30">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="font-medium text-white text-xs">3. TinyFish Agent API</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">POST agent.tinyfish.ai/v1/automation/run</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Executes goal-based extraction to extract role titles, company names, locations, and direct apply links, while matching requested seniority and calculating match scores.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-lg border border-neutral-800 bg-neutral-900/30">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-neutral-400" />
                  <span className="font-medium text-white text-xs">4. Pandas Deduplication & Ranking</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-500">Python Engine</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Normalizes job titles and company names across portals to remove duplicate postings and sorts results by descending relevance score.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1 font-mono text-xs">
            <div className="p-3 bg-black/60 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px] mb-1">// Authentication Header (docs.tinyfish.ai/authentication)</div>
              <pre className="text-neutral-200 text-[11px]">
{`headers = {
    "X-API-Key": os.getenv("TINYFISH_API_KEY"),
    "Content-Type": "application/json"
}`}
              </pre>
            </div>
            <div className="p-3 bg-black/60 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px] mb-1">// Search Endpoint (docs.tinyfish.ai/search-api/reference)</div>
              <pre className="text-neutral-200 text-[11px]">
{`GET https://api.search.tinyfish.ai?query=Software+Engineer+Intern&include_domains=greenhouse.io,lever.co,ashbyhq.com&location=US`}
              </pre>
            </div>
            <div className="p-3 bg-black/60 rounded-lg border border-neutral-800">
              <div className="text-neutral-400 text-[11px] mb-1">// Fetch Endpoint (docs.tinyfish.ai/fetch-api/reference)</div>
              <pre className="text-neutral-200 text-[11px]">
{`POST https://api.fetch.tinyfish.ai
Body: {"urls": ["https://boards.greenhouse.io/..."], "format": "markdown"}`}
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
          <a
            href="https://docs.tinyfish.ai"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1"
          >
            <span>docs.tinyfish.ai</span>
            <ExternalLink className="h-3 w-3" />
          </a>
          <Button onClick={onClose} size="sm" variant="secondary" className="text-xs h-8">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
