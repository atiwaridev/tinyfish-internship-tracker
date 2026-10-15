import React from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Search, MapPin, Briefcase, Sliders, ArrowRight } from 'lucide-react'

export function SearchHero({
  role,
  setRole,
  workMode,
  setWorkMode,
  city,
  setCity,
  seniority,
  setSeniority,
  keywords,
  setKeywords,
  portals,
  setPortals,
  onSearch,
  loading,
  autoAgentVerify,
  setAutoAgentVerify,
  lastSyncedTime
}) {
  const allPortals = [
    { id: 'greenhouse.io', label: 'Greenhouse' },
    { id: 'lever.co', label: 'Lever' },
    { id: 'ashbyhq.com', label: 'Ashby' },
    { id: 'myworkdayjobs.com', label: 'Workday' }
  ]

  const togglePortal = (portalId) => {
    if (portals.includes(portalId)) {
      if (portals.length > 1) {
        setPortals(portals.filter(p => p !== portalId))
      }
    } else {
      setPortals([...portals, portalId])
    }
  }

  const presets = [
    { label: "Software Engineer Intern", role: "Software Engineer Intern", workMode: "remote", city: "", sen: "Internship", kw: "Python, React" },
    { label: "AI / ML Intern", role: "AI Engineer Intern", workMode: "remote", city: "", sen: "Internship", kw: "Python, PyTorch" },
    { label: "Frontend Intern", role: "Frontend Engineer Intern", workMode: "remote", city: "", sen: "Internship", kw: "React, TypeScript" },
    { label: "On-site SF Developer", role: "Software Engineer", workMode: "onsite", city: "San Francisco", sen: "Internship", kw: "Python" }
  ]

  const applyPreset = (preset) => {
    setRole(preset.role)
    setWorkMode(preset.workMode || 'remote')
    setCity(preset.city || '')
    setSeniority(preset.sen)
    setKeywords(preset.kw)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className="py-10 md:py-14 max-w-3xl mx-auto px-4 text-center">
      {/* Quiet Subhead */}
      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/60 text-neutral-600 dark:text-neutral-400 text-xs font-mono mb-4 shadow-xs">
        <span>TinyFish x TechnoJam</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white mb-3">
        TinyFish Career Scout
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
        Discover and match verified live openings across company career portals using
        TinyFish Search, Fetch, and Agent.
      </p>

      {/* Main Command Input Box (Claude / ChatGPT Aesthetic) */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121214] p-3 sm:p-4 text-left shadow-sm dark:shadow-lg">
        {/* Top search input */}
        <div className="relative flex items-center mb-3">
          <Search className="absolute left-3 h-4 w-4 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search role, e.g. Software Engineer, Machine Learning Intern..."
            className="w-full bg-transparent pl-9 pr-4 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none font-medium"
          />
        </div>

        {/* Filter inputs row */}
        <div className={`grid grid-cols-1 ${workMode === 'onsite' ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-2 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80`}>
          {/* Work Mode Toggle (Remote vs On-site) */}
          <div>
            <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-mono mb-1">WORK MODE</span>
            <div className="grid grid-cols-2 p-0.5 bg-neutral-100 dark:bg-[#161619] border border-neutral-200 dark:border-neutral-800 rounded-md">
              <button
                type="button"
                onClick={() => setWorkMode('remote')}
                className={`py-1 text-xs font-medium rounded transition-colors ${
                  workMode === 'remote'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-medium'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                Remote
              </button>
              <button
                type="button"
                onClick={() => setWorkMode('onsite')}
                className={`py-1 text-xs font-medium rounded transition-colors ${
                  workMode === 'onsite'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-medium'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                On-site
              </button>
            </div>
          </div>

          {/* Conditional City Input when On-site is chosen */}
          {workMode === 'onsite' && (
            <div>
              <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-mono mb-1">CITY NAME</span>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. San Francisco, Bengaluru"
                className="w-full bg-neutral-50 dark:bg-[#161619] border border-neutral-200 dark:border-neutral-800 rounded-md px-2.5 py-1.5 text-xs text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-700"
              />
            </div>
          )}

          <div>
            <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-mono mb-1">SENIORITY</span>
            <select
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-[#161619] border border-neutral-200 dark:border-neutral-800 rounded-md px-2.5 py-1.5 text-xs text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-700"
            >
              <option value="">Any Seniority</option>
              <option value="Internship">Internship</option>
              <option value="Entry-Level">Entry-Level</option>
              <option value="Junior">Junior</option>
              <option value="Mid-Level">Mid-Level</option>
            </select>
          </div>

          <div>
            <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-mono mb-1">KEYWORDS</span>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Python, React"
              className="w-full bg-neutral-50 dark:bg-[#161619] border border-neutral-200 dark:border-neutral-800 rounded-md px-2.5 py-1.5 text-xs text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-700"
            />
          </div>
        </div>

        {/* Portals and Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-3 border-t border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-neutral-500 font-mono mr-1">PORTALS:</span>
            {allPortals.map(p => {
              const isActive = portals.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePortal(p.id)}
                  className={`text-xs px-2.5 py-0.5 rounded border transition-colors ${
                    isActive
                      ? 'bg-neutral-900 dark:bg-neutral-800 text-white dark:text-neutral-200 border-neutral-900 dark:border-neutral-700 font-medium'
                      : 'bg-transparent text-neutral-500 border-neutral-200 dark:border-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-300'
                  }`}
                >
                  {p.label}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white select-none">
              <input
                type="checkbox"
                checked={autoAgentVerify}
                onChange={(e) => setAutoAgentVerify && setAutoAgentVerify(e.target.checked)}
                className="h-3.5 w-3.5 rounded bg-neutral-100 dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 accent-neutral-900 dark:accent-white"
              />
              <span className="hidden sm:inline">Auto-verify top with Agent</span>
            </label>

            <Button
              onClick={onSearch}
              disabled={loading}
              size="sm"
              className="bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 px-4 h-8 text-xs font-medium shrink-0 shadow-xs"
            >
              {loading ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin" />
                  <span>Searching...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <span>Find Openings</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Freshness & Preset pills */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-500">
        {lastSyncedTime && (
          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-600 dark:text-neutral-400 px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span>Synced: {lastSyncedTime}</span>
          </div>
        )}
        <span className="text-[11px] font-mono mr-1">SUGGESTIONS:</span>
        {presets.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPreset(p)}
            className="px-2.5 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-800/80 bg-neutral-100 dark:bg-neutral-900/40 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors text-[11px]"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}
