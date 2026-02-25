"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Calendar, List, PieChart, Settings, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { id: 'calendar', label: 'Calendário', icon: Calendar, href: '/calendar' },
    { id: 'list', label: 'Feed/Lista', icon: List, href: '/list' },
    { id: 'analytics', label: 'Analytics', icon: PieChart, href: '/analytics' },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 border-r border-border h-screen sticky top-0 bg-surface flex flex-col p-6">
            <Link href="/" className="flex items-center gap-3 mb-10 px-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-creative flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-white font-bold text-lg">C</span>
                </div>
                <h1 className="text-xl font-display tracking-tight">Content<span className="text-primary">Flow</span></h1>
            </Link>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-neutral hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "text-primary")} />
                            <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto space-y-2">
                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-all duration-200 group",
                        pathname === '/settings'
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-neutral hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Settings size={20} className={cn("transition-transform group-hover:rotate-45", pathname === '/settings' && "text-primary")} />
                    <span className="text-sm font-medium">Configurações</span>
                </Link>

                <button
                    onClick={async () => {
                        const { supabase } = await import("@/lib/supabase")
                        await supabase.auth.signOut()
                        window.location.href = "/login"
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-danger/60 hover:bg-danger/5 hover:text-danger transition-all group"
                >
                    <PlusCircle size={20} className="rotate-45" />
                    <span className="text-sm font-medium">Sair da Conta</span>
                </button>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 mt-4">
                    <p className="text-[10px] text-neutral uppercase font-bold tracking-widest mb-2">Plano Atual</p>
                    <p className="text-white text-sm font-semibold">Agência Premium</p>
                    <div className="h-1.5 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                        <div className="h-full w-3/4 bg-primary rounded-full" />
                    </div>
                    <p className="text-[10px] text-neutral mt-2">75% da cota mensal usada</p>
                </div>
            </div>
        </aside>
    )
}
