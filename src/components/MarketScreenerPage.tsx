import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ArrowUpDown,
  TrendingUp,
  Flame,
  Star,
  Activity,
  BarChart3,
  Globe,
  Grid,
  List,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { StockQuote, MarketIndex, CurrencyType, Language } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { MarketLogo, StockCompanyLogo } from './MarketLogo';

interface MarketScreenerPageProps {
  stocks: StockQuote[];
  indices: MarketIndex[];
  onSelectStock: (symbol: string) => void;
  onOpenTrade: (stock: StockQuote) => void;
  selectedCurrency: CurrencyType;
  language?: Language;
  onNavigateToChart: () => void;
}

export const MarketScreenerPage: React.FC<MarketScreenerPageProps> = ({
  stocks,
  indices,
  onSelectStock,
  onOpenTrade,
  selectedCurrency,
  language = 'id',
  onNavigateToChart,
}) => {
  const isId = language === 'id';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarket, setSelectedMarket] = useState<'ALL' | 'IDX' | 'NASDAQ' | 'NYSE' | 'US' | 'COMPOSITE'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'GAINERS' | 'LOSERS' | 'ACTIVE' | 'MEGA_CAP'>('ALL');
  const [sortBy, setSortBy] = useState<'changePercent' | 'price' | 'volume' | 'symbol'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [favorites, setFavorites] = useState<string[]>(['BBCA.JK', 'NVDA', 'COMPOSITE']);

  const toggleFavorite = (symbol: string) => {
    setFavorites((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Filter and sort stocks
  const displayedStocks = useMemo(() => {
    let list = [...stocks];

    // Filter by Market
    if (selectedMarket === 'IDX') {
      list = list.filter((s) => s.market === 'IDX');
    } else if (selectedMarket === 'NASDAQ') {
      list = list.filter((s) => s.market === 'NASDAQ');
    } else if (selectedMarket === 'NYSE') {
      list = list.filter((s) => s.market === 'NYSE');
    } else if (selectedMarket === 'US') {
      list = list.filter((s) => s.market === 'NASDAQ' || s.market === 'NYSE');
    } else if (selectedMarket === 'COMPOSITE') {
      list = list.filter((s) => s.symbol === 'COMPOSITE');
    }

    // Filter by Category
    if (selectedCategory === 'GAINERS') {
      list = list.filter((s) => s.change > 0);
    } else if (selectedCategory === 'LOSERS') {
      list = list.filter((s) => s.change < 0);
    } else if (selectedCategory === 'ACTIVE') {
      list = list.filter((s) => s.volume > 30000000);
    } else if (selectedCategory === 'MEGA_CAP') {
      list = list.filter((s) => s.marketCap.includes('T') || s.marketCap.includes('1.'));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          (s.sector && s.sector.toLowerCase().includes(q))
      );
    }

    // Sort
    list.sort((a, b) => {
      let valA: any = a[sortBy];
      let valB: any = b[sortBy];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    return list;
  }, [stocks, selectedMarket, selectedCategory, searchQuery, sortBy, sortOrder]);

  const handleMonitorStock = (symbol: string) => {
    onSelectStock(symbol);
    onNavigateToChart();
  };

  return (
    <div className="w-full flex flex-col gap-5 p-2 sm:p-5 max-w-7xl mx-auto animate-in fade-in">
      {/* 1. Page Header with Title & Market Stats */}
      <div className="bg-gradient-to-r from-[#0d121c] via-[#101726] to-[#0e1422] border border-[#1e2638] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>{isId ? 'Pusat Analisis & Pemantauan Pasar' : 'Market Screener & Radar'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isId ? 'Cari Saham & Pantau Pasar Global' : 'Search Stocks & Monitor Global Markets'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            {isId
              ? 'Pantau pergerakan harga real-time emiten Bursa Efek Indonesia (IDX) dan Wall Street (NASDAQ/NYSE). Klik "Pantau Saham" untuk membuka chart candlestick lengkap.'
              : 'Monitor real-time prices of IDX (Indonesia) and Wall Street equities. Click "Monitor Stock" to open full candlestick superchart.'}
          </p>
        </div>

        {/* Quick Market Overview Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-2 rounded-xl bg-[#141b2b] border border-[#212c44] text-xs">
            <span className="text-neutral-400 block text-[10px]">{isId ? 'Total Emiten' : 'Total Stocks'}</span>
            <span className="text-white font-bold font-mono-num text-sm">{stocks.length} Saham</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#141b2b] border border-[#212c44] text-xs">
            <span className="text-neutral-400 block text-[10px]">{isId ? 'Bursa Terpantau' : 'Markets Tracked'}</span>
            <span className="text-emerald-400 font-bold font-mono-num text-sm">IDX • NASDAQ • NYSE</span>
          </div>
        </div>
      </div>

      {/* 2. Search Bar & Comprehensive Filters Bar */}
      <div className="bg-[#0b0e17] border border-[#1c2336] rounded-2xl p-4 shadow-lg space-y-3.5">
        {/* Top Search Input row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#2962ff] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isId
                  ? 'Cari nama saham atau kode ticker (mis: BBCA, NVDA, TSLA, BMRI)...'
                  : 'Search by symbol or name (e.g. BBCA, NVDA, TSLA, AAPL)...'
              }
              className="w-full bg-[#131825] hover:bg-[#181f30] focus:bg-[#181f30] border border-[#232d44] focus:border-[#2962ff] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
            <div className="flex items-center gap-1.5 bg-[#131825] border border-[#232d44] rounded-xl px-3 py-2 text-xs text-neutral-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-400 hidden sm:inline">{isId ? 'Urutkan:' : 'Sort:'}</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs"
              >
                <option value="changePercent" className="bg-[#131825]">
                  {isId ? '% Perubahan' : '% Change'}
                </option>
                <option value="price" className="bg-[#131825]">
                  {isId ? 'Harga' : 'Price'}
                </option>
                <option value="volume" className="bg-[#131825]">
                  {isId ? 'Volume' : 'Volume'}
                </option>
                <option value="symbol" className="bg-[#131825]">
                  {isId ? 'Simbol (A-Z)' : 'Symbol'}
                </option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-0.5 rounded text-neutral-400 hover:text-white"
                title={sortOrder === 'asc' ? 'Naik' : 'Turun'}
              >
                {sortOrder === 'asc' ? '▲' : '▼'}
              </button>
            </div>

            {/* Grid / Table Toggle */}
            <div className="flex items-center bg-[#131825] border border-[#232d44] rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#2962ff] text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Tampilan Kotak (Grid)"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#2962ff] text-white' : 'text-neutral-400 hover:text-white'
                }`}
                title="Tampilan Tabel (List)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs: Pasar & Kategori Cepat */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#182033]">
          {/* Market selector */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs py-1">
            <span className="text-neutral-400 text-[11px] mr-1 hidden md:inline">
              {isId ? 'Pasar:' : 'Market:'}
            </span>
            <button
              onClick={() => setSelectedMarket('ALL')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                selectedMarket === 'ALL'
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#141b2a] text-neutral-400 hover:text-white hover:bg-[#1a2336]'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isId ? 'Semua Pasar' : 'All Markets'}</span>
            </button>
            <button
              onClick={() => setSelectedMarket('IDX')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                selectedMarket === 'IDX'
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#141b2a] text-neutral-400 hover:text-white hover:bg-[#1a2336]'
              }`}
            >
              <MarketLogo market="IDX" size="xs" />
              <span>IHSG (IDX)</span>
            </button>
            <button
              onClick={() => setSelectedMarket('NASDAQ')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                selectedMarket === 'NASDAQ'
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#141b2a] text-neutral-400 hover:text-white hover:bg-[#1a2336]'
              }`}
            >
              <MarketLogo market="NASDAQ" size="xs" />
              <span>NASDAQ</span>
            </button>
            <button
              onClick={() => setSelectedMarket('NYSE')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                selectedMarket === 'NYSE'
                  ? 'bg-[#2962ff] text-white'
                  : 'bg-[#141b2a] text-neutral-400 hover:text-white hover:bg-[#1a2336]'
              }`}
            >
              <MarketLogo market="NYSE" size="xs" />
              <span>NYSE</span>
            </button>
          </div>

          {/* Quick Category Chips */}
          <div className="flex items-center gap-1 overflow-x-auto text-xs py-1">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-neutral-200 text-neutral-900 font-bold'
                  : 'bg-[#141b2a] text-neutral-400 hover:text-white'
              }`}
            >
              {isId ? 'Semua' : 'All'}
            </button>
            <button
              onClick={() => setSelectedCategory('GAINERS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'GAINERS'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-[#141b2a] text-emerald-400 hover:bg-emerald-950/30'
              }`}
            >
              <span>Top Gainers 🟢</span>
            </button>
            <button
              onClick={() => setSelectedCategory('LOSERS')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'LOSERS'
                  ? 'bg-rose-600 text-white font-bold'
                  : 'bg-[#141b2a] text-rose-400 hover:bg-rose-950/30'
              }`}
            >
              <span>Top Losers 🔴</span>
            </button>
            <button
              onClick={() => setSelectedCategory('ACTIVE')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'ACTIVE'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-[#141b2a] text-amber-400 hover:bg-amber-950/30'
              }`}
            >
              <span>Paling Aktif ⚡</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Stocks Presentation: Grid View or Table View */}
      {displayedStocks.length === 0 ? (
        <div className="bg-[#0b0e17] border border-[#1c2336] rounded-2xl p-12 text-center text-neutral-500 space-y-3">
          <Search className="w-10 h-10 mx-auto text-neutral-600" />
          <h3 className="text-base font-bold text-neutral-300">
            {isId ? 'Tidak ada saham yang sesuai dengan filter' : 'No stocks matching filter'}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {isId
              ? 'Silakan ubah kata kunci pencarian atau reset filter pasar Anda.'
              : 'Try modifying your search query or reset market filters.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMarket('ALL');
              setSelectedCategory('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-[#1e2638] hover:bg-[#27324c] text-neutral-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {isId ? 'Reset Semua Filter' : 'Reset Filters'}
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedStocks.map((stock) => {
            const isPos = stock.change >= 0;
            const isFav = favorites.includes(stock.symbol);
            const formattedPrice =
              stock.currency === 'USD'
                ? formatCurrency(stock.price, 'USD')
                : formatCurrency(stock.price, 'IDR');

            return (
              <div
                key={stock.symbol}
                className="bg-[#0c1018] hover:bg-[#111724] border border-[#1c2438] hover:border-[#2b3956] rounded-2xl p-4 shadow-lg flex flex-col justify-between transition-all duration-200 group relative"
              >
                {/* Card Top: Symbol, Badge, Star */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <StockCompanyLogo symbol={stock.symbol} market={stock.market} size="lg" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                            {stock.symbol}
                          </span>
                          <MarketLogo market={stock.market} size="xs" showLabel={true} />
                        </div>
                        <p className="text-xs text-neutral-400 truncate max-w-[170px]">
                          {stock.name}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(stock.symbol)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isFav
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-neutral-500 hover:text-neutral-300 hover:bg-[#161e30]'
                      }`}
                      title={isFav ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Sector */}
                  <div className="text-[11px] text-neutral-400 mb-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span>{stock.sector}</span>
                  </div>

                  {/* Price & Change Banner */}
                  <div className="bg-[#121826] border border-[#1e273c] rounded-xl p-3 flex items-center justify-between mb-3 font-mono-num">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-sans">
                        {isId ? 'Harga Terakhir' : 'Last Price'}
                      </span>
                      <span className="text-lg font-bold text-white tracking-tight">
                        {formattedPrice}
                      </span>
                    </div>

                    <div
                      className={`text-right ${
                        isPos ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      <div className="flex items-center justify-end gap-0.5 text-xs font-bold">
                        {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>
                          {isPos ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <span className="text-[10px] opacity-80">
                        {isPos ? '+' : ''}
                        {stock.change.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Sparkline & Details */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono-num text-neutral-400 mb-4 bg-[#0e1320] p-2.5 rounded-xl border border-[#192235]">
                    <div>
                      <span className="text-neutral-500 block text-[10px] font-sans">{isId ? 'Volume' : 'Volume'}</span>
                      <span className="text-neutral-200 font-semibold">{stock.volume.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] font-sans">{isId ? 'Kapitalisasi' : 'Market Cap'}</span>
                      <span className="text-neutral-200 font-semibold">{stock.marketCap}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] font-sans">P/E Ratio</span>
                      <span className="text-neutral-200 font-semibold">{stock.peRatio}x</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[10px] font-sans">{isId ? 'Tertinggi Hari' : 'Day High'}</span>
                      <span className="text-emerald-400 font-semibold">{stock.high.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions: Pantau Saham & Order Cepat */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1a2235]">
                  <button
                    onClick={() => handleMonitorStock(stock.symbol)}
                    className="w-full py-2 px-2.5 rounded-xl bg-[#182337] hover:bg-[#22314d] text-cyan-400 hover:text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-[#253554]"
                    title="Buka grafik candlestick emiten ini di Superchart"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isId ? 'Pantau Saham' : 'Monitor Stock'}</span>
                  </button>
                  <button
                    onClick={() => onOpenTrade(stock)}
                    className="w-full py-2 px-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-500/30"
                    title="Lakukan transaksi beli atau jual untuk emiten ini"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>{isId ? 'Order Cepat' : 'Trade'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="bg-[#0b0e17] border border-[#1b2336] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0e1422] border-b border-[#182133] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Emiten</th>
                  <th className="py-3 px-4 text-right">Harga Terakhir</th>
                  <th className="py-3 px-4 text-right">Perubahan 24h</th>
                  <th className="py-3 px-4 text-right">Rentang (High/Low)</th>
                  <th className="py-3 px-4 text-right">Volume</th>
                  <th className="py-3 px-4 text-right">Kapitalisasi</th>
                  <th className="py-3 px-4 text-center">Aksi Pantau</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141b2b] font-mono-num">
                {displayedStocks.map((stock) => {
                  const isPos = stock.change >= 0;
                  const formattedPrice =
                    stock.currency === 'USD'
                      ? formatCurrency(stock.price, 'USD')
                      : formatCurrency(stock.price, 'IDR');

                  return (
                    <tr
                      key={stock.symbol}
                      className="hover:bg-[#121927] transition-colors group cursor-pointer"
                    >
                      <td
                        className="py-3.5 px-4 whitespace-nowrap"
                        onClick={() => handleMonitorStock(stock.symbol)}
                      >
                        <div className="flex items-center gap-3">
                          <StockCompanyLogo symbol={stock.symbol} market={stock.market} size="md" />
                          <div>
                            <div className="font-bold text-white text-xs group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                              <span>{stock.symbol}</span>
                              <MarketLogo market={stock.market} size="xs" showLabel={true} />
                            </div>
                            <div className="text-[11px] text-neutral-400 font-sans truncate max-w-[170px]">
                              {stock.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-bold text-white">
                        {formattedPrice}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-0.5 font-bold ${
                            isPos ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>
                            {isPos ? '+' : ''}
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap text-neutral-400 text-[11px]">
                        <span className="text-emerald-400">{stock.high.toLocaleString()}</span> /{' '}
                        <span className="text-rose-400">{stock.low.toLocaleString()}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap text-neutral-300">
                        {stock.volume.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap text-neutral-300">
                        {stock.marketCap}
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMonitorStock(stock.symbol);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-[#182337] hover:bg-[#22314d] text-cyan-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-[#253554]"
                            title="Pantau di Superchart"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{isId ? 'Pantau' : 'Monitor'}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenTrade(stock);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-emerald-500/30"
                            title="Order Saham"
                          >
                            <ArrowUpDown className="w-3 h-3" />
                            <span>{isId ? 'Order' : 'Trade'}</span>
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
    </div>
  );
};
