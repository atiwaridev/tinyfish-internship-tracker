import React from "react"
import { cn } from "../../lib/utils"

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-800 bg-[#111114] text-neutral-100 shadow-sm transition-all duration-200",
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 p-5 pb-3", className)} {...props} />
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("font-semibold leading-none tracking-tight text-white", className)} {...props} />
}

export function CardDescription({ className, ...props }) {
  return <p className={cn("text-xs text-neutral-400 leading-relaxed", className)} {...props} />
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-5 pt-0", className)} {...props} />
}

export function CardFooter({ className, ...props }) {
  return <div className={cn("flex items-center p-5 pt-0 border-t border-neutral-800/60 mt-4", className)} {...props} />
}
