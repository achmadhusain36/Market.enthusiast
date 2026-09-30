import React from 'react';
import { Briefcase, ArrowUpRight, ArrowDownRight, Plus, Minus, ArrowUpDown } from 'lucide-react';
import { PortfolioHolding, StockQuote, CurrencyType, Language, MarketType } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { MarketLogo, StockCompanyLogo } from './MarketLogo';

interface HoldingsTableProps {
  holdings: PortfolioHolding[];
  stocks: StockQuote[];
  selectedCurrency: CurrencyType;
  language?: Language;
  onSelectStock: (symbol: string) => void;
  onOpenTrade: (stock: StockQuote, type: 'BUY' | 'SELL') => void;
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({
  holdings,
  stocks,
  selectedCurrency,
  language = 'en',
  onSelectStock,
  onOpenTrade,
}) => {
  const isId = language === 'id';
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
              {isId ? 'Portofolio Saham Dimiliki' : 'Current Stock Holdings'}
            </h3>
            <p className="text-xs text-neutral-400">
              {isId ? 'Posisi aktif Achmad Husain di pasar ekuitas global' : 'Active equity positions in global and IDX markets'}
            </p>
          </div>
        </div>
        <span className="text-xs font-mono-num text-neutral-400">
          {isId ? 'Total Posisi:' : 'Total Holdings:'} <strong className="text-white">{holdings.length}</strong> {isId ? 'Emiten' : 'Stocks'}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[#182133]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0e1422] border-b border-[#182133] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3.5">{isId ? 'Aset Saham' : 'Stock Asset'}</th>
              <th className="py-3 px-3.5 text-right">{isId ? 'Jumlah Lembar' : 'Shares / Lots'}</th>
              <th className="py-3 px-3.5 text-right">{isId ? 'Harga Rata-rata Beli' : 'Avg Buy Price'}</th>
              <th className="py-3 px-3.5 text-right">{isId ? 'Harga Pasar Global' : 'Market Price'}</th>
              <th className="py-3 px-3.5 text-right">{isId ? 'Nilai Sekarang' : 'Market Value'}</th>
              <th className="py-3 px-3.5 text-right">Unrealized P/L</th>
              <th className="py-3 px-3.5 text-center">{isId ? 'Aksi Cepat' : 'Trade'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141b2b] font-mono-num">
            {holdings.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-neutral-500 font-sans">
                  {isId
                    ? 'Belum ada saham yang dimiliki. Lakukan order beli pada saham global pilihan Anda.'
                    : 'No stocks currently held. Explore and buy shares from the global markets.'}
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
                const targetQuote: StockQuote = stock || {
                  symbol: holding.symbol,
                  name: holding.name,
                  price: holding.avgBuyPrice,
                  change: 0,
                  changePercent: 0,
                  high: holding.avgBuyPrice,
                  low: holding.avgBuyPrice,
                  previousClose: holding.avgBuyPrice,
                  volume: 1000000,
                  marketCap: 'N/A',
                  peRatio: 15,
                  sparkline: [holding.avgBuyPrice, holding.avgBuyPrice],
                  lastUpdated: 'Live',
                  market: (holding.currency === 'IDR' ? 'IDX' : 'NASDAQ') as MarketType,
                  currency: holding.currency,
                  sector: 'Equities',
                };

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
                        {isIDX ? `(${holding.shares / 100} lot)` : (isId ? 'lbr' : 'shrs')}
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
                            onOpenTrade(targetQuote, 'BUY');
                          }}
                          title={isId ? 'Beli Tambah Saham Ini' : 'Buy More Shares'}
                          className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenTrade(targetQuote, 'SELL');
                          }}
                          title={isId ? 'Jual Posisi Saham Ini' : 'Sell Position'}
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
