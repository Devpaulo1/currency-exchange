import { useEffect, useMemo, useState } from 'react';
import { Star, X } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { getFlagUrl, hasFlag } from '../utils/currencyFlags';
import { getRatesForSymbols, getHistoricalRatesRange } from '../services/currencyService';

function getPreviousBusinessDate(daysBack = 1) {
  const d = new Date();
  d.setDate(d.getDate() - daysBack);
  return d.toISOString().split('T')[0];
}

export function FavoriteCard({ code, baseCurrency, onRemove }) {
  const [currentRate, setCurrentRate] = useState(null);
  const [previousRate, setPreviousRate] = useState(null);
  const [sparklineData, setSparklineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const flagUrl = hasFlag(code) ? getFlagUrl(code) : null;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const today = new Date();
        const endDate = today.toISOString().split('T')[0];
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 35);
        const startStr = startDate.toISOString().split('T')[0];

        const [latest, history] = await Promise.allSettled([
          getRatesForSymbols(baseCurrency, [code]),
          getHistoricalRatesRange(startStr, endDate, baseCurrency, code),
        ]);

        if (cancelled) return;

        if (latest.status === 'fulfilled') {
          setCurrentRate(latest.value?.rates?.[code] ?? null);
        } else {
          setError(true);
        }

        if (history.status === 'fulfilled') {
          const rates = history.value?.rates || {};
          const entries = Object.entries(rates)
            .map(([date, values]) => ({ date, value: values?.[code] }))
            .filter((item) => typeof item.value === 'number')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
          setSparklineData(entries.slice(-30));
          if (entries.length >= 2) {
            setPreviousRate(entries[entries.length - 2].value);
          } else if (entries.length === 1) {
            setPreviousRate(entries[0].value);
          }
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [code, baseCurrency]);

  const change = useMemo(() => {
    if (typeof currentRate !== 'number' || typeof previousRate !== 'number' || previousRate === 0) return null;
    const diff = ((currentRate - previousRate) / previousRate) * 100;
    return diff;
  }, [currentRate, previousRate]);

  const isPositive = typeof change === 'number' && change >= 0;
  const isNegative = typeof change === 'number' && change < 0;
  const stroke = isPositive ? '#10b981' : isNegative ? '#f87171' : '#94a3b8';
  const fill = isPositive ? 'rgba(16, 185, 129, 0.15)' : isNegative ? 'rgba(248, 113, 113, 0.15)' : 'rgba(148, 163, 184, 0.12)';

  const formatRate = (rate) => {
    if (typeof rate !== 'number') return '—';
    return rate.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  };

  const formatPct = (pct) => {
    if (typeof pct !== 'number') return '—';
    const sign = pct >= 0 ? '+' : '';
    return `${sign}${pct.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="relative flex-shrink-0 w-[280px] sm:w-[300px] rounded-2xl border border-slate-700/60 bg-slate-900/60 backdrop-blur-md p-4 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-4 rounded bg-slate-700/60 animate-pulse" />
          <div className="h-4 w-24 bg-slate-700/60 rounded animate-pulse" />
          <div className="ml-auto h-4 w-12 bg-slate-700/60 rounded animate-pulse" />
        </div>
        <div className="h-8 w-28 bg-slate-700/60 rounded animate-pulse mb-2" />
        <div className="h-4 w-16 bg-slate-700/60 rounded animate-pulse mb-4" />
        <div className="h-12 w-full bg-slate-800/60 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="group relative flex-shrink-0 w-[280px] sm:w-[300px] rounded-2xl border border-slate-700/60 bg-slate-900/70 backdrop-blur-md p-4 overflow-hidden transition-all duration-300 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
      <button
        type="button"
        onClick={() => onRemove(code)}
        className="absolute top-2 right-2 p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Remover moeda favorita"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-2 mb-2">
        {flagUrl ? (
          <img src={flagUrl} alt={code} className="w-6 h-4 rounded ring-1 ring-slate-700/60" loading="lazy" />
        ) : (
          <div className="w-6 h-4 rounded bg-slate-700/60" />
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-100 leading-tight">{code}</p>
        </div>
        <span className="ml-auto text-xs text-slate-500">{baseCurrency}</span>
      </div>
      <div className="flex items-end justify-between mb-1">
        <p className="text-2xl font-semibold tabular-nums text-slate-100">{formatRate(currentRate)}</p>
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-emerald-400' : isNegative ? 'text-rose-400' : 'text-slate-400'}`}>
          <span>{formatPct(change)}</span>
          {isPositive && <span>▲</span>}
          {isNegative && <span>▼</span>}
        </div>
      </div>
      {error && !currentRate && (
        <p className="text-xs text-amber-400/80 mb-2">Sem dados disponíveis</p>
      )}
      <div className="h-12 -mx-1">
        {sparklineData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id={`spark-${code}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={fill} />
                  <stop offset="100%" stopColor="rgba(15, 23, 42, 0)" />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={stroke} strokeWidth={1.6} fill={`url(#spark-${code})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-xs text-slate-600">Sem histórico suficiente</div>
        )}
      </div>
    </div>
  );
}
