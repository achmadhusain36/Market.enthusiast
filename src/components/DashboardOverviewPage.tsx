import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Flame,
  Calendar,
  Newspaper,
  Briefcase,
  Grid,
  Search,
  ChevronRight,
  Clock,
  Eye,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  StockQuote,
  MarketIndex,
  PortfolioHolding,
  UserProfile,
  CurrencyType,
  Language,
} from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { INITIAL_ECONOMIC_EVENTS, INITIAL_NEWS_ITEMS } from '../data/marketTerminalData';
import { MarketLogo, StockCompanyLogo } from './MarketLogo';
import { TerminalLogo } from './TerminalLogo';

interface DashboardOverviewPageProps {
  stocks: StockQuote[];
  indices: MarketIndex[];
  holdings: PortfolioHolding[];
  userProfile: UserProfile;
  selectedCurrency: CurrencyType;
  language: Language;
  onSelectStock: (symbol: string) => void;
  onNavigateToChart: () => void;
  onNavigateToScreener: () => void;
  onNavigateToPortfolio: () => void;
  onNavigateToHeatmap: () => void;
  onNavigateToCalendar: () => void;
  onOpenTrade: (stock: StockQuote) => void;
  onOpenSearch: () => void;
}

export const DashboardOverviewPage: React.FC<DashboardOverviewPageProps> = ({
  stocks,
  indices,
  holdings,
  userProfile,
  selectedCurrency,
  language = 'en',
  onSelectStock,
  onNavigateToChart,
  onNavigateToScreener,
  onNavigateToPortfolio,
  onNavigateToHeatmap,
  onNavigateToCalendar,
  onOpenTrade,
  onOpenSearch,
}) => {
  const isId = language === 'id';
  const [newsFilter, setNewsFilter] = useState<'All' | 'Stocks' | 'Crypto' | 'Economy'>('All');

  // Sorted arrays for market movers
  const topGainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
  const topLosers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 4);
  const mostActive = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 4);
  const trending = [...stocks].slice(0, 5);

  // Compute portfolio valuation
  let totalHoldingsValUSD = 0;
  let totalInvestedUSD = 0;
  const stockMap = new Map<string, StockQuote>();
  stocks.forEach((s) => stockMap.set(s.symbol, s));

  holdings.forEach((h) => {
    const quote = stockMap.get(h.symbol);
    const livePrice = quote ? quote.price : h.avgBuyPrice;
    const isIDR = h.currency === 'IDR';
    const currentVal = h.shares * livePrice;
    const costBasis = h.shares * h.avgBuyPrice;

    if (isIDR) {
      totalHoldingsValUSD += currentVal / userProfile.usdIdrRate;
      totalInvestedUSD += costBasis / userProfile.usdIdrRate;
    } else {
      totalHoldingsValUSD += currentVal;
      totalInvestedUSD += costBasis;
    }
  });

  const totalPortfolioUSD = totalHoldingsValUSD + userProfile.cashBalanceUSD;
  const totalPortfolioIDR = totalPortfolioUSD * userProfile.usdIdrRate;
  const totalPLUSD = totalHoldingsValUSD - totalInvestedUSD;
  const totalPLPercent = totalInvestedUSD > 0 ? (totalPLUSD / totalInvestedUSD) * 100 : 0;

  const handleStockClick = (symbol: string) => {
    onSelectStock(symbol);
    onNavigateToChart();
  };

  const filteredNews = INITIAL_NEWS_ITEMS.filter((n) => {
    if (newsFilter === 'All') return true;
    return n.category === newsFilter;
  });

  return (
    <div className="flex-1 w-full flex flex-col p-3 sm:p-5 gap-4 bg-[#000000] overflow-y-auto">
      {/* 1. Global Market Overview Hero Banner */}
      <div className="bg-gradient-to-r from-[#0d121c] via-[#090d14] to-[#0d121c] border border-[#1c2436] rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <TerminalLogo size="lg" showText={false} className="hidden sm:inline-flex mt-1" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{isId ? 'PASAR GLOBAL AKTIF' : 'MARKETS ACTIVE'}</span>
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  Jakarta (IDX) • New York (NYSE / NASDAQ) • Tokyo (TSE)
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{isId ? 'Terminal Pasar & Intelijen Trading' : 'Trading Terminal & Market Intelligence'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
                {isId
                  ? 'Pantau pergerakan harga real-time, grafik Supercharts interaktif, heatmap sektoral, dan eksekusi order paper trading.'
                  : 'Monitor multi-asset market dynamics, interactive Supercharts, sector heatmaps, and institutional paper trading.'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              className="px-3.5 py-2 rounded-xl bg-[#1b2232] hover:bg-[#242e44] text-cyan-300 text-xs font-bold border border-[#2b3750] flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{isId ? 'Cari Simbol (Ctrl+K)' : 'Symbol Search (Ctrl+K)'}</span>
            </button>
            <button
              onClick={onNavigateToChart}
              className="px-4 py-2 rounded-xl bg-[#2962ff] hover:bg-[#1e54e4] active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{isId ? 'Buka Supercharts' : 'Open Supercharts'}</span>
            </button>
          </div>
        </div>

        {/* Global Market Status Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 mt-4 pt-4 border-t border-[#1a2130]">
          {indices.map((idx) => {
            const isPos = idx.changePercent >= 0;
            return (
              <div
                key={idx.symbol}
                className="bg-[#121622]/90 border border-[#1e2536] rounded-xl p-2.5 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-neutral-300">{idx.name}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{idx.symbol}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xs sm:text-sm font-extrabold font-mono text-white">
                    {idx.value.toLocaleString()}
                  </span>
                  <span
                    className={`text-[11px] font-bold font-mono ${
                      isPos ? 'text-[#22ab94]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPos ? '+' : ''}
                    {idx.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Main Dashboard Grid (Portfolio Summary + Market Movers) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column (8 cols): Top Gainers, Losers, and Most Active */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {/* Top Movers Tab Matrix */}
          <div className="bg-[#0b0e14] border border-[#1a202c] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-[#181d28]">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  {isId ? 'Penggerak Pasar Utama (Market Movers)' : 'Major Market Movers'}
                </h3>
              </div>
              <button
                onClick={onNavigateToScreener}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>{isId ? 'Lihat Semua Screener' : 'View Full Screener'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* TOP GAINERS */}
              <div className="bg-[#10141d] border border-[#19202c] rounded-xl p-3 flex flex-col">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-2.5 pb-1.5 border-b border-[#181d26]">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Top Gainers (+%)</span>
                </div>
                <div className="space-y-2 flex-1">
                  {topGainers.map((s) => (
                    <div
                      key={s.symbol}
                      onClick={() => handleStockClick(s.symbol)}
                      className="p-2 rounded-lg bg-[#141924] hover:bg-[#1a2130] border border-transparent hover:border-[#263148] transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <StockCompanyLogo symbol={s.symbol} market={s.market} size="sm" />
                        <div>
                          <div className="font-bold text-white text-xs">{s.symbol}</div>
                          <div className="text-[10px] text-neutral-400 truncate max-w-[80px]">
                            {s.market}
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs font-extrabold text-white">
                          {s.currency === 'IDR' ? 'Rp ' : '$'}
                          {s.price.toLocaleString()}
                        </div>
                        <div className="text-[11px] font-bold text-[#22ab94]">
                          +{s.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOP LOSERS */}
              <div className="bg-[#10141d] border border-[#19202c] rounded-xl p-3 flex flex-col">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 mb-2.5 pb-1.5 border-b border-[#181d26]">
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Top Losers (-%)</span>
                </div>
                <div className="space-y-2 flex-1">
                  {topLosers.map((s) => (
                    <div
                      key={s.symbol}
                      onClick={() => handleStockClick(s.symbol)}
                      className="p-2 rounded-lg bg-[#141924] hover:bg-[#1a2130] border border-transparent hover:border-[#263148] transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <StockCompanyLogo symbol={s.symbol} market={s.market} size="sm" />
                        <div>
                          <div className="font-bold text-white text-xs">{s.symbol}</div>
                          <div className="text-[10px] text-neutral-400 truncate max-w-[80px]">
                            {s.market}
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs font-extrabold text-white">
                          {s.currency === 'IDR' ? 'Rp ' : '$'}
                          {s.price.toLocaleString()}
                        </div>
                        <div className="text-[11px] font-bold text-[#f23645]">
                          {s.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MOST ACTIVE VOLUME */}
              <div className="bg-[#10141d] border border-[#19202c] rounded-xl p-3 flex flex-col">
                <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-2.5 pb-1.5 border-b border-[#181d26]">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Most Active Volume</span>
                </div>
                <div className="space-y-2 flex-1">
                  {mostActive.map((s) => (
                    <div
                      key={s.symbol}
                      onClick={() => handleStockClick(s.symbol)}
                      className="p-2 rounded-lg bg-[#141924] hover:bg-[#1a2130] border border-transparent hover:border-[#263148] transition-all cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <StockCompanyLogo symbol={s.symbol} market={s.market} size="sm" />
                        <div>
                          <div className="font-bold text-white text-xs">{s.symbol}</div>
                          <div className="text-[10px] text-neutral-400">
                            Vol: {(s.volume / 1000000).toFixed(1)}M
                          </div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <div className="text-xs font-extrabold text-white">
                          {s.currency === 'IDR' ? 'Rp ' : '$'}
                          {s.price.toLocaleString()}
                        </div>
                        <div
                          className={`text-[11px] font-bold ${
                            s.changePercent >= 0 ? 'text-[#22ab94]' : 'text-[#f23645]'
                          }`}
                        >
                          {s.changePercent >= 0 ? '+' : ''}
                          {s.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Market Heatmap Teaser Card */}
          <div className="bg-[#0b0e14] border border-[#1a202c] rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#181d28]">
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  {isId ? 'Peta Pasar Visual (Market Heatmap)' : 'Market Heatmap Preview'}
                </h3>
              </div>
              <button
                onClick={onNavigateToHeatmap}
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span>{isId ? 'Buka Full Heatmap' : 'Open Full Heatmap'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {stocks.slice(0, 12).map((stk) => {
                const isPos = stk.changePercent >= 0;
                return (
                  <button
                    key={stk.symbol}
                    onClick={() => handleStockClick(stk.symbol)}
                    className={`p-2.5 rounded-xl border text-left transition-all hover:scale-105 cursor-pointer flex flex-col justify-between ${
                      stk.changePercent >= 2.0
                        ? 'bg-[#009e47] text-white border-[#00b050]'
                        : stk.changePercent > 0
                        ? 'bg-[#0d6938] text-white border-[#138045]'
                        : stk.changePercent <= -2.0
                        ? 'bg-[#b71c1c] text-white border-[#d32f2f]'
                        : 'bg-[#7a1c22] text-white border-[#94222a]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-black">
                      <span>{stk.symbol}</span>
                      <span className="text-[9px] opacity-75 font-mono">{stk.market}</span>
                    </div>
                    <div className="mt-1 font-mono">
                      <div className="text-[11px] font-bold">
                        {stk.currency === 'IDR' ? 'Rp ' : '$'}
                        {stk.price.toLocaleString()}
                      </div>
                      <div className="text-xs font-extrabold">
                        {formatPercent(stk.changePercent)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Portfolio Summary & Economic Agenda */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          {/* Portfolio Summary Card */}
          <div className="bg-gradient-to-b from-[#111726] to-[#0c101a] border border-[#20293d] rounded-2xl p-4 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b2336]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-[#c2410c] via-[#db2777] to-[#9333ea] flex items-center justify-center text-white text-xs font-bold border border-white/10 shrink-0">
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{userProfile.name.charAt(0) || 'A'}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    {userProfile.name}
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {userProfile.accountNumber}
                  </span>
                </div>
              </div>
              <button
                onClick={onNavigateToPortfolio}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer font-semibold"
              >
                {isId ? 'Detail Portofolio' : 'Details'}
              </button>
            </div>

            <div className="my-3">
              <span className="text-[11px] text-neutral-400 font-semibold block">
                {isId ? 'Total Nilai Aset Bersih (NAV)' : 'Total Net Asset Value'}
              </span>
              <div className="text-xl sm:text-2xl font-black font-mono text-white mt-0.5">
                {selectedCurrency === 'USD'
                  ? formatCurrency(totalPortfolioUSD, 'USD')
                  : formatCurrency(totalPortfolioIDR, 'IDR')}
              </div>
              <div className="flex items-center gap-2 mt-1.5 font-mono text-xs">
                <span
                  className={`font-bold flex items-center ${
                    totalPLUSD >= 0 ? 'text-[#22ab94]' : 'text-[#f23645]'
                  }`}
                >
                  {totalPLUSD >= 0 ? '+' : ''}
                  {selectedCurrency === 'USD'
                    ? formatCurrency(totalPLUSD, 'USD')
                    : formatCurrency(totalPLUSD * userProfile.usdIdrRate, 'IDR')}
                  &nbsp;({totalPLPercent.toFixed(2)}%)
                </span>
                <span className="text-neutral-500">• All-Time P&L</span>
              </div>
            </div>

            {/* Cash Balances */}
            <div className="p-3 rounded-xl bg-[#161c2b] border border-[#222b40] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-neutral-400 block font-sans">
                  {isId ? 'Saldo Tunai IDR' : 'IDR Cash Balance'}
                </span>
                <span className="font-bold text-white">
                  Rp {userProfile.cashBalanceIDR.toLocaleString()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block font-sans">
                  {isId ? 'Saldo Tunai USD' : 'USD Cash Balance'}
                </span>
                <span className="font-bold text-emerald-400">
                  ${userProfile.cashBalanceUSD.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Economic Calendar Next Agenda */}
          <div className="bg-[#0b0e14] border border-[#1a202c] rounded-2xl p-4 shadow-xl flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#181d28]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
                  {isId ? 'Agenda Ekonomi Mendatang' : 'Upcoming Economic Events'}
                </h3>
              </div>
              <button
                onClick={onNavigateToCalendar}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
              >
                {isId ? 'Kalender Lengkap' : 'Full Calendar'}
              </button>
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[320px]">
              {INITIAL_ECONOMIC_EVENTS.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-xl bg-[#121622] border border-[#1b2232] flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#1e2638] text-neutral-300 font-mono">
                        {evt.country}
                      </span>
                      <span className="font-bold text-white text-[11px] line-clamp-1">{evt.event}</span>
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {evt.date} • {evt.time} WIB
                    </div>
                  </div>
                  <div className="text-right shrink-0 font-mono">
                    <span className="text-[11px] font-bold text-emerald-400 block">{evt.actual || evt.forecast}</span>
                    <span className="text-[9px] text-neutral-500 uppercase">{evt.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. News Feed Stream */}
      <div className="bg-[#0b0e14] border border-[#1a202c] rounded-2xl p-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#181d28]">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">
              {isId ? 'Berita Pasar & Analisis Terkini' : 'Market News & Sentiment Feed'}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-xs">
            {(['All', 'Stocks', 'Crypto', 'Economy'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setNewsFilter(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  newsFilter === cat
                    ? 'bg-[#2962ff] text-white shadow'
                    : 'text-neutral-400 hover:text-white bg-[#141822]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredNews.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#121622] border border-[#1a2232] hover:border-[#27354e] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="text-cyan-400 font-bold">{item.source}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                      item.sentiment === 'BULLISH'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : item.sentiment === 'BEARISH'
                        ? 'bg-rose-500/20 text-rose-400'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {item.sentiment}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#181f2e] flex items-center justify-between text-[10px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{item.time}</span>
                </span>
                <div className="flex items-center gap-1 font-mono">
                  {item.relatedSymbols.map((sym) => (
                    <button
                      key={sym}
                      onClick={() => handleStockClick(sym)}
                      className="px-1 py-0.5 rounded bg-[#1a2336] text-neutral-300 hover:text-cyan-300 hover:bg-[#22304b] transition-colors cursor-pointer"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
