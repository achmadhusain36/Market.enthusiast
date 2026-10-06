import { useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'user' | 'admin';
  avatarUrl?: string;
  is2FAEnabled: boolean;
  pinCode: string;
  cashBalanceUSD: number;
  cashBalanceIDR: number;
  accountNumber: string;
  tradingMode: 'REAL' | 'DEMO';
  currencyPreference: 'USD' | 'IDR';
  languagePreference: 'id' | 'en';
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-me-default',
  email: 'emhaainunnajib36@gmail.com',
  username: 'market_trader',
  fullName: 'Market Enthusiast',
  role: 'admin', // Gives user access to both App and Admin dashboards seamlessly!
  avatarUrl: '',
  is2FAEnabled: false,
  pinCode: '708951',
  cashBalanceUSD: 10000.00, // Paper trading default $10,000 as requested
  cashBalanceIDR: 156000000,
  accountNumber: 'RDN-BCA-8829-0192',
  tradingMode: 'DEMO',
  currencyPreference: 'USD',
  languagePreference: 'id',
};

// Simple reactive subscriber system so all components using useAuthStore stay synchronized
type Listener = () => void;
let listeners: Listener[] = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

const STORAGE_PROFILE_KEY = 'me_user_profile_v3';
const STORAGE_AUTH_KEY = 'me_auth_session_active';

let storedUser: UserProfile = (() => {
  const saved = localStorage.getItem(STORAGE_PROFILE_KEY) || localStorage.getItem('nusa_user_profile_v2');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Clean up legacy display name if present
      if (parsed.fullName === 'Achmad Husain') {
        parsed.fullName = 'Market Enthusiast';
      }
      return { ...DEFAULT_USER, ...parsed };
    } catch (e) {}
  }
  return DEFAULT_USER;
})();

let isAuthenticated: boolean = (() => {
  return (
    localStorage.getItem(STORAGE_AUTH_KEY) === 'true' ||
    localStorage.getItem('nusa_auth_session_active') === 'true'
  );
})();

export function useAuthStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((t) => t + 1);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const persistUser = (newProfile: UserProfile) => {
    storedUser = newProfile;
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
    emitChange();
  };

  const login = async (email: string, password?: string, rememberMe = true) => {
    const isSpecialAdmin =
      email.toLowerCase().includes('admin') ||
      email.toLowerCase() === 'emhaainunnajib36@gmail.com';
    const role: 'user' | 'admin' = isSpecialAdmin ? 'admin' : 'user';

    storedUser = {
      ...storedUser,
      email,
      role,
      fullName: isSpecialAdmin ? 'Market Administrator' : storedUser.fullName,
    };
    isAuthenticated = true;
    localStorage.setItem(STORAGE_AUTH_KEY, 'true');
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(storedUser));
    emitChange();
    return { success: true, user: storedUser };
  };

  const register = async (email: string, username: string, fullName: string) => {
    storedUser = {
      ...storedUser,
      email,
      username,
      fullName: fullName || username || 'Market Enthusiast',
      role: 'user',
    };
    isAuthenticated = true;
    localStorage.setItem(STORAGE_AUTH_KEY, 'true');
    localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(storedUser));
    emitChange();
    return { success: true, user: storedUser };
  };

  const logout = async () => {
    isAuthenticated = false;
    localStorage.removeItem(STORAGE_AUTH_KEY);
    localStorage.removeItem('nusa_auth_session_active');
    emitChange();
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    persistUser({ ...storedUser, ...partial });
  };

  const verifyPin = (enteredPin: string): boolean => {
    return enteredPin === storedUser.pinCode;
  };

  const toggleTradingMode = () => {
    const nextMode = storedUser.tradingMode === 'REAL' ? 'DEMO' : 'REAL';
    persistUser({ ...storedUser, tradingMode: nextMode });
  };

  const adjustBalance = (usdDiff: number, idrDiff: number) => {
    persistUser({
      ...storedUser,
      cashBalanceUSD: Math.max(0, storedUser.cashBalanceUSD + usdDiff),
      cashBalanceIDR: Math.max(0, storedUser.cashBalanceIDR + idrDiff),
    });
  };

  return {
    user: storedUser,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    verifyPin,
    toggleTradingMode,
    adjustBalance,
  };
}
