import { StockQuote, MarketIndex, PortfolioHolding, Transaction, UserProfile, CandleData, Timeframe } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Achmad Husain',
  title: 'Investor Saham & Analis Pasar Global',
  email: 'achmad.husain@investor.id',
  phone: '+62 812-3456-7890',
  cashBalanceUSD: 52400.0,
  cashBalanceIDR: 838400000,
  selectedCurrency: 'USD',
  usdIdrRate: 16000,
  riskProfile: 'Agresif',
  accountNumber: 'RDN-8829-9104-HUS',
  memberSince: 'Januari 2023',
  language: 'id',
};

export const INITIAL_GLOBAL_INDICES: MarketIndex[] = [
  { name: 'VIX', symbol: 'VIX', value: 17.10, change: 1.26, changePercent: 7.95 },
  { name: 'DXY', symbol: 'DXY', value: 99.602, change: 0.136, changePercent: 0.14 },
  { name: 'SPX', symbol: 'SPX', value: 7619.98, change: -37.00, changePercent: -0.48 },
  { name: 'NDQ', symbol: 'NDQ', value: 29127.16, change: -241.28, changePercent: -0.82 },
  { name: 'DJI', symbol: 'DJI', value: 52426.25, change: -152.02, changePercent: -0.29 },
  { name: 'IHSG (IDX)', symbol: '^JKSE', value: 6501.40, change: -33.29, changePercent: -0.51 },
];

export const COMPARISON_INDICES = [
  {
    id: 'ISSI',
    name: 'ISSI',
    badge: 'D',
    fullName: 'Indonesia Sharia Stock Index',
    type: 'flag',
    color: '#10b981',
  },
  {
    id: 'LQ45',
    name: 'LQ45',
    badge: 'D',
    fullName: 'IDX LQ45 Index',
    type: 'number',
    number: '45',
    color: '#ef4444',
  },
  {
    id: 'KOMPAS100',
    name: 'KOMPAS100',
    badge: 'D',
    fullName: 'IDX Kompas 100 Index',
    type: 'number',
    number: '100',
    color: '#f97316',
  },
  {
    id: 'IDX30',
    name: 'IDX30',
    badge: 'D',
    fullName: 'IDX 30 Index',
    type: 'number',
    number: '30',
    color: '#ef4444',
  },
];

export const INITIAL_STOCKS: StockQuote[] = [
  {
    symbol: 'COMPOSITE',
    name: 'Indeks Harga Saham Gabungan IDX',
    market: 'IDX',
    currency: 'IDR',
    price: 6501.3990,
    previousClose: 6534.6930,
    change: -33.2940,
    changePercent: -0.51,
    high: 6680.0000,
    low: 6400.0000,
    volume: 18450000,
    marketCap: 'Rp 11.890T',
    peRatio: 16.4,
    sparkline: [6620, 6640, 6610, 6633, 6590, 6560, 6520, 6505, 6501.399],
    lastUpdated: 'Baru saja',
    sector: 'Broad Market Composite Index',
  },
  {
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    market: 'NASDAQ',
    currency: 'USD',
    price: 80.32,
    previousClose: 77.40,
    change: 2.92,
    changePercent: 3.77,
    high: 81.20,
    low: 77.30,
    volume: 34120000,
    marketCap: '$305.2B',
    peRatio: 38.2,
    sparkline: [76, 77, 78, 77.5, 79, 80.32],
    lastUpdated: 'Baru saja',
    sector: 'Streaming & Entertainment',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    market: 'NASDAQ',
    currency: 'USD',
    price: 138.25,
    previousClose: 134.80,
    change: 3.45,
    changePercent: 2.56,
    high: 139.10,
    low: 134.90,
    volume: 58240000,
    marketCap: '$3.39T',
    peRatio: 64.2,
    sparkline: [130, 131.5, 132, 130.8, 133, 134.5, 133.8, 135, 136.2, 135.8, 137, 138.25],
    lastUpdated: 'Baru saja',
    sector: 'Semiconductors & AI',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    market: 'NASDAQ',
    currency: 'USD',
    price: 333.08,
    previousClose: 332.27,
    change: 0.81,
    changePercent: 0.24,
    high: 334.50,
    low: 331.80,
    volume: 42150000,
    marketCap: '$3.52T',
    peRatio: 33.8,
    sparkline: [328, 330, 331.5, 332, 333.08],
    lastUpdated: 'Baru saja',
    sector: 'Consumer Electronics',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    market: 'NASDAQ',
    currency: 'USD',
    price: 358.97,
    previousClose: 365.44,
    change: -6.47,
    changePercent: -1.77,
    high: 366.00,
    low: 356.50,
    volume: 67320000,
    marketCap: '$1.14T',
    peRatio: 68.4,
    sparkline: [370, 368, 365, 362, 360, 358.97],
    lastUpdated: 'Baru saja',
    sector: 'Automotive & Clean Energy',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    market: 'NASDAQ',
    currency: 'USD',
    price: 428.15,
    previousClose: 422.30,
    change: 5.85,
    changePercent: 1.39,
    high: 430.00,
    low: 421.80,
    volume: 21840000,
    marketCap: '$3.18T',
    peRatio: 35.1,
    sparkline: [415, 417, 416.5, 419, 420, 422.3, 424, 425.5, 428.15],
    lastUpdated: 'Baru saja',
    sector: 'Cloud & Software',
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    market: 'NASDAQ',
    currency: 'USD',
    price: 165.80,
    previousClose: 163.70,
    change: 2.10,
    changePercent: 1.28,
    high: 166.40,
    low: 163.50,
    volume: 24500000,
    marketCap: '$2.05T',
    peRatio: 23.9,
    sparkline: [160, 161, 162.5, 162, 163.7, 164.5, 165.2, 165.8],
    lastUpdated: 'Baru saja',
    sector: 'Internet & Search',
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    market: 'NASDAQ',
    currency: 'USD',
    price: 187.90,
    previousClose: 185.20,
    change: 2.70,
    changePercent: 1.46,
    high: 188.80,
    low: 184.90,
    volume: 31200000,
    marketCap: '$1.96T',
    peRatio: 43.6,
    sparkline: [180, 181.5, 183, 184, 185.2, 186, 187.1, 187.9],
    lastUpdated: 'Baru saja',
    sector: 'E-commerce & Cloud',
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    market: 'NASDAQ',
    currency: 'USD',
    price: 588.60,
    previousClose: 580.40,
    change: 8.20,
    changePercent: 1.41,
    high: 592.00,
    low: 579.50,
    volume: 18900000,
    marketCap: '$1.49T',
    peRatio: 28.5,
    sparkline: [565, 570, 575, 578, 580.4, 583, 586, 588.6],
    lastUpdated: 'Baru saja',
    sector: 'Social Media & VR',
  },
  {
    symbol: 'BBCA.JK',
    name: 'Bank Central Asia Tbk',
    market: 'IDX',
    currency: 'IDR',
    price: 10450,
    previousClose: 10350,
    change: 100,
    changePercent: 0.97,
    high: 10500,
    low: 10325,
    volume: 48920000,
    marketCap: 'Rp 1.288T',
    peRatio: 24.1,
    sparkline: [10100, 10200, 10250, 10350, 10400, 10450],
    lastUpdated: 'Baru saja',
    sector: 'Banking & Financials',
  },
  {
    symbol: 'BMRI.JK',
    name: 'Bank Mandiri (Persero) Tbk',
    market: 'IDX',
    currency: 'IDR',
    price: 7150,
    previousClose: 7050,
    change: 100,
    changePercent: 1.42,
    high: 7200,
    low: 7025,
    volume: 38400000,
    marketCap: 'Rp 667T',
    peRatio: 12.3,
    sparkline: [6900, 6950, 7000, 7050, 7100, 7150],
    lastUpdated: 'Baru saja',
    sector: 'State-Owned Banking',
  },
  {
    symbol: 'ASII.JK',
    name: 'Astra International Tbk',
    market: 'IDX',
    currency: 'IDR',
    price: 5200,
    previousClose: 5125,
    change: 75,
    changePercent: 1.46,
    high: 5250,
    low: 5100,
    volume: 25100000,
    marketCap: 'Rp 210T',
    peRatio: 6.8,
    sparkline: [4980, 5050, 5100, 5125, 5175, 5200],
    lastUpdated: 'Baru saja',
    sector: 'Conglomerate & Auto',
  }
];

export const INITIAL_HOLDINGS: PortfolioHolding[] = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 120,
    avgBuyPrice: 118.50,
    currency: 'USD',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 80,
    avgBuyPrice: 215.20,
    currency: 'USD',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 45,
    avgBuyPrice: 405.00,
    currency: 'USD',
  },
  {
    symbol: 'BBCA.JK',
    name: 'Bank Central Asia Tbk',
    shares: 15000, // 150 lot
    avgBuyPrice: 9800,
    currency: 'IDR',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-89412',
    timestamp: '14 Sep 2026, 18:42 WIB',
    isoDate: '2026-09-14T18:42:00Z',
    type: 'BUY',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 25,
    price: 137.80,
    currency: 'USD',
    total: 3445.00,
    fee: 5.17,
    status: 'EXECUTED',
    notes: 'Akumulasi tren AI Data Center global',
  },
  {
    id: 'TRX-87621',
    timestamp: '12 Sep 2026, 14:15 WIB',
    isoDate: '2026-09-12T14:15:00Z',
    type: 'BUY',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 30,
    price: 228.10,
    currency: 'USD',
    total: 6843.00,
    fee: 10.26,
    status: 'EXECUTED',
    notes: 'Peluncuran produk Apple Intelligence',
  },
  {
    id: 'TRX-84192',
    timestamp: '08 Sep 2026, 10:30 WIB',
    isoDate: '2026-09-08T10:30:00Z',
    type: 'BUY',
    symbol: 'BBCA.JK',
    name: 'Bank Central Asia Tbk',
    shares: 5000,
    price: 10150,
    currency: 'IDR',
    total: 50750000,
    fee: 76125,
    status: 'EXECUTED',
    notes: 'Rebalancing dividen interim perbankan',
  },
  {
    id: 'TRX-79543',
    timestamp: '02 Sep 2026, 21:05 WIB',
    isoDate: '2026-09-02T21:05:00Z',
    type: 'SELL',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    shares: 15,
    price: 232.40,
    currency: 'USD',
    total: 3486.00,
    fee: 5.23,
    status: 'EXECUTED',
    notes: 'Take profit swing trade target 1',
  },
  {
    id: 'TRX-74120',
    timestamp: '28 Agu 2026, 19:20 WIB',
    isoDate: '2026-08-28T19:20:00Z',
    type: 'BUY',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 20,
    price: 412.00,
    currency: 'USD',
    total: 8240.00,
    fee: 12.36,
    status: 'EXECUTED',
    notes: 'Investasi fundamental Azure AI',
  }
];

// Generator for Candlestick & Area historical data for a given stock and timeframe
export function generateCandles(currentPrice: number, timeframe: Timeframe): CandleData[] {
  let count = 50;
  let volatility = currentPrice * 0.02;

  switch (timeframe) {
    case '1D':
      count = 40;
      volatility = currentPrice * 0.005;
      break;
    case '5D':
      count = 45;
      volatility = currentPrice * 0.012;
      break;
    case '1M':
      count = 55;
      volatility = currentPrice * 0.025;
      break;
    case '6M':
      count = 60;
      volatility = currentPrice * 0.04;
      break;
    case 'YTD':
      count = 65;
      volatility = currentPrice * 0.055;
      break;
    case '1Y':
      count = 70;
      volatility = currentPrice * 0.07;
      break;
    case '5Y':
      count = 80;
      volatility = currentPrice * 0.12;
      break;
    case '10Y':
      count = 90;
      volatility = currentPrice * 0.18;
      break;
    case 'ALL':
      count = 100;
      volatility = currentPrice * 0.25;
      break;
  }

  const candles: CandleData[] = [];
  // Trend profile: if COMPOSITE in 1M, recent dip like in screenshot
  let price = currentPrice * (1 + (Math.random() * 0.04 - 0.02));
  const now = Date.now();
  const stepMs = (24 * 3600 * 1000 * (timeframe === '1D' ? 1 : timeframe === '5D' ? 5 : 30)) / count;

  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - i * stepMs;
    const date = new Date(timestamp);
    let time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    if (timeframe !== '1D') {
      time = `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}`;
    }

    const delta = (Math.random() - 0.49) * volatility;
    const open = price;
    const close = i === 0 ? currentPrice : Math.max(open + delta, currentPrice * 0.5);
    const high = Math.max(open, close) + Math.random() * volatility * 0.4;
    const low = Math.min(open, close) - Math.random() * volatility * 0.4;
    const volume = Math.floor(Math.random() * 800000 + 200000);

    candles.push({
      time,
      timestamp,
      open: Number(open.toFixed(4)),
      high: Number(high.toFixed(4)),
      low: Number(low.toFixed(4)),
      close: Number(close.toFixed(4)),
      volume,
    });

    price = close;
  }

  // Calculate MA20 and MA50
  for (let i = 0; i < candles.length; i++) {
    if (i >= 19) {
      const slice20 = candles.slice(i - 19, i + 1);
      const sum20 = slice20.reduce((acc, c) => acc + c.close, 0);
      candles[i].ma20 = Number((sum20 / 20).toFixed(2));
    }
    if (i >= 49) {
      const slice50 = candles.slice(i - 49, i + 1);
      const sum50 = slice50.reduce((acc, c) => acc + c.close, 0);
      candles[i].ma50 = Number((sum50 / 50).toFixed(2));
    }
  }

  return candles;
}
