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
  haOpen?: number;
  haHigh?: number;
  haLow?: number;
  haClose?: number;
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

export type Timeframe =
  | '1s'
  | '5s'
  | '15s'
  | '1m'
  | '3m'
  | '5m'
  | '15m'
  | '30m'
  | '1H'
  | '2H'
  | '4H'
  | '1D'
  | '5D'
  | '1W'
  | '1M'
  | '6M'
  | 'YTD'
  | '1Y'
  | '5Y'
  | '10Y'
  | 'ALL';

export type ChartType =
  | 'candlestick'
  | 'area'
  | 'line'
  | 'bar'
  | 'baseline'
  | 'heikinashi'
  | 'renko'
  | 'histogram';

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
  riskProfile: 'Agresif' | 'Moderat' | 'Konservatif' | 'Aggressive' | 'Moderate' | 'Conservative';
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

// Multi-chart layout
export type MultiChartLayout = '1' | '2-h' | '2-v' | '4';

// Drawing Tools
export type DrawingToolType =
  | 'cursor'
  | 'crosshair'
  | 'trendline'
  | 'ray'
  | 'extended'
  | 'horizontal'
  | 'vertical'
  | 'channel'
  | 'fib_retrace'
  | 'fib_extension'
  | 'gann_fan'
  | 'rectangle'
  | 'circle'
  | 'triangle'
  | 'brush'
  | 'text'
  | 'callout'
  | 'long_position'
  | 'short_position'
  | 'measure'
  | 'eraser';

export interface DrawingPoint {
  x: number;
  y: number;
  price?: number;
  index?: number;
}

export interface DrawingObject {
  id: string;
  type: DrawingToolType;
  points: DrawingPoint[];
  color: string;
  lineWidth?: number;
  text?: string;
  locked?: boolean;
  visible?: boolean;
  targetPrice?: number;
  stopLossPrice?: number;
  entryPrice?: number;
  riskRewardRatio?: number;
}

// Technical Indicators
export type IndicatorType =
  | 'SMA'
  | 'EMA'
  | 'WMA'
  | 'RSI'
  | 'MACD'
  | 'BB'
  | 'STOCH'
  | 'ATR'
  | 'SUPERTREND'
  | 'VWAP'
  | 'VOL_PROFILE'
  | 'ICHIMOKU'
  | 'PSAR';

export interface TechnicalIndicator {
  id: string;
  name: string;
  type: IndicatorType;
  color: string;
  params: Record<string, number | string>;
  visible: boolean;
  overlay: boolean;
}

// Price Alert Engine
export interface PriceAlert {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'crossing' | 'greater_than' | 'less_than';
  triggered: boolean;
  createdAt: string;
  triggeredAt?: string;
  notifyBrowser: boolean;
  notifySound: boolean;
  webhookUrl?: string;
  note?: string;
}

// Economic Calendar Event
export interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  country: 'US' | 'ID' | 'EU' | 'JP' | 'CN' | 'GB';
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
  unit?: string;
  category: 'CPI' | 'GDP' | 'INTEREST_RATE' | 'EMPLOYMENT' | 'MANUFACTURING' | 'EARNINGS';
}

// News Feed Item
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: 'Latest' | 'Stocks' | 'Crypto' | 'Forex' | 'Commodities' | 'Economy';
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  relatedSymbols: string[];
  summary: string;
}

// Pine Script platform state
export interface PineScriptItem {
  id: string;
  title: string;
  code: string;
  isApplied: boolean;
  lastCompiled?: string;
  status: 'ok' | 'error' | 'idle';
  consoleOutput: string[];
}

// Notification Center Item
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'ALERT' | 'ORDER' | 'SYSTEM' | 'ECONOMIC';
  read: boolean;
}

