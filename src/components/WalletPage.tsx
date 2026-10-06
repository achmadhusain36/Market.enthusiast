import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Copy,
  Download,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Coins,
} from 'lucide-react';
import { UserProfile, CurrencyType, Language, WalletTransaction } from '../types';
import { formatCurrency } from '../utils/formatters';

interface WalletPageProps {
  userProfile: UserProfile;
  selectedCurrency: CurrencyType;
  language?: Language;
  onUpdateBalance: (idrChange: number, usdChange: number) => void;
  onOpenPinModal: (onSuccess: () => void) => void;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  userProfile,
  selectedCurrency,
  language = 'id',
  onUpdateBalance,
  onOpenPinModal,
}) => {
  const isId = language === 'id';
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DEPOSIT' | 'WITHDRAW' | 'HISTORY'>('OVERVIEW');
  const [depositMethod, setDepositMethod] = useState<'VA' | 'QRIS' | 'CRYPTO' | 'DEBIT'>('VA');
  const [selectedBank, setSelectedBank] = useState<'BCA' | 'MANDIRI' | 'BRI'>('BCA');
  const [depositAmount, setDepositAmount] = useState<number>(5000000);
  const [depositCurrency, setDepositCurrency] = useState<'IDR' | 'USD'>('IDR');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000000);
  const [withdrawCurrency, setWithdrawCurrency] = useState<'IDR' | 'USD'>('IDR');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Persistent wallet transactions history
  const [walletHistory, setWalletHistory] = useState<WalletTransaction[]>(() => {
    return [
      {
        id: 'WTX-9014',
        type: 'DEPOSIT',
        amount: 25000000,
        currency: 'IDR',
        method: 'BCA Virtual Account',
        timestamp: '04 Okt 2026, 14:20 WIB',
        status: 'SUCCESS',
        accountDestination: 'RDN-8829-9104-HUS',
      },
      {
        id: 'WTX-8812',
        type: 'DEPOSIT',
        amount: 2500,
        currency: 'USD',
        method: 'MetaMask USDT Web3',
        timestamp: '02 Okt 2026, 09:15 WIB',
        status: 'SUCCESS',
        txHash: '0x7a8f...39c1',
      },
      {
        id: 'WTX-7621',
        type: 'WITHDRAW',
        amount: 5000000,
        currency: 'IDR',
        method: 'Transfer Bank BCA',
        timestamp: '29 Sep 2026, 16:45 WIB',
        status: 'SUCCESS',
        accountDestination: 'BCA 88299104 (Achmad Husain)',
      },
    ];
  });

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleExecuteDeposit = () => {
    onOpenPinModal(() => {
      if (depositCurrency === 'IDR') {
        onUpdateBalance(depositAmount, 0);
      } else {
        onUpdateBalance(0, depositAmount);
      }

      const newTx: WalletTransaction = {
        id: `WTX-${Date.now().toString().slice(-4)}`,
        type: 'DEPOSIT',
        amount: depositAmount,
        currency: depositCurrency,
        method:
          depositMethod === 'VA'
            ? `${selectedBank} Virtual Account`
            : depositMethod === 'QRIS'
            ? 'QRIS Instan'
            : depositMethod === 'CRYPTO'
            ? 'USDT Web3 Deposit'
            : 'Debit Card Instant',
        timestamp: new Date().toLocaleString(isId ? 'id-ID' : 'en-US'),
        status: 'SUCCESS',
      };

      setWalletHistory((prev) => [newTx, ...prev]);
      setActionSuccessMsg(
        isId
          ? `Deposit sebesar ${formatCurrency(depositAmount, depositCurrency)} berhasil ditambahkan ke saldo RDN!`
          : `Deposit of ${formatCurrency(depositAmount, depositCurrency)} successfully credited!`
      );
      setTimeout(() => setActionSuccessMsg(null), 5000);
      setActiveTab('OVERVIEW');
    });
  };

  const handleExecuteWithdraw = () => {
    const maxBalance = withdrawCurrency === 'IDR' ? userProfile.cashBalanceIDR : userProfile.cashBalanceUSD;

    if (withdrawAmount <= 0) {
      alert(isId ? 'Jumlah penarikan harus lebih dari 0' : 'Withdrawal amount must be greater than 0');
      return;
    }

    if (withdrawAmount > maxBalance) {
      alert(isId ? 'Saldo kas tidak mencukupi untuk penarikan ini!' : 'Insufficient cash balance for this withdrawal!');
      return;
    }

    onOpenPinModal(() => {
      if (withdrawCurrency === 'IDR') {
        onUpdateBalance(-withdrawAmount, 0);
      } else {
        onUpdateBalance(0, -withdrawAmount);
      }

      const newTx: WalletTransaction = {
        id: `WTX-${Date.now().toString().slice(-4)}`,
        type: 'WITHDRAW',
        amount: withdrawAmount,
        currency: withdrawCurrency,
        method: 'BCA Rekening Utama (88299104)',
        timestamp: new Date().toLocaleString(isId ? 'id-ID' : 'en-US'),
        status: 'SUCCESS',
        accountDestination: 'BCA 88299104 (Achmad Husain)',
      };

      setWalletHistory((prev) => [newTx, ...prev]);
      setActionSuccessMsg(
        isId
          ? `Penarikan dana ${formatCurrency(withdrawAmount, withdrawCurrency)} berhasil diproses ke rekening Bank BCA!`
          : `Withdrawal of ${formatCurrency(withdrawAmount, withdrawCurrency)} processed to your BCA bank account!`
      );
      setTimeout(() => setActionSuccessMsg(null), 5000);
      setActiveTab('OVERVIEW');
    });
  };

  const exportCSV = () => {
    const headers = ['ID', 'Type', 'Amount', 'Currency', 'Method', 'Timestamp', 'Status'];
    const rows = walletHistory.map((t) => [
      t.id,
      t.type,
      t.amount,
      t.currency,
      t.method,
      t.timestamp,
      t.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wallet_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col gap-5 p-2 sm:p-5 max-w-7xl mx-auto animate-in fade-in select-none">
      {/* 1. Page Header */}
      <div className="bg-gradient-to-r from-[#0c101a] via-[#101726] to-[#0c101a] border border-[#1b2336] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Wallet className="w-4 h-4" />
            <span>{isId ? 'Pusat Keuangan & Dompet Multi-Valuta' : 'Multi-Currency Wallet Hub'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isId ? 'Kelola Saldo Kas, Deposit & Tarik Dana' : 'Manage Cash, Deposits & Withdrawals'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {isId
              ? 'Penyimpanan dana terproteksi PIN 6-digit dengan Bank Kustodian BCA dan gateway pembayaran terintegrasi.'
              : 'Institutional segregated vault with 6-digit PIN protection and instant liquidity channels.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('DEPOSIT')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer transition-all"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>{isId ? 'Isi Saldo (Deposit)' : 'Deposit Funds'}</span>
          </button>
          <button
            onClick={() => setActiveTab('WITHDRAW')}
            className="px-4 py-2.5 rounded-xl bg-[#131a29] hover:bg-[#1a2336] border border-[#232f48] text-neutral-200 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <ArrowUpRight className="w-4 h-4 text-cyan-400" />
            <span>{isId ? 'Tarik Dana (Withdraw)' : 'Withdraw Funds'}</span>
          </button>
        </div>
      </div>

      {/* Success notification banner */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#182032] pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'OVERVIEW'
              ? 'bg-[#1b253b] text-white font-bold border border-[#2b3a5c]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isId ? 'Ringkasan Saldo' : 'Balances Overview'}</span>
        </button>

        <button
          onClick={() => setActiveTab('DEPOSIT')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'DEPOSIT'
              ? 'bg-[#1b253b] text-white font-bold border border-[#2b3a5c]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isId ? 'Isi Saldo' : 'Deposit'}</span>
        </button>

        <button
          onClick={() => setActiveTab('WITHDRAW')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'WITHDRAW'
              ? 'bg-[#1b253b] text-white font-bold border border-[#2b3a5c]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          <span>{isId ? 'Tarik Dana' : 'Withdraw'}</span>
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'HISTORY'
              ? 'bg-[#1b253b] text-white font-bold border border-[#2b3a5c]'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>{isId ? 'Riwayat Wallet' : 'Transaction History'}</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-5">
          {/* Balance Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: IDR RDN BCA */}
            <div className="p-5 rounded-2xl bg-[#090d16] border border-[#1b2438] flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-400">
                    {isId ? 'Kas RDN Rupiah (BCA)' : 'IDR Cash Balance (BCA RDN)'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold font-mono">
                    IDR • BCA
                  </span>
                </div>
                <div className="text-2xl font-black text-white font-mono mt-2">
                  Rp {userProfile.cashBalanceIDR.toLocaleString()}
                </div>
                <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
                  {userProfile.accountNumber}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#141b2a] flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setDepositCurrency('IDR');
                    setActiveTab('DEPOSIT');
                  }}
                  className="text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>{isId ? 'Top Up IDR' : 'Top Up IDR'}</span>
                </button>
                <button
                  onClick={() => {
                    setWithdrawCurrency('IDR');
                    setActiveTab('WITHDRAW');
                  }}
                  className="text-neutral-400 hover:text-white cursor-pointer flex items-center gap-1"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{isId ? 'Tarik Dana' : 'Withdraw'}</span>
                </button>
              </div>
            </div>

            {/* Card 2: USD Global Wall Street */}
            <div className="p-5 rounded-2xl bg-[#090d16] border border-[#1b2438] flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-400">
                    {isId ? 'Kas Global US Dollar' : 'USD Cash Balance (Global)'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold font-mono">
                    USD • IBKR
                  </span>
                </div>
                <div className="text-2xl font-black text-white font-mono mt-2">
                  ${userProfile.cashBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
                  Kurs: 1 USD = Rp {userProfile.usdIdrRate.toLocaleString()}
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#141b2a] flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setDepositCurrency('USD');
                    setActiveTab('DEPOSIT');
                  }}
                  className="text-blue-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>{isId ? 'Top Up USD' : 'Top Up USD'}</span>
                </button>
                <button
                  onClick={() => {
                    setWithdrawCurrency('USD');
                    setActiveTab('WITHDRAW');
                  }}
                  className="text-neutral-400 hover:text-white cursor-pointer flex items-center gap-1"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{isId ? 'Tarik Dana' : 'Withdraw'}</span>
                </button>
              </div>
            </div>

            {/* Card 3: Crypto USDT Web3 */}
            <div className="p-5 rounded-2xl bg-[#090d16] border border-[#1b2438] flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-400">
                    {isId ? 'Tether USDT Web3' : 'Tether USDT Web3'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold font-mono">
                    USDT • ERC20
                  </span>
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono mt-2">
                  5,420.00 USDT
                </div>
                <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
                  MetaMask / Web3 Wallet
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-[#141b2a] flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setDepositMethod('CRYPTO');
                    setActiveTab('DEPOSIT');
                  }}
                  className="text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>{isId ? 'Deposit USDT' : 'Deposit USDT'}</span>
                </button>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Auto-Swap</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Bank Account Credentials Card */}
          <div className="p-5 rounded-2xl bg-[#0c121e] border border-[#1e2a40] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                BCA
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Rekening Pencairan Utama (Terverifikasi)</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                    ACTIVE
                  </span>
                </h4>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  Bank Central Asia (BCA) • No. Rekening: <strong>8829-9104-00</strong> • a/n Achmad Husain
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400 font-mono">PIN Sandi: <strong>708951</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* DEPOSIT TAB */}
      {activeTab === 'DEPOSIT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#090d16] border border-[#1b2336] rounded-2xl p-6 shadow-xl">
          <div className="lg:col-span-7 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white">
                {isId ? 'Pilih Saluran Pembayaran & Deposit' : 'Choose Deposit Gateway'}
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                {isId ? 'Dana langsung masuk otomatis ke saldo kas RDN setelah transfer berhasil.' : 'Instant automated processing upon payment.'}
              </p>
            </div>

            {/* Methods Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'VA', label: 'Virtual Account', sub: 'BCA / Mandiri / BRI', icon: CreditCard },
                { id: 'QRIS', label: 'QRIS Instan', sub: 'BCA, GoPay, OVO', icon: QrCode },
                { id: 'CRYPTO', label: 'USDT Web3', sub: 'MetaMask TRC/ERC', icon: Coins },
                { id: 'DEBIT', label: 'Kartu Debit', sub: 'Visa & Mastercard', icon: CreditCard },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = depositMethod === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setDepositMethod(m.id as any)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#121c2e] border-[#2962ff] shadow-lg shadow-blue-950/30 ring-1 ring-[#2962ff]'
                        : 'bg-[#0c111a] border-[#182133] hover:border-[#25334f]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? 'text-[#2962ff]' : 'text-neutral-400'}`} />
                    <div>
                      <div className="text-xs font-bold text-white">{m.label}</div>
                      <div className="text-[10px] text-neutral-500">{m.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">
                {isId ? 'Jumlah Deposit:' : 'Deposit Amount:'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-neutral-400 font-mono text-xs font-bold">
                  {depositCurrency === 'IDR' ? 'Rp' : '$'}
                </span>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full bg-[#0c121e] border border-[#212c42] focus:border-[#2962ff] rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono font-bold text-white outline-none"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(depositCurrency === 'IDR'
                  ? [1000000, 5000000, 10000000, 50000000]
                  : [100, 500, 1000, 5000]
                ).map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setDepositAmount(amt)}
                    className="px-2.5 py-1 rounded-lg bg-[#111724] border border-[#1e273a] text-xs font-mono text-cyan-300 hover:bg-[#182236] cursor-pointer"
                  >
                    +{depositCurrency === 'IDR' ? `${amt / 1000000} Juta` : `$${amt}`}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExecuteDeposit}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isId ? 'Konfirmasi Deposit dengan PIN (708951)' : 'Authorize Deposit with PIN (708951)'}</span>
            </button>
          </div>

          {/* Right Column: Dynamic Payment Guide */}
          <div className="lg:col-span-5 bg-[#0c121e] border border-[#1b2538] rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#182337]">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  {isId ? 'Detail Tagihan Deposit' : 'Payment Instructions'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">INSTANT RTGS</span>
              </div>

              {depositMethod === 'VA' && (
                <div className="space-y-3 mt-3">
                  <div className="p-3 rounded-lg bg-[#101726] border border-[#1c2940] space-y-1">
                    <span className="text-[11px] text-neutral-400 block font-sans">Nomor Virtual Account BCA:</span>
                    <div className="flex items-center justify-between font-mono font-bold text-white text-sm">
                      <span>8829 0081 2345 6789</span>
                      <button
                        onClick={() => handleCopy('8829008123456789', 'VA')}
                        className="text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedText === 'VA' ? 'Tersalin!' : 'Salin'}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Buka m-BCA &gt; m-Transfer &gt; BCA Virtual Account &gt; Masukkan nomor VA di atas &gt; Konfirmasi PIN Anda.
                  </p>
                </div>
              )}

              {depositMethod === 'QRIS' && (
                <div className="space-y-3 mt-3 text-center">
                  <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl flex items-center justify-center shadow">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Scan kode QRIS di atas dengan BCA Mobile, GoPay, OVO, Dana, atau ShopeePay.
                  </p>
                </div>
              )}

              {depositMethod === 'CRYPTO' && (
                <div className="space-y-3 mt-3">
                  <div className="p-3 rounded-lg bg-[#101726] border border-[#1c2940] space-y-1">
                    <span className="text-[11px] text-neutral-400 block">Alamat Deposit USDT (ERC-20 / TRC-20):</span>
                    <div className="font-mono text-xs text-amber-400 break-all">
                      0x71C...B29a8f49D347e38201
                    </div>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Deposit otomatis dikonversi ke USD saldo terminal dengan rate 1:1 real-time.
                  </p>
                </div>
              )}

              {depositMethod === 'DEBIT' && (
                <div className="space-y-3 mt-3">
                  <div className="p-3 rounded-lg bg-[#101726] border border-[#1c2940] space-y-1">
                    <span className="text-[11px] text-neutral-400 block">Dukungan Kartu:</span>
                    <div className="text-xs font-bold text-white">Visa 3D Secure & Mastercard Identity Check</div>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Memerlukan OTP SMS dari bank penerbit kartu untuk otorisasi keamanan instan.
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 rounded-xl bg-[#131b2c] border border-[#1e2a42] text-[11px] text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Bebas biaya admin untuk seluruh saluran deposit virtual account & QRIS.</span>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW TAB */}
      {activeTab === 'WITHDRAW' && (
        <div className="max-w-2xl mx-auto bg-[#090d16] border border-[#1b2336] rounded-2xl p-6 shadow-xl space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">
              {isId ? 'Tarik Dana Kas ke Rekening Bank' : 'Withdraw Funds to Bank Account'}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isId
                ? 'Dana akan ditransfer secara instan (real-time) ke rekening bank Anda yang telah terverifikasi.'
                : 'Instant RTGS transfer to your registered bank account.'}
            </p>
          </div>

          {/* Target Bank Card */}
          <div className="p-4 rounded-xl bg-[#0c121e] border border-[#1e2a40] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                BCA
              </div>
              <div>
                <div className="text-xs font-bold text-white">Bank Central Asia (BCA)</div>
                <div className="text-[11px] text-neutral-400 font-mono">8829-9104-00 • Achmad Husain</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono">
              VERIFIED
            </span>
          </div>

          {/* Currency Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              {isId ? 'Pilih Mata Uang Penarikan:' : 'Select Withdrawal Currency:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setWithdrawCurrency('IDR')}
                className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors border ${
                  withdrawCurrency === 'IDR'
                    ? 'bg-[#1b253b] border-[#2962ff] text-white'
                    : 'bg-[#0c111a] border-[#182133] text-neutral-400'
                }`}
              >
                Rupiah (IDR) — Kas: Rp {userProfile.cashBalanceIDR.toLocaleString()}
              </button>
              <button
                onClick={() => setWithdrawCurrency('USD')}
                className={`py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors border ${
                  withdrawCurrency === 'USD'
                    ? 'bg-[#1b253b] border-[#2962ff] text-white'
                    : 'bg-[#0c111a] border-[#182133] text-neutral-400'
                }`}
              >
                US Dollar (USD) — Kas: ${userProfile.cashBalanceUSD.toLocaleString()}
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300">
              {isId ? 'Nominal Penarikan:' : 'Withdrawal Amount:'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-neutral-400 font-mono text-xs font-bold">
                {withdrawCurrency === 'IDR' ? 'Rp' : '$'}
              </span>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full bg-[#0c121e] border border-[#212c42] focus:border-[#2962ff] rounded-xl pl-10 pr-4 py-2.5 text-sm font-mono font-bold text-white outline-none"
              />
            </div>

            {/* Percentage Buttons */}
            <div className="grid grid-cols-4 gap-2 pt-1 font-mono text-xs">
              {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    const maxBal = withdrawCurrency === 'IDR' ? userProfile.cashBalanceIDR : userProfile.cashBalanceUSD;
                    setWithdrawAmount(Math.floor(maxBal * pct));
                  }}
                  className="py-1.5 rounded-lg bg-[#111724] border border-[#1e273a] text-neutral-300 hover:text-white hover:bg-[#172134] cursor-pointer"
                >
                  {pct * 100}%
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleExecuteWithdraw}
            className="w-full py-3 rounded-xl bg-[#2962ff] hover:bg-[#1a4fe0] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 cursor-pointer transition-all"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isId ? 'Otorisasi Penarikan Dana dengan PIN (708951)' : 'Authorize Withdrawal with PIN (708951)'}</span>
          </button>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'HISTORY' && (
        <div className="bg-[#090d16] border border-[#1b2336] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#182133] bg-[#0c111c] flex items-center justify-between">
            <h3 className="font-bold text-white text-xs sm:text-sm">
              {isId ? 'Buku Riwayat Mutasi Wallet' : 'Wallet Mutation Ledger'}
            </h3>
            <button
              onClick={exportCSV}
              className="px-3 py-1.5 rounded-lg bg-[#141b2a] hover:bg-[#1b253b] border border-[#222e46] text-neutral-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#080c14] border-b border-[#161f30] text-neutral-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">ID Transaksi</th>
                  <th className="py-3 px-4">Jenis Mutasi</th>
                  <th className="py-3 px-4">Metode / Saluran</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4">Waktu Eksekusi</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#131b2b] font-mono">
                {walletHistory.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#101624] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{tx.id}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          tx.type === 'DEPOSIT'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-neutral-300 font-sans">{tx.method}</td>
                    <td className="py-3 px-4 text-right font-bold text-white">
                      {tx.type === 'DEPOSIT' ? '+' : '-'}
                      {formatCurrency(tx.amount, tx.currency as any)}
                    </td>
                    <td className="py-3 px-4 text-neutral-400 text-[11px] font-sans">{tx.timestamp}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
