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

const PERIOD_OPTIONS = [
  { value: '7d', label: '7 dias' },
  { value: '15d', label: '15 dias' },
  { value: '30d', label: '30 dias' },
  { value: '3m', label: '3 meses' },
  { value: '6m', label: '6 meses' },
  { value: '1y', label: '1 ano' },
  { value: '5y', label: '5 anos' },
  { value: '10y', label: '10 anos' },
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

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-lg min-w-[180px]">
      <p className="text-xs text-slate-500 font-medium mb-1">
        {date.toLocaleDateString('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </p>
      <p className="text-slate-900 font-mono text-lg font-semibold">
        1 {payload[0].dataKey?.split('.')[0] || 'base'} = {data.toLocaleString(undefined, {
          minimumFractionDigits: 4,
          maximumFractionDigits: 6,
        })} {payload[0].dataKey?.split('.')[1] || 'target'}
      </p>
    </div>
  );
}

export function HistoricalChart({
  historicalData,
  baseCurrency,
  targetCurrency,
  period,
  setPeriod,
  historicalLoading,
}) {
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

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Histórico: {baseCurrency} → {targetCurrency}
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Variação da taxa nos últimos {PERIOD_OPTIONS.find((p) => p.value === period)?.label || period}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPeriod(opt.value)}
              disabled={historicalLoading}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${
                period === opt.value
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-72">
        {historicalLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        )}

        {!hasData && !historicalLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-400">
            <p className="text-sm">Sem dados históricos para o período selecionado</p>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0f766e" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#0f766e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#e2e8f0"
              vertical={false}
              horizontal={true}
            />

            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisTick}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              interval="preserveStartEnd"
            />

            <YAxis
              tickFormatter={formatYAxisTick}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
              axisLine={false}
              tickLine={false}
              domain={[minRate - padding, maxRate + padding]}
              width={70}
            />

            <Tooltip
              content={<CustomTooltip />}
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
              stroke="#0f766e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#areaGradient)"
              isAnimationActive={!historicalLoading}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}