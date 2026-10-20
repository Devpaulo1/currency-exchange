const BASE_URL = 'https://api.frankfurter.app';

async function fetchJson(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export async function getCurrencies() {
  const data = await fetchJson(`${BASE_URL}/currencies`);
  return data;
}

export async function getLatestRates(base = 'USD', symbols = '') {
  const params = new URLSearchParams();
  if (base) params.append('base', base);
  if (symbols) params.append('symbols', symbols);

  const url = `${BASE_URL}/latest?${params.toString()}`;
  const data = await fetchJson(url);

  return {
    base: data.base,
    date: data.date,
    rates: data.rates,
  };
}

export async function getHistoricalRates(startDate, endDate, base = 'USD', symbols = '') {
  if (!startDate || !endDate) {
    throw new Error('startDate and endDate are required');
  }

  const params = new URLSearchParams();
  if (base) params.append('base', base);
  if (symbols) params.append('symbols', symbols);

  const url = `${BASE_URL}/${startDate}..${endDate}?${params.toString()}`;
  const data = await fetchJson(url);

  return {
    base: data.base,
    startDate: data.start_date,
    endDate: data.end_date,
    rates: data.rates,
  };
}