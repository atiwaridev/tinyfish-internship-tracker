import React from "react"
import { cn } from "../../lib/utils"

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}) {
  const variants = {
    default: "bg-neutral-800 text-neutral-200 border-neutral-700/60",
    secondary: "bg-neutral-900 text-neutral-400 border-neutral-800",
    outline: "text-neutral-400 border-neutral-700/50 bg-transparent",
    orange: "bg-amber-950/60 text-amber-400 border-amber-800/60",
    success: "bg-emerald-950/60 text-emerald-400 border-emerald-800/60",
    cyan: "bg-cyan-950/60 text-cyan-400 border-cyan-800/60",
    purple: "bg-purple-950/60 text-purple-400 border-purple-800/60",
    claude: "bg-[#291b10] text-[#f97316] border-[#7c2d12]/70",
    vercel: "bg-neutral-900 text-white border-neutral-700 font-mono"
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
