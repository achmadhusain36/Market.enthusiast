import { useState, useEffect, useCallback } from 'react';
import { MOCK_ASSETS, Asset } from '../data/mockAssets';
import { fetchLiveCryptoPrices, mergeLiveMarketData } from '../services/coingecko';

export function useMarketData() {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const liveData = await fetchLiveCryptoPrices();
      setAssets((prev) => mergeLiveMarketData(prev, liveData));
      setLastUpdated(new Date());
    } catch (e) {
      console.warn('Market sync error, using cached data', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    refreshData();

    // Auto-refresh every 30 seconds as specified in prompt
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData]);

  const getAsset = (symbol: string): Asset | undefined => {
    if (!symbol) return undefined;
    const clean = decodeURIComponent(symbol).toUpperCase();
    return (
      assets.find((a) => a.symbol.toUpperCase() === clean) ||
      assets.find((a) => a.id.toLowerCase() === clean.toLowerCase())
    );
  };

  return {
    assets,
    isLoading,
    lastUpdated,
    refreshData,
    getAsset,
  };
}
