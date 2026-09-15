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
  Lock,
  Compass,
  Briefcase,
  History,
  MessageSquare,
  Building2,
} from 'lucide-react';
import { UserProfile, StockQuote, MarketIndex, CurrencyType, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { formatCurrency } from '../utils/formatters';
import { MarketLogo } from './MarketLogo';

interface HeaderProps {
  userProfile: UserProfile;
  stocks: StockQuote[];
  indices: MarketIndex[];
  selectedCurrency: CurrencyType;
  onToggleCurrency: () => void;
  onOpenProfile: () => void;
  onOpenProfileWithLock: () => void;
  onOpenTrade: () => void;
  isLiveSyncing: boolean;
  onToggleLiveSync: () => void;
  onSelectLanguage: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSearch: () => void;
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
  onOpenProfileWithLock,
  onOpenTrade,
  isLiveSyncing,
  onToggleLiveSync,
  onSelectLanguage,
  searchQuery,
  onSearchChange,
  onOpenSearch,
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
            <div className="flex items-center gap-1">
              <MarketLogo market="NASDAQ" size="xs" />
              <MarketLogo market="NYSE" size="xs" />
              <span className="text-emerald-400 font-bold ml-1">{t.nyseOpen}</span>
            </div>
            <span className="text-neutral-600">|</span>
            <div className="flex items-center gap-1">
              <MarketLogo market="IDX" size="xs" />
              <span className="text-emerald-400 font-bold ml-1">{t.idxActive}</span>
            </div>
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

          {/* Interactive Search Bar: Click or Press Ctrl+K opens SearchModal */}
          <div
            onClick={onOpenSearch}
            className="relative max-w-xs w-full hidden sm:flex items-center cursor-pointer group"
          >
            <Search className="w-4 h-4 text-neutral-400 group-hover:text-[#2962ff] absolute left-3 transition-colors" />
            <div className="w-full bg-[#1e222d] group-hover:bg-[#252a38] border border-[#2a2e39] group-hover:border-[#2962ff]/60 rounded-full pl-9 pr-8 py-1.5 text-xs text-neutral-400 group-hover:text-neutral-200 transition-colors flex items-center justify-between">
              <span>{searchQuery ? searchQuery : (userProfile.language === 'en' ? 'Search stocks (Ctrl+K)' : 'Cari saham & pantau (Ctrl+K)')}</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#161a24] text-[10px] text-neutral-500 border border-[#273042] font-mono">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Mobile Search Button */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 rounded-lg bg-[#1e222d] hover:bg-[#252936] text-neutral-300 hover:text-white border border-[#2a2e39] cursor-pointer"
            title="Cari Saham dan Pantau"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Navigation Links (Produk, Pasar, Portofolio, Komunitas, Broker) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            {/* 1. Superchart */}
            <button
              onClick={() => onNavTabChange('chart')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNavTab === 'chart'
                  ? 'text-white bg-[#1e222d] font-bold border border-[#2b3344]'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              <span>{t.navProducts}</span>
            </button>

            {/* 2. Cari Saham & Pantau (Pasar / Screener) */}
            <button
              onClick={() => onNavTabChange('screener')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNavTab === 'screener'
                  ? 'text-[#2962ff] bg-[#1e222d] font-bold border border-[#2962ff]/40 shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.navMarkets}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#2962ff]"></span>
            </button>

            {/* 3. Portofolio Lengkap */}
            <button
              onClick={() => onNavTabChange('portfolio')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNavTab === 'portfolio'
                  ? 'text-white bg-[#1e222d] font-bold border border-[#2b3344]'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              <span>{userProfile.language === 'en' ? 'Portfolio' : 'Portofolio'}</span>
            </button>

            {/* 4. Riwayat Transaksi */}
            <button
              onClick={() => onNavTabChange('transactions')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNavTab === 'transactions'
                  ? 'text-white bg-[#1e222d] font-bold border border-[#2b3344]'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>{userProfile.language === 'en' ? 'Transactions' : 'Riwayat'}</span>
            </button>

            {/* 5. Komunitas & Ide Analisis */}
            <button
              onClick={() => onNavTabChange('community')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNavTab === 'community'
                  ? 'text-white bg-[#1e222d] font-bold border border-[#2b3344]'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              <span>{t.navCommunity}</span>
            </button>

            {/* 6. Broker */}
            <button
              onClick={() => onNavTabChange('broker')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNavTab === 'broker'
                  ? 'text-white bg-[#1e222d] font-bold border border-[#2b3344]'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              <span>{t.navBrokers}</span>
            </button>
          </nav>
        </div>

        {/* Right Actions: Language Switcher, Currency, Order, Upgrade, Profile Avatar (Locked with 708951) */}
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
            onClick={onOpenProfileWithLock}
            className="px-3.5 py-1.5 rounded-full bg-[#2962ff] hover:bg-[#1e54e4] active:scale-95 text-white text-xs font-bold tracking-tight shadow-md shadow-blue-900/30 transition-all cursor-pointer"
          >
            {t.upgrade}
          </button>

          {/* Settings Button: Locked with Passcode 708951 */}
          <button
            id="btn-open-settings"
            onClick={onOpenProfileWithLock}
            title={`${t.settings} • Dilindungi Sandi PIN`}
            className="p-1.5 rounded-lg text-neutral-300 hover:text-white hover:bg-[#1e222d] transition-colors cursor-pointer relative"
          >
            <Settings className="w-4 h-4" />
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0c0f17]"></span>
          </button>

          {/* User Profile Avatar: "A" in pinkish-purple circle (Achmad Husain, LOCKED with 708951) */}
          <div className="relative">
            <button
              id="btn-user-avatar"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c2410c] via-[#db2777] to-[#9333ea] flex items-center justify-center text-white font-bold text-sm shadow cursor-pointer border border-white/20 hover:scale-105 transition-transform relative"
              title={`${userProfile.name} • Profil Terkunci Sandi (708951)`}
            >
              <span>A</span>
              {/* Golden Mini Lock Badge */}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 border border-[#0c0f17] flex items-center justify-center text-[#0c0f17]">
                <Lock className="w-2 h-2 text-white fill-white" />
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1e222d] border border-[#2a2e39] rounded-xl shadow-2xl p-3 space-y-2 z-50 text-xs animate-in fade-in">
                <div className="border-b border-[#2a2e39] pb-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{userProfile.name}</span>
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-bold">
                      <Lock className="w-2.5 h-2.5" />
                      <span>PIN 708951</span>
                    </span>
                  </div>
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
                      onOpenProfileWithLock();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#252936] text-neutral-200 flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300" />
                      <span>{t.settingsSubtitle}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono">
                      Kunci
                    </span>
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
