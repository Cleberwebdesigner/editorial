---
trigger: always_on
---

Aqui está um guia completo de **Estilo Semântico** para sua plataforma ContentFlow:

---

## 🎨 Guia de Estilo Semântico — ContentFlow

---

### 1. IDENTIDADE E PROPÓSITO

**Plataforma:** Ferramenta profissional de gestão de conteúdo para Instagram
**Tom de voz:** Direto, moderno, estratégico — fala com criadores e gestores de marca
**Personalidade:** Eficiente como uma agência, intuitivo como um app mobile

---

### 2. PALETA SEMÂNTICA

Cada cor carrega um significado funcional, não apenas estético:

| Token | Hex | Significado Semântico |
|---|---|---|
| `--color-primary` | `#4F8EF7` | Ação, navegação, foco |
| `--color-success` | `#22C55E` | Publicado, concluído, aprovado |
| `--color-warning` | `#F7C948` | Em produção, atenção, rascunho |
| `--color-alert` | `#F97316` | Agendado, prazo próximo |
| `--color-info` | `#4ECDC4` | Engajamento, comentários, interação |
| `--color-creative` | `#A78BFA` | Institucional, branding, identidade |
| `--color-danger` | `#EF4444` | Excluir, erro, cancelar |
| `--color-neutral` | `#6B7280` | Ideia, inativo, desabilitado |

---

### 3. STATUS SEMÂNTICO DE POSTS

Cada status tem cor, ícone e significado próprio:

```
💡 Ideia        → cinza    #6B7280  — capturado, ainda sem forma
✍️ Roteiro      → amarelo  #F7C948  — texto pronto, falta produção
🎬 Produção     → laranja  #F97316  — em criação ativa
📅 Agendado     → azul     #4F8EF7  — pronto, aguardando publicação
✅ Publicado    → verde    #22C55E  — no ar, coletando dados
```

---

### 4. CATEGORIAS EDITORIAIS SEMÂNTICAS

```
📚 Educativo     → azul    #4F8EF7  — ensina, gera autoridade
🛍️ Promocional  → amarelo  #F7C948  — vende, gera receita
💬 Engajamento  → teal     #4ECDC4  — conecta, gera comunidade
🏢 Institucional → roxo    #A78BFA  — posiciona, gera confiança
🎥 Bastidores   → laranja  #F97316  — humaniza, gera proximidade
```

---

### 5. TIPOGRAFIA SEMÂNTICA

| Elemento | Fonte | Peso | Tamanho | Uso |
|---|---|---|---|---|
| Títulos de seção | Space Grotesk | 700 | 22px | Hierarquia principal |
| Labels de categoria | DM Sans | 600 | 12px | Identificação rápida |
| Corpo de texto | DM Sans | 400 | 14px | Leitura contínua |
| Metadados | DM Sans | 400 | 13px | Data, formato, status |
| Números de destaque | Space Grotesk | 700 | 32px | Métricas e KPIs |
| Placeholders | DM Sans | 300 | 14px | Campos vazios |

---

### 6. ESPAÇAMENTO SEMÂNTICO

```
--space-xs:  4px   → separação interna de chips e badges
--space-sm:  8px   → gap entre elementos relacionados
--space-md:  16px  → padding padrão de cards
--space-lg:  24px  → separação entre seções
--space-xl:  40px  → respiro entre módulos principais
```

---

### 7. COMPONENTES E SEUS SIGNIFICADOS

**Badge de status** → sempre arredondado (pill), nunca quadrado — transmite leveza
**Card de post** → borda sutil visível só no hover — convida à ação sem poluir
**Chip de categoria** → fundo colorido com 13% opacidade + texto na cor cheia — identifica sem gritar
**Botão primário** → gradiente azul→roxo — único elemento com gradiente, reservado para ação principal
**Ícone de upload** → pontilhado — linguagem universal de "soltar aqui"

---

### 8. HIERARQUIA DE INFORMAÇÃO NO CARD DE POST

```
1. Imagem thumbnail    → impacto visual imediato
2. Título do post      → o quê
3. Categoria + Status  → classificação rápida
4. Data + Formato      → quando e onde
5. Legenda/caption     → detalhes opcionais
6. Métricas (se publicado) → resultado
```

---

### 9. PROMPT PARA COLAR NO ANTIGRAVITY

Se quiser gerar o design system completo automaticamente:

```
Using the semantic style guide below, generate a complete 
design-tokens.css file and a Storybook with all UI components 
for the ContentFlow platform:

Colors: primary #4F8EF7, success #22C55E, warning #F7C948, 
alert #F97316, info #4ECDC4, creative #A78BFA, danger #EF4444
Background: #0A0A0F, surface #111118, border #1E1E2E
Fonts: Space Grotesk (headings), DM Sans (body)
All components must follow dark theme by default.
Include: Badge, StatusChip, CategoryChip, PostCard, 
CalendarCell, StatCard, UploadArea, Modal, Button variants.
```

---

Esse guia garante **consistência visual e comunicacional** em toda a plataforma. Quer que eu expanda alguma seção específica ou gere o arquivo `design-tokens.css` já pronto?