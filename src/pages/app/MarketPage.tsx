import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  ArrowUpDown,
  TrendingUp,
  LayoutGrid,
  List,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  ArrowUpRight,
  ArrowDownRight,
  Check,
} from 'lucide-react';
import { useMarketData } from '../../hooks/useMarketData';
import { useWatchlistStore } from '../../store/useWatchlistStore';
import { Asset } from '../../data/mockAssets';
import { formatCurrency, formatPercent } from '../../utils/format';
import { MarketLogo } from '../../components/MarketLogo';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const MarketPage: React.FC = () => {
  const { assets, isLoading } = useMarketData();
  const { toggleWatchlist, isWatchlisted } = useWatchlistStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Crypto' | 'Saham' | 'Forex' | 'Komoditas'>('ALL');
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARD'>('TABLE');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume'>('volume');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter & Sort Assets
  const filteredAssets = useMemo(() => {
    return assets
      .filter((asset) => {
        const matchesCategory =
          selectedCategory === 'ALL' || asset.category === selectedCategory;
        const matchesQuery =
          !searchQuery ||
          asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => {
        let valA: any = a.symbol;
        let valB: any = b.symbol;

        if (sortBy === 'price') {
          valA = a.price;
          valB = b.price;
        } else if (sortBy === 'change') {
          valA = a.changePercent24h;
          valB = b.changePercent24h;
        } else if (sortBy === 'volume') {
          valA = a.volume24h;
          valB = b.volume24h;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [assets, selectedCategory, searchQuery, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage) || 1;
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: 'symbol' | 'price' | 'change' | 'volume') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-5 select-none font-sans">
      {/* 1. Header & View Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 className="text-xl sm:text-2xl font-black font-mono text-white">
            Screener Pasar Multi-Aset
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Pantau pergerakan harga real-time Kripto, Saham IDX & Wall St, Valas, dan Komoditas.
          </p>
        </div>

        {/* View Mode Toggle: Table vs Card */}
        <div className="flex items-center gap-1 p-1 bg-[#161616] border border-[#262626] rounded-xl text-xs">
          <button
            onClick={() => setViewMode('TABLE')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'TABLE' ? 'bg-[#242424] text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Tabel</span>
          </button>
          <button
            onClick={() => setViewMode('CARD')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewMode === 'CARD' ? 'bg-[#242424] text-white font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Kartu</span>
          </button>
        </div>
      </div>

      {/* 2. Controls: Search Bar & Category Filters */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono">
          {(['ALL', 'Crypto', 'Saham', 'Forex', 'Komoditas'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer font-bold ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                  : 'bg-[#141414] text-neutral-400 hover:text-white border border-[#222222]'
              }`}
            >
              {cat === 'ALL' ? 'Semua Pasar' : cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama atau simbol aset..."
            className="w-full bg-[#141414] border border-[#262626] focus:border-emerald-500 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 outline-none"
          />
        </div>
      </div>

      {/* 3. Assets Display: Table or Card View */}
      {viewMode === 'TABLE' ? (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-[#161616] border-b border-[#262626] text-neutral-400 font-mono text-[11px] uppercase tracking-wider select-none">
                <tr>
                  <th className="py-3 px-4">Watchlist</th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('symbol')}
                  >
                    Simbol / Nama
                  </th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-white"
                    onClick={() => handleSort('price')}
                  >
                    Harga Terkini
                  </th>
                  <th
                    className="py-3 px-4 text-right cursor-pointer hover:text-white"
                    onClick={() => handleSort('change')}
                  >
                    24H Change
                  </th>
                  <th className="py-3 px-4 text-right hidden sm:table-cell">24H High / Low</th>
                  <th
                    className="py-3 px-4 text-right hidden md:table-cell cursor-pointer hover:text-white"
                    onClick={() => handleSort('volume')}
                  >
                    Volume 24H
                  </th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f1f1f]">
                {paginatedAssets.map((asset) => {
                  const isPos = asset.changePercent24h >= 0;
                  const inWatch = isWatchlisted(asset.symbol);

                  return (
                    <tr
                      key={asset.id}
                      className="hover:bg-[#181818] cursor-pointer transition-colors"
                      onClick={() => navigate(`/market/${encodeURIComponent(asset.symbol)}`)}
                    >
                      {/* Watchlist Star */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggleWatchlist(asset.symbol)}
                          className="p-1 rounded text-neutral-400 hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              inWatch ? 'text-amber-400 fill-amber-400' : 'text-neutral-500'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Symbol & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <MarketLogo market={asset.market} size="xs" />
                          <div>
                            <div className="font-bold font-mono text-white text-xs">
                              {asset.symbol}
                            </div>
                            <div className="text-[11px] text-neutral-400 truncate max-w-[140px]">
                              {asset.name}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-xs">
                        {formatCurrency(asset.price, asset.currency)}
                      </td>

                      {/* Change 24H */}
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-bold text-xs ${
                          isPos ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {formatPercent(asset.changePercent24h)}
                      </td>

                      {/* High / Low */}
                      <td className="py-3.5 px-4 text-right font-mono text-neutral-400 hidden sm:table-cell">
                        <div>H: {formatCurrency(asset.high24h, asset.currency)}</div>
                        <div className="text-[10px] text-neutral-500">
                          L: {formatCurrency(asset.low24h, asset.currency)}
                        </div>
                      </td>

                      {/* Volume */}
                      <td className="py-3.5 px-4 text-right font-mono text-neutral-300 hidden md:table-cell">
                        {formatCurrency(asset.volume24h, 'USD', true)}
                      </td>

                      {/* Quick Trade CTA */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/trade?symbol=${encodeURIComponent(asset.symbol)}`)}
                        >
                          Trade
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paginatedAssets.map((asset) => {
            const isPos = asset.changePercent24h >= 0;
            return (
              <Card
                key={asset.id}
                hoverEffect
                onClick={() => navigate(`/market/${encodeURIComponent(asset.symbol)}`)}
                className="cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MarketLogo market={asset.market} size="xs" />
                    <div>
                      <div className="font-bold font-mono text-white text-xs">{asset.symbol}</div>
                      <div className="text-[10px] text-neutral-400 truncate max-w-[120px]">
                        {asset.name}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWatchlist(asset.symbol);
                    }}
                    className="p-1 text-neutral-500 hover:text-amber-400"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isWatchlisted(asset.symbol) ? 'text-amber-400 fill-amber-400' : ''
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <div className="text-lg font-black font-mono text-white">
                    {formatCurrency(asset.price, asset.currency)}
                  </div>
                  <div
                    className={`text-xs font-mono font-bold flex items-center gap-1 ${
                      isPos ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    <span>{formatPercent(asset.changePercent24h)}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#222222] flex items-center justify-between text-[11px] font-mono text-neutral-400">
                  <span>Vol: {formatCurrency(asset.volume24h, 'USD', true)}</span>
                  <span className="text-emerald-400 font-bold hover:underline">Detail Chart →</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 4. Pagination Bar */}
      <div className="flex items-center justify-between pt-2 text-xs font-mono text-neutral-400">
        <div>
          Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, filteredAssets.length)} dari {filteredAssets.length} aset
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
          >
            Sebelumnya
          </Button>

          <span className="px-3 py-1 rounded-lg bg-[#141414] border border-[#222222] text-white">
            {currentPage} / {totalPages}
          </span>

          <Button
            size="sm"
            variant="secondary"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
};
