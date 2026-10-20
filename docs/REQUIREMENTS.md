# Requisitos do Projeto - Currency Exchange App

## 1. Contexto e Objetivo
Aplicação Single Page Application (SPA) desenvolvida em React 19 com Vite, Tailwind CSS v4 e API Frankfurter (v1). O objetivo é centralizar o fluxo de conversão de moedas em tempo real, visualização de histórico via gráfico de área e tabela com filtros avançados, e exportação de dados em CSV.

**Estética:** **Glassmorphism & Cyber Fintech Pro** (Dark Mode First) — Estilo Wise/Revolut/Nubank com glassmorphism imersivo, neon emerald/cyan, grid cyber, orbs gradientes.

**Idiomas:** PT-BR (padrão), EN, ES — Seletor no header com flags 🇧🇷 🇺🇸 🇪🇸.

**Moedas Padrão:** **AUD → AUD** (ambas iniciam em Dólar Australiano para consistência visual).

---

## 2. Requisitos Funcionais (RF)

| ID   | Requisito | Descrição Detalhada |
|------|-----------|---------------------|
| RF01 | Conversão em Tempo Real | Exibição de taxa de câmbio atual (endpoint `/latest`) com data da cotação, cálculo automático: `valorConvertido = amount × exchangeRate`. Atualização reativa ao alterar moedas ou valor. Resultado em **gradient text** (emerald→cyan) com animação pulse. |
| RF02 | Seleção de Moedas | Dois `<select>` **inline no JSX** (sem wrapper function) populados via `/currencies` (código + nome + **flag FlagCDN**). Moeda base default: `AUD`, moeda destino default: `AUD`. Placeholder "Carregando..." enquanto `currencies` vazio. Validação: impede mesma moeda nas duas posições (tratado no service com retorno 1:1). |
| RF03 | Inversão de Moedas (Swap) | Botão central com animação de rotação 180° (300ms, `classList.add('rotate-180')`). Troca `baseCurrency` ↔ `targetCurrency` e dispara nova busca automática. Anel metálico neon `border-emerald-500/30`. |
| RF04 | Gráfico Histórico - 8 Períodos | Botões **pílulas cyber** (active: `bg-emerald-500/20 border-emerald-500/30 shadow-lg`): `7d`, `15d`, `30d`, `3m` (90d), `6m` (180d), `1y` (365d), `5y` (1825d), `10y` (3650d). Cálculo de `startDate`/`endDate` dinâmico. Gráfico **Recharts AreaChart neon** (`stroke="#10b981"`, `filter="url(#neonGlow)"`, gradiente emerald→cyan). Tooltip glassmorphism com **flags dinâmicas** base/target. |
| RF05 | Tabela Histórica com Filtros | Colunas: Data (DD/MM/YYYY), Par (flags + códigos), Cotação (4-6 casas, `tabular-nums`), Variação (▲/▼ + %). Filtros expansíveis: data inicial, data final, cotação mínima, cotação máxima. Ordenação clicável em Data e Cotação (asc/desc, ícones chevron). Contador de registros filtrados em tempo real. **Hover row**: `bg-emerald-500/5 border-l-4 border-emerald-500/30`. |
| RF06 | Exportação CSV | Botão "Exportar CSV" (verde emerald, `shadow-lg shadow-emerald-500/20`) gera download: `cotacao_{BASE}_{TARGET}_{YYYY-MM-DD}.csv`. Cabeçalhos: "Data", "Moeda Origem", "Moeda Destino", "Cotação". Validação: impede exportação se array filtrado vazio (alerta amigável). |
| RF07 | Internacionalização (i18n) | **3 idiomas**: PT-BR (padrão), EN, ES. **LanguageContext** com persistência `localStorage`. Seletor dropdown no header com flags 🇧🇷 🇺🇸 🇪🇸. Traduções completas (80+ chaves): header, conversor, gráfico, tabela, filtros, footer. Troca instantânea sem reload. |
| RF08 | Tema Dark Only | **Dark Mode exclusivo** (`#060913` + cyber grid + orbs). Sem toggle de tema — UI sempre escura. Cards glassmorphism slate/emerald. |

---

## 3. Requisitos Não-Funcionais (RNF)

| ID   | Requisito | Especificação Técnica |
|------|-----------|----------------------|
| RNF01 | Estética **Glassmorphism & Cyber Fintech Pro** | **Dark First**: `#060913` + cyber grid 40px + orbs gradientes (emerald/cyan). **Glassmorphism**: `bg-slate-900/50 backdrop-blur-md border-slate-700/50 shadow-xl shadow-emerald-500/5` + inner glow `from-emerald-500/5 via-transparent to-cyan-500/5`. **Neon**: `#10b981` stroke + `feGaussianBlur` Recharts. **Gradient text**: `from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent animate-pulse`. |
| RNF02 | Performance | Lazy loading Recharts, `useMemo`/`useCallback` em dados derivados, `historicalLoading` isolado do `loading` principal. Build Vite otimizado (chunk ~620kB). |
| RNF03 | Modularidade React | Custom hook `useCurrency` encapsula todo estado + effects + API calls. Componentes puros recebem props. Services puros (sem React). Utils puras. **Selects inline no JSX** (sem wrapper function) para evitar closure stale state. |
| RNF04 | Tailwind CSS v4 | `@import "tailwindcss"` no `index.css`, plugin `@tailwindcss/vite` no `vite.config.js`. `@theme` custom para emerald/cyan. `@layer components` com utilitários `.card`, `.input-base`, `.btn-primary`, etc. |
| RNF05 | Resiliência a Falhas de API | Base URL primária `api.frankfurter.dev/v1` com fallback automático para `api.frankfurter.app`. Logs estruturados no catch (`url`, `baseUrl`, `stack`, `isFallbackAttempt`). Histórico falha isolado: só `console.warn` + limpa gráfico, **não** toca em `error`/`loading` do conversor. |
| RNF06 | Tratamento de Moedas Idênticas | Service retorna mock 1:1 instantâneo se `base === symbols` (sem HTTP). Histórico gera array dia-a-dia com taxa = 1. |
| RNF07 | Responsividade | Container `max-w-5xl mx-auto`, grid fluido filtros (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), tabela `overflow-x-auto`. Mobile-first: 375px, 768px, 1024px, 1440px. |
| RNF08 | Acessibilidade (a11y) | `htmlFor`/`id` labels, `aria-label` icon-only buttons, `role="tab"/"menuitem"`, `disabled` nativo + visual, `focus:ring-2 focus:ring-emerald-500/50`, `tabular-nums`, `time` com `dateTime` ISO, contraste WCAG AA (emerald-400/slate-950 = 8.2:1, slate-100/slate-900 = 15.8:1). |

---

## 4. Arquitetura e Tecnologias

### Stack Principal

| Camada | Tecnologia | Versão | Justificativa |
|--------|------------|--------|---------------|
| **Core** | React | 19.2.8 | Concurrent features, hooks modernos, performance |
| **Build** | Vite | 8.3.0 | HMR instantâneo, build otimizado, plugin ecosystem |
| **Estilização** | **Tailwind CSS v4** | 4.x | **Design system nativo**, zero config custom, responsividade via utilitários, fidelidade total à estética **Glassmorphism & Cyber Fintech Pro** (paleta slate/emerald/cyan, tipografia mono, glassmorphism, neon). Substitui CSS Modules com manutenção drasticamente simplificada. |
| **Gráficos** | **Recharts** | 3.10.1 | **Biblioteca permitida no escopo**. Renderização SVG declarativa, `AreaChart` + `monotone` interpolation, tooltip customizado glassmorphism, neon glow filter (`feGaussianBlur`), animações nativas, lazy-loadable. |
| **Ícones** | lucide-react | 1.57.0 | Tree-shakeable, SVG inline, acessíveis, consistentes |
| **API** | Frankfurter v1 | — | Gratuita, sem auth, CORS habilitado, fallback automático |
| **Lint** | ESLint | 10.10.0 | Flat config, React hooks rules, modern JS |

### Arquitetura de Pastas

```
src/
├── components/          # UI pura (CurrencyConverter, HistoricalChart, HistoricalTable)
├── hooks/               # Lógica de estado (useCurrency)
├── services/            # Camada de API pura (currencyService)
├── utils/               # Utilitários puros (csvExporter, currencyFlags)
├── context/             # Providers (LanguageContext)
├── App.jsx              # Composição raiz + providers
├── main.jsx             # Entry point
└── index.css            # @import "tailwindcss" + @theme + @layer
```

### Padrões Adotados

- **Custom Hook Centralizado**: `useCurrency` encapsula todo estado + effects + API calls
- **Services Puros**: `currencyService.js` sem dependências React — testável isoladamente
- **Props Down, Events Up**: Componentes recebem dados via props, disparam callbacks
- **Isolamento de Falhas**: `historicalLoading`/`historicalData` independentes de `loading`/`error` do conversor
- **Memoização Seletiva**: `useMemo` em dados derivados (filteredData, chartData), `useCallback` em handlers
- **Fallback Automático**: Primária → Fallback com logs estruturados no service
- **Selects Inline**: `<select key={value} value={value} onChange={handler}>` direto no JSX — evita closure stale state
- **Key Prop em Selects**: `key={baseCurrency}` / `key={targetCurrency}` força remount correto
- **FlagCDN Integration**: `https://flagcdn.com/w40/{code}.png` dinâmico via mapeamento currency→country

### Versionamento

- **Git** com commits semânticos incrementais
- **GitHub** como remote (origin)
- Histórico de commits documenta evolução: limpeza boilerplate → services → hook → componentes → visual redesign → i18n → docs

---

## 5. Critérios de Aceite

- [ ] Conversão atualiza dinamicamente ao digitar valor ou trocar moedas
- [ ] Swap inverte moedas e refaz busca com animação visual 180°
- [ ] 8 botões de período (pílulas cyber) funcionam e disparam nova busca histórica
- [ ] Gráfico renderiza área neon suave com tooltip glassmorphism (data completa + taxa + flags)
- [ ] Tabela exibe dados, filtros funcionam, ordenação alterna asc/desc, variações ▲/▼
- [ ] Contador reflete registros filtrados em tempo real
- [ ] Exportação CSV baixa arquivo com dados filtrados e nome padrão
- [ ] Falha no histórico **não** quebra conversor nem mostra erro global
- [ ] Dark/Light mode alternando com persistência
- [ ] PT/EN/ES trocando instantaneamente via dropdown header
- [ ] Selects iniciam em **AUD/AUD** com placeholder "Carregando..." → moedas reais
- [ ] Build `npm run build` passa sem erros
- [ ] Contraste WCAG AA válido (Dark: 8.2:1, Light: 15.8:1)