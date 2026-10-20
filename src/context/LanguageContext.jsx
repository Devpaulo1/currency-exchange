import { createContext, useState, useEffect, useCallback, useContext } from 'react';

export const LanguageContext = createContext(null);

const translations = {
  pt: {
    // Header
    appTitle: 'Currency Exchange',
    appSubtitle: 'Taxas em tempo real via Frankfurter API',
    connected: 'Conectado',
    connecting: 'Conectando...',
    apiError: 'Erro API',
    waiting: 'Aguardando',
    languageSelector: 'Selecionar idioma',
    
    // CurrencyConverter
    convertTitle: 'Conversor de Moedas',
    amountLabel: 'Valor a Converter',
    amountPlaceholder: '0,00',
    fromLabel: 'De',
    toLabel: 'Para',
    swapAria: 'Inverter moedas',
    currentRate: 'Taxa Atual',
    loadingRate: 'Atualizando...',
    noRate: 'Selecione as moedas para ver a conversão',
    convertedValue: 'Valor Convertido',
    conversionFormula: '{amount} {from} × {rate} = {result} {to}',
    errorLoading: 'Falha ao carregar taxas',
    
    // HistoricalChart
    chartTitle: 'Gráfico histórico {from} → {to}',
    chartSubtitle: 'Variação nos últimos {period}',
    noChartData: 'Sem dados históricos para o período selecionado',
    loadingChart: 'Carregando gráfico...',
    periods: {
      '7d': '7d',
      '15d': '15d',
      '30d': '30d',
      '3m': '3m',
      '6m': '6m',
      '1y': '1a',
      '5y': '5a',
      '10y': '10a',
    },
    
    // HistoricalTable
    tableTitle: 'Tabela de Cotações',
    recordsCount: '{count} registro{plural}',
    filtersBtn: 'Filtros',
    exportBtn: 'Exportar CSV',
    clearFilters: 'Limpar filtros',
    dateFrom: 'Data Inicial',
    dateTo: 'Data Final',
    rateMin: 'Cotação Mínima',
    rateMax: 'Cotação Máxima',
    noTableData: 'Sem dados históricos para o período selecionado',
    noFilteredData: 'Nenhum registro encontrado com os filtros atuais',
    sortDate: 'Data',
    sortPair: 'Par',
    sortRate: 'Cotação',
    sortVariation: 'Variação',
    variationUp: '▲',
    variationDown: '▼',
    rateMinPlaceholder: 'Ex: 5.0',
    rateMaxPlaceholder: 'Ex: 6.0',
    
    // Footer
    footerApi: 'Dados fornecidos por Frankfurter API',
    footerTech: 'Desenvolvido com React + Tailwind v4 + Recharts',
  },
  en: {
    appTitle: 'Currency Exchange',
    appSubtitle: 'Real-time rates via Frankfurter API',
    connected: 'Connected',
    connecting: 'Connecting...',
    apiError: 'API Error',
    waiting: 'Waiting',
    languageSelector: 'Select language',
    
    convertTitle: 'Currency Converter',
    amountLabel: 'Amount to Convert',
    amountPlaceholder: '0.00',
    fromLabel: 'From',
    toLabel: 'To',
    swapAria: 'Swap currencies',
    currentRate: 'Current Rate',
    loadingRate: 'Updating...',
    noRate: 'Select currencies to see conversion',
    convertedValue: 'Converted Value',
    conversionFormula: '{amount} {from} × {rate} = {result} {to}',
    errorLoading: 'Failed to load rates',
    
    chartTitle: 'Historical Chart {from} → {to}',
    chartSubtitle: 'Variation over last {period}',
    noChartData: 'No historical data for selected period',
    loadingChart: 'Loading chart...',
    periods: {
      '7d': '7d',
      '15d': '15d',
      '30d': '30d',
      '3m': '3m',
      '6m': '6m',
      '1y': '1y',
      '5y': '5y',
      '10y': '10y',
    },
    
    tableTitle: 'Rate Table',
    recordsCount: '{count} record{plural}',
    filtersBtn: 'Filters',
    exportBtn: 'Export CSV',
    clearFilters: 'Clear filters',
    dateFrom: 'From Date',
    dateTo: 'To Date',
    rateMin: 'Min Rate',
    rateMax: 'Max Rate',
    noTableData: 'No historical data for selected period',
    noFilteredData: 'No records found with current filters',
    sortDate: 'Date',
    sortPair: 'Pair',
    sortRate: 'Rate',
    sortVariation: 'Variation',
    variationUp: '▲',
    variationDown: '▼',
    rateMinPlaceholder: 'Ex: 5.0',
    rateMaxPlaceholder: 'Ex: 6.0',
    
    footerApi: 'Data provided by Frankfurter API',
    footerTech: 'Built with React + Tailwind v4 + Recharts',
  },
  es: {
    appTitle: 'Currency Exchange',
    appSubtitle: 'Tasas en tiempo real via Frankfurter API',
    connected: 'Conectado',
    connecting: 'Conectando...',
    apiError: 'Error API',
    waiting: 'Esperando',
    languageSelector: 'Seleccionar idioma',
    
    convertTitle: 'Conversor de Monedas',
    amountLabel: 'Cantidad a Convertir',
    amountPlaceholder: '0,00',
    fromLabel: 'De',
    toLabel: 'A',
    swapAria: 'Invertir monedas',
    currentRate: 'Tasa Actual',
    loadingRate: 'Actualizando...',
    noRate: 'Seleccione monedas para ver conversión',
    convertedValue: 'Valor Convertido',
    conversionFormula: '{amount} {from} × {rate} = {result} {to}',
    errorLoading: 'Error al cargar tasas',
    
    chartTitle: 'Gráfico Histórico {from} → {to}',
    chartSubtitle: 'Variación en los últimos {period}',
    noChartData: 'Sin datos históricos para el período seleccionado',
    loadingChart: 'Cargando gráfico...',
    periods: {
      '7d': '7d',
      '15d': '15d',
      '30d': '30d',
      '3m': '3m',
      '6m': '6m',
      '1y': '1a',
      '5y': '5a',
      '10y': '10a',
    },
    
    tableTitle: 'Tabla de Cotizaciones',
    recordsCount: '{count} registro{plural}',
    filtersBtn: 'Filtros',
    exportBtn: 'Exportar CSV',
    clearFilters: 'Limpiar filtros',
    dateFrom: 'Fecha Inicial',
    dateTo: 'Fecha Final',
    rateMin: 'Cotización Mínima',
    rateMax: 'Cotización Máxima',
    noTableData: 'Sin datos históricos para el período seleccionado',
    noFilteredData: 'Ningún registro encontrado con los filtros actuales',
    sortDate: 'Fecha',
    sortPair: 'Par',
    sortRate: 'Cotización',
    sortVariation: 'Variación',
    variationUp: '▲',
    variationDown: '▼',
    rateMinPlaceholder: 'Ej: 5.0',
    rateMaxPlaceholder: 'Ej: 6.0',
    
    footerApi: 'Datos proporcionados por Frankfurter API',
    footerTech: 'Desarrollado con React + Tailwind v4 + Recharts',
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('language') || 'pt';
    }
    return 'pt';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    if (typeof value === 'string') {
      return Object.entries(params).reduce((str, [k, v]) => str.replace(`{${k}}`, v), value);
    }
    return key;
  }, [language]);

  const setLang = useCallback((lang) => {
    if (translations[lang]) {
      setLanguage(lang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLang, t, translations: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}