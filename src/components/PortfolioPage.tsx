import React, { useMemo } from 'react';
import {
  Briefcase,
  PieChart as PieChartIcon,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ArrowUpDown,
  Wallet,
  ShieldCheck,
  DollarSign,
} from 'lucide-react';
import { PortfolioHolding, StockQuote, CurrencyType, Language, UserProfile } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { HoldingsTable } from './HoldingsTable';

interface PortfolioPageProps {
  holdings: PortfolioHolding[];
  stocks: StockQuote[];
  userProfile: UserProfile;
  selectedCurrency: CurrencyType;
  language?: Language;
  onSelectStock: (symbol: string) => void;
  onOpenTrade: (stock: StockQuote, type: 'BUY' | 'SELL') => void;
  onOpenSearch: () => void;
  onNavigateToChart: () => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  holdings,
  stocks,
  userProfile,
  selectedCurrency,
  language = 'id',
  onSelectStock,
  onOpenTrade,
  onOpenSearch,
  onNavigateToChart,
}) => {
  const isId = language === 'id';

  // Calculate portfolio totals
  const stats = useMemo(() => {
    let totalInvestedUSD = 0;
    let totalCurrentUSD = 0;

    const stockMap = new Map<string, StockQuote>();
    stocks.forEach((s) => stockMap.set(s.symbol, s));

    holdings.forEach((h) => {
      const stock = stockMap.get(h.symbol);
      const currentPrice = stock ? stock.price : h.avgBuyPrice;

      if (h.currency === 'USD') {
        totalInvestedUSD += h.shares * h.avgBuyPrice;
        totalCurrentUSD += h.shares * currentPrice;
      } else {
        // IDR to USD conversion for unified metric
        totalInvestedUSD += (h.shares * h.avgBuyPrice) / userProfile.usdIdrRate;
        totalCurrentUSD += (h.shares * currentPrice) / userProfile.usdIdrRate;
      }
    });

    const unrealizedPnlUSD = totalCurrentUSD - totalInvestedUSD;
    const returnPercent = totalInvestedUSD > 0 ? (unrealizedPnlUSD / totalInvestedUSD) * 100 : 0;

    return {
      totalInvestedUSD,
      totalCurrentUSD,
      unrealizedPnlUSD,
      returnPercent,
    };
  }, [holdings, stocks, userProfile.usdIdrRate]);

  const totalAssetsUSD = stats.totalCurrentUSD + userProfile.cashBalanceUSD + (userProfile.cashBalanceIDR / userProfile.usdIdrRate);

  const displayTotal =
    selectedCurrency === 'USD'
      ? formatCurrency(totalAssetsUSD, 'USD')
      : formatCurrency(totalAssetsUSD * userProfile.usdIdrRate, 'IDR');

  const displayPnl =
    selectedCurrency === 'USD'
      ? formatCurrency(stats.unrealizedPnlUSD, 'USD')
      : formatCurrency(stats.unrealizedPnlUSD * userProfile.usdIdrRate, 'IDR');

  const isPos = stats.unrealizedPnlUSD >= 0;

  return (
    <div className="w-full flex flex-col gap-5 p-2 sm:p-5 max-w-7xl mx-auto animate-in fade-in">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0e1422] via-[#121a2c] to-[#0e1422] border border-[#20293d] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>{isId ? 'Manajemen Aset & Portofolio' : 'Asset & Portfolio Manager'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isId ? 'Portofolio Investasi Saham' : 'Stock Investment Portfolio'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {isId
              ? `Pemilik Akun: ${userProfile.name} • No. RDN: ${userProfile.accountNumber} • Profil: ${userProfile.riskProfile}`
              : `Owner: ${userProfile.name} • Account: ${userProfile.accountNumber} • Profile: ${userProfile.riskProfile}`}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenSearch}
          className="px-4 py-2.5 rounded-xl bg-[#2962ff] hover:bg-[#1e52e0] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-900/30 transition-all cursor-pointer self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isId ? 'Cari & Beli Saham Baru' : 'Explore & Buy Stocks'}</span>
        </button>
      </div>

      {/* 2. Top Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono-num">
        {/* Card 1: Total Portfolio Valuation */}
        <div className="bg-[#0b0e17] border border-[#1b2336] rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-neutral-400 font-sans block mb-1">
            {isId ? 'Total Nilai Portofolio (Aset + Kas)' : 'Total Portfolio Value (Assets + Cash)'}
          </span>
          <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {displayTotal}
          </div>
          <div className="text-[11px] text-neutral-400 font-sans mt-1">
            {isId ? 'Dihitung berdasarkan kurs acuan terkini' : 'Valued at live global market prices'}
          </div>
        </div>

        {/* Card 2: Unrealized P&L */}
        <div className="bg-[#0b0e17] border border-[#1b2336] rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-neutral-400 font-sans block mb-1">
            {isId ? 'Total Keuntungan / Kerugian (P/L)' : 'Total Unrealized P/L'}
          </span>
          <div
            className={`text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-1 ${
              isPos ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPos ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            <span>
              {isPos ? '+' : ''}
              {displayPnl}
            </span>
          </div>
          <div
            className={`text-xs font-bold mt-1 ${
              isPos ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPos ? '+' : ''}
            {stats.returnPercent.toFixed(2)}% ROI
          </div>
        </div>

        {/* Card 3: Saldo Kas RDN USD */}
        <div className="bg-[#0b0e17] border border-[#1b2336] rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-neutral-400 font-sans block mb-1">
            {isId ? 'Saldo Kas USD Tersedia' : 'Available Cash Balance (USD)'}
          </span>
          <div className="text-xl sm:text-2xl font-bold text-cyan-400 tracking-tight">
            ${userProfile.cashBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-neutral-400 font-sans mt-1">
            {isId ? 'Siap digunakan beli saham Wall Street' : 'Ready for US market orders'}
          </div>
        </div>

        {/* Card 4: Saldo Kas RDN IDR */}
        <div className="bg-[#0b0e17] border border-[#1b2336] rounded-2xl p-4 shadow-lg">
          <span className="text-xs text-neutral-400 font-sans block mb-1">
            {isId ? 'Saldo Kas IDR Tersedia' : 'Available Cash Balance (IDR)'}
          </span>
          <div className="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight">
            Rp {userProfile.cashBalanceIDR.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-neutral-400 font-sans mt-1">
            {isId ? 'Siap digunakan beli saham IHSG' : 'Ready for IDX market orders'}
          </div>
        </div>
      </div>

      {/* 3. Holdings Table */}
      <HoldingsTable
        holdings={holdings}
        stocks={stocks}
        selectedCurrency={selectedCurrency}
        onSelectStock={(sym) => {
          onSelectStock(sym);
          onNavigateToChart();
        }}
        onOpenTrade={onOpenTrade}
      />
    </div>
  );
};
