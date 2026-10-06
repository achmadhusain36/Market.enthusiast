import React from 'react';
import { Link } from 'react-router-dom';
import { TerminalLogo } from '../TerminalLogo';
import { ShieldCheck, Lock, Globe2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080808] border-t border-[#1f1f1f] text-neutral-400 text-xs select-none">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <TerminalLogo size="md" showText={true} subtitle="NUSA TRADE TERMINAL" />
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              Platform trading dan pemantauan pasar multi-aset global generasi baru. Nikmati eksekusi
              secepat kilat, supercharts analitis mendalam, dan keamanan enkripsi berstandar industri.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-neutral-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>TLS 1.3 Terenkripsi</span>
              </span>
              <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>PIN 6-Digit Protection</span>
              </span>
            </div>
          </div>

          {/* Kolom 1: Produk */}
          <div className="space-y-3">
            <h4 className="text-white font-bold font-mono tracking-wider text-xs uppercase">Produk</h4>
            <ul className="space-y-2">
              <li><Link to="/market" className="hover:text-emerald-400 transition-colors">Screener Pasar</Link></li>
              <li><Link to="/trade" className="hover:text-emerald-400 transition-colors">Simulasi Trade</Link></li>
              <li><Link to="/watchlist" className="hover:text-emerald-400 transition-colors">Watchlist & Alerts</Link></li>
              <li><Link to="/portfolio" className="hover:text-emerald-400 transition-colors">Manajemen Portofolio</Link></li>
              <li><Link to="/wallet" className="hover:text-emerald-400 transition-colors">Dompet & Saldo</Link></li>
            </ul>
          </div>

          {/* Kolom 2: Perusahaan */}
          <div className="space-y-3">
            <h4 className="text-white font-bold font-mono tracking-wider text-xs uppercase">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/help" className="hover:text-emerald-400 transition-colors">Pusat Bantuan & FAQ</Link></li>
              <li><Link to="/settings" className="hover:text-emerald-400 transition-colors">Keamanan Akun</Link></li>
              <li><Link to="/notifications" className="hover:text-emerald-400 transition-colors">Pengumuman Sistem</Link></li>
              <li><span className="text-neutral-500">Status Sistem (99.98% Uptime)</span></li>
            </ul>
          </div>

          {/* Kolom 3: Legalitas */}
          <div className="space-y-3">
            <h4 className="text-white font-bold font-mono tracking-wider text-xs uppercase">Kebijakan</h4>
            <ul className="space-y-2">
              <li><span className="hover:text-emerald-400 cursor-pointer">Syarat & Ketentuan</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Kebijakan Privasi</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Keterbukaan Risiko</span></li>
              <li><span className="hover:text-emerald-400 cursor-pointer">Pencegahan Fraud & AML</span></li>
            </ul>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="p-4 rounded-2xl bg-[#0f0f0f] border border-[#1e1e1e] text-[11px] leading-relaxed text-neutral-400 mb-8">
          <strong className="text-amber-400 block mb-1">Pemberitahuan Risiko Penting:</strong>
          Perdagangan instrumen keuangan seperti aset kripto, saham, valuta asing, dan komoditas
          melibatkan risiko kerugian modal yang signifikan. Kinerja historis tidak menjamin hasil di masa
          depan. Layanan simulasi paper trading disediakan untuk tujuan edukasi dan pelatihan analisis teknikal.
        </div>

        {/* Bottom Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#1c1c1c] text-[11px] text-neutral-400">
          <div>
            © {new Date().getFullYear()} Market Enthusiast (Nusa Trade Terminal). Hak cipta dilindungi undang-undang.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">API Publik</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Keamanan</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Bantuan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
