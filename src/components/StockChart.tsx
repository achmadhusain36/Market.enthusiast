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
  Play,
  Pause,
  RotateCcw,
  FastForward,
  SkipForward,
  Square,
  Activity,
  Layers,
  Bell,
  Eye,
  EyeOff,
  Trash2,
  Lock,
  Unlock,
  Settings2,
  Sliders,
  Sparkles,
  ChevronDown,
  LayoutGrid,
  Columns2,
  Rows2,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Percent,
  BarChart3,
  FileSpreadsheet,
  X,
  Type,
  Maximize,
  Undo2,
  Redo2,
  ArrowRight,
  GitBranch,
} from 'lucide-react';
import {
  StockQuote,
  CandleData,
  Timeframe,
  ChartType,
  CurrencyType,
  Language,
  DrawingToolType,
  DrawingObject,
  TechnicalIndicator,
  MultiChartLayout,
} from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { COMPARISON_INDICES } from '../data/mockStocks';
import { MarketLogo, StockCompanyLogo } from './MarketLogo';
import {
  calculateSMA,
  calculateEMA,
  calculateBollingerBands,
  calculateRSI,
  calculateMACD,
  calculateHeikinAshi,
  calculateSupertrend,
  calculateVWAP,
  calculateStochastic,
  calculateATR,
  calculateIchimoku,
  calculateParabolicSAR,
  calculateADX,
  calculateCCI,
  calculateOBV,
  calculateWilliamsR,
} from '../utils/technicalAnalysis';
import { PineExecutionResult } from '../utils/pineScriptEngine';

interface StockChartProps {
  stock: StockQuote;
  candles: CandleData[];
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  selectedCurrency: CurrencyType;
  onOpenTrade: (stock: StockQuote, action: 'BUY' | 'SELL') => void;
  language: Language;
  onOpenAlertModal?: () => void;
  onOpenFundamentalModal?: () => void;
  onOpenIndicatorsModal?: () => void;
  indicators?: TechnicalIndicator[];
  onToggleIndicator?: (id: string) => void;
  onRemoveIndicator?: (id: string) => void;
  onSelectStock?: (symbol: string) => void;
  pineResult?: PineExecutionResult;
}

interface MiniChartPaneProps {
  symbol: string;
  name: string;
  market: 'IDX' | 'NASDAQ' | 'NYSE' | 'GLOBAL';
  currency: 'IDR' | 'USD';
  price: number;
  change: number;
  changePercent: number;
  timeframe: string;
  candles: CandleData[];
  onMaximize: () => void;
  onTrade?: () => void;
  isId: boolean;
}

const MiniChartPane: React.FC<MiniChartPaneProps> = ({
  symbol,
  name,
  market,
  currency,
  price,
  change,
  changePercent,
  timeframe,
  candles,
  onMaximize,
  onTrade,
  isId,
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const isPos = changePercent >= 0;

  let min = Infinity;
  let max = -Infinity;
  candles.forEach((c) => {
    if (c.low < min) min = c.low;
    if (c.high > max) max = c.high;
  });
  const range = max - min || 1;
  const padding = range * 0.08;
  const adjMin = Math.max(0, min - padding);
  const adjMax = max + padding;
  const adjRange = adjMax - adjMin || 1;

  const w = 480;
  const h = 240;
  const pTop = 15;
  const pBottom = 25;
  const pLeft = 15;
  const pRight = 55;
  const chartW = w - pLeft - pRight;
  const chartH = h - pTop - pBottom;

  const getX = (i: number) => pLeft + (i / Math.max(1, candles.length - 1)) * chartW;
  const getY = (p: number) => pTop + (1 - (p - adjMin) / adjRange) * chartH;

  const activeCandle =
    hoverIdx !== null && candles[hoverIdx] ? candles[hoverIdx] : candles[candles.length - 1];

  return (
    <div className="bg-[#0b0e14] border border-[#1b2336] rounded-xl flex flex-col overflow-hidden relative group">
      {/* Pane Top Header */}
      <div className="px-3 py-1.5 bg-[#10141f] border-b border-[#1a2234] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-white">{symbol}</span>
          <span className="text-[10px] px-1 rounded bg-[#1c263c] text-neutral-300 font-mono">
            {market}
          </span>
          <span className="text-[10px] px-1 rounded bg-[#1c263c] text-cyan-300 font-mono">
            {timeframe}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="font-mono text-[11px] font-bold">
            <span className="text-white">
              {currency === 'IDR' ? 'Rp ' : '$'}
              {price.toLocaleString()}
            </span>
            <span className={`ml-1.5 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isPos ? '+' : ''}
              {changePercent.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center gap-1">
            {onTrade && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTrade();
                }}
                title={isId ? 'Order Saham' : 'Trade'}
                className="px-1.5 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 cursor-pointer"
              >
                Trade
              </button>
            )}
            <button
              onClick={onMaximize}
              title={isId ? 'Fokus ke 1 Chart' : 'Maximize (1 Chart)'}
              className="p-1 rounded bg-[#1a2336] hover:bg-[#25324d] text-neutral-300 hover:text-white cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Mini Canvas */}
      <div
        className="flex-1 relative bg-[#07090f] p-1 overflow-hidden min-h-[140px]"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-full block cursor-crosshair"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width;
            const idx = Math.min(
              candles.length - 1,
              Math.max(0, Math.floor(relX * candles.length))
            );
            setHoverIdx(idx);
          }}
          onClick={onMaximize}
        >
          {/* Subtle Grid Lines */}
          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={pLeft}
              y1={pTop + ratio * chartH}
              x2={pLeft + chartW}
              y2={pTop + ratio * chartH}
              stroke="#1b2336"
              strokeDasharray="2 3"
              strokeWidth="0.8"
            />
          ))}

          {/* Candlesticks */}
          {candles.map((c, i) => {
            const x = getX(i);
            const openY = getY(c.open);
            const closeY = getY(c.close);
            const highY = getY(c.high);
            const lowY = getY(c.low);
            const isGreen = c.close >= c.open;
            const color = isGreen ? '#22ab94' : '#f23645';
            const candleW = Math.max(1.8, (chartW / candles.length) * 0.7);

            return (
              <g key={i}>
                <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1" />
                <rect
                  x={x - candleW / 2}
                  y={Math.min(openY, closeY)}
                  width={candleW}
                  height={Math.max(1, Math.abs(closeY - openY))}
                  fill={color}
                />
              </g>
            );
          })}

          {/* Right Y-Axis Scale */}
          <text
            x={w - 8}
            y={pTop + 10}
            textAnchor="end"
            fill="#787b86"
            fontSize="9"
            fontFamily="monospace"
          >
            {adjMax.toLocaleString()}
          </text>
          <text
            x={w - 8}
            y={pTop + chartH}
            textAnchor="end"
            fill="#787b86"
            fontSize="9"
            fontFamily="monospace"
          >
            {adjMin.toLocaleString()}
          </text>
        </svg>

        {/* Hover info tooltip */}
        {hoverIdx !== null && activeCandle && (
          <div className="absolute top-2 left-2 bg-[#121622]/95 border border-[#20293d] rounded px-2 py-1 text-[10px] font-mono text-white pointer-events-none">
            <span className="font-bold">{activeCandle.close.toLocaleString()}</span> •{' '}
            {activeCandle.time}
          </div>
        )}
      </div>
    </div>
  );
};

export const StockChart: React.FC<StockChartProps> = ({
  stock,
  candles,
  timeframe,
  onTimeframeChange,
  selectedCurrency,
  onOpenTrade,
  language = 'en',
  onOpenAlertModal,
  onOpenFundamentalModal,
  onOpenIndicatorsModal,
  indicators = [],
  onToggleIndicator,
  onRemoveIndicator,
  onSelectStock,
  pineResult,
}) => {
  const t = TRANSLATIONS[language || 'en'];
  const isId = language === 'id';

  // Chart Type: candlestick, area, line, bar, baseline, heikinashi
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [comparedIndices, setComparedIndices] = useState<string[]>([]);

  // Scale mode: 'linear' | 'percent' | 'log'
  const [scaleMode, setScaleMode] = useState<'linear' | 'percent' | 'log'>('linear');

  // Multi-chart layout
  const [multiLayout, setMultiLayout] = useState<MultiChartLayout>('1');

  // Drawing Tools State
  const [activeDrawingTool, setActiveDrawingTool] = useState<DrawingToolType>('crosshair');
  const [drawingsHistory, setDrawingsHistory] = useState<DrawingObject[][]>([]);
  const [drawingsRedoHistory, setDrawingsRedoHistory] = useState<DrawingObject[][]>([]);
  const [drawings, setDrawings] = useState<DrawingObject[]>([
    // Default example trend line & Long Risk/Reward box
    {
      id: 'draw-demo-rr',
      type: 'long_position',
      points: [{ x: 300, y: 180, price: stock.price }],
      color: '#22ab94',
      entryPrice: stock.price,
      targetPrice: stock.price * 1.045,
      stopLossPrice: stock.price * 0.982,
      riskRewardRatio: 2.5,
      visible: true,
      locked: false,
    },
  ]);
  const [isMagnetMode, setIsMagnetMode] = useState(false);
  const [isDrawingsLocked, setIsDrawingsLocked] = useState(false);
  const [areDrawingsVisible, setAreDrawingsVisible] = useState(true);

  // Bar Replay Mode State
  const [isReplayMode, setIsReplayMode] = useState(false);
  const [replayIndex, setReplayIndex] = useState<number>(candles.length - 1);
  const [isReplaying, setIsReplaying] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<number>(1); // 1x, 2x, 5x

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 490 });

  // Responsive chart resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setDimensions({
            width: entry.contentRect.width,
            height: isFullscreen
              ? window.innerHeight - 170
              : Math.max(420, Math.min(580, entry.contentRect.width * 0.52)),
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isFullscreen]);

  // Sync replay index when candles change
  useEffect(() => {
    if (!isReplayMode) {
      setReplayIndex(candles.length - 1);
    }
  }, [candles.length, isReplayMode]);

  // Replay interval timer
  useEffect(() => {
    if (!isReplayMode || !isReplaying) return;

    const intervalTime = Math.max(150, 1000 / replaySpeed);
    const interval = setInterval(() => {
      setReplayIndex((prev) => {
        if (prev >= candles.length - 1) {
          setIsReplaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isReplayMode, isReplaying, replaySpeed, candles.length]);

  // Sliced candles for Replay or Regular
  const displayCandles = useMemo(() => {
    const raw = isReplayMode ? candles.slice(0, Math.max(5, replayIndex + 1)) : candles;
    if (chartType === 'heikinashi') {
      return calculateHeikinAshi(raw);
    }
    return raw;
  }, [candles, isReplayMode, replayIndex, chartType]);

  // Compute price bounds
  const { minPrice, maxPrice } = useMemo(() => {
    if (!displayCandles.length) return { minPrice: 6400, maxPrice: 6680 };
    let min = Infinity;
    let max = -Infinity;

    displayCandles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    });

    const padding = (max - min) * 0.1 || 10;
    return {
      minPrice: Math.max(0, min - padding),
      maxPrice: max + padding,
    };
  }, [displayCandles]);

  // Sub-panel check (RSI, MACD, Stochastic, ATR, ADX, CCI, Williams %R, OBV)
  const isRsiVisible = indicators.some((i) => i.type === 'RSI' && i.visible);
  const isMacdVisible = indicators.some((i) => i.type === 'MACD' && i.visible);
  const isStochVisible = indicators.some((i) => i.type === 'STOCH' && i.visible);
  const isAtrVisible = indicators.some((i) => i.type === 'ATR' && i.visible);
  const isAdxVisible = indicators.some((i) => i.type === 'ADX' && i.visible);
  const isCciVisible = indicators.some((i) => i.type === 'CCI' && i.visible);
  const isWilliamsVisible = indicators.some((i) => i.type === 'WILLIAMS_R' && i.visible);
  const isObvVisible = indicators.some((i) => i.type === 'OBV' && i.visible);

  const activeSubPanels = [
    isRsiVisible && 'RSI',
    isMacdVisible && 'MACD',
    isStochVisible && 'STOCH',
    isAtrVisible && 'ATR',
    isAdxVisible && 'ADX',
    isCciVisible && 'CCI',
    isWilliamsVisible && 'WILLIAMS_R',
    isObvVisible && 'OBV',
  ].filter(Boolean) as string[];

  const hasSubPanel = activeSubPanels.length > 0;
  const subPanelHeight = hasSubPanel ? Math.min(180, activeSubPanels.length * 75) : 0;
  const singleSubHeight = hasSubPanel ? subPanelHeight / activeSubPanels.length : 0;

  const chartPadding = { top: 30, right: 90, bottom: 35 + subPanelHeight, left: 48 };
  const chartWidth = Math.max(100, dimensions.width - chartPadding.left - chartPadding.right);
  const mainChartHeight = Math.max(100, dimensions.height - chartPadding.top - chartPadding.bottom);
  const priceRange = maxPrice - minPrice || 1;

  const getX = (index: number) => {
    if (displayCandles.length <= 1) return chartPadding.left;
    return chartPadding.left + (index / (displayCandles.length - 1)) * chartWidth;
  };

  const getY = (price: number) => {
    if (scaleMode === 'log') {
      const logMin = Math.log(Math.max(0.0001, minPrice));
      const logMax = Math.log(Math.max(0.0001, maxPrice));
      const logVal = Math.log(Math.max(0.0001, price));
      const norm = (logVal - logMin) / (logMax - logMin || 1);
      return chartPadding.top + (1 - norm) * mainChartHeight;
    }
    const norm = (price - minPrice) / priceRange;
    return chartPadding.top + (1 - norm) * mainChartHeight;
  };

  // Fixed 7 ticks for Y-Axis
  const yAxisTicks = useMemo(() => {
    const step = priceRange / 6;
    const ticks: number[] = [];
    for (let i = 0; i <= 6; i++) {
      ticks.push(minPrice + i * step);
    }
    return ticks.reverse();
  }, [minPrice, priceRange]);

  // Technical Indicator Calculations
  const sma20 = useMemo(() => calculateSMA(displayCandles, 20), [displayCandles]);
  const ema50 = useMemo(() => calculateEMA(displayCandles, 50), [displayCandles]);
  const bb = useMemo(() => calculateBollingerBands(displayCandles, 20, 2), [displayCandles]);
  const rsiValues = useMemo(() => calculateRSI(displayCandles, 14), [displayCandles]);
  const macdData = useMemo(() => calculateMACD(displayCandles, 12, 26, 9), [displayCandles]);
  const supertrend = useMemo(() => calculateSupertrend(displayCandles, 10, 3), [displayCandles]);
  const vwap = useMemo(() => calculateVWAP(displayCandles), [displayCandles]);
  const stoch = useMemo(() => calculateStochastic(displayCandles, 14, 3, 3), [displayCandles]);
  const atr = useMemo(() => calculateATR(displayCandles, 14), [displayCandles]);
  const ichimoku = useMemo(() => calculateIchimoku(displayCandles, 9, 26, 52), [displayCandles]);
  const psar = useMemo(() => calculateParabolicSAR(displayCandles, 0.02, 0.2), [displayCandles]);
  const adx = useMemo(() => calculateADX(displayCandles, 14), [displayCandles]);
  const cci = useMemo(() => calculateCCI(displayCandles, 20), [displayCandles]);
  const obv = useMemo(() => calculateOBV(displayCandles), [displayCandles]);
  const williamsR = useMemo(() => calculateWilliamsR(displayCandles, 14), [displayCandles]);

  // Paths for area & line charts
  const { areaPathD, linePathD } = useMemo(() => {
    if (!displayCandles.length) return { areaPathD: '', linePathD: '' };

    const points = displayCandles.map((c, i) => `${getX(i)},${getY(c.close)}`);
    const linePath = `M ${points.join(' L ')}`;
    const baselineY = chartPadding.top + mainChartHeight;
    const areaPath = `M ${getX(0)},${baselineY} L ${points.join(' L ')} L ${getX(displayCandles.length - 1)},${baselineY} Z`;

    return { areaPathD: areaPath, linePathD: linePath };
  }, [displayCandles, chartWidth, mainChartHeight, minPrice, maxPrice]);

  // Mouse move handler for crosshair & inspection
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    if (x >= chartPadding.left && x <= chartPadding.left + chartWidth && displayCandles.length > 0) {
      const relX = (x - chartPadding.left) / chartWidth;
      const index = Math.min(displayCandles.length - 1, Math.max(0, Math.round(relX * (displayCandles.length - 1))));
      setHoverIndex(index);
    } else {
      setHoverIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setMousePos(null);
  };

  // Canvas Click Handler: Drop Interactive Drawing Tool
  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingsLocked || activeDrawingTool === 'crosshair' || activeDrawingTool === 'cursor') return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Price under click
    const normY = 1 - (y - chartPadding.top) / mainChartHeight;
    const clickedPrice = minPrice + normY * priceRange;

    setDrawingsHistory((prev) => [...prev, drawings]);
    setDrawingsRedoHistory([]);

    const newDrawing: DrawingObject = {
      id: `draw-${Date.now()}`,
      type: activeDrawingTool,
      points: [{ x, y, price: clickedPrice }],
      color:
        activeDrawingTool === 'long_position'
          ? '#22ab94'
          : activeDrawingTool === 'short_position'
          ? '#f23645'
          : activeDrawingTool === 'fib_retrace'
          ? '#f59e0b'
          : activeDrawingTool === 'anchored_vwap'
          ? '#ec4899'
          : '#2962ff',
      entryPrice: clickedPrice,
      targetPrice:
        activeDrawingTool === 'short_position' ? clickedPrice * 0.96 : clickedPrice * 1.04,
      stopLossPrice:
        activeDrawingTool === 'short_position' ? clickedPrice * 1.02 : clickedPrice * 0.98,
      riskRewardRatio: 2.0,
      visible: true,
      locked: false,
    };

    setDrawings((prev) => [...prev, newDrawing]);
  };

  const handleUndoDrawing = () => {
    if (drawingsHistory.length === 0) return;
    const prev = drawingsHistory[drawingsHistory.length - 1];
    setDrawingsRedoHistory((r) => [...r, drawings]);
    setDrawings(prev);
    setDrawingsHistory((h) => h.slice(0, -1));
  };

  const handleRedoDrawing = () => {
    if (drawingsRedoHistory.length === 0) return;
    const next = drawingsRedoHistory[drawingsRedoHistory.length - 1];
    setDrawingsHistory((h) => [...h, drawings]);
    setDrawings(next);
    setDrawingsRedoHistory((r) => r.slice(0, -1));
  };

  const activeCandle =
    hoverIndex !== null && displayCandles[hoverIndex]
      ? displayCandles[hoverIndex]
      : displayCandles[displayCandles.length - 1];

  // Number formatters for TradingView look
  const formatTV = (val: number, decimals: number = 4) => {
    const locale = isId ? 'id-ID' : 'en-US';
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  };

  const currentPriceFormatted = formatTV(stock.price, stock.price >= 1000 ? 4 : 2);
  const changeFormatted = formatTV(stock.change, 4);
  const isPositive = stock.change >= 0;

  // Extended timeframes list
  const timeframeList: { tf: Timeframe; label: string }[] = [
    { tf: '1s', label: '1s' },
    { tf: '1m', label: '1m' },
    { tf: '5m', label: '5m' },
    { tf: '15m', label: '15m' },
    { tf: '1H', label: '1H' },
    { tf: '4H', label: '4H' },
    { tf: '1D', label: '1D' },
    { tf: '1W', label: '1W' },
    { tf: '1M', label: '1M' },
    { tf: '1Y', label: '1Y' },
    { tf: 'ALL', label: 'ALL' },
  ];

  const toggleCompare = (id: string) => {
    setComparedIndices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Sample comparison candles for multi-chart layout views
  const compositeCandles = useMemo(() => {
    return displayCandles.map((c, i) => ({
      ...c,
      open: 6500 + Math.sin(i * 0.25) * 45,
      high: 6500 + Math.sin(i * 0.25) * 45 + 18,
      low: 6500 + Math.sin(i * 0.25) * 45 - 15,
      close: 6500 + Math.sin(i * 0.25 + 0.1) * 48,
    }));
  }, [displayCandles]);

  const nvdaCandles = useMemo(() => {
    return displayCandles.map((c, i) => ({
      ...c,
      open: 135 + Math.cos(i * 0.3) * 6,
      high: 135 + Math.cos(i * 0.3) * 6 + 2.5,
      low: 135 + Math.cos(i * 0.3) * 6 - 2,
      close: 135 + Math.cos(i * 0.3 + 0.15) * 6.5,
    }));
  }, [displayCandles]);

  const bbcaCandles = useMemo(() => {
    return displayCandles.map((c, i) => ({
      ...c,
      open: 10400 + Math.sin(i * 0.2) * 120,
      high: 10400 + Math.sin(i * 0.2) * 120 + 50,
      low: 10400 + Math.sin(i * 0.2) * 120 - 50,
      close: 10400 + Math.sin(i * 0.2 + 0.1) * 130,
    }));
  }, [displayCandles]);

  const handleSnapshot = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  return (
    <div
      id="stock-chart-panel"
      className={`liquid-glass-card border border-white/10 rounded-none sm:rounded-xl flex flex-col overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black/95' : 'relative bg-[#070b12]/80'
      }`}
    >
      {/* 1. TOP HEADER TOOLBAR (TradingView Supercharts Navigation) */}
      <div className="px-3 sm:px-4 py-2 border-b border-white/10 flex flex-wrap items-center justify-between gap-2.5 bg-black/40 backdrop-blur-md">
        {/* Left: Stock Profile, Price & Badges */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3.5">
          <StockCompanyLogo
            symbol={stock.symbol}
            market={stock.market}
            size="md"
            className="shadow-md ring-1 ring-white/10"
          />

          <div className="flex items-center gap-1.5">
            <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
              {stock.symbol}
            </span>
            <MarketLogo market={stock.market} size="sm" showLabel={true} />
          </div>

          {/* Price display with 'D' tag */}
          <div className="flex items-baseline gap-1.5 font-mono">
            <span className="text-base sm:text-xl font-extrabold text-white tracking-tight">
              {currentPriceFormatted}
            </span>
            <span className="text-[10px] font-black bg-amber-500/20 text-amber-400 px-1 py-0.2 rounded border border-amber-500/30">
              D
            </span>
          </div>

          {/* Price Change */}
          <div
            className={`flex items-center gap-1 font-mono text-xs sm:text-sm font-bold ${
              isPositive ? 'text-[#22ab94]' : 'text-[#f23645]'
            }`}
          >
            <span>{isPositive ? '+' : ''}{changeFormatted}</span>
            <span>({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)</span>
          </div>

          {/* Set Price Alert Button */}
          {onOpenAlertModal && (
            <button
              onClick={onOpenAlertModal}
              className="px-2 py-1 rounded-lg bg-[#182030] hover:bg-[#202b40] text-amber-400 text-xs font-semibold flex items-center gap-1 border border-[#233048] transition-colors cursor-pointer"
              title={isId ? 'Pasang Price Alert' : 'Create Price Alert'}
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isId ? 'Alert' : 'Alert'}</span>
            </button>
          )}

          {/* Indicators FX Button */}
          {onOpenIndicatorsModal && (
            <button
              onClick={onOpenIndicatorsModal}
              className="px-2.5 py-1 rounded-lg bg-[#182030] hover:bg-[#202b40] text-cyan-300 text-xs font-bold flex items-center gap-1 border border-[#233048] transition-colors cursor-pointer"
              title={isId ? 'Buka Indikator & Metrik' : 'Open Indicators & Strategies'}
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>fx {isId ? 'Indikator' : 'Indicators'}</span>
              <span className="text-[10px] px-1 rounded-full bg-cyan-950 text-cyan-300 font-mono">
                {indicators.filter((i) => i.visible).length}
              </span>
            </button>
          )}

          {/* Fundamentals Button */}
          {onOpenFundamentalModal && (
            <button
              onClick={onOpenFundamentalModal}
              className="px-2.5 py-1 rounded-lg bg-[#182030] hover:bg-[#202b40] text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-[#233048] transition-colors cursor-pointer"
              title={isId ? 'Laporan Keuangan & Fundamental' : 'Company Fundamentals & Financials'}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{isId ? 'Laporan Keuangan' : 'Financials'}</span>
            </button>
          )}
        </div>

        {/* Right: Timeframes, Chart Type, Bar Replay, Layout & Fullscreen */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-400 text-xs">
          {/* Timeframe Chips */}
          <div className="hidden lg:flex items-center bg-[#141824] rounded-lg p-0.5 border border-[#202738]">
            {timeframeList.map((tfItem) => (
              <button
                key={tfItem.tf}
                onClick={() => onTimeframeChange(tfItem.tf)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                  timeframe === tfItem.tf
                    ? 'bg-[#2962ff] text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tfItem.label}
              </button>
            ))}
          </div>

          {/* Chart Type Selector Dropdown / Buttons */}
          <div className="flex items-center bg-[#141824] rounded-lg p-0.5 border border-[#202738]">
            {[
              { type: 'candlestick', icon: CandlestickChart, title: 'Candlestick' },
              { type: 'area', icon: LineChart, title: 'Area' },
              { type: 'heikinashi', icon: BarChart3, title: 'Heikin Ashi' },
            ].map((ct) => {
              const Icon = ct.icon;
              return (
                <button
                  key={ct.type}
                  onClick={() => setChartType(ct.type as ChartType)}
                  title={ct.title}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    chartType === ct.type ? 'bg-[#252e42] text-white' : 'hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          {/* Bar Replay Mode Toggle */}
          <button
            onClick={() => {
              setIsReplayMode(!isReplayMode);
              if (!isReplayMode) {
                setReplayIndex(candles.length - 15);
              }
            }}
            className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border ${
              isReplayMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-900/20'
                : 'bg-[#141824] hover:bg-[#1e2436] text-neutral-300 border-[#202738]'
            }`}
            title="Bar Replay Mode (Jump back and replay bars)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Replay</span>
          </button>

          {/* Multi-chart Layout Selector */}
          <div className="hidden sm:flex items-center bg-[#141824] rounded-lg p-0.5 border border-[#202738]">
            <button
              onClick={() => setMultiLayout('1')}
              title="1 Chart"
              className={`p-1.5 rounded cursor-pointer ${
                multiLayout === '1' ? 'bg-[#252e42] text-white' : 'hover:text-white'
              }`}
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              onClick={() => setMultiLayout('2-h')}
              title="2 Charts (Split Horizontal)"
              className={`p-1.5 rounded cursor-pointer ${
                multiLayout === '2-h' ? 'bg-[#252e42] text-white' : 'hover:text-white'
              }`}
            >
              <Columns2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setMultiLayout('4')}
              title="4 Charts (2x2 Quad Grid)"
              className={`p-1.5 rounded cursor-pointer ${
                multiLayout === '4' ? 'bg-[#252e42] text-white' : 'hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3 h-3" />
            </button>
          </div>

          {/* Camera Snapshot */}
          <button
            onClick={handleSnapshot}
            title={t.camera}
            className="p-1.5 rounded-lg bg-[#141824] hover:bg-[#1e2436] hover:text-white transition-colors cursor-pointer relative border border-[#202738]"
          >
            <Camera className="w-3.5 h-3.5" />
            {copiedToast && (
              <span className="absolute -bottom-7 right-0 bg-neutral-900 border border-neutral-700 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-30 animate-in fade-in">
                {isId ? 'Tautan disalin!' : 'Link copied!'}
              </span>
            )}
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-[#141824] hover:bg-[#1e2436] hover:text-white transition-colors cursor-pointer border border-[#202738]"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. BAR REPLAY FLOATING CONTROLS (If Replay Active) */}
      {isReplayMode && (
        <div className="bg-[#181d28] border-b border-[#283244] px-4 py-1.5 flex items-center justify-between text-xs text-white">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 font-mono">
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>BAR REPLAY MODE: Bar {replayIndex + 1} / {candles.length}</span>
            </span>

            <div className="flex items-center gap-1 bg-[#10141d] rounded-lg p-0.5 border border-[#202838]">
              <button
                onClick={() => setIsReplaying(!isReplaying)}
                className={`p-1 rounded cursor-pointer ${
                  isReplaying ? 'bg-amber-500 text-black' : 'text-neutral-300 hover:text-white'
                }`}
                title={isReplaying ? 'Pause' : 'Play'}
              >
                {isReplaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              </button>
              <button
                onClick={() => setReplayIndex((prev) => Math.min(candles.length - 1, prev + 1))}
                className="p-1 text-neutral-300 hover:text-white rounded cursor-pointer"
                title="Step 1 bar forward"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReplayIndex(10)}
                className="p-1 text-neutral-300 hover:text-white rounded cursor-pointer"
                title="Rewind to start"
              >
                <FastForward className="w-3.5 h-3.5 rotate-180" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 text-[11px] font-mono">
              {[1, 2, 5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setReplaySpeed(spd)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    replaySpeed === spd ? 'bg-[#2962ff] text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsReplayMode(false)}
            className="text-[11px] text-neutral-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer font-semibold"
          >
            <X className="w-3.5 h-3.5" />
            <span>Exit Replay</span>
          </button>
        </div>
      )}

      {/* 3. CHART MAIN AREA (Left Drawing Toolbar + SVG Canvas) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* TradingView Left Drawing Tools Dock */}
        <div className="w-10 sm:w-11 bg-[#090b10] border-r border-[#1a1f2c] flex flex-col items-center py-2 gap-1 z-20 shrink-0 select-none">
          {[
            { id: 'crosshair', title: 'Crosshair', icon: Compass },
            { id: 'trendline', title: 'Trend Line', icon: TrendingUp },
            { id: 'arrow', title: 'Arrow Pointer', icon: ArrowRight },
            { id: 'parallel_channel', title: 'Parallel Channel', icon: Columns2 },
            { id: 'fib_retrace', title: 'Fibonacci Retracement', icon: Sliders },
            { id: 'pitchfork', title: "Andrews' Pitchfork", icon: GitBranch },
            { id: 'elliott_wave', title: 'Elliott Wave (1-2-3-4-5)', icon: Activity },
            { id: 'anchored_vwap', title: 'Anchored VWAP', icon: Layers },
            { id: 'rectangle', title: 'Rectangle Shape', icon: Square },
            { id: 'long_position', title: 'Long Position (Risk / Reward)', icon: ArrowUpRight },
            { id: 'short_position', title: 'Short Position (Risk / Reward)', icon: ArrowDownRight },
            { id: 'text', title: 'Text Annotation', icon: Type },
          ].map((tool) => {
            const Icon = tool.icon;
            const isSelected = activeDrawingTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveDrawingTool(tool.id as DrawingToolType)}
                title={tool.title}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2962ff] text-white shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-[#161c28]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}

          <div className="w-6 h-px bg-[#1c2230] my-1" />

          {/* Undo / Redo buttons */}
          <button
            onClick={handleUndoDrawing}
            disabled={drawingsHistory.length === 0}
            title="Undo drawing action"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedoDrawing}
            disabled={drawingsRedoHistory.length === 0}
            title="Redo drawing action"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>

          <div className="w-6 h-px bg-[#1c2230] my-1" />

          {/* Drawing Controls: Magnet, Lock, Visibility, Trash */}
          <button
            onClick={() => setIsMagnetMode(!isMagnetMode)}
            title={isMagnetMode ? 'Magnet Mode: ON' : 'Magnet Mode: OFF'}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isMagnetMode ? 'text-cyan-400 bg-cyan-950/40' : 'text-neutral-500 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsDrawingsLocked(!isDrawingsLocked)}
            title={isDrawingsLocked ? 'Unlock all drawings' : 'Lock all drawings'}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              isDrawingsLocked ? 'text-amber-400 bg-amber-950/40' : 'text-neutral-500 hover:text-white'
            }`}
          >
            {isDrawingsLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setAreDrawingsVisible(!areDrawingsVisible)}
            title={areDrawingsVisible ? 'Hide drawings' : 'Show drawings'}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              !areDrawingsVisible ? 'text-rose-400' : 'text-neutral-500 hover:text-white'
            }`}
          >
            {areDrawingsVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setDrawings([])}
            title="Clear all drawings"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-rose-400 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {multiLayout === '1' ? (
          /* Chart Canvas & SVG Container */
          <div
            ref={containerRef}
            className="flex-1 relative bg-[#000000] select-none min-h-[380px] overflow-hidden"
            onMouseLeave={handleMouseLeave}
          >
          {/* Active Indicators Overlay Chips in Top Left */}
          <div className="absolute top-2 left-3 z-10 flex flex-wrap items-center gap-1.5 text-[11px] font-mono select-none">
            {indicators
              .filter((i) => i.visible)
              .map((ind) => (
                <div
                  key={ind.id}
                  className="px-2 py-0.5 rounded bg-[#10141d]/90 border border-[#1f2638] text-white flex items-center gap-1.5 shadow backdrop-blur-sm"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ind.color }} />
                  <span className="font-bold">{ind.name}</span>
                  <button
                    onClick={() => onToggleIndicator?.(ind.id)}
                    className="text-neutral-400 hover:text-white cursor-pointer ml-1"
                    title="Toggle Visibility"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => onRemoveIndicator?.(ind.id)}
                    className="text-neutral-400 hover:text-rose-400 cursor-pointer"
                    title="Remove"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
          </div>

          <svg
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full cursor-crosshair block"
            onMouseMove={handleMouseMove}
            onClick={handleCanvasClick}
          >
            <defs>
              <linearGradient id="tvAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22ab94" stopOpacity="0.32" />
                <stop offset="60%" stopColor="#22ab94" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#22ab94" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Background Watermark */}
            <g opacity="0.05" transform={`translate(28, ${mainChartHeight - 20})`}>
              <text fill="#ffffff" fontSize="28" fontWeight="900" letterSpacing="-1">
                TRADINGVIEW
              </text>
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
                    stroke="#161a24"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />
                </g>
              );
            })}

            {/* Current Price Dashed Reference Line */}
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

            {/* INDICATOR: Bollinger Bands (20, 2) Cloud */}
            {indicators.some((i) => i.type === 'BB' && i.visible) && (
              <g>
                {/* BB Upper & Lower Lines */}
                {bb.upper.map((upVal, i) => {
                  if (upVal === null || i === 0 || bb.upper[i - 1] === null) return null;
                  const x1 = getX(i - 1);
                  const y1 = getY(bb.upper[i - 1] as number);
                  const x2 = getX(i);
                  const y2 = getY(upVal);
                  return (
                    <line
                      key={`bb-up-${i}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#10b981"
                      strokeWidth="1.2"
                      opacity="0.7"
                    />
                  );
                })}
                {bb.lower.map((lowVal, i) => {
                  if (lowVal === null || i === 0 || bb.lower[i - 1] === null) return null;
                  const x1 = getX(i - 1);
                  const y1 = getY(bb.lower[i - 1] as number);
                  const x2 = getX(i);
                  const y2 = getY(lowVal);
                  return (
                    <line
                      key={`bb-low-${i}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#10b981"
                      strokeWidth="1.2"
                      opacity="0.7"
                    />
                  );
                })}
              </g>
            )}

            {/* INDICATOR: SMA 20 Overlay Line */}
            {indicators.some((i) => i.type === 'SMA' && i.visible) && (
              <path
                d={sma20
                  .map((val, i) => {
                    if (val === null) return '';
                    const prefix = i === 19 ? 'M ' : ' L ';
                    return `${prefix}${getX(i)},${getY(val)}`;
                  })
                  .join('')}
                fill="none"
                stroke="#2962ff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}

            {/* INDICATOR: EMA 50 Overlay Line */}
            {indicators.some((i) => i.type === 'EMA' && i.visible) && (
              <path
                d={ema50
                  .map((val, i) => {
                    if (val === null) return '';
                    const prefix = i === 49 ? 'M ' : ' L ';
                    return `${prefix}${getX(i)},${getY(val)}`;
                  })
                  .join('')}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}

            {/* INDICATOR: Supertrend (10, 3) */}
            {indicators.some((i) => i.type === 'SUPERTREND' && i.visible) && (
              <g>
                {supertrend.supertrend.map((val, i) => {
                  if (val === null || i === 0 || supertrend.supertrend[i - 1] === null) return null;
                  const dir = supertrend.direction[i];
                  const color = dir === 1 ? '#10b981' : '#ef4444';
                  return (
                    <line
                      key={`st-${i}`}
                      x1={getX(i - 1)}
                      y1={getY(supertrend.supertrend[i - 1]!)}
                      x2={getX(i)}
                      y2={getY(val)}
                      stroke={color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  );
                })}
              </g>
            )}

            {/* INDICATOR: VWAP (Volume Weighted Average Price) */}
            {indicators.some((i) => i.type === 'VWAP' && i.visible) && (
              <path
                d={vwap
                  .map((val, i) => {
                    if (val === null) return '';
                    const prefix = i === 0 ? 'M ' : ' L ';
                    return `${prefix}${getX(i)},${getY(val)}`;
                  })
                  .join('')}
                fill="none"
                stroke="#ec4899"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            )}

            {/* INDICATOR: Ichimoku Cloud */}
            {indicators.some((i) => i.type === 'ICHIMOKU' && i.visible) && (
              <g>
                {/* Cloud Shading between Span A and Span B */}
                {ichimoku.senkouA.map((a, i) => {
                  const b = ichimoku.senkouB[i];
                  if (a === null || b === null || i === 0) return null;
                  const prevA = ichimoku.senkouA[i - 1];
                  const prevB = ichimoku.senkouB[i - 1];
                  if (prevA === null || prevB === null) return null;
                  const x1 = getX(i - 1);
                  const x2 = getX(i);
                  const yA1 = getY(prevA);
                  const yA2 = getY(a);
                  const yB1 = getY(prevB);
                  const yB2 = getY(b);
                  const isBullishCloud = a >= b;
                  return (
                    <polygon
                      key={`cloud-${i}`}
                      points={`${x1},${yA1} ${x2},${yA2} ${x2},${yB2} ${x1},${yB1}`}
                      fill={isBullishCloud ? '#10b981' : '#ef4444'}
                      fillOpacity="0.18"
                    />
                  );
                })}
                {/* Tenkan-sen (Blue) */}
                <path
                  d={ichimoku.tenkan.map((v, i) => (v === null ? '' : `${i === 0 ? 'M ' : ' L '}${getX(i)},${getY(v)}`)).join('')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                />
                {/* Kijun-sen (Orange) */}
                <path
                  d={ichimoku.kijun.map((v, i) => (v === null ? '' : `${i === 0 ? 'M ' : ' L '}${getX(i)},${getY(v)}`)).join('')}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="1.5"
                />
              </g>
            )}

            {/* INDICATOR: Parabolic SAR Dots */}
            {indicators.some((i) => i.type === 'PSAR' && i.visible) && (
              <g>
                {psar.map((val, i) => {
                  if (val === null || i >= displayCandles.length) return null;
                  const c = displayCandles[i];
                  const isBelow = val < c.close;
                  return (
                    <circle
                      key={`psar-${i}`}
                      cx={getX(i)}
                      cy={getY(val)}
                      r="2"
                      fill={isBelow ? '#10b981' : '#ef4444'}
                    />
                  );
                })}
              </g>
            )}

            {/* PINE SCRIPT OVERLAY PLOTS */}
            {pineResult?.plots.map((pl) => (
              <path
                key={pl.id}
                d={pl.values
                  .map((v, i) => (v === null ? '' : `${i === 0 ? 'M ' : ' L '}${getX(i)},${getY(v)}`))
                  .join('')}
                fill="none"
                stroke={pl.color}
                strokeWidth={pl.lineWidth}
                strokeLinecap="round"
              />
            ))}

            {/* PINE SCRIPT STRATEGY MARKERS (BUY/SELL) */}
            {pineResult?.markers.map((m, idx) => {
              if (m.index >= displayCandles.length) return null;
              const x = getX(m.index);
              const y = getY(m.price);
              const isBuy = m.type === 'BUY';
              return (
                <g key={`marker-${idx}`} transform={`translate(${x}, ${y})`}>
                  <polygon
                    points={isBuy ? '0,6 -5,14 5,14' : '0,-6 -5,-14 5,-14'}
                    fill={m.color}
                    stroke="#000"
                    strokeWidth="0.8"
                  />
                  <text
                    x="0"
                    y={isBuy ? 24 : -18}
                    textAnchor="middle"
                    fill={m.color}
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="JetBrains Mono"
                  >
                    {m.label}
                  </text>
                </g>
              );
            })}

            {/* MAIN CHART RENDERING: Area vs Candlestick vs Line */}
            {chartType === 'area' ? (
              <g>
                <path d={areaPathD} fill="url(#tvAreaGradient)" />
                <path
                  d={linePathD}
                  fill="none"
                  stroke="#22ab94"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {displayCandles.length > 0 && (
                  <circle
                    cx={getX(displayCandles.length - 1)}
                    cy={getY(stock.price)}
                    r="3.5"
                    fill="#ffffff"
                    stroke="#22ab94"
                    strokeWidth="2"
                  />
                )}
              </g>
            ) : (
              /* Candlestick / Heikin Ashi Graphic */
              <g>
                {displayCandles.map((c, i) => {
                  const x = getX(i);
                  const isBull = c.close >= c.open;
                  const candleColor = isBull ? '#22ab94' : '#f23645';
                  const yHigh = getY(c.high);
                  const yLow = getY(c.low);
                  const yOpen = getY(c.open);
                  const yClose = getY(c.close);
                  const topY = Math.min(yOpen, yClose);
                  const bodyH = Math.max(1.5, Math.abs(yOpen - yClose));
                  const candleWidth = Math.max(2.5, Math.min(9, (chartWidth / displayCandles.length) * 0.7));

                  return (
                    <g key={`candle-${i}`}>
                      <line
                        x1={x}
                        y1={yHigh}
                        x2={x}
                        y2={yLow}
                        stroke={candleColor}
                        strokeWidth="1.2"
                      />
                      <rect
                        x={x - candleWidth / 2}
                        y={topY}
                        width={candleWidth}
                        height={bodyH}
                        fill={candleColor}
                        rx="0.5"
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* DRAWING OBJECTS: Long / Short Position Box, Fib Retracement, Lines */}
            {areDrawingsVisible &&
              drawings.map((draw) => {
                if (draw.type === 'long_position') {
                  const entryY = getY(draw.entryPrice || stock.price);
                  const targetY = getY(draw.targetPrice || stock.price * 1.045);
                  const slY = getY(draw.stopLossPrice || stock.price * 0.982);
                  const boxWidth = 140;
                  const boxX = draw.points[0]?.x || 200;

                  return (
                    <g key={draw.id}>
                      {/* Profit Zone Green Box */}
                      <rect
                        x={boxX}
                        y={targetY}
                        width={boxWidth}
                        height={Math.max(10, entryY - targetY)}
                        fill="#22ab94"
                        fillOpacity="0.22"
                        stroke="#22ab94"
                        strokeWidth="1.5"
                        rx="3"
                      />
                      <text
                        x={boxX + 6}
                        y={targetY + 14}
                        fill="#22ab94"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="JetBrains Mono"
                      >
                        Target: {draw.targetPrice?.toFixed(2)} (+4.5%)
                      </text>

                      {/* Loss Zone Red Box */}
                      <rect
                        x={boxX}
                        y={entryY}
                        width={boxWidth}
                        height={Math.max(10, slY - entryY)}
                        fill="#f23645"
                        fillOpacity="0.22"
                        stroke="#f23645"
                        strokeWidth="1.5"
                        rx="3"
                      />
                      <text
                        x={boxX + 6}
                        y={slY - 6}
                        fill="#f23645"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="JetBrains Mono"
                      >
                        Stop Loss: {draw.stopLossPrice?.toFixed(2)} (-1.8%)
                      </text>

                      {/* Entry Line */}
                      <line
                        x1={boxX}
                        y1={entryY}
                        x2={boxX + boxWidth}
                        y2={entryY}
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={boxX + boxWidth - 48}
                        y={entryY - 4}
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="JetBrains Mono"
                      >
                        R:R 2.50
                      </text>
                    </g>
                  );
                }

                if (draw.type === 'trendline' && draw.points.length > 0) {
                  const p = draw.points[0];
                  return (
                    <line
                      key={draw.id}
                      x1={chartPadding.left}
                      y1={p.y}
                      x2={chartPadding.left + chartWidth}
                      y2={p.y - 30}
                      stroke="#2962ff"
                      strokeWidth="2"
                    />
                  );
                }

                if (draw.type === 'arrow' && draw.points.length > 0) {
                  const p = draw.points[0];
                  return (
                    <g key={draw.id}>
                      <line
                        x1={p.x}
                        y1={p.y}
                        x2={p.x + 80}
                        y2={p.y - 40}
                        stroke="#06b6d4"
                        strokeWidth="2"
                      />
                      <polygon
                        points={`${p.x + 80},${p.y - 40} ${p.x + 68},${p.y - 46} ${p.x + 72},${p.y - 32}`}
                        fill="#06b6d4"
                      />
                    </g>
                  );
                }

                if (draw.type === 'parallel_channel' && draw.points.length > 0) {
                  const p = draw.points[0];
                  return (
                    <g key={draw.id}>
                      <polygon
                        points={`${p.x},${p.y} ${p.x + 180},${p.y - 40} ${p.x + 180},${p.y + 20} ${p.x},${p.y + 60}`}
                        fill="#2962ff"
                        fillOpacity="0.15"
                        stroke="#2962ff"
                        strokeWidth="1.5"
                      />
                      <line x1={p.x} y1={p.y + 30} x2={p.x + 180} y2={p.y - 10} stroke="#2962ff" strokeDasharray="3 3" />
                    </g>
                  );
                }

                if (draw.type === 'pitchfork' && draw.points.length > 0) {
                  const p = draw.points[0];
                  return (
                    <g key={draw.id}>
                      <line x1={p.x} y1={p.y} x2={p.x + 160} y2={p.y - 30} stroke="#f59e0b" strokeWidth="2" />
                      <line x1={p.x} y1={p.y - 30} x2={p.x + 160} y2={p.y - 60} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
                      <line x1={p.x} y1={p.y + 30} x2={p.x + 160} y2={p.y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
                    </g>
                  );
                }

                if (draw.type === 'elliott_wave' && draw.points.length > 0) {
                  const p = draw.points[0];
                  const wavePts = [
                    { x: p.x, y: p.y, label: '(1)' },
                    { x: p.x + 35, y: p.y - 35, label: '(2)' },
                    { x: p.x + 60, y: p.y - 15, label: '(3)' },
                    { x: p.x + 110, y: p.y - 65, label: '(4)' },
                    { x: p.x + 140, y: p.y - 40, label: '(5)' },
                  ];
                  return (
                    <g key={draw.id}>
                      <polyline
                        points={wavePts.map((pt) => `${pt.x},${pt.y}`).join(' ')}
                        fill="none"
                        stroke="#a855f7"
                        strokeWidth="1.8"
                        strokeDasharray="3 2"
                      />
                      {wavePts.map((pt, wIdx) => (
                        <g key={wIdx}>
                          <circle cx={pt.x} cy={pt.y} r="3" fill="#a855f7" />
                          <text x={pt.x} y={pt.y - 6} fill="#a855f7" fontSize="9" fontWeight="bold" textAnchor="middle">
                            {pt.label}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                }

                if (draw.type === 'anchored_vwap' && draw.points.length > 0) {
                  const p = draw.points[0];
                  return (
                    <line
                      key={draw.id}
                      x1={p.x}
                      y1={p.y}
                      x2={chartPadding.left + chartWidth}
                      y2={getY(stock.price)}
                      stroke="#ec4899"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  );
                }

                return null;
              })}

            {/* SUB-PANELS: STOCHASTIC, MACD, RSI, ATR, ADX, CCI */}
            {hasSubPanel && (
              <g transform={`translate(0, ${chartPadding.top + mainChartHeight + 12})`}>
                <rect
                  x={chartPadding.left}
                  y="0"
                  width={chartWidth}
                  height={subPanelHeight - 16}
                  fill="#080a10"
                  stroke="#1c2230"
                  strokeWidth="1"
                />

                {/* Sub-panel: RSI */}
                {isRsiVisible && (
                  <g>
                    <line x1={chartPadding.left} y1={(singleSubHeight - 16) * 0.3} x2={chartPadding.left + chartWidth} y2={(singleSubHeight - 16) * 0.3} stroke="#f23645" strokeDasharray="2 3" opacity="0.6" />
                    <line x1={chartPadding.left} y1={(singleSubHeight - 16) * 0.7} x2={chartPadding.left + chartWidth} y2={(singleSubHeight - 16) * 0.7} stroke="#22ab94" strokeDasharray="2 3" opacity="0.6" />
                    <path
                      d={rsiValues
                        .map((val, i) => {
                          if (val === null) return '';
                          const rsiY = (1 - val / 100) * (singleSubHeight - 16);
                          const prefix = i === 14 ? 'M ' : ' L ';
                          return `${prefix}${getX(i)},${rsiY}`;
                        })
                        .join('')}
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.8"
                    />
                    <text x={chartPadding.left + 8} y="12" fill="#a855f7" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                      RSI 14 : {rsiValues[rsiValues.length - 1] !== null ? (rsiValues[rsiValues.length - 1] as number).toFixed(1) : '54.2'}
                    </text>
                  </g>
                )}

                {/* Sub-panel: MACD */}
                {isMacdVisible && (
                  <g transform={`translate(0, ${isRsiVisible ? singleSubHeight : 0})`}>
                    {macdData.histogram.map((hist, i) => {
                      if (hist === null) return null;
                      const x = getX(i);
                      const isUp = hist >= 0;
                      const midY = (singleSubHeight - 16) / 2;
                      const barH = Math.min(25, Math.abs(hist) * 8);
                      const barY = isUp ? midY - barH : midY;
                      return (
                        <rect
                          key={`hist-${i}`}
                          x={x - 1}
                          y={barY}
                          width={2}
                          height={Math.max(1, barH)}
                          fill={isUp ? '#22ab94' : '#f23645'}
                          opacity="0.8"
                        />
                      );
                    })}
                    <text x={chartPadding.left + 8} y="12" fill="#3b82f6" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                      MACD (12, 26, 9)
                    </text>
                  </g>
                )}

                {/* Sub-panel: Stochastic */}
                {isStochVisible && (
                  <g transform={`translate(0, ${(isRsiVisible ? 1 : 0 + (isMacdVisible ? 1 : 0)) * singleSubHeight})`}>
                    <line x1={chartPadding.left} y1={(singleSubHeight - 16) * 0.2} x2={chartPadding.left + chartWidth} y2={(singleSubHeight - 16) * 0.2} stroke="#f23645" strokeDasharray="2 3" opacity="0.6" />
                    <line x1={chartPadding.left} y1={(singleSubHeight - 16) * 0.8} x2={chartPadding.left + chartWidth} y2={(singleSubHeight - 16) * 0.8} stroke="#22ab94" strokeDasharray="2 3" opacity="0.6" />
                    <path
                      d={stoch.k
                        .map((val, i) => (val === null ? '' : `${i === 0 ? 'M ' : ' L '}${getX(i)},${(1 - val / 100) * (singleSubHeight - 16)}`))
                        .join('')}
                      fill="none"
                      stroke="#eab308"
                      strokeWidth="1.6"
                    />
                    <path
                      d={stoch.d
                        .map((val, i) => (val === null ? '' : `${i === 0 ? 'M ' : ' L '}${getX(i)},${(1 - val / 100) * (singleSubHeight - 16)}`))
                        .join('')}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="1.4"
                      strokeDasharray="2 2"
                    />
                    <text x={chartPadding.left + 8} y="12" fill="#eab308" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                      Stochastic (14, 3, 3) %K: {stoch.k[stoch.k.length - 1]?.toFixed(1) || '48.2'} %D: {stoch.d[stoch.d.length - 1]?.toFixed(1) || '46.8'}
                    </text>
                  </g>
                )}

                {/* Sub-panel: ATR */}
                {isAtrVisible && (
                  <g transform={`translate(0, 0)`}>
                    <path
                      d={atr
                        .map((val, i) => {
                          if (val === null) return '';
                          const normAtr = Math.min(1, Math.max(0, val / (stock.price * 0.05 || 1)));
                          const atrY = (1 - normAtr) * (singleSubHeight - 16);
                          return `${i === 0 ? 'M ' : ' L '}${getX(i)},${atrY}`;
                        })
                        .join('')}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.8"
                    />
                    <text x={chartPadding.left + 8} y="12" fill="#ef4444" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                      ATR 14: {atr[atr.length - 1]?.toFixed(2) || '2.40'}
                    </text>
                  </g>
                )}

                {/* Sub-panel: ADX */}
                {isAdxVisible && (
                  <g transform={`translate(0, 0)`}>
                    <path
                      d={adx.adx
                        .map((val, i) => (val === null ? '' : `${i === 0 ? 'M ' : ' L '}${getX(i)},${(1 - val / 100) * (singleSubHeight - 16)}`))
                        .join('')}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="1.8"
                    />
                    <text x={chartPadding.left + 8} y="12" fill="#8b5cf6" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                      ADX 14: {adx.adx[adx.adx.length - 1]?.toFixed(1) || '28.4'} (Trend Strength)
                    </text>
                  </g>
                )}

                {/* Sub-panel: CCI */}
                {isCciVisible && (
                  <g transform={`translate(0, 0)`}>
                    <path
                      d={cci
                        .map((val, i) => {
                          if (val === null) return '';
                          const clamped = Math.max(-200, Math.min(200, val));
                          const normCci = (clamped + 200) / 400;
                          return `${i === 0 ? 'M ' : ' L '}${getX(i)},${(1 - normCci) * (singleSubHeight - 16)}`;
                        })
                        .join('')}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1.8"
                    />
                    <text x={chartPadding.left + 8} y="12" fill="#06b6d4" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                      CCI 20: {cci[cci.length - 1]?.toFixed(1) || '45.0'}
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* Interactive Crosshair */}
            {hoverIndex !== null && mousePos && (
              <g>
                <line
                  x1={getX(hoverIndex)}
                  y1={chartPadding.top}
                  x2={getX(hoverIndex)}
                  y2={chartPadding.top + mainChartHeight}
                  stroke="#4b5563"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
                <line
                  x1={chartPadding.left}
                  y1={mousePos.y}
                  x2={chartPadding.left + chartWidth}
                  y2={mousePos.y}
                  stroke="#4b5563"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              </g>
            )}

            {/* Right Y-Axis Price Scales */}
            <g>
              {yAxisTicks.map((price, i) => {
                const y = getY(price);
                const displayLabel =
                  scaleMode === 'percent' && displayCandles.length > 0
                    ? `${(((price - displayCandles[0].close) / displayCandles[0].close) * 100).toFixed(2)}%`
                    : formatTV(price, price >= 1000 ? 4 : 2);
                return (
                  <text
                    key={`y-tick-${i}`}
                    x={chartPadding.left + chartWidth + 10}
                    y={y + 4}
                    fill="#787b86"
                    fontSize="11"
                    fontFamily="JetBrains Mono"
                    fontWeight="500"
                  >
                    {displayLabel}
                  </text>
                );
              })}

              {/* Current Price Active Highlight Tag on Right Y-axis */}
              <g transform={`translate(${chartPadding.left + chartWidth + 4}, ${getY(stock.price) - 10})`}>
                <rect width={chartPadding.right - 8} height="20" rx="3" fill="#22ab94" />
                <text
                  x="4"
                  y="14"
                  fill="#ffffff"
                  fontSize="11"
                  fontWeight="700"
                  fontFamily="JetBrains Mono"
                >
                  {scaleMode === 'percent' && displayCandles.length > 0
                    ? `${(((stock.price - displayCandles[0].close) / displayCandles[0].close) * 100).toFixed(2)}%`
                    : formatTV(stock.price, stock.price >= 1000 ? 4 : 2)}
                </text>
              </g>

              {/* Scale Mode Switcher (Linear | Log | %) */}
              <g transform={`translate(${chartPadding.left + chartWidth + 4}, ${chartPadding.top + mainChartHeight - 22})`}>
                <rect width={chartPadding.right - 8} height="18" rx="4" fill="#141a24" stroke="#222b3b" strokeWidth="0.8" />
                <text
                  x="6"
                  y="13"
                  fill={scaleMode === 'linear' ? '#2962ff' : '#787b86'}
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono"
                  className="cursor-pointer"
                  onClick={() => setScaleMode('linear')}
                >
                  REG
                </text>
                <text
                  x="30"
                  y="13"
                  fill={scaleMode === 'log' ? '#06b6d4' : '#787b86'}
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono"
                  className="cursor-pointer"
                  onClick={() => setScaleMode('log')}
                >
                  LOG
                </text>
                <text
                  x="56"
                  y="13"
                  fill={scaleMode === 'percent' ? '#10b981' : '#787b86'}
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono"
                  className="cursor-pointer"
                  onClick={() => setScaleMode('percent')}
                >
                  %
                </text>
              </g>
            </g>

            {/* X-Axis Date Ticks */}
            <g>
              {displayCandles.map((c, i) => {
                if (i % 6 !== 0 && i !== displayCandles.length - 1) return null;
                const x = getX(i);
                return (
                  <text
                    key={`x-label-${i}`}
                    x={x}
                    y={chartPadding.top + mainChartHeight + 18}
                    textAnchor="middle"
                    fill="#787b86"
                    fontSize="10"
                    fontFamily="JetBrains Mono"
                  >
                    {c.time}
                  </text>
                );
              })}
            </g>
          </svg>

          {/* Floating Tooltip */}
          {hoverIndex !== null && activeCandle && (
            <div
              className="absolute z-20 pointer-events-none bg-[#1e222d]/95 border border-[#2a2e39] text-white px-3 py-2 rounded-lg shadow-2xl backdrop-blur-sm flex flex-col gap-0.5 text-xs font-mono animate-in fade-in duration-100"
              style={{
                left: Math.min(dimensions.width - 170, Math.max(20, getX(hoverIndex) - 75)),
                top: Math.max(40, getY(activeCandle.close) + 20),
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-sm text-white">
                  {formatTV(activeCandle.close, 4)}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {activeCandle.time}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 text-[10px] text-neutral-300">
                <span>O: {formatTV(activeCandle.open, 2)}</span>
                <span>H: {formatTV(activeCandle.high, 2)}</span>
                <span>L: {formatTV(activeCandle.low, 2)}</span>
                <span>V: {(activeCandle.volume / 1000000).toFixed(1)}M</span>
              </div>
            </div>
          )}
        </div>
        ) : multiLayout === '2-h' ? (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 bg-[#090b10] p-2 overflow-y-auto select-none min-h-[380px]">
            <MiniChartPane
              symbol={stock.symbol}
              name={stock.name}
              market={stock.market}
              currency={stock.currency}
              price={stock.price}
              change={stock.change}
              changePercent={stock.changePercent}
              timeframe={timeframe}
              candles={displayCandles}
              onMaximize={() => setMultiLayout('1')}
              onTrade={() => onOpenTrade(stock, 'BUY')}
              isId={isId}
            />
            <MiniChartPane
              symbol="COMPOSITE"
              name="IDX Composite Index"
              market="IDX"
              currency="IDR"
              price={6520.45}
              change={29.15}
              changePercent={0.45}
              timeframe="1D"
              candles={compositeCandles}
              onMaximize={() => {
                setMultiLayout('1');
                onSelectStock?.('COMPOSITE');
              }}
              onTrade={() => onOpenTrade(stock, 'BUY')}
              isId={isId}
            />
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#090b10] p-2 overflow-y-auto select-none min-h-[380px]">
            <MiniChartPane
              symbol={stock.symbol}
              name={stock.name}
              market={stock.market}
              currency={stock.currency}
              price={stock.price}
              change={stock.change}
              changePercent={stock.changePercent}
              timeframe={timeframe}
              candles={displayCandles}
              onMaximize={() => setMultiLayout('1')}
              onTrade={() => onOpenTrade(stock, 'BUY')}
              isId={isId}
            />
            <MiniChartPane
              symbol="COMPOSITE"
              name="IDX Composite"
              market="IDX"
              currency="IDR"
              price={6520.45}
              change={29.15}
              changePercent={0.45}
              timeframe="1D"
              candles={compositeCandles}
              onMaximize={() => {
                setMultiLayout('1');
                onSelectStock?.('COMPOSITE');
              }}
              isId={isId}
            />
            <MiniChartPane
              symbol="NVDA"
              name="NVIDIA Corporation"
              market="NASDAQ"
              currency="USD"
              price={138.25}
              change={3.85}
              changePercent={2.86}
              timeframe="1D"
              candles={nvdaCandles}
              onMaximize={() => {
                setMultiLayout('1');
                onSelectStock?.('NVDA');
              }}
              isId={isId}
            />
            <MiniChartPane
              symbol="BBCA"
              name="Bank Central Asia"
              market="IDX"
              currency="IDR"
              price={10450}
              change={125}
              changePercent={1.21}
              timeframe="1D"
              candles={bbcaCandles}
              onMaximize={() => {
                setMultiLayout('1');
                onSelectStock?.('BBCA.JK');
              }}
              isId={isId}
            />
          </div>
        )}
      </div>

      {/* 4. COMPARISON WITH BENCHMARK INDICES BAR */}
      <div className="border-t border-[#1c1f26] bg-[#07090e] p-3 space-y-2 select-none">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-neutral-300">
            {t.compareWith}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">Normalized Return Scale</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {COMPARISON_INDICES.map((idx) => {
            const isAdded = comparedIndices.includes(idx.id);
            return (
              <div
                key={idx.id}
                className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                  isAdded
                    ? 'bg-[#111827] border-emerald-500/50'
                    : 'bg-[#0a0d14] border-[#1c1f26] hover:border-[#2a3040]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-[#1b2230] text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx.badge}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{idx.name}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{idx.fullName}</div>
                  </div>
                </div>

                <button
                  onClick={() => toggleCompare(idx.id)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 cursor-pointer ${
                    isAdded ? 'bg-emerald-600 text-white' : 'bg-[#1e2330] text-neutral-300'
                  }`}
                >
                  {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
