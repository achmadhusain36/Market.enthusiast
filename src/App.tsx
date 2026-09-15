import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { StockChart } from './components/StockChart';
import { MarketWatchlist } from './components/MarketWatchlist';
import { TradingViewBottomDock } from './components/TradingViewBottomDock';
import { ProfileModal } from './components/ProfileModal';
import { TradeModal } from './components/TradeModal';
import { PasscodeModal } from './components/PasscodeModal';
import { SearchModal } from './components/SearchModal';
import { MarketScreenerPage } from './components/MarketScreenerPage';
import { PortfolioPage } from './components/PortfolioPage';
import { TransactionsPage } from './components/TransactionsPage';
import { CommunityPage } from './components/CommunityPage';
import { BrokerPage } from './components/BrokerPage';
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
import {
  TrendingUp,
  Compass,
  Briefcase,
  History,
  MessageSquare,
  Building2,
  Search,
  Lock,
} from 'lucide-react';

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

  // 4. Live Global Stocks & Indices State
  const [stocks, setStocks] = useState<StockQuote[]>(INITIAL_STOCKS);
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_GLOBAL_INDICES);
  const [activeSymbol, setActiveSymbol] = useState<string>('COMPOSITE');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Navigation Tab: 'chart' | 'screener' | 'portfolio' | 'transactions' | 'community' | 'broker'
  const [activeNavTab, setActiveNavTab] = useState<string>('chart');

  // Bottom dock state
  const [isBottomDockOpen, setIsBottomDockOpen] = useState(true);

  // 5. Modal States
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [tradeModalState, setTradeModalState] = useState<{
    isOpen: boolean;
    stock: StockQuote;
    initialType: 'BUY' | 'SELL';
  }>({
    isOpen: false,
    stock: INITIAL_STOCKS[0],
    initialType: 'BUY',
  });

  // Global Ctrl+K / Cmd+K listener for instant search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

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
      setStocks((prevStocks) => {
        return prevStocks.map((stock) => {
          if (Math.random() > 0.40) return { ...stock, flashDirection: null };

          const tickPercent = (Math.random() - 0.49) * 0.004;
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

  const isId = userProfile.language === 'id';

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
        onOpenProfileWithLock={() => setIsPasscodeModalOpen(true)}
        onOpenTrade={() => handleOpenTrade()}
        isLiveSyncing={isLiveSyncing}
        onToggleLiveSync={() => setIsLiveSyncing(!isLiveSyncing)}
        onSelectLanguage={handleSelectLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        activeNavTab={activeNavTab}
        onNavTabChange={(tab) => {
          setActiveNavTab(tab);
          if (tab === 'transactions' || tab === 'holdings') {
            setIsBottomDockOpen(true);
          }
        }}
      />

      {/* 2. Interactive Navigation Ribbon (Switch between Superchart, Screener, Portfolio, Transactions, Community, Broker) */}
      <div className="bg-[#0b0e17] border-b border-[#182030] px-3 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto select-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveNavTab('chart')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'chart'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#121724]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Superchart</span>
          </button>

          <button
            onClick={() => setActiveNavTab('screener')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'screener'
                ? 'bg-[#2962ff] text-white shadow-md shadow-blue-900/30'
                : 'text-neutral-300 hover:text-white hover:bg-[#121724] border border-[#20293d]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-300" />
            <span>{isId ? 'Cari Saham & Pantau' : 'Market Screener'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveNavTab('portfolio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'portfolio'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#121724]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isId ? 'Portofolio Saya' : 'My Portfolio'}</span>
          </button>

          <button
            onClick={() => setActiveNavTab('transactions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'transactions'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#121724]'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>{isId ? 'Riwayat Transaksi' : 'Order History'}</span>
          </button>

          <button
            onClick={() => setActiveNavTab('community')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'community'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#121724]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>{isId ? 'Ide Komunitas' : 'Community Ideas'}</span>
          </button>

          <button
            onClick={() => setActiveNavTab('broker')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'broker'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#121724]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-rose-400" />
            <span>{isId ? 'Status Broker' : 'Brokers'}</span>
          </button>
        </div>

        {/* Quick Search Launch Button & Locked Profile Pill */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="px-3 py-1 rounded-xl bg-[#141a27] hover:bg-[#1c2438] text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-[#212b40] transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isId ? 'Cari Saham (Ctrl+K)' : 'Search (Ctrl+K)'}</span>
          </button>

          <button
            onClick={() => setIsPasscodeModalOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center gap-1 border border-amber-500/30 transition-colors cursor-pointer"
            title="Profil Achmad Husain dilindungi sandi 708951"
          >
            <Lock className="w-3 h-3" />
            <span className="hidden sm:inline">PIN 708951</span>
          </button>
        </div>
      </div>

      {/* 3. Dynamic Page View Router */}
      <main className="flex-1 w-full flex flex-col">
        {activeNavTab === 'screener' && (
          <MarketScreenerPage
            stocks={stocks}
            indices={indices}
            onSelectStock={handleSelectStock}
            onOpenTrade={(stock) => handleOpenTrade(stock, 'BUY')}
            selectedCurrency={userProfile.selectedCurrency}
            language={userProfile.language}
            onNavigateToChart={() => setActiveNavTab('chart')}
          />
        )}

        {activeNavTab === 'portfolio' && (
          <PortfolioPage
            holdings={holdings}
            stocks={stocks}
            userProfile={userProfile}
            selectedCurrency={userProfile.selectedCurrency}
            language={userProfile.language}
            onSelectStock={handleSelectStock}
            onOpenTrade={(stock, type) => handleOpenTrade(stock, type)}
            onOpenSearch={() => setIsSearchModalOpen(true)}
            onNavigateToChart={() => setActiveNavTab('chart')}
          />
        )}

        {activeNavTab === 'transactions' && (
          <TransactionsPage
            transactions={transactions}
            stocks={stocks}
            selectedCurrency={userProfile.selectedCurrency}
            isLiveSyncing={isLiveSyncing}
            language={userProfile.language}
            onSelectStock={handleSelectStock}
            onNavigateToChart={() => setActiveNavTab('chart')}
            onOpenTrade={() => handleOpenTrade()}
          />
        )}

        {activeNavTab === 'community' && (
          <CommunityPage
            language={userProfile.language}
            stocks={stocks}
            onSelectStock={handleSelectStock}
            onNavigateToChart={() => setActiveNavTab('chart')}
          />
        )}

        {activeNavTab === 'broker' && (
          <BrokerPage
            language={userProfile.language}
            userProfile={userProfile}
            onOpenTrade={() => handleOpenTrade()}
          />
        )}

        {activeNavTab === 'chart' && (
          <div className="flex-1 w-full flex flex-col p-2 sm:p-4 gap-4">
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

            {/* Bottom Dock Console: Real-time Transactions, Holdings, & Cash Balances */}
            <TradingViewBottomDock
              holdings={holdings}
              transactions={transactions}
              stocks={stocks}
              userProfile={userProfile}
              selectedCurrency={userProfile.selectedCurrency}
              language={userProfile.language || 'id'}
              onSelectStock={handleSelectStock}
              onOpenTrade={(stock, type) => handleOpenTrade(stock, type)}
              onOpenProfile={() => setIsPasscodeModalOpen(true)}
              isLiveSyncing={isLiveSyncing}
              isOpen={isBottomDockOpen}
              onToggleOpen={() => setIsBottomDockOpen(!isBottomDockOpen)}
            />
          </div>
        )}
      </main>

      {/* 4. Passcode Security Gate Modal (PIN: 708951) */}
      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        onSuccess={() => {
          setIsPasscodeModalOpen(false);
          setIsProfileOpen(true);
        }}
        language={userProfile.language}
      />

      {/* 5. Global Search Modal (Ctrl+K or search bar click) */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        stocks={stocks}
        indices={indices}
        onSelectStock={(symbol) => {
          handleSelectStock(symbol);
          setActiveNavTab('chart');
        }}
        onOpenTrade={(stock) => handleOpenTrade(stock, 'BUY')}
        selectedCurrency={userProfile.selectedCurrency}
        language={userProfile.language}
      />

      {/* 6. Profile & Settings & Balance Editor Modal (Opens ONLY after PIN 708951 verified) */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => setUserProfile(updated)}
      />

      {/* 7. Real-time Trade Execution Modal */}
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

