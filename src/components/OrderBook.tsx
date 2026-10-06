import React, { useState, useMemo } from 'react';
import {
  Layers,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  BarChart2,
  SlidersHorizontal,
} from 'lucide-react';
import { StockQuote, Language } from '../types';
import { formatCurrency } from '../utils/formatters';

interface OrderBookProps {
  stock: StockQuote;
  language?: Language;
  onSelectPrice?: (price: number) => void;
  onQuickTrade?: (stock: StockQuote, type: 'BUY' | 'SELL', price?: number) => void;
}

export const OrderBook: React.FC<OrderBookProps> = ({
  stock,
  language = 'id',
  onSelectPrice,
  onQuickTrade,
}) => {
  const isId = language === 'id';
  const [viewMode, setViewMode] = useState<'BOTH' | 'BIDS' | 'ASKS'>('BOTH');
  const [depthPrecision, setDepthPrecision] = useState<number>(1);

  // Generate realistic L2 order book levels centered on stock price
  const { asks, bids, spread, spreadPercent, maxTotal } = useMemo(() => {
    const isIDR = stock.currency === 'IDR';
    const tickSize = isIDR ? (stock.price > 5000 ? 25 : stock.price > 2000 ? 10 : 5) : 0.05;
    const count = viewMode === 'BOTH' ? 7 : 12;

    const askList = [];
    const bidList = [];

    let cumAsk = 0;
    for (let i = 1; i <= count; i++) {
      const p = stock.price + i * tickSize * depthPrecision;
      const vol = Math.floor(1000 + Math.sin(i * 1.5 + stock.price) * 500 + (count - i) * 300);
      cumAsk += vol;
      askList.unshift({
        price: p,
        amount: vol,
        total: cumAsk,
      });
    }

    let cumBid = 0;
    for (let i = 1; i <= count; i++) {
      const p = Math.max(0, stock.price - i * tickSize * depthPrecision);
      const vol = Math.floor(1200 + Math.cos(i * 1.8 + stock.price) * 600 + (count - i) * 350);
      cumBid += vol;
      bidList.push({
        price: p,
        amount: vol,
        total: cumBid,
      });
    }

    const maxTot = Math.max(cumAsk, cumBid, 1);
    const sp = askList[askList.length - 1]?.price - bidList[0]?.price || tickSize;
    const spPct = (sp / stock.price) * 100;

    return {
      asks: askList.map((a) => ({ ...a, depthPercent: Math.min(100, (a.total / maxTot) * 100) })),
      bids: bidList.map((b) => ({ ...b, depthPercent: Math.min(100, (b.total / maxTot) * 100) })),
      spread: Math.max(0, sp),
      spreadPercent: Math.max(0, spPct),
      maxTotal: maxTot,
    };
  }, [stock.price, stock.currency, viewMode, depthPrecision]);

  const handlePriceClick = (price: number) => {
    onSelectPrice?.(price);
  };

  return (
    <div className="liquid-glass-card bg-[#070b12]/85 border border-white/10 rounded-2xl flex flex-col overflow-hidden shadow-2xl select-none text-xs font-mono backdrop-blur-xl transition-all duration-300">
      {/* 1. Header Bar */}
      <div className="p-3 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white text-xs font-sans">
            {isId ? 'Order Book L2' : 'Level 2 Order Book'}
          </span>
          <span className="text-[10px] text-neutral-400 px-1.5 py-0.2 rounded bg-[#162030] font-sans">
            {stock.symbol}
          </span>
        </div>

        {/* View Mode Filters */}
        <div className="flex items-center gap-1 bg-[#121927] p-0.5 rounded-lg border border-[#202c44]">
          <button
            onClick={() => setViewMode('BOTH')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
              viewMode === 'BOTH' ? 'bg-[#2962ff] text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Tampilkan Bids & Asks"
          >
            All
          </button>
          <button
            onClick={() => setViewMode('BIDS')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
              viewMode === 'BIDS' ? 'bg-emerald-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Hanya Beli (Bids)"
          >
            Bids
          </button>
          <button
            onClick={() => setViewMode('ASKS')}
            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
              viewMode === 'ASKS' ? 'bg-rose-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Hanya Jual (Asks)"
          >
            Asks
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] text-neutral-400 uppercase tracking-wider font-semibold border-b border-[#141b2a] bg-[#090d16]">
        <span>{isId ? 'Harga' : 'Price'} ({stock.currency})</span>
        <span className="text-right">{isId ? 'Ukuran' : 'Size'}</span>
        <span className="text-right">{isId ? 'Akumulasi' : 'Total'}</span>
      </div>

      {/* 2. Order Book Body */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#101624] text-[11px]">
        {/* ASKS (RED - Sell Orders) */}
        {(viewMode === 'BOTH' || viewMode === 'ASKS') && (
          <div className="flex flex-col">
            {asks.map((ask, i) => (
              <div
                key={`ask-${i}`}
                onClick={() => handlePriceClick(ask.price)}
                className="relative grid grid-cols-3 px-3 py-1 hover:bg-rose-500/10 cursor-pointer transition-colors group"
              >
                {/* Horizontal Depth Volume Fill Bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-rose-500/15 pointer-events-none"
                  style={{ width: `${ask.depthPercent}%` }}
                />

                <span className="font-bold text-[#f23645] relative z-10">
                  {stock.currency === 'IDR' ? ask.price.toLocaleString() : ask.price.toFixed(2)}
                </span>
                <span className="text-right text-neutral-300 relative z-10">
                  {ask.amount.toLocaleString()}
                </span>
                <span className="text-right text-neutral-500 relative z-10">
                  {ask.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* MID-PRICE & SPREAD STRIP */}
        <div className="px-3 py-2 bg-[#0c121e] border-y border-[#182337] flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-extrabold">
              {formatCurrency(stock.price, stock.currency)}
            </span>
            <span
              className={`text-[10px] flex items-center gap-0.5 ${
                stock.change >= 0 ? 'text-[#22ab94]' : 'text-[#f23645]'
              }`}
            >
              {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
            </span>
          </div>

          <div className="text-[10px] text-neutral-400 font-sans flex items-center gap-1">
            <span>Spread:</span>
            <span className="text-neutral-200 font-mono">
              {stock.currency === 'IDR' ? spread.toLocaleString() : spread.toFixed(2)} ({spreadPercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* BIDS (GREEN - Buy Orders) */}
        {(viewMode === 'BOTH' || viewMode === 'BIDS') && (
          <div className="flex flex-col">
            {bids.map((bid, i) => (
              <div
                key={`bid-${i}`}
                onClick={() => handlePriceClick(bid.price)}
                className="relative grid grid-cols-3 px-3 py-1 hover:bg-emerald-500/10 cursor-pointer transition-colors group"
              >
                {/* Horizontal Depth Volume Fill Bar */}
                <div
                  className="absolute inset-y-0 right-0 bg-emerald-500/15 pointer-events-none"
                  style={{ width: `${bid.depthPercent}%` }}
                />

                <span className="font-bold text-[#22ab94] relative z-10">
                  {stock.currency === 'IDR' ? bid.price.toLocaleString() : bid.price.toFixed(2)}
                </span>
                <span className="text-right text-neutral-300 relative z-10">
                  {bid.amount.toLocaleString()}
                </span>
                <span className="text-right text-neutral-500 relative z-10">
                  {bid.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Quick Action Footer */}
      {onQuickTrade && (
        <div className="p-2.5 bg-[#090d16] border-t border-[#182133] grid grid-cols-2 gap-2">
          <button
            onClick={() => onQuickTrade(stock, 'BUY')}
            className="py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition-colors cursor-pointer"
          >
            <span>{isId ? 'Buy' : 'Buy'}</span>
            <span className="opacity-75 text-[10px]">@{formatCurrency(stock.price, stock.currency)}</span>
          </button>
          <button
            onClick={() => onQuickTrade(stock, 'SELL')}
            className="py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition-colors cursor-pointer"
          >
            <span>{isId ? 'Sell' : 'Sell'}</span>
            <span className="opacity-75 text-[10px]">@{formatCurrency(stock.price, stock.currency)}</span>
          </button>
        </div>
      )}
    </div>
  );
};
