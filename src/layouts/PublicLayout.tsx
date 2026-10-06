import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { TerminalLogo } from '../components/TerminalLogo';
import { Footer } from '../components/layout/Footer';
import { useAuthStore } from '../store/useAuthStore';
import { ArrowRight, LayoutDashboard } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Public Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222222] px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <TerminalLogo size="md" showText={true} subtitle="NUSA TRADE" />
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-400">
          <Link to="/" className="hover:text-white transition-colors">Beranda</Link>
          <a href="/#features" className="hover:text-white transition-colors">Fitur Unggulan</a>
          <a href="/#markets" className="hover:text-white transition-colors">Pasar Global</a>
          <a href="/#security" className="hover:text-white transition-colors">Keamanan</a>
          <Link to="/help" className="hover:text-white transition-colors">Bantuan</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold font-mono flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Buka Terminal</span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-neutral-300 hover:text-white hover:bg-[#1a1a1a] transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-all"
              >
                <span>Daftar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Public Outlet */}
      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      {/* Global Public Footer */}
      <Footer />
    </div>
  );
};
