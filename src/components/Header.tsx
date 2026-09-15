import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  TrendingUp,
  Settings,
  ArrowUpDown,
  RefreshCw,
  Globe,
  SlidersHorizontal,
  Wallet,
} from 'lucide-react';
import { UserProfile, StockQuote, MarketIndex, CurrencyType, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { formatCurrency } from '../utils/formatters';

interface HeaderProps {
  userProfile: UserProfile;
  stocks: StockQuote[];
  indices: MarketIndex[];
  selectedCurrency: CurrencyType;
  onToggleCurrency: () => void;
  onOpenProfile: () => void;
  onOpenTrade: () => void;
  isLiveSyncing: boolean;
  onToggleLiveSync: () => void;
  onSelectLanguage: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeNavTab: string;
  onNavTabChange: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  stocks,
  indices,
  selectedCurrency,
  onToggleCurrency,
  onOpenProfile,
  onOpenTrade,
  isLiveSyncing,
  onToggleLiveSync,
  onSelectLanguage,
  searchQuery,
  onSearchChange,
  activeNavTab,
  onNavTabChange,
}) => {
  const t = TRANSLATIONS[userProfile.language || 'id'];
  const [currentTimeWIB, setCurrentTimeWIB] = useState('');
  const [currentTimeEST, setCurrentTimeEST] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeWIB(
        now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' WIB'
      );
      setCurrentTimeEST(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' EDT'
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeCashFormatted =
    selectedCurrency === 'USD'
      ? formatCurrency(userProfile.cashBalanceUSD, 'USD')
      : formatCurrency(userProfile.cashBalanceIDR, 'IDR');

  return (
    <header id="main-tradingview-header" className="border-b border-[#1f242e] bg-[#0c0f17] select-none sticky top-0 z-40">
      {/* 1. Global Live Ticker Bar (Top Strip) */}
      <div className="border-b border-[#191d26] px-4 py-1 text-xs flex items-center justify-between overflow-x-auto gap-4 bg-[#090b12]">
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 font-medium text-neutral-300 text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLiveSyncing ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveSyncing ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-white font-bold tracking-wider">{t.liveMarket}</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">NYSE/NASDAQ:</span>
            <span className="text-emerald-400 font-bold">{t.nyseOpen}</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400">IDX:</span>
            <span className="text-emerald-400 font-bold">{t.idxActive}</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-neutral-400 text-[11px] font-mono-num border-l border-[#202735] pl-3">
            <span>JKT: <strong className="text-neutral-200">{currentTimeWIB}</strong></span>
            <span className="text-neutral-600">•</span>
            <span>NYC: <strong className="text-neutral-200">{currentTimeEST}</strong></span>
          </div>
        </div>

        {/* Live Indices Marquee */}
        <div className="flex items-center gap-4 overflow-hidden text-[11px] font-mono-num">
          {indices.slice(0, 5).map((idx) => {
            const isPos = idx.change >= 0;
            return (
              <div key={idx.symbol} className="flex items-center gap-1.5 shrink-0">
                <span className="text-neutral-400 font-medium">{idx.name}</span>
                <span className="text-neutral-200">{idx.value.toLocaleString()}</span>
                <span className={`font-semibold ${isPos ? 'text-[#22ab94]' : 'text-[#f23645]'}`}>
                  {isPos ? '+' : ''}{idx.changePercent.toFixed(2)}%
                </span>
              </div>
            );
          })}

          <button
            id="btn-toggle-sync"
            onClick={onToggleLiveSync}
            title="Klik untuk jeda/aktifkan sinkronisasi pasar"
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#161a24] hover:bg-[#1f2533] text-neutral-300 transition-colors cursor-pointer shrink-0 border border-[#242b3b]"
          >
            <RefreshCw className={`w-3 h-3 ${isLiveSyncing ? 'animate-spin text-emerald-400' : 'text-neutral-400'}`} style={{ animationDuration: '3s' }} />
            <span className="text-[10px] font-mono-num">{isLiveSyncing ? t.syncOn : t.syncPaused}</span>
          </button>
        </div>
      </div>

      {/* 2. Main TradingView Navigation Bar */}
      <div className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: TradingView Stylized Logo + Search + Nav Items */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0 cursor-pointer" onClick={() => onNavTabChange('chart')}>
            {/* TradingView shape icon */}
            <div className="w-8 h-8 rounded-lg bg-[#1e222d] border border-[#2a2e39] flex items-center justify-center text-white font-bold text-base tracking-tighter hover:border-emerald-500 transition-colors">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 28 28">
                <path d="M4 8h5v12H4V8zm7.5-4h5v16h-5V4zm7.5 7h5v9h-5v-9z"/>
              </svg>
            </div>
            <div className="hidden xl:block">
              <span className="text-sm font-bold text-white tracking-tight leading-none block">
                TradingView
              </span>
              <span className="text-[9px] text-neutral-400 leading-none">
                Market Enthusiast
              </span>
            </div>
          </div>

          {/* Search Pill: Cari (Ctrl+K) / Search (Ctrl+K) */}
          <div className="relative max-w-xs w-full hidden sm:block">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-[#1e222d] hover:bg-[#252936] focus:bg-[#252936] border border-[#2a2e39] focus:border-blue-500 rounded-full pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Navigation Links (Produk, Komunitas, Pasar, Broker, Lebih lanjut) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => onNavTabChange('chart')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeNavTab === 'chart'
                  ? 'text-white bg-[#1e222d] font-bold'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              {t.navProducts}
            </button>
            <button
              onClick={() => onNavTabChange('holdings')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeNavTab === 'holdings'
                  ? 'text-white bg-[#1e222d] font-bold'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              {t.navCommunity}
            </button>
            <button
              onClick={() => onNavTabChange('chart')}
              className="px-3 py-1.5 rounded-lg text-[#2962ff] font-bold hover:bg-[#1e222d] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>{t.navMarkets}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2962ff]"></span>
            </button>
            <button
              onClick={() => onNavTabChange('transactions')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeNavTab === 'transactions'
                  ? 'text-white bg-[#1e222d] font-bold'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              {t.navBrokers}
            </button>
            <button
              onClick={onOpenProfile}
              className="px-3 py-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-[#1e222d]/60 transition-colors cursor-pointer"
            >
              {t.navMore}
            </button>
          </nav>
        </div>

        {/* Right Actions: Language Switcher, Currency, Order, Upgrade, Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Direct Language Switcher Pill (Bahasa Indonesia / English) */}
          <div className="flex items-center bg-[#1e222d] border border-[#2a2e39] rounded-lg p-0.5 text-[11px] font-bold">
            <button
              id="btn-lang-id"
              onClick={() => onSelectLanguage('id')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                userProfile.language === 'id'
                  ? 'bg-[#2962ff] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Ganti ke Bahasa Indonesia"
            >
              <span>🇮🇩</span>
              <span>ID</span>
            </button>
            <button
              id="btn-lang-en"
              onClick={() => onSelectLanguage('en')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                userProfile.language === 'en'
                  ? 'bg-[#2962ff] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Switch to English"
            >
              <span>🇺🇸</span>
              <span>EN</span>
            </button>
          </div>

          {/* Currency Toggle ($ USD / Rp IDR) */}
          <button
            id="btn-currency-toggle"
            onClick={onToggleCurrency}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1e222d] hover:bg-[#272b38] border border-[#2a2e39] text-xs font-mono-num font-bold text-emerald-400 transition-colors cursor-pointer"
            title="Ganti tampilan mata uang USD / IDR"
          >
            {selectedCurrency === 'USD' ? '$ USD' : 'Rp IDR'}
          </button>

          {/* Quick Trade / Order Saham Button */}
          <button
            id="btn-order-saham"
            onClick={onOpenTrade}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#22ab94] hover:bg-[#1f9b87] active:scale-95 text-white text-xs font-bold shadow transition-all cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Order</span>
          </button>

          {/* TradingView Blue Upgrade Pill Button (matching screenshot) */}
          <button
            id="btn-upgrade-pill"
            onClick={onOpenProfile}
            className="px-3.5 py-1.5 rounded-full bg-[#2962ff] hover:bg-[#1e54e4] active:scale-95 text-white text-xs font-bold tracking-tight shadow-md shadow-blue-900/30 transition-all cursor-pointer"
          >
            {t.upgrade}
          </button>

          {/* Settings Button */}
          <button
            id="btn-open-settings"
            onClick={onOpenProfile}
            title={t.settings}
            className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-[#1e222d] transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Avatar: "A" in pinkish-purple circle (Achmad Husain, matching screenshot) */}
          <div className="relative">
            <button
              id="btn-user-avatar"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c2410c] via-[#db2777] to-[#9333ea] flex items-center justify-center text-white font-bold text-sm shadow cursor-pointer border border-white/20 hover:scale-105 transition-transform"
              title={`${userProfile.name} • Klik untuk profil`}
            >
              A
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1e222d] border border-[#2a2e39] rounded-xl shadow-2xl p-3 space-y-2 z-50 text-xs animate-in fade-in">
                <div className="border-b border-[#2a2e39] pb-2">
                  <div className="font-bold text-white text-sm">{userProfile.name}</div>
                  <div className="text-neutral-400 text-[11px]">{userProfile.email}</div>
                  <div className="mt-1 flex items-center justify-between text-neutral-300 font-mono-num text-[11px]">
                    <span>Saldo:</span>
                    <span className="text-emerald-400 font-bold">{activeCashFormatted}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenProfile();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#252936] text-neutral-200 flex items-center justify-between cursor-pointer"
                  >
                    <span>{t.settingsSubtitle}</span>
                    <Settings className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  <div className="px-2.5 py-2 rounded-lg bg-[#161a24] border border-[#262c3b] flex items-center justify-between">
                    <span className="text-neutral-300 font-medium">Language:</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSelectLanguage('id')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          userProfile.language === 'id' ? 'bg-[#2962ff] text-white' : 'text-neutral-400'
                        }`}
                      >
                        ID
                      </button>
                      <button
                        onClick={() => onSelectLanguage('en')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          userProfile.language === 'en' ? 'bg-[#2962ff] text-white' : 'text-neutral-400'
                        }`}
                      >
                        EN
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
