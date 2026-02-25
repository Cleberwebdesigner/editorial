"use client"

import { useState, useEffect } from "react"
import { List, Search, Filter, MoreHorizontal, MessageCircle, Heart, Share2 } from "lucide-react"
import { StatusBadge, CategoryChip } from "@/components/ui/Badges"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

import { supabase, Post as PostType } from "@/lib/supabase"

export default function ListPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [posts, setPosts] = useState<PostType[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPosts()
    }, [])

    async function fetchPosts() {
        setLoading(true)
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('post_date', { ascending: false })

        if (!error && data) {
            setPosts(data)
        }
        setLoading(false)
    }

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.caption?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-display font-bold">Feed de Conteúdos</h2>
                    <p className="text-neutral text-sm">Gerencie todos os seus posts em formato de lista.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar posts..."
                            className="bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" className="gap-2" onClick={fetchPosts}>
                        <Filter size={16} />
                        Filtros
                    </Button>
                </div>
            </header>

            <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                    </div>
                )}

                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-border">
                            <th className="px-6 py-4 text-[10px] font-bold text-neutral uppercase tracking-widest">Post</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-neutral uppercase tracking-widest">Categoria</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-neutral uppercase tracking-widest">Formato</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-neutral uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-neutral uppercase tracking-widest">Data</th>
                            <th className="px-6 py-4 text-[10px] font-bold text-neutral uppercase tracking-widest text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredPosts.length === 0 && !loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-10 text-center text-neutral text-sm">Nenhum post encontrado.</td>
                            </tr>
                        ) : (
                            filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-white group-hover:text-primary transition-colors">{post.title}</span>
                                            <div className="flex items-center gap-3 mt-1 text-[10px] text-neutral">
                                                <span className="flex items-center gap-1"><Heart size={10} /> {post.metrics_likes}</span>
                                                <span className="flex items-center gap-1"><MessageCircle size={10} /> {post.metrics_comments}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <CategoryChip category={post.category} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-neutral font-medium">{post.format}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge variant={post.status.toLowerCase() as any}>{post.status}</StatusBadge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs text-neutral">
                                            {new Date(post.post_date).toLocaleDateString('pt-BR')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-white/5 rounded-lg text-neutral hover:text-white transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
