import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Camera,
  Code,
  Maximize2,
  Minimize2,
  ExternalLink,
  Plus,
  CandlestickChart,
  LineChart,
  Check,
} from 'lucide-react';
import { StockQuote, CandleData, Timeframe, ChartType, CurrencyType, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { COMPARISON_INDICES } from '../data/mockStocks';

interface StockChartProps {
  stock: StockQuote;
  candles: CandleData[];
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  selectedCurrency: CurrencyType;
  onOpenTrade: (stock: StockQuote, action: 'BUY' | 'SELL') => void;
  language: Language;
}

export const StockChart: React.FC<StockChartProps> = ({
  stock,
  candles,
  timeframe,
  onTimeframeChange,
  selectedCurrency,
  onOpenTrade,
  language,
}) => {
  const t = TRANSLATIONS[language || 'id'];
  const [chartType, setChartType] = useState<ChartType>('area'); // Default to area as in the screenshot!
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [comparedIndices, setComparedIndices] = useState<string[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 460 });

  // Responsive chart resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setDimensions({
            width: entry.contentRect.width,
            height: isFullscreen ? window.innerHeight - 180 : Math.max(380, Math.min(520, entry.contentRect.width * 0.48)),
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isFullscreen]);

  // Compute price bounds
  const { minPrice, maxPrice } = useMemo(() => {
    if (!candles.length) return { minPrice: 6400, maxPrice: 6680 };
    let min = Infinity;
    let max = -Infinity;

    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    });

    const padding = (max - min) * 0.08 || 10;
    return {
      minPrice: Math.max(0, min - padding),
      maxPrice: max + padding,
    };
  }, [candles]);

  const chartPadding = { top: 30, right: 90, bottom: 40, left: 15 };
  const chartWidth = Math.max(100, dimensions.width - chartPadding.left - chartPadding.right);
  const chartHeight = Math.max(100, dimensions.height - chartPadding.top - chartPadding.bottom);
  const priceRange = maxPrice - minPrice || 1;

  const getX = (index: number) => {
    if (candles.length <= 1) return chartPadding.left;
    return chartPadding.left + (index / (candles.length - 1)) * chartWidth;
  };

  const getY = (price: number) => {
    const norm = (price - minPrice) / priceRange;
    return chartPadding.top + (1 - norm) * chartHeight;
  };

  // Fixed 7 ticks for Y-Axis matching TradingView
  const yAxisTicks = useMemo(() => {
    const step = priceRange / 6;
    const ticks: number[] = [];
    for (let i = 0; i <= 6; i++) {
      ticks.push(minPrice + i * step);
    }
    return ticks.reverse();
  }, [minPrice, priceRange]);

  // Build SVG Path for Area Chart (glow line and gradient area)
  const { areaPathD, linePathD } = useMemo(() => {
    if (!candles.length) return { areaPathD: '', linePathD: '' };

    const points = candles.map((c, i) => `${getX(i)},${getY(c.close)}`);
    const linePath = `M ${points.join(' L ')}`;
    const baselineY = chartPadding.top + chartHeight;
    const areaPath = `M ${getX(0)},${baselineY} L ${points.join(' L ')} L ${getX(candles.length - 1)},${baselineY} Z`;

    return { areaPathD: areaPath, linePathD: linePath };
  }, [candles, chartWidth, chartHeight, minPrice, maxPrice]);

  // Mouse move handler for interactive crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    if (x >= chartPadding.left && x <= chartPadding.left + chartWidth && candles.length > 0) {
      const relX = (x - chartPadding.left) / chartWidth;
      const index = Math.min(candles.length - 1, Math.max(0, Math.round(relX * (candles.length - 1))));
      setHoverIndex(index);
    } else {
      setHoverIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setMousePos(null);
  };

  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  // Number formatters for TradingView look
  const formatTV = (val: number, decimals: number = 4) => {
    const locale = language === 'id' ? 'id-ID' : 'en-US';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  };

  const currentPriceFormatted = formatTV(stock.price, stock.price >= 1000 ? 4 : 2);
  const changeFormatted = formatTV(stock.change, 4);
  const isPositive = stock.change >= 0;

  // Timeframe performance metrics (matching screenshot values for COMPOSITE or scaled)
  const timeframeOptions: { tf: Timeframe; label: string; ret: number }[] = [
    { tf: '1D', label: t.tf1D, ret: 0.15 },
    { tf: '5D', label: t.tf5D, ret: -2.14 },
    { tf: '1M', label: t.tf1M, ret: 3.94 },
    { tf: '6M', label: t.tf6M, ret: -7.49 },
    { tf: 'YTD', label: t.tfYTD, ret: -24.57 },
    { tf: '1Y', label: t.tf1Y, ret: -17.06 },
    { tf: '5Y', label: t.tf5Y, ret: 6.83 },
    { tf: '10Y', label: t.tf10Y, ret: 23.74 },
    { tf: 'ALL', label: t.tfALL, ret: 920.60 },
  ];

  const toggleCompare = (id: string) => {
    setComparedIndices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSnapshot = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <div
      id="stock-chart-panel"
      className={`bg-[#0c0f17] border border-[#1e222d] rounded-none sm:rounded-xl flex flex-col overflow-hidden shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'relative'
      }`}
    >
      {/* 1. Top Header Bar (Matching TradingView Screenshot Exactly) */}
      <div className="px-4 py-3 border-b border-[#1e222d] flex flex-wrap items-center justify-between gap-3 bg-[#0c0f17]">
        {/* Symbol Title, Price, and Superchart Link */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Circular Symbol Icon (Red for COMPOSITE / IDX, or branded) */}
          <div className="w-7 h-7 rounded-full bg-[#f23645]/20 border border-[#f23645]/40 flex items-center justify-center text-[#f23645] font-bold text-xs shadow">
            {stock.symbol === 'COMPOSITE' ? (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" />
              </svg>
            ) : (
              stock.symbol.slice(0, 2)
            )}
          </div>

          {/* Symbol Name */}
          <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
            {stock.symbol}
          </span>

          {/* Price with "D" tag and "POINT" */}
          <div className="flex items-baseline gap-1.5 font-mono-num">
            <span className="text-base sm:text-xl font-extrabold text-white tracking-tight">
              {currentPriceFormatted}
            </span>
            <span className="text-[10px] font-black bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded border border-amber-500/30">
              D
            </span>
            <span className="text-[11px] font-bold text-neutral-400 tracking-wider">
              POINT
            </span>
          </div>

          {/* Price Change & Percentage */}
          <div
            className={`flex items-center gap-1.5 font-mono-num text-xs sm:text-sm font-bold ${
              isPositive ? 'text-[#22ab94]' : 'text-[#f23645]'
            }`}
          >
            <span>{isPositive ? '+' : ''}{changeFormatted}</span>
            <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
          </div>

          {/* "Lihat pada chart super" / "See on supercharts" */}
          <button
            onClick={() => setChartType(chartType === 'area' ? 'candlestick' : 'area')}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="group-hover:underline">{t.superChart}</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Right Chart Action Tools (Camera, Embed, Fullscreen, Chart Type Toggle) */}
        <div className="flex items-center gap-1 sm:gap-2 text-neutral-400 text-xs">
          {/* Chart Mode Switch (Area vs Candlestick) */}
          <div className="flex items-center bg-[#1e222d] rounded-lg p-0.5 border border-[#2a2e39] mr-1">
            <button
              onClick={() => setChartType('area')}
              title={t.chartTypeArea}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                chartType === 'area' ? 'bg-[#2a2e39] text-white' : 'hover:text-white'
              }`}
            >
              <LineChart className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <button
              onClick={() => setChartType('candlestick')}
              title={t.chartTypeCandle}
              className={`p-1.5 rounded transition-colors cursor-pointer ${
                chartType === 'candlestick' ? 'bg-[#2a2e39] text-white' : 'hover:text-white'
              }`}
            >
              <CandlestickChart className="w-3.5 h-3.5 text-neutral-300" />
            </button>
          </div>

          {/* Camera Snapshot */}
          <button
            onClick={handleSnapshot}
            title={t.camera}
            className="p-1.5 rounded-lg hover:bg-[#1e222d] hover:text-white transition-colors cursor-pointer relative"
          >
            <Camera className="w-4 h-4" />
            {copiedToast && (
              <span className="absolute -bottom-7 right-0 bg-neutral-900 border border-neutral-700 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-30 animate-in fade-in">
                {language === 'id' ? 'Tautan disalin!' : 'Link copied!'}
              </span>
            )}
          </button>

          {/* Embed code */}
          <button
            onClick={handleSnapshot}
            title={t.embed}
            className="p-1.5 rounded-lg hover:bg-[#1e222d] hover:text-white transition-colors cursor-pointer"
          >
            <Code className="w-4 h-4" />
          </button>

          {/* Full Chart */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-[#1e222d] text-neutral-300 hover:text-white transition-colors cursor-pointer border border-[#2a2e39]"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="text-xs font-semibold hidden md:inline">{t.fullChart}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Chart Canvas & SVG Body */}
      <div
        ref={containerRef}
        className="w-full relative bg-[#0c0f17] select-none flex-1 min-h-[380px]"
        onMouseLeave={handleMouseLeave}
      >
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="w-full h-full cursor-crosshair block"
          onMouseMove={handleMouseMove}
        >
          <defs>
            {/* Emerald Glowing Gradient Under Line */}
            <linearGradient id="tvAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22ab94" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#22ab94" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#22ab94" stopOpacity="0.00" />
            </linearGradient>

            {/* Bearish gradient for candles */}
            <linearGradient id="tvRedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f23645" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f23645" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Background Watermark: 17 TradingView / Market Enthusiast */}
          <g opacity="0.06" transform={`translate(28, ${dimensions.height - 40})`}>
            <text fill="#ffffff" fontSize="26" fontWeight="900" letterSpacing="-1">
              TradingView
            </text>
            <path
              d="M-22 -14 h4 v14 h-4 v-14 zm5 -4 h4 v18 h-4 v-18 zm5 6 h4 v12 h-4 v-12 z"
              fill="#ffffff"
            />
          </g>

          {/* Horizontal Grid Lines */}
          {yAxisTicks.map((price, i) => {
            const y = getY(price);
            return (
              <g key={`y-grid-${i}`}>
                <line
                  x1={chartPadding.left}
                  y1={y}
                  x2={chartPadding.left + chartWidth}
                  y2={y}
                  stroke="#1b1f2b"
                  strokeWidth="1"
                  strokeDasharray="2 4"
                />
              </g>
            );
          })}

          {/* Current Price Dashed Reference Line across chart */}
          <line
            x1={chartPadding.left}
            y1={getY(stock.price)}
            x2={chartPadding.left + chartWidth}
            y2={getY(stock.price)}
            stroke="#22ab94"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.85"
          />

          {/* Main Chart Graphic: AREA or CANDLESTICK */}
          {chartType === 'area' ? (
            <g>
              {/* Area Gradient Fill */}
              <path d={areaPathD} fill="url(#tvAreaGradient)" />

              {/* Glowing Outline Stroke */}
              <path
                d={linePathD}
                fill="none"
                stroke="#22ab94"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Pulsing Dot at current live tick */}
              {candles.length > 0 && (
                <circle
                  cx={getX(candles.length - 1)}
                  cy={getY(stock.price)}
                  r="4"
                  fill="#22ab94"
                  className="animate-ping opacity-75"
                />
              )}
              {candles.length > 0 && (
                <circle
                  cx={getX(candles.length - 1)}
                  cy={getY(stock.price)}
                  r="3"
                  fill="#ffffff"
                  stroke="#22ab94"
                  strokeWidth="2"
                />
              )}
            </g>
          ) : (
            /* Candlestick Graphic */
            <g>
              {candles.map((c, i) => {
                const x = getX(i);
                const isBull = c.close >= c.open;
                const candleColor = isBull ? '#22ab94' : '#f23645';
                const yHigh = getY(c.high);
                const yLow = getY(c.low);
                const yOpen = getY(c.open);
                const yClose = getY(c.close);
                const topY = Math.min(yOpen, yClose);
                const bodyH = Math.max(1.5, Math.abs(yOpen - yClose));
                const candleWidth = Math.max(2.5, Math.min(10, (chartWidth / candles.length) * 0.7));

                return (
                  <g key={`candle-${i}`}>
                    {/* Wick */}
                    <line
                      x1={x}
                      y1={yHigh}
                      x2={x}
                      y2={yLow}
                      stroke={candleColor}
                      strokeWidth="1"
                    />
                    {/* Body */}
                    <rect
                      x={x - candleWidth / 2}
                      y={topY}
                      width={candleWidth}
                      height={bodyH}
                      fill={isBull ? candleColor : candleColor}
                      rx="0.5"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Interactive Crosshair (Tracking mouse position) */}
          {hoverIndex !== null && mousePos && (
            <g>
              {/* Vertical Crosshair Line */}
              <line
                x1={getX(hoverIndex)}
                y1={chartPadding.top}
                x2={getX(hoverIndex)}
                y2={chartPadding.top + chartHeight}
                stroke="#6b7280"
                strokeWidth="1"
                strokeDasharray="2 3"
              />

              {/* Horizontal Crosshair Line */}
              <line
                x1={chartPadding.left}
                y1={mousePos.y}
                x2={chartPadding.left + chartWidth}
                y2={mousePos.y}
                stroke="#6b7280"
                strokeWidth="1"
                strokeDasharray="2 3"
              />

              {/* Dot on price curve at hover index */}
              {activeCandle && (
                <circle
                  cx={getX(hoverIndex)}
                  cy={getY(activeCandle.close)}
                  r="4"
                  fill="#ffffff"
                  stroke="#22ab94"
                  strokeWidth="2"
                />
              )}
            </g>
          )}

          {/* Right Y-Axis Price Scales */}
          <g>
            {yAxisTicks.map((price, i) => {
              const y = getY(price);
              return (
                <text
                  key={`y-tick-${i}`}
                  x={chartPadding.left + chartWidth + 10}
                  y={y + 4}
                  fill="#787b86"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="500"
                >
                  {formatTV(price, price >= 1000 ? 4 : 2)}
                </text>
              );
            })}

            {/* Current Price Active Highlight Tag on Right Y-axis (Teal/Cyan Box) */}
            <g transform={`translate(${chartPadding.left + chartWidth + 4}, ${getY(stock.price) - 10})`}>
              <rect
                width={chartPadding.right - 8}
                height="20"
                rx="3"
                fill="#22ab94"
              />
              <text
                x="4"
                y="14"
                fill="#ffffff"
                fontSize="11"
                fontWeight="700"
                fontFamily="JetBrains Mono, monospace"
              >
                {formatTV(stock.price, stock.price >= 1000 ? 4 : 2)}
              </text>
            </g>
          </g>

          {/* X-Axis Date Ticks (Matching Screenshot dates: 19, 21, 26, 28, Sep, 3, 7, 9, 11, 15) */}
          <g>
            {candles.map((c, i) => {
              // Show label every ~6 bars
              if (i % 6 !== 0 && i !== candles.length - 1) return null;
              const x = getX(i);
              return (
                <text
                  key={`x-label-${i}`}
                  x={x}
                  y={chartPadding.top + chartHeight + 20}
                  textAnchor="middle"
                  fill="#787b86"
                  fontSize="11"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="500"
                >
                  {c.time}
                </text>
              );
            })}
          </g>
        </svg>

        {/* Floating Tooltip matching TradingView Screenshot: 6.633,8780 | 07 Sep '26 11:00 UTC+7 */}
        {hoverIndex !== null && activeCandle && (
          <div
            className="absolute z-20 pointer-events-none bg-[#1e222d]/95 border border-[#2a2e39] text-white px-3 py-2 rounded shadow-2xl backdrop-blur-sm flex flex-col gap-0.5 text-xs font-mono-num animate-in fade-in duration-100"
            style={{
              left: Math.min(dimensions.width - 160, Math.max(20, getX(hoverIndex) - 70)),
              top: Math.max(40, getY(activeCandle.close) + 20),
            }}
          >
            <span className="font-extrabold text-sm text-white">
              {formatTV(activeCandle.close, 4)}
            </span>
            <span className="text-[10px] text-neutral-400">
              {activeCandle.time} • UTC+7
            </span>
          </div>
        )}
      </div>

      {/* 3. Timeframe Pills Row (Directly below chart, matching screenshot) */}
      <div className="border-t border-[#1e222d] bg-[#0c0f17] px-3 py-2 flex items-center justify-between overflow-x-auto gap-1">
        <div className="flex items-center gap-1 sm:gap-2">
          {timeframeOptions.map((item) => {
            const isActive = timeframe === item.tf;
            const isPos = item.ret >= 0;
            return (
              <button
                key={item.tf}
                onClick={() => onTimeframeChange(item.tf)}
                className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-lg transition-all cursor-pointer font-sans ${
                  isActive
                    ? 'bg-[#2a2e39] text-white shadow-inner'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#1e222d]/60'
                }`}
              >
                <span className="text-xs font-semibold whitespace-nowrap">{item.label}</span>
                <span
                  className={`text-[10px] font-mono-num font-bold whitespace-nowrap ${
                    isPos ? 'text-[#22ab94]' : 'text-[#f23645]'
                  }`}
                >
                  {isPos ? '' : ''}{formatTV(item.ret, 2)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Comparison Section: "Bandingkan dengan Indeks Harga Saham Gabungan IDX" */}
      <div className="border-t border-[#1e222d] bg-[#090c14] p-4 space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
          {t.compareWith}
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COMPARISON_INDICES.map((idx) => {
            const isAdded = comparedIndices.includes(idx.id);
            return (
              <div
                key={idx.id}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  isAdded
                    ? 'bg-[#182030] border-emerald-500/50'
                    : 'bg-[#131722] border-[#222735] hover:border-[#32394c]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Badge */}
                  {idx.type === 'flag' ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-900/40 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs shrink-0">
                      ★
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-red-900/40 border border-red-500/40 flex items-center justify-center text-red-400 font-bold text-[10px] shrink-0 font-mono-num">
                      {idx.number}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white tracking-tight truncate">
                        {idx.name}
                      </span>
                      <span className="text-[9px] font-bold text-amber-400 bg-amber-500/20 px-1 rounded">
                        D
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate">
                      {idx.fullName}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => toggleCompare(idx.id)}
                  title={isAdded ? 'Hapus perbandingan' : 'Tambah ke perbandingan'}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#1e2330] hover:bg-[#282f42] text-neutral-300'
                  }`}
                >
                  {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
