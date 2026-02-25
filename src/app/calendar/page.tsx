"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus, Search, Filter } from "lucide-react"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { StatusBadge, CategoryChip } from "@/components/ui/Badges"
import { PostModal } from "@/components/posts/PostModal"

import { useEffect } from "react"
import { supabase, Post } from "@/lib/supabase"

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedPost, setSelectedPost] = useState<Post | undefined>(undefined)
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [currentDate])

    async function fetchPosts() {
        setLoading(true)
        const start = startOfWeek(startOfMonth(currentDate)).toISOString()
        const end = endOfWeek(endOfMonth(currentDate)).toISOString()

        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .gte('post_date', start)
            .lte('post_date', end)

        if (!error && data) {
            setPosts(data)
        }
        setLoading(false)
    }

    const handleOpenModal = (date?: Date, post?: Post) => {
        setSelectedDate(date)
        setSelectedPost(post)
        setIsModalOpen(true)
    }

    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-display font-bold">Calendário Editorial</h2>
                    <p className="text-neutral text-sm">Visualize e agende seus conteúdos por mês.</p>
                </div>
                <div className="flex items-center gap-3">
                    {loading && (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2" />
                    )}
                    <div className="flex bg-surface border border-border rounded-lg p-1">
                        <button
                            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                            className="p-1 hover:bg-white/5 rounded-md transition-colors"
                        >
                            <ChevronLeft size={20} className="text-neutral hover:text-white" />
                        </button>
                        <div className="px-4 flex items-center justify-center min-w-[140px]">
                            <span className="text-sm font-semibold capitalize font-display">
                                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                            </span>
                        </div>
                        <button
                            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                            className="p-1 hover:bg-white/5 rounded-md transition-colors"
                        >
                            <ChevronRight size={20} className="text-neutral hover:text-white" />
                        </button>
                    </div>
                    <Button className="gap-2" onClick={() => handleOpenModal(new Date())}>
                        <Plus size={18} />
                        Novo Post
                    </Button>
                </div>
            </header>

            {/* Grid do Calendário */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm relative">
                {loading && (
                    <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                    </div>
                )}

                <div className="grid grid-cols-7 border-b border-border bg-white/5">
                    {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                        <div key={day} className="px-4 py-3 text-center text-[10px] font-bold text-neutral uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7">
                    {calendarDays.map((day, idx) => {
                        const isToday = isSameDay(day, new Date())
                        const isCurrentMonth = isSameMonth(day, monthStart)
                        const dayPosts = posts.filter(p => isSameDay(new Date(p.post_date), day))

                        return (
                            <div
                                key={idx}
                                onClick={() => handleOpenModal(day)}
                                className={cn(
                                    "min-h-[140px] border-r border-b border-border p-2 transition-colors hover:bg-white/[0.02] flex flex-col group cursor-pointer",
                                    !isCurrentMonth && "bg-black/20"
                                )}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={cn(
                                        "text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full",
                                        isToday ? "bg-primary text-white" : isCurrentMonth ? "text-white" : "text-neutral/40"
                                    )}>
                                        {format(day, 'd')}
                                    </span>
                                    <div className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-md transition-all">
                                        <Plus size={14} className="text-neutral" />
                                    </div>
                                </div>

                                <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                                    {dayPosts.map(post => (
                                        <div
                                            key={post.id}
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(day, post); }}
                                            className="bg-background border border-border/50 rounded-lg p-2 hover:border-primary/50 transition-all shadow-sm"
                                        >
                                            <p className="text-[10px] font-medium leading-tight mb-1 truncate">{post.title}</p>
                                            <div className="flex items-center justify-between">
                                                <StatusBadge variant={post.status.toLowerCase() as any}>
                                                    {post.status === 'Idea' ? '💡' :
                                                        post.status === 'Script' ? '✍️' :
                                                            post.status === 'Production' ? '🎬' :
                                                                post.status === 'Scheduled' ? '📅' : '✅'}
                                                </StatusBadge>
                                                <span className="text-[8px] text-neutral/60 font-bold uppercase">{post.category}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <PostModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedPost(undefined)
                    fetchPosts()
                }}
                initialDate={selectedDate}
                post={selectedPost}
            />
        </div>
    )
}
