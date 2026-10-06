import React, { useState, useMemo } from 'react';
import {
  X,
  ArrowUpDown,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  DollarSign,
  Wallet,
  Calculator,
  Sliders,
  TrendingUp,
  TrendingDown,
  Info,
} from 'lucide-react';
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
  tradingMode?: 'REAL' | 'DEMO';
  onExecuteTrade: (trade: {
    type: 'BUY' | 'SELL';
    stock: StockQuote;
    shares: number;
    price: number;
    fee: number;
    total: number;
    orderType?: 'MARKET' | 'LIMIT';
    stopLoss?: number;
    takeProfit?: number;
  }) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  isOpen,
  onClose,
  stock,
  initialType,
  userProfile,
  holdings,
  tradingMode = 'REAL',
  onExecuteTrade,
}) => {
  if (!isOpen) return null;

  const isId = userProfile.language === 'id';
  const t = TRANSLATIONS[userProfile.language || 'id'];
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>(initialType);
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [limitPrice, setLimitPrice] = useState<number>(stock.price);
  const [shares, setShares] = useState<number>(stock.currency === 'IDR' ? 500 : 10);
  const [enableSLTP, setEnableSLTP] = useState<boolean>(false);
  const [stopLossPrice, setStopLossPrice] = useState<number>(
    tradeType === 'BUY' ? Number((stock.price * 0.95).toFixed(2)) : Number((stock.price * 1.05).toFixed(2))
  );
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(
    tradeType === 'BUY' ? Number((stock.price * 1.10).toFixed(2)) : Number((stock.price * 0.90).toFixed(2))
  );
  const [executionSuccess, setExecutionSuccess] = useState(false);

  // Check how many shares user currently owns
  const ownedHolding = holdings.find((h) => h.symbol === stock.symbol);
  const ownedShares = ownedHolding ? ownedHolding.shares : 0;

  // Available user cash
  const availableCash =
    stock.currency === 'USD' ? userProfile.cashBalanceUSD : userProfile.cashBalanceIDR;

  // Execution price based on order type
  const execPrice = orderType === 'LIMIT' ? limitPrice : stock.price;
  const subtotal = shares * execPrice;
  const feeRate = 0.0015; // 0.15% fee
  const fee = subtotal * feeRate;
  const totalCost = tradeType === 'BUY' ? subtotal + fee : subtotal - fee;

  // Calculate Risk-Reward Ratio & Estimated P&L
  const { estProfit, estLoss, riskRewardRatio } = useMemo(() => {
    if (!enableSLTP || execPrice <= 0) {
      return { estProfit: 0, estLoss: 0, riskRewardRatio: 'N/A' };
    }

    let profit = 0;
    let loss = 0;

    if (tradeType === 'BUY') {
      profit = Math.max(0, (takeProfitPrice - execPrice) * shares);
      loss = Math.max(0, (execPrice - stopLossPrice) * shares);
    } else {
      profit = Math.max(0, (execPrice - takeProfitPrice) * shares);
      loss = Math.max(0, (stopLossPrice - execPrice) * shares);
    }

    const rr = loss > 0 ? (profit / loss).toFixed(2) : 'N/A';
    return {
      estProfit: profit,
      estLoss: loss,
      riskRewardRatio: rr !== 'N/A' ? `1 : ${rr}` : 'N/A',
    };
  }, [enableSLTP, execPrice, shares, tradeType, stopLossPrice, takeProfitPrice]);

  // Validation
  const canAfford = tradeType === 'SELL' || availableCash >= totalCost;
  const hasEnoughShares = tradeType === 'BUY' || ownedShares >= shares;
  const isValidAmount = shares > 0 && execPrice > 0;
  const canExecute = canAfford && hasEnoughShares && isValidAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canExecute) return;

    onExecuteTrade({
      type: tradeType,
      stock,
      shares,
      price: execPrice,
      fee,
      total: totalCost,
      orderType,
      stopLoss: enableSLTP ? stopLossPrice : undefined,
      takeProfit: enableSLTP ? takeProfitPrice : undefined,
    });

    setExecutionSuccess(true);
    setTimeout(() => {
      setExecutionSuccess(false);
      onClose();
    }, 1200);
  };

  const isIDX = stock.market === 'IDX';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="liquid-glass-accent bg-[#0a0f1b]/90 border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh] backdrop-blur-2xl">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#162033] border border-[#273450] flex items-center justify-center font-bold text-white text-xs">
              {stock.symbol.split('.')[0]}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{tradeType === 'BUY' ? 'Order Beli' : 'Order Jual'} {stock.symbol}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                  tradingMode === 'DEMO'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {tradingMode === 'DEMO' ? 'DEMO ($100K)' : 'REAL RDN'}
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                {userProfile.language === 'id' ? 'Otorisasi PIN Transaksi Terverifikasi' : 'Trade PIN Authorized'}
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Buy / Sell Toggle tabs */}
          <div className="grid grid-cols-2 gap-2 bg-[#07090f] p-1 rounded-xl border border-[#182133]">
            <button
              type="button"
              onClick={() => {
                setTradeType('BUY');
                setStopLossPrice(Number((stock.price * 0.95).toFixed(2)));
                setTakeProfitPrice(Number((stock.price * 1.10).toFixed(2)));
              }}
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
              onClick={() => {
                setTradeType('SELL');
                setStopLossPrice(Number((stock.price * 1.05).toFixed(2)));
                setTakeProfitPrice(Number((stock.price * 0.90).toFixed(2)));
              }}
              className={`py-2 rounded-lg font-bold text-xs tracking-wider transition-all cursor-pointer ${
                tradeType === 'SELL'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-950/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {t.tradeSell}
            </button>
          </div>

          {/* Order Type Ribbon: Market vs Limit */}
          <div className="flex items-center gap-1.5 bg-[#0e1422] p-1 rounded-xl border border-[#1b253b]">
            <button
              type="button"
              onClick={() => setOrderType('MARKET')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                orderType === 'MARKET' ? 'bg-[#2962ff] text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Market Order (Instan)
            </button>
            <button
              type="button"
              onClick={() => setOrderType('LIMIT')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                orderType === 'LIMIT' ? 'bg-[#2962ff] text-white shadow' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Limit Order (Antrian)
            </button>
          </div>

          {/* Current Live Price & Optional Limit Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0e1422] border border-[#1b253b] rounded-xl p-3">
              <span className="text-[10px] text-neutral-400 block">{t.marketPriceLive}:</span>
              <div className="text-base font-bold font-mono text-white mt-0.5">
                {formatCurrency(stock.price, stock.currency)}
              </div>
            </div>

            {orderType === 'LIMIT' ? (
              <div className="bg-[#0e1422] border border-[#2962ff]/40 rounded-xl p-3">
                <span className="text-[10px] text-cyan-300 font-bold block">Harga Limit Pasang:</span>
                <input
                  type="number"
                  step="any"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(Number(e.target.value))}
                  className="w-full bg-transparent text-base font-bold font-mono text-cyan-300 outline-none mt-0.5"
                />
              </div>
            ) : (
              <div className="bg-[#0e1422] border border-[#1b253b] rounded-xl p-3 text-right">
                <span className="text-[10px] text-neutral-400 block">{t.change24h}:</span>
                <div className={`text-xs font-bold font-mono mt-0.5 ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stock.change >= 0 ? '+' : ''}{formatPercent(stock.changePercent)}
                </div>
              </div>
            )}
          </div>

          {/* User Available Funds / Ownership */}
          <div className="flex items-center justify-between px-1 text-neutral-400">
            <span className="flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.availableCash}:</span>
            </span>
            <span className="font-mono font-bold text-white">
              {formatCurrency(availableCash, stock.currency)}
            </span>
          </div>

          {tradeType === 'SELL' && (
            <div className="flex items-center justify-between px-1 text-neutral-400">
              <span>{t.ownedUnits}:</span>
              <span className="font-mono font-bold text-amber-400">
                {ownedShares.toLocaleString()} {isIDX ? (isId ? 'Lembar' : 'Shares') : 'Shares'}
                {isIDX ? ` (${(ownedShares / 100).toFixed(0)} Lot)` : ''}
              </span>
            </div>
          )}

          {/* Shares / Quantity input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-neutral-300">
              {t.orderQuantity} ({isIDX ? (isId ? 'Lembar Saham' : 'Shares') : 'Shares'})
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                step={isIDX ? '100' : '1'}
                value={shares}
                onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full bg-[#07090f] border border-[#1b253b] focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white font-bold outline-none"
              />
              {isIDX && (
                <span className="absolute right-3 top-2.5 text-xs text-neutral-500 font-mono">
                  = {(shares / 100).toFixed(1)} Lot
                </span>
              )}
            </div>

            {/* Quick Share presets */}
            <div className="flex items-center gap-2 pt-1 font-mono">
              {(isIDX ? [100, 500, 1000, 5000] : [5, 10, 25, 50, 100]).map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setShares(num)}
                  className="px-2 py-0.5 rounded bg-[#131b2c] hover:bg-[#1c273e] text-[11px] text-neutral-300 border border-[#212c44] cursor-pointer"
                >
                  +{num}
                </button>
              ))}
              {tradeType === 'SELL' && ownedShares > 0 && (
                <button
                  type="button"
                  onClick={() => setShares(ownedShares)}
                  className="ml-auto px-2 py-0.5 rounded bg-amber-950/40 text-[11px] font-bold text-amber-400 border border-amber-800/40 cursor-pointer"
                >
                  {t.maxShares}
                </button>
              )}
            </div>
          </div>

          {/* Advanced Risk Management & Calculator (Stop Loss / Take Profit) */}
          <div className="p-3.5 rounded-xl bg-[#0e1422] border border-[#1e283d] space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 font-bold text-white cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enableSLTP}
                  onChange={(e) => setEnableSLTP(e.target.checked)}
                  className="rounded bg-[#07090f] border-[#223048] text-[#2962ff] cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kalkulator Proteksi (Stop Loss & Take Profit)</span>
                </span>
              </label>
              {enableSLTP && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono font-bold">
                  R:R {riskRewardRatio}
                </span>
              )}
            </div>

            {enableSLTP && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-[10px] text-rose-400 font-bold block mb-1">
                    Stop Loss (Harga Cut Loss):
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(Number(e.target.value))}
                    className="w-full bg-[#080c14] border border-rose-500/40 rounded-lg px-2.5 py-1.5 font-mono text-rose-300 font-bold outline-none"
                  />
                  <span className="text-[10px] text-neutral-400 block mt-0.5 font-mono">
                    Max Loss: -{formatCurrency(estLoss, stock.currency)}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                    Take Profit (Target Cuan):
                  </span>
                  <input
                    type="number"
                    step="any"
                    value={takeProfitPrice}
                    onChange={(e) => setTakeProfitPrice(Number(e.target.value))}
                    className="w-full bg-[#080c14] border border-emerald-500/40 rounded-lg px-2.5 py-1.5 font-mono text-emerald-300 font-bold outline-none"
                  />
                  <span className="text-[10px] text-neutral-400 block mt-0.5 font-mono">
                    Potensi Gain: +{formatCurrency(estProfit, stock.currency)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Cost breakdown */}
          <div className="bg-[#0e1422] rounded-xl p-3 space-y-1.5 border border-[#182133] font-mono">
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

          {/* Validation warnings */}
          {!canAfford && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t.insufficientFunds}</span>
            </div>
          )}

          {!hasEnoughShares && (
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{t.insufficientShares}</span>
            </div>
          )}

          {/* Success Banner */}
          {executionSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Order {orderType} berhasil dikirim ke bursa!</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canExecute || executionSuccess}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              !canExecute || executionSuccess
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                : tradeType === 'BUY'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-950/40'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span>
              {executionSuccess
                ? 'Order Tereksekusi'
                : `${tradeType === 'BUY' ? t.confirmBuy : t.confirmSell} (${shares.toLocaleString()} ${
                    isIDX ? 'Lembar' : 'Shares'
                  })`}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
