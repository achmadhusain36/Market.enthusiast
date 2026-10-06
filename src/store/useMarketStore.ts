import { useState, useEffect } from 'react';
import { StockQuote, MarketIndex } from '../types';
import { INITIAL_STOCKS, INITIAL_GLOBAL_INDICES } from '../data/mockStocks';

interface MarketState {
  stocks: StockQuote[];
  indices: MarketIndex[];
  activeSymbol: string;
  isLiveSyncing: boolean;
}

let state: MarketState = {
  stocks: INITIAL_STOCKS,
  indices: INITIAL_GLOBAL_INDICES,
  activeSymbol: 'BBCA.JK',
  isLiveSyncing: true,
};

type Listener = () => void;
let listeners: Listener[] = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function useMarketStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const setStocks = (newStocks: StockQuote[] | ((prev: StockQuote[]) => StockQuote[])) => {
    if (typeof newStocks === 'function') {
      state.stocks = newStocks(state.stocks);
    } else {
      state.stocks = newStocks;
    }
    emitChange();
  };

  const setIndices = (newIndices: MarketIndex[] | ((prev: MarketIndex[]) => MarketIndex[])) => {
    if (typeof newIndices === 'function') {
      state.indices = newIndices(state.indices);
    } else {
      state.indices = newIndices;
    }
    emitChange();
  };

  const setActiveSymbol = (symbol: string) => {
    state.activeSymbol = symbol;
    emitChange();
  };

  const setIsLiveSyncing = (val: boolean) => {
    state.isLiveSyncing = val;
    emitChange();
  };

  const getActiveStock = (): StockQuote => {
    return state.stocks.find((s) => s.symbol === state.activeSymbol) || state.stocks[0];
  };

  return {
    stocks: state.stocks,
    indices: state.indices,
    activeSymbol: state.activeSymbol,
    isLiveSyncing: state.isLiveSyncing,
    activeStock: getActiveStock(),
    setStocks,
    setIndices,
    setActiveSymbol,
    setIsLiveSyncing,
  };
}
