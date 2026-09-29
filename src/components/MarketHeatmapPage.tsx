import React, { useState } from 'react';
import {
  Grid,
  Filter,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  Sparkles,
  Search,
} from 'lucide-react';
import { StockQuote, Language, CurrencyType } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface MarketHeatmapPageProps {
  stocks: StockQuote[];
  onSelectStock: (symbol: string) => void;
  onNavigateToChart: () => void;
  language: Language;
  selectedCurrency: CurrencyType;
}

interface SectorGroup {
  sector: string;
  stocks: StockQuote[];
  avgChange: number;
}

export const MarketHeatmapPage: React.FC<MarketHeatmapPageProps> = ({
  stocks,
  onSelectStock,
  onNavigateToChart,
  language = 'en',
  selectedCurrency,
}) => {
  const isId = language === 'id';
  const [selectedMarket, setSelectedMarket] = useState<'ALL' | 'IDX' | 'NASDAQ' | 'NYSE'>('ALL');
  const [search, setSearch] = useState('');

  // Filter stocks
  const filtered = stocks.filter((s) => {
    if (selectedMarket !== 'ALL' && s.market !== selectedMarket) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Group by sector
  const sectorGroups: SectorGroup[] = React.useMemo(() => {
    const map = new Map<string, StockQuote[]>();
    filtered.forEach((stk) => {
      const sector = stk.sector || 'General Equities';
      const arr = map.get(sector) || [];
      arr.push(stk);
      map.set(sector, arr);
    });

    return Array.from(map.entries()).map(([sector, groupStocks]) => {
      const avg =
        groupStocks.reduce((acc, curr) => acc + curr.changePercent, 0) / groupStocks.length;
      return {
        sector,
        stocks: groupStocks.sort((a, b) => b.volume - a.volume),
        avgChange: avg,
      };
    });
  }, [filtered]);

  // Color generator based on changePercent
  const getHeatmapColor = (changePercent: number) => {
    if (changePercent >= 3.0) return 'bg-[#00c853] text-black border-[#00e676]';
    if (changePercent >= 1.5) return 'bg-[#009e47] text-white border-[#00b050]';
    if (changePercent > 0.2) return 'bg-[#0d6938] text-white border-[#138045]';
    if (changePercent >= -0.2 && changePercent <= 0.2)
      return 'bg-[#2a2e39] text-neutral-300 border-[#3b4150]';
    if (changePercent >= -1.5) return 'bg-[#7a1c22] text-white border-[#94222a]';
    if (changePercent >= -3.0) return 'bg-[#b71c1c] text-white border-[#d32f2f]';
    return 'bg-[#d50000] text-white border-[#ff1744]';
  };

  const handleTileClick = (symbol: string) => {
    onSelectStock(symbol);
    onNavigateToChart();
  };

  return (
    <div className="flex-1 w-full flex flex-col p-3 sm:p-5 gap-4 bg-[#000000] overflow-y-auto">
      {/* Top Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0c0f17] border border-[#1b2230] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/40">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>{isId ? 'Peta Pasar Saham (Market Heatmap)' : 'Global Market Heatmap'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                LIVE TICKS
              </span>
            </h1>
            <p className="text-xs text-neutral-400">
              {isId
                ? 'Visualisasi performa per sektor: Ukuran blok = Volume / Bobot, Warna = Perubahan %'
                : 'Performance treemap: Tile size = Volume / Weight, Color = % Price Change'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isId ? 'Cari di heatmap...' : 'Search in heatmap...'}
              className="w-full bg-[#161c28] border border-[#232d40] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#2962ff]"
            />
          </div>

          <div className="flex items-center bg-[#161c28] rounded-xl p-0.5 border border-[#232d40] font-semibold">
            {(['ALL', 'IDX', 'NASDAQ', 'NYSE'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMarket(m)}
                className={`px-3 py-1 rounded-lg text-[11px] transition-colors cursor-pointer ${
                  selectedMarket === m
                    ? 'bg-[#2962ff] text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Legend Bar */}
      <div className="flex items-center justify-between text-xs px-2 text-neutral-400">
        <span className="text-[11px]">{isId ? 'Skala Performa:' : 'Performance Color Scale:'}</span>
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <span className="px-1.5 py-0.5 rounded bg-[#d50000] text-white">&lt; -3%</span>
          <span className="px-1.5 py-0.5 rounded bg-[#b71c1c] text-white">-2%</span>
          <span className="px-1.5 py-0.5 rounded bg-[#7a1c22] text-white">-1%</span>
          <span className="px-1.5 py-0.5 rounded bg-[#2a2e39] text-neutral-300">0%</span>
          <span className="px-1.5 py-0.5 rounded bg-[#0d6938] text-white">+1%</span>
          <span className="px-1.5 py-0.5 rounded bg-[#009e47] text-white">+2%</span>
          <span className="px-1.5 py-0.5 rounded bg-[#00c853] text-black font-bold">&gt; +3%</span>
        </div>
      </div>

      {/* Heatmap Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {sectorGroups.map((group) => {
          const isSectorPositive = group.avgChange >= 0;
          return (
            <div
              key={group.sector}
              className="bg-[#0b0e14] border border-[#1a202c] rounded-2xl p-3.5 flex flex-col shadow-lg"
            >
              {/* Sector Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#181d28]">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white tracking-wide truncate max-w-[220px]">
                    {group.sector}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    ({group.stocks.length} {isId ? 'Saham' : 'Tickers'})
                  </span>
                </div>
                <div
                  className={`text-xs font-mono font-bold flex items-center gap-1 ${
                    isSectorPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isSectorPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  <span>{formatPercent(group.avgChange)}</span>
                </div>
              </div>

              {/* Sector Tiles Treemap Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1 auto-rows-fr">
                {group.stocks.map((stk) => {
                  const colorClass = getHeatmapColor(stk.changePercent);
                  return (
                    <button
                      key={stk.symbol}
                      onClick={() => handleTileClick(stk.symbol)}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between transition-all transform hover:scale-[1.03] active:scale-95 text-left cursor-pointer shadow-sm relative group overflow-hidden ${colorClass}`}
                      title={`${stk.name} (${stk.symbol}) - Click to open Superchart`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-black text-xs sm:text-sm tracking-tight">
                          {stk.symbol}
                        </span>
                        <span className="text-[9px] opacity-75 font-mono">
                          {stk.market}
                        </span>
                      </div>

                      <div className="mt-2 font-mono">
                        <div className="text-[11px] font-bold">
                          {stk.currency === 'IDR' ? 'Rp ' : '$'}
                          {stk.price.toLocaleString()}
                        </div>
                        <div className="text-xs font-extrabold">
                          {formatPercent(stk.changePercent)}
                        </div>
                      </div>

                      {/* Tooltip Hover Overlay */}
                      <div className="absolute inset-0 bg-black/90 p-2 flex flex-col justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[10px]">
                        <div>
                          <div className="font-bold truncate">{stk.name}</div>
                          <div className="text-neutral-400 mt-0.5">Cap: {stk.marketCap}</div>
                        </div>
                        <div className="text-cyan-400 font-bold">
                          {isId ? 'Klik untuk Superchart ↗' : 'Click for Superchart ↗'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
