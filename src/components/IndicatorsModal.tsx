import React, { useState } from 'react';
import {
  X,
  Search,
  Activity,
  Check,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Settings2,
  Sparkles,
  BarChart3,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { TechnicalIndicator, IndicatorType, Language } from '../types';

interface IndicatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicators: TechnicalIndicator[];
  onToggleIndicator: (id: string) => void;
  onUpdateParams: (id: string, params: Record<string, number | string>) => void;
  onApplyTemplate: (templateName: string) => void;
  language: Language;
}

interface IndicatorMeta {
  type: IndicatorType;
  name: string;
  category: 'trend' | 'momentum' | 'volatility' | 'volume';
  overlay: boolean;
  defaultParams: Record<string, number | string>;
  defaultColor: string;
  description: string;
}

const AVAILABLE_INDICATORS: IndicatorMeta[] = [
  {
    type: 'SMA',
    name: 'Simple Moving Average (SMA)',
    category: 'trend',
    overlay: true,
    defaultParams: { length: 20 },
    defaultColor: '#2962ff',
    description: 'Average price calculated over specified period. Filters noise to reveal trend direction.',
  },
  {
    type: 'EMA',
    name: 'Exponential Moving Average (EMA)',
    category: 'trend',
    overlay: true,
    defaultParams: { length: 50 },
    defaultColor: '#f59e0b',
    description: 'Weighted moving average giving higher priority to recent price action.',
  },
  {
    type: 'BB',
    name: 'Bollinger Bands (20, 2.0)',
    category: 'volatility',
    overlay: true,
    defaultParams: { length: 20, mult: 2 },
    defaultColor: '#10b981',
    description: 'Upper and lower volatility envelopes derived from standard deviations around 20 SMA.',
  },
  {
    type: 'SUPERTREND',
    name: 'Supertrend Indicator (10, 3)',
    category: 'trend',
    overlay: true,
    defaultParams: { period: 10, multiplier: 3 },
    defaultColor: '#06b6d4',
    description: 'Trend-following indicator incorporating ATR for dynamic trailing stop and entry signals.',
  },
  {
    type: 'VWAP',
    name: 'Volume Weighted Average Price (VWAP)',
    category: 'volume',
    overlay: true,
    defaultParams: { anchor: 'Session' },
    defaultColor: '#ec4899',
    description: 'Institutional benchmark giving the average price benchmarked against total traded volume.',
  },
  {
    type: 'RSI',
    name: 'Relative Strength Index (RSI 14)',
    category: 'momentum',
    overlay: false,
    defaultParams: { length: 14, overbought: 70, oversold: 30 },
    defaultColor: '#a855f7',
    description: 'Momentum oscillator measuring the speed and change of price moves (0-100).',
  },
  {
    type: 'MACD',
    name: 'Moving Average Convergence Divergence (MACD)',
    category: 'momentum',
    overlay: false,
    defaultParams: { fast: 12, slow: 26, signal: 9 },
    defaultColor: '#3b82f6',
    description: 'Relationship between two exponential moving averages plotted with signal line and histogram.',
  },
  {
    type: 'STOCH',
    name: 'Stochastic Oscillator (14, 3, 3)',
    category: 'momentum',
    overlay: false,
    defaultParams: { k: 14, d: 3, smooth: 3 },
    defaultColor: '#eab308',
    description: 'Compares a particular closing price to a range of its prices over a certain period.',
  },
  {
    type: 'ATR',
    name: 'Average True Range (ATR 14)',
    category: 'volatility',
    overlay: false,
    defaultParams: { length: 14 },
    defaultColor: '#ef4444',
    description: 'Technical analysis volatility indicator measuring market volatility over 14 bars.',
  },
  {
    type: 'ICHIMOKU',
    name: 'Ichimoku Cloud (9, 26, 52)',
    category: 'trend',
    overlay: true,
    defaultParams: { tenkan: 9, kijun: 26, senkouB: 52 },
    defaultColor: '#10b981',
    description: 'Comprehensive indicator defining support and resistance, identifying trend direction, and gauging momentum.',
  },
  {
    type: 'PSAR',
    name: 'Parabolic SAR (0.02, 0.2)',
    category: 'trend',
    overlay: true,
    defaultParams: { step: 0.02, maxStep: 0.2 },
    defaultColor: '#f59e0b',
    description: 'Price and time-based trailing stop and reversal system plotted as dots around candles.',
  },
  {
    type: 'ADX',
    name: 'Average Directional Index (ADX 14)',
    category: 'trend',
    overlay: false,
    defaultParams: { length: 14 },
    defaultColor: '#8b5cf6',
    description: 'Quantifies trend strength regardless of trend direction (values > 25 indicate strong trend).',
  },
  {
    type: 'CCI',
    name: 'Commodity Channel Index (CCI 20)',
    category: 'momentum',
    overlay: false,
    defaultParams: { length: 20 },
    defaultColor: '#06b6d4',
    description: 'Versatile momentum-based oscillator used to identify overbought and oversold price levels.',
  },
  {
    type: 'OBV',
    name: 'On Balance Volume (OBV)',
    category: 'volume',
    overlay: false,
    defaultParams: {},
    defaultColor: '#22c55e',
    description: 'Cumulative volume indicator relating volume flow to price changes to predict market breakouts.',
  },
  {
    type: 'WILLIAMS_R',
    name: 'Williams %R (14)',
    category: 'momentum',
    overlay: false,
    defaultParams: { length: 14 },
    defaultColor: '#ec4899',
    description: 'Momentum indicator that moves between 0 and -100, measuring overbought and oversold levels.',
  },
];

export const IndicatorsModal: React.FC<IndicatorsModalProps> = ({
  isOpen,
  onClose,
  indicators,
  onToggleIndicator,
  onUpdateParams,
  onApplyTemplate,
  language = 'en',
}) => {
  const isId = language === 'id';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filtered = AVAILABLE_INDICATORS.filter((ind) => {
    if (selectedCategory !== 'all' && ind.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return ind.name.toLowerCase().includes(q) || ind.description.toLowerCase().includes(q);
    }
    return true;
  });

  const isApplied = (type: IndicatorType) => {
    return indicators.some((i) => i.type === type && i.visible);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#12141a] border border-[#232733] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Top Header */}
        <div className="p-4 border-b border-[#1f2430] flex items-center justify-between bg-[#161a22]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2962ff]/10 border border-[#2962ff]/30 flex items-center justify-center text-[#2962ff]">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isId ? 'Indikator, Metrik & Strategi' : 'Indicators, Metrics & Strategies'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                {isId ? 'Pilih dan pasang formula analisis teknikal ke chart' : 'Overlay technical formulas directly onto the chart'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#202738] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Indicator Templates Bar */}
        <div className="px-4 py-2 bg-[#0e1015] border-b border-[#1f2430] flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-neutral-500 font-semibold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{isId ? 'Preset Template:' : 'Presets:'}</span>
          </span>
          {[
            { id: 'trend', label: isId ? 'Trend Following (EMA + Supertrend)' : 'Trend Following' },
            { id: 'scalp', label: isId ? 'Scalper Pro (EMA 20 + RSI)' : 'Scalper Setup' },
            { id: 'volatility', label: isId ? 'Volatility Breakout (BB + ATR)' : 'Volatility Breakout' },
            { id: 'default', label: isId ? 'Reset Default' : 'Default' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => onApplyTemplate(t.id)}
              className="px-2.5 py-1 rounded-lg bg-[#181d28] hover:bg-[#222938] text-neutral-300 hover:text-white border border-[#252c3c] whitespace-nowrap cursor-pointer transition-colors"
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="p-3 border-b border-[#1f2430] flex flex-wrap items-center gap-2 bg-[#141720]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isId ? 'Cari indikator (SMA, RSI, MACD, Bollinger)...' : 'Search indicators (SMA, RSI, MACD, Bollinger)...'}
              className="w-full bg-[#1b202c] border border-[#283042] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#2962ff]"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            {['all', 'trend', 'momentum', 'volatility', 'volume'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-colors cursor-pointer text-[11px] font-semibold ${
                  selectedCategory === cat
                    ? 'bg-[#2962ff] text-white'
                    : 'text-neutral-400 hover:text-white bg-[#1b202c]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Indicators List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-[#1e2330] text-xs">
          {filtered.map((item) => {
            const active = isApplied(item.type);
            const activeInd = indicators.find((i) => i.type === item.type);
            return (
              <div key={item.type} className="py-3 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: activeInd?.color || item.defaultColor }}
                    />
                    <span className="font-bold text-white text-xs sm:text-sm">{item.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded uppercase bg-[#1e2432] text-neutral-400">
                      {item.category}
                    </span>
                    {item.overlay ? (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                        Overlay
                      </span>
                    ) : (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-purple-950/60 text-purple-400 border border-purple-800/40">
                        Sub-Panel
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (activeInd) {
                        onToggleIndicator(activeInd.id);
                      } else {
                        onToggleIndicator(item.type);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-[#1e2432] text-neutral-300 hover:text-white hover:bg-[#283042] border border-[#2a3346]'
                    }`}
                  >
                    {active ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{isId ? 'Terpasang' : 'Applied'}</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isId ? 'Pasang' : 'Apply'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1f2430] bg-[#141720] flex items-center justify-between text-xs text-neutral-400">
          <span>
            {indicators.filter((i) => i.visible).length} {isId ? 'Indikator aktif di chart' : 'indicators active on chart'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#2962ff] hover:bg-[#1e54e4] text-white font-bold transition-colors cursor-pointer"
          >
            {isId ? 'Selesai' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};
