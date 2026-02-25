"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Settings, User, Shield, Bell, Instagram, CreditCard, PlusCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null)
    const [igAccounts, setIgAccounts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'billing' | 'security'>('profile')

    useEffect(() => {
        fetchProfile()
        fetchIgAccounts()
    }, [])

    async function fetchProfile() {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (data) setProfile(data)
        } else {
            setProfile({
                full_name: 'Usuário Demonstrativo',
                email: 'contato@exemplo.com',
                plan: 'Agência Premium'
            })
        }
    }

    async function fetchIgAccounts() {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase
                .from('instagram_accounts')
                .select('*')
                .eq('profile_id', user.id)

            if (data) setIgAccounts(data)
        }
        setLoading(false)
    }

    async function handleConnect() {
        setLoading(true)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'facebook',
                options: {
                    queryParams: {
                        auth_type: 'rerequest',
                        display: 'popup',
                    },
                    scopes: 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,instagram_manage_insights',
                    redirectTo: `${window.location.origin}/api/auth/callback`
                }
            })
            if (error) throw error
        } catch (error: any) {
            alert(`Erro ao conectar: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }


    const tabs = [
        { id: 'profile', label: 'Perfil', icon: User },
        { id: 'integrations', label: 'Integrações', icon: Instagram },
        { id: 'billing', label: 'Assinatura', icon: CreditCard },
        { id: 'security', label: 'Segurança', icon: Shield },
    ]

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h2 className="text-2xl font-display font-bold">Configurações</h2>
                <p className="text-neutral text-sm">Gerencie sua conta e preferências de integração.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Menu de Configurações */}
                <div className="space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                activeTab === tab.id
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-neutral hover:bg-white/5 hover:text-white border border-transparent"
                            )}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Conteúdo Central */}
                <div className="md:col-span-2 space-y-6">
                    {activeTab === 'profile' && (
                        <div className="bg-surface border border-border rounded-2xl p-6 space-y-6 animate-in fade-in duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-creative flex items-center justify-center text-white text-2xl font-bold">
                                    {profile?.full_name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{profile?.full_name || 'Usuário'}</h3>
                                    <p className="text-sm text-neutral">{profile?.email || 'email@exemplo.com'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 pt-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral uppercase tracking-wider ml-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        defaultValue={profile?.full_name}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral uppercase tracking-wider ml-1">E-mail</label>
                                    <input
                                        type="email"
                                        defaultValue={profile?.email}
                                        disabled
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-neutral cursor-not-allowed font-sans"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button className="px-8 shadow-lg shadow-primary/20">Salvar Alterações</Button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                            {igAccounts.length > 0 ? (
                                <div className="space-y-4">
                                    {igAccounts.map((acc) => (
                                        <div key={acc.id} className="bg-surface border border-border rounded-2xl p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {acc.profile_picture_url ? (
                                                        <img src={acc.profile_picture_url} className="w-10 h-10 rounded-full border border-white/10" alt="" />
                                                    ) : (
                                                        <Instagram className="text-creative" />
                                                    )}
                                                    <div>
                                                        <h3 className="font-bold">@{acc.username}</h3>
                                                        <p className="text-[10px] text-neutral uppercase tracking-widest">{acc.full_name}</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-success/10 text-success text-[10px] font-bold uppercase rounded-full tracking-widest">Conectado</span>
                                            </div>
                                            <p className="text-xs text-neutral leading-relaxed">
                                                Sua conta está vinculada com sucesso. O ContentFlow tem permissão para ler métricas e agendar posts.
                                            </p>
                                            <div className="pt-2">
                                                <Button
                                                    variant="secondary"
                                                    onClick={async () => {
                                                        if (confirm(`Desconectar @${acc.username}?`)) {
                                                            await supabase.from('instagram_accounts').delete().eq('id', acc.id)
                                                            fetchIgAccounts()
                                                        }
                                                    }}
                                                    className="w-full border-danger/20 text-danger hover:bg-danger/5 transition-colors"
                                                >
                                                    Desconectar conta
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="p-6 border border-dashed border-border rounded-2xl text-center space-y-2">
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-2 font-display italic text-neutral">+</div>
                                        <h4 className="text-sm font-bold text-white">Adicionar nova conta</h4>
                                        <p className="text-xs text-neutral max-w-[250px] mx-auto">Conecte outro perfil do Instagram Business para gerenciar.</p>
                                        <Button
                                            variant="secondary"
                                            onClick={handleConnect}
                                            className="mt-4 text-xs h-9"
                                        >
                                            Conectar Nova Conta
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-12 border border-dashed border-border rounded-[32px] text-center space-y-4 bg-white/[0.02]">
                                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-creative/20 flex items-center justify-center mx-auto mb-4 border border-white/5">
                                        <Instagram className="text-primary" size={32} />
                                    </div>
                                    <h4 className="text-xl font-display font-bold text-white">Conecte seu Instagram</h4>
                                    <p className="text-sm text-neutral max-w-[300px] mx-auto leading-relaxed">
                                        Publique posts, reels e stories diretamente do seu calendário editorial.
                                    </p>
                                    <Button
                                        onClick={handleConnect}
                                        disabled={loading}
                                        className="mt-6 px-10 py-6 rounded-2xl shadow-xl shadow-primary/20 gap-2"
                                    >
                                        {loading ? "Conectando..." : "Conectar Agora"}
                                        <PlusCircle size={20} />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {(activeTab === 'billing' || activeTab === 'security') && (
                        <div className="bg-surface border border-border rounded-2xl p-12 text-center space-y-4 animate-in fade-in duration-300">
                            <Settings className="mx-auto text-neutral/20" size={48} />
                            <h3 className="text-lg font-bold">Em breve</h3>
                            <p className="text-sm text-neutral max-w-sm mx-auto">
                                Estamos finalizando este módulo. Em breve você poderá gerenciar sua {activeTab === 'billing' ? 'assinatura' : 'segurança'} diretamente por aqui.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
