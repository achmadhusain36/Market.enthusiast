import React from 'react';
import { Briefcase, ArrowUpRight, ArrowDownRight, Plus, Minus, ArrowUpDown } from 'lucide-react';
import { PortfolioHolding, StockQuote, CurrencyType } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { MarketLogo, StockCompanyLogo } from './MarketLogo';

interface HoldingsTableProps {
  holdings: PortfolioHolding[];
  stocks: StockQuote[];
  selectedCurrency: CurrencyType;
  onSelectStock: (symbol: string) => void;
  onOpenTrade: (stock: StockQuote, type: 'BUY' | 'SELL') => void;
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  stocks,
  selectedCurrency,
  onSelectStock,
  onOpenTrade,
}) => {
  const stockMap = new Map<string, StockQuote>();
  stocks.forEach((s) => stockMap.set(s.symbol, s));

  return (
    <div id="holdings-table-panel" className="bg-[#0b0f19] border border-[#1b2336] rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-[#182033] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#141d2e] border border-[#22304c] flex items-center justify-center text-cyan-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Portofolio Saham Dimiliki
            </h3>
            <p className="text-xs text-neutral-400">
              Posisi aktif Achmad Husain di pasar ekuitas global
            </p>
          </div>
        </div>
        <span className="text-xs font-mono-num text-neutral-400">
          Total Posisi: <strong className="text-white">{holdings.length}</strong> Emiten
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#182133]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0e1422] border-b border-[#182133] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3.5">Aset Saham</th>
              <th className="py-3 px-3.5 text-right">Jumlah Lembar</th>
              <th className="py-3 px-3.5 text-right">Harga Rata-rata Beli</th>
              <th className="py-3 px-3.5 text-right">Harga Pasar Global</th>
              <th className="py-3 px-3.5 text-right">Nilai Sekarang</th>
              <th className="py-3 px-3.5 text-right">Unrealized P/L</th>
              <th className="py-3 px-3.5 text-center">Aksi Cepat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141b2b] font-mono-num">
            {holdings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-500 font-sans">
                  Belum ada saham yang dimiliki. Lakukan order beli pada saham global pilihan Anda.
                </td>
              </tr>
            ) : (
              holdings.map((holding) => {
                const stock = stockMap.get(holding.symbol);
                const currentPrice = stock ? stock.price : holding.avgBuyPrice;
                const totalCost = holding.shares * holding.avgBuyPrice;
                const currentValue = holding.shares * currentPrice;
                const pnl = currentValue - totalCost;
                const pnlPercent = totalCost > 0 ? (pnl / totalCost) * 100 : 0;
                const isProfitable = pnl >= 0;
                const isIDX = holding.currency === 'IDR';

                return (
                  <tr
                    key={holding.symbol}
                    className="hover:bg-[#121927] transition-colors group cursor-pointer"
                  >
                    {/* Stock Symbol & Name */}
                    <td
                      className="py-3 px-3.5 whitespace-nowrap"
                      onClick={() => onSelectStock(holding.symbol)}
                    >
                      <div className="flex items-center gap-2.5">
                        <StockCompanyLogo
                          symbol={holding.symbol}
                          market={stock ? stock.market : (holding.currency === 'IDR' ? 'IDX' : 'NASDAQ')}
                          size="md"
                        />
                        <div>
                          <div className="font-bold text-white text-xs group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                            <span>{holding.symbol}</span>
                            <MarketLogo
                              market={stock ? stock.market : (holding.currency === 'IDR' ? 'IDX' : 'NASDAQ')}
                              size="xs"
                              showLabel={true}
                            />
                          </div>
                          <div className="text-[10px] text-neutral-400 font-sans truncate max-w-[130px]">
                            {holding.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Shares */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <span className="text-white font-bold">
                        {holding.shares.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-400 ml-1">
                        {isIDX ? `(${holding.shares / 100} lot)` : 'lbr'}
                      </span>
                    </td>

                    {/* Avg Buy Price */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap text-neutral-300">
                      {formatCurrency(holding.avgBuyPrice, holding.currency)}
                    </td>

                    {/* Current Global Price */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="text-white font-bold">
                        {formatCurrency(currentPrice, holding.currency)}
                      </div>
                      {stock && (
                        <div className={`text-[10px] ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {stock.change >= 0 ? '+' : ''}{formatPercent(stock.changePercent)}
                        </div>
                      )}
                    </td>

                    {/* Current Total Value */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap font-bold text-white">
                      {formatCurrency(currentValue, holding.currency)}
                    </td>

                    {/* P/L */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className={`font-bold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isProfitable ? '+' : ''}{formatCurrency(pnl, holding.currency)}
                      </div>
                      <div className={`text-[10px] font-semibold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatPercent(pnlPercent)}
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-3.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (stock) onOpenTrade(stock, 'BUY');
                          }}
                          title="Beli Tambah Saham Ini"
                          className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (stock) onOpenTrade(stock, 'SELL');
                          }}
                          title="Jual Posisi Saham Ini"
                          className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white transition-all cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
