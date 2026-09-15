import React, { useMemo } from 'react';
import { Wallet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, PieChart, ShieldCheck, Edit3, PlusCircle } from 'lucide-react';
import { UserProfile, PortfolioHolding, StockQuote, CurrencyType } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface PortfolioOverviewProps {
  userProfile: UserProfile;
  holdings: PortfolioHolding[];
  stocks: StockQuote[];
  selectedCurrency: CurrencyType;
  onOpenProfile: () => void;
  onOpenTrade: () => void;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({
  userProfile,
  holdings,
  stocks,
  selectedCurrency,
  onOpenProfile,
  onOpenTrade,
}) => {
  // Map stocks by symbol
  const stockMap = useMemo(() => {
    const map = new Map<string, StockQuote>();
    stocks.forEach((s) => map.set(s.symbol, s));
    return map;
  }, [stocks]);

  // Exchange rate
  const rate = userProfile.usdIdrRate || 16000;

  // Convert an amount from USD or IDR to the user's currently selected currency
  const toSelectedCurrency = (amount: number, fromCurrency: CurrencyType): number => {
    if (fromCurrency === selectedCurrency) return amount;
    if (fromCurrency === 'USD' && selectedCurrency === 'IDR') {
      return amount * rate;
    }
    if (fromCurrency === 'IDR' && selectedCurrency === 'USD') {
      return amount / rate;
    }
    return amount;
  };

  // Calculate holdings value and invested cost
  const { totalHoldingsValue, totalHoldingsInvested, dayProfitLoss } = useMemo(() => {
    let currentValue = 0;
    let costBasis = 0;
    let dayPnl = 0;

    holdings.forEach((h) => {
      const stock = stockMap.get(h.symbol);
      const currentPrice = stock ? stock.price : h.avgBuyPrice;
      const change = stock ? stock.change : 0;

      const itemVal = h.shares * currentPrice;
      const itemCost = h.shares * h.avgBuyPrice;
      const itemDayPnl = h.shares * change;

      currentValue += toSelectedCurrency(itemVal, h.currency);
      costBasis += toSelectedCurrency(itemCost, h.currency);
      dayPnl += toSelectedCurrency(itemDayPnl, h.currency);
    });

    return {
      totalHoldingsValue: currentValue,
      totalHoldingsInvested: costBasis,
      dayProfitLoss: dayPnl,
    };
  }, [holdings, stockMap, selectedCurrency, rate]);

  // Cash balance in selected currency
  const cashInSelected =
    selectedCurrency === 'USD'
      ? userProfile.cashBalanceUSD
      : userProfile.cashBalanceIDR;

  // Total Portfolio Net Worth
  const totalPortfolioValue = cashInSelected + totalHoldingsValue;
  const totalProfitLoss = totalHoldingsValue - totalHoldingsInvested;
  const totalProfitLossPercent =
    totalHoldingsInvested > 0 ? (totalProfitLoss / totalHoldingsInvested) * 100 : 0;

  const isProfitable = totalProfitLoss >= 0;
  const isDayPositive = dayProfitLoss >= 0;

  // Asset allocation percentages
  const cashRatio = totalPortfolioValue > 0 ? (cashInSelected / totalPortfolioValue) * 100 : 0;
  const stocksRatio = totalPortfolioValue > 0 ? (totalHoldingsValue / totalPortfolioValue) * 100 : 0;

  return (
    <div id="portfolio-overview-card" className="bg-[#0b0f19] border border-[#1b2336] rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Top Banner: Owner Identity & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#182033] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center font-bold text-white shadow-lg border border-emerald-400/40">
            AH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Portofolio {userProfile.name}
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              {userProfile.title} • {userProfile.riskProfile} Risk
            </p>
          </div>
        </div>

        {/* Edit balance at profile button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-edit-balance-overview"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#131b2c] hover:bg-[#1a253d] border border-[#212f4c] text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-all cursor-pointer shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Ubah Saldo di Profil</span>
          </button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Portfolio Net Worth */}
        <div className="bg-[#07090f] border border-[#182133] rounded-xl p-4 relative overflow-hidden group">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
            <span>Total Nilai Portofolio</span>
            <PieChart className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono-num text-white tracking-tight">
            {formatCurrency(totalPortfolioValue, selectedCurrency)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono-num">
            <span className={isDayPositive ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {isDayPositive ? '+' : ''}{formatCurrency(dayProfitLoss, selectedCurrency)}
            </span>
            <span className="text-neutral-500 text-[11px] font-sans">Hari Ini</span>
          </div>
        </div>

        {/* Card 2: Saldo Kas RDN (Editable in Profile) */}
        <div className="bg-[#07090f] border border-[#182133] hover:border-emerald-500/50 rounded-xl p-4 transition-colors group">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
            <span className="flex items-center gap-1">
              <span>Saldo Kas Tersedia</span>
              <span className="text-[10px] text-emerald-400 font-normal">(RDN)</span>
            </span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono-num text-emerald-400 tracking-tight">
            {formatCurrency(cashInSelected, selectedCurrency)}
          </div>
          <div className="flex items-center justify-between mt-2 text-[11px]">
            <span className="text-neutral-500 font-sans">Siap Ditransaksikan</span>
            <button
              onClick={onOpenProfile}
              className="text-emerald-400 hover:text-emerald-300 font-medium underline font-mono-num cursor-pointer"
            >
              Kelola Saldo →
            </button>
          </div>
        </div>

        {/* Card 3: Total Nilai Saham & Modal */}
        <div className="bg-[#07090f] border border-[#182133] rounded-xl p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
            <span>Nilai Pasar Saham</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold font-mono-num text-white tracking-tight">
            {formatCurrency(totalHoldingsValue, selectedCurrency)}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono-num mt-2">
            Modal: {formatCurrency(totalHoldingsInvested, selectedCurrency)}
          </div>
        </div>

        {/* Card 4: Total Keuntungan / Floating P&L */}
        <div className="bg-[#07090f] border border-[#182133] rounded-xl p-4">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium mb-1">
            <span>Total Keuntungan (P/L)</span>
            {isProfitable ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div className={`text-2xl font-extrabold font-mono-num tracking-tight ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfitable ? '+' : ''}{formatCurrency(totalProfitLoss, selectedCurrency)}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-mono-num">
            <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${isProfitable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {formatPercent(totalProfitLossPercent)}
            </span>
            <span className="text-neutral-500 text-[11px] font-sans">Semua Waktu</span>
          </div>
        </div>
      </div>

      {/* Allocation Progress Bar */}
      <div className="bg-[#07090f] border border-[#182133] rounded-xl p-3.5 space-y-2 text-xs">
        <div className="flex items-center justify-between font-medium">
          <span className="text-neutral-300">Alokasi Aset Portofolio</span>
          <div className="flex items-center gap-4 text-neutral-400 font-mono-num text-[11px]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              <span>Saldo Kas ({cashRatio.toFixed(1)}%)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span>
              <span>Saham Global ({stocksRatio.toFixed(1)}%)</span>
            </span>
          </div>
        </div>

        <div className="w-full h-2.5 bg-[#141c2c] rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${cashRatio}%` }}
            title={`Saldo Kas: ${cashRatio.toFixed(1)}%`}
          />
          <div
            className="h-full bg-cyan-500 transition-all duration-500"
            style={{ width: `${stocksRatio}%` }}
            title={`Saham Global: ${stocksRatio.toFixed(1)}%`}
          />
        </div>
      </div>
    </div>
  );
};
