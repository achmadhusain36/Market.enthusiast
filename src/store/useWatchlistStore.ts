import { useState, useEffect } from 'react';

export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  note?: string;
  triggered: boolean;
  createdAt: string;
}

const DEFAULT_SYMBOLS = ['BTC/USD', 'ETH/USD', 'BBCA.JK', 'NVDA', 'XAU/USD'];

const WATCHLIST_STORAGE_KEY = 'me_watchlist_symbols';
const ALERTS_STORAGE_KEY = 'me_price_alerts';

let storedWatchlist: string[] = (() => {
  const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY) || localStorage.getItem('nusa_watchlist_symbols');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return DEFAULT_SYMBOLS;
})();

let storedAlerts: PriceAlert[] = (() => {
  const saved = localStorage.getItem(ALERTS_STORAGE_KEY) || localStorage.getItem('nusa_price_alerts');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }
  return [
    {
      id: 'alt-1',
      symbol: 'BTC/USD',
      targetPrice: 65000,
      condition: 'above',
      note: 'Breakout all-time high resistance',
      triggered: false,
      createdAt: '28 Sep 2026',
    },
    {
      id: 'alt-2',
      symbol: 'BBCA.JK',
      targetPrice: 10500,
      condition: 'above',
      note: 'All-time high IDX target',
      triggered: false,
      createdAt: '28 Sep 2026',
    },
  ];
})();

type Listener = () => void;
let listeners: Listener[] = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function useWatchlistStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const toggleWatchlist = (symbol: string) => {
    if (storedWatchlist.includes(symbol)) {
      storedWatchlist = storedWatchlist.filter((s) => s !== symbol);
    } else {
      storedWatchlist = [...storedWatchlist, symbol];
    }
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(storedWatchlist));
    emitChange();
  };

  const isWatchlisted = (symbol: string) => {
    return storedWatchlist.includes(symbol);
  };

  const addAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alt-${Date.now()}`,
      triggered: false,
      createdAt: new Date().toLocaleDateString('id-ID'),
    };
    storedAlerts = [newAlert, ...storedAlerts];
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(storedAlerts));
    emitChange();
  };

  const removeAlert = (id: string) => {
    storedAlerts = storedAlerts.filter((a) => a.id !== id);
    localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(storedAlerts));
    emitChange();
  };

  return {
    watchlist: storedWatchlist,
    alerts: storedAlerts,
    toggleWatchlist,
    isWatchlisted,
    addAlert,
    removeAlert,
  };
}
