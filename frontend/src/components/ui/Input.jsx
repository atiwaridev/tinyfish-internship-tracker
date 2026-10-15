import React from "react"
import { cn } from "../../lib/utils"

export const Input = React.forwardRef(({
  className,
  type = "text",
  ...props
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-neutral-800 bg-[#121215] px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500",
        "focus-visible:outline-none focus-visible:border-neutral-600 focus-visible:ring-1 focus-visible:ring-neutral-500",
        "disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      {...props}
    />
  )
})
Input.displayName = "Input"
