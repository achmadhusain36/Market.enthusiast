import React from 'react';
import { History, FileSpreadsheet, ArrowUpDown, Filter, Activity } from 'lucide-react';
import { Transaction, StockQuote, CurrencyType, Language } from '../types';
import { TransactionHistory } from './TransactionHistory';

interface TransactionsPageProps {
  transactions: Transaction[];
  stocks: StockQuote[];
  selectedCurrency: CurrencyType;
  isLiveSyncing: boolean;
  language?: Language;
  onSelectStock: (symbol: string) => void;
  onNavigateToChart: () => void;
  onOpenTrade: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({
  transactions,
  stocks,
  selectedCurrency,
  isLiveSyncing,
  language = 'id',
  onSelectStock,
  onNavigateToChart,
  onOpenTrade,
}) => {
  const isId = language === 'id';

  return (
    <div className="w-full flex flex-col gap-5 p-2 sm:p-5 max-w-7xl mx-auto animate-in fade-in">
      {/* 1. Page Header */}
      <div className="bg-gradient-to-r from-[#0e1422] via-[#121a2c] to-[#0e1422] border border-[#20293d] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>{isId ? 'Buku Besar & Log Aktivitas' : 'Order Ledger & History'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isId ? 'Riwayat Transaksi Real-Time' : 'Live Transaction History'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {isId
              ? 'Seluruh order beli dan jual terekam otomatis dengan timestamp presisi WIB, harga pasar eksekusi, dan biaya transaksi.'
              : 'All buy and sell orders recorded with precise WIB execution timestamps, market prices, and fee logs.'}
          </p>
        </div>

        <button
          onClick={onOpenTrade}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all cursor-pointer self-start md:self-auto shrink-0"
        >
          <ArrowUpDown className="w-4 h-4" />
          <span>{isId ? 'Buat Transaksi Baru' : 'New Order'}</span>
        </button>
      </div>

      {/* 2. Embedded Transaction Ledger */}
      <TransactionHistory
        transactions={transactions}
        stocks={stocks}
        selectedCurrency={selectedCurrency}
        isLiveSyncing={isLiveSyncing}
        onSelectStock={(sym) => {
          onSelectStock(sym);
          onNavigateToChart();
        }}
      />
    </div>
  );
};
