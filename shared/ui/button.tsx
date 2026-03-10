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
                    "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
                    {
                        "bg-blue-700 text-white hover:bg-blue-800 shadow-md hover:shadow-lg": variant === "primary",
                        "bg-gray-100 text-gray-900 hover:bg-gray-200": variant === "secondary",
                        "hover:bg-gray-100 text-gray-700": variant === "ghost",
                        "text-primary underline-offset-4 hover:underline": variant === "link",
                        "h-10 px-4 py-2": size === "default",
                        "h-9 px-3 text-sm": size === "sm",
                        "h-12 px-8 text-base": size === "lg",
                    },
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : null}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
