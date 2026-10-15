import React from "react"
import { cn } from "../../lib/utils"

export const Button = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  children,
  disabled,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]"

  const variants = {
    default: "bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 shadow-sm",
    secondary: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border border-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 dark:border-neutral-700/60",
    outline: "border border-neutral-200 bg-transparent hover:bg-neutral-100 text-neutral-800 dark:border-neutral-800 dark:hover:bg-neutral-800/80 dark:text-neutral-200",
    ghost: "hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 dark:hover:bg-neutral-800/70 dark:text-neutral-300 dark:hover:text-white",
    claude: "bg-[#d97706] hover:bg-[#b45309] text-white shadow-glow-orange font-semibold",
    vercel: "bg-gradient-to-r from-neutral-900 to-neutral-800 text-white border border-neutral-700 hover:border-neutral-500 shadow-sm",
    destructive: "bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 border border-red-500/30"
  }

  const sizes = {
    sm: "h-8 px-3 text-xs",
    default: "h-9 px-4 py-2",
    lg: "h-11 px-6 text-base",
    icon: "h-9 w-9"
  }

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  )
})
Button.displayName = "Button"
