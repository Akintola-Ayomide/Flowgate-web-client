import * as React from "react"
import { cn } from "@/shared/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, id, ...props }, ref) => {
        const checkboxId = id || React.useId();

        return (
            <div className="flex items-center space-x-2">
                <div className="relative flex items-center">
                    <input
                        id={checkboxId}
                        type="checkbox"
                        className={cn(
                            "peer h-5 w-5 shrink-0 appearance-none rounded-md border border-gray-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary transition-all cursor-pointer",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                {label && (
                    <label
                        htmlFor={checkboxId}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                    >
                        {label}
                    </label>
                )}
            </div>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
