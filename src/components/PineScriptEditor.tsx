import React, { useState } from 'react';
import {
  Code,
  Play,
  Save,
  CheckCircle,
  AlertCircle,
  FileCode,
  Copy,
  Check,
  RefreshCw,
  Terminal,
  TrendingUp,
  BarChart2,
  ListFilter,
  DollarSign,
  Percent,
} from 'lucide-react';
import { PineScriptItem, Language, CandleData } from '../types';
import { executePineScript, PineExecutionResult, StrategyReport } from '../utils/pineScriptEngine';

interface PineScriptEditorProps {
  language: Language;
  candles?: CandleData[];
  onApplyScriptToChart?: (script: PineScriptItem, result: PineExecutionResult) => void;
}

const PRESET_PINE_SCRIPTS: PineScriptItem[] = [
  {
    id: 'pine-1',
    title: 'Dual EMA Golden Cross Strategy (v5)',
    code: `//@version=5
strategy("Dual EMA Crossover", overlay=true, initial_capital=10000)

fast_len = 14
slow_len = 28

fast_ema = ta.ema(close, 14)
slow_ema = ta.ema(close, 28)

plot(fast_ema, title="Fast EMA 14", color=color.cyan, linewidth=2)
plot(slow_ema, title="Slow EMA 28", color=color.orange, linewidth=2)

longCondition = ta.crossover(fast_ema, slow_ema)
if (longCondition)
    strategy.entry("Long", strategy.long)

shortCondition = ta.crossunder(fast_ema, slow_ema)
if (shortCondition)
    strategy.entry("Short", strategy.short)
`,
    isApplied: true,
    lastCompiled: 'Baru saja',
    status: 'ok',
    consoleOutput: [
      '[PINE RUNTIME v5] Initialized environment: Pine Script v5 Quant Engine.',
      '[PINE RUNTIME v5] Fast EMA 14 & Slow EMA 28 parsed successfully.',
      '[PINE RUNTIME v5] Strategy orders active on chart overlay.',
    ],
  },
  {
    id: 'pine-2',
    title: 'RSI Momentum Swing Strategy (14)',
    code: `//@version=5
strategy("RSI Swing Strategy", overlay=true)

rsi_val = ta.rsi(close, 14)
fast_ma = ta.sma(close, 20)

plot(fast_ma, title="Baseline SMA 20", color=color.blue, linewidth=2)

// Long when RSI crosses above 40 with bullish close
longCondition = ta.crossover(close, fast_ma)
if (longCondition)
    strategy.entry("Long", strategy.long)

shortCondition = ta.crossunder(close, fast_ma)
if (shortCondition)
    strategy.entry("Short", strategy.short)
`,
    isApplied: false,
    status: 'idle',
    consoleOutput: ['[PINE RUNTIME v5] Script ready for compilation.'],
  },
  {
    id: 'pine-3',
    title: 'ATR Dynamic Volatility Bands',
    code: `//@version=5
indicator("ATR Volatility Channel", overlay=true)

length = 20
mult = 2.0

basis = ta.sma(close, 20)
atr_val = ta.atr(14)

plot(basis, title="Basis 20", color=color.purple, linewidth=2)
`,
    isApplied: false,
    status: 'idle',
    consoleOutput: ['[PINE RUNTIME v5] Script ready for compilation.'],
  },
];

export const PineScriptEditor: React.FC<PineScriptEditorProps> = ({
  language = 'en',
  candles = [],
  onApplyScriptToChart,
}) => {
  const isId = language === 'id';
  const [scripts, setScripts] = useState<PineScriptItem[]>(PRESET_PINE_SCRIPTS);
  const [activeScriptId, setActiveScriptId] = useState<string>(scripts[0].id);
  const [copied, setCopied] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'console' | 'tester'>('tester');
  const [lastStrategyReport, setLastStrategyReport] = useState<StrategyReport | null>(null);

  const activeScript = scripts.find((s) => s.id === activeScriptId) || scripts[0];

  const handleCodeChange = (newCode: string) => {
    setScripts((prev) =>
      prev.map((s) => (s.id === activeScript.id ? { ...s, code: newCode } : s))
    );
  };

  const handleCompile = () => {
    setIsCompiling(true);

    setTimeout(() => {
      // Execute the real Pine Script mini interpreter against current candles
      const result = executePineScript(activeScript.code, candles);

      setScripts((prev) =>
        prev.map((s) =>
          s.id === activeScript.id
            ? {
                ...s,
                isApplied: result.status === 'ok',
                status: result.status,
                lastCompiled: 'Just now',
                consoleOutput: result.logs,
              }
            : s
        )
      );

      if (result.strategyReport) {
        setLastStrategyReport(result.strategyReport);
      }

      setIsCompiling(false);
      onApplyScriptToChart?.(activeScript, result);
    }, 250);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText?.(activeScript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b0e14] border border-[#1b2336] rounded-xl overflow-hidden shadow-xl select-none">
      {/* Editor Top Bar */}
      <div className="px-3 sm:px-4 py-2 bg-[#10141f] border-b border-[#1a2234] flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2962ff]/20 text-[#2962ff] flex items-center justify-center">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                TradingView Pine Script™ Editor v5
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                activeScript.status === 'ok'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-neutral-800 text-neutral-400'
              }`}>
                {activeScript.isApplied ? 'ACTIVE ON CHART' : 'DRAFT'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">
              {isId
                ? 'Mini Interpreter Pine v5: ta.sma, ta.ema, ta.rsi, ta.atr, plot(), strategy.entry()'
                : 'Pine v5 Engine: supports ta.sma, ta.ema, ta.rsi, ta.atr, plot(), strategy.entry()'}
            </p>
          </div>
        </div>

        {/* Script Selection Dropdown & Actions */}
        <div className="flex items-center gap-2">
          <select
            value={activeScriptId}
            onChange={(e) => setActiveScriptId(e.target.value)}
            className="bg-[#182133] border border-[#25324b] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#2962ff] cursor-pointer"
          >
            {scripts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg bg-[#182133] hover:bg-[#202b40] text-neutral-300 hover:text-white border border-[#25324b] transition-colors cursor-pointer"
            title="Copy Pine Script"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="px-3.5 py-1 rounded-lg bg-[#2962ff] hover:bg-[#1e54e4] active:scale-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-900/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {isCompiling ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isId ? 'Jalankan / Kompilasi' : 'Execute & Backtest'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body: Line numbers + Codearea */}
      <div className="h-44 sm:h-52 flex overflow-hidden border-b border-[#182133]">
        {/* Line Numbers */}
        <div className="w-9 bg-[#090c12] border-r border-[#161d2c] py-2.5 text-right pr-2 text-neutral-600 font-mono text-xs select-none leading-relaxed">
          {activeScript.code.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <div className="flex-1 p-2.5 bg-[#0b0e14] overflow-auto">
          <textarea
            value={activeScript.code}
            onChange={(e) => handleCodeChange(e.target.value)}
            spellCheck={false}
            className="w-full h-full bg-transparent text-emerald-300 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-blue-600/40"
          />
        </div>
      </div>

      {/* Bottom Panel: Subtabs (Strategy Tester vs Console Logs) */}
      <div className="flex-1 flex flex-col bg-[#090c12] overflow-hidden min-h-[140px]">
        {/* Subtab bar */}
        <div className="px-3 py-1 bg-[#0f1420] border-b border-[#182234] flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveSubTab('tester')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'tester'
                  ? 'bg-[#1e293b] text-cyan-300'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Strategy Tester (Backtest Report)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('console')}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'console'
                  ? 'bg-[#1e293b] text-cyan-300'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Console Logs</span>
            </button>
          </div>

          <span className="text-[10px] text-neutral-500 font-mono">
            {candles.length} Historical Bars Processed
          </span>
        </div>

        {/* Subtab Content */}
        {activeSubTab === 'tester' ? (
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {lastStrategyReport ? (
              <>
                {/* 4 Performance Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#101624] border border-[#1b263b] text-xs">
                    <span className="text-neutral-400 text-[10px] block font-medium">Net Profit</span>
                    <span className={`text-sm sm:text-base font-bold font-mono ${
                      lastStrategyReport.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {lastStrategyReport.netProfit >= 0 ? '+' : ''}${lastStrategyReport.netProfit.toLocaleString()} ({lastStrategyReport.netProfitPercent}%)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#101624] border border-[#1b263b] text-xs">
                    <span className="text-neutral-400 text-[10px] block font-medium">Win Rate</span>
                    <span className="text-sm sm:text-base font-bold font-mono text-cyan-300">
                      {lastStrategyReport.winRate}% ({lastStrategyReport.winningTrades}/{lastStrategyReport.totalTrades} W)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#101624] border border-[#1b263b] text-xs">
                    <span className="text-neutral-400 text-[10px] block font-medium">Profit Factor</span>
                    <span className="text-sm sm:text-base font-bold font-mono text-amber-300">
                      {lastStrategyReport.profitFactor.toFixed(2)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#101624] border border-[#1b263b] text-xs">
                    <span className="text-neutral-400 text-[10px] block font-medium">Max Drawdown</span>
                    <span className="text-sm sm:text-base font-bold font-mono text-rose-400">
                      -{lastStrategyReport.maxDrawdownPercent}%
                    </span>
                  </div>
                </div>

                {/* Trade List Ledger Table */}
                <div className="rounded-xl border border-[#182336] overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#121928] text-neutral-400 text-[10px] uppercase">
                      <tr>
                        <th className="py-1.5 px-3">#</th>
                        <th className="py-1.5 px-3">Type</th>
                        <th className="py-1.5 px-3">Entry Time</th>
                        <th className="py-1.5 px-3">Entry Price</th>
                        <th className="py-1.5 px-3">Exit Price</th>
                        <th className="py-1.5 px-3 text-right">P&L ($)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#162033]">
                      {lastStrategyReport.trades.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-4 text-center text-neutral-500 text-[11px]">
                            No trades triggered in this timeframe window.
                          </td>
                        </tr>
                      ) : (
                        lastStrategyReport.trades.map((trd, i) => (
                          <tr key={trd.id} className="hover:bg-[#131c2d]/50 text-[11px]">
                            <td className="py-1 px-3 text-neutral-500">{i + 1}</td>
                            <td className="py-1 px-3">
                              <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                                trd.type === 'BUY'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-rose-500/20 text-rose-400'
                              }`}>
                                {trd.type}
                              </span>
                            </td>
                            <td className="py-1 px-3 text-neutral-300">{trd.entryTime}</td>
                            <td className="py-1 px-3 text-neutral-200">{trd.entryPrice.toFixed(2)}</td>
                            <td className="py-1 px-3 text-neutral-200">{trd.exitPrice ? trd.exitPrice.toFixed(2) : 'Open'}</td>
                            <td className={`py-1 px-3 text-right font-bold ${
                              (trd.pnlDollar || 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {(trd.pnlDollar || 0) >= 0 ? '+' : ''}
                              {(trd.pnlDollar || 0).toFixed(2)} ({(trd.pnlPercent || 0).toFixed(1)}%)
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-neutral-500 text-xs">
                <BarChart2 className="w-8 h-8 mx-auto mb-1 opacity-30 text-cyan-400" />
                <p>Klik tombol <strong>"Jalankan / Kompilasi"</strong> di atas untuk menjalankan backtest kuantitatif pada chart aktif.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 p-2.5 overflow-y-auto font-mono text-[11px] space-y-1">
            {activeScript.consoleOutput.map((log, i) => (
              <div
                key={i}
                className={
                  log.includes('[ERROR]')
                    ? 'text-rose-400'
                    : log.includes('successfully') || log.includes('Total Trades')
                    ? 'text-emerald-400 font-semibold'
                    : 'text-neutral-300'
                }
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
