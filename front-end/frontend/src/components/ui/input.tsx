import * as React from "react"

import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightIcon, error, ...props }, ref) => {
    if (icon || rightIcon) {
      return (
        <div className="relative w-full">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
              {icon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            data-slot="input"
            className={cn(
              "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
              icon ? "pl-12" : "pl-2.5",
              rightIcon ? "pr-12" : "pr-2.5",
              error && "border-destructive ring-3 ring-destructive/20 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
      )
    }
    
    return (
      <input
        type={type}
        ref={ref}
        data-slot="input"
        className={cn(
          "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
          error && "border-destructive ring-3 ring-destructive/20 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
