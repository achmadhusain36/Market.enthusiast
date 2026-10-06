import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  Users,
  Coins,
  History,
  Megaphone,
  ArrowLeft,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { ToastContainer } from '../components/ui/Toast';
import { TerminalLogo } from '../components/TerminalLogo';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const adminNav = [
    { to: '/admin', label: 'Ringkasan Admin', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Kelola Pengguna', icon: Users },
    { to: '/admin/assets', label: 'Kelola Aset & Pasar', icon: Coins },
    { to: '/admin/transactions', label: 'Kelola Transaksi', icon: History },
    { to: '/admin/announcements', label: 'Broadcast Pengumuman', icon: Megaphone },
  ];

  return (
    <div className="h-screen w-screen bg-[#070707] text-[#fafafa] flex overflow-hidden font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-[#0d0d0d] border-r border-[#222222] flex flex-col justify-between shrink-0 select-none">
        <div>
          {/* Header */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#222222]">
            <TerminalLogo size="sm" showText={true} subtitle="ADMIN PORTAL" />
          </div>

          <div className="p-3">
            <div className="px-3 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>ROLE: ROOT ADMINISTRATOR</span>
            </div>

            <nav className="space-y-1">
              {adminNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                          : 'text-neutral-400 hover:text-white hover:bg-[#1a1a1a]'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Back to User App */}
        <div className="p-3 border-t border-[#222222] space-y-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#2a2a2a] text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Kembali ke Terminal Trading</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#0e0e0e] border-b border-[#222222] px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <h2 className="text-sm font-bold font-mono text-purple-300">
              NUSA ADMINISTRATIVE CONSOLE
            </h2>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-neutral-400 font-mono">Masuk sebagai: {user.email}</span>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold border border-red-500/30 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Admin Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#070707]">
          <div className="max-w-7xl mx-auto w-full pb-12">
            <Outlet />
          </div>
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
