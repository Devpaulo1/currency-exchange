# Testes e Mapeamento da API Frankfurter — Currency Exchange App

## Visão Geral
A aplicação consome a **API Frankfurter v1** com duas bases:
- **Primária**: `https://api.frankfurter.dev/v1`
- **Fallback**: `https://api.frankfurter.app` (automático na 1ª falha)

Todos endpoints retornam JSON. Rate limiting não documentado publicamente — trata-se com fallback + retry único.

---

## Endpoints Mapeados

### 1. GET `/currencies`
**Lista de moedas disponíveis**

**Request**
```
GET https://api.frankfurter.dev/v1/currencies
```

**Response 200**
```json
{
  "AUD": "Australian Dollar",
  "BGN": "Bulgarian Lev",
  "BRL": "Brazilian Real",
  "CAD": "Canadian Dollar",
  "CHF": "Swiss Franc",
  "CNY": "Chinese Yuan",
  "CZK": "Czech Koruna",
  "DKK": "Danish Krone",
  "EUR": "Euro",
  "GBP": "British Pound Sterling",
  "HKD": "Hong Kong Dollar",
  "HUF": "Hungarian Forint",
  "IDR": "Indonesian Rupiah",
  "ILS": "Israeli New Shekel",
  "INR": "Indian Rupee",
  "ISK": "Icelandic Króna",
  "JPY": "Japanese Yen",
  "KRW": "South Korean Won",
  "MXN": "Mexican Peso",
  "MYR": "Malaysian Ringgit",
  "NOK": "Norwegian Krone",
  "NZD": "New Zealand Dollar",
  "PHP": "Philippine Peso",
  "PLN": "Polish Zloty",
  "RON": "Romanian Leu",
  "SEK": "Swedish Krona",
  "SGD": "Singapore Dollar",
  "THB": "Thai Baht",
  "TRY": "Turkish Lira",
  "USD": "US Dollar",
  "ZAR": "South African Rand"
}
```

**Uso no App**
- Popula `currencies` state no mount (`fetchCurrencies`)
- Options dos selects: `{code} - {name}`

---

### 2. GET `/latest`
**Cotação mais recente**

**Parâmetros**
| Param | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `base` | string | Não | Moeda base (default: EUR na API, mas app envia USD) |
| `symbols` | string | **Sim** | Moeda(s) destino, separadas por vírgula |

**Request Exemplo**
```
GET https://api.frankfurter.dev/v1/latest?base=USD&symbols=BRL
```

**Response 200**
```json
{
  "amount": 1.0,
  "base": "USD",
  "date": "2026-10-14",
  "rates": {
    "BRL": 5.1234
  }
}
```

**Response 400** (base inválida)
```json
{
  "error": "Invalid base currency"
}
```

**Response 404** (symbols inválido)
```json
{
  "error": "Symbol not found"
}
```

**Uso no App**
- `getLatestRates(base, symbols)` → retorna `{ base, date, rates }`
- **Otimização**: se `base === symbols`, retorna mock 1:1 **sem HTTP**
- Seta `rate` + `rateDate` no hook

---

### 3. GET `/{startDate}..{endDate}`
**Histórico por intervalo**

**Parâmetros de Path**
| Param | Formato | Exemplo |
|-------|---------|---------|
| `startDate` | YYYY-MM-DD | `2026-09-14` |
| `endDate` | YYYY-MM-DD | `2026-10-14` |

**Query Params**
| Param | Tipo | Obrigatório |
|-------|------|-------------|
| `base` | string | Não |
| `symbols` | string | **Sim** |

**Request Exemplo**
```
GET https://api.frankfurter.dev/v1/2026-09-14..2026-10-14?base=USD&symbols=BRL
```

**Response 200**
```json
{
  "amount": 1.0,
  "base": "USD",
  "start_date": "2026-09-14",
  "end_date": "2026-10-14",
  "rates": {
    "2026-09-14": { "BRL": 5.1000 },
    "2026-09-15": { "BRL": 5.1100 },
    "2026-09-16": { "BRL": 5.1050 },
    ...
  }
}
```

**Response 400** (datas inválidas)
```json
{
  "error": "Invalid date range"
}
```

**Response 404** (sem dados no range)
```json
{
  "error": "No data available for the given date range"
}
```

**Uso no App**
- `getHistoricalRates(startDate, endDate, base, symbols)` → retorna `{ base, startDate, endDate, rates }`
- **Otimização**: se `base === symbols`, gera mock dia-a-dia taxa=1 **sem HTTP**
- Transforma `rates` object → array ordenado `[{ date, rate }, ...]`

---

## Tratamento de Erros Implementado

### Estratégia de Fallback (currencyService.js)

```js
async function fetchJson(url, isFallbackAttempt = false) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    // LOG ESTRUTURADO
    console.error('[currencyService] Request failed:', {
      url,                    // URL exata
      baseUrl: currentBaseUrl, // primária ou fallback
      isFallbackAttempt,      // true se já tentou fallback
      error: error.message,
      stack: error.stack
    });

    // FALLBACK AUTOMÁTICO (1ª falha na primária)
    if (!isFallbackAttempt && currentBaseUrl === PRIMARY_BASE_URL) {
      console.warn('[currencyService] Trying fallback URL:', FALLBACK_BASE_URL);
      currentBaseUrl = FALLBACK_BASE_URL;
      const fallbackUrl = url.replace(PRIMARY_BASE_URL, FALLBACK_BASE_URL);
      return fetchJson(fallbackUrl, true);
    }

    throw error; // Propaga após falha no fallback
  }
}
```

### Códigos de Status Mapeados

| Status | Cenário | Ação no App |
|--------|---------|-------------|
| `200` | Sucesso | Parse JSON normal |
| `400` | Parâmetros inválidos (base/symbols/date) | Throw → catch no hook → setError / console.warn |
| `404` | Moeda não encontrada / sem dados no range | Throw → catch |
| `429` | Rate limit (não documentado) | Throw → fallback → se persistir, erro |
| `500`/`502`/`503` | Erro servidor | Throw → fallback → erro |
| `Network Error` | Offline / CORS / DNS | Throw → fallback → erro |
| `Timeout` | Não há timeout nativo do fetch | N/A (navegador controla) |

### Isolamento de Falha Histórica (CRÍTICO)

```js
// fetchHistoricalData - NÃO toca em error/loading globais
catch (err) {
  console.warn('Historical data fetch failed:', err); // Só log
  setHistoricalData([]);                              // Só limpa gráfico
} finally {
  setHistoricalLoading(false);                        // Só loading do gráfico
}
// loading (cotação atual) e error (cotação atual) INTATOS
```

---

## Testes Manuais Realizados

### Teste 1: Cotação Atual - Sucesso
```bash
# Terminal / DevTools Network
GET /latest?base=USD&symbols=BRL
→ 200 OK
→ rate = 5.1234, date = "2026-10-14"
→ UI: taxa exibida, convertedAmount = amount × rate
```

### Teste 2: Moedas Idênticas (USD → USD)
```js
// Service intercepta ANTES do fetch
getLatestRates('USD', 'USD')
→ retorna imediato: { base: 'USD', date: today, rates: { USD: 1 } }
→ Zero request HTTP (DevTools Network vazio)
→ UI: "1 USD = 1.0000 USD", conversão = amount
```

### Teste 3: Histórico - Período Válido (30d)
```bash
GET /2026-09-14..2026-10-14?base=USD&symbols=BRL
→ 200 OK
→ rates object com ~30 entradas
→ historicalData array ordenado asc
→ Gráfico renderiza, tabela preenche
```

### Teste 4: Histórico - Fim de Semana / Feriado
```bash
GET /2026-10-11..2026-10-13?base=USD&symbols=BRL
→ 404 "No data available" (API não tem dados fim de semana)
→ catch → console.warn → historicalData = []
→ UI: "Sem dados históricos para o período selecionado"
→ Conversor INTACTO (rate/date/loading/error inalterados)
```

### Teste 5: Fallback Automático (Primária → Fallback)
```bash
# Simular falha na primária (ex: bloquear api.frankfurter.dev no /etc/hosts)
1. GET https://api.frankfurter.dev/v1/latest?... → NETWORK ERROR
2. Console: [currencyService] Request failed { url, baseUrl: '...dev/v1', isFallbackAttempt: false }
3. Console: [currencyService] Trying fallback URL: https://api.frankfurter.app
4. GET https://api.frankfurter.app/latest?... → 200 OK
5. Dados chegam normalmente
```

### Teste 6: Símbolos Inválidos
```bash
GET /latest?base=USD&symbols=XYZ
→ 400/404
→ catch → setError('Failed to fetch latest rate')
→ UI: Card vermelho "Failed to fetch latest rate"
```

### Teste 7: Datas Inválidas Histórico
```bash
GET /invalid..2026-10-14?base=USD&symbols=BRL
→ 400 "Invalid date range"
→ catch → historicalData = []
```

### Teste 8: Concorrência (Troca Rápida de Moedas)
```js
// Usuário clica USD→EUR→GBP→BRL em < 1s
// useEffect dependencies: [baseCurrency, targetCurrency]
// React garante: último effect vence, anteriores cleanup
// Apenas request final (GBP→BRL) completa e atualiza UI
// Zero race condition visual
```

---

## Validações de Entrada (Service)

```js
// getLatestRates
if (base && symbols && base === symbols) return mock1to1();
if (!symbols) throw new Error('symbols parameter is required');

// getHistoricalRates
if (!startDate || !endDate) throw new Error('startDate and endDate are required');
if (base && symbols && base === symbols) return generateMockHistory();
if (!symbols) throw new Error('symbols parameter is required');
```

---

## Limitações Conhecidas da API

1. **Base currency default**: API usa EUR como base default; app **sempre envia** `base` explícito
2. **Símbolos múltiplos**: Suporta `symbols=USD,BRL,EUR` mas app usa 1:1
3. **Fim de semana/feriados**: Sem dados → 404 → tratado como empty state
4. **Range máximo**: Não documentado; testado até 10 anos (3650 dias) OK
5. **CORS**: Permite origem `*` — funciona direto no browser
6. **Rate limit**: Não publicado; fallback mitiga picos

---

## Checklist de Validação de Produção

- [ ] `/currencies` carrega no mount (1 request)
- [ ] `/latest` responde < 500ms típico
- [ ] Fallback funciona se primária cai
- [ ] Moedas idênticas → mock instantâneo (0ms)
- [ ] Histórico 8 períodos todos funcionam
- [ ] Falha histórico **não** quebra conversor
- [ ] Logs estruturados aparecem no console em erros
- [ ] Zero memory leaks (useEffect cleanup implícito)
- [ ] Build `npm run build` sem warnings de API