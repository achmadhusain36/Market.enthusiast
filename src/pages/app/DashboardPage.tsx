import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpDown,
  Bookmark,
  Bell,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  Activity,
  Layers,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useMarketData } from '../../hooks/useMarketData';
import { formatCurrency, formatPercent } from '../../utils/format';
import { MarketLogo } from '../../components/MarketLogo';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { totalNAV_USD, totalNAV_IDR, positions, orders } = usePortfolio();
  const { assets } = useMarketData();
  const navigate = useNavigate();

  const isUSD = user.currencyPreference === 'USD';
  const displayTotal = isUSD ? formatCurrency(totalNAV_USD, 'USD') : formatCurrency(totalNAV_IDR, 'IDR');

  // Key assets for mini charts
  const keySymbols = ['BTC/USD', 'ETH/USD', 'NVDA', 'BBCA.JK'];
  const keyAssets = assets.filter((a) => keySymbols.includes(a.symbol));

  const quickWatchlist = assets.slice(0, 5);

  return (
    <div className="space-y-6 select-none font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black font-mono text-white">
              Halo, {user.fullName}
            </h1>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                user.tradingMode === 'DEMO'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              }`}
            >
              {user.tradingMode === 'DEMO' ? 'AKUN DEMO ($10K)' : 'AKUN RIIL (RDN)'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            {user.accountNumber} • Terminal Multi-Aset Global Aktif
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/market')}
            leftIcon={<TrendingUp className="w-3.5 h-3.5" />}
          >
            Screener Pasar
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate('/trade')}
            leftIcon={<ArrowUpDown className="w-3.5 h-3.5" />}
          >
            Buka Form Order
          </Button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total NAV */}
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Total Saldo Portofolio</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {displayTotal}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+2.45% (Hari Ini)</span>
          </div>
        </Card>

        {/* Cash Balance */}
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Saldo Tunai Tersedia</span>
            <span className="text-[10px] text-neutral-500 font-mono">SIAP TRADE</span>
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {isUSD
              ? formatCurrency(user.cashBalanceUSD, 'USD')
              : formatCurrency(user.cashBalanceIDR, 'IDR')}
          </div>
          <div className="text-xs text-neutral-400 font-mono">
            Mode: {user.tradingMode === 'DEMO' ? 'Paper Trading' : 'Kas Riil BCA'}
          </div>
        </Card>

        {/* Total Posisi Aktif */}
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Posisi Terbuka</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white tracking-tight">
            {positions.length} Aset
          </div>
          <div className="text-xs text-neutral-400">
            Kripto, Saham IDX & Wall Street
          </div>
        </Card>

        {/* Win Rate & Profil Risiko */}
        <Card className="space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Tingkat Kemenangan (Win Rate)</span>
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 tracking-tight">
            68.5%
          </div>
          <div className="text-xs text-neutral-400">
            Berdasarkan 32 order terakhir
          </div>
        </Card>
      </div>

      {/* 3. Main Market Highlights (Mini-Charts) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Pasar Utama Real-Time</span>
          </h3>
          <button
            onClick={() => navigate('/market')}
            className="text-xs text-emerald-400 hover:underline cursor-pointer"
          >
            Lihat Semua Aset →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyAssets.map((asset) => {
            const isPos = asset.changePercent24h >= 0;
            return (
              <Card
                key={asset.id}
                hoverEffect
                onClick={() => navigate(`/market/${encodeURIComponent(asset.symbol)}`)}
                className="cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MarketLogo market={asset.market} size="xs" />
                    <div>
                      <div className="text-xs font-bold font-mono text-white">{asset.symbol}</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[100px]">
                        {asset.name}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-xs font-mono font-bold flex items-center gap-0.5 ${
                      isPos ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{formatPercent(asset.changePercent24h)}</span>
                  </div>
                </div>

                <div className="text-lg font-black font-mono text-white">
                  {formatCurrency(asset.price, asset.currency)}
                </div>

                {/* Sparkline Visual Simulation */}
                <div className="h-8 flex items-end gap-1 pt-1">
                  {asset.sparkline.map((val, idx) => {
                    const min = Math.min(...asset.sparkline);
                    const max = Math.max(...asset.sparkline);
                    const heightPercent = max > min ? Math.max(15, ((val - min) / (max - min)) * 100) : 50;
                    return (
                      <div
                        key={idx}
                        className={`flex-1 rounded-sm ${
                          isPos ? 'bg-emerald-500/30' : 'bg-red-500/30'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Grid: Quick Watchlist + Recent Activity + System Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Watchlist (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-cyan-400" />
              <span>Watchlist Pantauan Cepat</span>
            </h3>
            <button
              onClick={() => navigate('/watchlist')}
              className="text-xs text-emerald-400 hover:underline cursor-pointer"
            >
              Kelola Watchlist →
            </button>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-[#1f1f1f]">
              {quickWatchlist.map((asset) => {
                const isPos = asset.changePercent24h >= 0;
                return (
                  <div
                    key={asset.id}
                    onClick={() => navigate(`/market/${encodeURIComponent(asset.symbol)}`)}
                    className="p-3.5 flex items-center justify-between hover:bg-[#161616] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MarketLogo market={asset.market} size="xs" />
                      <div>
                        <div className="text-xs font-bold font-mono text-white">{asset.symbol}</div>
                        <div className="text-[10px] text-neutral-400">{asset.name}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-white">
                        {formatCurrency(asset.price, asset.currency)}
                      </div>
                      <div
                        className={`text-[11px] font-semibold ${
                          isPos ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {formatPercent(asset.changePercent24h)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Recent Activity & Announcement (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Orders */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-amber-400" />
              <span>Aktivitas Order Terbaru</span>
            </h3>

            <Card className="p-0 overflow-hidden">
              <div className="divide-y divide-[#1f1f1f]">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="p-3.5 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className={ord.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}>
                          {ord.type}
                        </span>
                        <span>{ord.shares} {ord.symbol}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500">{ord.timestamp}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">
                        {formatCurrency(ord.total, ord.currency)}
                      </div>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* System Announcement */}
          <div className="p-4 rounded-2xl bg-[#141814] border border-emerald-500/30 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold font-mono">
              <Bell className="w-4 h-4" />
              <span>PENGUMUMAN SISTEM NUSA</span>
            </div>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              Koneksi WebSocket real-time dan CoinGecko data feed aktif secara optimal.
              Gunakan sandi PIN keamanan 6-digit untuk otorisasi order transaksi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
