import React, { useState, useRef, useEffect } from 'react';
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
  CreditCard,
  QrCode,
  Sparkles,
  ExternalLink,
  Check,
  Coins,
  Building,
  Lock,
  ArrowDownToLine,
  Camera,
  Upload,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { UserProfile, CurrencyType, Language } from '../types';
import { TRANSLATIONS } from '../utils/translations';
import { formatCurrency } from '../utils/formatters';
import { compressAvatarImage, PRESET_AVATARS } from '../utils/imageUtils';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onDepositSuccess?: (amountIDR: number, amountUSD: number, method: string) => void;
  initialTab?: 'payment' | 'profile' | 'language';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  onDepositSuccess,
  initialTab = 'profile',
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[userProfile.language || 'id'];

  const [activeTab, setActiveTab] = useState<'payment' | 'profile' | 'language'>(initialTab);
  const [paymentSubTab, setPaymentSubTab] = useState<'metamask' | 'debit' | 'manual'>('metamask');

  // Switch tab if initialTab changes or modal reopens
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // User form states
  const [name, setName] = useState(userProfile.name);
  const [title, setTitle] = useState(userProfile.title);
  const [email, setEmail] = useState(userProfile.email || 'emhaainunnajib36@gmail.com');
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl || '');
  const [avatarInputUrl, setAvatarInputUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoSuccess, setPhotoSuccess] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cashBalanceUSD, setCashBalanceUSD] = useState(userProfile.cashBalanceUSD);
  const [cashBalanceIDR, setCashBalanceIDR] = useState(userProfile.cashBalanceIDR);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyType>(userProfile.selectedCurrency);
  const [riskProfile, setRiskProfile] = useState(userProfile.riskProfile);
  const [language, setLanguage] = useState<Language>(userProfile.language || 'id');
  const [showSavedToast, setShowSavedToast] = useState(false);

  // Sync state when userProfile prop updates
  useEffect(() => {
    setName(userProfile.name);
    setTitle(userProfile.title);
    setEmail(userProfile.email || 'emhaainunnajib36@gmail.com');
    setAvatarUrl(userProfile.avatarUrl || '');
    setCashBalanceUSD(userProfile.cashBalanceUSD);
    setCashBalanceIDR(userProfile.cashBalanceIDR);
    setSelectedCurrency(userProfile.selectedCurrency);
    setRiskProfile(userProfile.riskProfile);
    setLanguage(userProfile.language || 'id');
  }, [userProfile]);

  // MetaMask Deposit States
  const [metaMaskNetwork, setMetaMaskNetwork] = useState('Ethereum');
  const [metaMaskToken, setMetaMaskToken] = useState<'USDT' | 'USDC' | 'ETH'>('USDT');
  const [metaMaskAmount, setMetaMaskAmount] = useState<number>(250);
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(true);
  const [walletAddress, setWalletAddress] = useState('0x71C...4e9F');
  const [isProcessingMetaMask, setIsProcessingMetaMask] = useState(false);
  const [metaMaskSuccessMsg, setMetaMaskSuccessMsg] = useState('');

  // Debit Card Deposit States
  const [debitBank, setDebitBank] = useState<'BCA' | 'Mandiri' | 'BRI' | 'BNI' | 'Visa' | 'Mastercard'>('BCA');
  const [debitCardNumber, setDebitCardNumber] = useState('4532 8910 2419 7089');
  const [debitExpiry, setDebitExpiry] = useState('08/29');
  const [debitCvv, setDebitCvv] = useState('710');
  const [debitAmountIDR, setDebitAmountIDR] = useState<number>(5000000);
  const [isProcessingDebit, setIsProcessingDebit] = useState(false);
  const [debitSuccessMsg, setDebitSuccessMsg] = useState('');

  const rate = userProfile.usdIdrRate || 16000;
  const isId = (language || userProfile.language) === 'id';

  const handleFileSelect = async (file: File) => {
    setPhotoError('');
    setPhotoSuccess('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError(
        isId
          ? 'File yang dipilih bukan berkas gambar yang valid (JPG, PNG, WEBP, GIF).'
          : 'The selected file is not a valid image file (JPG, PNG, WEBP, GIF).'
      );
      return;
    }

    try {
      setIsUploadingPhoto(true);
      // Automatically resize & compress so base64 stays < 40KB in localStorage
      const compressedDataUrl = await compressAvatarImage(file, 360, 0.88);
      setAvatarUrl(compressedDataUrl);
      setPhotoSuccess(
        isId
          ? 'Foto profil berhasil dimuat! Klik "Simpan Profil" untuk menerapkan.'
          : 'Profile photo loaded! Click "Save Profile" to apply.'
      );
      setTimeout(() => setPhotoSuccess(''), 4500);
    } catch (err: any) {
      setPhotoError(err.message || (isId ? 'Gagal memproses gambar.' : 'Failed to process image.'));
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name: name.trim() || 'Achmad Husain',
      title: title.trim() || (isId ? 'Investor Saham & Analis Pasar Global' : 'Stock Investor & Global Market Analyst'),
      email: email.trim() || 'emhaainunnajib36@gmail.com',
      avatarUrl: avatarUrl.trim() || undefined,
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

  // MetaMask Deposit Handler
  const handleDepositMetaMask = () => {
    if (metaMaskAmount <= 0) return;
    setIsProcessingMetaMask(true);
    setMetaMaskSuccessMsg('');

    setTimeout(() => {
      setIsProcessingMetaMask(false);
      const addedUSD = metaMaskAmount;
      const addedIDR = metaMaskAmount * rate;
      const nextUSD = cashBalanceUSD + addedUSD;
      const nextIDR = cashBalanceIDR + addedIDR;

      setCashBalanceUSD(nextUSD);
      setCashBalanceIDR(nextIDR);

      // Save directly to user profile
      const updated: UserProfile = {
        ...userProfile,
        cashBalanceUSD: nextUSD,
        cashBalanceIDR: nextIDR,
      };
      onUpdateProfile(updated);

      if (onDepositSuccess) {
        onDepositSuccess(addedIDR, addedUSD, `MetaMask Web3 (${metaMaskToken} on ${metaMaskNetwork})`);
      }

      setMetaMaskSuccessMsg(
        isId
          ? `Berhasil! Saldo +$${addedUSD.toLocaleString()} (Rp ${addedIDR.toLocaleString('id-ID')}) telah masuk via MetaMask.`
          : `Success! Balance +$${addedUSD.toLocaleString()} (Rp ${addedIDR.toLocaleString('en-US')}) credited via MetaMask.`
      );
      setTimeout(() => setMetaMaskSuccessMsg(''), 5000);
    }, 1500);
  };

  // Debit Card Deposit Handler
  const handleDepositDebit = () => {
    if (debitAmountIDR <= 0) return;
    setIsProcessingDebit(true);
    setDebitSuccessMsg('');

    setTimeout(() => {
      setIsProcessingDebit(false);
      const addedIDR = debitAmountIDR;
      const addedUSD = Number((debitAmountIDR / rate).toFixed(2));
      const nextIDR = cashBalanceIDR + addedIDR;
      const nextUSD = cashBalanceUSD + addedUSD;

      setCashBalanceIDR(nextIDR);
      setCashBalanceUSD(nextUSD);

      // Save directly to user profile
      const updated: UserProfile = {
        ...userProfile,
        cashBalanceIDR: nextIDR,
        cashBalanceUSD: nextUSD,
      };
      onUpdateProfile(updated);

      if (onDepositSuccess) {
        onDepositSuccess(addedIDR, addedUSD, `Debit Card Instant (${debitBank} **** ${debitCardNumber.slice(-4)})`);
      }

      setDebitSuccessMsg(
        isId
          ? `Berhasil! Setoran Rp ${addedIDR.toLocaleString('id-ID')} via Debit ${debitBank} telah terverifikasi.`
          : `Success! Deposit of Rp ${addedIDR.toLocaleString('en-US')} via Debit ${debitBank} verified and credited.`
      );
      setTimeout(() => setDebitSuccessMsg(''), 5000);
    }, 1400);
  };

  const handleQuickAddUSD = (amount: number) => {
    const nextUSD = cashBalanceUSD + amount;
    setCashBalanceUSD(nextUSD);
    setCashBalanceIDR(cashBalanceIDR + amount * rate);
  };

  const handleQuickAddIDR = (amount: number) => {
    const nextIDR = cashBalanceIDR + amount;
    setCashBalanceIDR(nextIDR);
    setCashBalanceUSD(Number((cashBalanceUSD + amount / rate).toFixed(2)));
  };

  const handleResetDefaults = () => {
    setName('Achmad Husain');
    setTitle('Stock Investor & Global Market Analyst');
    setEmail('emhaainunnajib36@gmail.com');
    setAvatarUrl('');
    setCashBalanceUSD(18750);
    setCashBalanceIDR(300000000);
    setSelectedCurrency('IDR');
    setRiskProfile('Aggressive');
    setLanguage('en');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="liquid-glass-accent bg-[#090e1b]/90 border border-white/15 rounded-3xl w-full max-w-2xl shadow-2xl shadow-blue-950/40 overflow-hidden flex flex-col max-h-[92vh] backdrop-blur-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                setActiveTab('profile');
                fileInputRef.current?.click();
              }}
              className="w-11 h-11 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#2962ff] to-[#00c853] flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/30 relative group cursor-pointer border border-white/10 shrink-0"
              title={isId ? 'Klik untuk ganti foto profil' : 'Click to change profile photo'}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span>{name.charAt(0) || 'A'}</span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isId ? 'Profil & Manajemen Keuangan' : 'Profile & Balance Management'}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-[11px] text-neutral-400">
                {isId ? 'Akun' : 'Account'}: <span className="text-neutral-300 font-mono">{email}</span> • RDN: {userProfile.accountNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-[#182030] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#1b2234] bg-[#090c14] px-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`py-3.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'payment'
                ? 'border-[#2962ff] text-[#2962ff] font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>{isId ? 'Isi Saldo & Pembayaran' : 'Deposit & Payment'}</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              Metamask / Debit
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`py-3.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-[#2962ff] text-[#2962ff] font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t.tabGeneralSettings}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('language')}
            className={`py-3.5 px-4 border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'language'
                ? 'border-[#2962ff] text-[#2962ff] font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Languages className="w-4 h-4" />
            <span>{t.tabLanguageSettings}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#0b0e17]">
          {/* TAB 1: ISI SALDO & PEMBAYARAN (METAMASK & DEBIT) */}
          {activeTab === 'payment' && (
            <div className="space-y-5">
              {/* Current Balances Header Strip */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#0e1322] border border-[#1b2438]">
                <div>
                  <span className="text-[11px] text-neutral-400 block mb-0.5">{isId ? 'Saldo RDN Aktif (IDR)' : 'Active Cash Balance (IDR)'}</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                    Rp {cashBalanceIDR.toLocaleString(isId ? 'id-ID' : 'en-US')}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block mb-0.5">{isId ? 'Saldo RDN Global (USD)' : 'Global Cash Balance (USD)'}</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-cyan-400">
                    ${cashBalanceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector Ribbon */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  {isId ? 'Pilih Metode Pembayaran / Isi Saldo:' : 'Select Payment / Deposit Method:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Option 1: MetaMask Web3 */}
                  <button
                    type="button"
                    onClick={() => setPaymentSubTab('metamask')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentSubTab === 'metamask'
                        ? 'bg-[#141b2c] border-[#f6851b] shadow-lg shadow-orange-950/20 ring-1 ring-[#f6851b]'
                        : 'bg-[#0e1320] border-[#1b2336] hover:border-[#2a3754]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-8 h-8 rounded-xl bg-[#e2761b]/10 border border-[#e2761b]/30 flex items-center justify-center text-lg">
                        🦊
                      </div>
                      {paymentSubTab === 'metamask' && (
                        <span className="w-2 h-2 rounded-full bg-[#f6851b]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>MetaMask</span>
                      </div>
                      <div className="text-[10px] text-neutral-400">Web3 Crypto / USDT</div>
                    </div>
                  </button>

                  {/* Option 2: Kartu Debit */}
                  <button
                    type="button"
                    onClick={() => setPaymentSubTab('debit')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentSubTab === 'debit'
                        ? 'bg-[#141b2c] border-[#2962ff] shadow-lg shadow-blue-950/30 ring-1 ring-[#2962ff]'
                        : 'bg-[#0e1320] border-[#1b2336] hover:border-[#2a3754]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-8 h-8 rounded-xl bg-[#2962ff]/10 border border-[#2962ff]/30 flex items-center justify-center text-[#2962ff]">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      {paymentSubTab === 'debit' && (
                        <span className="w-2 h-2 rounded-full bg-[#2962ff]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{isId ? 'Kartu Debit' : 'Debit Card'}</span>
                      </div>
                      <div className="text-[10px] text-neutral-400">BCA, Mandiri, BRI, Visa</div>
                    </div>
                  </button>

                  {/* Option 3: Manual Direct */}
                  <button
                    type="button"
                    onClick={() => setPaymentSubTab('manual')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      paymentSubTab === 'manual'
                        ? 'bg-[#141b2c] border-emerald-500 shadow-lg shadow-emerald-950/20 ring-1 ring-emerald-500'
                        : 'bg-[#0e1320] border-[#1b2336] hover:border-[#2a3754]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <Sliders className="w-4 h-4" />
                      </div>
                      {paymentSubTab === 'manual' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{isId ? 'Manual RDN' : 'Manual Cash'}</div>
                      <div className="text-[10px] text-neutral-400">{isId ? 'Ketik Saldo Bebas' : 'Direct Cash Input'}</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* --- SUB-VIEW 1: METAMASK --- */}
              {paymentSubTab === 'metamask' && (
                <div className="p-5 rounded-2xl bg-[#0e1322] border border-[#1b2438] space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-[#1b2336] pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">🦊</span>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{isId ? 'Setor Dana via MetaMask Web3' : 'Deposit Funds via MetaMask Web3'}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                            Instant Credit
                          </span>
                        </h4>
                        <p className="text-[11px] text-neutral-400">
                          {isId ? 'Konversi langsung saldo kripto (USDT/USDC/ETH) ke RDN Rupiah & Dolar' : 'Direct conversion of crypto balance (USDT/USDC/ETH) to Cash balance'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-emerald-400 text-[11px] font-semibold">
                        {walletAddress}
                      </span>
                    </div>
                  </div>

                  {/* Network & Token Selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-300">{isId ? 'Jaringan Blockchain' : 'Blockchain Network'}</label>
                      <select
                        value={metaMaskNetwork}
                        onChange={(e) => setMetaMaskNetwork(e.target.value)}
                        className="w-full bg-[#121828] border border-[#20293d] focus:border-[#f6851b] rounded-xl px-3 py-2 text-xs text-white outline-none font-semibold cursor-pointer"
                      >
                        <option value="Ethereum">Ethereum Mainnet (ERC-20)</option>
                        <option value="Polygon">Polygon (POS)</option>
                        <option value="Arbitrum">Arbitrum One (L2 Low Fee)</option>
                        <option value="BNB">BNB Smart Chain (BEP-20)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-300">{isId ? 'Aset Kripto' : 'Crypto Asset'}</label>
                      <div className="flex items-center gap-1.5">
                        {(['USDT', 'USDC', 'ETH'] as const).map((tk) => (
                          <button
                            key={tk}
                            type="button"
                            onClick={() => setMetaMaskToken(tk)}
                            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              metaMaskToken === tk
                                ? 'bg-[#f6851b]/15 text-[#f6851b] border-[#f6851b]/40'
                                : 'bg-[#121828] text-neutral-400 border-[#20293d] hover:text-white'
                            }`}
                          >
                            {tk}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-300">{isId ? `Jumlah Deposit (${metaMaskToken})` : `Deposit Amount (${metaMaskToken})`}</span>
                      <span className="font-mono text-neutral-400 text-[11px]">
                        {isId ? 'Estimasi Diterima: ' : 'Estimated Credit: '} <strong className="text-emerald-400">Rp {(metaMaskAmount * rate).toLocaleString(isId ? 'id-ID' : 'en-US')}</strong>
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={metaMaskAmount}
                        onChange={(e) => setMetaMaskAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-[#121828] border border-[#20293d] focus:border-[#f6851b] focus:ring-1 focus:ring-[#f6851b]/40 rounded-xl px-4 py-2.5 text-base font-bold font-mono text-white outline-none"
                      />
                      <span className="absolute right-4 top-2.5 text-xs font-bold text-neutral-400 font-mono">
                        {metaMaskToken}
                      </span>
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-neutral-400 mr-1">{isId ? 'Cepat:' : 'Quick:'}</span>
                      {[50, 100, 250, 500, 1000].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setMetaMaskAmount(val)}
                          className="px-2.5 py-1 rounded-lg bg-[#141b2b] hover:bg-[#1f2a42] text-xs font-mono text-[#f6851b] border border-[#232f48] cursor-pointer transition-colors"
                        >
                          +{val} {metaMaskToken}
                        </button>
                      ))}
                    </div>
                  </div>

                  {metaMaskSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{metaMaskSuccessMsg}</span>
                    </div>
                  )}

                  {/* Confirm MetaMask Deposit Button */}
                  <button
                    type="button"
                    onClick={handleDepositMetaMask}
                    disabled={isProcessingMetaMask || metaMaskAmount <= 0}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#e2761b] to-[#f6851b] hover:from-[#d16710] hover:to-[#e2761b] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-900/30 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {isProcessingMetaMask ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isId ? 'Menghubungkan ke MetaMask & Mengonfirmasi...' : 'Connecting to MetaMask & Confirming...'}</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-4 h-4" />
                        <span>{isId ? `Konfirmasi Setor via MetaMask (${metaMaskAmount} ${metaMaskToken})` : `Confirm Deposit via MetaMask (${metaMaskAmount} ${metaMaskToken})`}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* --- SUB-VIEW 2: KARTU DEBIT --- */}
              {paymentSubTab === 'debit' && (
                <div className="p-5 rounded-2xl bg-[#0e1322] border border-[#1b2438] space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-[#1b2336] pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{isId ? 'Setor Instan via Kartu Debit' : 'Instant Deposit via Debit Card'}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                            3D Secure OTP
                          </span>
                        </h4>
                        <p className="text-[11px] text-neutral-400">
                          {isId ? 'Transfer langsung dari kartu debit Bank BCA, Mandiri, BRI, BNI, Visa & Mastercard' : 'Direct deposit from Bank BCA, Mandiri, BRI, BNI, Visa & Mastercard'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Realistic Metallic Debit Card Visual */}
                  <div className="relative w-full max-w-sm mx-auto h-44 rounded-2xl p-4 bg-gradient-to-br from-[#131b2e] via-[#0b101c] to-[#1a233a] border border-[#25324e] shadow-xl text-white flex flex-col justify-between overflow-hidden group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-8 h-6 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-center text-[9px] font-black text-black">
                          CHIP
                        </span>
                        <span className="text-[10px] text-neutral-400 tracking-wider">DEBIT RDN</span>
                      </div>
                      <span className="text-xs font-black tracking-wider text-cyan-400 uppercase">
                        {debitBank}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="font-mono text-base tracking-[0.2em] font-bold text-white drop-shadow">
                        {debitCardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span>CARDHOLDER: <strong className="text-white uppercase">{userProfile.name}</strong></span>
                        <span>VALID: <strong className="text-white font-mono">{debitExpiry}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-neutral-400 border-t border-white/10 pt-1">
                      <span>{isId ? 'TERVERIFIKASI SISTEM PEMBAYARAN BURSA' : 'VERIFIED EXCHANGE PAYMENT GATEWAY'}</span>
                      <span className="font-bold text-emerald-400">INSTANT CREDIT</span>
                    </div>
                  </div>

                  {/* Bank Selector */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-neutral-300">{isId ? 'Penerbit Kartu Bank' : 'Card Issuer / Bank'}</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {(['BCA', 'Mandiri', 'BRI', 'BNI', 'Visa', 'Mastercard'] as const).map((bk) => (
                        <button
                          key={bk}
                          type="button"
                          onClick={() => setDebitBank(bk)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            debitBank === bk
                              ? 'bg-[#2962ff]/20 text-[#2962ff] border-[#2962ff]'
                              : 'bg-[#121828] text-neutral-400 border-[#20293d] hover:text-white'
                          }`}
                        >
                          {bk}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card Number & Expiry Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-medium text-neutral-300">{isId ? 'Nomor Kartu Debit' : 'Debit Card Number'}</label>
                      <input
                        type="text"
                        value={debitCardNumber}
                        onChange={(e) => setDebitCardNumber(e.target.value)}
                        placeholder="4000 1234 5678 9010"
                        className="w-full bg-[#121828] border border-[#20293d] focus:border-[#2962ff] rounded-xl px-3 py-2 text-xs font-mono font-bold text-white outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-neutral-300">{isId ? 'Masa Berlaku / CVV' : 'Expiry / CVV'}</label>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          value={debitExpiry}
                          onChange={(e) => setDebitExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-1/2 bg-[#121828] border border-[#20293d] focus:border-[#2962ff] rounded-xl px-2 py-2 text-xs font-mono text-center text-white outline-none"
                        />
                        <input
                          type="password"
                          maxLength={3}
                          value={debitCvv}
                          onChange={(e) => setDebitCvv(e.target.value)}
                          placeholder="CVV"
                          className="w-1/2 bg-[#121828] border border-[#20293d] focus:border-[#2962ff] rounded-xl px-2 py-2 text-xs font-mono text-center text-white outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Amount in IDR */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-300">{isId ? 'Nominal Setoran (IDR)' : 'Deposit Amount (IDR)'}</span>
                      <span className="font-mono text-neutral-400 text-[11px]">
                        {isId ? 'Konversi USD: ' : 'USD Equivalent: '}<strong className="text-cyan-400">${(debitAmountIDR / rate).toFixed(2)}</strong>
                      </span>
                    </div>

                    <div className="relative">
                      <span className="absolute left-3.5 top-2 text-xs font-bold text-neutral-400">Rp</span>
                      <input
                        type="number"
                        min="10000"
                        step="10000"
                        value={debitAmountIDR}
                        onChange={(e) => setDebitAmountIDR(Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full bg-[#121828] border border-[#20293d] focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff]/40 rounded-xl pl-10 pr-4 py-2.5 text-base font-bold font-mono text-white outline-none"
                      />
                    </div>

                    {/* Quick Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-neutral-400 mr-1">{isId ? 'Cepat:' : 'Quick:'}</span>
                      {[
                        { label: '500k', val: 500000 },
                        { label: '2M', val: 2000000 },
                        { label: '5M', val: 5000000 },
                        { label: '10M', val: 10000000 },
                        { label: '50M', val: 50000000 },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setDebitAmountIDR(item.val)}
                          className="px-2.5 py-1 rounded-lg bg-[#141b2b] hover:bg-[#1f2a42] text-xs font-mono text-cyan-400 border border-[#232f48] cursor-pointer transition-colors"
                        >
                          +{item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {debitSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in font-medium">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{debitSuccessMsg}</span>
                    </div>
                  )}

                  {/* Confirm Debit Deposit Button */}
                  <button
                    type="button"
                    onClick={handleDepositDebit}
                    disabled={isProcessingDebit || debitAmountIDR <= 0}
                    className="w-full py-3 rounded-xl bg-[#2962ff] hover:bg-[#1e52e0] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
                  >
                    {isProcessingDebit ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isId ? 'Memproses Verifikasi Debit Bank...' : 'Processing Bank Debit Verification...'}</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="w-4 h-4" />
                        <span>{isId ? `Bayar & Setor Rp ${debitAmountIDR.toLocaleString('id-ID')} via Debit ${debitBank}` : `Pay & Deposit Rp ${debitAmountIDR.toLocaleString('en-US')} via Debit ${debitBank}`}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* --- SUB-VIEW 3: MANUAL ADJUSTMENT --- */}
              {paymentSubTab === 'manual' && (
                <div className="p-5 rounded-2xl bg-[#0e1322] border border-[#1b2438] space-y-4 animate-in fade-in">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>{isId ? 'Penyesuaian Saldo Kas RDN Manual' : 'Manual Cash Balance Adjustment'}</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      {isId ? 'Ketik langsung saldo kas IDR atau USD yang diinginkan untuk terminal ini' : 'Directly enter desired IDR or USD cash balance for this terminal'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* IDR Direct Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-200">
                        {isId ? 'Saldo Kas RDN (IDR)' : 'Cash Balance (IDR)'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-neutral-400 font-mono text-xs">Rp</span>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={cashBalanceIDR}
                          onChange={(e) => setCashBalanceIDR(parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#121828] border border-[#20293d] focus:border-[#2962ff] rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono text-white font-bold outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {[10000000, 50000000, 100000000].map((amt) => (
                          <button
                            type="button"
                            key={amt}
                            onClick={() => handleQuickAddIDR(amt)}
                            className="px-2 py-0.5 rounded-lg bg-[#141b2b] text-[11px] font-mono text-emerald-400 border border-[#232f48]"
                          >
                            +{amt / 1000000}M
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* USD Direct Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-200">
                        {isId ? 'Saldo Kas RDN (USD)' : 'Cash Balance (USD)'}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-neutral-400 font-mono text-xs font-bold">$</span>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          value={cashBalanceUSD}
                          onChange={(e) => setCashBalanceUSD(parseFloat(e.target.value) || 0)}
                          className="w-full bg-[#121828] border border-[#20293d] focus:border-[#2962ff] rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-mono text-white font-bold outline-none"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {[1000, 5000, 10000].map((amt) => (
                          <button
                            type="button"
                            key={amt}
                            onClick={() => handleQuickAddUSD(amt)}
                            className="px-2 py-0.5 rounded-lg bg-[#141b2b] text-[11px] font-mono text-cyan-400 border border-[#232f48]"
                          >
                            +${amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: GENERAL / INVESTOR PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-[#1b2230] pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {t.ownerName}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {t.accountNumberLabel}: {userProfile.accountNumber}
                </span>
              </div>

              {/* DEDICATED PROFILE PHOTO UPLOAD & PRESET CARD */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1422] border border-[#1e273c] space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-[#1b2336] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{isId ? 'Upload & Kelola Foto Profil' : 'Upload & Manage Profile Photo'}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {avatarUrl ? (isId ? 'Foto Kustom' : 'Custom Photo') : (isId ? 'Inisial' : 'Initials')}
                        </span>
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        {isId
                          ? 'Dukungan format PNG, JPG, JPEG, WEBP. Otomatis dikompresi & responsif.'
                          : 'Supports PNG, JPG, JPEG, WEBP. Auto-compressed & ultra-crisp.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                  {/* Avatar Circular Preview */}
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#2962ff] shadow-xl shadow-blue-900/30 bg-gradient-to-tr from-[#c2410c] via-[#db2777] to-[#9333ea] flex items-center justify-center text-white text-2xl font-bold">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{name.charAt(0) || 'A'}</span>
                      )}
                    </div>
                    {/* Hover Camera Overlay Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-semibold cursor-pointer"
                      title={isId ? 'Klik untuk memilih foto baru' : 'Click to select new photo'}
                    >
                      <Camera className="w-5 h-5 mb-0.5 text-white" />
                      <span>{isId ? 'Ganti' : 'Change'}</span>
                    </button>
                    {/* Active Check Badge */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0e1422] flex items-center justify-center text-white shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  {/* Upload Controls & Drag and Drop Box */}
                  <div className="flex-1 w-full space-y-2.5">
                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleFileSelect(e.target.files[0]);
                        }
                      }}
                    />

                    {/* Drag and Drop Zone / Click to Upload */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragOver(true);
                      }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1.5 ${
                        isDragOver
                          ? 'border-[#2962ff] bg-[#2962ff]/10 text-white'
                          : 'border-[#243048] hover:border-[#38496d] bg-[#121828]/70 hover:bg-[#141b2c]'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Upload className="w-4 h-4 text-[#2962ff]" />
                        <span>{isId ? 'Klik di sini untuk upload foto dari laptop / HP' : 'Click here to upload photo from PC / phone'}</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        {isId ? 'atau seret & lepaskan file gambar langsung ke kotak ini' : 'or drag & drop your image file into this zone'}
                      </p>
                    </div>

                    {/* Action buttons: Browse, Use URL, Remove */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingPhoto}
                          className="px-3 py-1.5 rounded-lg bg-[#2962ff] hover:bg-[#1e52e0] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-900/20"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingPhoto ? (isId ? 'Memproses...' : 'Processing...') : (isId ? 'Pilih Berkas Foto' : 'Choose Photo File')}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowUrlInput(!showUrlInput)}
                          className="px-3 py-1.5 rounded-lg bg-[#151c2e] hover:bg-[#1d2740] border border-[#232e46] text-neutral-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{isId ? 'Input URL Web' : 'Use Image URL'}</span>
                        </button>
                      </div>

                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setAvatarUrl('');
                            setPhotoSuccess(isId ? 'Foto profil dihapus (kembali ke inisial).' : 'Profile photo removed (reverted to initials).');
                            setTimeout(() => setPhotoSuccess(''), 3000);
                          }}
                          className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{isId ? 'Hapus Foto (Gunakan Inisial)' : 'Remove (Use Initials)'}</span>
                        </button>
                      )}
                    </div>

                    {/* URL Input Form */}
                    {showUrlInput && (
                      <div className="flex gap-2 pt-2 animate-in fade-in">
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/.../foto.jpg"
                          value={avatarInputUrl}
                          onChange={(e) => setAvatarInputUrl(e.target.value)}
                          className="flex-1 bg-[#101522] border border-[#20293d] focus:border-[#2962ff] rounded-xl px-3 py-1.5 text-xs text-white outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (avatarInputUrl.trim()) {
                              setAvatarUrl(avatarInputUrl.trim());
                              setAvatarInputUrl('');
                              setShowUrlInput(false);
                              setPhotoSuccess(isId ? 'URL foto berhasil diterapkan.' : 'Photo URL applied.');
                              setTimeout(() => setPhotoSuccess(''), 3000);
                            }
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                        >
                          {isId ? 'Terapkan' : 'Apply'}
                        </button>
                      </div>
                    )}

                    {/* Status Messages */}
                    {photoError && (
                      <p className="text-xs text-rose-400 font-medium">{photoError}</p>
                    )}
                    {photoSuccess && (
                      <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 animate-in fade-in">
                        <Check className="w-3.5 h-3.5" />
                        <span>{photoSuccess}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Preset Professional Trader Avatars */}
                <div className="pt-3 border-t border-[#1b2336] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-300">
                      {isId ? 'Atau Pilih Avatar Trader Profesional Pilihan:' : 'Or Select a Preset Professional Trader Avatar:'}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      {PRESET_AVATARS.length} {isId ? 'Pilihan' : 'Options'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_AVATARS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setAvatarUrl(preset.url);
                          setPhotoSuccess(isId ? `Avatar "${preset.name}" dipilih.` : `Avatar "${preset.name}" selected.`);
                          setTimeout(() => setPhotoSuccess(''), 3000);
                        }}
                        className={`group p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          avatarUrl === preset.url
                            ? 'bg-[#2962ff]/20 border-[#2962ff] shadow-md shadow-blue-900/30'
                            : 'bg-[#121828] border-[#20293d] hover:border-[#38496d]'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 group-hover:scale-105 transition-transform">
                          <img
                            src={preset.url}
                            alt={preset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] text-center font-medium text-neutral-300 truncate w-full group-hover:text-white">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Name & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">{isId ? 'Nama Investor' : 'Investor Name'}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#101522] border border-[#20293d] focus:border-[#2962ff] rounded-xl px-3.5 py-2.5 text-sm text-white font-semibold outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">{isId ? 'Email Akun Login' : 'Login Account Email'}</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="emhaainunnajib36@gmail.com"
                      className="w-full bg-[#101522] border border-[#20293d] focus:border-[#2962ff] rounded-xl px-3.5 py-2.5 text-sm font-mono text-white outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      {isId ? 'Aktif' : 'Active'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title & Risk Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">{isId ? 'Deskripsi / Gelar Investor' : 'Investor Title / Bio'}</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#101522] border border-[#20293d] focus:border-[#2962ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">{isId ? 'Profil Risiko' : 'Risk Profile'}</label>
                  <select
                    value={riskProfile}
                    onChange={(e) => setRiskProfile(e.target.value as any)}
                    className="w-full bg-[#101522] border border-[#20293d] focus:border-[#2962ff] rounded-xl px-3.5 py-2.5 text-sm text-white outline-none cursor-pointer"
                  >
                    <option value="Agresif">{isId ? 'Agresif (Pertumbuhan Modal Tinggi)' : 'Aggressive (High Capital Growth)'}</option>
                    <option value="Moderat">{isId ? 'Moderat (Keseimbangan Imbal Hasil)' : 'Moderate (Balanced Returns)'}</option>
                    <option value="Konservatif">{isId ? 'Konservatif (Dividen & Stabilitas)' : 'Conservative (Dividend & Stability)'}</option>
                  </select>
                </div>
              </div>

              {/* Password notice */}
              <div className="p-3.5 rounded-2xl bg-[#101624] border border-[#1b253a] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-neutral-300">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{isId ? 'Sandi Keamanan Akun:' : 'Account Password:'} <strong>Luxville710</strong> • PIN: <strong>••••••</strong></span>
                </div>
                <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded">
                  {isId ? 'Terproteksi' : 'Protected'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: LANGUAGE & CURRENCY */}
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
                    <div className="text-[11px] text-neutral-400">{isId ? 'Default pasar modal Indonesia (IDX)' : 'Indonesia stock market default (IDX)'}</div>
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
                  <div className="text-[11px] text-neutral-400">{isId ? 'Mata uang valuasi utama (USD atau IDR)' : 'Main valuation currency (USD or IDR)'}</div>
                </div>
                <div className="flex items-center bg-[#111520] p-1 rounded-xl border border-[#212738]">
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('IDR')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCurrency === 'IDR'
                        ? 'bg-[#2962ff] text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    IDR (Rp)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCurrency('USD')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedCurrency === 'USD'
                        ? 'bg-[#2962ff] text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#1b2234] bg-[#0c101c] flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>{t.resetDefaults}</span>
          </button>

          <div className="flex items-center gap-2">
            {showSavedToast && (
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.savedChanges}</span>
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-300 hover:text-white hover:bg-[#182030] text-xs font-semibold transition-colors cursor-pointer"
            >
              {isId ? 'Tutup' : 'Close'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#2962ff] hover:bg-[#1e52e0] text-white text-xs font-bold shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
            >
              {isId ? 'Simpan Profil' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
