import React from 'react';
import { MarketType } from '../types';

interface MarketLogoProps {
  market: MarketType | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

/**
 * High-definition visual logo for stock market exchanges (IDX, NASDAQ, NYSE, GLOBAL)
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

  if (normalized === 'IDX' || normalized === 'IHSG') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-md font-bold tracking-tight select-none ${
          showLabel ? `bg-[#180e14] border border-red-500/30 text-white ${dim.px}` : ''
        } ${className}`}
        title="Bursa Efek Indonesia (IDX)"
      >
        {/* Official IDX stylized red & white emblem */}
        <svg
          viewBox="0 0 24 24"
          className={`${dim.box} shrink-0`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="5" fill="#1C0A0D" />
          {/* Indonesia Flag Ribbon / Diamond */}
          <path d="M4 12L12 4L20 12L12 20Z" fill="#C5221F" />
          <path d="M4 12L12 12L20 12L12 20Z" fill="#FFFFFF" opacity="0.95" />
          {/* Inner Geometric Star Accent */}
          <circle cx="12" cy="12" r="2.8" fill="#1C0A0D" />
          <path d="M12 7V17M7 12H17" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        {showLabel && (
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-wider text-red-400 ${dim.text}`}>IDX</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-red-500/20 text-red-300 font-semibold uppercase">
              ID
            </span>
          </div>
        )}
      </div>
    );
  }

  if (normalized === 'NASDAQ') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-md font-bold tracking-tight select-none ${
          showLabel ? `bg-[#061826] border border-cyan-500/30 text-white ${dim.px}` : ''
        } ${className}`}
        title="NASDAQ US Tech Stock Exchange"
      >
        {/* Official NASDAQ stylized cyan geometric prism/ribbon */}
        <svg
          viewBox="0 0 24 24"
          className={`${dim.box} shrink-0`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="5" fill="#04121F" />
          {/* NASDAQ stylized angled faceted polygon */}
          <path
            d="M5 16.5L10.5 6H14L8.5 16.5H5Z"
            fill="#00A3E0"
          />
          <path
            d="M11 16.5L16.5 6H20L14.5 16.5H11Z"
            fill="#00C8FF"
            fillOpacity="0.85"
          />
          <circle cx="17" cy="8.5" r="1.5" fill="#FFFFFF" />
        </svg>
        {showLabel && (
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-wider text-cyan-300 ${dim.text}`}>NASDAQ</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-200 font-semibold uppercase">
              US
            </span>
          </div>
        )}
      </div>
    );
  }

  if (normalized === 'NYSE') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 rounded-md font-bold tracking-tight select-none ${
          showLabel ? `bg-[#0c1424] border border-blue-500/30 text-white ${dim.px}` : ''
        } ${className}`}
        title="New York Stock Exchange (NYSE)"
      >
        {/* Official NYSE classical ionic facade / emblem */}
        <svg
          viewBox="0 0 24 24"
          className={`${dim.box} shrink-0`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="24" height="24" rx="5" fill="#08101E" />
          {/* Wall Street Classical Pediment & Columns */}
          <path d="M4 8L12 4L20 8H4Z" fill="#F5A623" />
          <rect x="5.5" y="9.5" width="2" height="7.5" rx="0.5" fill="#D9E2EC" />
          <rect x="9.5" y="9.5" width="2" height="7.5" rx="0.5" fill="#D9E2EC" />
          <rect x="13.5" y="9.5" width="2" height="7.5" rx="0.5" fill="#D9E2EC" />
          <rect x="17.5" y="9.5" width="2" height="7.5" rx="0.5" fill="#D9E2EC" />
          <rect x="3.5" y="17.5" width="17" height="2.5" rx="0.5" fill="#F5A623" />
        </svg>
        {showLabel && (
          <div className="flex items-center gap-1">
            <span className={`font-black tracking-wider text-blue-300 ${dim.text}`}>NYSE</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-200 font-semibold uppercase">
              US
            </span>
          </div>
        )}
      </div>
    );
  }

  // Fallback: GLOBAL / INDEX / S&P
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-md font-bold tracking-tight select-none ${
        showLabel ? `bg-[#0d1720] border border-emerald-500/30 text-white ${dim.px}` : ''
      } ${className}`}
      title="Pasar Global & Indeks Acuan"
    >
      <svg
        viewBox="0 0 24 24"
        className={`${dim.box} shrink-0`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" rx="5" fill="#09141B" />
        {/* Globe with latitude/longitude & orbital glow */}
        <circle cx="12" cy="12" r="7.5" stroke="#10B981" strokeWidth="1.5" fill="#0B2320" />
        <ellipse cx="12" cy="12" rx="4" ry="7.5" stroke="#34D399" strokeWidth="1.2" />
        <path d="M4.5 12H19.5" stroke="#34D399" strokeWidth="1.2" />
        <path d="M6 7.5H18" stroke="#10B981" strokeWidth="0.8" opacity="0.7" />
        <path d="M6 16.5H18" stroke="#10B981" strokeWidth="0.8" opacity="0.7" />
      </svg>
      {showLabel && (
        <div className="flex items-center gap-1">
          <span className={`font-black tracking-wider text-emerald-300 ${dim.text}`}>GLOBAL</span>
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
 * Authentic brand logo for specific stocks and global indices
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

  // 1. COMPOSITE / IHSG (Bursa Efek Indonesia)
  if (cleanSym === 'COMPOSITE' || cleanSym === 'IHSG') {
    return (
      <div
        className={`${sizeClasses} bg-[#1a080c] border border-red-500/40 flex items-center justify-center shadow-md shrink-0 relative overflow-hidden ${className}`}
        title="IHSG - Indeks Harga Saham Gabungan (IDX)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="6" fill="#18070A" />
          <path d="M6 16L16 6L26 16L16 26Z" fill="#E11D48" />
          <path d="M6 16L16 16L26 16L16 26Z" fill="#FFFFFF" opacity="0.95" />
          <circle cx="16" cy="16" r="3" fill="#18070A" />
          <path d="M16 9V23M9 16H23" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 2. BBCA (Bank Central Asia)
  if (cleanSym === 'BBCA') {
    return (
      <div
        className={`${sizeClasses} bg-[#002D62] border border-blue-400/40 flex items-center justify-center text-white font-black shadow-md shrink-0 select-none ${className}`}
        title="Bank Central Asia (BBCA)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="6" fill="#003580" />
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
        className={`${sizeClasses} bg-[#00529B] border border-orange-400/40 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title="Bank Rakyat Indonesia (BBRI)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="6" fill="#00529B" />
          <path d="M7 10H16C18.5 10 20 11.5 20 13.5C20 15.5 18.5 17 16 17H11V23H7V10Z" fill="#FFFFFF" />
          <path d="M16 16.5L22 23H17.5L12.5 17.5H16Z" fill="#F37021" />
          <circle cx="21" cy="11" r="2.5" fill="#F37021" />
        </svg>
      </div>
    );
  }

  // 4. BMRI (Bank Mandiri)
  if (cleanSym === 'BMRI') {
    return (
      <div
        className={`${sizeClasses} bg-[#0B1E3F] border border-amber-400/40 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title="Bank Mandiri (BMRI)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="6" fill="#091B38" />
          {/* Mandiri Yellow & Gold Ribbon */}
          <path
            d="M6 18C10 13 18 10 26 12C21 16 14 18 6 18Z"
            fill="#F7A800"
          />
          <path
            d="M8 21C13 17 20 15 26 16C21 19 15 21 8 21Z"
            fill="#FFD200"
          />
          <circle cx="24" cy="9" r="2" fill="#F7A800" />
        </svg>
      </div>
    );
  }

  // 5. TLKM (Telkom Indonesia)
  if (cleanSym === 'TLKM') {
    return (
      <div
        className={`${sizeClasses} bg-[#1A0A0A] border border-red-500/40 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title="Telkom Indonesia (TLKM)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="6" fill="#190707" />
          <circle cx="16" cy="16" r="10" stroke="#EE2E24" strokeWidth="2.5" fill="none" />
          <circle cx="16" cy="16" r="4.5" fill="#7D7D7D" />
          <path d="M16 6C21.5 6 26 10.5 26 16" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 6. ASII (Astra International)
  if (cleanSym === 'ASII') {
    return (
      <div
        className={`${sizeClasses} bg-[#0A1A38] border border-blue-400/40 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title="Astra International (ASII)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="6" fill="#0A1C40" />
          {/* Astra Multifaceted 8-point Star */}
          <path
            d="M16 5L18.5 12.5H26L20 17L22.5 24.5L16 20L9.5 24.5L12 17L6 12.5H13.5L16 5Z"
            fill="#FFFFFF"
          />
          <circle cx="16" cy="16" r="2.5" fill="#0A1C40" />
        </svg>
      </div>
    );
  }

  // 7. NVDA (NVIDIA)
  if (cleanSym === 'NVDA') {
    return (
      <div
        className={`${sizeClasses} bg-[#08180A] border border-[#76B900]/50 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title="NVIDIA Corporation (NVDA)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="6" fill="#051206" />
          {/* NVIDIA signature eye curve */}
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

  // 8. AAPL (Apple Inc.)
  if (cleanSym === 'AAPL') {
    return (
      <div
        className={`${sizeClasses} bg-[#181B20] border border-neutral-600/40 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title="Apple Inc. (AAPL)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="6" fill="#121418" />
          {/* Apple Silhouette */}
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

  // 9. TSLA (Tesla Inc.)
  if (cleanSym === 'TSLA') {
    return (
      <div
        className={`${sizeClasses} bg-[#1D090B] border border-[#E82127]/50 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title="Tesla Inc. (TSLA)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="6" fill="#140607" />
          {/* Tesla 'T' Dagger Symbol */}
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

  // 10. MSFT (Microsoft)
  if (cleanSym === 'MSFT') {
    return (
      <div
        className={`${sizeClasses} bg-[#0F141F] border border-neutral-700/50 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title="Microsoft Corporation (MSFT)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="6" fill="#0A0E17" />
          {/* 4 Colored Squares */}
          <rect x="7" y="7" width="8" height="8" fill="#F25022" />
          <rect x="17" y="7" width="8" height="8" fill="#7FBA00" />
          <rect x="7" y="17" width="8" height="8" fill="#00A4EF" />
          <rect x="17" y="17" width="8" height="8" fill="#FFB900" />
        </svg>
      </div>
    );
  }

  // 11. AMZN (Amazon)
  if (cleanSym === 'AMZN') {
    return (
      <div
        className={`${sizeClasses} bg-[#11141C] border border-amber-500/40 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title="Amazon.com Inc. (AMZN)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1" fill="none">
          <rect width="32" height="32" rx="6" fill="#0D1017" />
          <text x="6" y="18" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif">
            a
          </text>
          {/* Amazon Orange Smile Arrow */}
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

  // 12. GOOGL or GOOG (Google Alphabet)
  if (cleanSym === 'GOOGL' || cleanSym === 'GOOG') {
    return (
      <div
        className={`${sizeClasses} bg-[#11141C] border border-blue-500/30 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title="Alphabet Google (GOOGL)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="6" fill="#0A0E17" />
          {/* Google Quad-Color G */}
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

  // 13. META (Meta Platforms)
  if (cleanSym === 'META') {
    return (
      <div
        className={`${sizeClasses} bg-[#0A1224] border border-blue-500/40 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title="Meta Platforms Inc. (META)"
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="6" fill="#070D1B" />
          {/* Meta Infinity Loop */}
          <path
            d="M16 18.5C13.8 15 11.5 12 8.5 12C5.5 12 4 14.5 4 17C4 19.5 5.5 22 8.5 22C11.5 22 13.8 19 16 15.5C18.2 12 20.5 9 23.5 9C26.5 9 28 11.5 28 14C28 16.5 26.5 19 23.5 19C20.5 19 18.2 16 16 12.5"
            stroke="#0081FB"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // 14. Global Indices (S&P 500, Dow Jones, DXY, VIX)
  if (['SPX', 'S&P 500', 'DJI', 'DXY', 'VIX'].includes(cleanSym)) {
    return (
      <div
        className={`${sizeClasses} bg-[#091522] border border-cyan-500/40 flex items-center justify-center shadow-md shrink-0 select-none ${className}`}
        title={`${symbol} Index`}
      >
        <svg viewBox="0 0 32 32" className="w-full h-full p-1.5" fill="none">
          <rect width="32" height="32" rx="6" fill="#060F18" />
          <path d="M6 22L12 15L17 19L26 9" stroke="#00C8FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="26" cy="9" r="2.5" fill="#00C8FF" />
        </svg>
      </div>
    );
  }

  // Fallback: Elegant colored monogram according to market
  const marketColor =
    market === 'IDX'
      ? { bg: 'bg-[#1C0A0D]', border: 'border-red-500/40', text: 'text-red-400', badge: 'IDX' }
      : market === 'NASDAQ'
      ? { bg: 'bg-[#04121F]', border: 'border-cyan-500/40', text: 'text-cyan-300', badge: 'NAS' }
      : market === 'NYSE'
      ? { bg: 'bg-[#08101E]', border: 'border-blue-500/40', text: 'text-blue-300', badge: 'NYS' }
      : { bg: 'bg-[#0B1A14]', border: 'border-emerald-500/40', text: 'text-emerald-300', badge: 'GLB' };

  return (
    <div
      className={`${sizeClasses} ${marketColor.bg} border ${marketColor.border} flex flex-col items-center justify-center font-black ${marketColor.text} shadow-md shrink-0 select-none relative overflow-hidden ${className}`}
    >
      <span className="leading-none tracking-tighter">{cleanSym.slice(0, 3)}</span>
      <span className="text-[7px] text-neutral-400 font-bold tracking-widest scale-90 -mt-0.5">
        {marketColor.badge}
      </span>
    </div>
  );
};
