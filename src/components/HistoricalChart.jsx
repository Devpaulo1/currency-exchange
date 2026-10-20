import { useMemo, useContext } from 'react';
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
import { LanguageContext } from '../context/LanguageContext';
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

function CustomTooltip({ active, payload, label, baseCurrency, targetCurrency }) {
  if (!active || !payload?.length) return null;

  const data = payload[0].value;
  const date = new Date(label);
  const baseFlag = hasFlag(baseCurrency) ? getFlagUrl(baseCurrency) : null;
  const targetFlag = hasFlag(targetCurrency) ? getFlagUrl(targetCurrency) : null;

  return (
    <div className={`relative min-w-[200px] z-50 rounded-xl p-3 shadow-2xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 shadow-emerald-500/10`}>
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5`} />
      <p className={`relative text-xs font-medium mb-2 text-slate-400`}>
        {date.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </p>
      <div className="relative flex items-center gap-2 mb-1">
        {baseFlag && <img src={baseFlag} alt={baseCurrency} className="w-5 h-3 rounded ring-1" loading="lazy" />}
        <span className={`text-xs text-slate-300`}>→</span>
        {targetFlag && <img src={targetFlag} alt={targetCurrency} className="w-5 h-3 rounded ring-1" loading="lazy" />}
      </div>
      <p className={`relative font-mono text-lg font-semibold text-emerald-400`}>
        {data.toLocaleString(undefined, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 6,
        })}
      </p>
    </div>
  );
}

const THEME_COLORS = {
  dark: {
    stroke: '#10b981',
    gradientStart: 'rgba(16, 185, 129, 0.25)',
    gradientEnd: 'rgba(16, 185, 129, 0)',
    gridStroke: 'rgba(51, 65, 85, 0.5)',
    axisTick: '#9ca3af',
    axisLine: 'rgba(55, 65, 81, 0.5)',
    loadingBg: 'rgba(6, 9, 19, 0.8)',
    loadingColor: '#9ca3af',
    emptyColor: '#6b7280',
    cardBg: 'bg-slate-900/50',
    cardBorder: 'border-slate-700/50',
    cardShadow: 'shadow-xl shadow-emerald-500/5',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    textMuted: 'text-slate-500',
    headerBg: 'bg-emerald-500/20',
    headerBorder: 'border-emerald-500/30',
    periodActiveBg: 'bg-emerald-500/20',
    periodActiveText: 'text-emerald-300',
    periodActiveBorder: 'border-emerald-500/30',
    periodInactive: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50',
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
  const { t } = useContext(LanguageContext);
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
      className={`relative ${colors.cardBg} backdrop-blur-md ${colors.cardBorder} rounded-2xl p-6 ${colors.cardShadow} overflow-hidden`}
    >
      <div className={`absolute inset-0 pointer-events-none bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5`} />
      
      <h2 id="chart-title" className="sr-only">
        {t('chartTitle', { from: baseCurrency, to: targetCurrency })}
      </h2>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${colors.headerBg} flex items-center justify-center ${colors.headerBorder}`}>
            <span className="font-mono text-sm text-emerald-500">{baseCurrency}/{targetCurrency}</span>
          </div>
          <div className="min-w-0 flex items-center gap-2">
            <h3 className={`text-lg font-semibold ${colors.textPrimary} truncate`}>
              {t('chartTitle', { from: baseCurrency, to: targetCurrency }).replace('Gráfico histórico ', '').replace('Historical Chart ', '').replace('Gráfico Histórico ', '')}
            </h3>
            <div className="flex-shrink-0 flex items-center gap-1">
              {baseFlagUrl && <img src={baseFlagUrl} alt={baseCurrency} className="w-5 h-3 rounded flex-shrink-0" loading="lazy" />}
              <span className={'text-slate-300'}>→</span>
              {targetFlagUrl && <img src={targetFlagUrl} alt={targetCurrency} className="w-5 h-3 rounded flex-shrink-0" loading="lazy" />}
            </div>
          </div>
        </div>

        <div className={`flex-shrink-0 flex items-center gap-1 backdrop-blur-sm rounded-xl p-1 bg-slate-900/50 border border-slate-700/50`} role="tablist">
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
                  ? `${colors.periodActiveBg} ${colors.periodActiveText} ${colors.periodActiveBorder} shadow-lg`
                  : colors.periodInactive
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
              {t('noChartData')}
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
              content={(props) => <CustomTooltip {...props} baseCurrency={baseCurrency} targetCurrency={targetCurrency} />}
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