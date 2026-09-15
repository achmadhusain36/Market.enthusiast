import React, { useState } from 'react';
import {
  Briefcase,
  History,
  Wallet,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Plus,
  ArrowUpDown,
  Search,
  Filter,
} from 'lucide-react';
import {
  PortfolioHolding,
  StockQuote,
  Transaction,
  UserProfile,
  CurrencyType,
  Language,
} from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface TradingViewBottomDockProps {
  holdings: PortfolioHolding[];
  transactions: Transaction[];
  stocks: StockQuote[];
  userProfile: UserProfile;
  selectedCurrency: CurrencyType;
  language: Language;
  onSelectStock: (symbol: string) => void;
  onOpenTrade: (stock: StockQuote, type: 'BUY' | 'SELL') => void;
  onOpenProfile: () => void;
  isLiveSyncing: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const TradingViewBottomDock: React.FC<TradingViewBottomDockProps> = ({
  holdings,
  transactions,
  stocks,
  userProfile,
  selectedCurrency,
  language,
  onSelectStock,
  onOpenTrade,
  onOpenProfile,
  isLiveSyncing,
  isOpen,
  onToggleOpen,
}) => {
  const t = TRANSLATIONS[language || 'id'];
  const [activeTab, setActiveTab] = useState<'holdings' | 'transactions' | 'balance'>('transactions');
  const [txFilter, setTxFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [txSearch, setTxSearch] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);

  const stockMap = new Map<string, StockQuote>();
  stocks.forEach((s) => stockMap.set(s.symbol, s));

  // Compute portfolio valuation
  let totalHoldingsValUSD = 0;
  let totalInvestedUSD = 0;

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

  const totalPortfolioValueUSD = totalHoldingsValUSD + userProfile.cashBalanceUSD;
  const totalPortfolioValueIDR = totalPortfolioValueUSD * userProfile.usdIdrRate;
  const totalPLUSD = totalHoldingsValUSD - totalInvestedUSD;
  const totalPLPercent = totalInvestedUSD > 0 ? (totalPLUSD / totalInvestedUSD) * 100 : 0;

  // Filtered transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (txFilter !== 'ALL' && tx.type !== txFilter) return false;
    if (txSearch) {
      const q = txSearch.toLowerCase();
      return (
        tx.symbol.toLowerCase().includes(q) ||
        tx.name.toLowerCase().includes(q) ||
        tx.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Type', 'Symbol', 'Shares', 'Price', 'Currency', 'Total', 'Fee', 'Status'];
    const rows = transactions.map((t) => [
      t.id,
      t.timestamp,
      t.type,
      t.symbol,
      t.shares,
      t.price,
      t.currency,
      t.total,
      t.fee,
      t.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `transaksi_market_enthusiast_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      id="tradingview-bottom-dock"
      className={`border-t border-[#1e222d] bg-[#0c0f17] transition-all duration-300 flex flex-col ${
        isMaximized
          ? 'fixed inset-x-0 bottom-0 top-16 z-50 shadow-2xl'
          : isOpen
          ? 'h-80 sm:h-96'
          : 'h-10'
      }`}
    >
      {/* Dock Header Tabs / Toggle Bar */}
      <div className="px-3 sm:px-4 py-1.5 border-b border-[#1e222d] bg-[#0e121a] flex items-center justify-between gap-2 shrink-0 select-none">
        {/* Left: Tab Buttons (TradingView style tabs: Pine Editor / Strategy Tester / Trading Panel) */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('transactions');
              if (!isOpen) onToggleOpen();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isOpen && activeTab === 'transactions'
                ? 'bg-[#1e222d] text-white font-bold border border-[#2a2e39]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.tabTransactions}</span>
            <span className="text-[10px] bg-blue-900/40 text-blue-300 px-1.5 py-0.2 rounded font-mono-num">
              {transactions.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('holdings');
              if (!isOpen) onToggleOpen();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isOpen && activeTab === 'holdings'
                ? 'bg-[#1e222d] text-white font-bold border border-[#2a2e39]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.tabHoldings}</span>
            <span className="text-[10px] bg-emerald-900/40 text-emerald-300 px-1.5 py-0.2 rounded font-mono-num">
              {holdings.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('balance');
              if (!isOpen) onToggleOpen();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              isOpen && activeTab === 'balance'
                ? 'bg-[#1e222d] text-white font-bold border border-[#2a2e39]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.tabBalance}</span>
          </button>
        </div>

        {/* Right Dock Controls: Expand/Collapse & Fullscreen */}
        <div className="flex items-center gap-2 text-neutral-400 text-xs shrink-0">
          <div className="hidden md:flex items-center gap-2 font-mono-num text-[11px] mr-2">
            <span>Kas:</span>
            <span className="text-emerald-400 font-bold">
              {selectedCurrency === 'USD'
                ? formatCurrency(userProfile.cashBalanceUSD, 'USD')
                : formatCurrency(userProfile.cashBalanceIDR, 'IDR')}
            </span>
          </div>

          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:text-white hover:bg-[#1e222d] rounded transition-colors cursor-pointer"
            title={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onToggleOpen}
            className="p-1 hover:text-white hover:bg-[#1e222d] rounded transition-colors cursor-pointer flex items-center gap-1"
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dock Content Body */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {/* TAB 1: TRANSACTIONS HISTORY */}
          {activeTab === 'transactions' && (
            <div className="space-y-3">
              {/* Header Actions: Search, Filter, Export */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <div className="relative w-full">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={txSearch}
                      onChange={(e) => setTxSearch(e.target.value)}
                      placeholder="Cari transaksi / ticker..."
                      className="w-full bg-[#141824] border border-[#222838] rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#141824] rounded-lg p-0.5 border border-[#222838] text-xs">
                    {(['ALL', 'BUY', 'SELL'] as const).map((filterType) => (
                      <button
                        key={filterType}
                        onClick={() => setTxFilter(filterType)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                          txFilter === filterType
                            ? 'bg-[#2962ff] text-white'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {filterType === 'ALL' ? t.txFilterAll : filterType === 'BUY' ? t.txFilterBuy : t.txFilterSell}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={exportCSV}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#141824] hover:bg-[#1f2536] border border-[#222838] text-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="hidden sm:inline">{t.txExportCsv}</span>
                  </button>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto rounded-xl border border-[#1e222d]">
                <table className="w-full text-left text-xs border-collapse font-mono-num">
                  <thead>
                    <tr className="bg-[#121622] text-neutral-400 text-[10px] uppercase font-bold border-b border-[#1e222d] font-sans">
                      <th className="py-2.5 px-3">{t.txColId}</th>
                      <th className="py-2.5 px-3">{t.txColTime}</th>
                      <th className="py-2.5 px-3">{t.txColType}</th>
                      <th className="py-2.5 px-3">{t.txColAsset}</th>
                      <th className="py-2.5 px-3 text-right">{t.txColLot}</th>
                      <th className="py-2.5 px-3 text-right">{t.txColExecPrice}</th>
                      <th className="py-2.5 px-3 text-right">{t.txColCurrentPrice}</th>
                      <th className="py-2.5 px-3 text-right">{t.txColTotal}</th>
                      <th className="py-2.5 px-3 text-center">{t.txColStatus}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161a26]">
                    {filteredTransactions.map((tx) => {
                      const quote = stockMap.get(tx.symbol);
                      const currentLivePrice = quote ? quote.price : tx.price;
                      const isProfit =
                        tx.type === 'BUY'
                          ? currentLivePrice >= tx.price
                          : tx.price >= currentLivePrice;

                      return (
                        <tr
                          key={tx.id}
                          onClick={() => onSelectStock(tx.symbol)}
                          className="hover:bg-[#151926] transition-colors cursor-pointer"
                        >
                          <td className="py-2.5 px-3 text-neutral-400">{tx.id}</td>
                          <td className="py-2.5 px-3 text-neutral-400 text-[11px] whitespace-nowrap">
                            {tx.timestamp}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                                tx.type === 'BUY'
                                  ? 'bg-[#22ab94]/20 text-[#22ab94] border border-[#22ab94]/30'
                                  : 'bg-[#f23645]/20 text-[#f23645] border border-[#f23645]/30'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-sans">
                            <div className="font-bold text-white tracking-tight">{tx.symbol}</div>
                            <div className="text-[10px] text-neutral-400 truncate max-w-[140px]">
                              {tx.name}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right text-white font-bold">
                            {tx.shares.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right text-neutral-300">
                            {formatCurrency(tx.price, tx.currency)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={`font-bold ${isProfit ? 'text-[#22ab94]' : 'text-[#f23645]'}`}>
                              {formatCurrency(currentLivePrice, tx.currency)}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-white">
                            {formatCurrency(tx.total, tx.currency)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1d2638] text-neutral-300 border border-[#2b354c]">
                              {t.txExecuted}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: HOLDINGS & PORTFOLIO */}
          {activeTab === 'holdings' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-[#1e222d]">
                <table className="w-full text-left text-xs border-collapse font-mono-num">
                  <thead>
                    <tr className="bg-[#121622] text-neutral-400 text-[10px] uppercase font-bold border-b border-[#1e222d] font-sans">
                      <th className="py-2.5 px-3">{t.colAsset}</th>
                      <th className="py-2.5 px-3 text-right">{t.colShares}</th>
                      <th className="py-2.5 px-3 text-right">{t.colAvgPrice}</th>
                      <th className="py-2.5 px-3 text-right">{t.colMarketPrice}</th>
                      <th className="py-2.5 px-3 text-right">{t.colCurrentValue}</th>
                      <th className="py-2.5 px-3 text-right">{t.colUnrealizedPL}</th>
                      <th className="py-2.5 px-3 text-center">{t.colQuickAction}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#161a26]">
                    {holdings.map((h) => {
                      const quote = stockMap.get(h.symbol);
                      const livePrice = quote ? quote.price : h.avgBuyPrice;
                      const currentValue = h.shares * livePrice;
                      const costBasis = h.shares * h.avgBuyPrice;
                      const plNominal = currentValue - costBasis;
                      const plPercent = (plNominal / costBasis) * 100;
                      const isProfit = plNominal >= 0;

                      return (
                        <tr
                          key={h.symbol}
                          onClick={() => onSelectStock(h.symbol)}
                          className="hover:bg-[#151926] transition-colors cursor-pointer"
                        >
                          <td className="py-2.5 px-3 font-sans">
                            <div className="font-bold text-white tracking-tight">{h.symbol}</div>
                            <div className="text-[10px] text-neutral-400">{h.name}</div>
                          </td>
                          <td className="py-2.5 px-3 text-right text-white font-bold">
                            {h.shares.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right text-neutral-300">
                            {formatCurrency(h.avgBuyPrice, h.currency)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-white">
                            {formatCurrency(livePrice, h.currency)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-white">
                            {formatCurrency(currentValue, h.currency)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold">
                            <span className={isProfit ? 'text-[#22ab94]' : 'text-[#f23645]'}>
                              {isProfit ? '+' : ''}{formatCurrency(plNominal, h.currency)}
                              {' '}({isProfit ? '+' : ''}{plPercent.toFixed(2)}%)
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => quote && onOpenTrade(quote, 'BUY')}
                                className="px-2 py-0.5 rounded bg-[#22ab94]/20 hover:bg-[#22ab94]/40 text-[#22ab94] text-[10px] font-bold border border-[#22ab94]/40 transition-colors cursor-pointer"
                              >
                                {t.btnBuyMore}
                              </button>
                              <button
                                onClick={() => quote && onOpenTrade(quote, 'SELL')}
                                className="px-2 py-0.5 rounded bg-[#f23645]/20 hover:bg-[#f23645]/40 text-[#f23645] text-[10px] font-bold border border-[#f23645]/40 transition-colors cursor-pointer"
                              >
                                {t.btnSell}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CASH BALANCE & RDN SUMMARY */}
          {activeTab === 'balance' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#121622] border border-[#1e2434] rounded-xl p-4 space-y-2">
                <span className="text-xs text-neutral-400 font-semibold">{t.cashUSDLabel}</span>
                <div className="text-xl font-extrabold text-white font-mono-num">
                  {formatCurrency(userProfile.cashBalanceUSD, 'USD')}
                </div>
                <button
                  onClick={onOpenProfile}
                  className="text-xs text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1 pt-1"
                >
                  <span>Atur Saldo di Pengaturan</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-[#121622] border border-[#1e2434] rounded-xl p-4 space-y-2">
                <span className="text-xs text-neutral-400 font-semibold">{t.cashIDRLabel}</span>
                <div className="text-xl font-extrabold text-white font-mono-num">
                  {formatCurrency(userProfile.cashBalanceIDR, 'IDR')}
                </div>
                <button
                  onClick={onOpenProfile}
                  className="text-xs text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1 pt-1"
                >
                  <span>Atur Saldo di Pengaturan</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-[#121622] border border-[#1e2434] rounded-xl p-4 space-y-2">
                <span className="text-xs text-neutral-400 font-semibold">Total Nilai Portofolio</span>
                <div className="text-xl font-extrabold text-emerald-400 font-mono-num">
                  {selectedCurrency === 'USD'
                    ? formatCurrency(totalPortfolioValueUSD, 'USD')
                    : formatCurrency(totalPortfolioValueIDR, 'IDR')}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Investor: <strong className="text-white">{userProfile.name}</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
