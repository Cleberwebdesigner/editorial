"use client"

import { useEffect, useState } from "react"
import { ptBR } from "date-fns/locale"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Star } from "lucide-react"
import { supabase, CommemorativeDate } from "@/lib/supabase"

export function CommemorativeSidebar() {
    const [dates, setDates] = useState<CommemorativeDate[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDates()
    }, [])

    async function fetchDates() {
        setLoading(true)
        const { data, error } = await supabase
            .from('commemorative_dates')
            .select('*')
            .order('date', { ascending: true })

        if (data) setDates(data)
        setLoading(false)
    }

    return (
        <div className="w-72 bg-surface border-l border-border h-screen sticky top-0 p-6 overflow-y-auto relative">
            {loading && (
                <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                </div>
            )}
            <div className="flex items-center gap-2 mb-8">
                <CalendarIcon size={18} className="text-primary" />
                <h4 className="text-sm font-bold font-display uppercase tracking-widest px-2">Datas Relevantes</h4>
            </div>

            <div className="space-y-4">
                {dates.length === 0 && !loading ? (
                    <p className="text-xs text-neutral text-center py-10 italic">Nenhuma data cadastrada.</p>
                ) : (
                    dates.map((date, idx) => (
                        <div key={idx} className="group p-4 bg-background border border-border rounded-2xl hover:border-primary/30 transition-all cursor-default shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold text-neutral uppercase">
                                    {format(new Date(date.date), "dd 'de' MMMM", { locale: ptBR })}
                                </span>
                                {date.relevance === 'High' && <Star size={12} className="text-warning fill-warning" />}
                            </div>
                            <h5 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{date.title}</h5>
                            <div className="mt-3 flex gap-1">
                                {date.relevance === 'High' ? (
                                    <span className="px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[8px] font-bold uppercase tracking-wider">Altíssima Relevância</span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-neutral text-[8px] font-bold uppercase tracking-wider">Data Sazonal</span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-10 p-4 bg-gradient-to-br from-[#4F8EF7]/10 to-[#A78BFA]/10 border border-primary/20 rounded-2xl">
                <p className="text-xs font-bold text-primary mb-2 italic">Dica ContentFlow 💡</p>
                <p className="text-[11px] text-neutral leading-relaxed">
                    O <b>Dia do Consumidor</b> é uma excelente oportunidade para campanhas de <b>Vendas Diretas</b>.
                    Planeje seus Stories com 3 dias de antecedência.
                </p>
            </div>
        </div>
    )
}
