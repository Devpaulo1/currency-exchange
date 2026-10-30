import { useState } from 'react';
import { useCurrency } from './hooks/useCurrency';
import { CurrencyConverter } from './components/CurrencyConverter';
import { HistoricalChart } from './components/HistoricalChart';
import { HistoricalTable } from './components/HistoricalTable';
import { Wifi, WifiOff, Shield, Loader2, Plus, Search, X } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useFavorites } from './hooks/useFavorites';
import { FavoriteCard } from './components/FavoriteCard';
import { getFlagUrl, hasFlag } from './utils/currencyFlags';

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
    currencies,
    ...currency
  } = useCurrency();

  const {
    favorites,
    favoriteCodes,
    addFavorite,
    removeFavorite,
    baseCurrency: favBaseCurrency,
    setBaseCurrency: setFavBaseCurrency,
  } = useFavorites();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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

      <main className="relative max-w-6xl mx-auto px-4 py-8 space-y-6 pb-12">
        {/* Moedas Favoritas Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-100">Moedas Favoritas</h2>
              <p className="text-sm text-slate-400">Acompanhe suas moedas preferidas</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={favBaseCurrency}
                onChange={(e) => setFavBaseCurrency(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-700/60 text-slate-100 text-sm focus:outline-none focus:border-emerald-500/50"
              >
                {Object.keys(currencies || {}).length > 0 ? (
                  Object.keys(currencies).map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="BRL">BRL</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </>
                )}
              </select>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Adicionar moeda</span>
              </button>
            </div>
          </div>

          {favoriteCodes.length === 0 ? (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/40 p-6 text-center">
              <p className="text-slate-400 text-sm">Nenhuma moeda favorita ainda. Adicione suas moedas preferidas para acompanhá-las.</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
              {favoriteCodes.map((code) => (
                <div key={code} className="snap-start">
                  <FavoriteCard code={code} baseCurrency={favBaseCurrency} onRemove={removeFavorite} />
                </div>
              ))}
            </div>
          )}
        </section>

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

      {/* Add Favorite Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/95 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
              <h3 className="text-base font-semibold text-slate-100">Adicionar moeda favorita</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar moeda..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/60 border border-slate-700/60 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1">
                {Object.entries(currencies || {})
                  .filter(([code]) => {
                    if (favoriteCodes.includes(code)) return false;
                    if (!searchTerm) return true;
                    const term = searchTerm.toLowerCase();
                    const name = currencies[code]?.toLowerCase() || '';
                    return code.toLowerCase().includes(term) || name.includes(term);
                  })
                  .sort(([a], [b]) => a.localeCompare(b))
                  .slice(0, 100)
                  .map(([code, name]) => {
                    const flag = hasFlag(code) ? getFlagUrl(code) : null;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          addFavorite(code);
                          setShowAddModal(false);
                          setSearchTerm('');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800/60 text-left transition-colors"
                      >
                        {flag ? (
                          <img src={flag} alt={code} className="w-5 h-3.5 rounded ring-1 ring-slate-700/60" />
                        ) : (
                          <div className="w-5 h-3.5 rounded bg-slate-700/60" />
                        )}
                        <span className="text-sm font-medium text-slate-100">{code}</span>
                        <span className="text-xs text-slate-400 truncate">{name}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
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