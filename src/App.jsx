import { useCurrency } from './hooks/useCurrency';
import { CurrencyConverter } from './components/CurrencyConverter';

function App() {
  const currency = useCurrency();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Currency Exchange</h1>
          <p className="text-slate-500">Conversor de moedas em tempo real</p>
        </header>
        <CurrencyConverter {...currency} />
      </div>
    </div>
  );
}

export default App;