import React, { useState } from 'react';

interface TerminalLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  showSubtitle?: boolean;
  subtitle?: string;
  className?: string;
}

export const TerminalLogo: React.FC<TerminalLogoProps> = ({
  size = 'md',
  showText = false,
  showSubtitle = true,
  subtitle = 'Global Market Access',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Size mapping
  const sizeMap = {
    sm: 'w-7 h-7 rounded-lg text-xs',
    md: 'w-9 h-9 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-2xl text-base',
    xl: 'w-16 h-16 rounded-3xl text-xl',
    '2xl': 'w-24 h-24 rounded-3xl text-3xl shadow-2xl',
  };

  const imageSizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
  };

  const [logoSrc, setLogoSrc] = useState('/logo.webp');

  const handleImageError = () => {
    if (logoSrc === '/logo.webp') {
      setLogoSrc('/logo.jpg');
    } else {
      setImageError(true);
    }
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Logo Icon with glowing border and subtle animation */}
      <div className="relative group shrink-0">
        {/* Ambient Backlight Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#2962ff] via-[#00c853] to-[#00b0ff] rounded-2xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />

        <div
          className={`relative overflow-hidden border border-[#2a3852] bg-[#0c1017] flex items-center justify-center shadow-xl ${sizeMap[size]}`}
        >
          {!imageError ? (
            <img
              src={logoSrc}
              alt="Market Terminal Logo"
              referrerPolicy="no-referrer"
              className={`object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300 ${imageSizeMap[size]}`}
              onError={handleImageError}
            />
          ) : (
            /* Crisp SVG Fallback Emblem */
            <svg
              viewBox="0 0 40 40"
              className="w-full h-full p-1.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logoGradPrimary" x1="0" y1="0" x2="40" y2="40">
                  <stop offset="0%" stopColor="#2962ff" />
                  <stop offset="50%" stopColor="#00c853" />
                  <stop offset="100%" stopColor="#00e5ff" />
                </linearGradient>
              </defs>
              <rect width="40" height="40" rx="10" fill="#090d14" />
              {/* Candlestick & Bull geometric paths */}
              <path
                d="M10 24L16 16L22 21L30 11"
                stroke="url(#logoGradPrimary)"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="8" y="21" width="4" height="8" rx="1" fill="#22ab94" />
              <rect x="20" y="18" width="4" height="11" rx="1" fill="#2962ff" />
              <circle cx="30" cy="11" r="3" fill="#00e5ff" />
            </svg>
          )}
        </div>
      </div>

      {/* Optional Brand Typography */}
      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-black text-white tracking-tight uppercase text-sm sm:text-base">
              NUSA TRADE
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-mono">
              TERMINAL
            </span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] text-neutral-400 font-medium">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
