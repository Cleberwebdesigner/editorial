import { cn } from "@/lib/utils"

interface BadgeProps {
    children: React.ReactNode
    variant?: 'idea' | 'script' | 'production' | 'scheduled' | 'published'
    className?: string
}

export function StatusBadge({ children, variant = 'idea', className }: BadgeProps) {
    const styles = {
        idea: 'bg-neutral/10 text-neutral border-neutral/20',
        script: 'bg-warning/10 text-warning border-warning/20',
        production: 'bg-alert/10 text-alert border-alert/20',
        scheduled: 'bg-primary/10 text-primary border-primary/20',
        published: 'bg-success/10 text-success border-success/20',
    }

    return (
        <span className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider",
            styles[variant],
            className
        )}>
            {children}
        </span>
    )
}

interface CategoryChipProps {
    category: string
    className?: string
}

export function CategoryChip({ category, className }: CategoryChipProps) {
    const styles: Record<string, string> = {
        Educational: 'bg-primary/13 text-primary',
        Promotional: 'bg-warning/13 text-warning',
        Engagement: 'bg-info/13 text-info',
        Institutional: 'bg-creative/13 text-creative',
        BTS: 'bg-alert/13 text-alert',
    }

    return (
        <span className={cn(
            "px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors",
            styles[category] || 'bg-neutral/13 text-neutral',
            className
        )}>
            {category}
        </span>
    )
}
