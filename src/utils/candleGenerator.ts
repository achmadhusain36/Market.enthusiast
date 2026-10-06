import { CandleData, Timeframe } from '../types';

/**
 * Seeded PRNG using mulberry32.
 * Produces deterministic, high-quality pseudo-random numbers in [0, 1)
 */
function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Hash string to 32-bit integer for PRNG seed
 */
function hashString(str: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

interface TimeframeConfig {
  bars: number;
  barDurationMs: number;
  volatilityMult: number;
  format: 'time' | 'dateTime' | 'date';
}

const TIMEFRAME_CONFIGS: Record<Timeframe, TimeframeConfig> = {
  '1s': { bars: 60, barDurationMs: 1000, volatilityMult: 0.0008, format: 'time' },
  '5s': { bars: 60, barDurationMs: 5000, volatilityMult: 0.0015, format: 'time' },
  '15s': { bars: 60, barDurationMs: 15000, volatilityMult: 0.0025, format: 'time' },
  '1m': { bars: 60, barDurationMs: 60000, volatilityMult: 0.004, format: 'time' },
  '3m': { bars: 60, barDurationMs: 180000, volatilityMult: 0.006, format: 'time' },
  '5m': { bars: 60, barDurationMs: 300000, volatilityMult: 0.008, format: 'time' },
  '15m': { bars: 60, barDurationMs: 900000, volatilityMult: 0.012, format: 'dateTime' },
  '30m': { bars: 60, barDurationMs: 1800000, volatilityMult: 0.016, format: 'dateTime' },
  '1H': { bars: 65, barDurationMs: 3600000, volatilityMult: 0.022, format: 'dateTime' },
  '2H': { bars: 65, barDurationMs: 7200000, volatilityMult: 0.028, format: 'dateTime' },
  '4H': { bars: 70, barDurationMs: 14400000, volatilityMult: 0.038, format: 'dateTime' },
  '1D': { bars: 75, barDurationMs: 86400000, volatilityMult: 0.05, format: 'date' },
  '5D': { bars: 75, barDurationMs: 86400000 * 5, volatilityMult: 0.09, format: 'date' },
  '1W': { bars: 80, barDurationMs: 86400000 * 7, volatilityMult: 0.12, format: 'date' },
  '1M': { bars: 80, barDurationMs: 86400000 * 30, volatilityMult: 0.18, format: 'date' },
  '6M': { bars: 85, barDurationMs: 86400000 * 180, volatilityMult: 0.28, format: 'date' },
  'YTD': { bars: 90, barDurationMs: 86400000 * 270, volatilityMult: 0.32, format: 'date' },
  '1Y': { bars: 90, barDurationMs: 86400000 * 365, volatilityMult: 0.38, format: 'date' },
  '5Y': { bars: 95, barDurationMs: 86400000 * 365 * 5, volatilityMult: 0.65, format: 'date' },
  '10Y': { bars: 100, barDurationMs: 86400000 * 365 * 10, volatilityMult: 0.95, format: 'date' },
  'ALL': { bars: 110, barDurationMs: 86400000 * 365 * 15, volatilityMult: 1.20, format: 'date' },
};

function formatTimestamp(timestamp: number, format: 'time' | 'dateTime' | 'date'): string {
  const d = new Date(timestamp);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  const day = pad(d.getDate());
  const month = d.toLocaleString('en-US', { month: 'short' });
  const year = d.getFullYear();

  if (format === 'time') {
    return `${hours}:${minutes}:${seconds}`;
  } else if (format === 'dateTime') {
    return `${day} ${month} ${hours}:${minutes}`;
  } else {
    return `${day} ${month} '${year.toString().slice(-2)}`;
  }
}

/**
 * Generate a consistent, deterministic candle history for any asset symbol & timeframe.
 * If called with the same (symbol, timeframe), it produces the exact same historical series.
 */
export function generateSeededCandles(
  symbol: string,
  currentPrice: number,
  timeframe: Timeframe,
  targetDecimals?: number
): CandleData[] {
  const config = TIMEFRAME_CONFIGS[timeframe] || TIMEFRAME_CONFIGS['1D'];
  const decimals = targetDecimals !== undefined ? targetDecimals : currentPrice >= 500 ? 0 : currentPrice >= 1 ? 2 : 4;
  const round = (num: number) => Number(num.toFixed(decimals));

  // Deterministik seed berdasarkan simbol dan timeframe
  const seed = hashString(`${symbol.toUpperCase()}__${timeframe}__2026`);
  const prng = createPRNG(seed);

  const count = config.bars;
  const barMs = config.barDurationMs;
  const now = Math.floor(Date.now() / barMs) * barMs; // Snap to bar boundary

  // Generate a random-walk trajectory ending at currentPrice
  const deltas: number[] = [];
  const baseStepVol = (currentPrice * config.volatilityMult) / Math.sqrt(count);

  let cumulativeWalk = 0;
  for (let i = 0; i < count; i++) {
    // Box-Muller normal distribution approximation via 6 uniform values
    let norm = (prng() + prng() + prng() + prng() + prng() + prng() - 3) / 1.5;
    // Add mild cyclical momentum
    const cycle = Math.sin((i / count) * Math.PI * 4) * 0.3;
    const delta = (norm + cycle) * baseStepVol;
    deltas.push(delta);
    cumulativeWalk += delta;
  }

  // Work backwards from currentPrice so the final candle matches current market price
  const closePrices = new Array<number>(count);
  closePrices[count - 1] = currentPrice;
  for (let i = count - 2; i >= 0; i--) {
    const rawPrev = closePrices[i + 1] - deltas[i + 1];
    closePrices[i] = Math.max(currentPrice * 0.2, rawPrev);
  }

  const candles: CandleData[] = [];

  for (let i = 0; i < count; i++) {
    const barTimestamp = now - (count - 1 - i) * barMs;
    const close = i === count - 1 ? currentPrice : closePrices[i];
    const prevClose = i > 0 ? closePrices[i - 1] : close * (1 - (prng() - 0.5) * 0.005);
    const open = i === 0 ? prevClose : prevClose;

    const barRange = Math.abs(close - open);
    const wickExpansion = baseStepVol * (0.3 + prng() * 0.8);
    const high = Math.max(open, close) + wickExpansion * (0.2 + prng() * 0.8);
    const low = Math.max(currentPrice * 0.1, Math.min(open, close) - wickExpansion * (0.2 + prng() * 0.8));

    // Realistic volume with spikes on high-range bars
    const baseVol = currentPrice > 1000 ? 50000 : 500000;
    const volMultiplier = 1 + (barRange / (baseStepVol || 1)) * 1.5 + prng() * 1.2;
    const volume = Math.floor(baseVol * volMultiplier);

    candles.push({
      time: formatTimestamp(barTimestamp, config.format),
      timestamp: barTimestamp,
      open: round(open),
      high: round(high),
      low: round(low),
      close: round(close),
      volume,
    });
  }

  // Calculate standard MA20 & MA50 overlays
  for (let i = 0; i < candles.length; i++) {
    if (i >= 19) {
      let sum20 = 0;
      for (let j = 0; j < 20; j++) sum20 += candles[i - j].close;
      candles[i].ma20 = round(sum20 / 20);
    }
    if (i >= 49) {
      let sum50 = 0;
      for (let j = 0; j < 50; j++) sum50 += candles[i - j].close;
      candles[i].ma50 = round(sum50 / 50);
    }
  }

  return candles;
}

/**
 * Updates the latest candle with a live tick or forms a new bar if the interval elapsed.
 */
export function updateCandlesWithLiveTick(
  prevCandles: CandleData[],
  newPrice: number,
  timeframe: Timeframe,
  decimals: number = 2
): CandleData[] {
  if (!prevCandles.length) return prevCandles;

  const config = TIMEFRAME_CONFIGS[timeframe] || TIMEFRAME_CONFIGS['1D'];
  const barMs = config.barDurationMs;
  const now = Date.now();

  const lastCandle = prevCandles[prevCandles.length - 1];
  const isNewBar = now - lastCandle.timestamp >= barMs;

  const round = (num: number) => Number(num.toFixed(decimals));

  if (isNewBar) {
    const newBarTimestamp = lastCandle.timestamp + barMs;
    const newBar: CandleData = {
      time: formatTimestamp(newBarTimestamp, config.format),
      timestamp: newBarTimestamp,
      open: lastCandle.close,
      high: Math.max(lastCandle.close, newPrice),
      low: Math.min(lastCandle.close, newPrice),
      close: round(newPrice),
      volume: Math.floor(Math.random() * 5000 + 1000),
    };
    return [...prevCandles.slice(1), newBar];
  } else {
    const updatedLast: CandleData = {
      ...lastCandle,
      high: round(Math.max(lastCandle.high, newPrice)),
      low: round(Math.min(lastCandle.low, newPrice)),
      close: round(newPrice),
      volume: lastCandle.volume + Math.floor(Math.random() * 300 + 50),
    };
    return [...prevCandles.slice(0, -1), updatedLast];
  }
}
