import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'btn-primary',
            secondary: 'bg-surface border border-border text-white hover:bg-white/5',
            ghost: 'bg-transparent text-white hover:bg-white/5',
            danger: 'bg-danger text-white hover:opacity-90',
        }

        const sizes = {
            sm: 'px-3 py-1 text-xs',
            md: 'px-6 py-2 text-sm',
            lg: 'px-8 py-3 text-base',
        }

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
