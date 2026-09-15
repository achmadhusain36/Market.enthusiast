import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ArrowUpDown,
  Flame,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';
import { StockQuote, MarketIndex, CurrencyType, Language } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { MarketLogo, StockCompanyLogo } from './MarketLogo';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: StockQuote[];
  indices: MarketIndex[];
  onSelectStock: (symbol: string) => void;
  onOpenTrade: (stock: StockQuote) => void;
  selectedCurrency: CurrencyType;
  language?: Language;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  indices,
  onSelectStock,
  onOpenTrade,
  selectedCurrency,
  language = 'id',
}) => {
  const [query, setQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<'ALL' | 'IDX' | 'NASDAQ' | 'NYSE' | 'INDEX'>('ALL');
  const inputRef = useRef<HTMLInputElement>(null);
  const isId = language === 'id';

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();

    let stockList = stocks;
    if (selectedMarket === 'IDX') {
      stockList = stocks.filter((s) => s.market === 'IDX');
    } else if (selectedMarket === 'NASDAQ') {
      stockList = stocks.filter((s) => s.market === 'NASDAQ');
    } else if (selectedMarket === 'NYSE') {
      stockList = stocks.filter((s) => s.market === 'NYSE');
    } else if (selectedMarket === 'INDEX') {
      stockList = stocks.filter((s) => s.symbol === 'COMPOSITE');
    }

    if (!q) return stockList;

    return stockList.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.sector && s.sector.toLowerCase().includes(q))
    );
  }, [stocks, query, selectedMarket]);

  if (!isOpen) return null;

  const popularSymbols = ['COMPOSITE', 'BBCA.JK', 'NVDA', 'TSLA', 'AAPL', 'BMRI.JK'];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0c1018] border border-[#212a3d] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1b2336] flex items-center gap-3 bg-[#111624]">
          <Search className="w-5 h-5 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isId
                ? 'Cari simbol saham, nama emiten, atau indeks (mis: BBCA, NVDA, TSLA)...'
                : 'Search stock symbol, company name, or index (e.g. AAPL, BBCA, TSLA)...'
            }
            className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#1f273b] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-[#1a2133] hover:bg-[#252e46] text-neutral-300 text-xs font-semibold transition-colors cursor-pointer border border-[#27324c]"
          >
            Esc
          </button>
        </div>

        {/* Filter Pills & Quick Tags */}
        <div className="px-4 py-2.5 bg-[#0e1320] border-b border-[#1a2235] flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedMarket('ALL')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedMarket === 'ALL'
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#151b2a] text-neutral-400 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>{isId ? 'Semua Pasar' : 'All Markets'}</span>
            </button>
            <button
              onClick={() => setSelectedMarket('IDX')}
              className={`px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedMarket === 'IDX'
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#151b2a] text-neutral-400 hover:text-white'
              }`}
            >
              <MarketLogo market="IDX" size="xs" />
              <span>IHSG (IDX)</span>
            </button>
            <button
              onClick={() => setSelectedMarket('NASDAQ')}
              className={`px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedMarket === 'NASDAQ'
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#151b2a] text-neutral-400 hover:text-white'
              }`}
            >
              <MarketLogo market="NASDAQ" size="xs" />
              <span>NASDAQ</span>
            </button>
            <button
              onClick={() => setSelectedMarket('NYSE')}
              className={`px-2.5 py-1 rounded-full font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedMarket === 'NYSE'
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#151b2a] text-neutral-400 hover:text-white'
              }`}
            >
              <MarketLogo market="NYSE" size="xs" />
              <span>NYSE</span>
            </button>
            <button
              onClick={() => setSelectedMarket('INDEX')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                selectedMarket === 'INDEX'
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#151b2a] text-neutral-400 hover:text-white'
              }`}
            >
              {isId ? 'Indeks Acuan' : 'Indices'}
            </button>
          </div>

          {/* Result Count */}
          <span className="text-[11px] text-neutral-400 shrink-0 font-mono-num hidden sm:inline">
            {filteredItems.length} {isId ? 'ditemukan' : 'found'}
          </span>
        </div>

        {/* Popular Trending Bar */}
        {!query && (
          <div className="px-4 py-2 bg-[#0a0d16] border-b border-[#161c2c] flex items-center gap-2 overflow-x-auto text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px] shrink-0">
              <Flame className="w-3.5 h-3.5" />
              <span>{isId ? 'Populer:' : 'Trending:'}</span>
            </div>
            {popularSymbols.map((sym) => (
              <button
                key={sym}
                onClick={() => {
                  onSelectStock(sym);
                  onClose();
                }}
                className="px-2.5 py-0.5 rounded-md bg-[#131826] hover:bg-[#1f283d] text-neutral-300 hover:text-emerald-400 font-mono text-[11px] font-bold transition-colors cursor-pointer border border-[#20273a] shrink-0"
              >
                {sym}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#151c2d] p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-neutral-600" />
              <p className="text-sm">
                {isId ? `Tidak ada saham ditemukan untuk "${query}"` : `No stocks found matching "${query}"`}
              </p>
              <p className="text-xs text-neutral-600">
                {isId ? 'Coba cari dengan kode ticker seperti BBCA, NVDA, atau AAPL' : 'Try searching ticker like AAPL, BBCA, or NVDA'}
              </p>
            </div>
          ) : (
            filteredItems.map((stock) => {
              const isPos = stock.change >= 0;
              const formattedPrice =
                stock.currency === 'USD'
                  ? formatCurrency(stock.price, 'USD')
                  : formatCurrency(stock.price, 'IDR');

              return (
                <div
                  key={stock.symbol}
                  className="p-2.5 rounded-xl hover:bg-[#141b2b] transition-colors flex items-center justify-between gap-3 group"
                >
                  {/* Stock Symbol & Info */}
                  <div
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    onClick={() => {
                      onSelectStock(stock.symbol);
                      onClose();
                    }}
                  >
                    <StockCompanyLogo symbol={stock.symbol} market={stock.market} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                          {stock.symbol}
                        </span>
                        <MarketLogo market={stock.market} size="xs" showLabel={true} />
                      </div>
                      <div className="text-xs text-neutral-400 truncate">
                        {stock.name} • <span className="text-neutral-500">{stock.sector}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Change */}
                  <div className="text-right shrink-0 font-mono-num">
                    <div className="text-sm font-bold text-white">{formattedPrice}</div>
                    <div
                      className={`text-xs font-semibold flex items-center justify-end gap-0.5 ${
                        isPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      <span>
                        {isPos ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Direct Action Buttons: "Pantau" & "Order" */}
                  <div className="flex items-center gap-1.5 shrink-0 pl-1">
                    <button
                      onClick={() => {
                        onSelectStock(stock.symbol);
                        onClose();
                      }}
                      title={isId ? 'Pantau di Superchart' : 'Monitor on Chart'}
                      className="px-2.5 py-1.5 rounded-lg bg-[#1a2336] hover:bg-[#25324d] text-cyan-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[#263450]"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isId ? 'Pantau' : 'Monitor'}</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenTrade(stock);
                        onClose();
                      }}
                      title={isId ? 'Order Saham Ini' : 'Trade This Stock'}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-emerald-500/30"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isId ? 'Order' : 'Trade'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Tips */}
        <div className="px-4 py-2.5 bg-[#0b0e17] border-t border-[#1a2133] flex items-center justify-between text-[11px] text-neutral-400">
          <span>
            {isId
              ? '💡 Klik "Pantau" untuk melihat candlestick lengkap di Superchart'
              : '💡 Click "Monitor" to load full candlestick data on Superchart'}
          </span>
          <span className="hidden sm:inline">
            <kbd className="px-1.5 py-0.5 rounded bg-[#1b2234] text-neutral-300 font-mono text-[10px] border border-[#27324c]">
              Ctrl + K
            </kbd>{' '}
            {isId ? 'untuk cari kapan saja' : 'to search anytime'}
          </span>
        </div>
      </div>
    </div>
  );
};
