import React from 'react';
import { MarketType } from '../types';

interface MarketLogoProps {
  market: MarketType | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * High-definition visual logo for stock market exchanges (IDX, NASDAQ, NYSE, CRYPTO, FOREX, COMMODITY, GLOBAL)
 * Designed with Liquid Glass refraction, metallic gradients, and authentic exchange iconography.
 */
export const MarketLogo: React.FC<MarketLogoProps> = ({
  market,
  size = 'sm',
  showLabel = false,
  className = '',
}) => {
  const normalized = (market || '').toUpperCase();

  // Dimensions
  const dim = {
    xs: { icon: 14, text: 'text-[9px]', px: 'px-1.5 py-0.5', box: 'w-4 h-4' },
    sm: { icon: 18, text: 'text-[10px]', px: 'px-2 py-0.5', box: 'w-5 h-5' },
    md: { icon: 22, text: 'text-xs', px: 'px-2.5 py-1', box: 'w-6 h-6' },
    lg: { icon: 28, text: 'text-sm', px: 'px-3 py-1.5', box: 'w-8 h-8' },
  }[size];

  // 1. IDX (Bursa Efek Indonesia / Indonesia Stock Exchange)
  if (normalized === 'IDX' || normalized === 'IHSG') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-lg font-bold tracking-tight select-none ${
          showLabel
            ? 'bg-gradient-to-r from-[#200a0e]/90 to-[#120507]/90 border border-red-500/40 text-white shadow-sm shadow-red-950/40 backdrop-blur-md ' +
              dim.px
            : ''
        } ${className}`}
        title="Bursa Efek Indonesia (IDX)"
      >
        <svg
          viewBox="0 0 28 28"
          className={`${dim.box} shrink-0 drop-shadow-[0_2px_6px_rgba(239,68,68,0.35)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="idxGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2c080d" />
              <stop offset="100%" stopColor="#140205" />
            </linearGradient>
            <linearGradient id="idxRed" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="6" fill="url(#idxGrad)" stroke="rgba(239,68,68,0.3)" strokeWidth="1" />
          {/* BEI stylized bull diamond & ribbon */}
          <path d="M5 14L14 5L23 14L14 23Z" fill="url(#idxRed)" />
          <path d="M5 14L14 14L23 14L14 23Z" fill="#FFFFFF" fillOpacity="0.95" />
          {/* Inner Golden Star & Bull Crest Accent */}
          <circle cx="14" cy="14" r="3.2" fill="#180407" />
          <path d="M14 8.5V19.5M8.5 14H19.5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="14" cy="14" r="1.4" fill="#FBBF24" />
        </svg>
        {showLabel && (
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-wider text-red-300 drop-shadow-sm ${dim.text}`}>IDX</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-red-500/25 border border-red-500/30 text-red-200 font-bold uppercase">
              ID
            </span>
          </div>
        )}
      </div>
    );
  }

  // 2. NASDAQ (US Tech Stock Exchange)
  if (normalized === 'NASDAQ') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-lg font-bold tracking-tight select-none ${
          showLabel
            ? 'bg-gradient-to-r from-[#04172a]/90 to-[#020d18]/90 border border-cyan-400/40 text-white shadow-sm shadow-cyan-950/40 backdrop-blur-md ' +
              dim.px
            : ''
        } ${className}`}
        title="NASDAQ US Tech Stock Exchange"
      >
        <svg
          viewBox="0 0 28 28"
          className={`${dim.box} shrink-0 drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="nasdaqBg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#051c33" />
              <stop offset="100%" stopColor="#020d18" />
            </linearGradient>
            <linearGradient id="nasdaqCyan" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="nasdaqShimmer" x1="12" y1="4" x2="24" y2="20" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="6" fill="url(#nasdaqBg)" stroke="rgba(56,189,248,0.3)" strokeWidth="1" />
          {/* NASDAQ stylized angled faceted polygon */}
          <path d="M6 19.5L12.5 7H16.5L10 19.5H6Z" fill="url(#nasdaqCyan)" />
          <path d="M13 19.5L19.5 7H23.5L17 19.5H13Z" fill="url(#nasdaqShimmer)" />
          {/* Radiant core star */}
          <circle cx="20" cy="10" r="1.8" fill="#FFFFFF" />
          <circle cx="20" cy="10" r="0.8" fill="#38BDF8" />
        </svg>
        {showLabel && (
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-wider text-cyan-200 drop-shadow-sm ${dim.text}`}>NASDAQ</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 font-bold uppercase">
              US
            </span>
          </div>
        )}
      </div>
    );
  }

  // 3. NYSE (New York Stock Exchange)
  if (normalized === 'NYSE') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-lg font-bold tracking-tight select-none ${
          showLabel
            ? 'bg-gradient-to-r from-[#0c1a33]/90 to-[#060e1d]/90 border border-blue-400/40 text-white shadow-sm shadow-blue-950/40 backdrop-blur-md ' +
              dim.px
            : ''
        } ${className}`}
        title="New York Stock Exchange (NYSE)"
      >
        <svg
          viewBox="0 0 28 28"
          className={`${dim.box} shrink-0 drop-shadow-[0_2px_8px_rgba(245,166,35,0.35)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="nyseBg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0d1b33" />
              <stop offset="100%" stopColor="#050c18" />
            </linearGradient>
            <linearGradient id="goldTrim" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="6" fill="url(#nyseBg)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
          {/* Wall Street Classical Pediment & Colonnade */}
          <path d="M4 9L14 4.5L24 9H4Z" fill="url(#goldTrim)" />
          <rect x="6" y="10.5" width="2.2" height="9" rx="0.5" fill="#E2E8F0" />
          <rect x="10.5" y="10.5" width="2.2" height="9" rx="0.5" fill="#E2E8F0" />
          <rect x="15.3" y="10.5" width="2.2" height="9" rx="0.5" fill="#E2E8F0" />
          <rect x="19.8" y="10.5" width="2.2" height="9" rx="0.5" fill="#E2E8F0" />
          <rect x="3.5" y="20" width="21" height="3" rx="0.5" fill="url(#goldTrim)" />
        </svg>
        {showLabel && (
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-wider text-amber-200 drop-shadow-sm ${dim.text}`}>NYSE</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/25 border border-amber-500/30 text-amber-200 font-bold uppercase">
              US
            </span>
          </div>
        )}
      </div>
    );
  }

  // 4. CRYPTO (Cryptocurrency Global Exchange)
  if (normalized === 'CRYPTO') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-lg font-bold tracking-tight select-none ${
          showLabel
            ? 'bg-gradient-to-r from-[#241604]/90 to-[#120a02]/90 border border-amber-500/40 text-white shadow-sm shadow-amber-950/40 backdrop-blur-md ' +
              dim.px
            : ''
        } ${className}`}
        title="Cryptocurrency Global Market"
      >
        <svg
          viewBox="0 0 28 28"
          className={`${dim.box} shrink-0 drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cryptoBg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#291804" />
              <stop offset="100%" stopColor="#120a02" />
            </linearGradient>
            <linearGradient id="btcGold" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="6" fill="url(#cryptoBg)" stroke="rgba(245,158,11,0.3)" strokeWidth="1" />
          <circle cx="14" cy="14" r="9" fill="url(#btcGold)" />
          <circle cx="14" cy="14" r="7.8" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
          {/* Bitcoin ₿ sign */}
          <path
            d="M14.5 8V9.5M16.8 8V9.5M11 10.5H16.2C17.1 10.5 17.8 11.1 17.8 11.9C17.8 12.7 17.1 13.3 16.2 13.3H14.5M14.5 13.3H16.8C17.8 13.3 18.5 14 18.5 14.9C18.5 15.8 17.8 16.5 16.8 16.5H11M13.3 16.5V19M15.5 16.5V19"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        {showLabel && (
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-wider text-amber-300 drop-shadow-sm ${dim.text}`}>CRYPTO</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/25 border border-amber-500/30 text-amber-200 font-bold uppercase">
              WEB3
            </span>
          </div>
        )}
      </div>
    );
  }

  // 5. FOREX (Foreign Exchange 24/7)
  if (normalized === 'FOREX') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-lg font-bold tracking-tight select-none ${
          showLabel
            ? 'bg-gradient-to-r from-[#061f16]/90 to-[#020f0a]/90 border border-emerald-500/40 text-white shadow-sm shadow-emerald-950/40 backdrop-blur-md ' +
              dim.px
            : ''
        } ${className}`}
        title="Foreign Exchange (Forex Market)"
      >
        <svg
          viewBox="0 0 28 28"
          className={`${dim.box} shrink-0 drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="forexBg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#072218" />
              <stop offset="100%" stopColor="#020e0a" />
            </linearGradient>
            <linearGradient id="forexGrad" x1="4" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="6" fill="url(#forexBg)" stroke="rgba(16,185,129,0.3)" strokeWidth="1" />
          {/* Dual currency orbital arrows & exchange crest */}
          <path
            d="M8 9.5H20M20 9.5L15.5 5M20 9.5L15.5 14"
            stroke="url(#forexGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 18.5H8M8 18.5L12.5 14M8 18.5L12.5 23"
            stroke="#10B981"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {showLabel && (
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-wider text-emerald-300 drop-shadow-sm ${dim.text}`}>FOREX</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 font-bold uppercase">
              24/7
            </span>
          </div>
        )}
      </div>
    );
  }

  // 6. COMMODITY (Emas, Minyak, Logam Mulia)
  if (normalized === 'COMMODITY') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-lg font-bold tracking-tight select-none ${
          showLabel
            ? 'bg-gradient-to-r from-[#261c04]/90 to-[#140e02]/90 border border-yellow-500/40 text-white shadow-sm shadow-yellow-950/40 backdrop-blur-md ' +
              dim.px
            : ''
        } ${className}`}
        title="Commodities Market (Gold XAU, Oil WTI, Silver)"
      >
        <svg
          viewBox="0 0 28 28"
          className={`${dim.box} shrink-0 drop-shadow-[0_2px_8px_rgba(234,179,8,0.4)]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="commBg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2c2005" />
              <stop offset="100%" stopColor="#120d02" />
            </linearGradient>
            <linearGradient id="goldBar" x1="6" y1="6" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          <rect width="28" height="28" rx="6" fill="url(#commBg)" stroke="rgba(234,179,8,0.3)" strokeWidth="1" />
          {/* Polished Gold Bullion Ingot with Faceted 3D perspective */}
          <path d="M6 18L10 9H22L18 18Z" fill="url(#goldBar)" />
          <path d="M10 9L13 5.5H25L22 9Z" fill="#FEF08A" />
          <path d="M22 9L25 5.5L21 14.5L18 18Z" fill="#A16207" />
          {/* Ingot Stamp */}
          <circle cx="14" cy="13.5" r="1.5" fill="#713F12" />
        </svg>
        {showLabel && (
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-wider text-yellow-300 drop-shadow-sm ${dim.text}`}>COMMODITY</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-yellow-500/25 border border-yellow-500/30 text-yellow-200 font-bold uppercase">
              GOLD/OIL
            </span>
          </div>
        )}
      </div>
    );
  }

  // 7. Fallback: GLOBAL / INDICES / WORLD MARKETS
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg font-bold tracking-tight select-none ${
        showLabel
          ? 'bg-gradient-to-r from-[#0d1e2b]/90 to-[#061017]/90 border border-teal-500/40 text-white shadow-sm shadow-teal-950/40 backdrop-blur-md ' +
            dim.px
          : ''
      } ${className}`}
      title="Pasar Global & Indeks Acuan Dunia"
    >
      <svg
        viewBox="0 0 28 28"
        className={`${dim.box} shrink-0 drop-shadow-[0_2px_8px_rgba(20,184,166,0.4)]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="globalBg" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0c232f" />
            <stop offset="100%" stopColor="#051017" />
          </linearGradient>
        </defs>
        <rect width="28" height="28" rx="6" fill="url(#globalBg)" stroke="rgba(20,184,166,0.3)" strokeWidth="1" />
        {/* Holographic Wireframe Geodesic Globe */}
        <circle cx="14" cy="14" r="8.5" stroke="#14B8A6" strokeWidth="1.5" fill="#0B2027" />
        <ellipse cx="14" cy="14" rx="4.5" ry="8.5" stroke="#2DD4BF" strokeWidth="1.2" />
        <path d="M5.5 14H22.5" stroke="#2DD4BF" strokeWidth="1.2" />
        <path d="M7 9H21" stroke="#14B8A6" strokeWidth="0.9" opacity="0.8" />
        <path d="M7 19H21" stroke="#14B8A6" strokeWidth="0.9" opacity="0.8" />
      </svg>
      {showLabel && (
        <div className="flex items-center gap-1">
          <span className={`font-black tracking-wider text-teal-300 drop-shadow-sm ${dim.text}`}>GLOBAL</span>
          <span className="text-[8px] px-1 py-0.2 rounded bg-teal-500/25 border border-teal-500/30 text-teal-200 font-bold uppercase">
            WORLD
          </span>
        </div>
      )}
    </div>
  );
};

interface StockCompanyLogoProps {
  symbol: string;
  market?: MarketType | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Authentic brand logo for specific stocks, cryptos, commodities, and global indices.
 * Features vector accuracy, liquid glass border accents, and high-contrast colorways.
 */
export const StockCompanyLogo: React.FC<StockCompanyLogoProps> = ({
  symbol,
  market = 'IDX',
  size = 'md',
  className = '',
}) => {
  const cleanSym = (symbol || '').split('.')[0].toUpperCase();

  const sizeClasses = {
    xs: 'w-5 h-5 text-[9px] rounded-md',
    sm: 'w-6 h-6 text-[10px] rounded-md',
    md: 'w-8 h-8 text-xs rounded-lg',
    lg: 'w-10 h-10 text-sm rounded-xl',
    xl: 'w-12 h-12 text-base rounded-2xl',
  }[size];

  // -------------------------------------------------------------
  // CRYPTOCURRENCIES
  // -------------------------------------------------------------

  // BTC / Bitcoin
  if (cleanSym === 'BTC' || cleanSym === 'BTC/USD') {
    return (
      <div
        className={`${sizeClasses} bg-[#1f1304] border border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-950/40 shrink-0 relative overflow-hidden ${className}`}
        title="Bitcoin (BTC)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <circle cx="16" cy="16" r="14" fill="#F7931A" />
          <circle cx="16" cy="16" r="12" stroke="#FFFFFF" strokeWidth="0.6" strokeDasharray="1.5 1.5" />
          <path
            d="M16.5 8.5V10.2M19.5 8.5V10.2M12 11.5H18C19.2 11.5 20.2 12.3 20.2 13.5C20.2 14.5 19.4 15.3 18.3 15.5C19.8 15.8 20.8 16.8 20.8 18.2C20.8 19.6 19.6 20.5 18 20.5H12M15 20.5V23.5M18 20.5V23.5"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M14.5 15.5H18.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // ETH / Ethereum
  if (cleanSym === 'ETH' || cleanSym === 'ETH/USD') {
    return (
      <div
        className={`${sizeClasses} bg-[#0c1024] border border-indigo-400/50 flex items-center justify-center shadow-lg shadow-indigo-950/40 shrink-0 relative overflow-hidden ${className}`}
        title="Ethereum (ETH)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <circle cx="16" cy="16" r="14" fill="#627EEA" />
          {/* Faceted Crystal Octahedron */}
          <path d="M16 5.5L8.5 17.5L16 21.5L23.5 17.5L16 5.5Z" fill="#FFFFFF" fillOpacity="0.9" />
          <path d="M16 5.5L8.5 17.5L16 21.5V5.5Z" fill="#FFFFFF" fillOpacity="0.6" />
          <path d="M16 22.8L8.5 18.8L16 28.5L23.5 18.8L16 22.8Z" fill="#FFFFFF" fillOpacity="0.9" />
          <path d="M16 22.8L8.5 18.8L16 28.5V22.8Z" fill="#FFFFFF" fillOpacity="0.6" />
        </svg>
      </div>
    );
  }

  // SOL / Solana
  if (cleanSym === 'SOL' || cleanSym === 'SOL/USD') {
    return (
      <div
        className={`${sizeClasses} bg-[#0b0417] border border-purple-500/50 flex items-center justify-center shadow-lg shadow-purple-950/40 shrink-0 relative overflow-hidden ${className}`}
        title="Solana (SOL)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="7" fill="#0E041E" />
          <defs>
            <linearGradient id="solGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#14F195" />
              <stop offset="100%" stopColor="#9945FF" />
            </linearGradient>
          </defs>
          <path d="M7 8.5L9.5 6H25L22.5 8.5H7Z" fill="url(#solGrad)" />
          <path d="M22.5 14L25 16.5H9.5L7 14H22.5Z" fill="url(#solGrad)" />
          <path d="M7 24.5L9.5 22H25L22.5 24.5H7Z" fill="url(#solGrad)" />
        </svg>
      </div>
    );
  }

  // BNB / Binance Coin
  if (cleanSym === 'BNB' || cleanSym === 'BNB/USD') {
    return (
      <div
        className={`${sizeClasses} bg-[#1f1903] border border-yellow-400/50 flex items-center justify-center shadow-lg shadow-yellow-950/40 shrink-0 relative overflow-hidden ${className}`}
        title="BNB Binance Coin"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <circle cx="16" cy="16" r="14" fill="#F3BA2F" />
          <path d="M16 11.5L19 14.5L21.5 12L16 6.5L10.5 12L13 14.5L16 11.5Z" fill="#FFFFFF" />
          <path d="M16 20.5L13 17.5L10.5 20L16 25.5L21.5 20L19 17.5L16 20.5Z" fill="#FFFFFF" />
          <path d="M16 14.5L18 16.5L16 18.5L14 16.5L16 14.5Z" fill="#FFFFFF" />
          <path d="M9 14.5L7 16.5L9 18.5L11 16.5L9 14.5Z" fill="#FFFFFF" />
          <path d="M23 14.5L21 16.5L23 18.5L25 16.5L23 14.5Z" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // XRP / Ripple
  if (cleanSym === 'XRP' || cleanSym === 'XRP/USD') {
    return (
      <div
        className={`${sizeClasses} bg-[#061222] border border-sky-400/50 flex items-center justify-center shadow-lg shadow-sky-950/40 shrink-0 relative overflow-hidden ${className}`}
        title="Ripple (XRP)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <circle cx="16" cy="16" r="14" fill="#23292F" />
          <path
            d="M24 8L19.5 12.5C18.5 13.5 17 13.5 16 12.5L11.5 8H8L14 14C15.5 15.5 17.5 15.5 19 14L25 8H24Z"
            fill="#FFFFFF"
          />
          <path
            d="M8 24L12.5 19.5C13.5 18.5 15 18.5 16 19.5L20.5 24H24L18 18C16.5 16.5 14.5 16.5 13 18L7 24H8Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    );
  }

  // -------------------------------------------------------------
  // COMMODITIES & FOREX
  // -------------------------------------------------------------

  // GOLD / XAU
  if (cleanSym.includes('GOLD') || cleanSym.includes('XAU')) {
    return (
      <div
        className={`${sizeClasses} bg-[#211804] border border-amber-400/60 flex items-center justify-center shadow-lg shadow-amber-950/40 shrink-0 relative overflow-hidden ${className}`}
        title="Fine Gold (XAU/USD)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="7" fill="#1C1402" />
          <path d="M6 21L10 10H22L18 21Z" fill="#FACC15" />
          <path d="M10 10L13 6H26L22 10Z" fill="#FEF08A" />
          <path d="M22 10L26 6L21 16.5L18 21Z" fill="#A16207" />
          <text x="14" y="17" fill="#713F12" fontSize="6" fontWeight="900" fontFamily="sans-serif">
            999.9
          </text>
        </svg>
      </div>
    );
  }

  // OIL / WTI
  if (cleanSym.includes('OIL') || cleanSym.includes('WTI')) {
    return (
      <div
        className={`${sizeClasses} bg-[#1a1204] border border-amber-600/50 flex items-center justify-center shadow-lg shadow-amber-950/40 shrink-0 relative overflow-hidden ${className}`}
        title="WTI Crude Oil"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="7" fill="#140E02" />
          {/* Black Gold Oil Drop with flame highlight */}
          <path
            d="M16 6C16 6 9 16 9 20C9 23.8 12.1 26.5 16 26.5C19.9 26.5 23 23.8 23 20C23 16 16 6 16 6Z"
            fill="#D97706"
          />
          <path
            d="M16 8C16 8 11 16.5 11 20C11 22.8 13.2 24.5 16 24.5C18.8 24.5 21 22.8 21 20C21 16.5 16 8 16 8Z"
            fill="#1E1B18"
          />
          <circle cx="18" cy="18" r="2" fill="#F59E0B" opacity="0.8" />
        </svg>
      </div>
    );
  }

  // USD/IDR Forex
  if (cleanSym.includes('IDR') || cleanSym === 'USD/IDR') {
    return (
      <div
        className={`${sizeClasses} bg-[#0c1f17] border border-emerald-400/50 flex items-center justify-center shadow-lg shadow-emerald-950/40 shrink-0 relative overflow-hidden ${className}`}
        title="USD/IDR Forex Exchange"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#081812" />
          <circle cx="12" cy="16" r="8" fill="#10B981" />
          <text x="9" y="20" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="sans-serif">
            $
          </text>
          <circle cx="21" cy="16" r="6" fill="#EF4444" stroke="#081812" strokeWidth="1.5" />
          <text x="17.5" y="19" fill="#FFFFFF" fontSize="8" fontWeight="900" fontFamily="sans-serif">
            Rp
          </text>
        </svg>
      </div>
    );
  }

  // EUR/USD Forex
  if (cleanSym === 'EUR/USD' || cleanSym.includes('EUR')) {
    return (
      <div
        className={`${sizeClasses} bg-[#0a1832] border border-blue-400/50 flex items-center justify-center shadow-lg shadow-blue-950/40 shrink-0 relative overflow-hidden ${className}`}
        title="EUR/USD Forex Exchange"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#061228" />
          <circle cx="16" cy="16" r="11" fill="#003399" />
          <text x="11.5" y="20.5" fill="#FFCC00" fontSize="13" fontWeight="900" fontFamily="sans-serif">
            €
          </text>
        </svg>
      </div>
    );
  }

  // GBP/USD Forex
  if (cleanSym === 'GBP/USD' || cleanSym.includes('GBP')) {
    return (
      <div
        className={`${sizeClasses} bg-[#190a1f] border border-purple-400/50 flex items-center justify-center shadow-lg shadow-purple-950/40 shrink-0 relative overflow-hidden ${className}`}
        title="GBP/USD Forex Exchange"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#120517" />
          <circle cx="16" cy="16" r="11" fill="#7C3AED" />
          <text x="11.5" y="21" fill="#FFFFFF" fontSize="14" fontWeight="900" fontFamily="sans-serif">
            £
          </text>
        </svg>
      </div>
    );
  }

  // -------------------------------------------------------------
  // INDONESIAN BLUECHIP STOCKS (IDX)
  // -------------------------------------------------------------

  // 1. COMPOSITE / IHSG (Bursa Efek Indonesia)
  if (cleanSym === 'COMPOSITE' || cleanSym === 'IHSG') {
    return (
      <div
        className={`${sizeClasses} bg-[#1f070b] border border-red-500/50 flex items-center justify-center shadow-lg shadow-red-950/40 shrink-0 relative overflow-hidden ${className}`}
        title="IHSG - Indeks Harga Saham Gabungan (IDX)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#180407" />
          <path d="M6 16L16 6L26 16L16 26Z" fill="#EF4444" />
          <path d="M6 16L16 16L26 16L16 26Z" fill="#FFFFFF" opacity="0.95" />
          <circle cx="16" cy="16" r="3.5" fill="#180407" />
          <path d="M16 9V23M9 16H23" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="16" cy="16" r="1.5" fill="#FBBF24" />
        </svg>
      </div>
    );
  }

  // 2. BBCA (Bank Central Asia)
  if (cleanSym === 'BBCA') {
    return (
      <div
        className={`${sizeClasses} bg-[#002D62] border border-blue-400/50 flex items-center justify-center text-white font-black shadow-lg shadow-blue-950/40 shrink-0 select-none ${className}`}
        title="Bank Central Asia (BBCA)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#003580" />
          <path
            d="M8 9H16C19 9 21 11 21 13C21 14.5 20 15.5 19 16C20.5 16.5 22 18 22 20C22 22.5 19.5 23.5 16.5 23.5H8V9Z"
            fill="#FFFFFF"
          />
          <path d="M11 11.5V14.5H15.5C16.8 14.5 17.5 13.8 17.5 13C17.5 12.2 16.8 11.5 15.5 11.5H11Z" fill="#003580" />
          <path d="M11 17.5V21H16.5C18 21 18.8 20.2 18.8 19.2C18.8 18.2 18 17.5 16.5 17.5H11Z" fill="#003580" />
        </svg>
      </div>
    );
  }

  // 3. BBRI (Bank Rakyat Indonesia)
  if (cleanSym === 'BBRI') {
    return (
      <div
        className={`${sizeClasses} bg-[#00529B] border border-orange-400/50 flex items-center justify-center shadow-lg shadow-blue-950/40 shrink-0 select-none ${className}`}
        title="Bank Rakyat Indonesia (BBRI)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#00529B" />
          <path d="M7 9H16C18.8 9 21 10.8 21 13.2C21 15.5 19 17 16.5 17H11.5V23H7V9Z" fill="#FFFFFF" />
          <path d="M16 16L22.5 23H17.5L12 17H16Z" fill="#F37021" />
          <circle cx="21" cy="10.5" r="2.8" fill="#F37021" />
        </svg>
      </div>
    );
  }

  // 4. BMRI (Bank Mandiri)
  if (cleanSym === 'BMRI') {
    return (
      <div
        className={`${sizeClasses} bg-[#0B1E3F] border border-amber-400/50 flex items-center justify-center shadow-lg shadow-blue-950/40 shrink-0 select-none ${className}`}
        title="Bank Mandiri (BMRI)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#091B38" />
          <path d="M6 18C10 13 18 10 26 12C21 16 14 18 6 18Z" fill="#F7A800" />
          <path d="M8 21C13 17 20 15 26 16C21 19 15 21 8 21Z" fill="#FFD200" />
          <circle cx="24" cy="9" r="2.2" fill="#F7A800" />
        </svg>
      </div>
    );
  }

  // 5. TLKM (Telkom Indonesia)
  if (cleanSym === 'TLKM') {
    return (
      <div
        className={`${sizeClasses} bg-[#1f0707] border border-red-500/50 flex items-center justify-center shadow-lg shadow-red-950/40 shrink-0 select-none ${className}`}
        title="Telkom Indonesia (TLKM)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#180404" />
          <circle cx="16" cy="16" r="10" stroke="#EE2E24" strokeWidth="2.8" fill="none" />
          <circle cx="16" cy="16" r="4.5" fill="#9CA3AF" />
          <path d="M16 6C21.5 6 26 10.5 26 16" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 6. ASII (Astra International)
  if (cleanSym === 'ASII') {
    return (
      <div
        className={`${sizeClasses} bg-[#091834] border border-blue-400/50 flex items-center justify-center shadow-lg shrink-0 select-none ${className}`}
        title="Astra International (ASII)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#0A1C40" />
          <path
            d="M16 5L18.5 12.5H26L20 17L22.5 24.5L16 20L9.5 24.5L12 17L6 12.5H13.5L16 5Z"
            fill="#FFFFFF"
          />
          <circle cx="16" cy="16" r="2.5" fill="#0A1C40" />
        </svg>
      </div>
    );
  }

  // 7. BBNI (Bank Negara Indonesia 46)
  if (cleanSym === 'BBNI') {
    return (
      <div
        className={`${sizeClasses} bg-[#042426] border border-teal-400/50 flex items-center justify-center shadow-lg shrink-0 select-none ${className}`}
        title="Bank BNI 46"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#042022" />
          <circle cx="16" cy="16" r="10" fill="#006666" />
          <text x="9" y="20.5" fill="#F97316" fontSize="13" fontWeight="900" fontFamily="sans-serif">
            46
          </text>
        </svg>
      </div>
    );
  }

  // -------------------------------------------------------------
  // US TECH LEADERS (NASDAQ & NYSE)
  // -------------------------------------------------------------

  // NVDA (NVIDIA Corporation)
  if (cleanSym === 'NVDA') {
    return (
      <div
        className={`${sizeClasses} bg-[#061808] border border-[#76B900]/60 flex items-center justify-center shadow-lg shadow-green-950/40 shrink-0 select-none ${className}`}
        title="NVIDIA Corporation (NVDA)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#041206" />
          <path
            d="M16 7C10.5 7 6 11.5 6 17C6 21 8.5 24.5 12 26V23C9.8 21.8 8.5 19.5 8.5 17C8.5 12.8 11.8 9.5 16 9.5C18.5 9.5 20.8 10.7 22.2 12.5L24.5 10.5C22.5 8.3 19.4 7 16 7Z"
            fill="#76B900"
          />
          <path
            d="M16 11.5C13 11.5 10.5 14 10.5 17C10.5 19.2 12 21 14 21.8V19.5C13.2 19 12.8 18 12.8 17C12.8 15.2 14.2 13.8 16 13.8C17.2 13.8 18.2 14.5 18.8 15.5L21 14C20 12.5 18.2 11.5 16 11.5Z"
            fill="#FFFFFF"
          />
          <circle cx="16" cy="17" r="1.5" fill="#76B900" />
        </svg>
      </div>
    );
  }

  // AAPL (Apple Inc.)
  if (cleanSym === 'AAPL') {
    return (
      <div
        className={`${sizeClasses} bg-[#181B20] border border-neutral-500/50 flex items-center justify-center shadow-lg shrink-0 select-none ${className}`}
        title="Apple Inc. (AAPL)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="7" fill="#121418" />
          <path
            d="M20.5 16.5C20.5 13.8 22.8 12.3 22.9 12.2C21.6 10.3 19.6 10.1 18.9 10C17.2 9.8 15.6 11 14.7 11C13.8 11 12.5 10 11.1 10C9.3 10 7.6 11.1 6.7 12.7C4.8 16 6.2 20.9 8.1 23.6C9 24.9 10 26.4 11.5 26.3C12.9 26.2 13.5 25.4 15.1 25.4C16.7 25.4 17.2 26.3 18.7 26.3C20.2 26.3 21.1 24.9 22 23.6C23 22.1 23.4 20.7 23.5 20.6C23.4 20.5 20.5 19.4 20.5 16.5Z"
            fill="#E5E7EB"
          />
          <path
            d="M17.8 8.5C18.5 7.6 19 6.3 18.8 5C17.7 5.1 16.4 5.7 15.7 6.6C15.1 7.3 14.6 8.6 14.8 9.9C16 10 17.2 9.4 17.8 8.5Z"
            fill="#E5E7EB"
          />
        </svg>
      </div>
    );
  }

  // TSLA (Tesla Inc.)
  if (cleanSym === 'TSLA') {
    return (
      <div
        className={`${sizeClasses} bg-[#1D090B] border border-[#E82127]/60 flex items-center justify-center shadow-lg shadow-red-950/40 shrink-0 select-none ${className}`}
        title="Tesla Inc. (TSLA)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="7" fill="#140607" />
          <path
            d="M16 9.5L24 6.5C23.5 7.5 21.5 8.2 19.5 8.5L17.5 10.5V25H14.5V10.5L12.5 8.5C10.5 8.2 8.5 7.5 8 6.5L16 9.5Z"
            fill="#E82127"
          />
          <path
            d="M16 6C19.5 6 23.5 6.8 25 8C23.5 9 20 9.8 16 9.8C12 9.8 8.5 9 7 8C8.5 6.8 12.5 6 16 6Z"
            fill="#E82127"
          />
        </svg>
      </div>
    );
  }

  // MSFT (Microsoft)
  if (cleanSym === 'MSFT') {
    return (
      <div
        className={`${sizeClasses} bg-[#0F141F] border border-neutral-600/50 flex items-center justify-center shadow-lg shrink-0 select-none ${className}`}
        title="Microsoft Corporation (MSFT)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="7" fill="#0A0E17" />
          <rect x="7" y="7" width="8" height="8" fill="#F25022" />
          <rect x="17" y="7" width="8" height="8" fill="#7FBA00" />
          <rect x="7" y="17" width="8" height="8" fill="#00A4EF" />
          <rect x="17" y="17" width="8" height="8" fill="#FFB900" />
        </svg>
      </div>
    );
  }

  // AMZN (Amazon)
  if (cleanSym === 'AMZN') {
    return (
      <div
        className={`${sizeClasses} bg-[#11141C] border border-amber-500/50 flex items-center justify-center shadow-lg shrink-0 select-none ${className}`}
        title="Amazon.com Inc. (AMZN)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="7" fill="#0D1017" />
          <text x="6" y="18" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif">
            a
          </text>
          <path
            d="M7 21C12 25 18 24 24 19M24 19L21.5 18.5M24 19L24.5 21.5"
            stroke="#FF9900"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // GOOGL or GOOG (Google)
  if (cleanSym === 'GOOGL' || cleanSym === 'GOOG') {
    return (
      <div
        className={`${sizeClasses} bg-[#11141C] border border-blue-400/40 flex items-center justify-center shadow-lg shrink-0 select-none ${className}`}
        title="Alphabet Google (GOOGL)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="7" fill="#0A0E17" />
          <path
            d="M24.5 16.3C24.5 15.6 24.4 15 24.3 14.4H16V17.8H20.8C20.6 18.9 19.9 19.9 19 20.6V22.9H21.9C23.6 21.3 24.5 19 24.5 16.3Z"
            fill="#4285F4"
          />
          <path
            d="M16 25C18.4 25 20.5 24.2 21.9 22.9L19 20.6C18.2 21.1 17.2 21.5 16 21.5C13.7 21.5 11.7 20 11 17.9H8V20.2C9.5 23.1 12.5 25 16 25Z"
            fill="#34A853"
          />
          <path
            d="M11 17.9C10.8 17.3 10.7 16.7 10.7 16C10.7 15.3 10.8 14.7 11 14.1V11.8H8C7.4 13.1 7 14.5 7 16C7 17.5 7.4 18.9 8 20.2L11 17.9Z"
            fill="#FBBC05"
          />
          <path
            d="M16 10.5C17.3 10.5 18.5 11 19.4 11.8L22 9.2C20.4 7.7 18.4 7 16 7C12.5 7 9.5 8.9 8 11.8L11 14.1C11.7 12 13.7 10.5 16 10.5Z"
            fill="#EA4335"
          />
        </svg>
      </div>
    );
  }

  // META (Meta Platforms)
  if (cleanSym === 'META') {
    return (
      <div
        className={`${sizeClasses} bg-[#0A1224] border border-blue-500/50 flex items-center justify-center shadow-lg shrink-0 select-none ${className}`}
        title="Meta Platforms Inc. (META)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="7" fill="#070D1B" />
          <path
            d="M16 18.5C13.8 15 11.5 12 8.5 12C5.5 12 4 14.5 4 17C4 19.5 5.5 22 8.5 22C11.5 22 13.8 19 16 15.5C18.2 12 20.5 9 23.5 9C26.5 9 28 11.5 28 14C28 16.5 26.5 19 23.5 19C20.5 19 18.2 16 16 12.5"
            stroke="#0081FB"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // Global Indices (S&P 500, Dow Jones, DXY, VIX)
  if (['SPX', 'S&P 500', 'DJI', 'DXY', 'VIX'].includes(cleanSym)) {
    return (
      <div
        className={`${sizeClasses} bg-[#091522] border border-cyan-400/50 flex items-center justify-center shadow-lg shrink-0 select-none ${className}`}
        title={`${symbol} Index`}
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="7" fill="#060F18" />
          <path d="M6 22L12 15L17 19L26 9" stroke="#00C8FF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="26" cy="9" r="2.8" fill="#00C8FF" />
        </svg>
      </div>
    );
  }

  // Fallback: Elegant colored glass monogram according to market
  const marketColor =
    market === 'IDX'
      ? { bg: 'bg-[#1C0A0D]/90', border: 'border-red-500/50', text: 'text-red-300', badge: 'IDX' }
      : market === 'NASDAQ'
      ? { bg: 'bg-[#04121F]/90', border: 'border-cyan-500/50', text: 'text-cyan-200', badge: 'NAS' }
      : market === 'NYSE'
      ? { bg: 'bg-[#08101E]/90', border: 'border-blue-500/50', text: 'text-blue-200', badge: 'NYS' }
      : market === 'CRYPTO'
      ? { bg: 'bg-[#1a0e02]/90', border: 'border-amber-500/50', text: 'text-amber-300', badge: 'CRYPTO' }
      : market === 'FOREX'
      ? { bg: 'bg-[#04170e]/90', border: 'border-emerald-500/50', text: 'text-emerald-300', badge: 'FX' }
      : market === 'COMMODITY'
      ? { bg: 'bg-[#1a1402]/90', border: 'border-yellow-500/50', text: 'text-yellow-300', badge: 'CMD' }
      : { bg: 'bg-[#0B1A14]/90', border: 'border-teal-500/50', text: 'text-teal-200', badge: 'GLB' };

  return (
    <div
      className={`${sizeClasses} ${marketColor.bg} border ${marketColor.border} backdrop-blur-md flex flex-col items-center justify-center font-black ${marketColor.text} shadow-lg shrink-0 select-none relative overflow-hidden ${className}`}
    >
      <span className="leading-none tracking-tighter drop-shadow-sm">{cleanSym.slice(0, 3)}</span>
      <span className="text-[7px] opacity-75 font-bold tracking-widest scale-90 -mt-0.5">
        {marketColor.badge}
      </span>
    </div>
  );
};
