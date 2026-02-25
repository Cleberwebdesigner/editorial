"use client"

import { X, Sparkles, Instagram, Send, Hash, Type, Image as ImageIcon, Video, Layers, ChevronRight, Monitor, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Input, TextArea } from "@/components/ui/Input"
import { ImageUpload } from "./ImageUpload"
import * as React from "react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { cn } from "@/lib/utils"
import { generateCaption } from "@/lib/gemini"

interface PostModalProps {
    isOpen: boolean
    onClose: () => void
    initialDate?: Date
    post?: any // Adicionado para carregar dados de um post existente
}

type Channel = 'instagram' | 'threads' | 'facebook'

export function PostModal({ isOpen, onClose, initialDate, post }: PostModalProps) {
    const [loading, setLoading] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [activeChannel, setActiveChannel] = useState<Channel>('instagram')
    const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile')

    const [formData, setFormData] = useState({
        title: '',
        category: 'Educational',
        format: 'Feed',
        status: 'Idea',
        caption: '',
        post_date: '',
        post_time: '12:00'
    })

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    // Efeito para carregar dados do post ou inicializar novo
    useEffect(() => {
        if (post) {
            const dateObj = new Date(post.post_date)
            setFormData({
                title: post.title || '',
                category: post.category || 'Educational',
                format: post.format || 'Feed',
                status: post.status || 'Idea',
                caption: post.caption || '',
                post_date: dateObj.toISOString().split('T')[0],
                post_time: dateObj.toTimeString().split(' ')[0].slice(0, 5)
            })
            setPreviewUrl(post.thumbnail_url || null)
        } else {
            setFormData({
                title: '',
                category: 'Educational',
                format: 'Feed',
                status: 'Idea',
                caption: '',
                post_date: initialDate ? initialDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                post_time: '12:00'
            })
            setPreviewUrl(null)
        }
        setImageFile(null)
    }, [post, initialDate, isOpen])

    useEffect(() => {
        if (imageFile) {
            const url = URL.createObjectURL(imageFile)
            setPreviewUrl(url)
            return () => URL.revokeObjectURL(url)
        }
    }, [imageFile])

    const handleGenerateAICaption = async () => {
        if (!formData.title) return alert("Dê um título ao post primeiro para a IA saber sobre o que escrever!")

        setGenerating(true)
        const caption = await generateCaption(formData.title, formData.category, formData.format)
        if (caption) {
            setFormData({ ...formData, caption })
        } else {
            alert("Erro ao falar com o Gemini. Verifique sua chave API.")
        }
        setGenerating(false)
    }

    const handleCreatePost = async () => {
        if (!formData.title) return alert('Por favor, insira um título.')

        setLoading(true)
        try {
            const { data: userData } = await supabase.auth.getUser()
            let profile_id = userData?.user?.id

            if (!profile_id) {
                const { data: profiles } = await supabase.from('profiles').select('id').limit(1)
                profile_id = profiles?.[0]?.id
            }

            if (!profile_id) {
                alert('Erro: Perfil não encontrado.')
                setLoading(false)
                return
            }

            let thumbnail_url = post?.thumbnail_url || ''

            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${profile_id}/${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('thumbnails')
                    .upload(filePath, imageFile)

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('thumbnails')
                    .getPublicUrl(filePath)

                thumbnail_url = publicUrl
            }

            const postData = {
                profile_id,
                title: formData.title,
                caption: formData.caption,
                category: formData.category,
                format: formData.format,
                status: formData.status,
                thumbnail_url,
                post_date: new Date(`${formData.post_date}T${formData.post_time}:00`).toISOString()
            }

            const { error } = post?.id
                ? await supabase.from('posts').update(postData).eq('id', post.id)
                : await supabase.from('posts').insert([postData])

            if (error) throw error

            alert(post?.id ? 'Post atualizado com sucesso!' : 'Post agendado com sucesso!')
            onClose()
        } catch (error: any) {
            alert(`Erro ao salvar: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-[#0D0D12] border border-white/10 w-full max-w-[1200px] h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col">

                {/* Header Estilo mLabs */}
                <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <Send size={20} className="text-primary" />
                        </div>
                        <div>
                            <h3 className="text-lg font-display font-bold text-white leading-tight">
                                {post?.id ? 'Editar Publicação' : 'Agendar Publicação'}
                            </h3>
                            <p className="text-xs text-neutral">Crie conteúdo multicanal com inteligência artificial.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} className="text-neutral" />
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">

                    {/* Coluna de Edição */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar border-r border-white/5">

                        {/* 1. Seleção de Canais */}
                        <section className="space-y-4">
                            <h4 className="text-xs font-bold text-neutral uppercase tracking-widest flex items-center gap-2">
                                <Layers size={14} /> 1. Selecionar Canais
                            </h4>
                            <div className="flex gap-3">
                                {[
                                    { id: 'instagram', icon: Instagram, color: 'from-purple-500 to-pink-500' },
                                    { id: 'threads', icon: Hash, color: 'from-gray-700 to-black' },
                                    { id: 'facebook', icon: Send, color: 'from-blue-500 to-blue-700' }
                                ].map((channel) => (
                                    <button
                                        key={channel.id}
                                        onClick={() => setActiveChannel(channel.id as Channel)}
                                        className={cn(
                                            "group relative flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300",
                                            activeChannel === channel.id
                                                ? "bg-white/10 border-white/20 ring-1 ring-white/10"
                                                : "bg-transparent border-white/5 opacity-40 hover:opacity-100"
                                        )}
                                    >
                                        <div className={cn("p-2 rounded-xl bg-gradient-to-br shadow-lg", channel.color)}>
                                            <channel.icon size={18} className="text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-white capitalize">{channel.id}</span>
                                        {activeChannel === channel.id && (
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-[#0D0D12]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* 2. Conteúdo e Mídia */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <h4 className="text-xs font-bold text-neutral uppercase tracking-widest flex items-center gap-2">
                                    <Type size={14} /> 2. Texto do Post
                                </h4>
                                <div className="space-y-4">
                                    <Input
                                        placeholder="Título interno da campanha..."
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-primary/50 text-base"
                                    />
                                    <div className="relative">
                                        <TextArea
                                            placeholder="Escreva a legenda aqui..."
                                            value={formData.caption}
                                            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                            className="bg-white/5 border-white/10 min-h-[180px] rounded-2xl p-4 text-sm leading-relaxed"
                                        />
                                        <button
                                            onClick={handleGenerateAICaption}
                                            disabled={generating}
                                            className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-xs font-bold transition-all disabled:opacity-50 group overflow-hidden"
                                        >
                                            {generating ? (
                                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary border-t-transparent" />
                                            ) : (
                                                <Sparkles size={14} className="group-hover:scale-125 transition-transform" />
                                            )}
                                            {generating ? "Pensando..." : "Criar legenda com IA"}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <h4 className="text-xs font-bold text-neutral uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon size={14} /> 3. Mídia
                                </h4>
                                <ImageUpload onImageSelect={(file) => setImageFile(file)} />
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-neutral uppercase ml-1">Formato de Publicação</label>
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary/50"
                                            value={formData.format}
                                            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                                        >
                                            <option value="Feed">Feed</option>
                                            <option value="Reels">Reels</option>
                                            <option value="Stories">Stories</option>
                                            <option value="Carousel">Carrossel</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-neutral uppercase ml-1">Data</label>
                                            <input
                                                type="date"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                                                value={formData.post_date}
                                                onChange={(e) => setFormData({ ...formData, post_date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-neutral uppercase ml-1">Hora</label>
                                            <input
                                                type="time"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary/50"
                                                value={formData.post_time}
                                                onChange={(e) => setFormData({ ...formData, post_time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Coluna de Preview */}
                    <div className="w-[450px] bg-[#12121A] flex flex-col items-center p-8 relative">
                        <div className="flex items-center gap-2 absolute top-6 right-8 p-1 bg-white/5 rounded-lg border border-white/10">
                            <button
                                onClick={() => setPreviewMode('mobile')}
                                className={cn("p-1.5 rounded-md transition-all", previewMode === 'mobile' ? "bg-primary text-white" : "text-neutral hover:text-white")}
                            >
                                <Smartphone size={16} />
                            </button>
                            <button
                                onClick={() => setPreviewMode('desktop')}
                                className={cn("p-1.5 rounded-md transition-all", previewMode === 'desktop' ? "bg-primary text-white" : "text-neutral hover:text-white")}
                            >
                                <Monitor size={16} />
                            </button>
                        </div>

                        <h4 className="text-xs font-display font-bold text-neutral uppercase tracking-[0.2em] mb-12 self-start outline-none">Preview Visual</h4>

                        {/* Mockup Celular */}
                        <div className={cn(
                            "relative border-[8px] border-[#1A1A24] bg-background shadow-2xl transition-all duration-500",
                            previewMode === 'mobile' ? "w-[280px] h-[580px] rounded-[3rem]" : "w-[400px] h-[300px] rounded-2xl"
                        )}>
                            {/* Conteúdo do Instagram Mockup */}
                            <div className="h-full w-full overflow-hidden flex flex-col">
                                <div className="p-3 border-b border-white/5 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-400 to-primary" />
                                    <span className="text-[10px] font-bold">seu_perfil</span>
                                </div>
                                <div className="flex-1 bg-[#0A0A0F] flex items-center justify-center relative">
                                    {previewUrl ? (
                                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <div className="text-center p-6">
                                            <ImageIcon size={32} className="mx-auto text-white/10 mb-2" />
                                            <p className="text-[10px] text-neutral">Faça o upload de uma imagem para ver o preview</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 space-y-2 bg-background">
                                    <div className="flex gap-3 mb-2">
                                        <div className="w-3 h-3 border border-white/20 rounded-sm" />
                                        <div className="w-3 h-3 border border-white/20 rounded-sm" />
                                        <div className="w-3 h-3 border border-white/20 rounded-sm" />
                                    </div>
                                    <p className="text-[10px] line-clamp-3 text-white/90">
                                        <span className="font-bold mr-1">seu_perfil</span>
                                        {formData.caption || "A legenda do seu post aparecerá aqui..."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto w-full pt-10">
                            <Button
                                className="w-full py-7 rounded-2xl text-lg font-display font-bold shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
                                onClick={handleCreatePost}
                                disabled={loading}
                            >
                                {loading ? "Salvando..." : post?.id ? "Salvar Alterações" : "Agendar Agora"}
                                <ChevronRight size={20} />
                            </Button>
                            <p className="text-center text-[10px] text-neutral mt-4 uppercase tracking-widest font-bold">Processado via API Oficial Meta</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
