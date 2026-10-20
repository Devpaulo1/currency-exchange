# Guia de Estilo "Glassmorphism & Cyber Fintech Pro" — Currency Exchange App

## Princípio Norteador
**Fintech Cyber Pro** = Glassmorphism imersivo + Neon Emerald/Cyan + Dark Mode First + Dados financeiros cristalinos. Interface que respira tecnologia bancária de ponta (estilo Wise/Revolut/Nubank).

---

## Paleta de Cores — Dark Mode First (Padrão)

### Base Cyber (Slate Scale Profundo)
| Token | Hex | Uso |
|-------|-----|-----|
| `slate-950` | `#020617` | Background raiz `#060913` (quase preto) |
| `slate-900` | `#0f172a` | Background cards secundários |
| `slate-800` | `#1e293b` | Background inputs/selects, hover cards |
| `slate-700` | `#334155` | Borders cards, borders inputs |
| `slate-600` | `#475569` | Borders sutis, dividers |
| `slate-500` | `#64748b` | Placeholders, ícones secundários |
| `slate-400` | `#94a3b8` | Labels, textos auxiliares |
| `slate-300` | `#cbd5e1` | — |
| `slate-200` | `#e2e8f0` | — |
| `slate-100` | `#f1f5f9` | — |
| `slate-50`  | `#f8fafc` | — |

### Ação & Neon (Emerald/Cyan)
| Token | Hex | Uso |
|-------|-----|-----|
| `emerald-400` | `#34d399` | Textos de destaque, números positivos |
| `emerald-500` | `#10b981` | **Cor principal neon**, rings, gradientes |
| `emerald-600` | `#059669` | Botão primário (Export CSV), links |
| `emerald-700` | `#047857` | Hover botão primário |
| `cyan-400`  | `#22d3ee` | Gradientes secundários, orbs background |
| `cyan-500`  | `#06b6d4` | Gradientes cards, glow effects |

### Gradientes Cyber
```css
/* Background raiz orbs */
.bg-cyber-orbs {
  background: radial-gradient(ellipse at 50% -50%, rgba(16,185,129,0.1) 0%, transparent 50%),
              radial-gradient(ellipse at 125% 125%, rgba(6,182,212,0.05) 0%, transparent 50%);
}

/* Card glassmorphism glow */
.bg-glass-glow {
  background: linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.03) 100%);
}

/* Gráfico AreaChart neon */
stop 0%:  #10b981 @ 20% opacity (emerald-500)
stop 100%: #06b6d4 @ 0% opacity (cyan-500)

/* Linha neon Recharts */
stroke="#10b981" strokeWidth={2} filter="url(#neonGlow)"
/* neonGlow = feGaussianBlur stdDeviation=3 + feMerge */
```

---

## Glassmorphism — Especificação Técnica

### Card Principal (Glassmorphism Cyber)
```jsx
<div className="
  relative
  rounded-2xl
  p-6
  overflow-hidden
  backdrop-blur-md
  bg-slate-900/50
  border border-slate-700/50
  shadow-xl shadow-emerald-500/5
">
  {/* Glow interno */}
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
  {/* Conteúdo z-10 */}
</div>
```

### Propriedades Glassmorphism
| Propriedade | Valor |
|-------------|-------|
| Background | `bg-slate-900/50` |
| Backdrop | `backdrop-blur-md` |
| Border | `border-slate-700/50` |
| Shadow | `shadow-xl shadow-emerald-500/5` |
| Inner Glow | `from-emerald-500/5 via-transparent to-cyan-500/5` |

### Input/Select Glassmorphism
```jsx
// Dark
className="bg-slate-800/80 text-white border-slate-700 
  focus:border-emerald-500 focus:ring-emerald-500/50 
  backdrop-blur-sm"

```

---

## Tipografia — Cyber Fintech

### Famílias (Sistema Nativo)
```css
font-sans: system-ui, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
```

### Escala Cyber (Tailwind + Custom)
| Classe | Tamanho | Uso Cyber |
|--------|---------|-----------|
| `text-xs` | 12px | Labels filtros, contadores, badges |
| `text-sm` | 14px | Botões, tooltips, tabelas, labels |
| `text-base` | 16px | Body padrão |
| `text-lg` | 18px | Subtítulos cards |
| `text-xl` | 20px | Títulos cards |
| `text-2xl` | 24px | Input valor conversor |
| `text-3xl` | 30px | **Resultado conversão** (gradient text) |
| `text-4xl` | 36px | — |
| `text-5xl` | 48px | **Resultado mobile** |
| `text-7xl` | 72px | **Resultado desktop** |

### Pesos & Efeitos
| Peso | Uso | Efeito Especial |
|------|-----|-----------------|
| `font-medium` (500) | Labels, botões, moedas | — |
| `font-semibold` (600) | Headings cards, valores | — |
| `font-bold` (700) | **Resultado conversão**, H1 | `bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent animate-pulse` |
| `tabular-nums` | **Obrigatório** em todos números | Alinhamento perfeito |

### Regras de Ouro Cyber
1. **Números SEMPRE** `font-mono tabular-nums` + gradient text para valores principais
2. **Moedas com flags** → `flex items-center gap-2` (flag + código + nome)
3. **Zero `text-center`** em colunas numéricas → `text-right`
4. **Gradient text** apenas no valor convertido principal
5. **Hierarquia**: Badge → Label → Valor → Helper

---

## Espaçamento & Layout Cyber

### Scale Base (4px = 1 unit) + Breathing Room
| Token | Valor | Uso Cyber |
|-------|-------|-----------|
| `gap-1` / `space-y-1` | 4px | Ícones inline |
| `gap-2` / `space-y-2` | 8px | Botões período, badges |
| `gap-3` / `space-y-3` | 12px | Form fields gap |
| `gap-4` / `space-y-4` | 16px | Gap seções internas card |
| `gap-6` / `space-y-6` | 24px | **Gap principal** cards raiz (`App.jsx`) |
| `gap-8` / `space-y-8` | 32px | Seções grandes |
| `p-6` | 24px | **Padding padrão** cards glass |
| `px-4 py-3` | 16/12px | Inputs/selects padrão |
| `py-3 pl-11 pr-8` | — | Selects com flag + seta |

### Container Raiz Cyber
```jsx
<div className="min-h-screen bg-[#060913] transition-colors duration-500">
  {/* Cyber Grid Background - apenas dark */}
  <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/5 rounded-full blur-3xl -translate-y-1/2" />
    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/5 via-transparent to-emerald-500/5 rounded-full blur-3xl translate-y-1/2" />
  </div>
  
  <main className="relative max-w-5xl mx-auto px-4 py-8 space-y-6 pb-12">
    {/* Cards empilhados com gap-6 */}
  </main>
</div>
```

### Grid Responsivo (Filtros Tabela)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
  {/* 1 col < 640px, 2 col 640-1024px, 4 col > 1024px */}
</div>
```

---

## Componentes Cyber — Especificação

### 1. CurrencyConverter — Card Flutuante Principal
```jsx
// Resultado Card (Topo) - Glassmorphism + Gradient Text
<div className="relative bg-slate-900/70 backdrop-blur-md border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 rounded-2xl p-6 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/10" />
  <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
  <div className="relative z-10 text-center space-y-2">
    <p className="text-xs uppercase tracking-widest font-medium text-slate-400">Valor Convertido</p>
    <p className="text-5xl sm:text-7xl font-bold tabular-nums bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent animate-pulse">
      {formatAmount(convertedAmount)}
    </p>
    <p className="text-sm font-medium text-slate-400">{targetCurrency}</p>
  </div>
</div>

// Selects Inline com Flag Dinâmica
<div className="flex-1 min-w-[200px]">
  <label className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">De</label>
  <div className="relative flex items-center">
    {flagUrl && <img src={flagUrl} alt={currency} className="absolute left-3 w-6 h-4 rounded object-cover z-10 pointer-events-none" />}
    <select key={currency} value={currency} onChange={handler} className="w-full font-medium text-sm py-3 pl-11 pr-8 rounded-xl border focus:border-emerald-500 focus:outline-none appearance-none cursor-pointer transition-colors bg-slate-800/80 text-white border-slate-700">
      {Object.entries(currencies).map(([code, name]) => <option key={code} value={code} className="bg-slate-900 text-white">{code} — {name}</option>)}
    </select>
    <div className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</div>
  </div>
</div>
```

### 2. HistoricalChart — Gráfico Neon Recharts
```jsx
// Card Glassmorphism
<section className="relative bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-emerald-500/5 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
  
  // Header com badge par + flags
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
      <span className="font-mono text-sm text-emerald-500">{baseCurrency}/{targetCurrency}</span>
    </div>
    <h3 className="text-lg font-semibold text-slate-100">Histórico</h3>
    <div className="flex items-center gap-1">
      <img src={baseFlagUrl} className="w-5 h-3 rounded" />
      <span className="text-slate-300">→</span>
      <img src={targetFlagUrl} className="w-5 h-3 rounded" />
    </div>
  </div>

  // Períodos como pílulas cyber
  <div className="flex items-center gap-1 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-1">
    {PERIOD_OPTIONS.map(opt => (
      <button key={opt.value} className={period === opt.value 
        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg'
        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
      } px-3 py-1.5 text-xs font-medium rounded-lg>
        {opt.label}
      </button>
    ))}
  </div>
</section>

// Recharts Neon
<AreaChart>
  <defs>
    <linearGradient id="gradient">
      <stop offset="0%" stopColor="rgba(16,185,129,0.25)" />
      <stop offset="100%" stopColor="rgba(6,182,212,0)" />
    </linearGradient>
    <filter id="neonGlow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
      <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
  <Area type="monotone" stroke="#10b981" strokeWidth={2} fill="url(#gradient)" style={{ filter: 'url(#neonGlow)' }} />
</AreaChart>
```

### 3. HistoricalTable — Cockpit Dashboard
```jsx
// Card Glassmorphism
<section className="relative bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-emerald-500/5 overflow-hidden">
  <thead>
    <tr className="border-b border-slate-700/30">
      <th className="px-4 py-3 text-left font-medium text-slate-400 hover:text-emerald-400 cursor-pointer">Data</th>
      <th className="px-4 py-3 text-left font-medium text-slate-400">Par</th>
      <th className="px-4 py-3 text-right font-medium text-slate-400 hover:text-emerald-400 cursor-pointer">Cotação</th>
      <th className="px-4 py-3 text-center font-medium text-slate-400 w-16">Variação</th>
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-700/20">
    <tr className="hover:bg-emerald-500/5 hover:border-l-4 hover:border-emerald-500/30 transition-all">
      <td className="px-4 py-3 font-mono text-slate-200">15/01/2026</td>
      <td className="flex items-center gap-2">
        <img src={flag} className="w-5 h-3 rounded ring-1 ring-slate-700" />
        <span className="font-medium text-slate-200">AUD</span>
        <span className="text-slate-500">→</span>
        <img src={flag} className="w-5 h-3 rounded ring-1 ring-slate-700" />
        <span className="font-medium text-slate-200">BRL</span>
      </td>
      <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-100">3,4567 <span className="ml-1 text-emerald-400">▲</span></td>
      <td className="text-center"><span className="text-xs font-medium text-emerald-400">+0.58%</span></td>
    </tr>
  </tbody>
</section>
```

---

## Header Cyber — Logo + Status + Language
```jsx
<header className="sticky top-0 z-40 backdrop-blur-md border-b border-slate-800/50 bg-slate-900/50">
  <div className="max-w-5xl mx-auto px-4">
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center gap-3">
        <img src="/images/image-1.jpg" alt="Fintech Pro" className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/50 shadow-md" />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-100">Currency Exchange</h1>
          <p className="text-xs text-slate-400">Taxas em tempo real via Frankfurter API</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* API Status */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
          <Wifi className="w-4 h-4" />
          <span className="text-xs font-medium">Conectado</span>
        </div>
        
        {/* Language Selector */}
        <div className="relative group">
          <button className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-slate-100 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all">
            <Globe className="w-5 h-5" />
            <span className="text-xs font-medium">PT</span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-36 rounded-xl shadow-lg bg-slate-900 border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {languages.map(l => <button key={l.code} className="w-full px-3 py-2 text-sm font-medium flex items-center gap-2">...</button>)}
          </div>
        </div>
        
      </div>
    </div>
  </div>
</header>
```

---

## Animações & Micro-interactions Cyber

| Elemento | Transição | Duração | Easing | Detalhe |
|----------|-----------|---------|--------|---------|
| Glass cards hover | `hover:bg-emerald-500/5` | 200ms | ease-out | Border-left glow |
| Tabela row hover | `hover:bg-emerald-500/5 border-l-4 border-emerald-500/30` | 200ms | ease-out | Left accent |
| Swap icon rotation | `rotate-180` | 300ms | ease-in-out | Manual classList |
| Language dropdown | `opacity-0 → opacity-100` + `invisible → visible` | 200ms | ease-out | Group hover |
| Recharts Area | `isAnimationActive` | 500ms | ease-out | Neon glow filter |
| Period pills active | `bg-emerald-500/20 border-emerald-500/30 shadow-lg` | 200ms | ease-out | Neon ring |
| Focus ring | `focus:ring-2 focus:ring-emerald-500/50` | 150ms | ease-out | Emerald glow |

---

## Ícones (lucide-react) — Cyber

| Componente | Ícone | Tamanho | Cor |
|------------|-------|---------|-----|
| Logo/Header | `Zap` (custom logo img) | `w-10 h-10` | — | — |
| API Status | `Wifi` / `WifiOff` / `Loader2` | `w-4 h-4` | `text-emerald-400` |
| Language | `Globe` | `w-5 h-5` | `text-slate-400` |
| Swap | `ArrowLeftRight` | `w-5 h-5` | `text-slate-400` |
| Loading | `Loader2` | `w-6 h-6` / `w-8 h-8` | `text-emerald-500` |
| Filtros | `Filter` / `FilterX` | `w-4 h-4` | `text-slate-400` |
| Export CSV | `Download` | `w-4 h-4` | `text-white` (btn verde) |
| Sort asc/desc | `ChevronUp` / `ChevronDown` | `w-4 h-4` | `text-emerald-400` |
| Variação | `▲` / `▼` (text) | `text-xs` | `text-emerald-400`/`text-red-400` |

---

## Flags — FlagCDN Integration
```jsx
// URL pattern
https://flagcdn.com/w40/{countryCode}.png  // 40px width PNG
https://flagcdn.com/{countryCode}.svg      // SVG vector

// Mapeamento currency → country
const CURRENCY_TO_COUNTRY = {
  USD: 'us', BRL: 'br', EUR: 'eu', GBP: 'gb', JPY: 'jp',
  CHF: 'ch', CAD: 'ca', AUD: 'au', CNY: 'cn', INR: 'in',
  // ... 100+ mapeamentos
};

// Uso no select
{flagUrl && (
  <img src={flagUrl} alt={currency} className="absolute left-3 w-6 h-4 rounded object-cover z-10 pointer-events-none" loading="lazy" />
)}
```

---

## Estados Visuais — Referência Rápida

| Estado | Estilo |
|--------|--------|
| **Loading** | `bg-emerald-500/10` spinner emerald |
| **Error** | `bg-red-500/10 border-red-500/20 text-red-400` |
| **Empty** | `text-slate-500` "Sem dados..." |
| **Success** | `bg-emerald-500/10 border-emerald-500/20 text-emerald-400` |
| **Focus Ring** | `focus:ring-2 focus:ring-emerald-500/50` |

---

## Acessibilidade (a11y) — Cyber Compliant

- ✅ `htmlFor`/`id` em todos labels ↔ inputs/selects
- ✅ `aria-label` em botões icon-only (Swap, Language, Export)
- ✅ `role="tab"`, `aria-selected` no seletor de período
- ✅ `role="menu"`, `role="menuitem"` no language dropdown
- ✅ `disabled` nativo + `opacity-50 cursor-not-allowed`
- ✅ `focus:ring-2 focus:ring-emerald-500/50` visível em todos interativos
- ✅ `tabular-nums` em todos números monetários
- ✅ `time` element com `dateTime` ISO
- ✅ Contraste WCAG AA: emerald-400/slate-950 = 8.2:1 ✓

---

## Checklist Qualidade Visual Cyber

- [ ] Dark mode default `#060913` + cyber grid + orbs
- [ ] Glassmorphism cards: `bg-slate-900/50 backdrop-blur-md border-slate-700/50`
- [ ] Inner glow: `from-emerald-500/5 via-transparent to-cyan-500/5`
- [ ] Neon Recharts: `#10b981` stroke + `feGaussianBlur` filter
- [ ] Gradient text resultado: `from-emerald-400 via-cyan-300 to-emerald-400 bg-clip-text`
- [ ] Flags dinâmicas FlagCDN em selects, tooltip, tabela, header
- [ ] Header sticky glass: `bg-slate-900/50 backdrop-blur-md border-slate-800/50`
- [ ] Language dropdown: `group-hover:opacity-100` + flags 🇧🇷 🇺🇸 🇪🇸
- [ ] Period pills cyber: active `bg-emerald-500/20 border-emerald-500/30`
- [ ] Tabela hover: `bg-emerald-500/5 border-l-4 border-emerald-500/30`
- [ ] Swap rotation: 300ms `rotate-180`
- [ ] Build `npm run build` sem erros
- [ ] Mobile-first: 375px, 768px, 1024px, 1440px testados