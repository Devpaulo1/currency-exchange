import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Filter, FilterX, Download } from 'lucide-react';
import { exportToCSV } from '../utils/csvExporter';

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
    if (sortConfig.key !== columnKey) return <ChevronsUpDown className="w-4 h-4 text-slate-400" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4 text-slate-700" />;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Tabela de Cotações</h2>
          <span className="px-2 py-0.5 text-xs font-mono text-slate-600 bg-slate-100 rounded">
            {filteredData.length} registro{filteredData.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              showFilters
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={filteredData.length === 0}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Data Inicial</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Data Final</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Cotação Mínima</label>
              <input
                type="number"
                step="0.0001"
                value={filters.rateMin}
                onChange={(e) => handleFilterChange('rateMin', e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: 5.0"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Cotação Máxima</label>
              <input
                type="number"
                step="0.0001"
                value={filters.rateMax}
                onChange={(e) => handleFilterChange('rateMax', e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ex: 6.0"
              />
            </div>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <FilterX className="w-4 h-4" />
              Limpar filtros
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="px-4 py-3 text-left font-medium text-slate-700 cursor-pointer hover:text-slate-900 select-none flex items-center gap-1" onClick={() => handleSort('date')}>
                Data <SortIcon columnKey="date" />
              </th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Moeda Origem</th>
              <th className="px-4 py-3 text-left font-medium text-slate-700">Moeda Destino</th>
              <th className="px-4 py-3 text-right font-medium text-slate-700 cursor-pointer hover:text-slate-900 select-none flex items-center justify-end gap-1" onClick={() => handleSort('rate')}>
                Cotação <SortIcon columnKey="rate" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-slate-500">
                  {historicalData.length === 0 ? 'Sem dados históricos para o período selecionado' : 'Nenhum registro encontrado com os filtros atuais'}
                </td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={`${item.date}-${index}`} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-slate-900 font-mono">{formatDate(item.date)}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{baseCurrency}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{targetCurrency}</td>
                  <td className="px-4 py-3 text-right text-slate-900 font-mono tabular-nums">{formatRate(item.rate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}