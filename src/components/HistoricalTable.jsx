import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Filter, FilterX, Download } from 'lucide-react';
import { exportToCSV } from '../utils/csvExporter';
import { getFlagUrl, hasFlag } from '../utils/currencyFlags';

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatRate(rate) {
  return rate.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  });
}

function parseDateInput(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function HistoricalTable({
  historicalData,
  baseCurrency,
  targetCurrency,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    rateMin: '',
    rateMax: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const baseFlagUrl = hasFlag(baseCurrency) ? getFlagUrl(baseCurrency) : null;
  const targetFlagUrl = hasFlag(targetCurrency) ? getFlagUrl(targetCurrency) : null;

  const filteredData = useMemo(() => {
    let result = historicalData;

    if (filters.dateFrom) {
      const fromDate = parseDateInput(filters.dateFrom);
      result = result.filter(item => new Date(item.date) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = parseDateInput(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(item => new Date(item.date) <= toDate);
    }

    if (filters.rateMin !== '') {
      const min = parseFloat(filters.rateMin);
      if (!isNaN(min)) {
        result = result.filter(item => item.rate >= min);
      }
    }

    if (filters.rateMax !== '') {
      const max = parseFloat(filters.rateMax);
      if (!isNaN(max)) {
        result = result.filter(item => item.rate <= max);
      }
    }

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (sortConfig.key === 'date') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [historicalData, filters, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ dateFrom: '', dateTo: '', rateMin: '', rateMax: '' });
    setSortConfig({ key: null, direction: 'asc' });
  };

  const hasActiveFilters = filters.dateFrom || filters.dateTo || filters.rateMin !== '' || filters.rateMax !== '' || sortConfig.key;

  const handleExport = () => {
    if (filteredData.length === 0) {
      alert('Nenhum dado para exportar. Ajuste os filtros ou selecione outro período.');
      return;
    }
    exportToCSV(filteredData, baseCurrency, targetCurrency);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronsUpDown className="w-4 h-4 text-slate-500" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-emerald-400" /> 
      : <ChevronDown className="w-4 h-4 text-emerald-400" />;
  };

  const getRateChangeClass = (index) => {
    if (index === 0) return '';
    const prevRate = filteredData[index - 1]?.rate;
    const currRate = filteredData[index]?.rate;
    if (!prevRate || !currRate) return '';
    if (currRate > prevRate) return 'text-emerald-400';
    if (currRate < prevRate) return 'text-red-400';
    return '';
  };

  const getRateChangeIcon = (index) => {
    if (index === 0) return null;
    const prevRate = filteredData[index - 1]?.rate;
    const currRate = filteredData[index]?.rate;
    if (!prevRate || !currRate) return null;
    if (currRate > prevRate) return <span className="ml-1 text-emerald-400">▲</span>;
    if (currRate < prevRate) return <span className="ml-1 text-red-400">▼</span>;
    return null;
  };

  return (
    <section
      aria-labelledby="table-title"
      className="relative bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl shadow-emerald-500/5 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
      
      <h2 id="table-title" className="sr-only">Tabela de Cotações Históricas</h2>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {baseFlagUrl && <img src={baseFlagUrl} alt="" className="w-5 h-3 rounded ring-1 ring-slate-700" loading="lazy" />}
            <span className="text-slate-300">→</span>
            {targetFlagUrl && <img src={targetFlagUrl} alt="" className="w-5 h-3 rounded ring-1 ring-slate-700" loading="lazy" />}
          </div>
          <h3 className="text-lg font-semibold text-slate-100">Tabela de Cotações</h3>
          <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-900/50 border border-slate-700/50 text-slate-400">
            {filteredData.length} registro{filteredData.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 text-sm font-medium rounded-xl transition-all flex items-center gap-1.5 ${
              showFilters
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-slate-700/50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={filteredData.length === 0}
            className="px-3 py-1.5 text-sm font-medium rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="relative z-10 mb-6 p-4 rounded-xl space-y-3 bg-slate-900/50 backdrop-blur-sm border border-slate-700/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Data Inicial</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Data Final</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Cotação Mínima</label>
              <input
                type="number"
                step="0.0001"
                value={filters.rateMin}
                onChange={(e) => handleFilterChange('rateMin', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                placeholder="Ex: 5.0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Cotação Máxima</label>
              <input
                type="number"
                step="0.0001"
                value={filters.rateMax}
                onChange={(e) => handleFilterChange('rateMax', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                placeholder="Ex: 6.0"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <FilterX className="w-4 h-4" />
              Limpar filtros
            </button>
          )}
        </div>
      )}

      <div className="relative z-10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700/30">
              <th 
                className="px-4 py-3 text-left font-medium text-slate-400 cursor-pointer select-none flex items-center gap-1 hover:text-emerald-400 transition-colors"
                onClick={() => handleSort('date')}
              >
                Data <SortIcon columnKey="date" />
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-400">Par</th>
              <th 
                className="px-4 py-3 text-right font-medium text-slate-400 cursor-pointer select-none flex items-center justify-end gap-1 hover:text-emerald-400 transition-colors"
                onClick={() => handleSort('rate')}
              >
                Cotação <SortIcon columnKey="rate" />
              </th>
              <th className="px-4 py-3 text-center font-medium text-slate-400 w-16">Variação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/20">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                  {historicalData.length === 0 
                    ? 'Sem dados históricos para o período selecionado' 
                    : 'Nenhum registro encontrado com os filtros atuais'}
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr 
                  key={`${item.date}-${index}`} 
                  className="transition-all duration-200 hover:bg-emerald-500/5 hover:border-l-4 hover:border-emerald-500/30"
                >
                  <td className="px-4 py-3 font-mono text-slate-200 whitespace-nowrap">{formatDate(item.date)}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    {baseFlagUrl && <img src={baseFlagUrl} alt="" className="w-5 h-3 rounded ring-1 ring-slate-700" loading="lazy" />}
                    <span className="text-slate-200 font-medium">{baseCurrency}</span>
                    <span className="text-slate-500">→</span>
                    {targetFlagUrl && <img src={targetFlagUrl} alt="" className="w-5 h-3 rounded ring-1 ring-slate-700" loading="lazy" />}
                    <span className="text-slate-200 font-medium">{targetCurrency}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-100">
                    {formatRate(item.rate)}
                    {getRateChangeIcon(index)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium ${getRateChangeClass(index)}`}>
                      {index > 0 && filteredData[index - 1]?.rate ? (
                        `${((item.rate - filteredData[index - 1].rate) / filteredData[index - 1].rate * 100).toFixed(2)}%`
                      ) : '—'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}