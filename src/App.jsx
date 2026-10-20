import { useCurrency } from './hooks/useCurrency';
import { CurrencyConverter } from './components/CurrencyConverter';
import { HistoricalChart } from './components/HistoricalChart';
import { HistoricalTable } from './components/HistoricalTable';
import { Wifi, WifiOff, Shield, Loader2 } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function AppContent() {
  const { language, setLanguage, t } = useLanguage();
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
        return { icon: Wifi, color: 'text-emerald-400', label: t('connected'), bg: 'bg-emerald-500/10 border-emerald-500/20' };
      case 'error':
        return { icon: WifiOff, color: 'text-red-400', label: t('apiError'), bg: 'bg-red-500/10 border-red-500/20' };
      case 'loading':
        return { icon: Loader2, color: 'text-emerald-400 animate-spin', label: t('connecting'), bg: 'bg-emerald-500/10 border-emerald-500/20' };
      default:
        return { icon: Shield, color: 'text-slate-500', label: t('waiting'), bg: 'bg-slate-800/50 border-slate-700/50' };
    }
  };

  const languages = [
    { code: 'pt', label: 'PT', flag: '🇧🇷' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
  ];

  const statusConfig = getApiStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className={`min-h-screen transition-colors duration-500 bg-[#060913]`}>
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className={'absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]'} />
        <div className={'absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/5 rounded-full blur-3xl -translate-y-1/2'} />
        <div className={'absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-500/5 via-transparent to-emerald-500/5 rounded-full blur-3xl translate-y-1/2'} />
      </div>

      {/* Header */}
      <header className={`relative sticky top-0 z-40 backdrop-blur-md border-b border-slate-800/50 bg-slate-900/50`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <img 
                src="/images/image-1.jpg" 
                alt="Fintech Pro" 
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-emerald-500/50 shadow-md flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className={`text-base sm:text-xl font-bold tracking-tight text-slate-100 truncate`}>{t('appTitle')}</h1>
                <p className={`hidden sm:block text-xs text-slate-400`}>{t('appSubtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full ${statusConfig.bg} ${statusConfig.color} transition-all`}>
                <StatusIcon className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-medium">{statusConfig.label}</span>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 p-1 rounded-xl backdrop-blur-sm bg-slate-900/50 border border-slate-700/50" role="group" aria-label={t('languageSelector')}>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    aria-pressed={language === lang.code}
                    className={`px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 border ${
                      language === lang.code
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 shadow-lg'
                        : 'text-slate-400 border-transparent hover:text-slate-100 hover:bg-slate-800/50 active:bg-slate-800/70'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="hidden sm:inline">{lang.label}</span>
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-8 space-y-6 pb-12">
        <CurrencyConverter
          {...currency}
          baseCurrency={baseCurrency}
          targetCurrency={targetCurrency}
          loading={loading}
          error={error}
        />
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
        
        <footer className={`relative z-10 text-center text-xs py-4 border-t text-slate-500 border-slate-800/50`}>
          <p>{t('footerApi')}</p>
          <p className="mt-1">{t('footerTech')}</p>
        </footer>
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;