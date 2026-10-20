# Guia de Estilo "Financial Clarity" — Currency Exchange App

## Princípio Norteador
**Clareza financeira** = tipografia legível, números alinhados, hierarquia visual óbvia, zero ruído visual. Cada pixel serve a um propósito informativo.

---

## Paleta de Cores

### Base Editorial (Slate Scale)
| Token | Hex | Uso |
|-------|-----|-----|
| `slate-50` | `#f8fafc` | Backgrounds de cards, inputs, hover sutil |
| `slate-100` | `#f1f5f9` | Borders, dividers, backgrounds filtros |
| `slate-200` | `#e2e8f0` | **Border padrão** de todos os cards/inputs/tabela |
| `slate-300` | `#cbd5e1` | Placeholders, disabled states |
| `slate-400` | `#94a3b8` | Ícones secundários, labels sutis |
| `slate-500` | `#64748b` | Textos auxiliares, labels de input |
| `slate-600` | `#475569` | Textos padrão, botões inativos |
| `slate-700` | `#334155` | Headings, labels importantes |
| `slate-900` | `#0f172a` | **Textos principais**, números, títulos |
| `slate-950` | `#020617` | — |

### Ação & Destaque (Emerald)
| Token | Hex | Uso |
|-------|-----|-----|
| `emerald-500` | `#10b981` | — |
| `emerald-600` | `#059669` | **Botão primário** (Exportar CSV), links de ação |
| `emerald-700` | `#047857` | Hover botão primário |
| `emerald-900` | `#064e3b` | Gradiente gráfico (stop 0%) |

### Gradiente do Gráfico (AreaChart)
```css
/* linearGradient#areaGradient (vertical) */
stop 0%:  #0f766e (emerald-800) @ 15% opacity
stop 100%: #0f766e (emerald-800) @ 0% opacity
```
*Linha do gráfico:* `stroke="#0f766e"` (emerald-800) `strokeWidth={2}`

### Estados de Feedback
| Estado | Cor | Classe Tailwind |
|--------|-----|-----------------|
| Sucesso/Confirmado | Emerald | `bg-emerald-50 border-emerald-200 text-emerald-700` |
| Alerta/Erro | Red | `bg-red-50 border-red-200 text-red-700` |
| Loading/Neutro | Slate | `bg-slate-50 border-slate-200 text-slate-700` |
| Foco (Ring) | Slate-500 | `focus:ring-2 focus:ring-slate-500 focus:border-transparent` |

---

## Tipografia

### Famílias
```css
/* Sistema nativo — zero dependências externas */
font-sans: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
```

### Escala (Tailwind Default)
| Classe | Tamanho | Line-height | Uso |
|--------|---------|-------------|-----|
| `text-xs` | 0.75rem (12px) | 1.5 | Labels de filtros, contadores |
| `text-sm` | 0.875rem (14px) | 1.428 | Botões, tooltips, tabelas |
| `text-base` | 1rem (16px) | 1.5 | Body padrão |
| `text-lg` | 1.125rem (18px) | 1.5 | Subtítulos cards |
| `text-xl` | 1.25rem (20px) | 1.5 | — |
| `text-2xl` | 1.5rem (24px) | 1.333 | Input valor conversor |
| `text-3xl` | 1.875rem (30px) | 1.25 | Título principal (h1) |
| `text-4xl` | 2.25rem (36px) | 1.1 | — |

### Pesos
- `font-medium` (500): Labels, botões, moedas na tabela
- `font-semibold` (600): Headings cards, títulos seção
- `font-bold` (700): H1 principal, resultado conversão, números tooltip

### Regras de Ouro
1. **Números SEMPRE monoespaçados** (`font-mono tabular-nums`): inputs, taxas, cotações, CSV
2. **Datas monoespaçadas** no gráfico (eixo X) e tabela
3. **Zero text-center** em colunas numéricas — sempre `text-right`
4. **Hierarquia**: heading → label → value → helper text

---

## Espaçamento & Layout

### Scale Base (4px = 1 unit)
| Token | Valor | Uso Comum |
|-------|-------|-----------|
| `space-y-1` / `gap-1` | 4px | Gap ícones+texto, itens inline |
| `space-y-2` / `gap-2` | 8px | Gap botões período, form fields |
| `space-y-3` / `gap-3` | 12px | — |
| `space-y-4` / `gap-4` | 16px | Gap seções card, padding interno |
| `space-y-6` / `gap-6` | 24px | **Gap principal** entre cards raiz (`App.jsx`) |
| `space-y-8` / `gap-8` | 32px | — |
| `p-4` | 16px | Padding cards internos |
| `p-6` | 24px | **Padding padrão** cards principais |
| `px-4 py-3` | 16/12px | Padding inputs/selects |
| `px-3 py-1.5` | 12/6px | Padding botões pequenos (período, filtros) |

### Container Raiz
```jsx
<div className="min-h-screen bg-slate-50 py-12 px-4">
  <div className="max-w-3xl mx-auto space-y-6">
    {/* Cards empilhados com gap-6 (24px) */}
  </div>
</div>
```

### Grid Responsivo (Filtros Tabela)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
  {/* 1 col < 640px, 2 col 640-1024px, 4 col > 1024px */}
</div>
```

### Tabela
```jsx
<div className="overflow-x-auto">
  <table className="w-full text-sm">
    {/* th/td: px-4 py-3 */}
  </table>
</div>
```

---

## Componentes de UI — Padrões

### Card Padrão
```jsx
<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
  {/* Conteúdo */}
</div>
```
- `rounded-xl` (12px)
- `border-slate-200` (1px)
- `shadow-sm` (sutil, apenas elevação)
- `p-6` interno

### Input Padrão
```jsx
<input className="
  w-full px-4 py-3.5
  text-slate-900 bg-slate-50
  border border-slate-200 rounded-lg
  placeholder:text-slate-400
  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
  transition-all
" />
```

### Select Padrão
```jsx
<select className="
  w-full px-4 py-3
  text-slate-900 bg-slate-50
  border border-slate-200 rounded-lg
  appearance-none cursor-pointer
  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
  transition-all
" />
```

### Botão Primário (Emerald)
```jsx
<button className="
  px-4 py-2 text-sm font-medium
  bg-emerald-600 text-white
  rounded-lg
  hover:bg-emerald-700
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-all
  flex items-center gap-1.5
">
  <Icon className="w-4 h-4" /> Label
</button>
```

### Botão Secundário / Toggle (Slate)
```jsx
<button className="
  px-3 py-1.5 text-sm font-medium rounded-lg
  text-slate-600 hover:text-slate-900 hover:bg-slate-100
  transition-all
  flex items-center gap-1.5
">
  {/* Active: bg-white text-slate-900 shadow-sm */}
</button>
```

### Botão Ghost / Icon Only (Swap)
```jsx
<button className="
  p-3 text-slate-500
  hover:text-slate-700 hover:bg-slate-100
  rounded-full
  transition-all duration-300
  disabled:opacity-50 disabled:cursor-not-allowed
  focus:outline-none focus:ring-2 focus:ring-slate-500
">
  <Icon className="w-5 h-5 transition-transform duration-300" />
</button>
```

### Badge / Contador
```jsx
<span className="px-2 py-0.5 text-xs font-mono text-slate-600 bg-slate-100 rounded">
  {count} registro{count !== 1 ? 's' : ''}
</span>
```

---

## Animações & Transições

| Elemento | Transição | Duração | Easing |
|----------|-----------|---------|--------|
| Botões (bg, text, shadow) | `transition-all` | 200ms | default |
| Swap icon rotation | `transition-transform` | 300ms | default |
| Focus ring | `transition-all` | 150ms | default |
| Tabela row hover | `transition-colors` | 150ms | default |
| Recharts Area | `isAnimationActive` | 500ms | ease-out |
| Filtros panel | CSS (height auto) | — | — |

**Swap Animation (Manual):**
```js
const handleSwap = () => {
  swapRef.current?.classList.add('rotate-180');
  setTimeout(() => swapRef.current?.classList.remove('rotate-180'), 300);
  swapCurrencies();
};
```

---

## Ícones (lucide-react)

| Componente | Ícone | Tamanho | Cor |
|------------|-------|---------|-----|
| Swap | `ArrowLeftRight` | `w-5 h-5` | `text-slate-500` |
| Loading | `Loader2` | `w-5 h-5` / `w-8 h-8` | `text-slate-400` + `animate-spin` |
| Filtros | `Filter` / `FilterX` | `w-4 h-4` | `text-slate-600` |
| Export CSV | `Download` | `w-4 h-4` | `text-white` (no botão verde) |
| Sort asc | `ChevronUp` | `w-4 h-4` | `text-slate-700` |
| Sort desc | `ChevronDown` | `w-4 h-4` | `text-slate-700` |
| Sort none | `ChevronsUpDown` | `w-4 h-4` | `text-slate-400` |

---

## Acessibilidade (a11y)

- `htmlFor` em todos labels ↔ `id` nos inputs/selects
- `aria-label` em botões icon-only (Swap, Export)
- `disabled` nativo + `opacity-50 cursor-not-allowed` visual
- `focus:ring-2 focus:ring-slate-500` visível em todos interativos
- `tabular-nums` em números para leitura de tela consistente
- `time` element com `dateTime` ISO na data da cotação
- Contraste mínimo WCAG AA: slate-900/slate-50 = 15.8:1 ✓

---

## Checklist de Qualidade Visual

- [ ] Zero `bg-gradient` exceto gráfico (área)
- [ ] Zero `shadow` > `shadow-sm` exceto tooltip/modal
- [ ] Zero `rounded` < `rounded-lg` (8px) exceto badges (`rounded`)
- [ ] Todos `border-slate-200` consistentes
- [ ] Todos `focus:ring-slate-500` consistentes
- [ ] Números: `font-mono tabular-nums` sem exceção
- [ ] Espaçamentos múltiplos de 4px (Tailwind scale)
- [ ] Container max-width `max-w-3xl` (768px) centrado
- [ ] Mobile-first: testado 375px, 768px, 1024px, 1440px