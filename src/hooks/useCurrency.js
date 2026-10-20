import { useState, useEffect, useCallback } from 'react';
import { getCurrencies, getLatestRates, getHistoricalRates } from '../services/currencyService';

const PERIOD_DAYS = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '180d': 180,
  '1y': 365,
};

function getDateRange(period) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - PERIOD_DAYS[period]);
  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

export function useCurrency() {
  const [baseCurrency, setBaseCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('BRL');
  const [amount, setAmount] = useState('1');
  const [currencies, setCurrencies] = useState({});
  const [rate, setRate] = useState(null);
  const [rateDate, setRateDate] = useState(null);
  const [historicalData, setHistoricalData] = useState({});
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCurrencies = useCallback(async () => {
    try {
      const data = await getCurrencies();
      setCurrencies(data);
    } catch (err) {
      setError('Failed to load currencies');
    }
  }, []);

  const fetchLatestRate = useCallback(async () => {
    if (!baseCurrency || !targetCurrency) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getLatestRates(baseCurrency, targetCurrency);
      setRate(data.rates?.[targetCurrency] || null);
      setRateDate(data.date);
    } catch (err) {
      setError('Failed to fetch latest rate');
      setRate(null);
    } finally {
      setLoading(false);
    }
  }, [baseCurrency, targetCurrency]);

  const fetchHistoricalData = useCallback(async () => {
    if (!baseCurrency || !targetCurrency) return;
    setLoading(true);
    setError(null);
    try {
      const { startDate, endDate } = getDateRange(selectedPeriod);
      const data = await getHistoricalRates(startDate, endDate, baseCurrency, targetCurrency);
      const rates = data.rates || {};
      const chartData = Object.entries(rates)
        .map(([date, values]) => ({
          date,
          rate: values[targetCurrency],
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setHistoricalData(chartData);
    } catch (err) {
      setError('Failed to fetch historical data');
      setHistoricalData({});
    } finally {
      setLoading(false);
    }
  }, [baseCurrency, targetCurrency, selectedPeriod]);

  const swapCurrencies = useCallback(() => {
    setBaseCurrency(targetCurrency);
    setTargetCurrency(baseCurrency);
  }, [baseCurrency, targetCurrency]);

  const updateAmount = useCallback((newAmount) => {
    setAmount(newAmount);
  }, []);

  const updatePeriod = useCallback((period) => {
    setSelectedPeriod(period);
  }, []);

  const updateBaseCurrency = useCallback((currency) => {
    setBaseCurrency(currency);
  }, []);

  const updateTargetCurrency = useCallback((currency) => {
    setTargetCurrency(currency);
  }, []);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  useEffect(() => {
    fetchLatestRate();
  }, [fetchLatestRate]);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  const convertedAmount = rate ? (parseFloat(amount) * rate).toFixed(4) : null;

  return {
    baseCurrency,
    setBaseCurrency,
    targetCurrency,
    setTargetCurrency,
    amount,
    setAmount,
    currencies,
    exchangeRate: rate,
    date: rateDate,
    historicalData,
    selectedPeriod,
    loading,
    error,
    convertedAmount,
    swapCurrencies,
    updateAmount: setAmount,
    updatePeriod,
    updateBaseCurrency: setBaseCurrency,
    updateTargetCurrency: setTargetCurrency,
    refetch: fetchLatestRate,
  };
}