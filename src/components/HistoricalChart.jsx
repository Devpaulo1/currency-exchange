import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Loader2 } from 'lucide-react';
import { getFlagUrl, hasFlag } from '../utils/currencyFlags';

const PERIOD_OPTIONS = [
  { value: '7d', label: '7d' },
  { value: '15d', label: '15d' },
  { value: '30d', label: '30d' },
  { value: '3m', label: '3m' },
  { value: '6m', label: '6m' },
  { value: '1y', label: '1a' },
  { value: '5y', label: '5a' },
  { value: '10y', label: '10a' },
];

function formatXAxisTick(value) {
  const date = new Date(value);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function formatYAxisTick(value) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const data = payload[0].value;
  const date = new Date(label);

  const baseFlag = hasFlag(payload[0].dataKey?.split('.')[0] || 'USD') 
    ? getFlagUrl(payload[0].dataKey?.split('.')[0] || 'USD') 
    : null;
  const targetFlag = hasFlag(payload[0].dataKey?.split('.')[1] || 'BRL') 
    ? getFlagUrl(payload[0].dataKey?.split('.')[1] || 'BRL') 
    : null;

  return (
    <div className="relative bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 rounded-xl p-3 shadow-2xl shadow-emerald-500/10 min-w-[200px] z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 rounded-xl" />
      <p className="relative text-xs text-slate-400 font-medium mb-2">
        {date.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </p>
      <div className="relative flex items-center gap-2 mb-1">
        {baseFlag && <img src={baseFlag} alt="" className="w-5 h-3 rounded ring-1 ring-slate-700" loading="lazy" />}
        <span className="text-slate-300 text-xs">→</span>
        {targetFlag && <img src={targetFlag} alt="" className="w-5 h-3 rounded ring-1 ring-slate-700" loading="lazy" />}
      </div>
      <p className="relative font-mono text-lg font-semibold text-emerald-400">
        {data.toLocaleString(undefined, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 6,
        })}
      </p>
    </div>
  );
}

const THEME_COLORS = {
  light: {
    stroke: '#10b981',
    gradientStart: 'rgba(16, 185, 129, 0.2)',
    gradientEnd: 'rgba(16, 185, 129, 0)',
    gridStroke: 'rgba(148, 163, 184, 0.2)',
    axisTick: '#64748b',
    axisLine: 'rgba(148, 163, 184, 0.3)',
    tooltipBg: 'rgba(15, 23, 42, 0.9)',
    tooltipBorder: 'rgba(16, 185, 129, 0.3)',
    loadingBg: 'rgba(248, 250, 252, 0.8)',
    loadingColor: '#64748b',
    emptyColor: '#94a3b8',
  },
  dark: {
    stroke: '#10b981',
    gradientStart: 'rgba(16, 185, 129, 0.25)',
    gradientEnd: 'rgba(16, 185, 129, 0)',
    gridStroke: 'rgba(51, 65, 85, 0.5)',
    axisTick: '#9ca3af',
    axisLine: 'rgba(55, 65, 81, 0.5)',
    tooltipBg: 'rgba(17, 24, 39, 0.95)',
    tooltipBorder: 'rgba(16, 185, 129, 0.4)',
    loadingBg: 'rgba(6, 9, 19, 0.8)',
    loadingColor: '#9ca3af',
    emptyColor: '#6b7280',
  },
};

export function HistoricalChart({
  historicalData,
  baseCurrency,
  targetCurrency,
  period,
  setPeriod,
  historicalLoading,
}) {
  const colors = THEME_COLORS.dark;

  const baseFlagUrl = hasFlag(baseCurrency) ? getFlagUrl(baseCurrency) : null;
  const targetFlagUrl = hasFlag(targetCurrency) ? getFlagUrl(targetCurrency) : null;

  const chartData = useMemo(() => {
    if (!historicalData?.length) return [];
    return historicalData.map((item) => ({
      date: item.date,
      rate: item.rate,
      formattedDate: new Date(item.date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      }),
    }));
  }, [historicalData]);

  const hasData = chartData.length > 0;
  const minRate = hasData ? Math.min(...chartData.map((d) => d.rate)) : 0;
  const maxRate = hasData ? Math.max(...chartData.map((d) => d.rate)) : 1;
  const padding = (maxRate - minRate) * 0.1 || 0.001;

  const gradientId = `areaGradient-dark`;

  return (
    <section
      aria-labelledby="chart-title"
      className="relative bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-emerald-500/5 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      
      <h2 id="chart-title" className="sr-only">
        Gráfico histórico {baseCurrency} → {targetCurrency}
      </h2>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <span className="text-emerald-400 font-mono text-sm">{baseCurrency}/{targetCurrency}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              {baseFlagUrl && <img src={baseFlagUrl} alt="" className="w-5 h-3 rounded" loading="lazy" />}
              <span>→</span>
              {targetFlagUrl && <img src={targetFlagUrl} alt="" className="w-5 h-3 rounded" loading="lazy" />}
              Histórico
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Variação nos últimos {PERIOD_OPTIONS.find((p) => p.value === period)?.label || period}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-1" role="tablist">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={period === opt.value}
              onClick={() => setPeriod(opt.value)}
              disabled={historicalLoading}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                period === opt.value
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 h-72" style={{ minHeight: '288px' }}>
        {historicalLoading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: colors.loadingBg }}>
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: colors.loadingColor }}
            />
          </div>
        )}

        {!hasData && !historicalLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm" style={{ color: colors.emptyColor }}>
              Sem dados históricos para o período selecionado
            </p>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.gradientStart} />
                <stop offset="100%" stopColor={colors.gradientEnd} />
              </linearGradient>
              {/* Neon glow filter */}
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke={colors.gridStroke}
              vertical={false}
              horizontal={true}
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisTick}
              tick={{
                fill: colors.axisTick,
                fontSize: 11,
                fontFamily: 'monospace',
              }}
              axisLine={{ stroke: colors.axisLine }}
              tickLine={false}
              interval="preserveStartEnd"
            />

            <YAxis
              tickFormatter={formatYAxisTick}
              tick={{
                fill: colors.axisTick,
                fontSize: 11,
                fontFamily: 'monospace',
              }}
              axisLine={false}
              tickLine={false}
              domain={[minRate - padding, maxRate + padding]}
              width={70}
            />

            <Tooltip
              content={(props) => <CustomTooltip {...props} />}
              wrapperStyle={{
                outline: 'none',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
              }}
            />

            <Area
              type="monotone"
              dataKey="rate"
              stroke={colors.stroke}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              isAnimationActive={!historicalLoading}
              style={{ filter: 'url(#neonGlow)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}