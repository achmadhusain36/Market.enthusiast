import React, { useState } from 'react';
import { X, ArrowUpDown, AlertCircle, CheckCircle2, ShieldAlert, DollarSign, Wallet } from 'lucide-react';
import { StockQuote, UserProfile, PortfolioHolding } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { TRANSLATIONS } from '../utils/translations';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockQuote;
  initialType: 'BUY' | 'SELL';
  userProfile: UserProfile;
  holdings: PortfolioHolding[];
  onExecuteTrade: (trade: {
    type: 'BUY' | 'SELL';
    stock: StockQuote;
    shares: number;
    price: number;
    fee: number;
    total: number;
  }) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  stock,
  initialType,
  userProfile,
  holdings,
  onExecuteTrade,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[userProfile.language || 'id'];
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>(initialType);
  const [shares, setShares] = useState<number>(stock.currency === 'IDR' ? 500 : 10);
  const [executionSuccess, setExecutionSuccess] = useState(false);

  // Check how many shares user currently owns
  const ownedHolding = holdings.find((h) => h.symbol === stock.symbol);
  const ownedShares = ownedHolding ? ownedHolding.shares : 0;

  // Available user cash in this stock's currency
  const availableCash =
    stock.currency === 'USD' ? userProfile.cashBalanceUSD : userProfile.cashBalanceIDR;

  // Real-time calculations
  const price = stock.price;
  const subtotal = shares * price;
  const feeRate = 0.0015; // 0.15% fee
  const fee = subtotal * feeRate;
  const totalCost = tradeType === 'BUY' ? subtotal + fee : subtotal - fee;

  // Validation
  const canAfford = tradeType === 'SELL' || availableCash >= totalCost;
  const hasEnoughShares = tradeType === 'BUY' || ownedShares >= shares;
  const isValidAmount = shares > 0;
  const canExecute = canAfford && hasEnoughShares && isValidAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canExecute) return;

    onExecuteTrade({
      type: tradeType,
      stock,
      shares,
      price,
      fee,
      total: totalCost,
    });

    setExecutionSuccess(true);
    setTimeout(() => {
      setExecutionSuccess(false);
      onClose();
    }, 1200);
  };

  const isIDX = stock.market === 'IDX';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0b0f19] border border-[#1e283d] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#182133] flex items-center justify-between bg-[#0e1422]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#162033] border border-[#273450] flex items-center justify-center font-bold text-white text-xs">
              {stock.symbol.split('.')[0]}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{t.tradeModalTitle} {stock.symbol}</span>
              </h3>
              <p className="text-xs text-neutral-400">
                {userProfile.language === 'id' ? 'Sinkronisasi pasar global real-time' : 'Real-time global market sync'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-[#182235] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Buy / Sell Toggle tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#07090f] p-1 rounded-xl border border-[#182133]">
            <button
              type="button"
              onClick={() => setTradeType('BUY')}
              className={`py-2 rounded-lg font-bold text-xs tracking-wider transition-all cursor-pointer ${
                tradeType === 'BUY'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.tradeBuy}
            </button>
            <button
              type="button"
              onClick={() => setTradeType('SELL')}
              className={`py-2 rounded-lg font-bold text-xs tracking-wider transition-all cursor-pointer ${
                tradeType === 'SELL'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.tradeSell}
            </button>
          </div>

          {/* Current Live Stock Price */}
          <div className="bg-[#0e1422] border border-[#1b253b] rounded-xl p-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-neutral-400">{t.marketPriceLive}:</span>
              <div className="text-lg font-bold font-mono-num text-white">
                {formatCurrency(price, stock.currency)}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-neutral-400">{t.change24h}:</span>
              <div className={`text-xs font-bold font-mono-num ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stock.change >= 0 ? '+' : ''}{formatPercent(stock.changePercent)}
              </div>
            </div>
          </div>

          {/* User Available Funds / Ownership */}
          <div className="flex items-center justify-between text-xs px-1 text-neutral-400">
            <span className="flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              {t.availableCash}:
            </span>
            <span className="font-mono-num font-bold text-white">
              {formatCurrency(availableCash, stock.currency)}
            </span>
          </div>

          {tradeType === 'SELL' && (
            <div className="flex items-center justify-between text-xs px-1 text-neutral-400">
              <span>{t.ownedUnits}:</span>
              <span className="font-mono-num font-bold text-amber-400">
                {ownedShares.toLocaleString()} {isIDX ? 'Lembar' : 'Shares'}
                {isIDX ? ` (${(ownedShares / 100).toFixed(0)} Lot)` : ''}
              </span>
            </div>
          )}

          {/* Shares / Quantity input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300">
              {t.orderQuantity} ({isIDX ? 'Lembar Saham' : 'Shares'})
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step={isIDX ? '100' : '1'}
                value={shares}
                onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-[#07090f] border border-[#1b253b] focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm font-mono-num text-white font-bold focus:outline-none transition-colors"
              />
              {isIDX && (
                <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-mono-num">
                  = {(shares / 100).toFixed(1)} Lot
                </span>
              )}
            </div>

            {/* Quick Share presets */}
            <div className="flex items-center gap-2 pt-1">
              {(isIDX ? [100, 500, 1000, 5000] : [5, 10, 25, 50, 100]).map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setShares(num)}
                  className="px-2 py-0.5 rounded bg-[#131b2c] hover:bg-[#1c273e] text-[11px] font-mono-num text-neutral-300 border border-[#212c44] transition-colors cursor-pointer"
                >
                  +{num}
                </button>
              ))}
              {tradeType === 'SELL' && ownedShares > 0 && (
                <button
                  type="button"
                  onClick={() => setShares(ownedShares)}
                  className="ml-auto px-2 py-0.5 rounded bg-amber-950/40 hover:bg-amber-900/60 text-[11px] font-bold text-amber-400 border border-amber-800/40 transition-colors cursor-pointer"
                >
                  {t.maxShares}
                </button>
              )}
            </div>
          </div>

          {/* Cost breakdown */}
          <div className="bg-[#0e1422] rounded-xl p-3 space-y-1.5 text-xs border border-[#182133] font-mono-num">
            <div className="flex justify-between text-neutral-400">
              <span>{t.subtotal}:</span>
              <span className="text-neutral-200">{formatCurrency(subtotal, stock.currency)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>{t.brokerFee}:</span>
              <span className="text-neutral-200">{formatCurrency(fee, stock.currency)}</span>
            </div>
            <div className="border-t border-[#1e283d] pt-1.5 flex justify-between font-bold text-sm">
              <span className="text-white font-sans">{t.totalCost}:</span>
              <span className={tradeType === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>
                {formatCurrency(totalCost, stock.currency)}
              </span>
            </div>
          </div>

          {/* Warning notice if not enough cash/shares */}
          {!canAfford && tradeType === 'BUY' && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t.insufficientCashNotice}</span>
            </div>
          )}

          {!hasEnoughShares && tradeType === 'SELL' && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t.insufficientSharesNotice}</span>
            </div>
          )}

          {executionSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              <span>{t.orderSuccessNotice}</span>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={!canExecute || executionSuccess}
            className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg cursor-pointer ${
              !canExecute
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : tradeType === 'BUY'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
            }`}
          >
            {executionSuccess
              ? t.orderProcessed
              : `${tradeType === 'BUY' ? t.confirmBuy : t.confirmSell} ${shares} ${isIDX ? 'Lembar' : 'Shares'}`}
          </button>
        </form>
      </div>
    </div>
  );
};
