import * as React from "react"
import { cn } from "@/shared/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg"
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", isLoading, children, ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] overflow-hidden relative",
                    {
                        "bg-primary text-primary-foreground hover:bg-primary/95 shadow-sm hover:shadow-glow hover:-translate-y-[1px] active:translate-y-0 border border-primary/10": variant === "primary",
                        "bg-secondary text-secondary-foreground border border-border hover:bg-muted/80 shadow-xs hover:-translate-y-[1px] active:translate-y-0": variant === "secondary",
                        "hover:bg-secondary/80 text-foreground border border-transparent hover:border-border": variant === "ghost",
                        "text-primary underline-offset-4 hover:underline": variant === "link",
                        "h-10 px-4 py-2 text-sm": size === "default",
                        "h-9 px-3 text-xs": size === "sm",
                        "h-12 px-8 text-base": size === "lg",
                    },
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
