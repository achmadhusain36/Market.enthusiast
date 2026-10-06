import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { TerminalLogo } from '../../components/TerminalLogo';
import { showToast } from '../../components/ui/Toast';

export const VerifyEmailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'trader@nusa.com';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerified, setIsVerified] = useState(false);

  const handleDigitChange = (idx: number, val: string) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...code];
    next[idx] = val;
    setCode(next);

    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    setIsVerified(true);
    showToast({
      type: 'success',
      title: 'Email Terverifikasi!',
      message: 'Akun Anda telah aktif secara penuh.',
    });
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 sm:p-10 select-none">
      <div className="w-full max-w-md bg-[#111111] border border-[#242424] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center">
        <div className="flex justify-center">
          <TerminalLogo size="md" showText={false} />
        </div>

        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black font-mono text-white">Verifikasi Alamat Email</h2>
          <p className="text-xs text-neutral-400">
            Masukkan kode 6 digit yang kami kirimkan ke <strong className="text-white">{email}</strong>.
          </p>
        </div>

        {/* 6 Digit Inputs */}
        <div className="flex items-center justify-center gap-2">
          {code.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              className="w-11 h-12 text-center text-lg font-mono font-bold bg-[#181818] border border-[#2e2e2e] focus:border-emerald-500 rounded-xl text-white outline-none"
            />
          ))}
        </div>

        <div className="text-[11px] text-neutral-500 font-mono">
          Tips demo: Anda dapat menekan tombol langsung di bawah untuk verifikasi instan.
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleVerify}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isVerified ? 'Mengarahkan ke Dashboard...' : 'Verifikasi & Mulai Trading'}
        </Button>

        <div className="text-xs text-neutral-400">
          Tidak menerima email?{' '}
          <button
            onClick={() => showToast({ type: 'info', title: 'Kode Dikirim Ulang' })}
            className="text-emerald-400 font-bold hover:underline cursor-pointer"
          >
            Kirim Ulang Kode
          </button>
        </div>
      </div>
    </div>
  );
};
