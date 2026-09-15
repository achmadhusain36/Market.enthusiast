import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Wifi,
  ShieldCheck,
  Zap,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { Language, UserProfile } from '../types';

interface BrokerPageProps {
  language?: Language;
  userProfile: UserProfile;
  onOpenTrade: () => void;
}

export const BrokerPage: React.FC<BrokerPageProps> = ({
  language = 'id',
  userProfile,
  onOpenTrade,
}) => {
  const isId = language === 'id';
  const [testingPing, setTestingPing] = useState(false);
  const [lastTestedTime, setLastTestedTime] = useState('Baru saja');

  const brokers = [
    {
      id: 'idx-direct',
      name: 'IDX Direct Market Access (DMA)',
      market: 'Bursa Efek Indonesia (IDX)',
      status: 'TERHUBUNG',
      latency: '14 ms',
      feeBuy: '0.15%',
      feeSell: '0.25%',
      isPrimary: true,
      logoColor: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'mirae',
      name: 'Mirae Asset Sekuritas (HOTSE)',
      market: 'IDX Regular & Cash Market',
      status: 'TERHUBUNG',
      latency: '18 ms',
      feeBuy: '0.15%',
      feeSell: '0.25%',
      isPrimary: false,
      logoColor: 'from-orange-600 to-amber-700',
    },
    {
      id: 'mandiri',
      name: 'Mandiri Sekuritas (MOST)',
      market: 'IDX Syariah & Saham BUMN',
      status: 'SIAGA',
      latency: '22 ms',
      feeBuy: '0.18%',
      feeSell: '0.28%',
      isPrimary: false,
      logoColor: 'from-blue-600 to-indigo-800',
    },
    {
      id: 'ibkr',
      name: 'Interactive Brokers LLC (IBKR Global)',
      market: 'NASDAQ, NYSE, S&P 500',
      status: 'TERHUBUNG',
      latency: '86 ms',
      feeBuy: '$0.005 / share',
      feeSell: '$0.005 / share',
      isPrimary: true,
      logoColor: 'from-rose-600 to-red-800',
    },
  ];

  const handleTestLatency = () => {
    setTestingPing(true);
    setTimeout(() => {
      setTestingPing(false);
      setLastTestedTime(new Date().toLocaleTimeString('id-ID'));
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col gap-5 p-2 sm:p-5 max-w-7xl mx-auto animate-in fade-in">
      {/* 1. Page Header */}
      <div className="bg-gradient-to-r from-[#0d121c] via-[#111728] to-[#0d121c] border border-[#1e263c] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>{isId ? 'Integrasi Broker & Jalur Eksekusi' : 'Broker Connectivity & Routing'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isId ? 'Koneksi Broker & Rekening RDN' : 'Broker Integrations & Routing Engine'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            {isId
              ? `Jalur eksekusi order langsung ke bursa efek melalui gateway resmi terenkripsi. Akun RDN aktif: ${userProfile.accountNumber}`
              : `Direct order execution gateways connected to major exchanges. Active RDN: ${userProfile.accountNumber}`}
          </p>
        </div>

        <button
          onClick={handleTestLatency}
          disabled={testingPing}
          className="px-4 py-2.5 rounded-xl bg-[#1a2336] hover:bg-[#25324d] text-cyan-400 text-xs font-bold flex items-center gap-2 border border-[#27344f] transition-all cursor-pointer self-start md:self-auto shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin' : ''}`} />
          <span>{testingPing ? (isId ? 'Menguji Latensi...' : 'Testing Ping...') : (isId ? 'Uji Latensi Gateway' : 'Ping Gateway')}</span>
        </button>
      </div>

      {/* 2. RDN Account Verification Box */}
      <div className="bg-[#0b0f19] border border-[#1b2336] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{userProfile.name}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                VERIFIKASI RDN
              </span>
            </div>
            <div className="text-xs text-neutral-400 mt-0.5 font-mono-num">
              No. RDN: <strong className="text-neutral-200">{userProfile.accountNumber}</strong> • Bank Kustodian: BCA RDN Saham
            </div>
          </div>
        </div>

        <button
          onClick={onOpenTrade}
          className="px-4 py-2 rounded-xl bg-[#22ab94] hover:bg-[#1e9581] text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>{isId ? 'Order Eksekusi Saham' : 'Execute Trade Order'}</span>
        </button>
      </div>

      {/* 3. Broker Gateways List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brokers.map((b) => (
          <div
            key={b.id}
            className="bg-[#0c1018] border border-[#1b2336] rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col justify-between gap-4 hover:border-[#283652] transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${b.logoColor} flex items-center justify-center text-white font-bold text-sm shadow`}>
                    {b.name.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm sm:text-base">{b.name}</h3>
                    <p className="text-xs text-neutral-400">{b.market}</p>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{b.status}</span>
                </span>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 bg-[#121724] border border-[#1d263a] rounded-xl p-3 text-xs font-mono-num mt-3">
                <div>
                  <span className="text-[10px] text-neutral-500 block font-sans">
                    {isId ? 'Latensi RTT' : 'Ping Latency'}
                  </span>
                  <span className="text-cyan-400 font-bold flex items-center gap-1">
                    <Wifi className="w-3 h-3" />
                    <span>{b.latency}</span>
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block font-sans">
                    {isId ? 'Fee Beli' : 'Buy Fee'}
                  </span>
                  <span className="text-neutral-200 font-semibold">{b.feeBuy}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block font-sans">
                    {isId ? 'Fee Jual' : 'Sell Fee'}
                  </span>
                  <span className="text-neutral-200 font-semibold">{b.feeSell}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#182133] text-xs">
              <span className="text-neutral-400 text-[11px] flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Enkripsi TLS 1.3 Aktif</span>
              </span>

              <button
                onClick={onOpenTrade}
                className="text-[#2962ff] hover:text-blue-400 font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>{isId ? 'Pilih Jalur Order' : 'Route Order'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
