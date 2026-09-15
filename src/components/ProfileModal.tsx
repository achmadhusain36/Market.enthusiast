import React, { useState } from 'react';
import {
  X,
  User,
  DollarSign,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  RefreshCcw,
  Languages,
  ArrowRight,
  Sliders,
  Globe,
} from 'lucide-react';
import { UserProfile, CurrencyType, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { formatCurrency } from '../utils/formatters';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[userProfile.language || 'id'];

  const [activeTab, setActiveTab] = useState<'language' | 'balance' | 'profile'>('language');
  const [name, setName] = useState(userProfile.name);
  const [title, setTitle] = useState(userProfile.title);
  const [cashBalanceUSD, setCashBalanceUSD] = useState(userProfile.cashBalanceUSD);
  const [cashBalanceIDR, setCashBalanceIDR] = useState(userProfile.cashBalanceIDR);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>(userProfile.selectedCurrency);
  const [riskProfile, setRiskProfile] = useState(userProfile.riskProfile);
  const [language, setLanguage] = useState<Language>(userProfile.language || 'id');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name: name.trim() || 'Achmad Husain',
      title: title.trim() || 'Investor Saham & Analis Pasar Global',
      cashBalanceUSD: Math.max(0, Number(cashBalanceUSD) || 0),
      cashBalanceIDR: Math.max(0, Number(cashBalanceIDR) || 0),
      selectedCurrency,
      riskProfile,
      language,
    };
    onUpdateProfile(updated);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 1200);
  };

  const handleQuickAddUSD = (amount: number) => {
    const nextUSD = cashBalanceUSD + amount;
    setCashBalanceUSD(nextUSD);
    setCashBalanceIDR(cashBalanceIDR + amount * 16000);
  };

  const handleQuickAddIDR = (amount: number) => {
    const nextIDR = cashBalanceIDR + amount;
    setCashBalanceIDR(nextIDR);
    setCashBalanceUSD(Number((cashBalanceUSD + amount / 16000).toFixed(2)));
  };

  const handleResetDefaults = () => {
    setName('Achmad Husain');
    setTitle('Investor Saham & Analis Pasar Global');
    setCashBalanceUSD(52400);
    setCashBalanceIDR(838400000);
    setSelectedCurrency('USD');
    setRiskProfile('Agresif');
    setLanguage('id');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0e121a] border border-[#212738] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1e2434] flex items-center justify-between bg-[#121722]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2962ff] to-[#22ab94] flex items-center justify-center text-white font-bold shadow-md">
              AH
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{t.settingsTitle}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-xs text-neutral-400">
                {t.settingsSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a2130] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-[#1e2434] bg-[#0c0f17] px-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'language'
                ? 'border-[#2962ff] text-[#2962ff] font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{t.tabLanguage}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('balance')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'balance'
                ? 'border-[#2962ff] text-[#2962ff] font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>{t.tabCashBalance}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-[#2962ff] text-[#2962ff] font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.tabGeneralSettings}</span>
          </button>
        </div>

        {/* Modal Content / Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: LANGUAGE SETTINGS (User requirement: sediakan bahasa indonesia dan bahasa inggris di pengaturan) */}
          {activeTab === 'language' && (
            <div className="space-y-4">
              <div className="border-b border-[#1b2230] pb-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Languages className="w-4 h-4 text-[#2962ff]" />
                  <span>{t.languageSelectLabel}</span>
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  {t.langDesc}
                </p>
              </div>

              {/* Language Choice Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Bahasa Indonesia */}
                <div
                  onClick={() => setLanguage('id')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    language === 'id'
                      ? 'bg-[#182338] border-[#2962ff] shadow-lg shadow-blue-950/40'
                      : 'bg-[#111520] border-[#212738] hover:border-[#313b52]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🇮🇩</span>
                    {language === 'id' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2962ff]"></span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Bahasa Indonesia</div>
                    <div className="text-[11px] text-neutral-400">Default pasar modal Indonesia (IDX)</div>
                  </div>
                </div>

                {/* English */}
                <div
                  onClick={() => setLanguage('en')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    language === 'en'
                      ? 'bg-[#182338] border-[#2962ff] shadow-lg shadow-blue-950/40'
                      : 'bg-[#111520] border-[#212738] hover:border-[#313b52]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🇺🇸</span>
                    {language === 'en' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2962ff]"></span>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">English (US)</div>
                    <div className="text-[11px] text-neutral-400">Global financial terminal standard</div>
                  </div>
                </div>
              </div>

              {/* Display Currency */}
              <div className="pt-4 border-t border-[#1b2230] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">{t.mainCurrencyLabel}</div>
                  <div className="text-[11px] text-neutral-400">USD ($) atau Rupiah (Rp)</div>
                </div>
                <div className="flex items-center bg-[#111520] p-1 rounded-lg border border-[#212738]">
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('USD')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      selectedCurrency === 'USD'
                        ? 'bg-[#2962ff] text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('IDR')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                      selectedCurrency === 'IDR'
                        ? 'bg-[#2962ff] text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    IDR (Rp)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CASH BALANCE ADJUSTMENT */}
          {activeTab === 'balance' && (
            <div className="space-y-4">
              <div className="border-b border-[#1b2230] pb-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span>{t.cashSectionTitle}</span>
                  </h4>
                  <span className="text-[10px] text-neutral-400 bg-[#161b26] px-2 py-0.5 rounded border border-[#242c3d]">
                    RDN Aktif
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  {t.cashSectionDesc}
                </p>
              </div>

              {/* USD Balance Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    {t.cashUSDLabel}
                  </label>
                  <span className="text-xs text-neutral-400 font-mono-num">
                    Aktif: {formatCurrency(cashBalanceUSD, 'USD')}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-neutral-400 font-mono-num font-bold">$</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={cashBalanceUSD}
                    onChange={(e) => setCashBalanceUSD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#111520] border border-[#242b3b] focus:border-[#2962ff] rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-mono-num text-white font-bold focus:outline-none transition-colors"
                  />
                </div>

                {/* Quick Add USD */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-neutral-400 mr-1">{t.quickAdd}:</span>
                  {[1000, 5000, 10000, 50000].map((amt) => (
                    <button
                      type="button"
                      key={`usd-${amt}`}
                      onClick={() => handleQuickAddUSD(amt)}
                      className="px-2.5 py-1 rounded-lg bg-[#151b26] hover:bg-[#1d2636] text-emerald-400 text-xs font-mono-num border border-[#232c3d] transition-colors cursor-pointer"
                    >
                      +${amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* IDR Balance Input */}
              <div className="space-y-1.5 pt-2 border-t border-[#1b2230]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-200">
                    {t.cashIDRLabel}
                  </label>
                  <span className="text-xs text-neutral-400 font-mono-num">
                    Aktif: {formatCurrency(cashBalanceIDR, 'IDR')}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-neutral-400 font-mono-num text-xs">Rp</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={cashBalanceIDR}
                    onChange={(e) => setCashBalanceIDR(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#111520] border border-[#242b3b] focus:border-[#2962ff] rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono-num text-white font-bold focus:outline-none transition-colors"
                  />
                </div>

                {/* Quick Add IDR */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-neutral-400 mr-1">{t.quickAdd}:</span>
                  {[10000000, 50000000, 100000000].map((amt) => (
                    <button
                      type="button"
                      key={`idr-${amt}`}
                      onClick={() => handleQuickAddIDR(amt)}
                      className="px-2.5 py-1 rounded-lg bg-[#151b26] hover:bg-[#1d2636] text-emerald-400 text-xs font-mono-num border border-[#232c3d] transition-colors cursor-pointer"
                    >
                      +{amt >= 1000000000 ? `${amt / 1000000000}M` : `${amt / 1000000} Jt`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GENERAL / INVESTOR PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1b2230] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {t.ownerName}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono-num">
                  {t.accountNumberLabel}: {userProfile.accountNumber}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">
                    {t.ownerName}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Achmad Husain"
                    required
                    className="w-full bg-[#111520] border border-[#242b3b] focus:border-[#2962ff] rounded-xl px-3.5 py-2.5 text-sm text-white font-medium focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">
                    {t.ownerTitle}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Investor Saham & Analis Pasar Global"
                    className="w-full bg-[#111520] border border-[#242b3b] focus:border-[#2962ff] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-300 font-medium mb-1">
                    {t.tabRiskProfile}
                  </label>
                  <select
                    value={riskProfile}
                    onChange={(e) => setRiskProfile(e.target.value as any)}
                    className="w-full bg-[#111520] border border-[#242b3b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#2962ff] cursor-pointer"
                  >
                    <option value="Agresif">{t.riskAggressive}</option>
                    <option value="Moderat">{t.riskModerate}</option>
                    <option value="Konservatif">{t.riskConservative}</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs text-neutral-400 hover:text-white bg-[#141824] hover:bg-[#1a2030] rounded-xl border border-[#212838] transition-colors cursor-pointer"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>{t.resetDefaults}</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 flex items-center justify-between border-t border-[#1b2230]">
            {showSavedToast ? (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.savedSuccess}</span>
              </div>
            ) : (
              <span className="text-[11px] text-neutral-400">
                Data tersimpan di penyimpanan lokal
              </span>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                id="btn-save-settings"
                className="px-5 py-2.5 rounded-xl bg-[#2962ff] hover:bg-[#1f54e6] active:scale-95 text-white text-xs font-bold shadow-lg shadow-blue-900/40 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.saveChanges}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
