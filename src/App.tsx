import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { StockChart } from './components/StockChart';
import { MarketWatchlist } from './components/MarketWatchlist';
import { TradingViewBottomDock } from './components/TradingViewBottomDock';
import { ProfileModal } from './components/ProfileModal';
import { TradeModal } from './components/TradeModal';
import { PasscodeModal } from './components/PasscodeModal';
import { SearchModal } from './components/SearchModal';
import { LoginPage } from './components/LoginPage';
import { MarketScreenerPage } from './components/MarketScreenerPage';
import { PortfolioPage } from './components/PortfolioPage';
import { TransactionsPage } from './components/TransactionsPage';
import { CommunityPage } from './components/CommunityPage';
import { BrokerPage } from './components/BrokerPage';
import { DashboardOverviewPage } from './components/DashboardOverviewPage';
import { MarketHeatmapPage } from './components/MarketHeatmapPage';
import { EconomicCalendarPage } from './components/EconomicCalendarPage';
import { PriceAlertModal } from './components/PriceAlertModal';
import { IndicatorsModal } from './components/IndicatorsModal';
import { FundamentalModal } from './components/FundamentalModal';
import { LandingPage } from './components/LandingPage';
import { OrderBook } from './components/OrderBook';
import { WalletPage } from './components/WalletPage';
import { HelpCenterPage } from './components/HelpCenterPage';
import { TraderAnalyticsPage } from './components/TraderAnalyticsPage';
import {
  INITIAL_USER_PROFILE,
  INITIAL_GLOBAL_INDICES,
  INITIAL_STOCKS,
  INITIAL_HOLDINGS,
  INITIAL_TRANSACTIONS,
  generateCandles,
} from './data/mockStocks';
import { DEFAULT_TECHNICAL_INDICATORS } from './data/marketTerminalData';
import {
  UserProfile,
  StockQuote,
  MarketIndex,
  PortfolioHolding,
  Transaction,
  Timeframe,
  CurrencyType,
  Language,
  PriceAlert,
  TechnicalIndicator,
  AppNotification,
  PineScriptItem,
  TradingAccountMode,
} from './types';
import { TRANSLATIONS } from './utils/translations';
import { playAlertChime } from './utils/audioAlert';
import {
  TrendingUp,
  Compass,
  Briefcase,
  History,
  MessageSquare,
  Building2,
  Search,
  LayoutDashboard,
  Grid,
  Calendar,
  Wallet,
  Award,
  HelpCircle,
  Home,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

export default function App() {
  // 0. Authentication Session State (emhaainunnajib36@gmail.com / Luxville710)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('market_enthusiast_auth_v1') === 'true';
  });

  // Auth & Landing View States
  const [authView, setAuthView] = useState<'LANDING' | 'AUTH'>('LANDING');
  const [loginInitialMode, setLoginInitialMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Real vs Demo Trading Mode
  const [tradingMode, setTradingMode] = useState<TradingAccountMode>(() => {
    return (localStorage.getItem('market_trading_mode_v1') as TradingAccountMode) || 'REAL';
  });

  const [demoBalanceUSD, setDemoBalanceUSD] = useState<number>(100000);
  const [demoBalanceIDR, setDemoBalanceIDR] = useState<number>(1500000000);

  // Active right tab on Superchart: 'watchlist' | 'orderbook'
  const [chartRightTab, setChartRightTab] = useState<'watchlist' | 'orderbook'>('watchlist');

  // Liquid Glass Mode state (Persisted in localStorage, default true)
  const [isLiquidGlass, setIsLiquidGlass] = useState<boolean>(() => {
    return localStorage.getItem('market_liquid_glass_v1') !== 'false';
  });

  const handleToggleLiquidGlass = useCallback(() => {
    setIsLiquidGlass((prev) => {
      const next = !prev;
      localStorage.setItem('market_liquid_glass_v1', String(next));
      return next;
    });
  }, []);

  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    localStorage.setItem('market_enthusiast_auth_v1', 'true');
    setUserProfile((prev) => ({
      ...prev,
      email: email || 'emhaainunnajib36@gmail.com',
    }));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('market_enthusiast_auth_v1');
    setAuthView('LANDING');
  };

  // 1. Persistent User Profile & Language & Balance (Achmad Husain)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('market_enthusiast_profile_v17b');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_USER_PROFILE,
          ...parsed,
          language: 'en', // User requested all text in English
        };
      } catch (e) {
        console.error('Failed to parse user profile', e);
      }
    }
    return INITIAL_USER_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('market_enthusiast_profile_v17b', JSON.stringify(userProfile));
  }, [userProfile]);

  // 2. Persistent Holdings State (11 Diverse Bluechip Stocks Valued at 1.7 Miliar Rupiah)
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    const saved = localStorage.getItem('market_enthusiast_holdings_v17b');
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
    localStorage.setItem('market_enthusiast_holdings_v17b', JSON.stringify(holdings));
  }, [holdings]);

  // 3. Persistent Real-Time Transactions History State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('market_enthusiast_transactions_v17b');
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
    localStorage.setItem('market_enthusiast_transactions_v17b', JSON.stringify(transactions));
  }, [transactions]);

  // 4. Live Global Stocks & Indices State
  const [stocks, setStocks] = useState<StockQuote[]>(INITIAL_STOCKS);
  const [indices, setIndices] = useState<MarketIndex[]>(INITIAL_GLOBAL_INDICES);
  const [activeSymbol, setActiveSymbol] = useState<string>('COMPOSITE');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [isLiveSyncing, setIsLiveSyncing] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Navigation Tab: 'dashboard' | 'chart' | 'screener' | 'heatmap' | 'calendar' | 'portfolio' | 'transactions' | 'community' | 'broker'
  const [activeNavTab, setActiveNavTab] = useState<string>('dashboard');

  // Bottom dock state
  const [isBottomDockOpen, setIsBottomDockOpen] = useState(true);

  // Technical Indicators State
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>(() => {
    const saved = localStorage.getItem('market_indicators_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_TECHNICAL_INDICATORS;
  });

  useEffect(() => {
    localStorage.setItem('market_indicators_v1', JSON.stringify(indicators));
  }, [indicators]);

  // Price Alerts Engine State
  const [alerts, setAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('market_alerts_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'alt-1',
        symbol: 'BBCA',
        targetPrice: 10500,
        condition: 'greater_than',
        triggered: false,
        createdAt: '28 Sep 2026',
        notifyBrowser: true,
        notifySound: true,
        note: 'Breakout all-time high resistance',
      },
      {
        id: 'alt-2',
        symbol: 'COMPOSITE',
        targetPrice: 6600,
        condition: 'greater_than',
        triggered: false,
        createdAt: '28 Sep 2026',
        notifyBrowser: true,
        notifySound: true,
        note: 'Resistance test IHSG index',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('market_alerts_v1', JSON.stringify(alerts));
  }, [alerts]);

  // Global App Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Order Executed: BUY 200 BBCA',
      message: 'Institutional paper trading order filled at Rp 10.050 / share.',
      time: '10 mins ago',
      type: 'ORDER',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'US Core PCE Release',
      message: 'Core PCE Price Index meets 0.2% MoM consensus expectation.',
      time: '1 hour ago',
      type: 'ECONOMIC',
      read: false,
    },
  ]);

  // 5. Modal States
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'payment' | 'profile' | 'language'>('profile');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isTradePinModalOpen, setIsTradePinModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isIndicatorsModalOpen, setIsIndicatorsModalOpen] = useState(false);
  const [isFundamentalModalOpen, setIsFundamentalModalOpen] = useState(false);

  const [pendingTrade, setPendingTrade] = useState<{
    stock: StockQuote;
    type: 'BUY' | 'SELL';
  } | null>(null);

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

  // 6. Real-Time Global Market Sync Engine & Alert Worker (Runs every 2.5 seconds)
  useEffect(() => {
    if (!isLiveSyncing) return;

    const interval = setInterval(() => {
      setStocks((prevStocks) => {
        const updated = prevStocks.map((stock) => {
          if (Math.random() > 0.40) return { ...stock, flashDirection: null };

          const tickPercent = (Math.random() - 0.49) * 0.004;
          const isIdrStock = stock.currency === 'IDR' && stock.symbol !== 'COMPOSITE';
          const decimals = stock.symbol === 'COMPOSITE' ? 4 : isIdrStock ? 0 : 2;
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

        // BACKGROUND PRICE ALERT WORKER: Check if any active price alert condition is satisfied
        alerts.forEach((alert) => {
          if (alert.triggered) return;
          const currentStock = updated.find((s) => s.symbol === alert.symbol);
          if (!currentStock) return;

          let isTriggered = false;
          if (alert.condition === 'greater_than' && currentStock.price >= alert.targetPrice) {
            isTriggered = true;
          } else if (alert.condition === 'less_than' && currentStock.price <= alert.targetPrice) {
            isTriggered = true;
          } else if (alert.condition === 'crossing') {
            if (Math.abs(currentStock.price - alert.targetPrice) / alert.targetPrice < 0.003) {
              isTriggered = true;
            }
          }

          if (isTriggered) {
            if (alert.notifySound) {
              playAlertChime();
            }
            setAlerts((curr) =>
              curr.map((a) =>
                a.id === alert.id
                  ? { ...a, triggered: true, triggeredAt: new Date().toLocaleTimeString() }
                  : a
              )
            );
            setNotifications((curr) => [
              {
                id: `notif-${Date.now()}`,
                title: `PRICE ALERT TRIGGERED: ${alert.symbol}`,
                message: `${alert.symbol} target price ${
                  currentStock.currency === 'IDR' ? 'Rp ' : '$'
                }${alert.targetPrice.toLocaleString()} reached! ${alert.note || ''}`,
                time: 'Just now',
                type: 'ALERT',
                read: false,
              },
              ...curr,
            ]);
          }
        });

        return updated;
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
  }, [isLiveSyncing, alerts]);

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
    // Requirement: When accessing Buy or Sell, user must enter security PIN first
    setPendingTrade({ stock, type });
    setIsTradePinModalOpen(true);
  };

  // Top Up / Deposit Handler for MetaMask & Debit Card
  const handleDepositSuccess = useCallback(
    (amountIDR: number, amountUSD: number, method: string) => {
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

      const depositTrx: Transaction = {
        id: `DEP-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: timestampStr,
        isoDate: now.toISOString(),
        type: 'BUY',
        symbol: 'DEPOSIT',
        name: `Deposit (${method})`,
        shares: 1,
        price: amountIDR,
        currency: 'IDR',
        total: amountIDR,
        fee: 0,
        status: 'EXECUTED',
        notes: `Balance deposit successful via ${method}`,
      };

      setTransactions((prev) => [depositTrx, ...prev]);
    },
    [userProfile.language]
  );

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
        notes: `Order executed in real-time at market price ${trade.price}`,
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      // 2. Adjust User Cash Balance
      if (tradingMode === 'DEMO') {
        if (trade.stock.currency === 'USD') {
          setDemoBalanceUSD((prev) =>
            trade.type === 'BUY'
              ? Math.max(0, prev - trade.total)
              : prev + trade.total
          );
        } else {
          setDemoBalanceIDR((prev) =>
            trade.type === 'BUY'
              ? Math.max(0, prev - trade.total)
              : prev + trade.total
          );
        }
      } else {
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
      }

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
    [userProfile.language, tradingMode]
  );

  const handleToggleTradingMode = useCallback(() => {
    setTradingMode((prev) => {
      const next = prev === 'REAL' ? 'DEMO' : 'REAL';
      localStorage.setItem('market_trading_mode_v1', next);
      setNotifications((n) => [
        {
          id: `notif-${Date.now()}`,
          title: next === 'DEMO' ? 'MODE DEMO AKTIF' : 'MODE REAL AKTIF',
          message:
            next === 'DEMO'
              ? 'Anda beralih ke Akun Demo ($100,000 USD virtual). Uji coba strategi tanpa risiko modal.'
              : 'Anda beralih ke Akun Real (RDN BCA). Transaksi akan menggunakan saldo riil.',
          time: 'Baru saja',
          type: 'SYSTEM',
          read: false,
        },
        ...n,
      ]);
      return next;
    });
  }, []);

  const handleUpdateBalance = useCallback((idrChange: number, usdChange: number) => {
    if (tradingMode === 'DEMO') {
      setDemoBalanceIDR((prev) => Math.max(0, prev + idrChange));
      setDemoBalanceUSD((prev) => Math.max(0, prev + usdChange));
    } else {
      setUserProfile((prev) => ({
        ...prev,
        cashBalanceIDR: Math.max(0, prev.cashBalanceIDR + idrChange),
        cashBalanceUSD: Math.max(0, prev.cashBalanceUSD + usdChange),
      }));
    }
  }, [tradingMode]);

  const effectiveProfile: UserProfile = useMemo(() => {
    if (tradingMode === 'DEMO') {
      return {
        ...userProfile,
        cashBalanceUSD: demoBalanceUSD,
        cashBalanceIDR: demoBalanceIDR,
        accountNumber: 'DEMO-VIRTUAL-100K',
      };
    }
    return userProfile;
  }, [userProfile, tradingMode, demoBalanceUSD, demoBalanceIDR]);

  // Filtered stocks based on search query
  const filteredStocks = useMemo(() => {
    if (!searchQuery) return stocks;
    const q = searchQuery.toLowerCase();
    return stocks.filter(
      (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }, [stocks, searchQuery]);

  const isId = userProfile.language === 'id';

  if (!isAuthenticated) {
    if (authView === 'AUTH') {
      return (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onBackToLanding={() => setAuthView('LANDING')}
          initialMode={loginInitialMode}
        />
      );
    }
    return (
      <LandingPage
        stocks={stocks}
        indices={indices}
        onEnterTerminal={() => {
          setIsAuthenticated(true);
          localStorage.setItem('market_enthusiast_auth_v1', 'true');
        }}
        onEnterDemo={() => {
          setTradingMode('DEMO');
          setIsAuthenticated(true);
          localStorage.setItem('market_enthusiast_auth_v1', 'true');
        }}
        onOpenLogin={() => {
          setLoginInitialMode('LOGIN');
          setAuthView('AUTH');
        }}
        onOpenRegister={() => {
          setLoginInitialMode('REGISTER');
          setAuthView('AUTH');
        }}
        language={userProfile.language}
        onSelectLanguage={handleSelectLanguage}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 1. TradingView Top Header Bar */}
      <Header
        userProfile={userProfile}
        stocks={stocks}
        indices={indices}
        selectedCurrency={userProfile.selectedCurrency}
        onToggleCurrency={handleToggleCurrency}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenProfileWithLock={() => {
          setProfileInitialTab('payment');
          setIsPasscodeModalOpen(true);
        }}
        onOpenProfileWithTab={(tab) => {
          setProfileInitialTab(tab);
          setIsPasscodeModalOpen(true);
        }}
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
        onLogout={handleLogout}
        notifications={notifications}
        onMarkAllNotificationsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearNotifications={() => setNotifications([])}
        tradingMode={tradingMode}
        onToggleTradingMode={handleToggleTradingMode}
        isLiquidGlass={isLiquidGlass}
        onToggleLiquidGlass={handleToggleLiquidGlass}
      />

      {/* 2. Interactive Navigation Ribbon (Switch between Dashboard, Superchart, Screener, Heatmap, Calendar, Portfolio, Transactions, Community, Broker) */}
      <div
        className={`px-3 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto select-none transition-all ${
          isLiquidGlass
            ? 'liquid-glass-subtle border-b border-white/10 backdrop-blur-xl'
            : 'bg-[#000000] border-b border-[#1c1f26]'
        }`}
      >
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setActiveNavTab('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'dashboard'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
            <span>{isId ? 'Dashboard' : 'Dashboard'}</span>
          </button>

          <button
            onClick={() => setActiveNavTab('chart')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'chart'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supercharts</span>
          </button>

          <button
            onClick={() => setActiveNavTab('screener')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'screener'
                ? 'bg-[#2962ff] text-white shadow-md shadow-blue-900/30'
                : 'text-neutral-300 hover:text-white hover:bg-[#111111] border border-[#20293d]'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-300" />
            <span>{isId ? 'Screener' : 'Screener'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => setActiveNavTab('heatmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'heatmap'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-emerald-400" />
            <span>Heatmap</span>
          </button>

          <button
            onClick={() => setActiveNavTab('calendar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'calendar'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => setActiveNavTab('portfolio')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'portfolio'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>{userProfile.language === 'en' ? 'Portfolio' : 'Portofolio'}</span>
          </button>

          <button
            onClick={() => setActiveNavTab('transactions')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'transactions'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>{userProfile.language === 'en' ? 'Orders' : 'Riwayat'}</span>
          </button>

          <button
            onClick={() => setActiveNavTab('wallet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'wallet'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isId ? 'Dompet' : 'Wallet'}</span>
          </button>

          <button
            onClick={() => setActiveNavTab('analytics')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'analytics'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{isId ? 'Analitik' : 'Analytics'}</span>
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
            onClick={() => setActiveNavTab('help')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeNavTab === 'help'
                ? 'bg-[#182338] text-white border border-[#27385a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#111111]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isId ? 'Bantuan & FAQ' : 'Help & FAQ'}</span>
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

        {/* Quick Search & Account Mode Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleTradingMode}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              tradingMode === 'DEMO'
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/40 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25'
            }`}
            title={
              isId
                ? 'Klik untuk beralih antara Akun Riil (RDN BCA) dan Akun Demo ($100,000 USD virtual)'
                : 'Click to switch between Real Account (RDN BCA) and Demo Paper Trading ($100,000 USD virtual)'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                tradingMode === 'DEMO' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
              }`}
            />
            <span>{tradingMode === 'DEMO' ? 'DEMO ($100K)' : 'REAL (RDN)'}</span>
          </button>

          {/* Liquid Glass Switcher in Ribbon */}
          <button
            onClick={handleToggleLiquidGlass}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isLiquidGlass
                ? 'bg-gradient-to-r from-cyan-500/25 via-blue-500/20 to-purple-500/25 border-cyan-400/50 text-cyan-200 shadow-md shadow-cyan-950/40 backdrop-blur-md'
                : 'bg-[#182338] text-neutral-400 border-[#27385a] hover:text-white'
            }`}
            title={
              isId
                ? 'Aktifkan / Nonaktifkan Efek Liquid Glass (Kaca Transparan & Refraksi Modern)'
                : 'Toggle Liquid Glass Effect (Frosted Glass & Specular Refraction)'
            }
          >
            <span>💎</span>
            <span className="hidden sm:inline">Glass</span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isLiquidGlass ? 'bg-cyan-400 animate-pulse' : 'bg-neutral-600'
              }`}
            />
          </button>

          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="px-3 py-1 rounded-xl bg-[#141a27] hover:bg-[#1c2438] text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-[#212b40] transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isId ? 'Cari Saham (Ctrl+K)' : 'Search (Ctrl+K)'}</span>
          </button>
        </div>
      </div>

      {/* Dynamic Liquid Glass Background Aurora Lights */}
      {isLiquidGlass && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/15 blur-[120px] animate-liquid-blob-1" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-cyan-500/12 blur-[140px] animate-liquid-blob-2" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-emerald-500/10 blur-[130px] animate-liquid-blob-1" />
        </div>
      )}

      {/* 3. Dynamic Page View Router */}
      <main className="flex-1 w-full flex flex-col relative overflow-x-hidden z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNavTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex-1 w-full flex flex-col"
          >
            {activeNavTab === 'dashboard' && (
              <DashboardOverviewPage
                stocks={stocks}
                indices={indices}
                holdings={holdings}
                userProfile={userProfile}
                selectedCurrency={userProfile.selectedCurrency}
                language={userProfile.language}
                onSelectStock={handleSelectStock}
                onNavigateToChart={() => setActiveNavTab('chart')}
                onNavigateToScreener={() => setActiveNavTab('screener')}
                onNavigateToPortfolio={() => setActiveNavTab('portfolio')}
                onNavigateToHeatmap={() => setActiveNavTab('heatmap')}
                onNavigateToCalendar={() => setActiveNavTab('calendar')}
                onOpenTrade={(stock) => handleOpenTrade(stock, 'BUY')}
                onOpenSearch={() => setIsSearchModalOpen(true)}
              />
            )}

            {activeNavTab === 'heatmap' && (
              <MarketHeatmapPage
                stocks={stocks}
                onSelectStock={handleSelectStock}
                onNavigateToChart={() => setActiveNavTab('chart')}
                language={userProfile.language}
                selectedCurrency={userProfile.selectedCurrency}
              />
            )}

            {activeNavTab === 'calendar' && (
              <EconomicCalendarPage language={userProfile.language} />
            )}

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
                onOpenDeposit={() => {
                  setProfileInitialTab('payment');
                  setIsPasscodeModalOpen(true);
                }}
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

            {activeNavTab === 'wallet' && (
              <WalletPage
                userProfile={effectiveProfile}
                selectedCurrency={userProfile.selectedCurrency}
                language={userProfile.language}
                onUpdateBalance={handleUpdateBalance}
                onOpenPinModal={(onSuccess) => {
                  setIsPasscodeModalOpen(true);
                }}
              />
            )}

            {activeNavTab === 'analytics' && (
              <TraderAnalyticsPage
                userProfile={effectiveProfile}
                transactions={transactions}
                holdings={holdings}
                language={userProfile.language}
              />
            )}

            {activeNavTab === 'help' && (
              <HelpCenterPage language={userProfile.language} />
            )}

            {activeNavTab === 'community' && (
              <CommunityPage
                language={userProfile.language}
                stocks={stocks}
                userProfile={userProfile}
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
                {/* Main Grid: Superchart on Left, Watchlist / Order Book Drawer on Right */}
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
                      onOpenAlertModal={() => setIsAlertModalOpen(true)}
                      onOpenIndicatorsModal={() => setIsIndicatorsModalOpen(true)}
                      onOpenFundamentalModal={() => setIsFundamentalModalOpen(true)}
                      indicators={indicators}
                      onToggleIndicator={(id) => {
                        setIndicators((prev) =>
                          prev.map((ind) =>
                            ind.id === id ? { ...ind, visible: !ind.visible } : ind
                          )
                        );
                      }}
                      onRemoveIndicator={(id) => {
                        setIndicators((prev) => prev.filter((ind) => ind.id !== id));
                      }}
                    />
                  </div>

                  {/* Right: TradingView Watchlist & Order Book L2 */}
                  <div className="xl:col-span-4 flex flex-col space-y-2">
                    {/* Right Tab Selector: Watchlist vs Order Book */}
                    <div className="flex items-center bg-[#10141e] p-1 rounded-xl border border-[#1e2638] text-xs font-bold shrink-0">
                      <button
                        onClick={() => setChartRightTab('watchlist')}
                        className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          chartRightTab === 'watchlist'
                            ? 'bg-[#1e293b] text-white shadow'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 text-blue-400" />
                        <span>{isId ? 'Watchlist' : 'Watchlist'}</span>
                      </button>
                      <button
                        onClick={() => setChartRightTab('orderbook')}
                        className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          chartRightTab === 'orderbook'
                            ? 'bg-[#1e293b] text-white shadow'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isId ? 'Order Book L2' : 'Order Book L2'}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      </button>
                    </div>

                    {chartRightTab === 'watchlist' ? (
                      <MarketWatchlist
                        stocks={filteredStocks}
                        indices={indices}
                        activeSymbol={activeSymbol}
                        onSelectStock={handleSelectStock}
                        onOpenTrade={(stock, type) => handleOpenTrade(stock, type)}
                        selectedCurrency={userProfile.selectedCurrency}
                        language={userProfile.language || 'id'}
                        alerts={alerts}
                        onOpenAlertModal={() => setIsAlertModalOpen(true)}
                        onNavigateToTab={(tab) => setActiveNavTab(tab as any)}
                        onOpenSearch={() => setIsSearchModalOpen(true)}
                      />
                    ) : (
                      <OrderBook
                        stock={activeStock}
                        language={userProfile.language || 'id'}
                        onSelectPrice={(price) => {
                          handleOpenTrade(activeStock, 'BUY');
                        }}
                        onQuickTrade={(stock, type) => {
                          handleOpenTrade(stock, type);
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Bottom Dock Console: Real-time Transactions, Holdings, Cash Balances, Pine Script, & Alerts */}
                <TradingViewBottomDock
                  holdings={holdings}
                  transactions={transactions}
                  stocks={stocks}
                  userProfile={userProfile}
                  selectedCurrency={userProfile.selectedCurrency}
                  language={userProfile.language || 'id'}
                  onSelectStock={handleSelectStock}
                  onOpenTrade={(stock, type) => handleOpenTrade(stock, type)}
                  onOpenProfile={() => {
                    setProfileInitialTab('payment');
                    setIsPasscodeModalOpen(true);
                  }}
                  isLiveSyncing={isLiveSyncing}
                  isOpen={isBottomDockOpen}
                  onToggleOpen={() => setIsBottomDockOpen(!isBottomDockOpen)}
                  alerts={alerts}
                  onDeleteAlert={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
                  onApplyPineScript={(script) => {
                    setNotifications((prev) => [
                      {
                        id: `notif-${Date.now()}`,
                        title: `PINE SCRIPT COMPILED: ${script.title}`,
                        message: `Pine Script successfully compiled and applied to Supercharts.`,
                        time: 'Just now',
                        type: 'SYSTEM',
                        read: false,
                      },
                      ...prev,
                    ]);
                  }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Passcode Security Gate Modal for Profile & Settings (PIN: 708951) */}
      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        onSuccess={() => {
          setIsPasscodeModalOpen(false);
          setIsProfileOpen(true);
        }}
        language={userProfile.language}
        actionType="profile"
      />

      {/* 4b. Passcode Security Gate Modal for Buy/Sell Orders (User requirement: ketika mengakses jual atau beli harus memasukkan pin) */}
      <PasscodeModal
        isOpen={isTradePinModalOpen}
        onClose={() => {
          setIsTradePinModalOpen(false);
          setPendingTrade(null);
        }}
        onSuccess={() => {
          setIsTradePinModalOpen(false);
          if (pendingTrade) {
            setTradeModalState({
              isOpen: true,
              stock: pendingTrade.stock,
              initialType: pendingTrade.type,
            });
            setPendingTrade(null);
          }
        }}
        language={userProfile.language}
        actionType="trade"
        title={userProfile.language === 'id' ? 'Otorisasi PIN Transaksi Jual / Beli' : 'Trade PIN Authorization (Buy / Sell)'}
        subtitle={userProfile.language === 'id' ? 'Verifikasi keamanan sebelum membuka formulir transaksi saham' : 'Security authorization before executing stock transactions'}
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

      {/* 6. Profile & Settings & Balance Editor Modal with MetaMask & Debit (Opens ONLY after PIN 708951 verified) */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        userProfile={userProfile}
        onUpdateProfile={(updated) => setUserProfile(updated)}
        onDepositSuccess={handleDepositSuccess}
        initialTab={profileInitialTab}
      />

      {/* 7. Real-time Trade Execution Modal */}
      <TradeModal
        isOpen={tradeModalState.isOpen}
        onClose={() => setTradeModalState((prev) => ({ ...prev, isOpen: false }))}
        stock={tradeModalState.stock}
        initialType={tradeModalState.initialType}
        userProfile={effectiveProfile}
        holdings={holdings}
        tradingMode={tradingMode}
        onExecuteTrade={handleExecuteTrade}
      />

      {/* 8. Price Alert Creation & List Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        activeStock={activeStock}
        alerts={alerts}
        onCreateAlert={(newAlt) => {
          const alertObj: PriceAlert = {
            ...newAlt,
            id: `alt-${Date.now()}`,
            createdAt: new Date().toLocaleDateString(),
            triggered: false,
          };
          setAlerts((prev) => [alertObj, ...prev]);
        }}
        onDeleteAlert={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
        language={userProfile.language}
      />

      {/* 9. Technical Indicators Selector & Strategy Modal */}
      <IndicatorsModal
        isOpen={isIndicatorsModalOpen}
        onClose={() => setIsIndicatorsModalOpen(false)}
        indicators={indicators}
        onToggleIndicator={(idOrType) => {
          setIndicators((prev) => {
            const found = prev.find((i) => i.id === idOrType || i.type === idOrType);
            if (found) {
              return prev.map((i) =>
                i.id === found.id ? { ...i, visible: !i.visible } : i
              );
            }
            // Add new indicator if not present
            return [
              ...prev,
              {
                id: `ind-${Date.now()}`,
                name: idOrType,
                type: idOrType as any,
                color: '#2962ff',
                params: { length: 20 },
                visible: true,
                overlay: true,
              },
            ];
          });
        }}
        onUpdateParams={(id, newParams) => {
          setIndicators((prev) =>
            prev.map((i) => (i.id === id ? { ...i, params: { ...i.params, ...newParams } } : i))
          );
        }}
        onApplyTemplate={(tpl) => {
          if (tpl === 'trend') {
            setIndicators([
              { id: 'ind-ema-50', name: 'EMA 50', type: 'EMA', color: '#f59e0b', params: { length: 50 }, visible: true, overlay: true },
              { id: 'ind-supertrend', name: 'Supertrend (10, 3)', type: 'SUPERTREND', color: '#06b6d4', params: { period: 10, multiplier: 3 }, visible: true, overlay: true },
              { id: 'ind-rsi-14', name: 'RSI 14', type: 'RSI', color: '#a855f7', params: { length: 14 }, visible: true, overlay: false },
            ]);
          } else if (tpl === 'volatility') {
            setIndicators([
              { id: 'ind-bb-20', name: 'Bollinger Bands (20, 2)', type: 'BB', color: '#10b981', params: { length: 20, mult: 2 }, visible: true, overlay: true },
              { id: 'ind-atr', name: 'ATR 14', type: 'ATR', color: '#ef4444', params: { length: 14 }, visible: true, overlay: false },
            ]);
          } else {
            setIndicators(DEFAULT_TECHNICAL_INDICATORS);
          }
        }}
        language={userProfile.language}
      />

      {/* 10. Fundamental Analysis & Statements Modal */}
      <FundamentalModal
        isOpen={isFundamentalModalOpen}
        onClose={() => setIsFundamentalModalOpen(false)}
        stock={activeStock}
        language={userProfile.language}
      />
    </div>
  );
}

