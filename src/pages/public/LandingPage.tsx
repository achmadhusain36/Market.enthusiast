import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Shield,
  Zap,
  Globe2,
  Lock,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Layers,
  Sparkles,
  Users,
  Play,
} from 'lucide-react';
import { useMarketData } from '../../hooks/useMarketData';
import { useAuthStore } from '../../store/useAuthStore';
import { formatCurrency, formatPercent } from '../../utils/format';
import { MarketLogo } from '../../components/MarketLogo';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const LandingPage: React.FC = () => {
  const { assets } = useMarketData();
  const { isAuthenticated, login } = useAuthStore();
  const navigate = useNavigate();

  const handleInstantDemo = async () => {
    await login('demo.trader@marketterminal.com');
    navigate('/dashboard');
  };

  const heroAssets = assets.slice(0, 6);

  return (
    <div className="flex-1 flex flex-col select-none">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 px-6 sm:px-12 flex flex-col items-center text-center overflow-hidden border-b border-[#1c1c1c]">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NUSA TRADE TERMINAL • RELEASE 2026</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-white max-w-4xl leading-tight">
          Platform Trading & Monitoring <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Multi-Aset Global Modern
          </span>
        </h1>

        <p className="mt-5 text-neutral-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          Satu terminal terpadu untuk Kripto, Saham IDX & Wall Street, Valuta Asing, dan Komoditas.
          Dilengkapi simulasi paper trading $10.000, eksekusi instan, dan proteksi otorisasi PIN 6-digit.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isAuthenticated ? 'Buka Terminal Saya' : 'Mulai Sekarang — Gratis'}
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={handleInstantDemo}
            leftIcon={<Play className="w-4 h-4 text-emerald-400 fill-current" />}
          >
            Coba Demo ($10,000 Virtual)
          </Button>
        </div>

        {/* Live Ticker Strip */}
        <div className="mt-14 w-full max-w-6xl overflow-x-auto p-3 rounded-2xl bg-[#111111]/80 border border-[#222222] backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 min-w-[700px]">
            {heroAssets.map((asset) => {
              const isPos = asset.changePercent24h >= 0;
              return (
                <div
                  key={asset.id}
                  onClick={() => navigate(`/market/${encodeURIComponent(asset.symbol)}`)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#1a1a1a] cursor-pointer transition-colors flex-1"
                >
                  <MarketLogo market={asset.market} size="xs" />
                  <div className="text-left min-w-0">
                    <div className="text-xs font-bold font-mono text-white truncate">
                      {asset.symbol}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-400">
                      {formatCurrency(asset.price, asset.currency)}
                    </div>
                  </div>
                  <div
                    className={`ml-auto text-xs font-mono font-bold ${
                      isPos ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {formatPercent(asset.changePercent24h)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. SECTION FITUR UNGGULAN */}
      <section id="features" className="py-20 px-6 sm:px-12 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-black font-mono text-white">
            Fitur Canggih untuk Trader Profesional
          </h2>
          <p className="mt-2 text-neutral-400 text-xs sm:text-sm">
            Semua yang Anda butuhkan untuk riset, analisis mendalam, hingga eksekusi order cepat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hoverEffect className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-white">Supercharts & Order Book</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pantau pergerakan harga candlestick multi-timeframe (1H, 1D, 1W, 1M, 1Y) disertai kedalaman
              volume Level 2 (Bids & Asks) real-time.
            </p>
          </Card>

          <Card hoverEffect className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-white">Simulasi Paper Trading $10K</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Uji strategi perdagangan Anda tanpa risiko finansial menggunakan akun virtual $10.000 USD
              sebelum masuk ke pasar riil RDN.
            </p>
          </Card>

          <Card hoverEffect className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-mono text-white">Proteksi PIN Otorisasi 6-Digit</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Keamanan tingkat perbankan. Setiap aksi jual, beli, dan penarikan dana wajib
              diotorisasi sandi PIN rahasia Anda.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. SECTION "WHY MARKET ENTHUSIAST" */}
      <section id="security" className="py-20 px-6 sm:px-12 bg-[#0d0d0d] border-t border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>KEAMANAN & KEANDALAN TERPERCAYA</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black font-mono text-white leading-tight">
              Mengapa Memilih Nusa Trade Terminal?
            </h2>

            <p className="text-neutral-400 text-sm leading-relaxed">
              Kami memadukan standar keamanan perbankan dengan kecepatan akses teknologi cloud modern,
              memberikan rasa aman bagi setiap portofolio investor.
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-neutral-300">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Enkripsi End-to-End dengan protokol TLS 1.3 dan hashing mutakhir</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Infrastruktur latensi rendah dengan SLA ketersediaan 99.98%</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Integrasi dompet Web3 MetaMask dan Virtual Account Bank lokal</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dukungan pelanggan 24/7 dengan pusat bantuan dan FAQ terpadu</span>
              </li>
            </ul>

            <div className="pt-4">
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Buat Akun Gratis Sekarang
              </Button>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-8 shadow-2xl relative">
            <div className="space-y-4 font-mono">
              <div className="flex items-center justify-between pb-4 border-b border-[#222222]">
                <span className="text-neutral-400 text-xs">STATUS TERMINAL</span>
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE • 12ms PING
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#181818] border border-[#262626]">
                  <div className="text-[10px] text-neutral-400">TOTAL VOLUME 24H</div>
                  <div className="text-lg font-bold text-white mt-1">$48.2 Milyar</div>
                </div>
                <div className="p-4 rounded-xl bg-[#181818] border border-[#262626]">
                  <div className="text-[10px] text-neutral-400">PENGGUNA AKTIF</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">120,000+</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#181818] border border-[#262626] flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-neutral-400">PROTEKSI PIN TRANSAKSI</div>
                  <div className="text-xs font-bold text-white mt-0.5">TERVERIFIKASI AKTIF</div>
                </div>
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
