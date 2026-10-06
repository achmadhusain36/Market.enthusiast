import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  User,
  ArrowLeft,
  Play,
  RotateCcw,
} from 'lucide-react';
import { TerminalLogo } from './TerminalLogo';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
  onBackToLanding?: () => void;
  initialMode?: 'LOGIN' | 'REGISTER';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToLanding,
  initialMode = 'LOGIN',
}) => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('emhaainunnajib36@gmail.com');
  const [password, setPassword] = useState('Luxville710');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pinCode, setPinCode] = useState('708951');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const TARGET_EMAIL = 'emhaainunnajib36@gmail.com';
  const TARGET_PASS = 'Luxville710';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('Harap masukkan email dan password Anda.');
      return;
    }

    // Allow user credentials or demo credentials
    if (
      cleanEmail !== TARGET_EMAIL.toLowerCase() &&
      !cleanEmail.includes('@')
    ) {
      setErrorMsg('Format email tidak valid.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Verifikasi berhasil! Mengarahkan ke Supercharts...');
      setTimeout(() => {
        onLoginSuccess(cleanEmail);
      }, 600);
    }, 500);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Alamat email valid wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Anda harus menyetujui Syarat & Ketentuan Layanan.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Registrasi akun berhasil! Mengarahkan ke Terminal...');
      setTimeout(() => {
        onLoginSuccess(email.trim().toLowerCase());
      }, 700);
    }, 600);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Masukkan alamat email Anda.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg(`Tautan reset password telah dikirim ke ${email}. Silakan periksa inbox email Anda.`);
      setTimeout(() => {
        setAuthMode('LOGIN');
      }, 3000);
    }, 600);
  };

  const handleInstantDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess('demo.trader@marketterminal.com');
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Background Ambient Glow & Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(41,98,255,0.18),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1017_1px,transparent_1px),linear-gradient(to_bottom,#0c1017_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-[#141a24] bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {onBackToLanding && (
            <button
              onClick={onBackToLanding}
              className="p-1.5 rounded-lg bg-[#0e1320] border border-[#1b253b] hover:bg-[#151f33] text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Beranda</span>
            </button>
          )}
          <TerminalLogo size="md" showText={true} subtitle="Multi-Asset Global Terminal" />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleInstantDemo}
            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Akses Demo Langsung ($100K)</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-[#0a0d14] border border-[#1a2130] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/30 relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2962ff] via-[#00c853] to-[#2962ff]" />

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-[#070a10] p-1 rounded-2xl border border-[#172031] mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('LOGIN');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'LOGIN'
                  ? 'bg-[#2962ff] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('REGISTER');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'REGISTER'
                  ? 'bg-[#2962ff] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Daftar Akun
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('FORGOT_PASSWORD');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'FORGOT_PASSWORD'
                  ? 'bg-[#1e273a] text-cyan-300'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              Bantuan
            </button>
          </div>

          {/* 1. LOGIN MODE */}
          {authMode === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white">Selamat Datang Kembali</h2>
                <p className="text-xs text-neutral-400">
                  Masuk ke akun trading terminal multi-aset Anda.
                </p>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Email Akun / Username</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-[#101520] border border-[#20293d] focus:border-[#2962ff] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-300">Password</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('FORGOT_PASSWORD')}
                    className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className="w-full bg-[#101520] border border-[#20293d] focus:border-[#2962ff] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-neutral-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-[#101520] border-[#20293d] text-[#2962ff] cursor-pointer"
                  />
                  <span>Ingat sesi saya</span>
                </label>
                <span className="text-[11px] text-neutral-500 font-mono">PIN: ••••••</span>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#2962ff] hover:bg-[#1a4de0] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 cursor-pointer transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'Memproses Otentikasi...' : 'Masuk ke Terminal'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2. REGISTER MODE */}
          {authMode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white">Daftar Akun Baru</h2>
                <p className="text-xs text-neutral-400">
                  Buka akun trading multi-aset resmi dalam hitungan detik.
                </p>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Nama Lengkap Sesuai KTP</label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Investor"
                    className="w-full bg-[#101520] border border-[#20293d] focus:border-[#2962ff] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-300">Alamat Email Aktif</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contoh@gmail.com"
                    className="w-full bg-[#101520] border border-[#20293d] focus:border-[#2962ff] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 digit"
                    className="w-full bg-[#101520] border border-[#20293d] focus:border-[#2962ff] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-300">Konfirmasi</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password"
                    className="w-full bg-[#101520] border border-[#20293d] focus:border-[#2962ff] rounded-xl px-3 py-2 text-xs text-white font-mono outline-none"
                  />
                </div>
              </div>

              {/* Referral Code */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-neutral-400">Kode Referral (Opsional)</label>
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder="Misal: HUSAIN-PRO7"
                  className="w-full bg-[#101520] border border-[#20293d] rounded-xl px-3 py-2 text-xs text-neutral-300 font-mono outline-none uppercase"
                />
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 text-xs text-neutral-400 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded bg-[#101520] border-[#20293d] text-[#2962ff] cursor-pointer"
                />
                <span>Saya menyetujui Ketentuan Layanan & Kebijakan Privasi RDN BCA.</span>
              </label>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'Mendaftarkan Akun...' : 'Buat Akun Sekarang'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 3. FORGOT PASSWORD MODE */}
          {authMode === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-white">Reset Password</h2>
                <p className="text-xs text-neutral-400">
                  Masukkan email terdaftar untuk menerima instruksi pemulihan.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Email Akun</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full bg-[#101520] border border-[#20293d] focus:border-[#2962ff] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white font-mono outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0e1422] border border-[#1c273e] text-xs text-neutral-300 space-y-1">
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>PIN Keamanan Default Akun:</span>
                </span>
                <p className="font-mono text-white text-sm font-black tracking-widest">••••••</p>
                <p className="text-[11px] text-neutral-400">
                  PIN ini digunakan untuk membuka proteksi profil dan otorisasi transaksi.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-[#2962ff] hover:bg-[#1a4de0] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <span>{isLoading ? 'Mengirim...' : 'Kirim Tautan Reset'}</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('LOGIN')}
                className="w-full text-center text-xs text-neutral-400 hover:text-white cursor-pointer pt-1"
              >
                Kembali ke Halaman Masuk
              </button>
            </form>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mt-6 pt-4 border-t border-[#161f30] text-center">
            <button
              onClick={handleInstantDemo}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Coba Demo Tanpa Login ($100,000 USD Saldo Virtual)</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-[11px] text-neutral-500 border-t border-[#141a24] bg-black/40">
        © 2026 Market Terminal Multi-Asset Platform • Dilindungi Autentikasi PIN & TLS 1.3
      </footer>
    </div>
  );
};
