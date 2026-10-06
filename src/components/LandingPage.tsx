import React, { useState } from 'react';
import {
  TrendingUp,
  Shield,
  Zap,
  Globe2,
  Lock,
  ArrowRight,
  Sparkles,
  BarChart3,
  Layers,
  Award,
  Wallet,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Play,
  Users,
  Star,
  ChevronRight,
  ExternalLink,
  DollarSign,
  Smartphone,
  BookOpen,
} from 'lucide-react';
import { StockQuote, MarketIndex, Language } from '../types';
import { TerminalLogo } from './TerminalLogo';
import { MarketLogo, StockCompanyLogo } from './MarketLogo';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface LandingPageProps {
  stocks: StockQuote[];
  indices: MarketIndex[];
  onEnterTerminal: () => void;
  onEnterDemo: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  stocks,
  indices,
  onEnterTerminal,
  onEnterDemo,
  onOpenLogin,
  onOpenRegister,
  language = 'id',
  onSelectLanguage,
}) => {
  const isId = language === 'id';
  const [activeAssetTab, setActiveAssetTab] = useState<'ALL' | 'STOCKS' | 'CRYPTO' | 'FOREX' | 'COMMODITY'>('ALL');

  const filteredAssets = stocks.filter((s) => {
    if (activeAssetTab === 'ALL') return true;
    return s.category === activeAssetTab || (activeAssetTab === 'STOCKS' && (s.market === 'IDX' || s.market === 'NASDAQ' || s.market === 'NYSE'));
  }).slice(0, 8);

  const topMovers = [...stocks].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#05070c] text-white selection:bg-[#2962ff]/30 selection:text-white font-sans overflow-x-hidden">
      {/* 1. TOP NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#070911]/90 backdrop-blur-md border-b border-[#151c2c] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onEnterTerminal} className="flex items-center gap-2.5 text-left cursor-pointer group">
            <TerminalLogo size="md" showText={true} subtitle={isId ? 'Terminal Multi-Aset Global' : 'Global Multi-Asset Terminal'} />
          </button>

          <div className="hidden lg:flex items-center gap-5 text-xs font-semibold text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">{isId ? 'Fitur Unggulan' : 'Features'}</a>
            <a href="#markets" className="hover:text-white transition-colors">{isId ? 'Pasar & Aset' : 'Markets'}</a>
            <a href="#security" className="hover:text-white transition-colors">{isId ? 'Keamanan & Regulasi' : 'Security'}</a>
            <a href="#testimonials" className="hover:text-white transition-colors">{isId ? 'Ulasan Trader' : 'Reviews'}</a>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <div className="flex items-center bg-[#0d121c] border border-[#1e273a] rounded-lg p-0.5 text-xs font-bold">
            <button
              onClick={() => onSelectLanguage('id')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                language === 'id' ? 'bg-[#2962ff] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              ID
            </button>
            <button
              onClick={() => onSelectLanguage('en')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                language === 'en' ? 'bg-[#2962ff] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={onOpenLogin}
            className="px-3 sm:px-4 py-2 rounded-xl bg-[#101726] hover:bg-[#18233a] border border-[#22304d] text-xs font-bold text-neutral-200 transition-colors cursor-pointer"
          >
            {isId ? 'Masuk' : 'Log In'}
          </button>

          <button
            onClick={onOpenRegister}
            className="px-3.5 sm:px-5 py-2 rounded-xl bg-[#2962ff] hover:bg-[#1e54e4] active:scale-95 text-xs font-bold text-white shadow-lg shadow-blue-900/40 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>{isId ? 'Daftar Akun' : 'Get Started'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* 2. LIVE GLOBAL TICKER RIBBON */}
      <div className="bg-[#090d16] border-b border-[#141b2b] py-2 px-4 overflow-x-auto select-none scrollbar-none">
        <div className="flex items-center gap-6 min-w-max text-xs font-mono">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{isId ? 'PASAR LIVE' : 'LIVE TICKS'}:</span>
          </span>

          {indices.map((idx) => (
            <div key={idx.symbol} className="flex items-center gap-1.5 shrink-0">
              <span className="font-bold text-neutral-300">{idx.name}</span>
              <span className="text-white font-bold">{idx.value.toLocaleString()}</span>
              <span className={`text-[11px] font-bold ${idx.changePercent >= 0 ? 'text-[#22ab94]' : 'text-[#f23645]'}`}>
                {idx.changePercent >= 0 ? '+' : ''}{idx.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}

          {topMovers.slice(0, 3).map((stk) => (
            <div key={stk.symbol} className="flex items-center gap-1.5 shrink-0">
              <span className="font-bold text-neutral-400">{stk.symbol}</span>
              <span className="text-white font-bold">{stk.currency === 'IDR' ? 'Rp ' : '$'}{stk.price.toLocaleString()}</span>
              <span className={`text-[11px] font-bold ${stk.changePercent >= 0 ? 'text-[#22ab94]' : 'text-[#f23645]'}`}>
                {stk.changePercent >= 0 ? '+' : ''}{stk.changePercent.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#2962ff]/20 via-[#00c853]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="text-center space-y-6 max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111828] border border-[#23314d] text-xs font-semibold text-cyan-300 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isId ? 'Platform Trading & Investasi Multi-Aset Global Generasi Baru' : 'Next-Gen Global Multi-Asset Trading Terminal'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            {isId ? (
              <>
                Satu Terminal Canggih untuk <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2962ff] via-[#38bdf8] to-[#22c55e]">
                  Saham, Kripto, Forex & Komoditas
                </span>
              </>
            ) : (
              <>
                One High-Performance Terminal for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2962ff] via-[#38bdf8] to-[#22c55e]">
                  Equities, Crypto, Forex & Commodities
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {isId
              ? 'Akses pasar dunia dengan grafik Supercharts kelas TradingView, order book L2 real-time, eksekusi latensi ultra-rendah, serta proteksi keamanan berlapis PIN 6-digit & enkripsi bank.'
              : 'Trade global markets with institutional TradingView Supercharts, real-time Level 2 order books, sub-millisecond execution, and 6-digit PIN vault security.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={onEnterTerminal}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-[#2962ff] hover:bg-[#1a4fe0] active:scale-95 text-white text-sm font-black shadow-xl shadow-blue-900/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current text-cyan-200" />
              <span>{isId ? 'Buka Terminal Trading' : 'Launch Supercharts Terminal'}</span>
            </button>

            <button
              onClick={onEnterDemo}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-[#101625] hover:bg-[#19233a] border border-[#233352] text-emerald-400 hover:text-emerald-300 text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isId ? 'Coba Akun Demo ($100,000)' : 'Try Demo Account ($100,000)'}</span>
            </button>
          </div>

          {/* Trust Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#192133]">
              <span className="text-xl sm:text-2xl font-black text-white font-mono">&lt; 15 ms</span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">{isId ? 'Latensi Eksekusi Cepat' : 'Execution Latency'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#192133]">
              <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">100+</span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">{isId ? 'Indikator Teknikal' : 'Technical Indicators'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#192133]">
              <span className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">4-in-1</span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">{isId ? 'Multi-Asset Ekosistem' : 'Multi-Asset Universe'}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#0c101a] border border-[#192133]">
              <span className="text-xl sm:text-2xl font-black text-amber-400 font-mono">PIN 6-D</span>
              <span className="text-[11px] text-neutral-400 block mt-0.5">{isId ? 'Proteksi Portofolio' : 'Vault Security'}</span>
            </div>
          </div>
        </div>

        {/* HERO TERMINAL SCREENSHOT / INTERACTIVE PREVIEW */}
        <div className="mt-12 relative rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-[#1b263b] via-[#101726] to-[#070a10] border border-[#253654] shadow-2xl shadow-blue-950/40">
          <div className="rounded-2xl overflow-hidden bg-[#000000] border border-[#1c2436] p-4 space-y-4">
            {/* Top Mock Window Bar */}
            <div className="flex items-center justify-between border-b border-[#171f30] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f23645]" />
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                <span className="w-3 h-3 rounded-full bg-[#22ab94]" />
                <span className="text-xs font-mono text-neutral-400 ml-2">MarketTerminal.Supercharts.v17 — Pro Trader Workspace</span>
              </div>
              <button
                onClick={onEnterTerminal}
                className="text-xs text-cyan-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{isId ? 'Masuk ke Layar Penuh' : 'Enter Interactive Terminal'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Multi-Asset Showcase inside Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Box 1: IHSG / Stock */}
              <div className="p-3.5 rounded-xl bg-[#0c1018] border border-[#192233] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MarketLogo market="IDX" size="sm" />
                    <div>
                      <div className="text-xs font-bold text-white">COMPOSITE (IHSG)</div>
                      <div className="text-[10px] text-neutral-400">Bursa Efek Indonesia</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#f23645]">-0.51%</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between font-mono">
                  <span className="text-lg font-black text-white">6,501.40</span>
                  <span className="text-[11px] text-neutral-400">Vol: 18.4M</span>
                </div>
              </div>

              {/* Box 2: Bitcoin Crypto */}
              <div className="p-3.5 rounded-xl bg-[#0c1018] border border-[#192233] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MarketLogo market="CRYPTO" size="sm" />
                    <div>
                      <div className="text-xs font-bold text-white">BTC/USD (Bitcoin)</div>
                      <div className="text-[10px] text-neutral-400">24/7 Digital Asset</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#22ab94]">+2.29%</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between font-mono">
                  <span className="text-lg font-black text-emerald-400">$64,850.00</span>
                  <span className="text-[11px] text-neutral-400">Cap: $1.28T</span>
                </div>
              </div>

              {/* Box 3: Gold Commodity */}
              <div className="p-3.5 rounded-xl bg-[#0c1018] border border-[#192233] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MarketLogo market="COMMODITY" size="sm" />
                    <div>
                      <div className="text-xs font-bold text-white">XAU/USD (Gold Spot)</div>
                      <div className="text-[10px] text-neutral-400">Logam Mulia Global</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#22ab94]">+0.55%</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between font-mono">
                  <span className="text-lg font-black text-yellow-400">$2,654.50</span>
                  <span className="text-[11px] text-neutral-400">All-Time High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY FEATURES SHOWCASE */}
      <section id="features" className="py-16 px-4 sm:px-8 border-t border-[#141b2c] bg-[#070912]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              {isId ? 'KEUNGGULAN UTAMA' : 'SUPERIOR CAPABILITIES'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isId ? 'Fitur Trading Profesional Tanpa Kompromi' : 'Engineered for Serious Traders & Investors'}
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl mx-auto">
              {isId
                ? 'Didesain memenuhi kebutuhan dari investor pemula hingga trader institusional dengan alat analisis terlengkap.'
                : 'Built from the ground up for lightning-speed decision making and portfolio growth.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-[#1a2336] hover:border-[#2962ff]/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#2962ff]">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">TradingView Supercharts</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isId
                  ? 'Candlestick multi-frame, Heikin Ashi, drawing tools (Fibonacci, Trendline, Long/Short position), bar replay simulator, dan multi-chart split screen.'
                  : 'Multi-frame candlesticks, drawing tools, bar replay mode, and split-layout screen comparison.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-[#1a2336] hover:border-emerald-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Level 2 Order Book & Depth</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isId
                  ? 'Pantau antrian beli (Bid) dan jual (Ask) secara transparan dengan visualisasi kedalaman likuiditas pasar real-time.'
                  : 'Real-time order book bids and asks ladder with depth percentages and instant price click-to-trade.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-[#1a2336] hover:border-amber-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Vault PIN 6-Digit & Proteksi</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isId
                  ? 'Otorisasi PIN wajib sebelum mengeksekusi order beli/jual, membuka profil sensitif, dan menarik dana. Aman dari akses tidak berwenang.'
                  : 'Mandatory PIN authentication for trade executions, sensitive profile changes, and withdrawals.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-[#1a2336] hover:border-cyan-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Play className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Mode Demo $100,000 Virtual</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isId
                  ? 'Bebas uji coba strategi tanpa risiko menggunakan modal virtual $100,000 USD. Beralih ke Akun Real cukup satu klik.'
                  : 'Paper trade risk-free with $100,000 virtual balance. Switch seamlessly between Real and Demo anytime.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-[#1a2336] hover:border-purple-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Multi-Currency Wallet</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isId
                  ? 'Deposit & withdraw fleksibel via Virtual Account (BCA, Mandiri, BRI), QRIS, Transfer Bank, Crypto (USDT Web3), dan Kartu Debit.'
                  : 'Deposit and withdraw in IDR, USD, and USDT through Virtual Accounts, QRIS, and Web3 wallets.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-[#1a2336] hover:border-rose-500/50 transition-all space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Komunitas & Ide Trading</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isId
                  ? 'Bagikan analisis teknikal, diskusikan setup saham harian, bookmark postingan favorit, dan ikuti sinyal analis terverifikasi.'
                  : 'Connect with active traders, discuss trading setups, comment, and publish trading ideas.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MULTI-ASSET MARKET HUB */}
      <section id="markets" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              {isId ? 'DAFTAR ASET GLOBAL' : 'GLOBAL ASSET UNIVERSE'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {isId ? 'Jelajahi Pergerakan Harga Real-Time' : 'Live Real-Time Market Quotes'}
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 bg-[#0b0f19] p-1 rounded-xl border border-[#192233] text-xs font-semibold overflow-x-auto">
            {(['ALL', 'STOCKS', 'CRYPTO', 'FOREX', 'COMMODITY'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveAssetTab(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeAssetTab === cat ? 'bg-[#2962ff] text-white shadow' : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat === 'ALL'
                  ? isId ? 'Semua Aset' : 'All Assets'
                  : cat === 'STOCKS'
                  ? isId ? 'Saham' : 'Equities'
                  : cat === 'CRYPTO'
                  ? 'Kripto'
                  : cat === 'FOREX'
                  ? 'Forex'
                  : isId ? 'Komoditas' : 'Commodity'}
              </button>
            ))}
          </div>
        </div>

        {/* Assets Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredAssets.map((asset) => {
            const isPos = asset.changePercent >= 0;
            return (
              <div
                key={asset.symbol}
                onClick={onEnterTerminal}
                className="p-4 rounded-2xl bg-[#090d16] border border-[#182133] hover:border-[#2962ff]/50 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <StockCompanyLogo symbol={asset.symbol} market={asset.market} size="md" />
                      <div>
                        <div className="font-extrabold text-white text-sm group-hover:text-cyan-400 transition-colors">
                          {asset.symbol}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[120px]">
                          {asset.name}
                        </div>
                      </div>
                    </div>
                    <MarketLogo market={asset.market} size="xs" />
                  </div>

                  <div className="mt-4 flex items-baseline justify-between font-mono">
                    <div className="text-base font-bold text-white">
                      {asset.currency === 'IDR' ? 'Rp ' : '$'}{asset.price.toLocaleString()}
                    </div>
                    <div className={`text-xs font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#141b2a] flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Vol: {(asset.volume / 1000000).toFixed(1)}M</span>
                  <span className="text-[#2962ff] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    <span>{isId ? 'Chart' : 'Chart'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. REGULATION & SECURITY SECTION */}
      <section id="security" className="py-16 px-4 sm:px-8 border-t border-[#141b2c] bg-[#070912]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isId ? 'KEAMANAN & REGULASI' : 'SECURITY & REGULATION'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {isId ? 'Standar Keamanan Tingkat Perbankan' : 'Bank-Grade Security & Client Asset Segregation'}
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
              {isId
                ? 'Dana investor disimpan secara terpisah pada Rekening Dana Nasabah (RDN) Bank Kustodian terpercaya dengan enkripsi end-to-end TLS 1.3.'
                : 'All client funds segregated in custodian accounts with continuous cryptographic verification.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-[#1b2438] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">Rekening Dana Nasabah (RDN) BCA</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {isId
                    ? 'Dana kas rupiah tersimpan langsung di Bank Central Asia atas nama nasabah sendiri, dijamin oleh Lembaga Penjamin Simpanan (LPS).'
                    : 'IDR funds kept strictly in individual client segregated accounts with custodian bank.'}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-[#1b2438] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">Enkripsi Data TLS 1.3</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {isId
                    ? 'Seluruh komunikasi data dan token sesi terenkripsi penuh dengan sertifikat SSL 256-bit kelas institusi finansial.'
                    : '256-bit SSL encryption on all incoming and outgoing trade execution signals.'}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b0f19] border border-[#1b2438] flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm sm:text-base">Proteksi Anti-Inspect & DevTools</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  {isId
                    ? 'Dilengkapi proteksi anti-inspect F12, blokir manipulasi DOM eksternal, dan audit log sesi aktif demi melindungi transaksi Anda.'
                    : 'Real-time client tamper protection blocking unauthorized console injection and inspection.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS & TRUST BADGES */}
      <section id="testimonials" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            {isId ? 'ULASAN KOMUNITAS' : 'TRADER TESTIMONIALS'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {isId ? 'Dipercaya oleh Puluhan Ribu Trader' : 'Trusted by Professional Traders Worldwide'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-[#0c101a] border border-[#192233] space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-300 italic leading-relaxed">
              "Fitur Supercharts dan bar replay-nya sangat membantu saya melatih setup price action sebelum market open. Fitur PIN transaksinya bikin tenang!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-[#161f30]">
              <div className="w-9 h-9 rounded-full bg-blue-600/30 text-blue-400 font-bold flex items-center justify-center text-xs">
                RH
              </div>
              <div>
                <div className="text-xs font-bold text-white">Reza Hidayat</div>
                <div className="text-[10px] text-neutral-500">Scalper & Swing Trader IDX</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101a] border border-[#192233] space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-300 italic leading-relaxed">
              "Sangat praktis bisa pantau saham BBCA sekaligus Bitcoin dan Emas dalam satu layar dashboard tanpa harus pindah-pindah aplikasi."
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-[#161f30]">
              <div className="w-9 h-9 rounded-full bg-emerald-600/30 text-emerald-400 font-bold flex items-center justify-center text-xs">
                SW
              </div>
              <div>
                <div className="text-xs font-bold text-white">Siti Wulandari</div>
                <div className="text-[10px] text-neutral-500">Macro Analyst & Portfolio Manager</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c101a] border border-[#192233] space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-neutral-300 italic leading-relaxed">
              "Kalkulator profit/loss sebelum eksekusi order sangat akurat menghitung Risk-Reward ratio. Mode demo-nya juga sangat mirip kondisi live!"
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-[#161f30]">
              <div className="w-9 h-9 rounded-full bg-purple-600/30 text-purple-400 font-bold flex items-center justify-center text-xs">
                DP
              </div>
              <div>
                <div className="text-xs font-bold text-white">Dimas Pratama</div>
                <div className="text-[10px] text-neutral-500">Crypto & Wall Street Trader</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. BOTTOM CTA CALLOUT */}
      <section className="py-16 px-4 sm:px-8 border-t border-[#151c2c] bg-gradient-to-b from-[#0a0f1c] to-[#05070c]">
        <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#0d1628] via-[#101b33] to-[#0c1527] border border-[#233555] text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#2962ff]/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {isId ? 'Siap Meningkatkan Kualitas Trading Anda?' : 'Ready to Elevate Your Market Edge?'}
          </h2>
          <p className="text-sm text-neutral-300 max-w-xl mx-auto">
            {isId
              ? 'Buka akun Anda dalam 2 menit atau coba akun demo $100,000 sekarang secara gratis tanpa biaya registrasi.'
              : 'Join thousands of active traders today or test strategies risk-free with $100,000 demo paper funds.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenRegister}
              className="px-8 py-3.5 rounded-2xl bg-[#2962ff] hover:bg-[#1a4de0] text-white text-sm font-bold shadow-xl shadow-blue-900/40 cursor-pointer transition-all"
            >
              {isId ? 'Daftar Akun Baru Sekarang' : 'Create Free Account'}
            </button>
            <button
              onClick={onEnterDemo}
              className="px-8 py-3.5 rounded-2xl bg-[#121929] hover:bg-[#1a253d] border border-[#223352] text-neutral-200 text-sm font-bold cursor-pointer transition-all"
            >
              {isId ? 'Buka Akun Demo' : 'Explore Demo Workspace'}
            </button>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-[#131a29] bg-[#04060a] py-12 px-4 sm:px-8 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <TerminalLogo size="md" showText={true} />
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Platform terminal multi-aset modern untuk memantau, menganalisis, dan mengeksekusi instrumen saham, kripto, forex, dan komoditas global.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                {isId ? 'Pasar & Aset' : 'Markets'}
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={onEnterTerminal} className="hover:text-white cursor-pointer">Bursa Efek Indonesia (IDX)</button></li>
                <li><button onClick={onEnterTerminal} className="hover:text-white cursor-pointer">Wall Street (NASDAQ / NYSE)</button></li>
                <li><button onClick={onEnterTerminal} className="hover:text-white cursor-pointer">Kripto (BTC, ETH, SOL)</button></li>
                <li><button onClick={onEnterTerminal} className="hover:text-white cursor-pointer">Forex & Komoditas (Emas, Minyak)</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                {isId ? 'Fitur & Alat' : 'Features'}
              </h4>
              <ul className="space-y-2 text-[11px]">
                <li><button onClick={onEnterTerminal} className="hover:text-white cursor-pointer">TradingView Supercharts</button></li>
                <li><button onClick={onEnterTerminal} className="hover:text-white cursor-pointer">Level 2 Order Book</button></li>
                <li><button onClick={onEnterTerminal} className="hover:text-white cursor-pointer">Kalkulator Risk / Reward</button></li>
                <li><button onClick={onEnterDemo} className="hover:text-white cursor-pointer">Akun Demo $100K</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
                {isId ? 'Keamanan & Legal' : 'Legal & Trust'}
              </h4>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {isId
                  ? 'Peringatan Risiko: Investasi saham, kripto, dan derivatif mengandung risiko tinggi terhadap modal Anda. Pastikan Anda memahami instrumen yang diperdagangkan.'
                  : 'Risk Warning: Trading financial instruments involves significant risk of loss. Always exercise prudent risk management.'}
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-[#101624] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
            <div>
              © 2026 Market Terminal Multi-Asset Platform. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>BCA RDN Custodian</span>
              <span>•</span>
              <span>TLS 1.3 Verified</span>
              <span>•</span>
              <span>Hardware-Secured PIN Vault</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
