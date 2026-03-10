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
        // Generate a safe ID if one isn't provided but a label is present
        const inputId = id || React.useId();

        return (
            <div className="space-y-2 w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-semibold text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    <input
                        id={inputId}
                        type={type}
                        className={cn(
                            "flex h-12 w-full rounded-lg border border-transparent bg-gray-50 px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                            error && "border-red-500 ring-red-500 bg-red-50",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightItem && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {rightItem}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="text-sm text-red-500 animate-in slide-in-from-top-1 fade-in">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
