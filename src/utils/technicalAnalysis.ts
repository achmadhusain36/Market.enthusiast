import { CandleData } from '../types';

// ==========================================
// 1. Moving Averages
// ==========================================

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

export function calculateEMA(data: CandleData[], length: number): (number | null)[] {
  const result: (number | null)[] = [];
  const k = 2 / (length + 1);
  let prevEMA: number | null = null;

  for (let i = 0; i < data.length; i++) {
    if (i < length - 1) {
      result.push(null);
    } else if (i === length - 1) {
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

export function calculateWMA(data: CandleData[], length: number): (number | null)[] {
  const result: (number | null)[] = [];
  const weightSum = (length * (length + 1)) / 2;

  for (let i = 0; i < data.length; i++) {
    if (i < length - 1) {
      result.push(null);
    } else {
      let weightedTotal = 0;
      for (let j = 0; j < length; j++) {
        const weight = length - j;
        weightedTotal += data[i - j].close * weight;
      }
      result.push(weightedTotal / weightSum);
    }
  }
  return result;
}

// ==========================================
// 2. Volatility Bands (Bollinger Bands)
// ==========================================

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

// ==========================================
// 3. Momentum Oscillators (RSI & MACD)
// ==========================================

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

// ==========================================
// 4. ATR (Average True Range)
// ==========================================

export function calculateATR(data: CandleData[], length: number = 14): (number | null)[] {
  const result: (number | null)[] = [];
  if (data.length === 0) return result;

  const trueRanges: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      trueRanges.push(data[i].high - data[i].low);
    } else {
      const tr1 = data[i].high - data[i].low;
      const tr2 = Math.abs(data[i].high - data[i - 1].close);
      const tr3 = Math.abs(data[i].low - data[i - 1].close);
      trueRanges.push(Math.max(tr1, tr2, tr3));
    }
  }

  let prevATR = 0;
  for (let i = 0; i < data.length; i++) {
    if (i < length - 1) {
      result.push(null);
    } else if (i === length - 1) {
      let sum = 0;
      for (let j = 0; j < length; j++) sum += trueRanges[j];
      prevATR = sum / length;
      result.push(prevATR);
    } else {
      const currentATR = (prevATR * (length - 1) + trueRanges[i]) / length;
      prevATR = currentATR;
      result.push(currentATR);
    }
  }

  return result;
}

// ==========================================
// 5. Supertrend Indicator (10, 3)
// ==========================================

export interface SupertrendResult {
  supertrend: (number | null)[];
  direction: (1 | -1 | null)[]; // +1 = Bullish (green), -1 = Bearish (red)
  upperBand: (number | null)[];
  lowerBand: (number | null)[];
}

export function calculateSupertrend(
  data: CandleData[],
  period: number = 10,
  multiplier: number = 3
): SupertrendResult {
  const atr = calculateATR(data, period);
  const upperBand: (number | null)[] = [];
  const lowerBand: (number | null)[] = [];
  const supertrend: (number | null)[] = [];
  const direction: (1 | -1 | null)[] = [];

  let prevUpper = 0;
  let prevLower = 0;
  let prevTrend: 1 | -1 = 1;

  for (let i = 0; i < data.length; i++) {
    const curAtr = atr[i];
    if (curAtr === null || i < period) {
      upperBand.push(null);
      lowerBand.push(null);
      supertrend.push(null);
      direction.push(null);
      continue;
    }

    const hl2 = (data[i].high + data[i].low) / 2;
    let basicUpper = hl2 + multiplier * curAtr;
    let basicLower = hl2 - multiplier * curAtr;

    // Trailing band logic
    let finalUpper = basicUpper;
    let finalLower = basicLower;

    if (i > 0 && upperBand[i - 1] !== null && data[i - 1].close < (upperBand[i - 1] as number)) {
      finalUpper = Math.min(basicUpper, upperBand[i - 1] as number);
    }
    if (i > 0 && lowerBand[i - 1] !== null && data[i - 1].close > (lowerBand[i - 1] as number)) {
      finalLower = Math.max(basicLower, lowerBand[i - 1] as number);
    }

    upperBand.push(finalUpper);
    lowerBand.push(finalLower);

    // Direction flip check
    let curTrend: 1 | -1 = prevTrend;
    if (prevTrend === 1 && data[i].close < finalLower) {
      curTrend = -1;
    } else if (prevTrend === -1 && data[i].close > finalUpper) {
      curTrend = 1;
    }

    prevTrend = curTrend;
    direction.push(curTrend);
    supertrend.push(curTrend === 1 ? finalLower : finalUpper);
  }

  return { supertrend, direction, upperBand, lowerBand };
}

// ==========================================
// 6. VWAP (Volume Weighted Average Price)
// ==========================================

export function calculateVWAP(data: CandleData[]): (number | null)[] {
  const result: (number | null)[] = [];
  let cumVolume = 0;
  let cumTypicalVolume = 0;

  for (let i = 0; i < data.length; i++) {
    const c = data[i];
    const typicalPrice = (c.high + c.low + c.close) / 3;
    const vol = c.volume || 1;

    cumTypicalVolume += typicalPrice * vol;
    cumVolume += vol;

    result.push(cumVolume > 0 ? cumTypicalVolume / cumVolume : typicalPrice);
  }

  return result;
}

// ==========================================
// 7. Stochastic Oscillator (%K, %D)
// ==========================================

export interface StochasticResult {
  k: (number | null)[];
  d: (number | null)[];
}

export function calculateStochastic(
  data: CandleData[],
  kPeriod: number = 14,
  dPeriod: number = 3,
  smooth: number = 3
): StochasticResult {
  const rawK: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < kPeriod - 1) {
      rawK.push(null);
    } else {
      let highestHigh = -Infinity;
      let lowestLow = Infinity;
      for (let j = 0; j < kPeriod; j++) {
        if (data[i - j].high > highestHigh) highestHigh = data[i - j].high;
        if (data[i - j].low < lowestLow) lowestLow = data[i - j].low;
      }
      const range = highestHigh - lowestLow;
      const kVal = range === 0 ? 50 : ((data[i].close - lowestLow) / range) * 100;
      rawK.push(kVal);
    }
  }

  // Smooth %K
  const smoothedK: (number | null)[] = [];
  for (let i = 0; i < rawK.length; i++) {
    if (i < kPeriod - 1 + smooth - 1) {
      smoothedK.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < smooth; j++) {
        sum += (rawK[i - j] as number) || 50;
      }
      smoothedK.push(sum / smooth);
    }
  }

  // Compute %D as SMA of %K
  const d: (number | null)[] = [];
  for (let i = 0; i < smoothedK.length; i++) {
    if (smoothedK[i] === null || i < kPeriod - 1 + smooth - 1 + dPeriod - 1) {
      d.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < dPeriod; j++) {
        sum += (smoothedK[i - j] as number) || 50;
      }
      d.push(sum / dPeriod);
    }
  }

  return { k: smoothedK, d };
}

// ==========================================
// 8. Ichimoku Cloud (9, 26, 52)
// ==========================================

export interface IchimokuResult {
  tenkan: (number | null)[];   // Conversion Line (9)
  kijun: (number | null)[];    // Base Line (26)
  senkouA: (number | null)[];  // Leading Span A (ahead 26)
  senkouB: (number | null)[];  // Leading Span B (52, ahead 26)
  chikou: (number | null)[];   // Lagging Span (lagging 26)
}

function getHL2ForPeriod(data: CandleData[], endIdx: number, period: number): number | null {
  if (endIdx < period - 1) return null;
  let highest = -Infinity;
  let lowest = Infinity;
  for (let j = 0; j < period; j++) {
    const c = data[endIdx - j];
    if (c.high > highest) highest = c.high;
    if (c.low < lowest) lowest = c.low;
  }
  return (highest + lowest) / 2;
}

export function calculateIchimoku(
  data: CandleData[],
  tenkanLen: number = 9,
  kijunLen: number = 26,
  senkouBLen: number = 52
): IchimokuResult {
  const tenkan: (number | null)[] = [];
  const kijun: (number | null)[] = [];
  const senkouA: (number | null)[] = [];
  const senkouB: (number | null)[] = [];
  const chikou: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    const t = getHL2ForPeriod(data, i, tenkanLen);
    const k = getHL2ForPeriod(data, i, kijunLen);
    const sb = getHL2ForPeriod(data, i, senkouBLen);

    tenkan.push(t);
    kijun.push(k);
    senkouA.push(t !== null && k !== null ? (t + k) / 2 : null);
    senkouB.push(sb);

    // Chikou is close shifted backward 26
    chikou.push(data[i].close);
  }

  return { tenkan, kijun, senkouA, senkouB, chikou };
}

// ==========================================
// 9. ADX (Average Directional Index)
// ==========================================

export interface ADXResult {
  adx: (number | null)[];
  plusDI: (number | null)[];
  minusDI: (number | null)[];
}

export function calculateADX(data: CandleData[], length: number = 14): ADXResult {
  const adx: (number | null)[] = [];
  const plusDI: (number | null)[] = [];
  const minusDI: (number | null)[] = [];

  if (data.length < length * 2) {
    return {
      adx: data.map(() => null),
      plusDI: data.map(() => null),
      minusDI: data.map(() => null),
    };
  }

  const tr: number[] = [];
  const plusDM: number[] = [];
  const minusDM: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      tr.push(data[i].high - data[i].low);
      plusDM.push(0);
      minusDM.push(0);
    } else {
      const upMove = data[i].high - data[i - 1].high;
      const downMove = data[i - 1].low - data[i].low;

      plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
      minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);

      const tr1 = data[i].high - data[i].low;
      const tr2 = Math.abs(data[i].high - data[i - 1].close);
      const tr3 = Math.abs(data[i].low - data[i - 1].close);
      tr.push(Math.max(tr1, tr2, tr3));
    }
  }

  // Smooth TR, +DM, -DM
  let smoothTR = tr.slice(0, length).reduce((a, b) => a + b, 0);
  let smoothPlusDM = plusDM.slice(0, length).reduce((a, b) => a + b, 0);
  let smoothMinusDM = minusDM.slice(0, length).reduce((a, b) => a + b, 0);

  const dxValues: number[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < length - 1) {
      plusDI.push(null);
      minusDI.push(null);
      adx.push(null);
    } else if (i === length - 1) {
      const pDI = smoothTR === 0 ? 0 : (smoothPlusDM / smoothTR) * 100;
      const mDI = smoothTR === 0 ? 0 : (smoothMinusDM / smoothTR) * 100;
      plusDI.push(pDI);
      minusDI.push(mDI);
      const sum = pDI + mDI;
      dxValues.push(sum === 0 ? 0 : (Math.abs(pDI - mDI) / sum) * 100);
      adx.push(null);
    } else {
      smoothTR = smoothTR - smoothTR / length + tr[i];
      smoothPlusDM = smoothPlusDM - smoothPlusDM / length + plusDM[i];
      smoothMinusDM = smoothMinusDM - smoothMinusDM / length + minusDM[i];

      const pDI = smoothTR === 0 ? 0 : (smoothPlusDM / smoothTR) * 100;
      const mDI = smoothTR === 0 ? 0 : (smoothMinusDM / smoothTR) * 100;
      plusDI.push(pDI);
      minusDI.push(mDI);

      const sum = pDI + mDI;
      const dx = sum === 0 ? 0 : (Math.abs(pDI - mDI) / sum) * 100;
      dxValues.push(dx);

      if (dxValues.length < length) {
        adx.push(null);
      } else if (dxValues.length === length) {
        const adxInit = dxValues.reduce((a, b) => a + b, 0) / length;
        adx.push(adxInit);
      } else {
        const prevADX = adx[i - 1] as number;
        const curADX = (prevADX * (length - 1) + dx) / length;
        adx.push(curADX);
      }
    }
  }

  return { adx, plusDI, minusDI };
}

// ==========================================
// 10. CCI (Commodity Channel Index)
// ==========================================

export function calculateCCI(data: CandleData[], length: number = 20): (number | null)[] {
  const result: (number | null)[] = [];
  const tpList = data.map((c) => (c.high + c.low + c.close) / 3);

  for (let i = 0; i < data.length; i++) {
    if (i < length - 1) {
      result.push(null);
    } else {
      let sum = 0;
      for (let j = 0; j < length; j++) sum += tpList[i - j];
      const smaTP = sum / length;

      let meanDevSum = 0;
      for (let j = 0; j < length; j++) {
        meanDevSum += Math.abs(tpList[i - j] - smaTP);
      }
      const meanDev = meanDevSum / length;
      const cci = meanDev === 0 ? 0 : (tpList[i] - smaTP) / (0.015 * meanDev);
      result.push(cci);
    }
  }

  return result;
}

// ==========================================
// 11. OBV (On Balance Volume)
// ==========================================

export function calculateOBV(data: CandleData[]): (number | null)[] {
  const result: (number | null)[] = [];
  let obv = 0;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      obv = data[i].volume;
    } else {
      if (data[i].close > data[i - 1].close) {
        obv += data[i].volume;
      } else if (data[i].close < data[i - 1].close) {
        obv -= data[i].volume;
      }
    }
    result.push(obv);
  }

  return result;
}

// ==========================================
// 12. Parabolic SAR
// ==========================================

export function calculateParabolicSAR(
  data: CandleData[],
  step: number = 0.02,
  maxStep: number = 0.2
): (number | null)[] {
  const result: (number | null)[] = [];
  if (data.length < 2) return data.map(() => null);

  let isRising = data[1].close > data[0].close;
  let ep = isRising ? data[0].high : data[0].low;
  let sar = isRising ? data[0].low : data[0].high;
  let af = step;

  result.push(sar);

  for (let i = 1; i < data.length; i++) {
    if (isRising) {
      sar = sar + af * (ep - sar);
      if (data[i].low < sar) {
        isRising = false;
        sar = ep;
        af = step;
        ep = data[i].low;
      } else {
        if (data[i].high > ep) {
          ep = data[i].high;
          af = Math.min(af + step, maxStep);
        }
      }
    } else {
      sar = sar - af * (sar - ep);
      if (data[i].high > sar) {
        isRising = true;
        sar = ep;
        af = step;
        ep = data[i].high;
      } else {
        if (data[i].low < ep) {
          ep = data[i].low;
          af = Math.min(af + step, maxStep);
        }
      }
    }
    result.push(sar);
  }

  return result;
}

// ==========================================
// 13. Williams %R
// ==========================================

export function calculateWilliamsR(data: CandleData[], length: number = 14): (number | null)[] {
  const result: (number | null)[] = [];

  for (let i = 0; i < data.length; i++) {
    if (i < length - 1) {
      result.push(null);
    } else {
      let highestHigh = -Infinity;
      let lowestLow = Infinity;
      for (let j = 0; j < length; j++) {
        if (data[i - j].high > highestHigh) highestHigh = data[i - j].high;
        if (data[i - j].low < lowestLow) lowestLow = data[i - j].low;
      }
      const range = highestHigh - lowestLow;
      const wr = range === 0 ? -50 : ((highestHigh - data[i].close) / range) * -100;
      result.push(wr);
    }
  }

  return result;
}

// ==========================================
// 14. Heikin Ashi Candles
// ==========================================

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
