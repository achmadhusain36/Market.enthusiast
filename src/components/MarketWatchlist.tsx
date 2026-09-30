import React, { useState, useMemo } from 'react';
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
  TrendingDown,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Search,
  Filter,
} from 'lucide-react';
import { StockQuote, MarketIndex, CurrencyType, Language, PriceAlert } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { MarketLogo, StockCompanyLogo } from './MarketLogo';
import { INITIAL_ECONOMIC_EVENTS, INITIAL_NEWS_ITEMS } from '../data/marketTerminalData';

interface MarketWatchlistProps {
  stocks: StockQuote[];
  indices: MarketIndex[];
  activeSymbol: string;
  onSelectStock: (symbol: string) => void;
  onOpenTrade: (stock: StockQuote, type: 'BUY' | 'SELL') => void;
  selectedCurrency: CurrencyType;
  language: Language;
  alerts?: PriceAlert[];
  onOpenAlertModal?: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenSearch?: () => void;
}

export const MarketWatchlist: React.FC<MarketWatchlistProps> = ({
  stocks,
  indices,
  activeSymbol,
  onSelectStock,
  onOpenTrade,
  selectedCurrency,
  language = 'en',
  alerts = [],
  onOpenAlertModal,
  onNavigateToTab,
  onOpenSearch,
}) => {
  const t = TRANSLATIONS[language || 'en'];
  const isId = language === 'id';

  // Navigation tab for the right panel: watchlist, alerts, news, hotlists, calendar, ideas, help
  const [activeRightTab, setActiveRightTab] = useState<
    'watchlist' | 'alerts' | 'news' | 'hotlists' | 'calendar' | 'ideas' | 'help'
  >('watchlist');

  const [indicesOpen, setIndicesOpen] = useState(true);
  const [stocksOpen, setStocksOpen] = useState(true);

  // Sorting & display options
  const [sortBy, setSortBy] = useState<'default' | 'gainers' | 'losers' | 'volume' | 'az'>('default');
  const [isDense, setIsDense] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const activeStock = stocks.find((s) => s.symbol === activeSymbol) || stocks[0];

  // Number formatters for TradingView look
  const formatTV = (val: number, decimals: number = 2) => {
    const locale = isId ? 'id-ID' : 'en-US';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  };

  // Sorted stocks list
  const sortedStocks = useMemo(() => {
    const list = [...stocks];
    if (sortBy === 'gainers') {
      return list.sort((a, b) => b.changePercent - a.changePercent);
    }
    if (sortBy === 'losers') {
      return list.sort((a, b) => a.changePercent - b.changePercent);
    }
    if (sortBy === 'volume') {
      return list.sort((a, b) => b.volume - a.volume);
    }
    if (sortBy === 'az') {
      return list.sort((a, b) => a.symbol.localeCompare(b.symbol));
    }
    return list;
  }, [stocks, sortBy]);

  // Hotlists
  const topGainers = useMemo(
    () => [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5),
    [stocks]
  );
  const topLosers = useMemo(
    () => [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5),
    [stocks]
  );
  const mostActive = useMemo(
    () => [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 5),
    [stocks]
  );

  return (
    <div
      id="tradingview-right-panel"
      className="flex h-full bg-[#000000] border border-[#1c1f26] rounded-none sm:rounded-xl overflow-hidden shadow-2xl relative"
    >
      {/* 1. Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-[#1c1f26] overflow-y-auto">
        {/* Watchlist Header */}
        <div className="px-3 py-2.5 border-b border-[#1c1f26] flex items-center justify-between bg-[#000000] relative">
          <div
            onClick={() => setActiveRightTab('watchlist')}
            className="flex items-center gap-1.5 cursor-pointer text-white font-bold text-xs hover:text-neutral-200"
          >
            <span>
              {activeRightTab === 'watchlist'
                ? t.watchlistTitle
                : activeRightTab === 'alerts'
                ? isId
                  ? 'Price Alerts'
                  : 'Active Alerts'
                : activeRightTab === 'news'
                ? isId
                  ? 'Berita Terkini'
                  : 'Market News'
                : activeRightTab === 'hotlists'
                ? isId
                  ? 'Hotlists Pasar'
                  : 'Market Hotlists'
                : activeRightTab === 'calendar'
                ? isId
                  ? 'Kalender Ekonomi'
                  : 'Economic Agenda'
                : activeRightTab === 'ideas'
                ? isId
                  ? 'Ide Komunitas'
                  : 'Community Ideas'
                : isId
                ? 'Panduan Tombol'
                : 'Help & Shortcuts'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </div>

          <div className="flex items-center gap-1 text-neutral-400">
            {/* Quick Add Symbol or Search */}
            <button
              onClick={() => {
                if (onOpenSearch) {
                  onOpenSearch();
                } else {
                  onOpenTrade(activeStock, 'BUY');
                }
              }}
              title={isId ? 'Cari / Tambah Simbol' : 'Add / Search Symbol'}
              className="p-1.5 rounded hover:bg-[#1a1e28] hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* View Mode Toggle (Compact vs Comfortable) */}
            <button
              onClick={() => setIsDense(!isDense)}
              title={isDense ? (isId ? 'Mode Rapat (Aktif)' : 'Compact Mode (Active)') : (isId ? 'Mode Normal' : 'Standard View')}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                isDense ? 'text-[#2962ff] bg-[#1a2130]' : 'hover:bg-[#1a1e28] hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>

            {/* More options & Sorting dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                title={isId ? 'Opsi Pengurutan & Filter' : 'Sorting & Filter Options'}
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  showMenu ? 'text-white bg-[#1a2130]' : 'hover:bg-[#1a1e28] hover:text-white'
                }`}
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {/* Floating Menu */}
              {showMenu && (
                <div className="absolute right-0 top-8 w-52 bg-[#121622] border border-[#21293c] rounded-xl shadow-2xl p-1.5 z-50 text-xs animate-in fade-in">
                  <div className="text-[10px] uppercase font-bold text-neutral-500 px-2 py-1">
                    {isId ? 'Urutkan Saham:' : 'Sort Stocks:'}
                  </div>
                  <button
                    onClick={() => {
                      setSortBy('default');
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                      sortBy === 'default' ? 'bg-[#2962ff]/20 text-[#82aaff] font-bold' : 'text-neutral-300 hover:bg-[#182030]'
                    }`}
                  >
                    <span>{isId ? 'Default (Standar)' : 'Default (Standard)'}</span>
                    {sortBy === 'default' && <Check className="w-3 h-3 text-[#2962ff]" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('gainers');
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                      sortBy === 'gainers' ? 'bg-[#2962ff]/20 text-emerald-400 font-bold' : 'text-neutral-300 hover:bg-[#182030]'
                    }`}
                  >
                    <span>{isId ? '% Gainers Tertinggi' : 'Highest % Gainers'}</span>
                    {sortBy === 'gainers' && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('losers');
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                      sortBy === 'losers' ? 'bg-[#2962ff]/20 text-rose-400 font-bold' : 'text-neutral-300 hover:bg-[#182030]'
                    }`}
                  >
                    <span>{isId ? '% Losers Terbesar' : 'Biggest % Losers'}</span>
                    {sortBy === 'losers' && <Check className="w-3 h-3 text-rose-400" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('volume');
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                      sortBy === 'volume' ? 'bg-[#2962ff]/20 text-cyan-400 font-bold' : 'text-neutral-300 hover:bg-[#182030]'
                    }`}
                  >
                    <span>{isId ? 'Volume Terbanyak' : 'Highest Volume'}</span>
                    {sortBy === 'volume' && <Check className="w-3 h-3 text-cyan-400" />}
                  </button>
                  <button
                    onClick={() => {
                      setSortBy('az');
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between cursor-pointer ${
                      sortBy === 'az' ? 'bg-[#2962ff]/20 text-purple-400 font-bold' : 'text-neutral-300 hover:bg-[#182030]'
                    }`}
                  >
                    <span>{isId ? 'Simbol (A - Z)' : 'Symbol (A - Z)'}</span>
                    {sortBy === 'az' && <Check className="w-3 h-3 text-purple-400" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TAB 1: WATCHLIST & EMITEN DETAILS */}
        {activeRightTab === 'watchlist' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Table Column Headers */}
            <div className="grid grid-cols-12 px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-[#1c1f26] bg-[#000000]">
              <div className="col-span-5">{t.colSymbol}</div>
              <div className="col-span-3 text-right">{t.colLast}</div>
              <div className="col-span-2 text-right">{t.colChange}</div>
              <div className="col-span-2 text-right">{t.colChangePercent}</div>
            </div>

            {/* Watchlist Items Sections */}
            <div className="divide-y divide-[#181c26] overflow-y-auto max-h-[360px]">
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
                          className={`grid grid-cols-12 items-center px-3 ${
                            isDense ? 'py-1 text-[11px]' : 'py-2 text-xs'
                          } font-mono-num transition-colors cursor-pointer ${
                            isSelected ? 'bg-[#1e2536]' : 'hover:bg-[#141824]'
                          }`}
                        >
                          <div className="col-span-5 flex items-center gap-1.5 min-w-0">
                            <StockCompanyLogo symbol={idx.symbol} market="GLOBAL" size="xs" />
                            <span className="font-bold text-white tracking-tight truncate font-sans">
                              {idx.name}
                            </span>
                            <MarketLogo market="GLOBAL" size="xs" />
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
                    {sortedStocks.map((stock) => {
                      const isPos = stock.change >= 0;
                      const isSelected = activeSymbol === stock.symbol;
                      return (
                        <div
                          key={stock.symbol}
                          onClick={() => onSelectStock(stock.symbol)}
                          className={`grid grid-cols-12 items-center px-3 ${
                            isDense ? 'py-1 text-[11px]' : 'py-2 text-xs'
                          } font-mono-num transition-colors cursor-pointer ${
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
                            {formatTV(stock.price, stock.price >= 1000 ? 4 : 2)}
                          </div>
                          <div
                            className={`col-span-2 text-right font-medium ${
                              isPos ? 'text-[#22ab94]' : 'text-[#f23645]'
                            }`}
                          >
                            {isPos ? '+' : ''}{formatTV(stock.change, stock.price >= 1000 ? 4 : 2)}
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

            {/* Bottom Active Stock Insight Box */}
            <div className="p-3 border-t border-[#1c1f26] bg-[#0c0f17] space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <StockCompanyLogo symbol={activeStock.symbol} market={activeStock.market} size="sm" />
                    <div>
                      <span className="font-bold text-white block">{activeStock.symbol}</span>
                      <span className="text-[10px] text-neutral-400 block truncate max-w-[130px]">
                        {activeStock.name}
                      </span>
                    </div>
                  </div>
                  <span className="text-neutral-400 font-mono text-[11px]">{activeStock.market}</span>
                </div>
              </div>

              {/* Price display with 'D' tag */}
              <div className="flex items-baseline justify-between font-mono-num">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-black text-white tracking-tight">
                    {formatTV(activeStock.price, activeStock.price >= 1000 ? 4 : 2)}
                  </span>
                  <span className="text-[10px] font-black bg-amber-500/20 text-amber-400 px-1 rounded">
                    D
                  </span>
                </div>
                <div
                  className={`text-xs font-bold ${
                    activeStock.change >= 0 ? 'text-[#22ab94]' : 'text-[#f23645]'
                  }`}
                >
                  <span>{activeStock.change >= 0 ? '+' : ''}{formatTV(activeStock.change, 2)}</span>
                  <span className="ml-1">({activeStock.change >= 0 ? '+' : ''}{activeStock.changePercent.toFixed(2)}%)</span>
                </div>
              </div>

              {/* Action buttons: Buy / Sell */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onOpenTrade(activeStock, 'BUY')}
                  className="py-1.5 rounded-lg bg-[#22ab94] hover:bg-[#1e9a85] text-white text-xs font-bold transition-all cursor-pointer text-center"
                >
                  {isId ? 'Beli / Buy' : 'Buy'}
                </button>
                <button
                  onClick={() => onOpenTrade(activeStock, 'SELL')}
                  className="py-1.5 rounded-lg bg-[#f23645] hover:bg-[#d82c3a] text-white text-xs font-bold transition-all cursor-pointer text-center"
                >
                  {isId ? 'Jual / Sell' : 'Sell'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE ALERTS */}
        {activeRightTab === 'alerts' && (
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c1f26]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Clock className="w-4 h-4" />
                <span>{isId ? 'Price Alert Aktif' : 'Active Price Alerts'}</span>
              </div>
              {onOpenAlertModal && (
                <button
                  onClick={onOpenAlertModal}
                  className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 hover:bg-amber-500/30 transition-colors cursor-pointer"
                >
                  + {isId ? 'Buat Alert' : 'New Alert'}
                </button>
              )}
            </div>

            {alerts.length === 0 ? (
              <div className="py-10 text-center text-neutral-500 text-xs">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-400" />
                <p>{isId ? 'Belum ada alert aktif.' : 'No active alerts.'}</p>
                {onOpenAlertModal && (
                  <button
                    onClick={onOpenAlertModal}
                    className="mt-2 text-cyan-400 font-bold underline cursor-pointer"
                  >
                    {isId ? 'Pasang alert sekarang' : 'Create alert now'}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-2.5 rounded-xl bg-[#121622] border border-[#1d2538] text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="font-bold text-white">{alt.symbol}</span>
                        <span className="text-[10px] px-1 rounded bg-[#1a2334] text-neutral-300">
                          {alt.condition.replace('_', ' ')}
                        </span>
                        <span className="font-bold text-amber-400">{alt.targetPrice.toLocaleString()}</span>
                      </div>
                      {alt.note && <p className="text-[10px] text-neutral-400 mt-0.5">{alt.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MARKET NEWS */}
        {activeRightTab === 'news' && (
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c1f26]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                <Newspaper className="w-4 h-4" />
                <span>{isId ? 'Berita Pasar Global' : 'Market News Stream'}</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {INITIAL_NEWS_ITEMS.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-[#121622] border border-[#1b2336] hover:border-[#27354e] transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-cyan-400 font-bold">{item.source}</span>
                    <span className="text-neutral-500">{item.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-neutral-400 line-clamp-2">{item.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: HOTLISTS */}
        {activeRightTab === 'hotlists' && (
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c1f26]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400">
                <Flame className="w-4 h-4" />
                <span>{isId ? 'Top Movers Pasar' : 'Market Movers Hotlists'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                Top Gainers (+%)
              </span>
              {topGainers.map((s) => (
                <div
                  key={s.symbol}
                  onClick={() => onSelectStock(s.symbol)}
                  className="p-2 rounded-lg bg-[#121622] hover:bg-[#182030] flex items-center justify-between text-xs cursor-pointer border border-[#1c2438]"
                >
                  <span className="font-bold text-white">{s.symbol}</span>
                  <span className="font-bold text-emerald-400 font-mono">+{s.changePercent.toFixed(2)}%</span>
                </div>
              ))}

              <span className="text-[10px] uppercase font-bold text-rose-400 block pt-2">
                Top Losers (-%)
              </span>
              {topLosers.map((s) => (
                <div
                  key={s.symbol}
                  onClick={() => onSelectStock(s.symbol)}
                  className="p-2 rounded-lg bg-[#121622] hover:bg-[#182030] flex items-center justify-between text-xs cursor-pointer border border-[#1c2438]"
                >
                  <span className="font-bold text-white">{s.symbol}</span>
                  <span className="font-bold text-rose-400 font-mono">{s.changePercent.toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CALENDAR */}
        {activeRightTab === 'calendar' && (
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c1f26]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Calendar className="w-4 h-4" />
                <span>{isId ? 'Agenda Ekonomi Terdekat' : 'Economic Calendar'}</span>
              </div>
            </div>
            <div className="space-y-2">
              {INITIAL_ECONOMIC_EVENTS.slice(0, 5).map((evt) => (
                <div
                  key={evt.id}
                  className="p-2 rounded-xl bg-[#121622] border border-[#1c2438] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white">{evt.country} • {evt.event}</span>
                    <span className="text-amber-400 font-mono font-bold">{evt.time}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span>{evt.date}</span>
                    <span className="text-emerald-400 font-bold">{evt.actual || evt.forecast}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: IDEAS */}
        {activeRightTab === 'ideas' && (
          <div className="p-3 space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#1c1f26]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-400">
                <Lightbulb className="w-4 h-4" />
                <span>{isId ? 'Ide Trading Komunitas' : 'Trading Ideas'}</span>
              </div>
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('community')}
                  className="text-cyan-400 text-[10px] font-bold hover:underline cursor-pointer"
                >
                  {isId ? 'Buka Komunitas →' : 'Open All →'}
                </button>
              )}
            </div>
            <div className="p-3 rounded-xl bg-[#121622] border border-[#1d2538] text-xs space-y-1.5">
              <span className="font-bold text-white block">BBCA Swing Setup</span>
              <p className="text-[11px] text-neutral-300">
                {isId
                  ? 'Rebound dari support 10.350 dengan target swing 11.200. Diskusikan bersama investor lain di tab Komunitas.'
                  : 'Rebounding from 10,350 support targeting 11,200 swing. Join the live discussion in Community.'}
              </p>
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('community')}
                  className="mt-2 text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer"
                >
                  {isId ? 'Baca & Tulis Analisis' : 'Read & Post Analysis'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: HELP & SHORTCUTS */}
        {activeRightTab === 'help' && (
          <div className="p-3 space-y-3 flex-1 overflow-y-auto text-xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 pb-2 border-b border-[#1c1f26]">
              <HelpCircle className="w-4 h-4" />
              <span>{isId ? 'Panduan & Pintasan Tombol' : 'Shortcuts & User Guide'}</span>
            </div>
            <div className="space-y-2 text-neutral-300">
              <div className="flex items-center justify-between p-2 rounded bg-[#121622]">
                <span>{isId ? 'Cari Saham Cepat' : 'Instant Search'}</span>
                <kbd className="px-1.5 py-0.5 rounded bg-[#1c2438] text-white font-mono text-[10px]">Ctrl + K</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#121622]">
                <span>{isId ? 'Sandi PIN Pengaturan & Saldo' : 'Settings & Cash PIN'}</span>
                <span className="font-mono font-bold text-amber-400">708951</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-[#121622]">
                <span>{isId ? 'Order Beli & Jual Saham' : 'Execute Buy / Sell'}</span>
                <span className="text-emerald-400 font-bold">{isId ? 'PIN Otorisasi' : 'PIN Protected'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Far Right Vertical Icon Strip (TradingView 10-icon toolbar) */}
      <div className="w-10 bg-[#000000] border-l border-[#1c1f26] flex flex-col items-center py-2 justify-between shrink-0 select-none">
        {/* Upper Icons */}
        <div className="flex flex-col items-center gap-2.5">
          <button
            onClick={() => setActiveRightTab('watchlist')}
            title={isId ? 'Daftar Pantau (Watchlist)' : 'Watchlist'}
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
            title={isId ? 'Daftar Alert Harga' : 'Price Alerts'}
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
            title={isId ? 'Berita Pasar' : 'Market News'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeRightTab === 'news'
                ? 'text-[#2962ff] bg-[#1a2130]'
                : 'text-neutral-400 hover:text-white hover:bg-[#161a24]'
            }`}
          >
            <Newspaper className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveRightTab('hotlists')}
            title={isId ? 'Movers / Hotlists' : 'Hotlists'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeRightTab === 'hotlists'
                ? 'text-rose-400 bg-[#1a2130]'
                : 'text-neutral-400 hover:text-white hover:bg-[#161a24]'
            }`}
          >
            <Flame className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveRightTab('calendar')}
            title={isId ? 'Kalender Ekonomi' : 'Economic Calendar'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeRightTab === 'calendar'
                ? 'text-amber-400 bg-[#1a2130]'
                : 'text-neutral-400 hover:text-white hover:bg-[#161a24]'
            }`}
          >
            <Calendar className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveRightTab('ideas')}
            title={isId ? 'Ide Analisis' : 'Ideas'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeRightTab === 'ideas'
                ? 'text-purple-400 bg-[#1a2130]'
                : 'text-neutral-400 hover:text-white hover:bg-[#161a24]'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (onNavigateToTab) {
                onNavigateToTab('community');
              } else {
                setActiveRightTab('ideas');
              }
            }}
            title={isId ? 'Diskusi Komunitas' : 'Community'}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161a24] transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Lower Icons */}
        <div className="flex flex-col items-center gap-2.5">
          <button
            onClick={() => setActiveRightTab('alerts')}
            title={isId ? 'Notifikasi & Alerts' : 'Notifications & Alerts'}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-[#161a24] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDense(!isDense)}
            title={isId ? 'Ganti Kerapatan Baris' : 'Toggle Density'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDense ? 'text-[#2962ff]' : 'text-neutral-400 hover:text-white hover:bg-[#161a24]'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveRightTab('help')}
            title={isId ? 'Bantuan & Pintasan' : 'Help & Shortcuts'}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              activeRightTab === 'help'
                ? 'text-cyan-400 bg-[#1a2130]'
                : 'text-neutral-400 hover:text-white hover:bg-[#161a24]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
