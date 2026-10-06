import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Wallet,
  Settings,
  HelpCircle,
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { formatCurrency } from '../../utils/format';

export const Topbar: React.FC = () => {
  const { user, toggleTradingMode, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/market?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCurrencyToggle = () => {
    updateProfile({
      currencyPreference: user.currencyPreference === 'USD' ? 'IDR' : 'USD',
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const activeCashFormatted =
    user.currencyPreference === 'USD'
      ? formatCurrency(user.cashBalanceUSD, 'USD')
      : formatCurrency(user.cashBalanceIDR, 'IDR');

  return (
    <header className="h-16 bg-[#0e0e0e] border-b border-[#222222] px-4 sm:px-6 flex items-center justify-between gap-4 z-20 select-none">
      {/* Left: Quick Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-md w-full relative hidden sm:block">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari simbol, koin, atau saham (Ctrl+K)..."
          className="w-full bg-[#161616] border border-[#282828] focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-all"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto">
        {/* Trading Mode Switcher: DEMO ($10,000) vs REAL */}
        <button
          onClick={toggleTradingMode}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 border transition-all cursor-pointer ${
            user.tradingMode === 'DEMO'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
          title="Klik untuk beralih antara Akun Riil dan Simulasi Paper Trading"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              user.tradingMode === 'DEMO' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
            }`}
          />
          <span>{user.tradingMode === 'DEMO' ? 'DEMO $10K' : 'REAL RDN'}</span>
        </button>

        {/* Currency Switcher ($ USD / Rp IDR) */}
        <button
          onClick={handleCurrencyToggle}
          className="px-2.5 py-1.5 rounded-xl bg-[#1a1a1a] hover:bg-[#242424] border border-[#2a2a2a] text-xs font-bold font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
          title="Ganti tampilan mata uang saldo"
        >
          {user.currencyPreference === 'USD' ? '$ USD' : 'Rp IDR'}
        </button>

        {/* Cash Balance Display Shortcut to Wallet */}
        <div
          onClick={() => navigate('/wallet')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141414] border border-[#262626] hover:border-emerald-500/40 cursor-pointer transition-all"
          title="Buka Dompet & Deposit"
        >
          <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold font-mono text-white">{activeCashFormatted}</span>
        </div>

        {/* Notifications Icon with Badge */}
        <button
          onClick={() => navigate('/notifications')}
          className="p-2 rounded-xl bg-[#161616] hover:bg-[#222222] border border-[#282828] text-neutral-300 hover:text-white transition-colors relative cursor-pointer"
          title="Pusat Notifikasi"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full" />
        </button>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl bg-[#161616] hover:bg-[#222222] border border-[#282828] cursor-pointer transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center font-bold text-black text-xs shadow">
              {user.fullName.charAt(0) || 'U'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 mt-2 w-56 bg-[#141414] border border-[#282828] rounded-2xl shadow-2xl p-2 z-50 text-xs font-sans animate-in fade-in"
              onClick={() => setShowDropdown(false)}
            >
              <div className="p-3 border-b border-[#222222] mb-1">
                <div className="font-bold text-white truncate">{user.fullName}</div>
                <div className="text-[11px] text-neutral-400 font-mono truncate">{user.email}</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase font-mono">
                    {user.role}
                  </span>
                  <span className="text-[9px] text-neutral-500 font-mono">PIN: ••••••</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/settings')}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#222222] text-neutral-200 flex items-center gap-2.5 cursor-pointer"
              >
                <Settings className="w-4 h-4 text-neutral-400" />
                <span>Pengaturan Akun</span>
              </button>

              <button
                onClick={() => navigate('/wallet')}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#222222] text-neutral-200 flex items-center gap-2.5 cursor-pointer"
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
                <span>Deposit / Withdraw</span>
              </button>

              <button
                onClick={() => navigate('/help')}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-[#222222] text-neutral-200 flex items-center gap-2.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-neutral-400" />
                <span>Pusat Bantuan & FAQ</span>
              </button>

              {user.role === 'admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-500/10 text-purple-300 flex items-center gap-2.5 cursor-pointer border-t border-[#222222] mt-1 pt-2 font-bold"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>Admin Dashboard</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 flex items-center gap-2.5 cursor-pointer border-t border-[#222222] mt-1 pt-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun (Logout)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
