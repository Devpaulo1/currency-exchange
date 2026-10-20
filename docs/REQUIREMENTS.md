# Requisitos do Projeto - Currency Exchange App

## 1. Contexto e Objetivo
Aplicação Single Page Application (SPA) desenvolvida em React 19 com Vite, Tailwind CSS v4 e API Frankfurter (v1). O objetivo é centralizar o fluxo de conversão de moedas em tempo real, visualização de histórico via gráfico de área e tabela com filtros avançados, e exportação de dados em CSV.

---

## 2. Requisitos Funcionais (RF)

| ID   | Requisito | Descrição Detalhada |
|------|-----------|---------------------|
| RF01 | Conversão em Tempo Real | Exibição de taxa de câmbio atual (endpoint `/latest`) com data da cotação, cálculo automático: `valorConvertido = amount × exchangeRate`. Atualização reativa ao alterar moedas ou valor. |
| RF02 | Seleção de Moedas | Dois `<select>` populados via `/currencies` (código + nome). Moeda base default: `USD`, moeda destino default: `BRL`. Validação: impede mesma moeda nas duas posições (tratado no service com retorno 1:1). |
| RF03 | Inversão de Moedas (Swap) | Botão central com animação de rotação 180° (300ms). Troca `baseCurrency` ↔ `targetCurrency` e dispara nova busca automática. |
| RF04 | Gráfico Histórico - 8 Períodos | Botões de período: `7d`, `15d`, `30d`, `3m` (90d), `6m` (180d), `1y` (365d), `5y` (1825d), `10y` (3650d). Cálculo de `startDate`/`endDate` dinâmico. Gráfico de área suave (Recharts `AreaChart` + `monotone`) com gradiente emerald/slate 15%→0%. |
| RF05 | Tabela Histórica com Filtros | Colunas: Data (DD/MM/YYYY), Moeda Origem, Moeda Destino, Cotação (4-6 casas). Filtros: data inicial, data final, cotação mínima, cotação máxima. Ordenação clicável em Data e Cotação (asc/desc). Contador de registros filtrados em tempo real. |
| RF06 | Exportação CSV | Botão "Exportar CSV" gera download: `cotacao_{BASE}_{TARGET}_{YYYY-MM-DD}.csv`. Cabeçalhos: "Data", "Moeda Origem", "Moeda Destino", "Cotação". Validação: impede exportação se array filtrado vazio (alerta amigável). |

---

## 3. Requisitos Não-Funcionais (RNF)

| ID   | Requisito | Especificação Técnica |
|------|-----------|----------------------|
| RNF01 | Estética Financial Clarity | Paleta slate/emerald, tipografia monoespaçada para números, espaçamento generoso (scale 4/6/8), bordas `slate-200`, foco `ring-slate-500`, sem gradientes excessivos. |
| RNF02 | Performance | Lazy loading de Recharts, `useMemo`/`useCallback` em dados derivados, `historicalLoading` isolado do `loading` principal. Build Vite otimizado. |
| RNF03 | Modularidade React | Custom hook `useCurrency` encapsula toda lógica de estado/effects. Componentes puros recebem props tipadas. Services puros (sem React). Utils puras. |
| RNF04 | Tailwind CSS v4 | `@import "tailwindcss"` no `index.css`, plugin `@tailwindcss/vite` no `vite.config.js`. Zero configuração customizada — usa design system nativo. |
| RNF05 | Resiliência a Falhas de API | Base URL primária `api.frankfurter.dev/v1` com fallback automático para `api.frankfurter.app`. Logs estruturados no catch (`url`, `baseUrl`, `stack`). Histórico falha isolado: só `console.warn` + limpa gráfico, **não** toca em `error`/`loading` do conversor. |
| RNF06 | Tratamento de Moedas Idênticas | Service retorna mock 1:1 instantâneo se `base === symbols` (sem HTTP). Histórico gera array dia-a-dia com taxa = 1. |
| RNF07 | Responsividade | Container `max-w-3xl mx-auto`, grid fluido nos filtros (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), tabela com `overflow-x-auto`. |

---

## 4. Arquitetura e Tecnologias

### Stack Principal

| Camada | Tecnologia | Versão | Justificativa |
|--------|------------|--------|---------------|
| **Core** | React | 19.2.8 | Concurrent features, hooks modernos, performance |
| **Build** | Vite | 8.3.0 | HMR instantâneo, build otimizado, plugin ecosystem |
| **Estilização** | **Tailwind CSS v4** | 4.x | **Design system nativo**, zero config custom, responsividade via utilitários, fidelidade total à estética **Financial Clarity** (paleta slate/emerald, tipografia mono, espaçamento scale 4). Substitui CSS Modules com manutenção drasticamente simplificada. |
| **Gráficos** | **Recharts** | 3.10.1 | **Biblioteca permitida no escopo**. Renderização SVG declarativa, `AreaChart` + `monotone` interpolation, tooltip customizado, animações nativas, lazy-loadable. |
| **Ícones** | lucide-react | 1.57.0 | Tree-shakeable, SVG inline, acessíveis, consistentes |
| **API** | Frankfurter v1 | — | Gratuita, sem auth, CORS habilitado, fallback automático |
| **Lint** | ESLint | 10.10.0 | Flat config, React hooks rules, modern JS |

### Arquitetura de Pastas

```
src/
├── components/          # UI pura (CurrencyConverter, HistoricalChart, HistoricalTable)
├── hooks/               # Lógica de estado (useCurrency)
├── services/            # Camada de API pura (currencyService)
├── utils/               # Utilitários puros (csvExporter)
├── App.jsx              # Composição raiz
├── main.jsx             # Entry point
└── index.css            # @import "tailwindcss"
```

### Padrões Adotados

- **Custom Hook Centralizado**: `useCurrency` encapsula todo estado + effects + API calls
- **Services Puros**: `currencyService.js` sem dependências React — testável isoladamente
- **Props Down, Events Up**: Componentes recebem dados via props, disparam callbacks
- **Isolamento de Falhas**: `historicalLoading`/`historicalData` independentes de `loading`/`error` do conversor
- **Memoização Seletiva**: `useMemo` em dados derivados (filteredData, chartData), `useCallback` em handlers
- **Fallback Automático**: Primária → Fallback com logs estruturados no service

### Versionamento

- **Git** com commits semânticos incrementais
- **GitHub** como remote (origin)
- Histórico de commits documenta evolução: limpeza boilerplate → services → hook → componentes → integração → docs

---

## 5. Critérios de Aceite

- [ ] Conversão atualiza dinamicamente ao digitar valor ou trocar moedas
- [ ] Swap inverte moedas e refaz busca com animação visual
- [ ] 8 botões de período funcionam e disparam nova busca histórica
- [ ] Gráfico renderiza área suave com tooltip customizado (data completa + taxa)
- [ ] Tabela exibe dados, filtros funcionam, ordenação alterna asc/desc
- [ ] Contador reflete registros filtrados
- [ ] Exportação CSV baixa arquivo com dados filtrados e nome padrão
- [ ] Falha no histórico **não** quebra conversor nem mostra erro global
- [ ] Build `npm run build` passa sem erros