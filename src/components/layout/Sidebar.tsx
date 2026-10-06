import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Bookmark,
  Briefcase,
  ArrowUpDown,
  Wallet,
  History,
  Bell,
  Settings,
  HelpCircle,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { TerminalLogo } from '../TerminalLogo';

export const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/market', label: 'Market & Aset', icon: TrendingUp },
    { to: '/watchlist', label: 'Watchlist', icon: Bookmark },
    { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { to: '/trade', label: 'Trade / Order', icon: ArrowUpDown },
    { to: '/wallet', label: 'Dompet / Saldo', icon: Wallet },
    { to: '/history', label: 'Riwayat Transaksi', icon: History },
    { to: '/notifications', label: 'Notifikasi', icon: Bell },
    { to: '/settings', label: 'Pengaturan', icon: Settings },
    { to: '/help', label: 'Pusat Bantuan', icon: HelpCircle },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside
      className={`bg-[#0d0d0d] border-r border-[#222222] flex flex-col justify-between shrink-0 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#222222]">
          <div
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 cursor-pointer overflow-hidden min-w-0"
          >
            <TerminalLogo size="sm" showText={!collapsed} subtitle="NUSA TRADE" />
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-[#181818] hover:bg-[#242424] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title={collapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                      : 'text-neutral-400 hover:text-neutral-100 hover:bg-[#1a1a1a]'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}

          {/* Admin Dashboard shortcut if user role is admin */}
          {user.role === 'admin' && (
            <div className="pt-2 border-t border-[#222222] mt-2">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                      : 'text-purple-400/80 hover:text-purple-300 hover:bg-purple-500/10'
                  }`
                }
                title={collapsed ? 'Admin Panel' : undefined}
              >
                <Shield className="w-4 h-4 shrink-0 text-purple-400" />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full">
                    <span>Admin Panel</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                      ADM
                    </span>
                  </div>
                )}
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* Bottom User Profile Card */}
      <div className="p-3 border-t border-[#222222] bg-[#111111]/60">
        <div className="flex items-center justify-between gap-2">
          <div
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center font-bold text-black text-xs shrink-0 shadow">
              {user.fullName.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition-colors">
                  {user.fullName}
                </div>
                <div className="text-[10px] text-neutral-400 truncate font-mono">
                  {user.email}
                </div>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Keluar (Logout)"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
