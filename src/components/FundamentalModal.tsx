import React, { useState } from 'react';
import {
  X,
  Building2,
  TrendingUp,
  DollarSign,
  PieChart,
  FileSpreadsheet,
  Globe,
  ExternalLink,
  Percent,
  Layers,
  Scale,
} from 'lucide-react';
import { StockQuote, Language } from '../types';
import { getCompanyFinancials } from '../data/marketTerminalData';

interface FundamentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: StockQuote;
  language: Language;
}

export const FundamentalModal: React.FC<FundamentalModalProps> = ({
  isOpen,
  onClose,
  stock,
  language = 'en',
}) => {
  const isId = language === 'id';
  const [activeTab, setActiveTab] = useState<'overview' | 'income' | 'balance' | 'cashflow'>('overview');
  const [periodType, setPeriodType] = useState<'annual' | 'quarterly'>('annual');

  if (!isOpen) return null;

  const data = getCompanyFinancials(stock.symbol);

  // Helper for max value in bar charts
  const maxRevenue = Math.max(...data.incomeStatement.map((s) => s.revenue), 1);
  const maxAssets = Math.max(...data.balanceSheet.map((s) => s.totalAssets), 1);
  const maxCashFlow = Math.max(...data.cashFlow.map((s) => s.operatingCashFlow), 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#12141a] border border-[#232733] w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#1f2430] flex items-center justify-between bg-[#161a22]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base">
              {stock.symbol.slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">{data.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-[#202738] text-cyan-300 font-mono font-bold">
                  {stock.symbol}
                </span>
                <span className="text-xs text-neutral-400">({stock.market})</span>
              </div>
              <p className="text-xs text-neutral-400">
                {data.sector} • {data.industry}
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

        {/* Tab Switcher */}
        <div className="px-4 py-2 border-b border-[#1f2430] bg-[#141720] flex items-center justify-between gap-3 overflow-x-auto text-xs">
          <div className="flex items-center gap-1">
            {[
              { id: 'overview', label: isId ? 'Ringkasan & Valuasi' : 'Valuation & Ratios', icon: PieChart },
              { id: 'income', label: isId ? 'Laba Rugi (Income)' : 'Income Statement', icon: TrendingUp },
              { id: 'balance', label: isId ? 'Neraca Keuangan' : 'Balance Sheet', icon: Scale },
              { id: 'cashflow', label: isId ? 'Arus Kas (Cash Flow)' : 'Cash Flow', icon: DollarSign },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#2962ff] text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white hover:bg-[#1b212f]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center bg-[#1b212f] rounded-lg p-0.5 border border-[#262e40] text-[11px] font-semibold">
            <button
              onClick={() => setPeriodType('annual')}
              className={`px-2 py-0.5 rounded transition-colors ${
                periodType === 'annual' ? 'bg-[#2962ff] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isId ? 'Tahunan' : 'Annual'}
            </button>
            <button
              onClick={() => setPeriodType('quarterly')}
              className={`px-2 py-0.5 rounded transition-colors ${
                periodType === 'quarterly' ? 'bg-[#2962ff] text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              {isId ? 'Kuartalan' : 'Quarterly'}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* TAB 1: OVERVIEW & RATIOS */}
          {activeTab === 'overview' && (
            <>
              {/* Summary Description */}
              <div className="p-3.5 rounded-xl bg-[#161a22] border border-[#212634] text-neutral-300 leading-relaxed text-xs">
                <p>{data.summary}</p>
                <div className="mt-3 pt-3 border-t border-[#212634] grid grid-cols-2 sm:grid-cols-4 gap-2 text-neutral-400 text-[11px]">
                  <div>
                    <span className="text-neutral-500">CEO: </span>
                    <span className="text-white font-medium">{data.ceo}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{isId ? 'Didirikan: ' : 'Founded: '}</span>
                    <span className="text-white font-medium">{data.founded}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">{isId ? 'Karyawan: ' : 'Employees: '}</span>
                    <span className="text-white font-medium">{data.employees}</span>
                  </div>
                  <div>
                    <a
                      href={data.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      <span>{isId ? 'Situs Resmi' : 'Website'}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Valuation Metrics Grid */}
              <div>
                <h4 className="font-bold text-white mb-2.5 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-cyan-400" />
                  <span>{isId ? 'Rasio Valuasi Kunci' : 'Key Valuation Multiples'}</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'P/E Ratio (TTM)', val: `${data.valuation.pe}x`, highlight: true },
                    { label: 'Forward P/E', val: `${data.valuation.forwardPe}x` },
                    { label: 'P/B Ratio', val: `${data.valuation.pb}x` },
                    { label: 'EV / EBITDA', val: `${data.valuation.evEbitda}x` },
                    { label: 'Dividend Yield', val: `${data.valuation.dividendYield}%`, color: 'text-emerald-400' },
                    { label: 'Payout Ratio', val: `${data.valuation.payoutRatio}%` },
                    { label: 'PEG Ratio', val: `${data.valuation.peg}x` },
                    { label: 'Market Cap', val: data.valuation.marketCap, fontBold: true },
                  ].map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#161a22] border border-[#212634] flex flex-col justify-between"
                    >
                      <span className="text-[11px] text-neutral-400">{m.label}</span>
                      <span
                        className={`text-sm sm:text-base font-extrabold font-mono mt-1 ${
                          m.color || (m.highlight ? 'text-cyan-300' : 'text-white')
                        }`}
                      >
                        {m.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profitability Metrics */}
              <div>
                <h4 className="font-bold text-white mb-2.5 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>{isId ? 'Profitabilitas & Margin' : 'Profitability & Returns'}</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Return on Equity (ROE)', val: `${data.profitability.roe}%`, color: 'text-emerald-400' },
                    { label: 'Return on Assets (ROA)', val: `${data.profitability.roa}%` },
                    { label: 'ROIC (Capital)', val: `${data.profitability.roic}%` },
                    { label: 'Gross Margin', val: `${data.profitability.grossMargin}%` },
                    { label: 'Operating Margin', val: `${data.profitability.operatingMargin}%` },
                    { label: 'Net Profit Margin', val: `${data.profitability.netMargin}%`, color: 'text-cyan-300' },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#161a22] border border-[#212634] flex flex-col justify-between"
                    >
                      <span className="text-[11px] text-neutral-400">{p.label}</span>
                      <span className={`text-base font-extrabold font-mono mt-1 ${p.color || 'text-white'}`}>
                        {p.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: INCOME STATEMENT */}
          {activeTab === 'income' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white">{isId ? 'Laporan Laba Rugi' : 'Income Statement'} (Miliar / Juta)</h4>
                <span className="text-[11px] text-neutral-400">{isId ? 'Performa Historis' : 'Historical Performance'}</span>
              </div>

              {/* Visual Revenue & Net Income Bars */}
              <div className="p-4 rounded-xl bg-[#161a22] border border-[#212634] space-y-4">
                {data.incomeStatement.map((period) => {
                  const revPercent = Math.min(100, (period.revenue / maxRevenue) * 100);
                  const netPercent = Math.min(100, (period.netIncome / maxRevenue) * 100);
                  return (
                    <div key={period.period} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-white font-mono">{period.period}</span>
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="text-cyan-300">
                            Rev: {period.revenue.toLocaleString()}
                          </span>
                          <span className="text-emerald-400">
                            Net: {period.netIncome.toLocaleString()}
                          </span>
                          <span className="text-neutral-400">EPS: {period.eps}</span>
                        </div>
                      </div>
                      {/* Bar tracks */}
                      <div className="h-3.5 bg-[#0f1218] rounded-full overflow-hidden flex flex-col gap-0.5 p-0.5">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all"
                          style={{ width: `${revPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tabular format */}
              <div className="overflow-x-auto rounded-xl border border-[#212634]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#181d28] text-neutral-400">
                    <tr>
                      <th className="p-2.5">{isId ? 'Metrik' : 'Metric'}</th>
                      {data.incomeStatement.map((s) => (
                        <th key={s.period} className="p-2.5 text-right">
                          {s.period}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202636] bg-[#141720]">
                    <tr>
                      <td className="p-2.5 text-neutral-300 font-sans">{isId ? 'Pendapatan (Revenue)' : 'Revenue'}</td>
                      {data.incomeStatement.map((s) => (
                        <td key={s.period} className="p-2.5 text-right text-cyan-300">
                          {s.revenue.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 text-neutral-300 font-sans">{isId ? 'Laba Kotor (Gross Profit)' : 'Gross Profit'}</td>
                      {data.incomeStatement.map((s) => (
                        <td key={s.period} className="p-2.5 text-right text-neutral-200">
                          {s.grossProfit.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 text-neutral-300 font-sans">{isId ? 'Laba Operasional' : 'Operating Income'}</td>
                      {data.incomeStatement.map((s) => (
                        <td key={s.period} className="p-2.5 text-right text-neutral-200">
                          {s.operatingIncome.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 text-neutral-300 font-sans font-bold">{isId ? 'Laba Bersih (Net Income)' : 'Net Income'}</td>
                      {data.incomeStatement.map((s) => (
                        <td key={s.period} className="p-2.5 text-right font-bold text-emerald-400">
                          {s.netIncome.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: BALANCE SHEET */}
          {activeTab === 'balance' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white">{isId ? 'Neraca Keuangan (Assets vs Liabilities)' : 'Balance Sheet Breakdown'}</h4>
              <div className="overflow-x-auto rounded-xl border border-[#212634]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#181d28] text-neutral-400">
                    <tr>
                      <th className="p-2.5">{isId ? 'Item Neraca' : 'Balance Item'}</th>
                      {data.balanceSheet.map((b) => (
                        <th key={b.period} className="p-2.5 text-right">
                          {b.period}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202636] bg-[#141720]">
                    <tr>
                      <td className="p-2.5 text-neutral-300 font-sans">{isId ? 'Kas & Setara Kas' : 'Cash & Equivalents'}</td>
                      {data.balanceSheet.map((b) => (
                        <td key={b.period} className="p-2.5 text-right text-emerald-400">
                          {b.cash.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 text-neutral-300 font-sans">{isId ? 'Total Aset' : 'Total Assets'}</td>
                      {data.balanceSheet.map((b) => (
                        <td key={b.period} className="p-2.5 text-right text-cyan-300">
                          {b.totalAssets.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 text-neutral-300 font-sans">{isId ? 'Total Utang (Debt)' : 'Total Debt'}</td>
                      {data.balanceSheet.map((b) => (
                        <td key={b.period} className="p-2.5 text-right text-rose-400">
                          {b.totalDebt.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 text-neutral-300 font-sans font-bold">{isId ? 'Total Ekuitas' : 'Total Equity'}</td>
                      {data.balanceSheet.map((b) => (
                        <td key={b.period} className="p-2.5 text-right font-bold text-white">
                          {b.totalEquity.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 text-neutral-400 font-sans">{isId ? 'Debt to Equity Ratio' : 'Debt to Equity'}</td>
                      {data.balanceSheet.map((b) => (
                        <td key={b.period} className="p-2.5 text-right text-neutral-300">
                          {b.debtToEquity.toFixed(2)}x
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: CASH FLOW */}
          {activeTab === 'cashflow' && (
            <div className="space-y-4">
              <h4 className="font-bold text-white">{isId ? 'Laporan Arus Kas (Cash Flow)' : 'Free Cash Flow Profile'}</h4>
              <div className="overflow-x-auto rounded-xl border border-[#212634]">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#181d28] text-neutral-400">
                    <tr>
                      <th className="p-2.5">{isId ? 'Aktivitas Arus Kas' : 'Cash Flow Activity'}</th>
                      {data.cashFlow.map((c) => (
                        <th key={c.period} className="p-2.5 text-right">
                          {c.period}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202636] bg-[#141720]">
                    <tr>
                      <td className="p-2.5 text-neutral-300 font-sans">{isId ? 'Arus Kas Operasional' : 'Operating Cash Flow'}</td>
                      {data.cashFlow.map((c) => (
                        <td key={c.period} className="p-2.5 text-right text-emerald-400">
                          +{c.operatingCashFlow.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 text-neutral-300 font-sans">{isId ? 'Belanja Modal (CapEx)' : 'Capital Expenditure (CapEx)'}</td>
                      {data.cashFlow.map((c) => (
                        <td key={c.period} className="p-2.5 text-right text-rose-400">
                          -{c.capex.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-2.5 text-neutral-300 font-sans font-bold">{isId ? 'Arus Kas Bebas (FCF)' : 'Free Cash Flow (FCF)'}</td>
                      {data.cashFlow.map((c) => (
                        <td key={c.period} className="p-2.5 text-right font-bold text-cyan-300">
                          +{c.freeCashFlow.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#1f2430] bg-[#141720] flex items-center justify-between text-xs text-neutral-400">
          <span>{isId ? 'Data audit resmi Bursa Efek & SEC Filings' : 'Official exchange audited reports & SEC filings'}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-[#2962ff] hover:bg-[#1e54e4] text-white font-bold transition-colors cursor-pointer"
          >
            {isId ? 'Tutup' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
