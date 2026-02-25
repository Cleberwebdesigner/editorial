import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
    return new Date(date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

export function getStatusColor(status: string) {
    switch (status) {
        case 'Idea': return 'text-neutral border-neutral'
        case 'Script': return 'text-warning border-warning'
        case 'Production': return 'text-alert border-alert'
        case 'Scheduled': return 'text-primary border-primary'
        case 'Published': return 'text-success border-success'
        default: return 'text-neutral border-neutral'
    }
}

export function getCategoryColor(category: string) {
    switch (category) {
        case 'Educational': return 'text-primary'
        case 'Promotional': return 'text-warning'
        case 'Engagement': return 'text-info'
        case 'Institutional': return 'text-creative'
        case 'BTS': return 'text-alert'
        default: return 'text-neutral'
    }
}
