import React, { useState } from 'react';
import {
  Plus,
  LayoutGrid,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Edit2,
  Clock,
  Newspaper,
  Flame,
  Calendar,
  Lightbulb,
  MessageSquare,
  Bell,
  HelpCircle,
  Bookmark,
  TrendingUp,
} from 'lucide-react';
import { StockQuote, MarketIndex, CurrencyType, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { MarketLogo, StockCompanyLogo } from './MarketLogo';

interface MarketWatchlistProps {
  stocks: StockQuote[];
  indices: MarketIndex[];
  activeSymbol: string;
  onSelectStock: (symbol: string) => void;
  onOpenTrade: (stock: StockQuote, type: 'BUY' | 'SELL') => void;
  selectedCurrency: CurrencyType;
  language: Language;
}

export const MarketWatchlist: React.FC<MarketWatchlistProps> = ({
  stocks,
  indices,
  activeSymbol,
  onSelectStock,
  onOpenTrade,
  selectedCurrency,
  language,
}) => {
  const t = TRANSLATIONS[language || 'id'];
  const [activeRightTab, setActiveRightTab] = useState<'watchlist' | 'alerts' | 'news' | 'calendar'>('watchlist');
  const [indicesOpen, setIndicesOpen] = useState(true);
  const [stocksOpen, setStocksOpen] = useState(true);

  const activeStock = stocks.find((s) => s.symbol === activeSymbol) || stocks[0];

  // Number formatters for TradingView look
  const formatTV = (val: number, decimals: number = 2) => {
    const locale = language === 'id' ? 'id-ID' : 'en-US';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  };

  const isPositive = (val: number) => val >= 0;

  return (
    <div id="tradingview-right-panel" className="flex h-full bg-[#0c0f17] border border-[#1e222d] rounded-none sm:rounded-xl overflow-hidden shadow-2xl">
      {/* 1. Main Watchlist Content Column */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-[#1e222d] overflow-y-auto">
        {/* Watchlist Header */}
        <div className="px-3 py-2.5 border-b border-[#1e222d] flex items-center justify-between bg-[#0c0f17]">
          <div className="flex items-center gap-1.5 cursor-pointer text-white font-bold text-xs hover:text-neutral-200">
            <span>{t.watchlistTitle}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </div>

          <div className="flex items-center gap-1 text-neutral-400">
            <button
              onClick={() => onOpenTrade(activeStock, 'BUY')}
              title="Tambah Simbol"
              className="p-1 rounded hover:bg-[#1e222d] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 rounded hover:bg-[#1e222d] hover:text-white transition-colors cursor-pointer">
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 rounded hover:bg-[#1e222d] hover:text-white transition-colors cursor-pointer">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Column Headers */}
        <div className="grid grid-cols-12 px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-[#1e222d] bg-[#0e121c]">
          <div className="col-span-5">{t.colSymbol}</div>
          <div className="col-span-3 text-right">{t.colLast}</div>
          <div className="col-span-2 text-right">{t.colChange}</div>
          <div className="col-span-2 text-right">{t.colChangePercent}</div>
        </div>

        {/* Watchlist Items Sections */}
        <div className="divide-y divide-[#181c26] overflow-y-auto max-h-[380px]">
          {/* Section: INDICES */}
          <div>
            <button
              onClick={() => setIndicesOpen(!indicesOpen)}
              className="w-full px-3 py-1.5 flex items-center gap-1 text-[11px] font-bold text-neutral-300 hover:text-white bg-[#101420] text-left cursor-pointer"
            >
              {indicesOpen ? <ChevronDown className="w-3 h-3 text-neutral-400" /> : <ChevronUp className="w-3 h-3 text-neutral-400" />}
              <span>{t.sectionIndices}</span>
            </button>

            {indicesOpen && (
              <div className="divide-y divide-[#151923]">
                {indices.map((idx) => {
                  const isPos = idx.change >= 0;
                  const isSelected = activeSymbol === idx.symbol;
                  return (
                    <div
                      key={idx.symbol}
                      onClick={() => onSelectStock(idx.symbol)}
                      className={`grid grid-cols-12 items-center px-3 py-2 text-xs font-mono-num transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#1e2536]' : 'hover:bg-[#141824]'
                      }`}
                    >
                      <div className="col-span-5 flex items-center gap-1.5 min-w-0">
                        <StockCompanyLogo symbol={idx.symbol} market="GLOBAL" size="xs" />
                        <span className="font-bold text-white tracking-tight truncate font-sans">
                          {idx.name}
                        </span>
                        <MarketLogo market="GLOBAL" size="xs" />
                        {idx.name === 'VIX' && (
                          <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-0.5 rounded shrink-0">
                            D
                          </span>
                        )}
                      </div>
                      <div className="col-span-3 text-right text-neutral-200 font-semibold">
                        {formatTV(idx.value, idx.name === 'DXY' ? 3 : 2)}
                      </div>
                      <div
                        className={`col-span-2 text-right font-medium ${
                          isPos ? 'text-[#22ab94]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}{formatTV(idx.change, idx.name === 'DXY' ? 3 : 2)}
                      </div>
                      <div
                        className={`col-span-2 text-right font-bold ${
                          isPos ? 'text-[#22ab94]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}{formatTV(idx.changePercent, 2)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: STOCKS */}
          <div>
            <button
              onClick={() => setStocksOpen(!stocksOpen)}
              className="w-full px-3 py-1.5 flex items-center gap-1 text-[11px] font-bold text-neutral-300 hover:text-white bg-[#101420] text-left cursor-pointer"
            >
              {stocksOpen ? <ChevronDown className="w-3 h-3 text-neutral-400" /> : <ChevronUp className="w-3 h-3 text-neutral-400" />}
              <span>{t.sectionStocks}</span>
            </button>

            {stocksOpen && (
              <div className="divide-y divide-[#151923]">
                {stocks.map((stock) => {
                  const isPos = stock.change >= 0;
                  const isSelected = activeSymbol === stock.symbol;
                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => onSelectStock(stock.symbol)}
                      className={`grid grid-cols-12 items-center px-3 py-2 text-xs font-mono-num transition-colors cursor-pointer ${
                        isSelected ? 'bg-[#1e2536]' : 'hover:bg-[#141824]'
                      }`}
                    >
                      <div className="col-span-5 flex items-center gap-1.5 min-w-0">
                        <StockCompanyLogo symbol={stock.symbol} market={stock.market} size="xs" />
                        <span className="font-bold text-white tracking-tight truncate font-sans">
                          {stock.symbol}
                        </span>
                        <MarketLogo market={stock.market} size="xs" />
                      </div>
                      <div className="col-span-3 text-right text-neutral-200 font-semibold">
                        {formatTV(stock.price, stock.price >= 1000 ? (stock.market === 'IDX' && stock.symbol !== 'COMPOSITE' ? 0 : 2) : 2)}
                      </div>
                      <div
                        className={`col-span-2 text-right font-medium ${
                          isPos ? 'text-[#22ab94]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}{formatTV(stock.change, stock.price >= 1000 && stock.market === 'IDX' && stock.symbol !== 'COMPOSITE' ? 0 : 2)}
                      </div>
                      <div
                        className={`col-span-2 text-right font-bold ${
                          isPos ? 'text-[#22ab94]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}{formatTV(stock.changePercent, 2)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 2. Active Symbol Mini-Overview Card (Matching Screenshot bottom-right) */}
        <div className="border-t border-[#1e222d] bg-[#0e121a] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <StockCompanyLogo symbol={activeStock.symbol} market={activeStock.market} size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-white tracking-tight">
                    {activeStock.symbol}
                  </span>
                  <MarketLogo market={activeStock.market} size="xs" showLabel={true} />
                </div>
                <p className="text-[10px] text-neutral-400 font-sans truncate max-w-[140px]">
                  {activeStock.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-400">
              <button className="p-1 hover:text-white transition-colors cursor-pointer">
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 hover:text-white transition-colors cursor-pointer">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button className="p-1 hover:text-white transition-colors cursor-pointer">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-[11px] text-neutral-300 font-medium truncate">
              <span className="truncate">{activeStock.name}</span>
              <ExternalLink className="w-3 h-3 text-neutral-400 shrink-0" />
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400 shrink-0">{activeStock.market}</span>
            </div>
            <div className="mt-0.5">
              <span className="text-[10px] bg-[#1a202c] text-neutral-400 px-1.5 py-0.5 rounded font-medium border border-[#232a3b]">
                {activeStock.market === 'IDX' && activeStock.symbol === 'COMPOSITE' ? t.indexTag : t.stockTag}
              </span>
            </div>
          </div>

          {/* Big Price Display with D tag and Point */}
          <div>
            <div className="flex items-baseline gap-1.5 font-mono-num">
              <span className="text-xl font-black text-white tracking-tight">
                {formatTV(activeStock.price, activeStock.price >= 1000 ? 4 : 2)}
              </span>
              <span className="text-[10px] font-black bg-amber-500/20 text-amber-400 px-1 rounded">
                D
              </span>
              <span className="text-[10px] font-bold text-neutral-400">
                POINT
              </span>
            </div>

            <div
              className={`flex items-center gap-1.5 text-xs font-mono-num font-bold mt-0.5 ${
                activeStock.change >= 0 ? 'text-[#22ab94]' : 'text-[#f23645]'
              }`}
            >
              <span>{activeStock.change >= 0 ? '+' : ''}{formatTV(activeStock.change, 4)}</span>
              <span>({activeStock.change >= 0 ? '+' : ''}{activeStock.changePercent.toFixed(2)}%)</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#22ab94] font-medium mt-1">
              <span className="w-2 h-2 rounded-full bg-[#22ab94] animate-pulse"></span>
              <span>{t.marketOpen}</span>
            </div>
          </div>

          {/* News Box ("Berita") */}
          <div className="bg-[#141824] border border-[#212738] rounded-xl p-2.5 space-y-1">
            <div className="text-[10px] text-neutral-400 flex items-center gap-1">
              <span className="font-semibold text-neutral-300">{t.newsHeader}</span>
              <span>•</span>
              <span>{t.newsTimeAgo}</span>
            </div>
            <p className="text-xs text-neutral-200 font-semibold leading-snug line-clamp-2 hover:text-white cursor-pointer">
              {t.newsTitle}
            </p>
            <div className="text-[10px] text-blue-400 font-medium hover:underline cursor-pointer pt-0.5">
              {t.newsMore} &gt;
            </div>
          </div>

          {/* Performance Box ("Kinerja") */}
          <div className="space-y-1 pt-1">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
              {t.performanceHeader}
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center font-mono-num text-xs">
              <div className="bg-[#141824] border border-[#212738] rounded-lg py-1 px-1.5">
                <div className="text-[#f23645] font-bold">-1,43%</div>
                <div className="text-[10px] text-neutral-400">{t.perf1W}</div>
              </div>
              <div className="bg-[#141824] border border-[#212738] rounded-lg py-1 px-1.5">
                <div className="text-[#22ab94] font-bold">+3,94%</div>
                <div className="text-[10px] text-neutral-400">{t.perf1M}</div>
              </div>
              <div className="bg-[#141824] border border-[#212738] rounded-lg py-1 px-1.5">
                <div className="text-[#22ab94] font-bold">+3,52%</div>
                <div className="text-[10px] text-neutral-400">{t.perf3M}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Far Right Vertical Icon Strip (TradingView 10-icon toolbar) */}
      <div className="w-10 bg-[#090c14] flex flex-col items-center py-2 justify-between shrink-0 select-none">
        {/* Upper Icons */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setActiveRightTab('watchlist')}
            title="Watchlist"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeRightTab === 'watchlist'
                ? 'text-[#2962ff] bg-[#1a2130]'
                : 'text-neutral-400 hover:text-white hover:bg-[#161a24]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveRightTab('alerts')}
            title="Alerts"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeRightTab === 'alerts'
                ? 'text-[#2962ff] bg-[#1a2130]'
                : 'text-neutral-400 hover:text-white hover:bg-[#161a24]'
            }`}
          >
            <Clock className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveRightTab('news')}
            title="News"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeRightTab === 'news'
                ? 'text-[#2962ff] bg-[#1a2130]'
                : 'text-neutral-400 hover:text-white hover:bg-[#161a24]'
            }`}
          >
            <Newspaper className="w-4 h-4" />
          </button>

          <button
            title="Hotlists"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161a24] transition-colors cursor-pointer"
          >
            <Flame className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveRightTab('calendar')}
            title="Calendar"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeRightTab === 'calendar'
                ? 'text-[#2962ff] bg-[#1a2130]'
                : 'text-neutral-400 hover:text-white hover:bg-[#161a24]'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>

          <button
            title="Ideas"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161a24] transition-colors cursor-pointer"
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          <button
            title="Community Chat"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161a24] transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Lower Icons */}
        <div className="flex flex-col items-center gap-3">
          <button
            title="Notifications"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161a24] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            title="Layout Menu"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161a24] transition-colors cursor-pointer"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            title="Help"
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161a24] transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
