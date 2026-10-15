import React from 'react'
import { Compass, Sun, Moon, ExternalLink } from 'lucide-react'

export function Header({ theme = 'light', toggleTheme }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md transition-colors duration-150">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Left: Minimal Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-7 w-7 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-700 dark:text-neutral-300 shadow-xs">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-semibold text-neutral-900 dark:text-white tracking-tight text-sm">
            TinyFish Career Scout
          </span>
        </div>

        {/* Right: Docs Link & Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Docs Link */}
          <a
            href="https://docs.tinyfish.ai"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white font-mono transition-colors"
          >
            <span>docs</span>
            <ExternalLink className="h-3 w-3" />
          </a>

          {/* Vertical Divider */}
          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />

          {/* Theme Toggle Button (Default light, switch to dark) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="h-8 w-8 rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-100/80 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center transition-colors shadow-xs"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-neutral-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
