import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TerminalLogo } from '../../components/TerminalLogo';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-10 select-none">
      <div className="w-full max-w-md bg-[#111111] border border-[#242424] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <TerminalLogo size="md" showText={false} />
          </div>
          <h2 className="text-2xl font-black font-mono text-white">Reset Kata Sandi</h2>
          <p className="text-xs text-neutral-400">
            Masukkan email terdaftar Anda untuk menerima instruksi pemulihan.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-5 rounded-2xl bg-[#0f1f17] border border-emerald-500/40 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold font-mono text-white">Tautan Terkirim!</h4>
            <p className="text-xs text-neutral-300">
              Kami telah mengirimkan instruksi reset kata sandi ke <strong>{email}</strong>.
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/20 text-xs text-neutral-400">
              Catatan: PIN transaksi akun Anda tetap terlindungi dan tersimpan aman.
            </div>
            <Link to="/login" className="block pt-2 text-xs text-emerald-400 hover:underline font-bold">
              Kembali ke Halaman Masuk
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Terdaftar"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="p-3.5 rounded-xl bg-[#161616] border border-[#262626] text-xs text-neutral-400 space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Otorisasi Keamanan:</span>
              </span>
              <p>Sandi PIN transaksi: <strong className="font-mono text-white tracking-widest">••••••</strong> (Terenkripsi)</p>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
              Kirim Tautan Reset
            </Button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Masuk</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
