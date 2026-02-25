"use client"

import { useEffect, useState } from "react"
import { supabase, Post } from '@/lib/supabase'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { Users, MessageCircle, Share2, Bookmark, Flame, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AnalyticsPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        setLoading(true)
        const { data, error } = await supabase.from('posts').select('*')
        if (data) setPosts(data)
        setLoading(false)
    }

    // Cálculos Reais
    const totalLikes = posts.reduce((acc, p) => acc + (p.metrics_likes || 0), 0)
    const totalComments = posts.reduce((acc, p) => acc + (p.metrics_comments || 0), 0)
    const totalShares = posts.reduce((acc, p) => acc + (p.metrics_shares || 0), 0)
    const totalSaves = posts.reduce((acc, p) => acc + (p.metrics_saves || 0), 0)
    const totalInteractions = totalLikes + totalComments + totalShares + totalSaves

    const engagementData = [
        { name: 'Curtidas', value: totalLikes || 1, color: '#4F8EF7' },
        { name: 'Comentários', value: totalComments || 1, color: '#4ECDC4' },
        { name: 'Compartilhamentos', value: totalShares || 1, color: '#F7C948' },
        { name: 'Salvos', value: totalSaves || 1, color: '#A78BFA' },
    ]

    const categories = ['Educational', 'Promotional', 'Engajamento', 'Institutional', 'BTS']
    const categoryData = categories.map(cat => ({
        name: cat === 'Educational' ? 'Educativo' : cat === 'Promotional' ? 'Promocional' : cat,
        posts: posts.filter(p => p.category === cat).length
    }))

    return (
        <div className="space-y-8 pb-10 relative">
            {loading && (
                <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                </div>
            )}

            <header>
                <h2 className="text-2xl font-display font-bold">Performance & Analytics</h2>
                <p className="text-neutral text-sm">Acompanhe os resultados orgânicos do seu perfil.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Alcance Estimado', value: (totalInteractions * 3.5).toFixed(0), change: '+12%', icon: Target, color: 'text-primary' },
                    { label: 'Total Interações', value: totalInteractions, change: '+5%', icon: MessageCircle, color: 'text-info' },
                    { label: 'Total Posts', value: posts.length, change: '+2', icon: Flame, color: 'text-warning' },
                    { label: 'Seguidores', value: '15.9k', change: '+240', icon: Users, color: 'text-creative' },
                ].map((stat, i) => (
                    <div key={i} className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className={cn("p-2 bg-white/5 rounded-lg", stat.color)}>
                                <stat.icon size={20} />
                            </div>
                            <span className={cn("text-[10px] font-bold px-2 py-1 rounded-full bg-white/5",
                                String(stat.change).startsWith('+') ? "text-success" : "text-danger"
                            )}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-neutral text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-3xl font-display font-bold mt-1">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Donut Chart Engajamento */}
                <div className="lg:col-span-1 bg-surface border border-border p-6 rounded-3xl flex flex-col">
                    <h4 className="text-sm font-bold font-display mb-6">Distribuição de Engajamento</h4>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={engagementData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {engagementData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111118', border: '1px solid #1E1E2E', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 space-y-3">
                        {engagementData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-xs text-neutral">{item.name}</span>
                                </div>
                                <span className="text-xs font-bold text-white">
                                    {totalInteractions > 0 ? ((item.value / totalInteractions) * 100).toFixed(0) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bar Chart Categorias */}
                <div className="lg:col-span-2 bg-surface border border-border p-6 rounded-3xl">
                    <h4 className="text-sm font-bold font-display mb-6">Posts por Categoria</h4>
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 11 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 11 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#111118', border: '1px solid #1E1E2E', borderRadius: '12px' }}
                                />
                                <Bar
                                    dataKey="posts"
                                    fill="#4F8EF7"
                                    radius={[6, 6, 0, 0]}
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
