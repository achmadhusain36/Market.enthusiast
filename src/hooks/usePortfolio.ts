import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useMarketData } from './useMarketData';
import { Asset } from '../data/mockAssets';

export interface Position {
  symbol: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
  currency: 'USD' | 'IDR';
  category: string;
}

export interface TradeOrder {
  id: string;
  timestamp: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  shares: number;
  price: number;
  total: number;
  fee: number;
  status: 'FILLED' | 'PENDING' | 'CANCELLED';
  currency: 'USD' | 'IDR';
}

export interface WalletRecord {
  id: string;
  timestamp: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  currency: 'USD' | 'IDR';
  method: string;
  destination: string;
  status: 'SUCCESS' | 'PENDING';
}

const INITIAL_POSITIONS: Position[] = [
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    shares: 0.15,
    avgBuyPrice: 61500,
    currency: 'USD',
    category: 'Crypto',
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum',
    shares: 2.5,
    avgBuyPrice: 2450,
    currency: 'USD',
    category: 'Crypto',
  },
  {
    symbol: 'BBCA.JK',
    name: 'Bank Central Asia',
    shares: 3000,
    avgBuyPrice: 9950,
    currency: 'IDR',
    category: 'Saham',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 20,
    avgBuyPrice: 124.50,
    currency: 'USD',
    category: 'Saham',
  },
  {
    symbol: 'XAU/USD',
    name: 'Fine Gold 999.9',
    shares: 3.0,
    avgBuyPrice: 2580,
    currency: 'USD',
    category: 'Komoditas',
  },
];

const INITIAL_ORDERS: TradeOrder[] = [
  {
    id: 'ORD-9021',
    timestamp: '04 Okt 2026, 14:30 WIB',
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    type: 'BUY',
    orderType: 'MARKET',
    shares: 0.05,
    price: 64200,
    total: 3210,
    fee: 4.81,
    status: 'FILLED',
    currency: 'USD',
  },
  {
    id: 'ORD-9018',
    timestamp: '03 Okt 2026, 09:15 WIB',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    type: 'BUY',
    orderType: 'LIMIT',
    shares: 10,
    price: 135.00,
    total: 1350,
    fee: 2.02,
    status: 'FILLED',
    currency: 'USD',
  },
];

const INITIAL_WALLET: WalletRecord[] = [
  {
    id: 'WAL-101',
    timestamp: '01 Okt 2026, 10:00 WIB',
    type: 'DEPOSIT',
    amount: 10000,
    currency: 'USD',
    method: 'Simulation Initial Deposit',
    destination: 'Nusa Trading Account',
    status: 'SUCCESS',
  },
];

export function usePortfolio() {
  const { user, adjustBalance } = useAuthStore();
  const { assets } = useMarketData();

  const [positions, setPositions] = useState<Position[]>(() => {
    const saved = localStorage.getItem('nusa_portfolio_positions');
    return saved ? JSON.parse(saved) : INITIAL_POSITIONS;
  });

  const [orders, setOrders] = useState<TradeOrder[]>(() => {
    const saved = localStorage.getItem('nusa_trade_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [walletHistory, setWalletHistory] = useState<WalletRecord[]>(() => {
    const saved = localStorage.getItem('nusa_wallet_history');
    return saved ? JSON.parse(saved) : INITIAL_WALLET;
  });

  useEffect(() => {
    localStorage.setItem('nusa_portfolio_positions', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem('nusa_trade_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nusa_wallet_history', JSON.stringify(walletHistory));
  }, [walletHistory]);

  // Calculate detailed holding performance with live prices
  const positionsWithLiveData = useMemo(() => {
    return positions.map((pos) => {
      const match = assets.find((a) => a.symbol === pos.symbol);
      const currentPrice = match ? match.price : pos.avgBuyPrice;
      const totalCost = pos.shares * pos.avgBuyPrice;
      const currentValue = pos.shares * currentPrice;
      const pnl = currentValue - totalCost;
      const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;

      return {
        ...pos,
        currentPrice,
        totalCost,
        currentValue,
        pnl,
        pnlPercent,
      };
    });
  }, [positions, assets]);

  // Total Portfolio Net Asset Value (NAV) in USD
  const totalPositionsValueUSD = useMemo(() => {
    const usdIdrRate = 15640;
    return positionsWithLiveData.reduce((sum, pos) => {
      const val = pos.currency === 'IDR' ? pos.currentValue / usdIdrRate : pos.currentValue;
      return sum + val;
    }, 0);
  }, [positionsWithLiveData]);

  const totalNAV_USD = user.cashBalanceUSD + totalPositionsValueUSD;
  const totalNAV_IDR = totalNAV_USD * 15640;

  // Execute Buy / Sell Order
  const executeOrder = (params: {
    asset: Asset;
    type: 'BUY' | 'SELL';
    orderType: 'MARKET' | 'LIMIT';
    shares: number;
    price: number;
  }) => {
    const subtotal = params.shares * params.price;
    const fee = subtotal * 0.0015; // 0.15% fee
    const total = params.type === 'BUY' ? subtotal + fee : subtotal - fee;

    // Check balance if BUY
    if (params.type === 'BUY') {
      if (params.asset.currency === 'USD' && user.cashBalanceUSD < total) {
        throw new Error('Saldo USD tidak mencukupi untuk mengeksekusi order ini.');
      }
      if (params.asset.currency === 'IDR' && user.cashBalanceIDR < total) {
        throw new Error('Saldo IDR tidak mencukupi untuk mengeksekusi order ini.');
      }
      adjustBalance(
        params.asset.currency === 'USD' ? -total : 0,
        params.asset.currency === 'IDR' ? -total : 0
      );
    } else {
      // Check shares if SELL
      const existing = positions.find((p) => p.symbol === params.asset.symbol);
      if (!existing || existing.shares < params.shares) {
        throw new Error('Jumlah unit aset yang dimiliki tidak mencukupi untuk dijual.');
      }
      adjustBalance(
        params.asset.currency === 'USD' ? total : 0,
        params.asset.currency === 'IDR' ? total : 0
      );
    }

    // Update positions
    setPositions((prev) => {
      const idx = prev.findIndex((p) => p.symbol === params.asset.symbol);
      if (params.type === 'BUY') {
        if (idx >= 0) {
          const curr = prev[idx];
          const newShares = curr.shares + params.shares;
          const newAvg = (curr.shares * curr.avgBuyPrice + params.shares * params.price) / newShares;
          const updated = [...prev];
          updated[idx] = { ...curr, shares: newShares, avgBuyPrice: newAvg };
          return updated;
        } else {
          return [
            ...prev,
            {
              symbol: params.asset.symbol,
              name: params.asset.name,
              shares: params.shares,
              avgBuyPrice: params.price,
              currency: params.asset.currency,
              category: params.asset.category,
            },
          ];
        }
      } else {
        // SELL
        if (idx >= 0) {
          const curr = prev[idx];
          const rem = curr.shares - params.shares;
          if (rem <= 0.000001) {
            return prev.filter((_, i) => i !== idx);
          }
          const updated = [...prev];
          updated[idx] = { ...curr, shares: rem };
          return updated;
        }
        return prev;
      }
    });

    // Record order
    const now = new Date();
    const newOrder: TradeOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: `${now.toLocaleDateString('id-ID')} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`,
      symbol: params.asset.symbol,
      name: params.asset.name,
      type: params.type,
      orderType: params.orderType,
      shares: params.shares,
      price: params.price,
      total,
      fee,
      status: 'FILLED',
      currency: params.asset.currency,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Deposit Simulation
  const deposit = (amount: number, currency: 'USD' | 'IDR', method: string) => {
    adjustBalance(currency === 'USD' ? amount : 0, currency === 'IDR' ? amount : 0);
    const rec: WalletRecord = {
      id: `WAL-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      type: 'DEPOSIT',
      amount,
      currency,
      method,
      destination: 'Nusa Trading Account',
      status: 'SUCCESS',
    };
    setWalletHistory((prev) => [rec, ...prev]);
    return rec;
  };

  // Withdraw Simulation
  const withdraw = (amount: number, currency: 'USD' | 'IDR', destination: string) => {
    if (currency === 'USD' && user.cashBalanceUSD < amount) {
      throw new Error('Saldo USD tidak mencukupi untuk penarikan.');
    }
    if (currency === 'IDR' && user.cashBalanceIDR < amount) {
      throw new Error('Saldo IDR tidak mencukupi untuk penarikan.');
    }

    adjustBalance(currency === 'USD' ? -amount : 0, currency === 'IDR' ? -amount : 0);
    const rec: WalletRecord = {
      id: `WAL-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString('id-ID'),
      type: 'WITHDRAW',
      amount,
      currency,
      method: 'Bank / Crypto Transfer',
      destination,
      status: 'SUCCESS',
    };
    setWalletHistory((prev) => [rec, ...prev]);
    return rec;
  };

  return {
    positions: positionsWithLiveData,
    orders,
    walletHistory,
    totalNAV_USD,
    totalNAV_IDR,
    totalPositionsValueUSD,
    executeOrder,
    deposit,
    withdraw,
  };
}
