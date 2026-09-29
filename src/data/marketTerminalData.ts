import { EconomicEvent, NewsItem, PineScriptItem, TechnicalIndicator } from '../types';

export const INITIAL_ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'eco-1',
    date: '2026-09-28',
    time: '19:30',
    country: 'US',
    event: 'US Core PCE Price Index (MoM)',
    impact: 'high',
    actual: '0.2%',
    forecast: '0.2%',
    previous: '0.3%',
    unit: '%',
    category: 'CPI',
  },
  {
    id: 'eco-2',
    date: '2026-09-29',
    time: '14:00',
    country: 'ID',
    event: 'Bank Indonesia 7-Day Reverse Repo Rate',
    impact: 'high',
    actual: '6.00%',
    forecast: '6.00%',
    previous: '6.25%',
    unit: '%',
    category: 'INTEREST_RATE',
  },
  {
    id: 'eco-3',
    date: '2026-09-30',
    time: '19:30',
    country: 'US',
    event: 'Gross Domestic Product (GDP) annualized',
    impact: 'high',
    actual: '3.0%',
    forecast: '2.9%',
    previous: '2.8%',
    unit: '%',
    category: 'GDP',
  },
  {
    id: 'eco-4',
    date: '2026-10-01',
    time: '19:30',
    country: 'US',
    event: 'Non-Farm Payrolls (NFP) Employment',
    impact: 'high',
    actual: '142K',
    forecast: '165K',
    previous: '114K',
    unit: 'Jobs',
    category: 'EMPLOYMENT',
  },
  {
    id: 'eco-5',
    date: '2026-10-02',
    time: '15:00',
    country: 'EU',
    event: 'Eurozone Harmonised Index of Consumer Prices (CPI)',
    impact: 'medium',
    actual: '2.2%',
    forecast: '2.2%',
    previous: '2.6%',
    unit: '%',
    category: 'CPI',
  },
  {
    id: 'eco-6',
    date: '2026-10-03',
    time: '06:50',
    country: 'JP',
    event: 'Bank of Japan Monetary Policy Summary',
    impact: 'medium',
    actual: '0.25%',
    forecast: '0.25%',
    previous: '0.10%',
    unit: '%',
    category: 'INTEREST_RATE',
  },
  {
    id: 'eco-7',
    date: '2026-10-04',
    time: '09:00',
    country: 'ID',
    event: 'Indonesia S&P Global Manufacturing PMI',
    impact: 'medium',
    actual: '51.4',
    forecast: '50.8',
    previous: '49.3',
    unit: 'Index',
    category: 'MANUFACTURING',
  },
];

export const INITIAL_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Bank Indonesia Mantapkan Suku Bunga Acuan 6.00% untuk Menjaga Stabilitas Rupiah',
    source: 'Bloomberg Terminal / IDX Market',
    time: '15 mins ago',
    category: 'Economy',
    sentiment: 'BULLISH',
    relatedSymbols: ['COMPOSITE', 'BBCA', 'BMRI', 'BBNI'],
    summary:
      'Gubernur Bank Indonesia menyatakan fundamental ekonomi domestik solid di tengah penurunan suku bunga the Fed 50 bps.',
  },
  {
    id: 'news-2',
    title: 'NVIDIA Partners With Global Cloud Titans to Scale Next-Gen AI Inference Data Centers',
    source: 'Reuters Financial',
    time: '34 mins ago',
    category: 'Stocks',
    sentiment: 'BULLISH',
    relatedSymbols: ['NVDA', 'AAPL', 'MSFT', 'NDQ'],
    summary:
      'CEO Jensen Huang confirmed hyper-scaler purchase orders have doubled for the Blackwell architecture platform.',
  },
  {
    id: 'news-3',
    title: 'BBCA & BMRI Bukukan Pertumbuhan Kredit Korporasi & Konsumer Dua Digit di Q3 2026',
    source: 'CNBC Indonesia Markets',
    time: '1 hour ago',
    category: 'Stocks',
    sentiment: 'BULLISH',
    relatedSymbols: ['BBCA', 'BMRI', 'BBRI'],
    summary:
      'Laba bersih konsolidasian perbankan tier-1 Indonesia terus membukukan rekor all-time high didukung rasio CASA di atas 80%.',
  },
  {
    id: 'news-4',
    title: 'Bitcoin Consolidates Above $63,000 as Institutional Spot ETF Inflows Reach $450M',
    source: 'CoinDesk Pro',
    time: '2 hours ago',
    category: 'Crypto',
    sentiment: 'BULLISH',
    relatedSymbols: ['BTCUSDT', 'ETHUSDT'],
    summary:
      'BlackRock IBIT and Fidelity FBTC saw continuous net inflows as exchange supply reserves fell to multi-year lows.',
  },
  {
    id: 'news-5',
    title: 'Brent Crude Stabilizes Near $74/Barrel as Middle East Shipping & Supply Risks Weighed',
    source: 'Financial Times Energy',
    time: '3 hours ago',
    category: 'Commodities',
    sentiment: 'NEUTRAL',
    relatedSymbols: ['BRENT', 'XAUUSD'],
    summary:
      'Crude benchmarks held narrow ranges as OPEC+ production discipline offset concerns over global factory output.',
  },
  {
    id: 'news-6',
    title: 'US Dollar Index (DXY) Dips to 99.60 Following Dovish FOMC Forward Guidance',
    source: 'Wall Street Journal',
    time: '4 hours ago',
    category: 'Forex',
    sentiment: 'BEARISH',
    relatedSymbols: ['DXY', 'EURUSD', 'USDIDR'],
    summary:
      'Treasury 10-year benchmark yields dropped 6 basis points, pushing emerging market FX currencies into green territory.',
  },
];

export const INITIAL_PINE_SCRIPTS: PineScriptItem[] = [
  {
    id: 'script-1',
    title: 'RSI Divergence & Multi-Overbought Alert',
    code: `//@version=5
indicator("RSI 14 Dynamic Bands & Overbought Alert", overlay=false)
length = input.int(14, title="RSI Length")
src = input(close, title="Source")
up = ta.rma(math.max(ta.change(src), 0), length)
down = ta.rma(-math.min(ta.change(src), 0), length)
rsi = down == 0 ? 100 : up == 0 ? 0 : 100 - (100 / (1 + up / down))

plot(rsi, title="RSI", color=color.purple, linewidth=2)
band70 = hline(70, "Overbought", color=color.red, linestyle=hline.style_dashed)
band30 = hline(30, "Oversold", color=color.green, linestyle=hline.style_dashed)
fill(band70, band30, color=color.new(color.purple, 90))

// Alert condition trigger
alertcondition(rsi > 70, title="RSI Overbought", message="RSI has crossed above 70!")
alertcondition(rsi < 30, title="RSI Oversold", message="RSI has dipped below 30!")`,
    isApplied: true,
    lastCompiled: 'Just now',
    status: 'ok',
    consoleOutput: [
      '[PINE RUNTIME v5] Script parsed successfully.',
      '[PINE RUNTIME v5] Allocating memory buffers for 250 bars.',
      '[PINE RUNTIME v5] Plot handles [RSI, Overbought, Oversold] compiled to chart canvas.',
      '[PINE RUNTIME v5] Ready. Status: ACTIVE.',
    ],
  },
  {
    id: 'script-2',
    title: 'EMA 9 / 21 Golden Cross Strategy',
    code: `//@version=5
strategy("EMA 9/21 Trend Ribbon", overlay=true)
fastLen = input.int(9, title="Fast EMA")
slowLen = input.int(21, title="Slow EMA")

emaFast = ta.ema(close, fastLen)
emaSlow = ta.ema(close, slowLen)

plot(emaFast, title="EMA 9", color=color.aqua, linewidth=2)
plot(emaSlow, title="EMA 21", color=color.orange, linewidth=2)

bullishCross = ta.crossover(emaFast, emaSlow)
bearishCross = ta.crossunder(emaFast, emaSlow)

plotshape(bullishCross, title="Buy Signal", style=shape.triangleup, location=location.belowbar, color=color.green, size=size.small)
plotshape(bearishCross, title="Sell Signal", style=shape.triangledown, location=location.abovebar, color=color.red, size=size.small)`,
    isApplied: false,
    lastCompiled: '10 mins ago',
    status: 'ok',
    consoleOutput: [
      '[PINE RUNTIME v5] EMA 9/21 Strategy verified.',
      '[PINE RUNTIME v5] Overlay set to TRUE. Shape handles generated.',
    ],
  },
  {
    id: 'script-3',
    title: 'Bollinger Bands Mean Reversion',
    code: `//@version=5
indicator("Bollinger Bands 20, 2.0 Dev", overlay=true)
length = input.int(20, minval=1)
mult = input.float(2.0, minval=0.001, maxval=50)
basis = ta.sma(close, length)
dev = mult * ta.stdev(close, length)
upper = basis + dev
lower = basis - dev

p1 = plot(upper, "Upper Band", color=color.teal)
plot(basis, "Basis SMA", color=color.orange)
p2 = plot(lower, "Lower Band", color=color.teal)
fill(p1, p2, color=color.new(color.teal, 92), title="BB Background")`,
    isApplied: false,
    status: 'idle',
    consoleOutput: ['[PINE RUNTIME v5] Idle.'],
  },
];

export const DEFAULT_TECHNICAL_INDICATORS: TechnicalIndicator[] = [
  {
    id: 'ind-sma-20',
    name: 'SMA 20',
    type: 'SMA',
    color: '#2962ff',
    params: { length: 20 },
    visible: true,
    overlay: true,
  },
  {
    id: 'ind-ema-50',
    name: 'EMA 50',
    type: 'EMA',
    color: '#f59e0b',
    params: { length: 50 },
    visible: true,
    overlay: true,
  },
  {
    id: 'ind-bb-20',
    name: 'Bollinger Bands (20, 2)',
    type: 'BB',
    color: '#10b981',
    params: { length: 20, mult: 2 },
    visible: false,
    overlay: true,
  },
  {
    id: 'ind-supertrend',
    name: 'Supertrend (10, 3)',
    type: 'SUPERTREND',
    color: '#06b6d4',
    params: { period: 10, multiplier: 3 },
    visible: false,
    overlay: true,
  },
  {
    id: 'ind-rsi-14',
    name: 'RSI 14',
    type: 'RSI',
    color: '#a855f7',
    params: { length: 14, overbought: 70, oversold: 30 },
    visible: true,
    overlay: false,
  },
  {
    id: 'ind-macd',
    name: 'MACD (12, 26, 9)',
    type: 'MACD',
    color: '#3b82f6',
    params: { fast: 12, slow: 26, signal: 9 },
    visible: false,
    overlay: false,
  },
];

// Comprehensive Financial Statements and Fundamentals
export interface CompanyFinancials {
  symbol: string;
  name: string;
  ceo: string;
  founded: number;
  employees: string;
  industry: string;
  sector: string;
  website: string;
  summary: string;
  valuation: {
    pe: number;
    forwardPe: number;
    pb: number;
    evEbitda: number;
    peg: number;
    dividendYield: number;
    payoutRatio: number;
    marketCap: string;
    enterpriseValue: string;
  };
  profitability: {
    roe: number;
    roa: number;
    roic: number;
    grossMargin: number;
    operatingMargin: number;
    netMargin: number;
    freeCashFlowYield: number;
  };
  incomeStatement: {
    period: string;
    revenue: number;
    grossProfit: number;
    operatingIncome: number;
    netIncome: number;
    eps: number;
  }[];
  balanceSheet: {
    period: string;
    cash: number;
    totalAssets: number;
    totalDebt: number;
    totalEquity: number;
    debtToEquity: number;
  }[];
  cashFlow: {
    period: string;
    operatingCashFlow: number;
    capex: number;
    freeCashFlow: number;
  }[];
}

export const FINANCIALS_DATABASE: Record<string, CompanyFinancials> = {
  COMPOSITE: {
    symbol: 'COMPOSITE',
    name: 'Indeks Harga Saham Gabungan (IHSG)',
    ceo: 'Bursa Efek Indonesia (IDX Management)',
    founded: 1982,
    employees: '900+ Listed Companies',
    industry: 'Broad Market Equity Index',
    sector: 'All Sectors (Indonesia)',
    website: 'https://www.idx.co.id',
    summary:
      'The Jakarta Composite Index is a modified capitalization-weighted index of all stocks listed on the regular board of the Indonesia Stock Exchange.',
    valuation: {
      pe: 16.4,
      forwardPe: 14.8,
      pb: 1.95,
      evEbitda: 9.8,
      peg: 1.25,
      dividendYield: 3.85,
      payoutRatio: 45.2,
      marketCap: 'Rp 11.890 Triliun',
      enterpriseValue: 'Rp 14.200 Triliun',
    },
    profitability: {
      roe: 14.6,
      roa: 3.2,
      roic: 11.8,
      grossMargin: 38.5,
      operatingMargin: 24.2,
      netMargin: 17.5,
      freeCashFlowYield: 5.4,
    },
    incomeStatement: [
      { period: '2022', revenue: 1250, grossProfit: 480, operatingIncome: 310, netIncome: 215, eps: 410 },
      { period: '2023', revenue: 1390, grossProfit: 530, operatingIncome: 345, netIncome: 240, eps: 455 },
      { period: '2024', revenue: 1540, grossProfit: 590, operatingIncome: 385, netIncome: 270, eps: 512 },
      { period: 'TTM (2025/2026)', revenue: 1680, grossProfit: 650, operatingIncome: 425, netIncome: 305, eps: 575 },
    ],
    balanceSheet: [
      { period: '2022', cash: 850, totalAssets: 12400, totalDebt: 3200, totalEquity: 7100, debtToEquity: 0.45 },
      { period: '2023', cash: 920, totalAssets: 13800, totalDebt: 3400, totalEquity: 7900, debtToEquity: 0.43 },
      { period: '2024', cash: 1050, totalAssets: 15100, totalDebt: 3600, totalEquity: 8800, debtToEquity: 0.41 },
      { period: 'TTM (2025/2026)', cash: 1180, totalAssets: 16400, totalDebt: 3750, totalEquity: 9600, debtToEquity: 0.39 },
    ],
    cashFlow: [
      { period: '2022', operatingCashFlow: 380, capex: 140, freeCashFlow: 240 },
      { period: '2023', operatingCashFlow: 420, capex: 155, freeCashFlow: 265 },
      { period: '2024', operatingCashFlow: 475, capex: 170, freeCashFlow: 305 },
      { period: 'TTM (2025/2026)', operatingCashFlow: 530, capex: 185, freeCashFlow: 345 },
    ],
  },
  BBCA: {
    symbol: 'BBCA',
    name: 'PT Bank Central Asia Tbk',
    ceo: 'Jahja Setiaatmadja',
    founded: 1957,
    employees: '26,450+',
    industry: 'Commercial Banking & Digital Financials',
    sector: 'Financials',
    website: 'https://www.bca.co.id',
    summary:
      'Bank Central Asia (BCA) is the largest private commercial bank in Southeast Asia by market capitalization with industry-leading CASA ratio above 81%.',
    valuation: {
      pe: 22.8,
      forwardPe: 20.2,
      pb: 4.85,
      evEbitda: 14.2,
      peg: 1.85,
      dividendYield: 2.85,
      payoutRatio: 62.5,
      marketCap: 'Rp 1.250 Triliun',
      enterpriseValue: 'Rp 1.380 Triliun',
    },
    profitability: {
      roe: 22.4,
      roa: 3.8,
      roic: 18.2,
      grossMargin: 82.5,
      operatingMargin: 56.4,
      netMargin: 46.8,
      freeCashFlowYield: 4.2,
    },
    incomeStatement: [
      { period: '2022', revenue: 87400, grossProfit: 71200, operatingIncome: 49500, netIncome: 40700, eps: 330 },
      { period: '2023', revenue: 99300, grossProfit: 81500, operatingIncome: 58900, netIncome: 48600, eps: 395 },
      { period: '2024', revenue: 111400, grossProfit: 92300, operatingIncome: 67200, netIncome: 54800, eps: 445 },
      { period: 'TTM (2025/2026)', revenue: 122800, grossProfit: 102500, operatingIncome: 74600, netIncome: 60200, eps: 488 },
    ],
    balanceSheet: [
      { period: '2022', cash: 185000, totalAssets: 1314000, totalDebt: 215000, totalEquity: 221000, debtToEquity: 0.97 },
      { period: '2023', cash: 205000, totalAssets: 1408000, totalDebt: 228000, totalEquity: 245000, debtToEquity: 0.93 },
      { period: '2024', cash: 232000, totalAssets: 1520000, totalDebt: 242000, totalEquity: 272000, debtToEquity: 0.89 },
      { period: 'TTM (2025/2026)', cash: 254000, totalAssets: 1625000, totalDebt: 255000, totalEquity: 301000, debtToEquity: 0.85 },
    ],
    cashFlow: [
      { period: '2022', operatingCashFlow: 45200, capex: 6500, freeCashFlow: 38700 },
      { period: '2023', operatingCashFlow: 54100, capex: 7400, freeCashFlow: 46700 },
      { period: '2024', operatingCashFlow: 61800, capex: 8200, freeCashFlow: 53600 },
      { period: 'TTM (2025/2026)', operatingCashFlow: 68900, capex: 8900, freeCashFlow: 60000 },
    ],
  },
  AAPL: {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    ceo: 'Tim Cook',
    founded: 1976,
    employees: '161,000',
    industry: 'Consumer Electronics & Services Ecosystem',
    sector: 'Technology',
    website: 'https://www.apple.com',
    summary:
      'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, and sells a variety of related services.',
    valuation: {
      pe: 33.5,
      forwardPe: 29.8,
      pb: 46.2,
      evEbitda: 24.6,
      peg: 2.45,
      dividendYield: 0.45,
      payoutRatio: 15.2,
      marketCap: '$3.45 Trillion',
      enterpriseValue: '$3.51 Trillion',
    },
    profitability: {
      roe: 147.2,
      roa: 28.5,
      roic: 56.4,
      grossMargin: 46.2,
      operatingMargin: 31.4,
      netMargin: 25.8,
      freeCashFlowYield: 3.2,
    },
    incomeStatement: [
      { period: '2022', revenue: 394328, grossProfit: 170782, operatingIncome: 119437, netIncome: 99803, eps: 6.11 },
      { period: '2023', revenue: 383285, grossProfit: 169148, operatingIncome: 114301, netIncome: 96995, eps: 6.13 },
      { period: '2024', revenue: 391035, grossProfit: 180683, operatingIncome: 123216, netIncome: 101450, eps: 6.57 },
      { period: 'TTM (2025/2026)', revenue: 405200, grossProfit: 189400, operatingIncome: 129800, netIncome: 107200, eps: 7.02 },
    ],
    balanceSheet: [
      { period: '2022', cash: 48304, totalAssets: 352755, totalDebt: 120069, totalEquity: 50672, debtToEquity: 2.37 },
      { period: '2023', cash: 61555, totalAssets: 352583, totalDebt: 111088, totalEquity: 62146, debtToEquity: 1.79 },
      { period: '2024', cash: 65200, totalAssets: 364980, totalDebt: 106629, totalEquity: 66800, debtToEquity: 1.60 },
      { period: 'TTM (2025/2026)', cash: 72400, totalAssets: 378200, totalDebt: 102500, totalEquity: 74200, debtToEquity: 1.38 },
    ],
    cashFlow: [
      { period: '2022', operatingCashFlow: 122151, capex: 10708, freeCashFlow: 111443 },
      { period: '2023', operatingCashFlow: 110543, capex: 10959, freeCashFlow: 99584 },
      { period: '2024', operatingCashFlow: 118254, capex: 11200, freeCashFlow: 107054 },
      { period: 'TTM (2025/2026)', operatingCashFlow: 125600, capex: 11800, freeCashFlow: 113800 },
    ],
  },
};

// Fallback helper for any stock symbol
export function getCompanyFinancials(symbol: string): CompanyFinancials {
  if (FINANCIALS_DATABASE[symbol]) {
    return FINANCIALS_DATABASE[symbol];
  }
  return {
    symbol,
    name: `${symbol} Corporation`,
    ceo: 'Board of Directors',
    founded: 2000,
    employees: '12,500+',
    industry: 'Diversified Global Operations',
    sector: 'Equity Capital Markets',
    website: `https://${symbol.toLowerCase()}.com`,
    summary: `${symbol} operates leading commercial market services with recurring cash flows and robust institutional sponsorship.`,
    valuation: {
      pe: 18.5,
      forwardPe: 16.2,
      pb: 2.45,
      evEbitda: 11.2,
      peg: 1.4,
      dividendYield: 3.2,
      payoutRatio: 42.0,
      marketCap: 'Rp 450T / $28B',
      enterpriseValue: 'Rp 490T / $31B',
    },
    profitability: {
      roe: 17.5,
      roa: 6.8,
      roic: 14.2,
      grossMargin: 42.5,
      operatingMargin: 25.8,
      netMargin: 18.4,
      freeCashFlowYield: 4.8,
    },
    incomeStatement: [
      { period: '2022', revenue: 24500, grossProfit: 10400, operatingIncome: 6300, netIncome: 4500, eps: 120 },
      { period: '2023', revenue: 27800, grossProfit: 11800, operatingIncome: 7100, netIncome: 5100, eps: 136 },
      { period: '2024', revenue: 31200, grossProfit: 13300, operatingIncome: 8050, netIncome: 5800, eps: 155 },
      { period: 'TTM', revenue: 34500, grossProfit: 14700, operatingIncome: 8900, netIncome: 6450, eps: 172 },
    ],
    balanceSheet: [
      { period: '2022', cash: 5200, totalAssets: 48000, totalDebt: 12000, totalEquity: 28000, debtToEquity: 0.43 },
      { period: '2023', cash: 6100, totalAssets: 53500, totalDebt: 13200, totalEquity: 31500, debtToEquity: 0.42 },
      { period: '2024', cash: 7200, totalAssets: 59800, totalDebt: 14500, totalEquity: 35800, debtToEquity: 0.40 },
      { period: 'TTM', cash: 8400, totalAssets: 66000, totalDebt: 15600, totalEquity: 40200, debtToEquity: 0.39 },
    ],
    cashFlow: [
      { period: '2022', operatingCashFlow: 5800, capex: 1800, freeCashFlow: 4000 },
      { period: '2023', operatingCashFlow: 6600, capex: 2000, freeCashFlow: 4600 },
      { period: '2024', operatingCashFlow: 7400, capex: 2200, freeCashFlow: 5200 },
      { period: 'TTM', operatingCashFlow: 8300, capex: 2450, freeCashFlow: 5850 },
    ],
  };
}
