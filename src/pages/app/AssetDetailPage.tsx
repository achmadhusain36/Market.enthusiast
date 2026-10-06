import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  ArrowLeft,
  ArrowUpDown,
  Bookmark,
  Bell,
  Clock,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { useMarketData } from '../../hooks/useMarketData';
import { useWatchlistStore } from '../../store/useWatchlistStore';
import { formatCurrency, formatPercent } from '../../utils/format';
import { MarketLogo, StockCompanyLogo } from '../../components/MarketLogo';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { showToast } from '../../components/ui/Toast';

export const AssetDetailPage: React.FC = () => {
  const { symbol = 'BTC/USD' } = useParams();
  const navigate = useNavigate();
  const { getAsset } = useMarketData();
  const { toggleWatchlist, isWatchlisted, addAlert } = useWatchlistStore();

  const asset = getAsset(symbol) || getAsset('BTC/USD')!;
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1H' | '1D' | '1W' | '1M' | '1Y'>('1D');
  const [activeTab, setActiveTab] = useState<'CHART' | 'ORDERBOOK' | 'INFO'>('CHART');

  const inWatch = isWatchlisted(asset.symbol);
  const isPos = asset.changePercent24h >= 0;

  // Realistic mock candlestick bars for the selected timeframe
  const candles = useMemo(() => {
    const base = asset.price;
    const count = 24;
    const list = [];
    let prevClose = base * 0.97;

    for (let i = 0; i < count; i++) {
      const open = prevClose;
      const swing = (Math.sin(i * 0.8) + (Math.random() - 0.48)) * 0.015;
      const close = Number((open * (1 + swing)).toFixed(2));
      const high = Number((Math.max(open, close) * 1.008).toFixed(2));
      const low = Number((Math.min(open, close) * 0.992).toFixed(2));
      prevClose = close;
      list.push({ time: `${i}:00`, open, high, low, close, isGreen: close >= open });
    }
    return list;
  }, [asset.price, selectedTimeframe]);

  // Mock Order Book L2 levels
  const orderBook = useMemo(() => {
    const p = asset.price;
    const tick = p >= 1000 ? 5 : 0.05;
    const asks = [];
    const bids = [];

    for (let i = 1; i <= 6; i++) {
      asks.unshift({
        price: Number((p + i * tick).toFixed(2)),
        amount: Number((1.2 + i * 0.45).toFixed(3)),
        total: Number(((p + i * tick) * (1.2 + i * 0.45)).toFixed(2)),
      });
      bids.push({
        price: Number((p - i * tick).toFixed(2)),
        amount: Number((1.5 + i * 0.5).toFixed(3)),
        total: Number(((p - i * tick) * (1.5 + i * 0.5)).toFixed(2)),
      });
    }
    return { asks, bids };
  }, [asset.price]);

  return (
    <div className="space-y-6 select-none font-sans">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/market')}
            className="p-2 rounded-xl bg-[#161616] hover:bg-[#222222] text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Kembali ke Screener"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <StockCompanyLogo symbol={asset.symbol} market={asset.market} size="md" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-mono text-white">
                {asset.symbol}
              </h1>
              <MarketLogo market={asset.market} size="xs" showLabel={true} />
            </div>
            <p className="text-xs text-neutral-400 font-sans">{asset.name}</p>
          </div>
        </div>

        {/* Price & CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 ml-auto sm:ml-0">
          <div className="text-right font-mono">
            <div className="text-xl sm:text-2xl font-black text-white">
              {formatCurrency(asset.price, asset.currency)}
            </div>
            <div
              className={`text-xs font-bold flex items-center justify-end gap-1 ${
                isPos ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              <span>{formatPercent(asset.changePercent24h)} (24H)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                toggleWatchlist(asset.symbol);
                showToast({
                  type: 'info',
                  title: inWatch ? 'Dihapus dari Watchlist' : 'Ditambahkan ke Watchlist',
                  message: `${asset.symbol} sekarang ${inWatch ? 'tidak lagi' : 'masuk'} dalam daftar pantauan.`,
                });
              }}
              className="p-2 rounded-xl bg-[#161616] hover:bg-[#222222] border border-[#2a2a2a] text-neutral-300 hover:text-amber-400 transition-colors cursor-pointer"
              title="Tambah / Hapus Watchlist"
            >
              <Bookmark className={`w-4 h-4 ${inWatch ? 'text-amber-400 fill-amber-400' : ''}`} />
            </button>

            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/trade?symbol=${encodeURIComponent(asset.symbol)}`)}
              leftIcon={<ArrowUpDown className="w-4 h-4" />}
            >
              Order Sekarang
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Main Workspace: Chart & Order Book Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Cols): Candlestick Chart & Timeframe */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-4 space-y-4">
            {/* Chart Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
                <span className="text-neutral-400">Timeframe:</span>
                {(['1H', '1D', '1W', '1M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      selectedTimeframe === tf
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span>High: {formatCurrency(asset.high24h, asset.currency)}</span>
                <span>•</span>
                <span>Low: {formatCurrency(asset.low24h, asset.currency)}</span>
              </div>
            </div>

            {/* Simulated Interactive Candlestick Canvas Area */}
            <div className="h-80 w-full flex items-end justify-between gap-1.5 bg-[#0a0a0a] p-3 rounded-2xl border border-[#1a1a1a] relative overflow-hidden">
              {/* Background Price Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
                <div className="border-b border-dashed border-neutral-600" />
                <div className="border-b border-dashed border-neutral-600" />
                <div className="border-b border-dashed border-neutral-600" />
              </div>

              {/* Candles */}
              {candles.map((c, i) => {
                const max = Math.max(...candles.map((x) => x.high));
                const min = Math.min(...candles.map((x) => x.low));
                const range = max - min || 1;

                const topPercent = Math.max(5, ((c.high - min) / range) * 100);
                const bottomPercent = Math.max(5, ((c.low - min) / range) * 100);
                const bodyTop = Math.max(c.open, c.close);
                const bodyBottom = Math.min(c.open, c.close);
                const bodyHeight = Math.max(4, ((bodyTop - bodyBottom) / range) * 100);
                const bodyY = ((bodyBottom - min) / range) * 100;

                return (
                  <div key={i} className="flex-1 flex flex-col items-center h-full relative group">
                    {/* Candle Wick */}
                    <div
                      className={`w-[1px] absolute ${c.isGreen ? 'bg-emerald-400' : 'bg-red-400'}`}
                      style={{
                        bottom: `${bottomPercent}%`,
                        height: `${Math.max(4, topPercent - bottomPercent)}%`,
                      }}
                    />

                    {/* Candle Body */}
                    <div
                      className={`w-full max-w-[12px] rounded-xs absolute ${
                        c.isGreen ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{
                        bottom: `${bodyY}%`,
                        height: `${bodyHeight}%`,
                      }}
                    />

                    {/* Tooltip on hover */}
                    <div className="hidden group-hover:block absolute -top-8 bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded text-[10px] font-mono text-white whitespace-nowrap z-20 shadow">
                      {formatCurrency(c.close, asset.currency)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-1">
              <span>00:00 WIB</span>
              <span>12:00 WIB</span>
              <span>23:59 WIB (LIVE)</span>
            </div>
          </Card>

          {/* Asset Description & Key Metrics */}
          <Card className="space-y-4">
            <h3 className="text-sm font-bold font-mono text-white">Ikhtisar & Fundamental Proyek</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {asset.description || 'Instrumen keuangan terdaftar resmi dengan likuiditas tinggi di pasar modal.'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
              <div className="p-3 rounded-xl bg-[#161616] border border-[#222222]">
                <div className="text-[10px] text-neutral-400">MARKET CAP</div>
                <div className="text-xs font-bold text-white mt-1">
                  {asset.marketCap ? formatCurrency(asset.marketCap, 'USD', true) : 'N/A'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#161616] border border-[#222222]">
                <div className="text-[10px] text-neutral-400">VOLUME 24H</div>
                <div className="text-xs font-bold text-white mt-1">
                  {formatCurrency(asset.volume24h, 'USD', true)}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#161616] border border-[#222222]">
                <div className="text-[10px] text-neutral-400">PASOKAN BEREDAR</div>
                <div className="text-xs font-bold text-white mt-1">
                  {asset.supply || 'N/A'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#161616] border border-[#222222]">
                <div className="text-[10px] text-neutral-400">STATUS REGULASI</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">TERVERIFIKASI</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (4 Cols): Order Book L2 */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
                  Order Book Level 2
                </h3>
              </div>
              <span className="text-[10px] text-neutral-500 font-mono">BIDS & ASKS</span>
            </div>

            {/* Asks (Sell Orders - Red) */}
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center justify-between text-[10px] text-neutral-500 pb-1">
                <span>Harga</span>
                <span>Ukuran</span>
                <span>Total</span>
              </div>
              {orderBook.asks.map((ask, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/trade?symbol=${encodeURIComponent(asset.symbol)}&price=${ask.price}`)}
                  className="flex items-center justify-between p-1 rounded hover:bg-red-500/10 cursor-pointer text-neutral-300"
                >
                  <span className="text-red-400 font-bold">{formatCurrency(ask.price, asset.currency)}</span>
                  <span>{ask.amount}</span>
                  <span className="text-neutral-500">{formatCurrency(ask.total, asset.currency, true)}</span>
                </div>
              ))}
            </div>

            {/* Current Price Marker */}
            <div className="py-2.5 px-3 rounded-xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-between font-mono">
              <span className="text-xs text-neutral-400">Harga Terakhir</span>
              <span className="text-sm font-black text-emerald-400">
                {formatCurrency(asset.price, asset.currency)}
              </span>
            </div>

            {/* Bids (Buy Orders - Green) */}
            <div className="space-y-1 font-mono text-xs">
              {orderBook.bids.map((bid, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/trade?symbol=${encodeURIComponent(asset.symbol)}&price=${bid.price}`)}
                  className="flex items-center justify-between p-1 rounded hover:bg-emerald-500/10 cursor-pointer text-neutral-300"
                >
                  <span className="text-emerald-400 font-bold">{formatCurrency(bid.price, asset.currency)}</span>
                  <span>{bid.amount}</span>
                  <span className="text-neutral-500">{formatCurrency(bid.total, asset.currency, true)}</span>
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full mt-2"
              onClick={() => navigate(`/trade?symbol=${encodeURIComponent(asset.symbol)}`)}
            >
              Eksekusi Order ({asset.symbol})
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
