import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, KeyRound, ShieldAlert, X, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Language } from '../types';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  language?: Language;
}

const CORRECT_PIN = '708951';

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  language = 'id',
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
          ? 'Sandi PIN salah! Silakan coba lagi dengan sandi 708951.'
          : 'Incorrect passcode! Please try again with PIN 708951.'
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
        className={`bg-[#0e121a] border border-[#212738] rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col transition-transform ${
          isShaking ? 'translate-x-1 animate-bounce' : ''
        }`}
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-[#1e2434] flex items-center justify-between bg-[#121722]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {isId ? 'Profil Terkunci' : 'Locked Profile'}
              </h3>
              <p className="text-[10px] text-neutral-400">
                {isId ? 'Keamanan Akun Achmad Husain' : 'Account Security'}
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
          <div className="w-14 h-14 rounded-full bg-[#161d2b] border border-[#25324b] flex items-center justify-center text-[#2962ff] shadow-inner">
            <KeyRound className="w-7 h-7" />
          </div>

          <div>
            <h4 className="text-base font-bold text-white">
              {isId ? 'Masukkan Sandi Akses' : 'Enter Security Passcode'}
            </h4>
            <p className="text-xs text-neutral-400 mt-1 max-w-[240px]">
              {isId
                ? 'Tombol profil diamankan. Masukkan 6 digit sandi untuk melanjutkan.'
                : 'Profile is locked. Enter the 6-digit passcode to continue.'}
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

          {/* Passcode Hint Pill */}
          <div className="w-full bg-[#121622] border border-[#1e2538] rounded-xl p-2.5 text-center">
            <p className="text-[11px] text-neutral-400">
              {isId ? 'Sandi keamanan yang ditentukan:' : 'Authorized passcode:'}{' '}
              <strong className="text-amber-400 tracking-wider font-mono font-bold">708951</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
