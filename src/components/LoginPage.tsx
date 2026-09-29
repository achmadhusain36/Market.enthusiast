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
  Globe2,
  LineChart,
} from 'lucide-react';
import { TerminalLogo } from './TerminalLogo';

interface LoginPageProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('emhaainunnajib36@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const TARGET_EMAIL = 'emhaainunnajib36@gmail.com';
  const TARGET_PASS = 'Luxville710';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    if (cleanEmail !== TARGET_EMAIL.toLowerCase() || cleanPass !== TARGET_PASS) {
      setErrorMsg('Invalid credentials! Please verify your email and password.');
      return;
    }

    // Success flow with smooth feedback
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(TARGET_EMAIL);
      }, 700);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#000000] text-white flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Background Ambient Glow & Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(41,98,255,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1017_1px,transparent_1px),linear-gradient(to_bottom,#0c1017_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Top Ticker / Header Ribbon */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-[#141a24] bg-black/60 backdrop-blur-md">
        <TerminalLogo size="md" showText={true} subtitle="Verified Multi-Asset Platform" />

        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d121c] border border-[#1b2336] text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-neutral-300 font-mono">Server Status: Normal</span>
          </span>
        </div>
      </header>

      {/* Center Login Card Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-[#0a0d14] border border-[#1a2130] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/30 relative overflow-hidden">
          {/* Subtle Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2962ff] via-[#00c853] to-[#2962ff]" />

          {/* Branding Badge & Title with Terminal Logo */}
          <div className="text-center space-y-3 mb-6 flex flex-col items-center">
            <TerminalLogo size="xl" showText={false} />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Global Market Acces
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                <span>Account Email / Username</span>
                <span className="text-[10px] text-cyan-400 font-mono">Official</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="emhaainunnajib36@gmail.com"
                  className="w-full bg-[#101520] border border-[#20293d] focus:border-[#2962ff] focus:ring-2 focus:ring-[#2962ff]/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                <span>Password</span>
                <span className="text-[10px] text-neutral-500 font-mono">Encrypted Security</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#101520] border border-[#20293d] focus:border-[#2962ff] focus:ring-2 focus:ring-[#2962ff]/20 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title={showPassword ? 'Hide' : 'Show'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Options: Remember me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#20293d] text-[#2962ff] focus:ring-[#2962ff] bg-[#101520] cursor-pointer"
                />
                <span>Remember My Session</span>
              </label>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                isSuccess
                  ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                  : 'bg-[#2962ff] hover:bg-[#1f52dd] active:scale-[0.99] text-white shadow-blue-900/40 hover:shadow-blue-700/50'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Account...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Login Successful! Opening Terminal...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Trading Terminal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Information Footer */}
          <div className="mt-6 pt-5 border-t border-[#182030] space-y-2">
            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit Authorization • Buy/Sell Protected by 6-Digit PIN</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 w-full px-6 py-3 border-t border-[#141a24] bg-black/60 text-center text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Globe2 className="w-3.5 h-3.5 text-neutral-400" />
          <span>Indonesia Stock Exchange (IDX) & Wall Street Global Markets</span>
        </div>
        <div>
          <span>© 2026 Pro Terminal • Protected by Security Passcode & PIN</span>
        </div>
      </footer>
    </div>
  );
};
