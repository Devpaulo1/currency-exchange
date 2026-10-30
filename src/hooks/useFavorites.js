import { useCallback, useEffect, useMemo, useState } from "react";
import { loadFavorites, saveFavorites } from "../utils/favoritesStorage";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [baseCurrency, setBaseCurrency] = useState("BRL");

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const addFavorite = useCallback((code) => {
    if (!code) return;
    setFavorites((prev) => {
      if (prev.some((item) => item.code === code)) return prev;
      return [...prev, { code }];
    });
  }, []);

  const removeFavorite = useCallback((code) => {
    setFavorites((prev) => prev.filter((item) => item.code !== code));
  }, []);

  const isFavorite = useCallback((code) => favorites.some((item) => item.code === code), [favorites]);

  const favoriteCodes = useMemo(() => favorites.map((item) => item.code), [favorites]);

  return {
    favorites,
    favoriteCodes,
    addFavorite,
    removeFavorite,
    isFavorite,
    baseCurrency,
    setBaseCurrency,
  };
}
