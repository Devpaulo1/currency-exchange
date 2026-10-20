const PRIMARY_BASE_URL = 'https://api.frankfurter.dev/v1';
const FALLBACK_BASE_URL = 'https://api.frankfurter.app';

let currentBaseUrl = PRIMARY_BASE_URL;

async function fetchJson(url, isFallbackAttempt = false) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`[currencyService] Request failed:`, {
      url,
      baseUrl: currentBaseUrl,
      isFallbackAttempt,
      error: error.message,
      stack: error.stack,
    });

    if (!isFallbackAttempt && currentBaseUrl === PRIMARY_BASE_URL) {
      console.warn('[currencyService] Trying fallback URL:', FALLBACK_BASE_URL);
      currentBaseUrl = FALLBACK_BASE_URL;
      const fallbackUrl = url.replace(PRIMARY_BASE_URL, FALLBACK_BASE_URL);
      return fetchJson(fallbackUrl, true);
    }

    throw error;
  }
}

function buildUrl(endpoint, params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  const queryString = searchParams.toString();
  return `${currentBaseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;
}

export async function getCurrencies() {
  const url = buildUrl('/currencies');
  const data = await fetchJson(url);
  return data;
}

export async function getLatestRates(base = 'USD', symbols = '') {
  const url = buildUrl('/latest', { base, symbols });
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

  const url = buildUrl(`/${startDate}..${endDate}`, { base, symbols });
  const data = await fetchJson(url);

  return {
    base: data.base,
    startDate: data.start_date,
    endDate: data.end_date,
    rates: data.rates,
  };
}