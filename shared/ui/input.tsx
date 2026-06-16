import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    rightItem?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, rightItem, id, ...props }, ref) => {
        const inputId = id || React.useId();

        return (
            <div className="space-y-1.5 w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="font-display text-xs font-medium tracking-wide text-muted-foreground uppercase leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        id={inputId}
                        type={type}
                        className={cn(
                            "flex h-11 w-full rounded-md border border-border bg-secondary px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:shadow-glow",
                            error && "border-destructive ring-destructive bg-destructive/5 text-destructive placeholder:text-destructive/50",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightItem && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center">
                            {rightItem}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-xs text-destructive font-medium animate-in slide-in-from-top-1 fade-in">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
