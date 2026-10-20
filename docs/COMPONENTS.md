# Mapeamento de Componentes - Currency Exchange App

## Visão Geral da Arquitetura

```
src/
├── components/
│   ├── CurrencyConverter.jsx  # Conversor principal (input + selects + resultado)
│   ├── HistoricalChart.jsx    # Gráfico de área + seletor de 8 períodos
│   └── HistoricalTable.jsx    # Tabela com filtros, ordenação e export CSV
├── hooks/
│   └── useCurrency.js         # Estado global + effects + API calls
├── services/
│   └── currencyService.js     # Fetch puro da API Frankfurter (v1 + fallback)
├── utils/
│   └── csvExporter.js         # Geração e download de CSV
└── App.jsx                    # Composição raiz (layout + providers)
```

---

## 1. CurrencyConverter.jsx

### Responsabilidade
Interface principal de conversão: input de valor, seleção de moedas (origem/destino), botão swap, exibição de taxa atual e resultado convertido.

### Props Recebidas (do `useCurrency`)

| Prop | Tipo | Descrição |
|------|------|-----------|
| `amount` | `string` | Valor digitado pelo usuário (default `'1'`) |
| `setAmount` | `function` | Setter para atualizar valor |
| `baseCurrency` | `string` | Código moeda origem (ex: `'USD'`) |
| `setBaseCurrency` | `function` | Setter moeda origem |
| `targetCurrency` | `string` | Código moeda destino (ex: `'BRL'`) |
| `setTargetCurrency` | `function` | Setter moeda destino |
| `currencies` | `object` | Mapa `{ code: name }` do `/currencies` |
| `exchangeRate` | `number\|null` | Taxa atual (1 base = X target) |
| `date` | `string\|null` | Data da cotação (YYYY-MM-DD) |
| `loading` | `boolean` | Loading da cotação **atual** |
| `error` | `string\|null` | Erro da cotação atual |
| `swapCurrencies` | `function` | Inverte base ↔ target |
| `convertedAmount` | `string\|null` | Resultado formatado (4 casas) |

### Estados Internos
- `amountRef` (useRef) — foco automático no mount
- `swapRef` (useRef) — animação de rotação no botão swap

### Fluxo de Dados
```
User Input → setAmount → convertedAmount (derivado)
Select Change → setBaseCurrency/setTargetCurrency → useEffect → fetchLatestRate
Swap Click → swapCurrencies → setBase/setTarget → useEffect → fetchLatestRate
```

### Renderização Condicional
- Loading: spinner + "Atualizando cotação..."
- Error: card vermelho com mensagem
- Sem taxa: "Selecione as moedas para ver a conversão"
- Com taxa: bloco taxa (1 BASE = X TARGET + data) + bloco resultado (valor grande centralizado)

---

## 2. HistoricalChart.jsx

### Responsabilidade
Visualização gráfica do histórico de cotações via Recharts `AreaChart`, com seletor de 8 períodos e tooltip customizado.

### Props Recebidas

| Prop | Tipo | Descrição |
|------|------|-----------|
| `historicalData` | `array` | `[{ date: 'YYYY-MM-DD', rate: number }, ...]` ordenado asc |
| `historicalLoading` | `boolean` | Loading isolado do histórico |
| `period` | `string` | Período ativo (`'7d' \| '15d' \| '30d' \| '3m' \| '6m' \| '1y' \| '5y' \| '10y'`) |
| `setPeriod` | `function` | Callback para trocar período |
| `baseCurrency` | `string` | Código moeda origem |
| `targetCurrency` | `string` | Código moeda destino |

### Estados Internos
- `chartData` (useMemo) — transforma `historicalData` adicionando `formattedDate`
- `hasData`, `minRate`, `maxRate`, `padding` — cálculos para domínio do eixo Y

### PERIOD_OPTIONS (constante local)
```js
[
  { value: '7d', label: '7 dias' },
  { value: '15d', label: '15 dias' },
  { value: '30d', label: '30 dias' },
  { value: '3m', label: '3 meses' },
  { value: '6m', label: '6 meses' },
  { value: '1y', label: '1 ano' },
  { value: '5y', label: '5 anos' },
  { value: '10y', label: '10 anos' },
]
```

### Botões de Período
- `onClick={() => setPeriod(opt.value)}`
- `disabled={historicalLoading}`
- Active state: `bg-white text-slate-900 shadow-sm`
- Inactive: `text-slate-600 hover:bg-slate-200`

### Gráfico (Recharts)
- `ResponsiveContainer` 100% × 288px (`h-72`)
- `AreaChart` + `Area` type=`monotone` stroke=`#0f766e` width=2
- Gradiente vertical `linearGradient#areaGradient` (emerald 15% → 0%)
- `XAxis`: dataKey=`date`, tickFormatter `DD/MM`, interval `preserveStartEnd`
- `YAxis`: tickFormatter 4-6 casas, domínio `[minRate-padding, maxRate+padding]`
- `Tooltip` customizado: card branco, data completa (semana + DD/MM/YYYY), taxa formatada
- Loading overlay: spinner centralizado `bg-white/80`
- Empty state: "Sem dados históricos para o período selecionado"

---

## 3. HistoricalTable.jsx

### Responsabilidade
Tabela tabular dos dados históricos com filtros avançados (data, cotação), ordenação bidercional e exportação CSV.

### Props Recebidas

| Prop | Tipo | Descrição |
|------|------|-----------|
| `historicalData` | `array` | Dados brutos do hook (mesmo array do gráfico) |
| `baseCurrency` | `string` | Código moeda origem |
| `targetCurrency` | `string` | Código moeda destino |

### Estados Internos

| Estado | Tipo | Inicial | Descrição |
|--------|------|---------|-----------|
| `sortConfig` | `{key, direction}` | `{null, 'asc'}` | Coluna ordenada + direção |
| `filters` | `{dateFrom, dateTo, rateMin, rateMax}` | `{'','','',''}` | Filtros ativos |
| `showFilters` | `boolean` | `false` | Expansão do painel de filtros |

### Derivados (useMemo)

**`filteredData`** — pipeline:
1. Filtro data inicial (`>= dateFrom`)
2. Filtro data final (`<= dateTo 23:59:59`)
3. Filtro cotação mínima (`>= rateMin`)
4. Filtro cotação máxima (`<= rateMax`)
5. Ordenação: se `sortConfig.key` === `'date'` → timestamp; se `'rate'` → número

### Funções

| Função | Descrição |
|--------|-----------|
| `handleSort(key)` | Alterna asc/desc se mesma coluna, senão asc na nova |
| `handleFilterChange(key, value)` | Atualiza filtro individual |
| `clearFilters()` | Reseta todos filtros + ordenação |
| `handleExport()` | Chama `exportToCSV(filteredData, base, target)`; alerta se vazio |

### UI - Seções

**Header**
- Título "Tabela de Cotações" + badge contador `filteredData.length`
- Botão "Filtros" (toggle `showFilters`) — ícone Filter
- Botão "Exportar CSV" (verde emerald, disabled se vazio) — ícone Download

**Painel de Filtros** (condicional `showFilters`)
- Grid 1/2/4 colunas responsivo:
  - Data Inicial (type=date)
  - Data Final (type=date)
  - Cotação Mínima (number step=0.0001)
  - Cotação Máxima (number step=0.0001)
- Botão "Limpar filtros" (aparece se `hasActiveFilters`)

**Tabela**
- `thead`: 4 colunas — Data (sortable), Moeda Origem, Moeda Destino, Cotação (sortable, align right)
- `tbody`: linhas `hover:bg-slate-50`
- Data: `font-mono DD/MM/YYYY`
- Moedas: `font-medium` código
- Cotação: `font-mono tabular-nums` 4-6 casas, align right
- Empty states:
  - Sem dados brutos: "Sem dados históricos para o período selecionado"
  - Com dados mas filtro vazio: "Nenhum registro encontrado com os filtros atuais"

---

## 4. useCurrency.js (Hook Central)

### Estados Gerenciados

| Estado | Tipo | Default | Descrição |
|--------|------|---------|-----------|
| `baseCurrency` | string | `'USD'` | Moeda origem |
| `targetCurrency` | string | `'BRL'` | Moeda destino |
| `amount` | string | `'1'` | Valor input |
| `currencies` | object | `{}` | Mapa código→nome |
| `rate` | number\|null | `null` | Taxa atual |
| `rateDate` | string\|null | `null` | Data cotação atual |
| `historicalData` | array | `[]` | Array `{date, rate}` |
| `selectedPeriod` | string | `'30d'` | Período ativo |
| `loading` | boolean | `false` | Loading cotação **atual** |
| `historicalLoading` | boolean | `false` | Loading **histórico** (isolado) |
| `error` | string\|null | `null` | Erro cotação atual |

### Callbacks (useCallback)

| Função | Dependências | Descrição |
|--------|--------------|-----------|
| `fetchCurrencies` | `[]` | Carrega `/currencies` no mount |
| `fetchLatestRate` | `[baseCurrency, targetCurrency]` | Busca `/latest`, seta `rate`/`rateDate` |
| `fetchHistoricalData` | `[baseCurrency, targetCurrency, selectedPeriod]` | Busca histórico, seta `historicalData` |
| `swapCurrencies` | `[baseCurrency, targetCurrency]` | Troca moedas |

### Effects

1. **Mount**: `fetchCurrencies()` — roda uma vez
2. **Moedas mudam**: `if (base && target) fetchLatestRate()` — cotação atual
3. **Moedas/período mudam**: `if (base && target) fetchHistoricalData()` — histórico

### Isolamento de Falhas
- `fetchLatestRate`: seta `loading`/`error` globais
- `fetchHistoricalData`: **só** seta `historicalLoading`/`historicalData`; catch → `console.warn` + `setHistoricalData([])`; **nunca** toca em `error`/`loading`

### Retorno (API do Hook)

```js
{
  // Estado
  baseCurrency, setBaseCurrency,
  targetCurrency, setTargetCurrency,
  amount, setAmount,
  currencies,
  exchangeRate: rate,      // alias
  date: rateDate,          // alias
  historicalData,
  selectedPeriod,          // = period
  setPeriod: setSelectedPeriod, // alias para HistoricalChart
  loading,
  historicalLoading,
  error,
  convertedAmount,         // derivado: amount * rate
  // Ações
  swapCurrencies,
  updateAmount: setAmount,  // aliases legados
  updateBaseCurrency: setBaseCurrency,
  updateTargetCurrency: setTargetCurrency,
  refetch: fetchLatestRate,
}
```

---

## 5. currencyService.js (Camada de API)

### Configuração
```js
const PRIMARY_BASE_URL = 'https://api.frankfurter.dev/v1';
const FALLBACK_BASE_URL = 'https://api.frankfurter.app';
let currentBaseUrl = PRIMARY_BASE_URL;
```

### Funções Exportadas

| Função | Parâmetros | Retorno | Comportamento Especial |
|--------|------------|---------|------------------------|
| `getCurrencies()` | — | `{ [code]: name }` | — |
| `getLatestRates(base, symbols)` | strings | `{ base, date, rates }` | Se `base === symbols` → mock 1:1 instantâneo |
| `getHistoricalRates(start, end, base, symbols)` | strings (YYYY-MM-DD) | `{ base, startDate, endDate, rates }` | Se `base === symbols` → mock dia-a-dia taxa=1 |

### Helpers Internos

- `fetchJson(url, isFallbackAttempt)` — try/catch + fallback automático + logs estruturados
- `buildUrl(endpoint, params)` — `URLSearchParams` ignora valores vazios
- `generateMockHistory(start, end, base, symbols)` — array dia-a-dia com taxa=1

### Validações
- `symbols` obrigatório em `getLatestRates`/`getHistoricalRates` (throw se vazio)
- `startDate`/`endDate` obrigatórios em histórico (throw se ausentes)

### Logs de Erro (console.error)
```js
{
  url,                    // URL exata que falhou
  baseUrl,                // base URL atual (primária/fallback)
  isFallbackAttempt,      // boolean
  error: error.message,   // mensagem
  stack: error.stack      // stack trace
}
```

---

## 6. csvExporter.js (Utilitário)

### `exportToCSV(data, baseCurrency, targetCurrency)`

**Parâmetros**
- `data`: array filtrado `[{ date, rate }, ...]`
- `baseCurrency`: string (ex: `'USD'`)
- `targetCurrency`: string (ex: `'BRL'`)

**Validação**
```js
if (!data || data.length === 0) {
  console.warn('exportToCSV: Nenhum dado para exportar');
  return false;
}
```

**CSV Gerado**
```
"Data","Moeda Origem","Moeda Destino","Cotação"
"14/10/2026","USD","BRL","5,1234"
"13/10/2026","USD","BRL","5,1156"
```

**Download**
- Blob `text/csv;charset=utf-8`
- Nome: `cotacao_${baseCurrency}_${targetCurrency}_${today}.csv`
- `URL.createObjectURL` + `<a download>` click programático + `revokeObjectURL`

**Retorno**: `true` se sucesso, `false` se vazio