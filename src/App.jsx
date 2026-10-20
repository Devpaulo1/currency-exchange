import { useCurrency } from './hooks/useCurrency';
import { CurrencyConverter } from './components/CurrencyConverter';
import { HistoricalChart } from './components/HistoricalChart';
import { HistoricalTable } from './components/HistoricalTable';

function App() {
  const {
    historicalData,
    historicalLoading,
    period,
    setPeriod,
    baseCurrency,
    targetCurrency,
    ...currency
  } = useCurrency();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Currency Exchange</h1>
          <p className="text-slate-500">Conversor de moedas em tempo real</p>
        </header>
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
      </div>
    </div>
  );
}

export default App;