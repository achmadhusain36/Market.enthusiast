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
  LogOut,
  Bell,
  LayoutDashboard,
  Grid,
  Calendar,
  Camera,
  Sparkles,
} from 'lucide-react';
import { UserProfile, StockQuote, MarketIndex, CurrencyType, Language, AppNotification } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { formatCurrency } from '../utils/formatters';
import { MarketLogo } from './MarketLogo';
import { NotificationCenterModal } from './NotificationCenterModal';
import { TerminalLogo } from './TerminalLogo';

interface HeaderProps {
  userProfile: UserProfile;
  stocks: StockQuote[];
  indices: MarketIndex[];
  selectedCurrency: CurrencyType;
  onToggleCurrency: () => void;
  onOpenProfile: () => void;
  onOpenProfileWithLock: () => void;
  onOpenProfileWithTab?: (tab: 'payment' | 'profile' | 'language') => void;
  onOpenTrade: () => void;
  isLiveSyncing: boolean;
  onToggleLiveSync: () => void;
  onSelectLanguage: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSearch: () => void;
  activeNavTab: string;
  onNavTabChange: (tab: string) => void;
  onLogout?: () => void;
  notifications?: AppNotification[];
  onMarkAllNotificationsRead?: () => void;
  onClearNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userProfile,
  stocks,
  indices,
  selectedCurrency,
  onToggleCurrency,
  onOpenProfile,
  onOpenProfileWithLock,
  onOpenProfileWithTab,
  onOpenTrade,
  isLiveSyncing,
  onToggleLiveSync,
  onSelectLanguage,
  searchQuery,
  onSearchChange,
  onOpenSearch,
  activeNavTab,
  onNavTabChange,
  onLogout,
  notifications = [],
  onMarkAllNotificationsRead = () => {},
  onClearNotifications = () => {},
}) => {
  const t = TRANSLATIONS[userProfile.language || 'id'];
  const isId = userProfile.language === 'id';
  const [currentTimeWIB, setCurrentTimeWIB] = useState('');
  const [currentTimeEST, setCurrentTimeEST] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;


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
    <header id="main-tradingview-header" className="border-b border-[#1c1f26] bg-[#000000] select-none sticky top-0 z-40">
      {/* 1. Global Live Ticker Bar (Top Strip) */}
      <div className="border-b border-[#1c1f26] px-4 py-1 text-xs flex items-center justify-between overflow-x-auto gap-4 bg-[#000000]">
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
        {/* Left: Market Terminal Logo + Search + Nav Items */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          {/* Terminal Logo */}
          <div
            className="flex items-center gap-2 shrink-0 cursor-pointer"
            onClick={() => onNavTabChange('dashboard')}
            title="Kembali ke Dashboard Utama"
          >
            <TerminalLogo size="sm" showText={true} subtitle="Market Enthusiast" />
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

          {/* Navigation Links (Dashboard, Superchart, Screener, Heatmap, Calendar, Portfolio, Transactions, Community, Broker) */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            {/* 0. Dashboard Utama */}
            <button
              onClick={() => onNavTabChange('dashboard')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNavTab === 'dashboard'
                  ? 'text-white bg-[#1e222d] font-bold border border-[#2b3344]'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
              <span>{isId ? 'Dashboard' : 'Dashboard'}</span>
            </button>

            {/* 1. Superchart */}
            <button
              onClick={() => onNavTabChange('chart')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNavTab === 'chart'
                  ? 'text-white bg-[#1e222d] font-bold border border-[#2b3344]'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supercharts</span>
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
              <span>{isId ? 'Screener' : 'Screener'}</span>
            </button>

            {/* 3. Heatmap Pasar */}
            <button
              onClick={() => onNavTabChange('heatmap')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNavTab === 'heatmap'
                  ? 'text-white bg-[#1e222d] font-bold border border-[#2b3344]'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-emerald-400" />
              <span>Heatmap</span>
            </button>

            {/* 4. Kalender Ekonomi */}
            <button
              onClick={() => onNavTabChange('calendar')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNavTab === 'calendar'
                  ? 'text-white bg-[#1e222d] font-bold border border-[#2b3344]'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Calendar</span>
            </button>

            {/* 5. Portofolio Lengkap */}
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

            {/* 6. Riwayat Transaksi */}
            <button
              onClick={() => onNavTabChange('transactions')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeNavTab === 'transactions'
                  ? 'text-white bg-[#1e222d] font-bold border border-[#2b3344]'
                  : 'text-neutral-300 hover:text-white hover:bg-[#1e222d]/60'
              }`}
            >
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>{userProfile.language === 'en' ? 'Orders' : 'Riwayat'}</span>
            </button>

            {/* 7. Komunitas & Ide Analisis */}
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

            {/* 8. Broker */}
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

        {/* Right Actions: Language Switcher, Currency, Order, Upgrade, Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 relative">
          {/* Notification Center Bell Icon */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-1.5 rounded-lg bg-[#1e222d] hover:bg-[#252a38] text-neutral-300 hover:text-white border border-[#2a2e39] transition-colors cursor-pointer relative"
              title="Pusat Notifikasi / Alerts"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Popover Notification Modal */}
            <NotificationCenterModal
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
              notifications={notifications}
              onMarkAllAsRead={onMarkAllNotificationsRead}
              onClearAll={onClearNotifications}
              language={userProfile.language}
            />
          </div>
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

          {/* TradingView Blue Pro Pill Button */}
          <button
            id="btn-upgrade-pill"
            onClick={onOpenProfileWithLock}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#2962ff] to-[#1e54e4] hover:from-[#1e54e4] hover:to-[#1744b8] active:scale-95 text-white text-xs font-black tracking-wider shadow-md shadow-blue-900/30 transition-all cursor-pointer flex items-center gap-1.5 uppercase"
            title="Akun Trading PRO (Klik untuk Pengaturan & Saldo)"
          >
            <Sparkles className="w-3 h-3 text-cyan-300 fill-cyan-300" />
            <span>PRO</span>
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

          {/* User Profile Avatar: Displays uploaded photo or initial, LOCKED with 708951 */}
          <div className="relative">
            <button
              id="btn-user-avatar"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#c2410c] via-[#db2777] to-[#9333ea] flex items-center justify-center text-white font-bold text-sm shadow cursor-pointer border border-white/20 hover:scale-105 transition-transform relative"
              title={`${userProfile.name} • Profil Terlindungi Sandi`}
            >
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{userProfile.name.charAt(0) || 'A'}</span>
                )}
              </div>
              {/* Golden Mini Lock Badge */}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-500 border border-[#0c0f17] flex items-center justify-center text-[#0c0f17]">
                <Lock className="w-2 h-2 text-white fill-white" />
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-[#1e222d] border border-[#2a2e39] rounded-2xl shadow-2xl p-3.5 space-y-2.5 z-50 text-xs animate-in fade-in">
                {/* Profile Card Header with Photo */}
                <div className="border-b border-[#2a2e39] pb-3 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-[#c2410c] via-[#db2777] to-[#9333ea] flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 border border-white/20 relative group">
                    {userProfile.avatarUrl ? (
                      <img
                        src={userProfile.avatarUrl}
                        alt={userProfile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{userProfile.name.charAt(0) || 'A'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm truncate">{userProfile.name}</span>
                      <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20 font-bold shrink-0">
                        <Lock className="w-2.5 h-2.5" />
                        <span>{userProfile.language === 'id' ? 'Terkunci' : 'Protected'}</span>
                      </span>
                    </div>
                    <div className="text-neutral-400 text-[11px] truncate">{userProfile.email}</div>
                    <div className="mt-1 flex items-center justify-between text-neutral-300 font-mono-num text-[11px]">
                      <span>{userProfile.language === 'id' ? 'Saldo:' : 'Balance:'}</span>
                      <span className="text-emerald-400 font-bold">{activeCashFormatted}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {/* Quick Photo Upload & Avatar Settings Button */}
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      if (onOpenProfileWithTab) {
                        onOpenProfileWithTab('profile');
                      } else {
                        onOpenProfileWithLock();
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl bg-gradient-to-r from-[#2962ff]/20 to-transparent hover:from-[#2962ff]/30 text-white flex items-center justify-between cursor-pointer border border-[#2962ff]/30 group transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#2962ff] group-hover:scale-110 transition-transform" />
                      <span className="font-semibold">{userProfile.language === 'id' ? 'Upload / Ganti Foto Profil' : 'Upload / Change Photo'}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#2962ff]/30 text-[#82aaff] font-bold">
                      {userProfile.language === 'id' ? 'Foto' : 'Photo'}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenProfileWithLock();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#252936] text-neutral-200 flex items-center justify-between cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:text-amber-300" />
                      <span>{t.settingsSubtitle}</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono">
                      {userProfile.language === 'id' ? 'Kunci PIN' : 'PIN Lock'}
                    </span>
                  </button>

                  <div className="px-3 py-2 rounded-xl bg-[#161a24] border border-[#262c3b] flex items-center justify-between">
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

                  {onLogout && (
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 flex items-center gap-2 cursor-pointer transition-colors border border-rose-500/20"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span className="font-semibold">{userProfile.language === 'id' ? 'Keluar Akun (Logout)' : 'Sign Out (Logout)'}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
