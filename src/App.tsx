import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { StockChart } from './components/StockChart';
import { MarketWatchlist } from './components/MarketWatchlist';
import { TradingViewBottomDock } from './components/TradingViewBottomDock';
import { ProfileModal } from './components/ProfileModal';
import { TradeModal } from './components/TradeModal';
import {
  INITIAL_USER_PROFILE,
  INITIAL_GLOBAL_INDICES,
  INITIAL_STOCKS,
  INITIAL_HOLDINGS,
  INITIAL_TRANSACTIONS,
  generateCandles,
} from './data/mockStocks';
import {
  UserProfile,
  StockQuote,
  MarketIndex,
  PortfolioHolding,
  Transaction,
  Timeframe,
  CurrencyType,
  Language,
} from './types';
import { TRANSLATIONS } from './utils/translations';

export default function App() {
  // 1. Persistent User Profile & Language & Balance (Achmad Husain)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('market_enthusiast_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    return INITIAL_USER_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('market_enthusiast_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // 2. Persistent Holdings State
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    const saved = localStorage.getItem('market_enthusiast_holdings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse holdings', e);
      }
    }
    return INITIAL_HOLDINGS;
  });

  useEffect(() => {
    localStorage.setItem('market_enthusiast_holdings', JSON.stringify(holdings));
  }, [holdings]);

  // 3. Persistent Real-Time Transactions History State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('market_enthusiast_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse transactions', e);
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  useEffect(() => {
    localStorage.setItem('market_enthusiast_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // 4. Live Global Stocks & Indices State (Default to COMPOSITE like in Screenshot 228)
  const [stocks, setStocks] = useState<StockQuote[]>(INITIAL_STOCKS);
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_GLOBAL_INDICES);
  const [activeSymbol, setActiveSymbol] = useState<string>('COMPOSITE');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNavTab, setActiveNavTab] = useState<string>('chart');

  // Bottom dock state
  const [isBottomDockOpen, setIsBottomDockOpen] = useState(true);

  // 5. Modal States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [tradeModalState, setTradeModalState] = useState<{
    isOpen: boolean;
    stock: StockQuote;
    initialType: 'BUY' | 'SELL';
  }>({
    isOpen: false,
    stock: INITIAL_STOCKS[0],
    initialType: 'BUY',
  });

  // Active stock object
  const activeStock = useMemo(() => {
    return stocks.find((s) => s.symbol === activeSymbol) || stocks[0];
  }, [stocks, activeSymbol]);

  // Generate or update chart candles whenever activeStock or timeframe changes
  const [candles, setCandles] = useState(() => generateCandles(activeStock.price, timeframe));

  useEffect(() => {
    setCandles(generateCandles(activeStock.price, timeframe));
  }, [activeStock.symbol, timeframe]);

  // 6. Real-Time Global Market Sync Engine (Simulated live ticks every 2.5 seconds)
  useEffect(() => {
    if (!isLiveSyncing) return;

    const interval = setInterval(() => {
      // Pick 1 to 3 random stocks to simulate real-time price ticks
      setStocks((prevStocks) => {
        return prevStocks.map((stock) => {
          // 40% chance this stock gets a tick
          if (Math.random() > 0.40) return { ...stock, flashDirection: null };

          const tickPercent = (Math.random() - 0.49) * 0.004; // tiny realistic tick +/- 0.2%
          const decimals = stock.symbol === 'COMPOSITE' ? 4 : 2;
          const newPrice = Math.max(0.1, Number((stock.price * (1 + tickPercent)).toFixed(decimals)));
          const priceDiff = newPrice - stock.price;
          const newChange = Number((stock.change + priceDiff).toFixed(decimals));
          const newChangePercent = Number(((newChange / stock.previousClose) * 100).toFixed(2));
          const flashDirection: 'up' | 'down' = priceDiff >= 0 ? 'up' : 'down';

          const newSparkline = [...stock.sparkline.slice(1), newPrice];

          return {
            ...stock,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            high: Math.max(stock.high, newPrice),
            low: Math.min(stock.low, newPrice),
            sparkline: newSparkline,
            flashDirection,
            lastUpdated: 'Baru saja',
          };
        });
      });

      // Also tick global indices slightly
      setIndices((prevIndices) =>
        prevIndices.map((idx) => {
          if (Math.random() > 0.45) return idx;
          const delta = (Math.random() - 0.49) * 0.002;
          const newVal = Number((idx.value * (1 + delta)).toFixed(idx.name === 'DXY' ? 3 : 2));
          const diff = newVal - idx.value;
          return {
            ...idx,
            value: newVal,
            change: Number((idx.change + diff).toFixed(idx.name === 'DXY' ? 3 : 2)),
            changePercent: Number((idx.changePercent + delta * 100).toFixed(2)),
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveSyncing]);

  // Update candle last bar with active stock live price
  useEffect(() => {
    setCandles((prev) => {
      if (!prev || prev.length === 0) return prev;
      const lastIndex = prev.length - 1;
      const lastCandle = prev[lastIndex];
      const updated = {
        ...lastCandle,
        close: activeStock.price,
        high: Math.max(lastCandle.high, activeStock.price),
        low: Math.min(lastCandle.low, activeStock.price),
      };
      const copy = [...prev];
      copy[lastIndex] = updated;
      return copy;
    });
  }, [activeStock.price]);

  // Handlers
  const handleToggleCurrency = () => {
    setUserProfile((prev) => ({
      ...prev,
      selectedCurrency: prev.selectedCurrency === 'USD' ? 'IDR' : 'USD',
    }));
  };

  const handleSelectLanguage = (lang: Language) => {
    setUserProfile((prev) => ({
      ...prev,
      language: lang,
    }));
  };

  const handleSelectStock = (symbol: string) => {
    setActiveSymbol(symbol);
    const element = document.getElementById('stock-chart-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleOpenTrade = (stock: StockQuote = activeStock, type: 'BUY' | 'SELL' = 'BUY') => {
    setTradeModalState({
      isOpen: true,
      stock,
      initialType: type,
    });
  };

  // Trade Execution: Synchronized with Balance, Holdings, and Transaction History
  const handleExecuteTrade = useCallback(
    (trade: {
      type: 'BUY' | 'SELL';
      stock: StockQuote;
      shares: number;
      price: number;
      fee: number;
      total: number;
    }) => {
      const now = new Date();
      const locale = userProfile.language === 'id' ? 'id-ID' : 'en-US';
      const timestampStr =
        now.toLocaleDateString(locale, {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ', ' +
        now.toLocaleTimeString(locale, {
          hour: '2-digit',
          minute: '2-digit',
        }) +
        ' WIB';

      // 1. Create Transaction record
      const newTransaction: Transaction = {
        id: `TRX-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: timestampStr,
        isoDate: now.toISOString(),
        type: trade.type,
        symbol: trade.stock.symbol,
        name: trade.stock.name,
        shares: trade.shares,
        price: trade.price,
        currency: trade.stock.currency,
        total: trade.total,
        fee: trade.fee,
        status: 'EXECUTED',
        notes: `Order dieksekusi secara real-time pada harga global ${trade.price}`,
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      // 2. Adjust User Cash Balance
      setUserProfile((prev) => {
        if (trade.stock.currency === 'USD') {
          const nextUSD =
            trade.type === 'BUY'
              ? Math.max(0, prev.cashBalanceUSD - trade.total)
              : prev.cashBalanceUSD + trade.total;
          return { ...prev, cashBalanceUSD: Number(nextUSD.toFixed(2)) };
        } else {
          const nextIDR =
            trade.type === 'BUY'
              ? Math.max(0, prev.cashBalanceIDR - trade.total)
              : prev.cashBalanceIDR + trade.total;
          return { ...prev, cashBalanceIDR: Math.round(nextIDR) };
        }
      });

      // 3. Update Portfolio Holdings
      setHoldings((prev) => {
        const existingIndex = prev.findIndex((h) => h.symbol === trade.stock.symbol);

        if (trade.type === 'BUY') {
          if (existingIndex >= 0) {
            const existing = prev[existingIndex];
            const newTotalShares = existing.shares + trade.shares;
            const newTotalInvested = existing.shares * existing.avgBuyPrice + trade.shares * trade.price;
            const newAvgPrice = Number((newTotalInvested / newTotalShares).toFixed(2));

            const updatedHoldings = [...prev];
            updatedHoldings[existingIndex] = {
              ...existing,
              shares: newTotalShares,
              avgBuyPrice: newAvgPrice,
            };
            return updatedHoldings;
          } else {
            const newHolding: PortfolioHolding = {
              symbol: trade.stock.symbol,
              name: trade.stock.name,
              shares: trade.shares,
              avgBuyPrice: trade.price,
              currency: trade.stock.currency,
            };
            return [...prev, newHolding];
          }
        } else {
          // SELL
          if (existingIndex >= 0) {
            const existing = prev[existingIndex];
            const remainingShares = existing.shares - trade.shares;
            if (remainingShares <= 0) {
              return prev.filter((_, idx) => idx !== existingIndex);
            } else {
              const updatedHoldings = [...prev];
              updatedHoldings[existingIndex] = {
                ...existing,
                shares: remainingShares,
              };
              return updatedHoldings;
            }
          }
          return prev;
        }
      });
    },
    [userProfile.language]
  );

  // Filtered stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery) return stocks;
    const q = searchQuery.toLowerCase();
    return stocks.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }, [stocks, searchQuery]);

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. TradingView Top Header Bar */}
      <Header
        userProfile={userProfile}
        stocks={stocks}
        indices={indices}
        selectedCurrency={userProfile.selectedCurrency}
        onToggleCurrency={handleToggleCurrency}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenTrade={() => handleOpenTrade()}
        isLiveSyncing={isLiveSyncing}
        onToggleLiveSync={() => setIsLiveSyncing(!isLiveSyncing)}
        onSelectLanguage={handleSelectLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeNavTab={activeNavTab}
        onNavTabChange={(tab) => {
          setActiveNavTab(tab);
          if (tab === 'transactions' || tab === 'holdings') {
            setIsBottomDockOpen(true);
          }
        }}
      />

      {/* 2. Main Terminal Content (Directly matching Screenshot 228 layout) */}
      <main className="flex-1 w-full flex flex-col p-2 sm:p-4 gap-4">
        {/* Main Grid: Superchart on Left, Watchlist Drawer on Right */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 flex-1">
          {/* Left / Center: TradingView Superchart (8 cols on XL) */}
          <div className="xl:col-span-8 flex flex-col">
            <StockChart
              stock={activeStock}
              candles={candles}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
              selectedCurrency={userProfile.selectedCurrency}
              onOpenTrade={(stock, type) => handleOpenTrade(stock, type)}
              language={userProfile.language || 'id'}
            />
          </div>

          {/* Right: TradingView Watchlist & Market Insights Sidebar (4 cols on XL) */}
          <div className="xl:col-span-4 flex flex-col">
            <MarketWatchlist
              stocks={filteredStocks}
              indices={indices}
              activeSymbol={activeSymbol}
              onSelectStock={handleSelectStock}
              onOpenTrade={(stock, type) => handleOpenTrade(stock, type)}
              selectedCurrency={userProfile.selectedCurrency}
              language={userProfile.language || 'id'}
            />
          </div>
        </div>

        {/* 3. Bottom Dock Console: Real-time Transactions, Holdings, & Cash Balances */}
        <TradingViewBottomDock
          holdings={holdings}
          transactions={transactions}
          stocks={stocks}
          userProfile={userProfile}
          selectedCurrency={userProfile.selectedCurrency}
          language={userProfile.language || 'id'}
          onSelectStock={handleSelectStock}
          onOpenTrade={(stock, type) => handleOpenTrade(stock, type)}
          onOpenProfile={() => setIsProfileOpen(true)}
          isLiveSyncing={isLiveSyncing}
          isOpen={isBottomDockOpen}
          onToggleOpen={() => setIsBottomDockOpen(!isBottomDockOpen)}
        />
      </main>

      {/* Profile & Settings & Language Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => setUserProfile(updated)}
      />

      {/* Real-time Trade Execution Modal */}
      <TradeModal
        isOpen={tradeModalState.isOpen}
        onClose={() => setTradeModalState((prev) => ({ ...prev, isOpen: false }))}
        stock={tradeModalState.stock}
        initialType={tradeModalState.initialType}
        userProfile={userProfile}
        holdings={holdings}
        onExecuteTrade={handleExecuteTrade}
      />
    </div>
  );
}
