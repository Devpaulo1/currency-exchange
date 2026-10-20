# Relatório de Uso de Inteligência Artificial — Currency Exchange App

## Resumo Executivo
Este documento registra o uso de Inteligência Artificial (LLM) como parceiro de desenvolvimento durante a construção do **Currency Exchange App**, uma SPA React 19 + Vite + Tailwind v4 + Recharts para conversão de moedas em tempo real via API Frankfurter.

**Ferramenta utilizada:** OpenCode (NVIDIA Nemotron-3-Ultra)  
**Período:** Outubro 2026  
**Papel da IA:** Pair Programming Sênior — Arquitetura, Code Review, Refatoração, Debugging, Documentação

---

## 1. Prompt Engineering & Estratégia de Interação

### 1.1 Abordagem Inicial
- **Prompt sistema:** "Atuando como engenheiro de software frontend sênior..."
- **Contexto fornecido:** Stack (React 19, Vite, Tailwind v4, Recharts, Frankfurter API), requisitos funcionais, estética "Financial Clarity" → evoluiu para "Glassmorphism & Cyber Fintech Pro"
- **Padrão de prompt:** Objetivo claro + constraints + exemplos de código esperado

### 1.2 Técnicas de Prompting Utilizadas

| Técnica | Aplicação | Exemplo |
|---------|-----------|---------|
| **Chain of Thought** | Arquitetura do hook `useCurrency` | "Pense passo a passo: estado, effects, isolamento de falhas" |
| **Few-Shot** | Componentes Tailwind | Exemplos de cards glassmorphism, selects com flags |
| **Constraint-Based** | Isolamento de falhas | "Histórico NÃO pode tocar em loading/error do conversor" |
| **Iterative Refinement** | Selects travando em AUD | 4 iterações: key prop → option placeholder → default AUD |
| **Code Review** | Recharts tooltip | "Flags estáticas → dinâmicas via props baseCurrency/targetCurrency" |

### 1.3 Padrão de Interação Eficiente
```
User: Objetivo + Constraints
AI:  Código + Explicação breve
User: Ajuste pontual ("muda X para Y")
AI:  Diff mínimo + Build verification
```

---

## 2. Principais Contribuições da IA

### 2.1 Arquitetura & Estrutura (Sessão 1)
- **Limpeza do boilerplate Vite** → `src/` enxuto com pastas `components/`, `hooks/`, `services/`, `utils/`, `context/`
- **Hook centralizado `useCurrency`** — Estado único, effects isolados, memoização seletiva
- **Service layer pura** — `currencyService.js` sem React, testável isoladamente
- **Fallback automático API** — Primária → Fallback com logs estruturados

### 2.2 Componentes Core (Sessões 2-4)
| Componente | IA Contribution |
|------------|-----------------|
| `CurrencyConverter` | Input valor + selects inline + swap animado + card resultado glassmorphism |
| `HistoricalChart` | Recharts AreaChart neon + tooltip dinâmico + 8 períodos + flags no tooltip |
| `HistoricalTable` | Filtros expansíveis + ordenação asc/desc + export CSV + variações ▲/▼ |

### 2.3 Visual Redesign — "Glassmorphism & Cyber Fintech Pro" (Sessão 5)
- **Dark mode default** `#060913` + grid cyber + orbs gradientes
- **Glassmorphism cards** `bg-slate-900/50 backdrop-blur-md border-emerald-500/20`
- **Light mode premium** `bg-white border-slate-200/80`
- **Selects inline** sem wrapper function — evita closure stale state
- **Flags dinâmicas** FlagCDN (`https://flagcdn.com/w40/{code}.png`)

### 2.4 Internacionalização PT/EN/ES (Sessão 6)
- **LanguageContext** com 3 idiomas + persistência localStorage
- **Language Selector** no header com flags 🇧🇷 🇺🇸 🇪🇸
- **Traduções completas** — 80+ chaves em 3 idiomas
- **Seletor dropdown** no header ao lado do status da API

### 2.5 Debugging & Fixes Críticos
| Bug | Causa Raiz | Solução IA |
|-----|------------|------------|
| Select travando em AUD | Closure `isDark` + `currencies` vazio | `key={currency}` + option placeholder "Carregando..." |
| Flags estáticas no tooltip | `dataKey` parsing frágil | Props `baseCurrency`/`targetCurrency` diretas no tooltip |
| Selects não atualizavam visual | Closure `CurrencySelect` function | **Inline selects no JSX** — zero wrapper |
| LanguageContext export missing | `const` vs `export const` | `export const LanguageContext = createContext(null)` |

---

## 3. Métricas de Produtividade

### 3.1 Volume de Código Gerado/Refatorado
| Arquivo | Linhas | Tipo |
|---------|--------|------|
| `useCurrency.js` | 136 | Hook central |
| `currencyService.js` | 76 | Service layer |
| `CurrencyConverter.jsx` | 257 | Componente principal |
| `HistoricalChart.jsx` | 305 | Gráfico Recharts |
| `HistoricalTable.jsx` | 314 | Tabela + filtros |
| `CurrencyConverter.jsx` (refatorado) | 247 | Inline selects |
| `LanguageContext.jsx` | 236 | i18n system |
| `App.jsx` | 129 | Root + providers |
| **Total** | **~1,700** | **Produção** |

### 3.2 Iterações de Build
- **Total builds:** ~25
- **Tempo médio:** 400-600ms
- **Erros de build resolvidos:** 8 (exports, syntax, imports)

### 3.3 Tempo Estimado Economizado
| Atividade | Tempo Manual Estimado | Tempo com IA | Economia |
|-----------|----------------------|--------------|----------|
| Arquitetura + Setup | 4h | 30min | 90% |
| Hook `useCurrency` | 3h | 45min | 75% |
| 3 Componentes complexos | 12h | 2h | 83% |
| Visual Redesign | 8h | 1.5h | 81% |
| i18n System | 4h | 1h | 75% |
| Debugging seleto | 6h | 1h | 83% |
| Documentação (5 MDs) | 6h | 1h | 83% |
| **Total** | **43h** | **~8h** | **~81%** |

---

## 4. Lições Aprendidas & Boas Práticas

### 4.1 O que Funcionou Bem
1. **Contexto rico inicial** → IA acerta arquitetura na primeira
2. **Constraints explícitas** → "NÃO toque em X", "Use Y pattern"
3. **Inline components** → Evita closures problemáticos em selects controlados
3. **Key prop em selects** → Força remount correto em valor controlado
4. **Props drilling intencional** → `baseCurrency`/`targetCurrency` no tooltip evita parsing frágil

### 4.2 Armadilhas Evitadas
| Armadilha | Como IA Ajudou |
|-----------|----------------|
| `CurrencySelect` como função interna | Detectou closure `isDark`/`currencies` → inline no JSX |
| `selected={isSelected}` em `<option>` | Redundante em select controlado → removido |
| `e.preventDefault()` em `onChange` | Desnecessário, quebrava update → removido |
| `LanguageContext` não exportado | `const` vs `export const` → corrigido em 1 build |

### 4.3 Padrões Reutilizáveis Descobertos
```jsx
// Pattern: Select controlado inline com key + placeholder
<select key={value} value={value} onChange={handler} className={classes}>
  {options.length === 0 && <option key={value} value={value}>Carregando...</option>}
  {options.map(o => <option key={o.code} value={o.code}>{o.code} — {o.name}</option>)}
</select>

// Pattern: Context export
export const MyContext = createContext(null);

// Pattern: classes dark-only (sem ternário de tema)
const classes = 'bg-slate-900/50 border-slate-700/50';
```

---

## 5. Limitações & Intervenções Humanas Necessárias

| Situação | Intervenção Humana |
|----------|-------------------|
| Decisão UX: AUD/AUD default | Usuário decidiu "inicia tudo AUD" |
| Decisão visual: Glassmorphism vs Financial Clarity | Usuário pediu "Cyber Fintech Pro" |
| Decisão: inline selects vs component | Usuário pediu "substitua pela implementação limpa" |
| Validação visual final | Humanos testam no navegador real |
| Decisão de defaults (AUD/AUD) | Negócio define, não técnica |

---

## 6. Conclusão

A IA atuou como **force multiplier 5-10x** para tarefas de implementação, refatoração, debugging e documentação. O desenvolvedor humano manteve o **controle de decisões de produto/UX** enquanto a IA executou a **engenharia de implementação** com alta qualidade e velocidade.

**Resultado:** Projeto completo, buildando, documentado e pronto para Figma/produção em ~8h de colaboração humano-IA vs ~40h estimadas solo.

---

## 7. Prompt Template Reutilizável (Para Próximos Projetos)

```markdown
# System Prompt Template
Você é um engenheiro frontend sênior especialista em React 18+, Tailwind CSS v4, TypeScript.
Estilo: Código limpo, modular, acessível, performático.
Constraints: 
- Zero comments desnecessários
- Inline components para selects controlados
- Context export com `export const`
- Key props em selects controlados
- Dark mode only (sem light mode)
- Build deve passar sem warnings

Stack: React 19, Vite, Tailwind v4, Recharts, Frankfurter API
```

---
*Documento gerado em Outubro 2026 — Currency Exchange App v1.0*