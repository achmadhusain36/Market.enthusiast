import React, { useState, useMemo } from 'react';
import { History, Search, ArrowUpRight, ArrowDownRight, Download, Filter, CheckCircle2, RefreshCw, Layers, TrendingUp } from 'lucide-react';
import { Transaction, StockQuote, CurrencyType } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface TransactionHistoryProps {
  transactions: Transaction[];
  stocks: StockQuote[];
  selectedCurrency: CurrencyType;
  isLiveSyncing: boolean;
  onSelectStock: (symbol: string) => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  stocks,
  selectedCurrency,
  isLiveSyncing,
  onSelectStock,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Map symbols to latest live global prices
  const stockPriceMap = useMemo(() => {
    const map = new Map<string, StockQuote>();
    stocks.forEach((s) => map.set(s.symbol, s));
    return map;
  }, [stocks]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((trx) => {
      const matchesType = filterType === 'ALL' || trx.type === filterType;
      const matchesQuery =
        trx.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trx.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [transactions, filterType, searchQuery]);

  // Total summary metrics
  const { totalBuyVolume, totalSellVolume, totalFeesPaid } = useMemo(() => {
    let buyVol = 0;
    let sellVol = 0;
    let fees = 0;

    transactions.forEach((t) => {
      if (t.type === 'BUY') buyVol += t.total;
      if (t.type === 'SELL') sellVol += t.total;
      fees += t.fee;
    });

    return { totalBuyVolume: buyVol, totalSellVolume: sellVol, totalFeesPaid: fees };
  }, [transactions]);

  // Export transactions to CSV
  const handleExportCSV = () => {
    const headers = ['ID Transaksi', 'Tanggal', 'Tipe', 'Simbol', 'Nama', 'Lembar', 'Harga Eksekusi', 'Mata Uang', 'Total', 'Biaya Fee', 'Status'];
    const rows = transactions.map((t) => [
      t.id,
      t.timestamp,
      t.type,
      t.symbol,
      `"${t.name}"`,
      t.shares,
      t.price,
      t.currency,
      t.total,
      t.fee,
      t.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `riwayat_transaksi_market_enthusiast_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="transaction-history-panel" className="bg-[#0b0f19] border border-[#1b2336] rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#182033] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <History className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Riwayat Transaksi Global
            </h3>
            <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#131b2c] border border-[#22304d] text-emerald-400 font-mono-num">
              <span className={`w-2 h-2 rounded-full ${isLiveSyncing ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>Sinkronisasi Global Live</span>
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Catatan eksekusi order beli & jual tersinkronisasi otomatis dengan pergerakan harga pasar dunia terkini
          </p>
        </div>

        {/* Quick CSV Export & Summary */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#131a28] hover:bg-[#1a2337] border border-[#212b40] text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
            title="Download riwayat transaksi format CSV"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tabs: ALL, BUY, SELL */}
        <div className="flex items-center bg-[#07090f] p-1 rounded-xl border border-[#182133] w-fit">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'ALL'
                ? 'bg-[#1b253b] text-white border border-[#2c3c5f]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Semua ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('BUY')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'BUY'
                ? 'bg-emerald-600/90 text-white shadow-sm'
                : 'text-neutral-400 hover:text-emerald-400'
            }`}
          >
            Beli / Buy ({transactions.filter((t) => t.type === 'BUY').length})
          </button>
          <button
            onClick={() => setFilterType('SELL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterType === 'SELL'
                ? 'bg-rose-600/90 text-white shadow-sm'
                : 'text-neutral-400 hover:text-rose-400'
            }`}
          >
            Jual / Sell ({transactions.filter((t) => t.type === 'SELL').length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari simbol, nama saham, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#07090f] border border-[#1c263c] focus:border-emerald-500 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition-colors font-mono-num"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-xl border border-[#182133]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0e1422] border-b border-[#182133] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-3 px-3.5">ID / Waktu</th>
              <th className="py-3 px-3.5">Tipe</th>
              <th className="py-3 px-3.5">Aset Saham</th>
              <th className="py-3 px-3.5 text-right">Volume</th>
              <th className="py-3 px-3.5 text-right">Harga Beli/Jual</th>
              <th className="py-3 px-3.5 text-right">Harga Global Live</th>
              <th className="py-3 px-3.5 text-right">Nilai Total</th>
              <th className="py-3 px-3.5 text-right">Status & P/L Terkini</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#141b2b] font-mono-num">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-neutral-500 font-sans">
                  Tidak ada transaksi yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((trx) => {
                const liveStock = stockPriceMap.get(trx.symbol);
                const currentPrice = liveStock ? liveStock.price : trx.price;
                const priceDiff = currentPrice - trx.price;
                const priceDiffPercent = (priceDiff / trx.price) * 100;
                const isProfitable = trx.type === 'BUY' ? priceDiff >= 0 : priceDiff <= 0;

                return (
                  <tr
                    key={trx.id}
                    className="hover:bg-[#121927] transition-colors group cursor-pointer"
                    onClick={() => onSelectStock(trx.symbol)}
                  >
                    {/* ID & Timestamp */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-white text-[11px] group-hover:text-emerald-400 transition-colors">
                        {trx.id}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-sans">
                        {trx.timestamp}
                      </div>
                    </td>

                    {/* Transaction Type */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border ${
                          trx.type === 'BUY'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {trx.type === 'BUY' ? (
                          <>
                            <ArrowUpRight className="w-3 h-3" />
                            <span>BELI</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="w-3 h-3" />
                            <span>JUAL</span>
                          </>
                        )}
                      </span>
                    </td>

                    {/* Stock Details */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-[#162033] border border-[#25324c] flex items-center justify-center font-bold text-[10px] text-white">
                          {trx.symbol.split('.')[0]}
                        </div>
                        <div>
                          <span className="font-bold text-white text-xs">{trx.symbol}</span>
                          <span className="text-[10px] text-neutral-400 block font-sans truncate max-w-[140px]">
                            {trx.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <span className="text-white font-medium">
                        {trx.shares.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-neutral-400 ml-1">
                        {trx.currency === 'IDR' ? `(${trx.shares / 100} lot)` : 'lembar'}
                      </span>
                    </td>

                    {/* Execution Price */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap font-medium text-neutral-200">
                      {formatCurrency(trx.price, trx.currency)}
                    </td>

                    {/* Live Global Synchronized Price */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="text-white font-semibold flex items-center justify-end gap-1">
                        <span>{formatCurrency(currentPrice, trx.currency)}</span>
                        {liveStock && (
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              liveStock.flashDirection === 'up'
                                ? 'bg-emerald-400 animate-ping'
                                : liveStock.flashDirection === 'down'
                                ? 'bg-rose-400 animate-ping'
                                : 'bg-neutral-600'
                            }`}
                          />
                        )}
                      </div>
                      <div className={`text-[10px] ${priceDiff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {priceDiff >= 0 ? '+' : ''}{formatPercent(priceDiffPercent)}
                      </div>
                    </td>

                    {/* Total Value & Fee */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="font-bold text-white">
                        {formatCurrency(trx.total, trx.currency)}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-sans">
                        Fee: {formatCurrency(trx.fee, trx.currency)}
                      </div>
                    </td>

                    {/* Status and P&L Tracking */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 text-emerald-400 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>TEREKSEKUSI</span>
                      </div>
                      {trx.type === 'BUY' && (
                        <div className={`text-[10px] font-semibold ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isProfitable ? 'Floating Gain: +' : 'Floating Loss: '}
                          {formatCurrency(priceDiff * trx.shares, trx.currency)}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer Notes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-neutral-400 pt-1 font-mono-num">
        <div>
          Total Catatan: <strong className="text-white">{filteredTransactions.length}</strong> transaksi dieksekusi
        </div>
        <div className="flex items-center gap-3">
          <span>Fee Akumulasi: <strong className="text-neutral-200">{formatCurrency(totalFeesPaid, selectedCurrency)}</strong></span>
          <span>•</span>
          <span className="text-emerald-400">Harga Real-Time Terhubung</span>
        </div>
      </div>
    </div>
  );
};
