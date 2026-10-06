import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Play, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TerminalLogo } from '../../components/TerminalLogo';
import { showToast } from '../../components/ui/Toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('emhaainunnajib36@gmail.com');
  const [password, setPassword] = useState('Luxville710');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Harap masukkan email dan kata sandi Anda.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password, rememberMe);
      showToast({
        type: 'success',
        title: 'Login Berhasil',
        message: `Selamat datang kembali di Nusa Trade Terminal, ${email}!`,
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Gagal masuk akun. Periksa email atau password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantDemo = async () => {
    await login('demo.trader@marketterminal.com');
    showToast({
      type: 'info',
      title: 'Mode Demo Diaktifkan',
      message: 'Saldo virtual $10,000 USD siap digunakan untuk latihan trade.',
    });
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-10 select-none">
      <div className="w-full max-w-md bg-[#111111] border border-[#242424] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <TerminalLogo size="md" showText={false} />
          </div>
          <h2 className="text-2xl font-black font-mono text-white">Masuk ke Terminal</h2>
          <p className="text-xs text-neutral-400">
            Akses portofolio dan pasar multi-aset global Anda.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Pengguna"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300">Kata Sandi</label>
              <Link to="/forgot-password" className="text-xs text-emerald-400 hover:underline">
                Lupa sandi?
              </Link>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-neutral-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-[#1a1a1a] border-[#333333] text-emerald-500 cursor-pointer"
              />
              <span>Ingat sesi saya (30 Hari)</span>
            </label>
            <span className="text-[11px] text-neutral-500 font-mono">PIN: ••••••</span>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
            Masuk ke Terminal
          </Button>
        </form>

        {/* Instant Demo Login Button */}
        <div className="pt-4 border-t border-[#222222] text-center space-y-3">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full"
            onClick={handleInstantDemo}
            leftIcon={<Play className="w-3.5 h-3.5 text-emerald-400 fill-current" />}
          >
            Coba Demo Langsung ($10,000 USD)
          </Button>

          <p className="text-xs text-neutral-400">
            Belum memiliki akun?{' '}
            <Link to="/register" className="text-emerald-400 font-bold hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
