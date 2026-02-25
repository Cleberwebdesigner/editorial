"use client"

export const dynamic = 'force-dynamic'

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Github, Mail, Lock, User, ArrowRight } from "lucide-react"

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const router = useRouter()

    async function handleAuth(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })
                if (error) throw error
                router.push('/calendar')
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName
                        }
                    }
                })
                if (error) throw error
                alert("Cadastro realizado! Verifique seu e-mail para confirmar a conta.")
                setIsLogin(true)
            }
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Decorativo */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-creative/20 blur-[120px] rounded-full" />

            <div className="w-full max-w-[450px] relative z-10">
                <div className="bg-surface/50 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-creative flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                            <span className="text-white font-bold text-2xl">C</span>
                        </div>
                        <h1 className="text-3xl font-display font-bold tracking-tight mb-2">
                            {isLogin ? "Bem-vindo de volta" : "Crie sua agência"}
                        </h1>
                        <p className="text-neutral text-sm">
                            {isLogin
                                ? "Entre para gerenciar seu conteúdo editorial."
                                : "Comece a organizar seu fluxo de trabalho hoje."}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        {!isLogin && (
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-neutral uppercase tracking-widest ml-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Seu nome ou da agência"
                                        className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-neutral uppercase tracking-widest ml-1">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral" size={18} />
                                <input
                                    type="email"
                                    placeholder="exemplo@agencia.com"
                                    className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-neutral uppercase tracking-widest ml-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all font-sans"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            className="w-full py-7 rounded-2xl text-base font-bold gap-2 mt-4 shadow-xl shadow-primary/20"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    {isLogin ? "Entrar" : "Criar Conta"}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-white/5">
                        <p className="text-neutral text-sm">
                            {isLogin ? "Não tem uma conta?" : "Já possui conta?"}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-primary font-bold ml-1 hover:underline underline-offset-4"
                            >
                                {isLogin ? "Cadastre-se grátis" : "Fazer login"}
                            </button>
                        </p>
                    </div>
                </div>

                <p className="text-center mt-8 text-neutral/40 text-[10px] uppercase tracking-widest font-bold">
                    © 2026 ContentFlow • Agência Premium
                </p>
            </div>
        </div>
    )
}
