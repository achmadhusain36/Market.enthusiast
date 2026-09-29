import { StockQuote, MarketIndex, PortfolioHolding, Transaction, UserProfile, CandleData, Timeframe } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Achmad Husain',
  title: 'Stock Investor & Global Market Analyst',
  email: 'emhaainunnajib36@gmail.com',
  phone: '+62 812-3456-7890',
  cashBalanceUSD: 18750.0,
  cashBalanceIDR: 300000000,
  selectedCurrency: 'IDR',
  usdIdrRate: 16000,
  riskProfile: 'Aggressive',
  accountNumber: 'RDN-8829-9104-HUS',
  memberSince: 'January 2023',
  language: 'en',
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
    price: 138.00,
    previousClose: 135.00,
    change: 3.00,
    changePercent: 2.22,
    high: 139.10,
    low: 134.90,
    volume: 58240000,
    marketCap: '$3.39T',
    peRatio: 64.2,
    sparkline: [130, 131.5, 132, 130.8, 133, 134.5, 133.8, 135, 136.2, 135.8, 137, 138.00],
    lastUpdated: 'Baru saja',
    sector: 'Semiconductors & AI',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    market: 'NASDAQ',
    currency: 'USD',
    price: 228.00,
    previousClose: 225.50,
    change: 2.50,
    changePercent: 1.11,
    high: 229.50,
    low: 224.80,
    volume: 42150000,
    marketCap: '$3.52T',
    peRatio: 33.8,
    sparkline: [222, 224, 223.5, 225, 226.5, 228.00],
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
    price: 428.00,
    previousClose: 422.30,
    change: 5.70,
    changePercent: 1.35,
    high: 430.00,
    low: 421.80,
    volume: 21840000,
    marketCap: '$3.18T',
    peRatio: 35.1,
    sparkline: [415, 417, 416.5, 419, 420, 422.3, 424, 425.5, 428.00],
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
  },
  {
    symbol: 'BBRI.JK',
    name: 'Bank Rakyat Indonesia (Persero) Tbk',
    market: 'IDX',
    currency: 'IDR',
    price: 5100,
    previousClose: 5025,
    change: 75,
    changePercent: 1.49,
    high: 5150,
    low: 5000,
    volume: 78500000,
    marketCap: 'Rp 772T',
    peRatio: 11.2,
    sparkline: [4800, 4880, 4920, 5000, 5050, 5100],
    lastUpdated: 'Baru saja',
    sector: 'State-Owned Banking',
  },
  {
    symbol: 'TLKM.JK',
    name: 'Telkom Indonesia (Persero) Tbk',
    market: 'IDX',
    currency: 'IDR',
    price: 2980,
    previousClose: 2940,
    change: 40,
    changePercent: 1.36,
    high: 3010,
    low: 2930,
    volume: 52300000,
    marketCap: 'Rp 295T',
    peRatio: 12.8,
    sparkline: [2820, 2860, 2900, 2930, 2960, 2980],
    lastUpdated: 'Baru saja',
    sector: 'Telecommunication',
  },
  {
    symbol: 'BBNI.JK',
    name: 'Bank Negara Indonesia (Persero) Tbk',
    market: 'IDX',
    currency: 'IDR',
    price: 5400,
    previousClose: 5325,
    change: 75,
    changePercent: 1.41,
    high: 5450,
    low: 5300,
    volume: 31400000,
    marketCap: 'Rp 201T',
    peRatio: 9.6,
    sparkline: [5150, 5200, 5280, 5320, 5380, 5400],
    lastUpdated: 'Baru saja',
    sector: 'State-Owned Banking',
  },
  {
    symbol: 'ICBP.JK',
    name: 'Indofood CBP Sukses Makmur Tbk',
    market: 'IDX',
    currency: 'IDR',
    price: 11200,
    previousClose: 11050,
    change: 150,
    changePercent: 1.36,
    high: 11300,
    low: 11000,
    volume: 12800000,
    marketCap: 'Rp 130T',
    peRatio: 14.5,
    sparkline: [10700, 10850, 10950, 11050, 11150, 11200],
    lastUpdated: 'Baru saja',
    sector: 'Consumer Goods',
  },
  {
    symbol: 'ADRO.JK',
    name: 'Adaro Energy Indonesia Tbk',
    market: 'IDX',
    currency: 'IDR',
    price: 3750,
    previousClose: 3680,
    change: 70,
    changePercent: 1.90,
    high: 3800,
    low: 3670,
    volume: 44200000,
    marketCap: 'Rp 119T',
    peRatio: 4.8,
    sparkline: [3520, 3580, 3620, 3680, 3720, 3750],
    lastUpdated: 'Baru saja',
    sector: 'Energy & Coal',
  }
];

export const INITIAL_HOLDINGS: PortfolioHolding[] = [
  {
    symbol: 'BBCA.JK',
    name: 'Bank Central Asia Tbk',
    shares: 28000, // 280 lot = Rp 292.600.000
    avgBuyPrice: 9800,
    currency: 'IDR',
  },
  {
    symbol: 'BMRI.JK',
    name: 'Bank Mandiri (Persero) Tbk',
    shares: 32000, // 320 lot = Rp 228.800.000
    avgBuyPrice: 6700,
    currency: 'IDR',
  },
  {
    symbol: 'BBRI.JK',
    name: 'Bank Rakyat Indonesia (Persero) Tbk',
    shares: 40000, // 400 lot = Rp 204.000.000
    avgBuyPrice: 4800,
    currency: 'IDR',
  },
  {
    symbol: 'TLKM.JK',
    name: 'Telkom Indonesia (Persero) Tbk',
    shares: 50000, // 500 lot = Rp 149.000.000
    avgBuyPrice: 2800,
    currency: 'IDR',
  },
  {
    symbol: 'ASII.JK',
    name: 'Astra International Tbk',
    shares: 29000, // 290 lot = Rp 150.800.000
    avgBuyPrice: 4900,
    currency: 'IDR',
  },
  {
    symbol: 'BBNI.JK',
    name: 'Bank Negara Indonesia (Persero) Tbk',
    shares: 28000, // 280 lot = Rp 151.200.000
    avgBuyPrice: 5100,
    currency: 'IDR',
  },
  {
    symbol: 'ICBP.JK',
    name: 'Indofood CBP Sukses Makmur Tbk',
    shares: 12000, // 120 lot = Rp 134.400.000
    avgBuyPrice: 10600,
    currency: 'IDR',
  },
  {
    symbol: 'ADRO.JK',
    name: 'Adaro Energy Indonesia Tbk',
    shares: 24000, // 240 lot = Rp 90.000.000
    avgBuyPrice: 3500,
    currency: 'IDR',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 58, // 58 * $138 * 16.000 = Rp 128.064.000
    avgBuyPrice: 122.00,
    currency: 'USD',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 15, // 15 * $228 * 16.000 = Rp 54.720.000
    avgBuyPrice: 210.00,
    currency: 'USD',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 17, // 17 * $428 * 16.000 = Rp 116.416.000
    avgBuyPrice: 405.00,
    currency: 'USD',
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-91024',
    timestamp: '25 Sep 2026, 14:35 UTC+7',
    isoDate: '2026-09-25T14:35:00Z',
    type: 'BUY',
    symbol: 'BBCA.JK',
    name: 'Bank Central Asia Tbk',
    shares: 28000,
    price: 9800,
    currency: 'IDR',
    total: 274400000,
    fee: 411600,
    status: 'EXECUTED',
    notes: 'Core banking IDX Bluechip accumulation',
  },
  {
    id: 'TRX-90812',
    timestamp: '24 Sep 2026, 10:15 UTC+7',
    isoDate: '2026-09-24T10:15:00Z',
    type: 'BUY',
    symbol: 'BMRI.JK',
    name: 'Bank Mandiri (Persero) Tbk',
    shares: 32000,
    price: 6700,
    currency: 'IDR',
    total: 214400000,
    fee: 321600,
    status: 'EXECUTED',
    notes: 'Net profit & corporate credit growth',
  },
  {
    id: 'TRX-89945',
    timestamp: '23 Sep 2026, 11:20 UTC+7',
    isoDate: '2026-09-23T11:20:00Z',
    type: 'BUY',
    symbol: 'BBRI.JK',
    name: 'Bank Rakyat Indonesia (Persero) Tbk',
    shares: 40000,
    price: 4800,
    currency: 'IDR',
    total: 192000000,
    fee: 288000,
    status: 'EXECUTED',
    notes: 'Ultra-micro segment & high dividend yield',
  },
  {
    id: 'TRX-89412',
    timestamp: '22 Sep 2026, 20:30 UTC+7',
    isoDate: '2026-09-22T20:30:00Z',
    type: 'BUY',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    shares: 58,
    price: 122.00,
    currency: 'USD',
    total: 7076.00,
    fee: 10.61,
    status: 'EXECUTED',
    notes: 'Blackwell AI GPU Data Center expansion',
  },
  {
    id: 'TRX-88820',
    timestamp: '20 Sep 2026, 21:10 UTC+7',
    isoDate: '2026-09-20T21:10:00Z',
    type: 'BUY',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 17,
    price: 405.00,
    currency: 'USD',
    total: 6885.00,
    fee: 10.33,
    status: 'EXECUTED',
    notes: 'Enterprise cloud & Azure OpenAI investment',
  },
  {
    id: 'TRX-87621',
    timestamp: '18 Sep 2026, 20:45 UTC+7',
    isoDate: '2026-09-18T20:45:00Z',
    type: 'BUY',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 15,
    price: 210.00,
    currency: 'USD',
    total: 3150.00,
    fee: 4.73,
    status: 'EXECUTED',
    notes: 'Apple Intelligence iPhone upgrade supercycle',
  },
  {
    id: 'TRX-86400',
    timestamp: '17 Sep 2026, 09:40 UTC+7',
    isoDate: '2026-09-17T09:40:00Z',
    type: 'BUY',
    symbol: 'TLKM.JK',
    name: 'Telkom Indonesia (Persero) Tbk',
    shares: 50000,
    price: 2800,
    currency: 'IDR',
    total: 140000000,
    fee: 210000,
    status: 'EXECUTED',
    notes: 'Attractive valuation & 5G infrastructure',
  },
  {
    id: 'TRX-85210',
    timestamp: '15 Sep 2026, 13:50 UTC+7',
    isoDate: '2026-09-15T13:50:00Z',
    type: 'BUY',
    symbol: 'ASII.JK',
    name: 'Astra International Tbk',
    shares: 29000,
    price: 4900,
    currency: 'IDR',
    total: 142100000,
    fee: 213150,
    status: 'EXECUTED',
    notes: 'Conglomerate diversification & EV ecosystem',
  },
  {
    id: 'TRX-84192',
    timestamp: '12 Sep 2026, 10:30 UTC+7',
    isoDate: '2026-09-12T10:30:00Z',
    type: 'BUY',
    symbol: 'BBNI.JK',
    name: 'Bank Negara Indonesia (Persero) Tbk',
    shares: 28000,
    price: 5100,
    currency: 'IDR',
    total: 142800000,
    fee: 214200,
    status: 'EXECUTED',
    notes: 'Digital banking growth & operating efficiency',
  },
  {
    id: 'TRX-83100',
    timestamp: '10 Sep 2026, 11:15 UTC+7',
    isoDate: '2026-09-10T11:15:00Z',
    type: 'BUY',
    symbol: 'ICBP.JK',
    name: 'Indofood CBP Sukses Makmur Tbk',
    shares: 12000,
    price: 10600,
    currency: 'IDR',
    total: 127200000,
    fee: 190800,
    status: 'EXECUTED',
    notes: 'Defensive consumer FMCG staple strength',
  },
  {
    id: 'TRX-82050',
    timestamp: '08 Sep 2026, 14:05 UTC+7',
    isoDate: '2026-09-08T14:05:00Z',
    type: 'BUY',
    symbol: 'ADRO.JK',
    name: 'Adaro Energy Indonesia Tbk',
    shares: 24000,
    price: 3500,
    currency: 'IDR',
    total: 84000000,
    fee: 126000,
    status: 'EXECUTED',
    notes: 'High dividend payout & clean energy transition',
  },
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
