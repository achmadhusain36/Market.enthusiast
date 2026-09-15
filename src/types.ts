export type MarketType = 'NASDAQ' | 'NYSE' | 'IDX' | 'GLOBAL';
export type CurrencyType = 'USD' | 'IDR';

export interface StockQuote {
  symbol: string;
  name: string;
  market: MarketType;
  currency: CurrencyType;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap: string;
  peRatio: number;
  sparkline: number[];
  lastUpdated: string;
  flashDirection?: 'up' | 'down' | null;
  sector: string;
}

export interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ma20?: number;
  ma50?: number;
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
  currency: CurrencyType;
}

export interface Transaction {
  id: string;
  timestamp: string;
  isoDate: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  name: string;
  shares: number;
  price: number;
  currency: CurrencyType;
  total: number;
  fee: number;
  status: 'EXECUTED' | 'PENDING' | 'CANCELLED';
  notes?: string;
}

export type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | '10Y' | 'ALL';
export type ChartType = 'candlestick' | 'area';
export type Language = 'id' | 'en';

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  cashBalanceUSD: number;
  cashBalanceIDR: number;
  selectedCurrency: CurrencyType;
  usdIdrRate: number;
  riskProfile: 'Agresif' | 'Moderat' | 'Konservatif';
  accountNumber: string;
  avatarUrl?: string;
  memberSince: string;
  language: Language;
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}
