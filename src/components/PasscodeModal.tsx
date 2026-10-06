import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, KeyRound, ShieldAlert, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language?: Language;
  title?: string;
  subtitle?: string;
  actionType?: 'profile' | 'trade' | 'general';
}

const CORRECT_PIN = '708951';

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language = 'en',
  title,
  subtitle,
  actionType = 'profile',
}) => {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showDigits, setShowDigits] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isId = language === 'id';

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg('');
      setIsShaking(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDigitClick = (digit: string) => {
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');

      if (nextPin.length === 6) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setErrorMsg('');
    }
  };

  const handleClear = () => {
    setPin('');
    setErrorMsg('');
  };

  const verifyPin = (codeToVerify: string) => {
    if (codeToVerify === CORRECT_PIN) {
      setErrorMsg('');
      // Quick subtle success feedback
      setTimeout(() => {
        onSuccess();
      }, 150);
    } else {
      setIsShaking(true);
      setErrorMsg(
        isId
          ? 'Sandi PIN salah! Silakan coba lagi.'
          : 'Incorrect passcode! Please try again.'
      );
      setTimeout(() => {
        setIsShaking(false);
        setPin('');
        inputRef.current?.focus();
      }, 600);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      handleBackspace();
    } else if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      if (pin.length === 6) {
        verifyPin(pin);
      }
    } else if (/^[0-9]$/.test(e.key)) {
      handleDigitClick(e.key);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={`liquid-glass-accent bg-[#0c121e]/90 border border-white/15 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col backdrop-blur-2xl transition-transform ${
          isShaking ? 'translate-x-1 animate-bounce' : ''
        }`}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              actionType === 'trade'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
            }`}>
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {title || (actionType === 'trade'
                  ? (isId ? 'Otorisasi PIN Transaksi' : 'Trade PIN Authorization')
                  : (isId ? 'Profil Terkunci' : 'Locked Profile'))}
              </h3>
              <p className="text-[10px] text-neutral-400">
                {subtitle || (actionType === 'trade'
                  ? (isId ? 'Akses Eksekusi Jual / Beli Saham' : 'Accessing Buy / Sell Stock Execution')
                  : (isId ? 'Keamanan Akun Terproteksi' : 'Account Security'))}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a202c] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className={`w-14 h-14 rounded-full border flex items-center justify-center shadow-inner ${
            actionType === 'trade'
              ? 'bg-[#0f1f1a] border-[#1d4436] text-emerald-400'
              : 'bg-[#161d2b] border-[#25324b] text-[#2962ff]'
          }`}>
            <KeyRound className="w-7 h-7" />
          </div>

          <div>
            <h4 className="text-base font-bold text-white">
              {actionType === 'trade'
                ? (isId ? 'Masukkan PIN Transaksi' : 'Enter Trade PIN')
                : (isId ? 'Masukkan Sandi Akses' : 'Enter Security Passcode')}
            </h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-[240px]">
              {actionType === 'trade'
                ? (isId
                  ? 'Akses jual atau beli memerlukan verifikasi. Masukkan 6 digit PIN untuk melanjutkan.'
                  : 'Buy or Sell order requires authorization. Enter 6-digit PIN to proceed.')
                : (isId
                  ? 'Tombol profil diamankan. Masukkan 6 digit sandi untuk melanjutkan.'
                  : 'Profile is locked. Enter the 6-digit passcode to continue.')}
            </p>
          </div>

          {/* Hidden input for keyboard on mobile/desktop */}
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pin}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6);
              setPin(val);
              if (val.length === 6) verifyPin(val);
            }}
            className="opacity-0 absolute -z-10 h-0 w-0"
            autoFocus
          />

          {/* 6 Digit Indicators */}
          <div
            className="flex items-center justify-center gap-3 py-2 cursor-pointer"
            onClick={() => inputRef.current?.focus()}
          >
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const isFilled = index < pin.length;
              const isCurrent = index === pin.length;
              return (
                <div
                  key={index}
                  className={`w-10 h-12 rounded-xl border flex items-center justify-center text-lg font-bold font-mono transition-all duration-150 ${
                    isFilled
                      ? 'border-emerald-500/80 bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-500/20'
                      : isCurrent
                      ? 'border-[#2962ff] bg-[#1a2337] ring-2 ring-[#2962ff]/30 text-neutral-400'
                      : 'border-[#202738] bg-[#121622] text-neutral-600'
                  }`}
                >
                  {isFilled ? (showDigits ? pin[index] : '●') : ''}
                </div>
              );
            })}
          </div>

          {/* Toggle Show Digits */}
          <div className="flex items-center justify-between w-full px-2 text-[11px] text-neutral-400">
            <button
              type="button"
              onClick={() => setShowDigits(!showDigits)}
              className="flex items-center gap-1.5 hover:text-neutral-200 transition-colors cursor-pointer"
            >
              {showDigits ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showDigits ? (isId ? 'Sembunyikan' : 'Hide') : (isId ? 'Tampilkan Sandi' : 'Show Passcode')}</span>
            </button>
            <span className="font-mono text-neutral-400">{pin.length}/6</span>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg w-full">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="text-left text-[11px] font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 w-full pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleDigitClick(digit)}
                className="h-11 rounded-xl bg-[#141a27] hover:bg-[#1c2436] active:bg-[#2962ff] active:text-white border border-[#21293c] text-white font-bold text-base transition-colors flex items-center justify-center cursor-pointer select-none"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={handleClear}
              className="h-11 rounded-xl bg-[#141a27] hover:bg-rose-950/40 text-neutral-400 hover:text-rose-300 border border-[#21293c] font-semibold text-xs transition-colors flex items-center justify-center cursor-pointer select-none"
            >
              {isId ? 'Hapus' : 'Clear'}
            </button>
            <button
              type="button"
              onClick={() => handleDigitClick('0')}
              className="h-11 rounded-xl bg-[#141a27] hover:bg-[#1c2436] active:bg-[#2962ff] active:text-white border border-[#21293c] text-white font-bold text-base transition-colors flex items-center justify-center cursor-pointer select-none"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-11 rounded-xl bg-[#141a27] hover:bg-[#1c2436] text-neutral-400 hover:text-white border border-[#21293c] font-semibold text-sm transition-colors flex items-center justify-center cursor-pointer select-none"
            >
              ⌫
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
