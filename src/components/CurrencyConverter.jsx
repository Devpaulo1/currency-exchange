import { useEffect, useRef } from 'react';
import { ArrowLeftRight, Loader2 } from 'lucide-react';

export function CurrencyConverter({
  amount,
  setAmount,
  baseCurrency,
  setBaseCurrency,
  targetCurrency,
  setTargetCurrency,
  currencies,
  exchangeRate,
  date,
  loading,
  error,
  swapCurrencies,
  convertedAmount,
}) {
  const amountRef = useRef(null);
  const swapRef = useRef(null);

  useEffect(() => {
    amountRef.current?.focus({ preventScroll: true });
  }, []);

  const handleSwap = () => {
    swapRef.current?.classList.add('rotate-180');
    setTimeout(() => {
      swapRef.current?.classList.remove('rotate-180');
    }, 300);
    swapCurrencies();
  };

  const formatRate = (rateValue) => {
    if (!rateValue) return '—';
    return rateValue.toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 6,
    });
  };

  const formatAmount = (value) => {
    if (!value) return '0.00';
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="space-y-4">
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700">
            Valor a converter
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
              {baseCurrency}
            </span>
            <input
              ref={amountRef}
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-4 py-3.5 text-2xl font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all placeholder:text-slate-400"
              placeholder="0.00"
              aria-label="Valor a converter"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1">
            <label htmlFor="baseCurrency" className="block text-sm font-medium text-slate-700 mb-1.5">
              Moeda de origem
            </label>
            <select
              id="baseCurrency"
              value={baseCurrency}
              onChange={(e) => setBaseCurrency(e.target.value)}
              className="w-full px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>

          <button
            ref={swapRef}
            type="button"
            onClick={handleSwap}
            disabled={loading}
            className="flex-shrink-0 p-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label="Inverter moedas"
            title="Inverter moedas"
          >
            <ArrowLeftRight className="w-5 h-5 transition-transform duration-300" />
          </button>

          <div className="flex-1">
            <label htmlFor="targetCurrency" className="block text-sm font-medium text-slate-700 mb-1.5">
              Moeda de destino
            </label>
            <select
              id="targetCurrency"
              value={targetCurrency}
              onChange={(e) => setTargetCurrency(e.target.value)}
              className="w-full px-4 py-3 text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all appearance-none cursor-pointer"
            >
              {Object.entries(currencies).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-slate-500 text-sm">Taxa de câmbio</span>
            <span className="font-mono text-lg font-semibold text-slate-900">
              1 {baseCurrency} = {formatRate(exchangeRate)} {targetCurrency}
            </span>
          </div>
          {date && (
            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Cotação de</span>
              <time dateTime={date} className="font-mono">
                {new Date(date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </time>
            </div>
          )}
        </div>

        {convertedAmount && (
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="text-center space-y-1">
              <p className="text-slate-500 text-sm uppercase tracking-wider">
                Resultado da conversão
              </p>
              <p className="text-3xl font-bold text-slate-900 tabular-nums">
                {formatAmount(convertedAmount)} {targetCurrency}
              </p>
              <p className="text-slate-400 text-sm">
                {formatAmount(amount)} {baseCurrency} × {formatRate(exchangeRate)}
              </p>
            </div>
          </div>
        )}

        {!exchangeRate && !loading && !error && (
          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-slate-500">
            <p className="text-sm">Selecione as moedas para ver a conversão</p>
          </div>
        )}

        {loading && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Atualizando cotação...</span>
          </div>
        )}
      </div>
    </div>
  );
}