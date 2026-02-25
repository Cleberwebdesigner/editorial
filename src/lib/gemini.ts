import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "")

export async function generateCaption(title: string, category: string, format: string) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const prompt = `Você é um especialista em social media e marketing digital. 
    Crie uma legenda criativa e engajadora para um post do Instagram com os seguintes detalhes:
    Título: ${title}
    Categoria: ${category}
    Formato: ${format}
    
    Regras:
    - Use emojis pertinentes.
    - Use quebras de linha para facilitar a leitura.
    - Inclua 3 a 5 hashtags relevantes no final.
    - Tom de voz: Profissional, moderno e atraente.
    - Responda apenas com o texto da legenda, sem comentários adicionais.`

        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error("Erro ao gerar legenda com Gemini:", error)
        return null
    }
}
