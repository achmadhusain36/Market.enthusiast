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
  Sparkles,
} from 'lucide-react';
import { PineScriptItem, Language } from '../types';
import { INITIAL_PINE_SCRIPTS } from '../data/marketTerminalData';

interface PineScriptEditorProps {
  language: Language;
  onApplyScriptToChart?: (script: PineScriptItem) => void;
}

export const PineScriptEditor: React.FC<PineScriptEditorProps> = ({
  language = 'en',
  onApplyScriptToChart,
}) => {
  const isId = language === 'id';
  const [scripts, setScripts] = useState<PineScriptItem[]>(INITIAL_PINE_SCRIPTS);
  const [activeScriptId, setActiveScriptId] = useState<string>(scripts[0].id);
  const [copied, setCopied] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  const activeScript = scripts.find((s) => s.id === activeScriptId) || scripts[0];

  const handleCodeChange = (newCode: string) => {
    setScripts((prev) =>
      prev.map((s) => (s.id === activeScript.id ? { ...s, code: newCode } : s))
    );
  };

  const handleCompile = () => {
    setIsCompiling(true);
    setTimeout(() => {
      const nowStr = new Date().toLocaleTimeString();
      const newLogs = [
        `[PINE RUNTIME v5 @ ${nowStr}] Parsing "${activeScript.title}"...`,
        `[PINE RUNTIME v5] Type checking: 0 errors, 0 warnings.`,
        `[PINE RUNTIME v5] Script successfully compiled & applied to chart engine.`,
      ];

      setScripts((prev) =>
        prev.map((s) =>
          s.id === activeScript.id
            ? {
                ...s,
                isApplied: true,
                status: 'ok',
                lastCompiled: 'Just now',
                consoleOutput: [...s.consoleOutput, ...newLogs],
              }
            : s
        )
      );

      setIsCompiling(false);
      onApplyScriptToChart?.(activeScript);
    }, 450);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText?.(activeScript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0d1017] border border-[#1e2330] rounded-xl overflow-hidden shadow-xl">
      {/* Editor Top Bar */}
      <div className="px-4 py-2.5 bg-[#141822] border-b border-[#1f2533] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#2962ff]/20 text-[#2962ff] flex items-center justify-center">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide">
                TradingView Pine Script™ Editor v5
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                {activeScript.isApplied ? 'ACTIVE ON CHART' : 'DRAFT'}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">
              {isId
                ? 'Kompilasi skrip kuantitatif & indikator kustom secara instan'
                : 'Write, backtest & compile custom quantitative chart indicators'}
            </p>
          </div>
        </div>

        {/* Script Selection Dropdown & Actions */}
        <div className="flex items-center gap-2">
          <select
            value={activeScriptId}
            onChange={(e) => setActiveScriptId(e.target.value)}
            className="bg-[#1c2230] border border-[#2a3449] rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-[#2962ff] cursor-pointer"
          >
            {scripts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg bg-[#1c2230] hover:bg-[#252f44] text-neutral-300 hover:text-white border border-[#2a3449] transition-colors cursor-pointer"
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
            <span>{isId ? 'Kompilasi ke Chart' : 'Add to Chart'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body: Line numbers + Codearea */}
      <div className="flex-1 flex overflow-hidden min-h-[220px]">
        {/* Line Numbers */}
        <div className="w-10 bg-[#0b0e14] border-r border-[#1a1f2c] py-3 text-right pr-2 text-neutral-600 font-mono text-xs select-none leading-relaxed">
          {activeScript.code.split('\n').map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <div className="flex-1 p-3 bg-[#0d1017] overflow-auto">
          <textarea
            value={activeScript.code}
            onChange={(e) => handleCodeChange(e.target.value)}
            spellCheck={false}
            className="w-full h-full bg-transparent text-emerald-300 font-mono text-xs leading-relaxed outline-none resize-none selection:bg-blue-600/40"
          />
        </div>
      </div>

      {/* Pine Console Terminal */}
      <div className="h-28 bg-[#090b0f] border-t border-[#1a1f2c] flex flex-col font-mono text-[11px]">
        <div className="px-3 py-1 bg-[#10141d] border-b border-[#181d28] flex items-center justify-between text-neutral-400">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3 text-cyan-400" />
            <span className="font-semibold text-neutral-300">Pine Script Console Output</span>
          </div>
          <span className="text-[10px] text-neutral-500">Status: OK</span>
        </div>
        <div className="p-2 overflow-y-auto flex-1 space-y-0.5 text-neutral-400">
          {activeScript.consoleOutput.map((line, idx) => (
            <div
              key={idx}
              className={`${
                line.includes('ACTIVE') || line.includes('successfully')
                  ? 'text-emerald-400'
                  : line.includes('errors')
                  ? 'text-neutral-300'
                  : 'text-neutral-400'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
