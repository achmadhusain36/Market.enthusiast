import { CandleData } from '../types';

// Calculate SMA (Simple Moving Average)
export function calculateSMA(data: CandleData[], length: number): (number | null)[] {
  const result: (number | null)[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < length - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < length; j++) {
        sum += data[i - j].close;
      }
      result.push(sum / length);
    }
  }
  return result;
}

// Calculate EMA (Exponential Moving Average)
export function calculateEMA(data: CandleData[], length: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (length + 1);
  let prevEMA: number | null = null;

  for (let i = 0; i < data.length; i++) {
    if (i < length - 1) {
      result.push(null);
    } else if (i === length - 1) {
      // First EMA is SMA
      let sum = 0;
      for (let j = 0; j < length; j++) {
        sum += data[i - j].close;
      }
      prevEMA = sum / length;
      result.push(prevEMA);
    } else {
      const currentClose = data[i].close;
      const currentEMA = currentClose * k + (prevEMA as number) * (1 - k);
      prevEMA = currentEMA;
      result.push(currentEMA);
    }
  }
  return result;
}

// Calculate Bollinger Bands (20, 2)
export function calculateBollingerBands(
  data: CandleData[],
  length: number = 20,
  multiplier: number = 2
): {
  upper: (number | null)[];
  middle: (number | null)[];
  lower: (number | null)[];
} {
  const middle = calculateSMA(data, length);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    const mid = middle[i];
    if (mid === null || i < length - 1) {
      upper.push(null);
      lower.push(null);
    } else {
      let varianceSum = 0;
      for (let j = 0; j < length; j++) {
        const diff = data[i - j].close - mid;
        varianceSum += diff * diff;
      }
      const stdDev = Math.sqrt(varianceSum / length);
      upper.push(mid + multiplier * stdDev);
      lower.push(mid - multiplier * stdDev);
    }
  }

  return { upper, middle, lower };
}

// Calculate RSI (Relative Strength Index 14)
export function calculateRSI(data: CandleData[], length: number = 14): (number | null)[] {
  const result: (number | null)[] = [];
  if (data.length < length + 1) {
    return data.map(() => null);
  }

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= length; i++) {
    const diff = data[i].close - data[i - 1].close;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / length;
  let avgLoss = losses / length;

  for (let i = 0; i < data.length; i++) {
    if (i < length) {
      result.push(null);
    } else if (i === length) {
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push(100 - 100 / (1 + rs));
    } else {
      const diff = data[i].close - data[i - 1].close;
      const gain = diff > 0 ? diff : 0;
      const loss = diff < 0 ? -diff : 0;

      avgGain = (avgGain * (length - 1) + gain) / length;
      avgLoss = (avgLoss * (length - 1) + loss) / length;

      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push(100 - 100 / (1 + rs));
    }
  }

  return result;
}

// Calculate MACD (12, 26, 9)
export function calculateMACD(
  data: CandleData[],
  fastLen: number = 12,
  slowLen: number = 26,
  signalLen: number = 9
): {
  macdLine: (number | null)[];
  signalLine: (number | null)[];
  histogram: (number | null)[];
} {
  const fastEMA = calculateEMA(data, fastLen);
  const slowEMA = calculateEMA(data, slowLen);
  const macdLine: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    const f = fastEMA[i];
    const s = slowEMA[i];
    if (f !== null && s !== null) {
      macdLine.push(f - s);
    } else {
      macdLine.push(null);
    }
  }

  // Calculate Signal Line (EMA 9 of MACD line)
  const signalLine: (number | null)[] = [];
  const k = 2 / (signalLen + 1);
  let prevSignal: number | null = null;
  let validCount = 0;
  let sumFirst = 0;

  for (let i = 0; i < macdLine.length; i++) {
    const val = macdLine[i];
    if (val === null) {
      signalLine.push(null);
    } else {
      validCount++;
      if (validCount < signalLen) {
        sumFirst += val;
        signalLine.push(null);
      } else if (validCount === signalLen) {
        sumFirst += val;
        prevSignal = sumFirst / signalLen;
        signalLine.push(prevSignal);
      } else {
        const currentSig = val * k + (prevSignal as number) * (1 - k);
        prevSignal = currentSig;
        signalLine.push(currentSig);
      }
    }
  }

  const histogram: (number | null)[] = [];
  for (let i = 0; i < macdLine.length; i++) {
    const m = macdLine[i];
    const s = signalLine[i];
    if (m !== null && s !== null) {
      histogram.push(m - s);
    } else {
      histogram.push(null);
    }
  }

  return { macdLine, signalLine, histogram };
}

// Calculate Heikin Ashi Candles
export function calculateHeikinAshi(candles: CandleData[]): CandleData[] {
  if (!candles.length) return [];
  const haCandles: CandleData[] = [];

  for (let i = 0; i < candles.length; i++) {
    const c = candles[i];
    const haClose = (c.open + c.high + c.low + c.close) / 4;
    let haOpen = i === 0 ? (c.open + c.close) / 2 : (haCandles[i - 1].open + haCandles[i - 1].close) / 2;
    const haHigh = Math.max(c.high, haOpen, haClose);
    const haLow = Math.min(c.low, haOpen, haClose);

    haCandles.push({
      ...c,
      open: haOpen,
      high: haHigh,
      low: haLow,
      close: haClose,
    });
  }

  return haCandles;
}
