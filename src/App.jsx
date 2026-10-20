import { useCurrency } from './hooks/useCurrency';
import { CurrencyConverter } from './components/CurrencyConverter';
import { HistoricalChart } from './components/HistoricalChart';
import { HistoricalTable } from './components/HistoricalTable';
import { Wifi, WifiOff, Shield, Loader2, Zap } from 'lucide-react';

function App() {
  const {
    historicalData,
    historicalLoading,
    period,
    setPeriod,
    baseCurrency,
    targetCurrency,
    apiStatus,
    loading,
    error,
    ...currency
  } = useCurrency();

  const getApiStatusConfig = () => {
    switch (apiStatus) {
      case 'success':
        return { icon: Wifi, color: 'text-emerald-400', label: 'Conectado', bg: 'bg-emerald-500/10 border-emerald-500/20' };
      case 'error':
        return { icon: WifiOff, color: 'text-red-400', label: 'Erro API', bg: 'bg-red-500/10 border-red-500/20' };
      case 'loading':
        return { icon: Loader2, color: 'text-emerald-400 animate-spin', label: 'Conectando...', bg: 'bg-emerald-500/10 border-emerald-500/20' };
      default:
        return { icon: Shield, color: 'text-slate-500', label: 'Aguardando', bg: 'bg-slate-800/50 border-slate-700/50' };
    }
  };

  const statusConfig = getApiStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-[#060913] transition-colors duration-500">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/5 via-transparent to-emerald-500/5 rounded-full blur-3xl translate-y-1/2" />
      </div>

      {/* Header */}
      <header className="relative sticky top-0 z-40 backdrop-blur-md border-b border-slate-800/50 bg-slate-900/50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                <Zap className="w-6 h-6 text-slate-950" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 opacity-20 blur" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100 tracking-tight">Currency Exchange</h1>
                <p className="text-xs text-slate-400">Taxas em tempo real via Frankfurter API</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.color} transition-all`}>
                <StatusIcon className="w-4 h-4" />
                <span className="text-xs font-medium">{statusConfig.label}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-8 space-y-6 pb-12">
        <CurrencyConverter {...currency} />
        <HistoricalChart
          historicalData={historicalData}
          historicalLoading={historicalLoading}
          period={period}
          setPeriod={setPeriod}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
        />
        <HistoricalTable
          historicalData={historicalData}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
        />

        <footer className="relative z-10 text-center text-xs text-slate-500 py-4 border-t border-slate-800/50">
          <p>Dados fornecidos por <a href="https://api.frankfurter.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-400 transition-colors">Frankfurter API</a></p>
          <p className="mt-1">Desenvolvido com React + Tailwind v4 + Recharts</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
