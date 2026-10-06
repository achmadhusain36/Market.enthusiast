import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TerminalLogo } from '../../components/TerminalLogo';
import { showToast } from '../../components/ui/Toast';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !username || !password) {
      setError('Harap isi semua kolom wajib.');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (!agreeTerms) {
      setError('Anda harus menyetujui Syarat & Ketentuan Layanan.');
      return;
    }

    setIsLoading(true);
    try {
      await register(email.trim(), username.trim(), fullName.trim());
      showToast({
        type: 'success',
        title: 'Akun Berhasil Dibuat',
        message: 'Silakan verifikasi email Anda atau langsung mulai trading.',
      });
      navigate('/verify', { state: { email } });
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftar akun.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-10 select-none">
      <div className="w-full max-w-md bg-[#111111] border border-[#242424] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="text-center space-y-1.5">
          <div className="flex justify-center mb-3">
            <TerminalLogo size="md" showText={false} />
          </div>
          <h2 className="text-2xl font-black font-mono text-white">Daftar Akun Baru</h2>
          <p className="text-xs text-neutral-400">
            Akses pasar multi-aset dan simulasi paper trading $10.000.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            label="Nama Lengkap"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nama sesuai KTP"
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Alamat Email Aktif"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contoh@gmail.com"
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Username / ID Trader"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="market_trader"
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kata Sandi"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 digit"
              leftIcon={<Lock className="w-4 h-4" />}
              required
            />
            <Input
              label="Ulangi Sandi"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Konfirmasi sandi"
              required
            />
          </div>

          <label className="flex items-start gap-2.5 text-xs text-neutral-400 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded bg-[#1a1a1a] border-[#333333] text-emerald-500 cursor-pointer"
            />
            <span>
              Saya menyetujui Ketentuan Layanan, Kebijakan Privasi, dan Otorisasi PIN 6-digit.
            </span>
          </label>

          <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={isLoading}>
            Buat Akun Sekarang
          </Button>
        </form>

        <div className="pt-3 border-t border-[#222222] text-center">
          <p className="text-xs text-neutral-400">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-emerald-400 font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
