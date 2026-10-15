import React, { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { SearchHero } from './components/SearchHero'
import { PipelineProgress } from './components/PipelineProgress'
import { JobCard } from './components/JobCard'
import { JobTable } from './components/JobTable'
import { AgentResultModal } from './components/AgentResultModal'
import { JobDetailModal } from './components/JobDetailModal'
import { Button } from './components/ui/Button'
import { LayoutGrid, Table, Download, RefreshCw, AlertCircle, Search, ArrowUpDown } from 'lucide-react'

export function App() {
  // Initial state is blank on load - no autofill
  const [role, setRole] = useState("")
  const [workMode, setWorkMode] = useState("remote")
  const [city, setCity] = useState("")
  const [seniority, setSeniority] = useState("")
  const [keywords, setKeywords] = useState("")
  const [portals, setPortals] = useState(["greenhouse.io", "lever.co", "ashbyhq.com"])
  const [autoAgentVerify, setAutoAgentVerify] = useState(false)

  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [jobs, setJobs] = useState([])
  const [steps, setSteps] = useState([])
  const [telemetry, setTelemetry] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [selectedPortalFilter, setSelectedPortalFilter] = useState('all')
  const [sortBy, setSortBy] = useState('match')
  const [lastSyncedTime, setLastSyncedTime] = useState(null)
  // Default is light theme with switcher to dark
  const [theme, setTheme] = useState(() => localStorage.getItem("tinyfish_theme") || "light")

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem("tinyfish_theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const [selectedJobForDetail, setSelectedJobForDetail] = useState(null)
  const [apiStatus, setApiStatus] = useState(null)
  const [notification, setNotification] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)

  // Rate limit cooldown countdown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return
    const timer = setInterval(() => {
      setCooldownSeconds(prev => {
        if (prev <= 1) {
          setIsRateLimited(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldownSeconds])

  // Agent Modal State
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false)
  const [agentLoading, setAgentLoading] = useState(false)
  const [agentResult, setAgentResult] = useState(null)
  const [agentJobTitle, setAgentJobTitle] = useState("")

  // Fetch health status on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setApiStatus(data))
      .catch(() => {
        setApiStatus({ status: 'online', has_api_key: true, key_source: 'environment' })
      })
  }, [])

  // Execute Search Pipeline
  const handleSearch = async () => {
    if (isRateLimited && cooldownSeconds > 0) return
    setLoading(true)
    setHasSearched(true)
    setApiError(null)
    setNotification(null)

    const locationQuery = workMode === 'onsite'
      ? (city.trim() || 'On-site')
      : 'Remote'

    try {
      const resp = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          location: locationQuery,
          seniority,
          keywords,
          portals,
          auto_agent_verify: autoAgentVerify
        })
      })

      const data = await resp.json().catch(() => ({}))

      if (!resp.ok || data.success === false) {
        const rateLimitHit = resp.status === 429 || data.rate_limited || (data.error && data.error.includes("429"))
        const errorMsg = data.error || (rateLimitHit
          ? "TinyFish API rate limit reached (HTTP 429: Too Many Requests). Please wait 15 seconds before scanning again."
          : `TinyFish Search API error (status ${resp.status})`)
        setApiError(errorMsg)
        if (rateLimitHit) {
          setIsRateLimited(true)
          setCooldownSeconds(15)
        }
        setJobs([])
        setSteps(data.steps || [
          { step: 1, name: "TinyFish Search", status: "error", detail: rateLimitHit ? "Rate limit reached (429)" : errorMsg }
        ])
        setTelemetry({
          durationMs: data.duration_ms || 0,
          mode: 'error'
        })
        return
      }

      setJobs(data.jobs || [])
      setSteps(data.steps || [])
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      setTelemetry({
        durationMs: data.duration_ms,
        mode: 'live-api'
      })

      if (data.message && (!data.jobs || data.jobs.length === 0)) {
        setNotification(data.message)
      }
    } catch (err) {
      console.error('Search error:', err)
      setApiError(`Network or server connection failed: ${err.message}`)
      setJobs([])
      setSteps([
        { step: 1, name: "TinyFish Search", status: "error", detail: err.message }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Deep Agent scan on individual job
  const handleScanAgent = async (job) => {
    setAgentJobTitle(job.title)
    setIsAgentModalOpen(true)
    setAgentLoading(true)
    setAgentResult(null)

    try {
      const resp = await fetch('/api/agent-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: job.apply_url,
          role: job.title,
          location: job.location,
          seniority: job.seniority
        })
      })

      const data = await resp.json().catch(() => ({}))
      if (resp.ok && data.success && data.result) {
        setAgentResult(data.result)
      } else {
        setAgentResult({
          error: data.error || `TinyFish Agent API returned status ${resp.status}`
        })
      }
    } catch (err) {
      setAgentResult({
        error: `TinyFish Agent network connection error: ${err.message}`
      })
    } finally {
      setAgentLoading(false)
    }
  }

  // Portal counts for visual distribution metrics
  const portalCounts = {
    all: jobs.length,
    greenhouse: jobs.filter(j => j.source_portal?.toLowerCase() === 'greenhouse').length,
    lever: jobs.filter(j => j.source_portal?.toLowerCase() === 'lever').length,
    ashby: jobs.filter(j => j.source_portal?.toLowerCase() === 'ashby').length,
    workday: jobs.filter(j => j.source_portal?.toLowerCase() === 'workday').length,
  }

  // Filter jobs by selected portal
  const filteredJobs = selectedPortalFilter === 'all'
    ? jobs
    : jobs.filter(j => j.source_portal?.toLowerCase() === selectedPortalFilter.toLowerCase())

  // Sort by match score or company name
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'company') {
      return a.company.localeCompare(b.company)
    }
    return (b.match_score || 0) - (a.match_score || 0)
  })

  // Export to CSV
  const handleExportCSV = () => {
    if (!jobs || jobs.length === 0) return
    const headers = ['Title', 'Company', 'Location', 'Seniority', 'Portal', 'Match Score', 'Apply URL']
    const rows = sortedJobs.map(j => [
      `"${j.title.replace(/"/g, '""')}"`,
      `"${j.company.replace(/"/g, '""')}"`,
      `"${j.location.replace(/"/g, '""')}"`,
      `"${j.seniority.replace(/"/g, '""')}"`,
      `"${j.source_portal.replace(/"/g, '""')}"`,
      j.match_score,
      `"${j.apply_url}"`
    ])
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `tinyfish_${role.replace(/\s+/g, '_').toLowerCase()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="relative min-h-screen bg-neutral-50 dark:bg-[#09090b] text-neutral-900 dark:text-[#ececec] flex flex-col font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-150">
      {/* Background grid pattern layer */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-pattern-grid" aria-hidden="true" />

      {/* Header with Branding, Docs & Theme Toggle */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 pb-16">
        <SearchHero
          role={role}
          setRole={setRole}
          workMode={workMode}
          setWorkMode={setWorkMode}
          city={city}
          setCity={setCity}
          seniority={seniority}
          setSeniority={setSeniority}
          keywords={keywords}
          setKeywords={setKeywords}
          portals={portals}
          setPortals={setPortals}
          onSearch={handleSearch}
          loading={loading}
          autoAgentVerify={autoAgentVerify}
          setAutoAgentVerify={setAutoAgentVerify}
          lastSyncedTime={lastSyncedTime}
        />

        {/* Telemetry Stepper (only visible when a search has been executed or in progress) */}
        {(hasSearched || loading) && (
          <PipelineProgress
            steps={steps}
            loading={loading}
            durationMs={telemetry?.durationMs}
            totalJobs={jobs.length}
            mode={telemetry?.mode}
          />
        )}

        {/* Prominent API Error Alert on Dashboard */}
        {apiError && (
          <div className={`max-w-3xl mx-auto mb-5 rounded-lg border p-4 text-left shadow-xs ${
            isRateLimited
              ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/20'
              : 'border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20'
          }`}>
            <div className="flex items-start gap-3">
              <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${
                isRateLimited ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
              }`} />
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${
                    isRateLimited ? 'text-amber-800 dark:text-amber-300' : 'text-red-700 dark:text-red-300'
                  }`}>
                    {isRateLimited ? 'TinyFish API Rate Limit (429)' : 'TinyFish API Error'}
                  </span>
                  <span className={`text-[10px] font-mono uppercase tracking-wider ${
                    isRateLimited ? 'text-amber-700 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {isRateLimited ? 'Rate Throttling' : 'No Fallback Dummy Data'}
                  </span>
                </div>
                <p className={`text-xs font-mono break-all leading-relaxed p-2.5 rounded border ${
                  isRateLimited
                    ? 'text-amber-900 dark:text-amber-200/90 bg-white/80 dark:bg-black/40 border-amber-200 dark:border-amber-900/40'
                    : 'text-red-800 dark:text-red-200/90 bg-white/80 dark:bg-black/40 border-red-200 dark:border-red-900/40'
                }`}>
                  {apiError}
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                  <span>
                    {isRateLimited
                      ? `Too many requests sent in a short window. Please wait ${cooldownSeconds}s before retrying.`
                      : <>Zero dummy fallback data is returned. Verify your connection or API key in <code className="text-neutral-900 dark:text-neutral-200 font-semibold">.env</code>.</>}
                  </span>
                  <Button
                    onClick={handleSearch}
                    disabled={isRateLimited && cooldownSeconds > 0}
                    size="sm"
                    variant="ghost"
                    className={`h-6 text-xs px-2 shrink-0 ml-2 ${
                      isRateLimited
                        ? 'text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 disabled:opacity-40'
                        : 'text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-white hover:bg-red-100 dark:hover:bg-red-900/40'
                    }`}
                  >
                    {isRateLimited && cooldownSeconds > 0 ? `Wait (${cooldownSeconds}s)` : 'Retry Search'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiet Notification Banner */}
        {notification && (
          <div className="max-w-3xl mx-auto mb-5 px-3 py-2 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] text-xs text-neutral-600 dark:text-neutral-400 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400 shrink-0" />
              <span>{notification}</span>
            </div>
          </div>
        )}

        {/* Results Controls Bar (visible when search has been performed and has jobs) */}
        {hasSearched && sortedJobs.length > 0 && (
          <div className="max-w-3xl mx-auto mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200">
                {sortedJobs.length} live {sortedJobs.length === 1 ? 'opening' : 'openings'} found
              </span>
              <span className="text-neutral-400 dark:text-neutral-600">•</span>
              <span className="text-[11px] font-mono text-neutral-500">TinyFish live verified</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter by portal with live counts */}
              <div className="flex items-center bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded p-0.5 text-xs shadow-xs">
                <button
                  onClick={() => setSelectedPortalFilter('all')}
                  className={`px-2 py-0.5 rounded text-[11px] transition-colors ${selectedPortalFilter === 'all' ? 'bg-neutral-900 dark:bg-neutral-800 text-white font-medium' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
                >
                  All ({portalCounts.all})
                </button>
                {[
                  { id: 'greenhouse', label: 'Greenhouse' },
                  { id: 'lever', label: 'Lever' },
                  { id: 'ashby', label: 'Ashby' },
                  { id: 'workday', label: 'Workday' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPortalFilter(p.id)}
                    className={`px-2 py-0.5 rounded text-[11px] transition-colors ${selectedPortalFilter === p.id ? 'bg-neutral-900 dark:bg-neutral-800 text-white font-medium' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
                  >
                    {p.label} ({portalCounts[p.id] || 0})
                  </button>
                ))}
              </div>

              {/* Sort Toggle */}
              <button
                onClick={() => setSortBy(sortBy === 'match' ? 'company' : 'match')}
                className="px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white text-[11px] flex items-center gap-1 transition-colors shadow-xs"
                title="Toggle sorting between Match Score and Company Name"
              >
                <ArrowUpDown className="h-3 w-3 text-neutral-400" />
                <span>{sortBy === 'match' ? 'Match Rank' : 'Company A-Z'}</span>
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-white dark:bg-[#121214] border border-neutral-200 dark:border-neutral-800 rounded p-0.5 shadow-xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-neutral-900 dark:bg-neutral-800 text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
                  title="Grid View"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1 rounded transition-colors ${viewMode === 'table' ? 'bg-neutral-900 dark:bg-neutral-800 text-white' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}
                  title="Table View"
                >
                  <Table className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Export CSV */}
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportCSV}
                disabled={sortedJobs.length === 0}
                className="h-7 text-xs text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-2.5 bg-white dark:bg-transparent shadow-xs"
              >
                <Download className="h-3 w-3 mr-1" />
                <span>Export CSV</span>
              </Button>
            </div>
          </div>
        )}

        {/* Results Content */}
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] p-4 animate-pulse shadow-xs">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="h-8 w-8 rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
                      <div className="h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                    </div>
                  </div>
                  <div className="h-8 bg-neutral-100 dark:bg-neutral-800/50 rounded mb-3" />
                  <div className="flex gap-1.5">
                    <div className="h-4 w-14 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : !hasSearched ? (
            /* Clean Empty State on Initial Page Load */
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] p-8 text-center shadow-xs">
              <div className="h-10 w-10 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-500 dark:text-neutral-400">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1.5">Ready to Search Live ATS Portals</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                Enter a role or keywords above, select Remote or enter an On-site city, then click Find Openings to scan live Greenhouse, Lever, Ashby, and Workday portals.
              </p>
            </div>
          ) : sortedJobs.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sortedJobs.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onScanAgent={handleScanAgent}
                    onViewDetail={setSelectedJobForDetail}
                  />
                ))}
              </div>
            ) : (
              <JobTable jobs={sortedJobs} />
            )
          ) : (
            <div className="rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 p-8 text-center bg-white/50 dark:bg-transparent">
              <Search className="h-6 w-6 text-neutral-400 dark:text-neutral-500 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">No openings found</h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto mb-3">
                Try widening your search terms, changing keywords, or selecting additional portals.
              </p>
              <Button onClick={handleSearch} size="sm" variant="secondary" className="h-7 text-xs">
                <RefreshCw className="h-3 w-3 mr-1" />
                <span>Retry Search</span>
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AgentResultModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        result={agentResult}
        loading={agentLoading}
        jobTitle={agentJobTitle}
      />
      <JobDetailModal
        isOpen={Boolean(selectedJobForDetail)}
        onClose={() => setSelectedJobForDetail(null)}
        job={selectedJobForDetail}
      />
    </div>
  )
}
export default App
