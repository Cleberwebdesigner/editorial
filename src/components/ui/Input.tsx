import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
}

export function Input({ label, className, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-xs font-semibold text-neutral ml-1">{label}</label>}
            <input
                className={cn(
                    "bg-surface border border-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-neutral/50",
                    className
                )}
                {...props}
            />
        </div>
    )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
}

export function TextArea({ label, className, ...props }: TextAreaProps) {
    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-xs font-semibold text-neutral ml-1">{label}</label>}
            <textarea
                className={cn(
                    "bg-surface border border-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-neutral/50 min-h-[100px] resize-none",
                    className
                )}
                {...props}
            />
        </div>
    )
}
