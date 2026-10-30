const STORAGE_KEY = 'currency_exchange_favorites';
const DEFAULT_FAVORITES = [
  { code: 'BRL' },
  { code: 'USD' },
  { code: 'EUR' },
  { code: 'JPY' },
  { code: 'HKD' },
];

export function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveFavorites(DEFAULT_FAVORITES);
      return DEFAULT_FAVORITES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      saveFavorites(DEFAULT_FAVORITES);
      return DEFAULT_FAVORITES;
    }
    const filtered = parsed.filter((item) => item && typeof item.code === 'string');
    if (filtered.length === 0) {
      saveFavorites(DEFAULT_FAVORITES);
      return DEFAULT_FAVORITES;
    }
    return filtered;
  } catch {
    return DEFAULT_FAVORITES;
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // ignore write errors
  }
}
