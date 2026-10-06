import React, { useState } from 'react';
import {
  Award,
  TrendingUp,
  Percent,
  CheckCircle2,
  Copy,
  Users,
  Target,
  BarChart2,
  Sparkles,
  Shield,
  Layers,
  ArrowUpRight,
  Flame,
  Star,
  Gift,
} from 'lucide-react';
import { UserProfile, Transaction, PortfolioHolding, Language, TraderAchievement } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface TraderAnalyticsPageProps {
  userProfile: UserProfile;
  transactions: Transaction[];
  holdings: PortfolioHolding[];
  language?: Language;
}

export const TraderAnalyticsPage: React.FC<TraderAnalyticsPageProps> = ({
  userProfile,
  transactions,
  holdings,
  language = 'id',
}) => {
  const isId = language === 'id';
  const [copiedReferral, setCopiedReferral] = useState(false);

  const achievements: TraderAchievement[] = [
    {
      id: 'ach-1',
      title: isId ? 'First Blood (Order Pertama)' : 'First Blood (First Order)',
      desc: isId ? 'Mengeksekusi order transaksi saham pertama di terminal' : 'Execute your first trade order in the terminal',
      icon: '🎯',
      unlocked: true,
      progress: 100,
      rewardPoints: 50,
      unlockedAt: '28 Sep 2026',
    },
    {
      id: 'ach-2',
      title: isId ? 'Diamond Hands (Investor Kuat)' : 'Diamond Hands (Resilient Investor)',
      desc: isId ? 'Mempertahankan portofolio saham blue-chip lebih dari 30 hari' : 'HODL blue-chip assets for over 30 days',
      icon: '💎',
      unlocked: true,
      progress: 100,
      rewardPoints: 100,
      unlockedAt: '01 Okt 2026',
    },
    {
      id: 'ach-3',
      title: isId ? 'Multi-Asset Pioneer' : 'Multi-Asset Pioneer',
      desc: isId ? 'Menganalisis dan mentransaksikan saham IDX, Kripto, dan Emas' : 'Trade across Equities, Crypto, and Commodities',
      icon: '🌐',
      unlocked: true,
      progress: 100,
      rewardPoints: 150,
      unlockedAt: '03 Okt 2026',
    },
    {
      id: 'ach-4',
      title: isId ? 'Risk Management Master' : 'Risk Management Master',
      desc: isId ? 'Menerapkan Stop Loss dan Take Profit dengan ratio 1:2' : 'Apply Stop Loss and Take Profit with 1:2 R:R',
      icon: '🛡️',
      unlocked: false,
      progress: 65,
      rewardPoints: 200,
    },
    {
      id: 'ach-5',
      title: isId ? 'Century Club (100 Lot Club)' : 'Century Club',
      desc: isId ? 'Akumulasi total volume transaksi melebihi 100 lot / 10,000 lembar' : 'Accumulate over 100 lots of equity volume',
      icon: '🚀',
      unlocked: true,
      progress: 100,
      rewardPoints: 250,
      unlockedAt: '04 Okt 2026',
    },
  ];

  const totalPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((acc, curr) => acc + curr.rewardPoints, 0);

  const handleCopyReferral = () => {
    navigator.clipboard?.writeText('https://market.terminal.app/join?ref=HUSAIN-PRO7');
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-5 p-2 sm:p-5 max-w-7xl mx-auto animate-in fade-in select-none">
      {/* 1. Header Hero */}
      <div className="bg-gradient-to-r from-[#0c101a] via-[#101726] to-[#0c101a] border border-[#1b2336] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>{isId ? 'Performa & Analitik Pribadi' : 'Trader Analytics & Achievements'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {isId ? 'Statistik Performa & Lencana Trader' : 'Trading Performance & Level Achievements'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {isId
              ? 'Evaluasi rasio kemenangan (Win Rate), manajemen risiko, dan kumpulkan poin reward dari target trading Anda.'
              : 'Evaluate win rates, profit factors, and track unlocked gamification badges.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#131b2c] border border-[#202d44] text-right">
            <span className="text-[10px] text-neutral-400 block font-sans">
              {isId ? 'Total Reward Poin:' : 'Reward Points:'}
            </span>
            <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
              {totalPoints} PTS
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#090d16] border border-[#1b2336] shadow-lg">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Win Rate</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">68.4%</div>
          <span className="text-[10px] text-neutral-500 mt-0.5 block">19 / 28 Winning Trades</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d16] border border-[#1b2336] shadow-lg">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Profit Factor</span>
            <span className="text-cyan-400 font-bold font-mono">2.45</span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">2.45x</div>
          <span className="text-[10px] text-neutral-500 mt-0.5 block">Gross Win / Gross Loss</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d16] border border-[#1b2336] shadow-lg">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Avg Risk / Reward</span>
            <span className="text-amber-400 font-bold font-mono">1:2.3</span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">1 : 2.3</div>
          <span className="text-[10px] text-neutral-500 mt-0.5 block">Prudent Risk Control</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#090d16] border border-[#1b2336] shadow-lg">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Total Orders</span>
            <span className="text-purple-400 font-bold font-mono">28</span>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">{transactions.length}</div>
          <span className="text-[10px] text-neutral-500 mt-0.5 block">Executed on Ledger</span>
        </div>
      </div>

      {/* 3. Asset Class Distribution & Referral Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Asset Allocation (7 cols) */}
        <div className="lg:col-span-7 bg-[#090d16] border border-[#1b2336] rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#161f30] pb-3">
            <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{isId ? 'Distribusi Alokasi Portofolio per Sektor' : 'Asset & Sector Distribution'}</span>
            </h3>
            <span className="text-[10px] font-mono text-neutral-400">100% Diversified</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Saham Perbankan & Finansial (BBCA, BMRI, BBRI)', pct: 52, color: 'bg-emerald-500' },
              { label: 'Saham Teknologi & AI (NVDA, AAPL, MSFT)', pct: 24, color: 'bg-blue-500' },
              { label: 'Aset Digital Kripto (BTC, ETH, SOL)', pct: 14, color: 'bg-amber-500' },
              { label: 'Komoditas & Kas Likuid (Gold XAU, Kas IDR)', pct: 10, color: 'bg-purple-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300">{item.label}</span>
                  <span className="font-bold text-white font-mono">{item.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#131a29] overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Referral & Rewards (5 cols) */}
        <div className="lg:col-span-5 bg-[#090d16] border border-[#1b2336] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>{isId ? 'Program Referral Trader' : 'Trader Referral Program'}</span>
            </div>
            <h3 className="text-base font-bold text-white">
              {isId ? 'Ajak Rekan Trader & Dapatkan Cashback Fee' : 'Invite Traders & Earn Fee Rebates'}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {isId
                ? 'Bagikan tautan unik Anda. Dapatkan bonus poin reward dan potongan fee transaksi seumur hidup.'
                : 'Share your link and earn reward points on every trade executed by your network.'}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-[#0f1422] border border-[#1c273e] flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-neutral-400 block font-sans">Kode Referral Anda:</span>
                <span className="font-bold text-white text-sm">HUSAIN-PRO7</span>
              </div>
              <button
                onClick={handleCopyReferral}
                className="px-3 py-1.5 rounded-lg bg-[#2962ff] hover:bg-[#1a4de0] text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedReferral ? 'Disalin!' : 'Salin Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Gamification Badges List */}
      <div className="bg-[#090d16] border border-[#1b2336] rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#161f30] pb-3">
          <h3 className="font-bold text-white text-xs sm:text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isId ? 'Lencana Pencapaian & Prestasi' : 'Achievement Badges'}</span>
          </h3>
          <span className="text-xs text-neutral-400">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} Terbuka
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                ach.unlocked
                  ? 'bg-[#0e1422] border-[#22304d]'
                  : 'bg-[#080b12] border-[#161c28] opacity-60'
              }`}
            >
              <div className="text-2xl p-2 rounded-xl bg-[#141b2c] border border-[#1f2b42] shrink-0">
                {ach.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-white text-xs truncate">{ach.title}</h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono font-bold shrink-0">
                    +{ach.rewardPoints}p
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 leading-snug line-clamp-2">
                  {ach.desc}
                </p>
                {ach.unlocked ? (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Terbuka • {ach.unlockedAt}</span>
                  </div>
                ) : (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
                      <span>Progress</span>
                      <span>{ach.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#141b2a] rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400" style={{ width: `${ach.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
