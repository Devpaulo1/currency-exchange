# Testes Funcionais — Currency Exchange App

## Visão Geral
Documentação dos testes funcionais automatizados e manuais para validar a lógica do hook `useCurrency`, componentes e integrações.

---

## 1. Testes do Hook `useCurrency`

### 1.1 Estado Inicial
```javascript
// Teste: Defaults iniciais
expect(baseCurrency).toBe('AUD');
expect(targetCurrency).toBe('AUD');
expect(amount).toBe('1');
expect(currencies).toEqual({});
expect(rate).toBeNull();
expect(loading).toBe(false);
expect(historicalLoading).toBe(false);
expect(error).toBeNull();
expect(apiStatus).toBe('idle');
```

### 1.2 Carregamento de Moedas (`fetchCurrencies`)
```javascript
// Teste: Carrega moedas no mount
await act(async () => { renderHook(() => useCurrency()) });
expect(fetchCurrencies).toHaveBeenCalledTimes(1);

// Teste: Sucesso - popula currencies
const mockCurrencies = { USD: 'US Dollar', BRL: 'Real Brasileiro', EUR: 'Euro' };
mockGetCurrencies.mockResolvedValue(mockCurrencies);
await act(async () => { result.current.refetch() });
expect(result.current.currencies).toEqual(mockCurrencies);

// Teste: Erro - seta error state
mockGetCurrencies.mockRejectedValue(new Error('Network error'));
await act(async () => { result.current.refetch() });
expect(result.current.error).toBe('Failed to load currencies');
```

### 1.3 Cotação Atual (`fetchLatestRate`)
```javascript
// Teste: Busca taxa ao alterar moedas
mockGetLatestRates.mockResolvedValue({ base: 'AUD', date: '2026-01-15', rates: { BRL: 3.45 } });
act(() => { result.current.setBaseCurrency('AUD'); result.current.setTargetCurrency('BRL'); });
await waitFor(() => expect(result.current.loading).toBe(false));
expect(result.current.exchangeRate).toBe(3.45);
expect(result.current.date).toBe('2026-01-15');
expect(result.current.apiStatus).toBe('success');

// Teste: Moedas idênticas - mock 1:1 sem HTTP
act(() => { result.current.setBaseCurrency('USD'); result.current.setTargetCurrency('USD'); });
expect(result.current.exchangeRate).toBe(1);
expect(result.current.date).toBeDefined(); // today
expect(mockGetLatestRates).not.toHaveBeenCalled();

// Teste: Erro na API - seta error + apiStatus error
mockGetLatestRates.mockRejectedValue(new Error('404'));
act(() => { result.current.setBaseCurrency('USD'); result.current.setTargetCurrency('XYZ'); });
await waitFor(() => expect(result.current.loading).toBe(false));
expect(result.current.error).toBe('Failed to fetch latest rate');
expect(result.current.apiStatus).toBe('error');
expect(result.current.exchangeRate).toBeNull();
```

### 1.4 Histórico (`fetchHistoricalData`)
```javascript
// Teste: Busca histórico ao alterar período
mockGetHistoricalRates.mockResolvedValue({
  base: 'AUD',
  start_date: '2026-01-01',
  end_date: '2026-01-15',
  rates: { '2026-01-01': { BRL: 3.40 }, '2026-01-02': { BRL: 3.42 } }
});
act(() => { result.current.setPeriod('15d'); });
await waitFor(() => expect(result.current.historicalLoading).toBe(false));
expect(result.current.historicalData).toEqual([
  { date: '2026-01-01', rate: 3.40 },
  { date: '2026-01-02', rate: 3.42 }
]);

// Teste: Erro no histórico NÃO afeta cotação atual
mockGetHistoricalRates.mockRejectedValue(new Error('404'));
act(() => { result.current.setPeriod('1y'); });
await waitFor(() => expect(result.current.historicalLoading).toBe(false));
expect(result.current.historicalData).toEqual([]);
expect(result.current.loading).toBe(false); // INTATO
expect(result.current.error).toBeNull();    // INTATO
expect(result.current.exchangeRate).toBe(3.45); // INTATO
```

### 1.5 Swap de Moedas
```javascript
// Teste: Inverte moedas e dispara nova busca
mockGetLatestRates.mockResolvedValue({ base: 'BRL', date: '2026-01-15', rates: { AUD: 0.29 } });
act(() => { result.current.swapCurrencies(); });
expect(result.current.baseCurrency).toBe('BRL');
expect(result.current.targetCurrency).toBe('AUD');
await waitFor(() => expect(result.current.exchangeRate).toBe(0.29));
```

### 1.6 Conversão Calculada
```javascript
// Teste: convertedAmount = amount × rate
act(() => { result.current.setAmount('100'); });
expect(result.current.convertedAmount).toBe('345.0000'); // 100 × 3.45

// Teste: Sem taxa retorna null
result.current.setRate(null);
expect(result.current.convertedAmount).toBeNull();
```

---

## 2. Testes de Integração API (`currencyService`)

### 2.1 `getCurrencies`
- ✅ Retorna objeto `{ code: name }`
- ✅ Fallback automático em falha
- ✅ Logs estruturados no console

### 2.2 `getLatestRates(base, symbols)`
- ✅ Retorna `{ base, date, rates }`
- ✅ Mock 1:1 se `base === symbols` (zero HTTP)
- ✅ Validação: `symbols` obrigatório
- ✅ Fallback automático + logs

### 2.3 `getHistoricalRates(start, end, base, symbols)`
- ✅ Retorna `{ base, startDate, endDate, rates }`
- ✅ Mock dia-a-dia taxa=1 se `base === symbols`
- ✅ Validação: `startDate`, `endDate`, `symbols` obrigatórios
- ✅ Formato data: `YYYY-MM-DD`

---

## 3. Testes de Componentes

### 3.1 CurrencyConverter
```javascript
// Teste: Renderiza selects com moedas carregadas
render(<CurrencyConverter {...mockProps} />);
expect(screen.getByLabelText('De')).toBeInTheDocument();
expect(screen.getByLabelText('Para')).toBeInTheDocument();

// Teste: Input valor atualiza estado
fireEvent.change(screen.getByLabelText('Valor a Converter'), { target: { value: '50' } });
expect(mockSetAmount).toHaveBeenCalledWith('50');

// Teste: Troca moeda origem atualiza select
fireEvent.change(screen.getByLabelText('De'), { target: { value: 'USD' } });
expect(mockSetBaseCurrency).toHaveBeenCalledWith('USD');

// Teste: Botão swap chama swapCurrencies
fireEvent.click(screen.getByLabelText('Inverter moedas'));
expect(mockSwapCurrencies).toHaveBeenCalled();

// Teste: Exibe taxa quando disponível
expect(screen.getByText('1 AUD = 3.45 BRL')).toBeInTheDocument();

// Teste: Exibe resultado convertido
expect(screen.getByText('345,00')).toBeInTheDocument();

// Teste: Loading state mostra spinner
mockProps.loading = true;
rerender(<CurrencyConverter {...mockProps} />);
expect(screen.getByText('Atualizando...')).toBeInTheDocument();

// Teste: Error state mostra card vermelho
mockProps.error = 'Failed to fetch';
rerender(<CurrencyConverter {...mockProps} />);
expect(screen.getByText('Falha ao carregar taxas')).toBeInTheDocument();
```

### 3.2 HistoricalChart
```javascript
// Teste: Renderiza 8 botões de período
render(<HistoricalChart {...mockProps} />);
PERIOD_OPTIONS.forEach(opt => {
  expect(screen.getByRole('tab', { name: opt.label })).toBeInTheDocument();
});

// Teste: Botão ativo tem estilo diferenciado
fireEvent.click(screen.getByRole('tab', { name: '30d' }));
expect(screen.getByRole('tab', { name: '30d' })).toHaveClass('bg-emerald-100');

// Teste: Tooltip mostra data + taxa + bandeiras
// (testado via interação mouseenter no ResponsiveContainer)

// Teste: Loading overlay
mockProps.historicalLoading = true;
rerender(<HistoricalChart {...mockProps} />);
expect(screen.getByRole('status')).toBeInTheDocument();
```

### 3.3 HistoricalTable
```javascript
// Teste: Cabeçalhos corretos
expect(screen.getByText('Data')).toBeInTheDocument();
expect(screen.getByText('Par')).toBeInTheDocument();
expect(screen.getByText('Cotação')).toBeInTheDocument();
expect(screen.getByText('Variação')).toBeInTheDocument();

// Teste: Ordenação clicável
fireEvent.click(screen.getByText('Data'));
expect(mockSortConfig).toEqual({ key: 'date', direction: 'asc' });
fireEvent.click(screen.getByText('Data'));
expect(mockSortConfig).toEqual({ key: 'date', direction: 'desc' });

// Teste: Filtros expandem/colapsam
fireEvent.click(screen.getByText('Filtros'));
expect(screen.getByLabelText('Data Inicial')).toBeInTheDocument();

// Teste: Filtro por data funciona
fireEvent.change(screen.getByLabelText('Data Inicial'), { target: { value: '2026-01-10' } });
expect(filteredData.every(d => new Date(d.date) >= new Date('2026-01-10'))).toBe(true);

// Teste: Export CSV
fireEvent.click(screen.getByText('Exportar CSV'));
expect(mockExportToCSV).toHaveBeenCalledWith(filteredData, 'AUD', 'BRL');
```

### 3.4 Language Selector
```javascript
// Teste: Dropdown abre/clica
fireEvent.click(screen.getByText('PT'));
expect(screen.getByRole('menu')).toBeVisible();

// Teste: Troca idioma
fireEvent.click(screen.getByRole('menuitem', { name: 'EN' }));
expect(mockSetLanguage).toHaveBeenCalledWith('en');

// Teste: Persiste no localStorage
expect(localStorage.getItem('language')).toBe('en');

// Teste: Textos atualizam instantaneamente
expect(screen.getByText('From')).toBeInTheDocument();
expect(screen.getByText('To')).toBeInTheDocument();
```

---

## 4. Testes de Estados Visuais

| Componente | Loading | Error | Empty | Success |
|------------|---------|-------|-------|---------|
| CurrencyConverter | ✅ Spinner + "Atualizando..." | ✅ Card vermelho | ✅ "Selecione moedas" | ✅ Taxa + resultado |
| HistoricalChart | ✅ Overlay spinner | ❌ (isolado) | ✅ "Sem dados..." | ✅ Gráfico + tooltip |
| HistoricalTable | ❌ Botão export disabled | ❌ (isolado) | ✅ "Sem dados..." | ✅ Tabela + filtros |

---

## 5. Testes de Acessibilidade (a11y)

- ✅ `htmlFor` / `id` em labels ↔ inputs
- ✅ `aria-label` em botões icon-only
- ✅ `role="tab"`, `aria-selected` no seletor de período
- ✅ `aria-label` no swap, no seletor de idioma e no export
- ✅ `focus:ring-2 focus:ring-emerald-500` visível
- ✅ `tabular-nums` em números
- ✅ Contraste WCAG AA

---

## 6. Comandos de Teste

```bash
# Unit tests (Vitest/Jest)
npm run test

# E2E (Playwright/Cypress)
npm run test:e2e

# Coverage
npm run test:coverage

# Lint + Typecheck
npm run lint
npm run typecheck
```

---

## 7. Checklist de Validação Pré-Deploy

- [ ] Todos os testes unitários passam
- [ ] Testes de integração API passam
- [ ] Testes E2E críticos passam
- [ ] Cobertura > 80%
- [ ] Zero erros de lint/typecheck
- [ ] Build `npm run build` sem warnings críticos
- [ ] Estados Loading/Error/Empty/Success validados manualmente
- [ ] Dark/Light mode funcionando
- [ ] PT/EN/ES trocando corretamente
- [ ] Export CSV baixando arquivo correto