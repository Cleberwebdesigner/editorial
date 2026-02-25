import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/settings'

    if (code) {
        const cookieStore = {
            get(name: string) {
                return undefined
            },
            set(name: string, value: string, options: CookieOptions) {
                // Mock set
            },
            remove(name: string, options: CookieOptions) {
                // Mock remove
            },
        }

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: cookieStore,
            }
        )

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data.session) {
            const provider_token = data.session.provider_token
            const profile_id = data.session.user.id

            if (provider_token) {
                try {
                    // 1. Buscar Páginas do Facebook vinculadas ao usuário
                    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${provider_token}`)
                    const pagesData = await pagesRes.json()

                    if (pagesData.data && pagesData.data.length > 0) {
                        for (const page of pagesData.data) {
                            // 2. Buscar Conta Comercial do Instagram vinculada à página do FB
                            const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${provider_token}`)
                            const igData = await igRes.json()

                            if (igData.instagram_business_account) {
                                const ig_business_id = igData.instagram_business_account.id

                                // 3. Buscar detalhes da conta do Instagram (username, foto, nome)
                                const detailsRes = await fetch(`https://graph.facebook.com/v19.0/${ig_business_id}?fields=username,name,profile_picture_url&access_token=${provider_token}`)
                                const details = await detailsRes.json()

                                // 4. Salvar ou Atualizar no Supabase
                                await supabase.from('instagram_accounts').upsert({
                                    profile_id,
                                    ig_business_id,
                                    username: details.username,
                                    full_name: details.name,
                                    profile_picture_url: details.profile_picture_url,
                                    access_token: provider_token, // Para produção, trocar por Long-Lived Token
                                    updated_at: new Date().toISOString()
                                }, { onConflict: 'ig_business_id' })
                            }
                        }
                    }
                } catch (err) {
                    console.error('Erro ao vincular conta do Instagram:', err)
                }
            }

            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Retorna o usuário para uma página de erro se algo der errado
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
