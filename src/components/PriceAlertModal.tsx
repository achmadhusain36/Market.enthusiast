import React, { useState } from 'react';
import {
  Bell,
  X,
  Volume2,
  Globe,
  Radio,
  CheckCircle2,
  Trash2,
  Plus,
  Play,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { PriceAlert, StockQuote, Language, AlertCondition } from '../types';
import { playAlertChime } from '../utils/audioAlert';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStock: StockQuote;
  alerts: PriceAlert[];
  onCreateAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>) => void;
  onDeleteAlert: (id: string) => void;
  language: Language;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  activeStock,
  alerts,
  onCreateAlert,
  onDeleteAlert,
  language = 'en',
}) => {
  const isId = language === 'id';
  const [targetPrice, setTargetPrice] = useState<string>(activeStock.price.toString());
  const [condition, setCondition] = useState<AlertCondition>('crossing');
  const [notifySound, setNotifySound] = useState(true);
  const [notifyBrowser, setNotifyBrowser] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(targetPrice);
    if (isNaN(priceNum) || priceNum <= 0) return;

    onCreateAlert({
      symbol: activeStock.symbol,
      targetPrice: priceNum,
      condition,
      notifyBrowser,
      notifySound,
      webhookUrl: webhookUrl.trim() || undefined,
      note: note.trim() || undefined,
    });

    if (notifySound) {
      playAlertChime();
    }

    setActiveTab('list');
  };

  const symbolAlerts = alerts.filter((a) => a.symbol === activeStock.symbol);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#12141a] border border-[#232733] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#1f2430] flex items-center justify-between bg-[#161a22]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{isId ? 'Buat Price Alert' : 'Create Price Alert'}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[#202738] text-cyan-300 font-mono">
                  {activeStock.symbol}
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                {isId ? 'Harga Terakhir' : 'Last Price'}: {activeStock.currency === 'IDR' ? 'Rp ' : '$'}
                {activeStock.price.toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#202738] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#1f2430] bg-[#12141a]">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'create'
                ? 'border-[#2962ff] text-white bg-[#181d28]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {isId ? 'Form Alert Baru' : 'New Alert'}
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2.5 text-xs font-bold text-center border-b-2 transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'list'
                ? 'border-[#2962ff] text-white bg-[#181d28]'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>{isId ? 'Daftar Alert Aktif' : 'Active Alerts'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
              {alerts.length}
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 text-xs">
          {activeTab === 'create' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Condition */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">
                  {isId ? 'Kondisi Pemicu Alert' : 'Trigger Condition'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'crossing', label: isId ? 'Menyilang Target' : 'Crosses Price' },
                    { id: 'greater_than', label: isId ? 'Harga >= Target' : 'Price >= Target' },
                    { id: 'less_than', label: isId ? 'Harga <= Target' : 'Price <= Target' },
                    { id: 'cross_above_ema50', label: isId ? 'Cross Di Atas EMA 50' : 'Cross Above EMA 50' },
                    { id: 'cross_below_ema50', label: isId ? 'Cross Di Bawah EMA 50' : 'Cross Below EMA 50' },
                    { id: 'rsi_overbought', label: isId ? 'RSI Overbought (>70)' : 'RSI Overbought (>70)' },
                    { id: 'rsi_oversold', label: isId ? 'RSI Oversold (<30)' : 'RSI Oversold (<30)' },
                    { id: 'supertrend_flip', label: isId ? 'Supertrend Flip' : 'Supertrend Flip' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCondition(item.id as AlertCondition)}
                      className={`p-2 rounded-xl text-center border text-[11px] font-semibold transition-all cursor-pointer ${
                        condition === item.id
                          ? 'border-[#2962ff] bg-[#1e2a44] text-white shadow-sm'
                          : 'border-[#202738] bg-[#161a22] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Price */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-neutral-300 font-semibold">
                    {isId ? 'Target Harga' : 'Target Price'} ({activeStock.currency})
                  </label>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setTargetPrice((activeStock.price * 1.02).toFixed(2))}
                      className="px-1.5 py-0.5 rounded bg-[#1e2430] text-emerald-400 hover:bg-[#252e3e]"
                    >
                      +2%
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetPrice((activeStock.price * 1.05).toFixed(2))}
                      className="px-1.5 py-0.5 rounded bg-[#1e2430] text-emerald-400 hover:bg-[#252e3e]"
                    >
                      +5%
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetPrice((activeStock.price * 0.98).toFixed(2))}
                      className="px-1.5 py-0.5 rounded bg-[#1e2430] text-rose-400 hover:bg-[#252e3e]"
                    >
                      -2%
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  step="any"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  className="w-full bg-[#161a22] border border-[#2a3040] rounded-xl px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-[#2962ff]"
                  placeholder="0.00"
                  required
                />
              </div>

              {/* Notification Channels */}
              <div className="space-y-2 pt-1 border-t border-[#1f2430]">
                <label className="block text-neutral-300 font-semibold">
                  {isId ? 'Saluran Notifikasi' : 'Notification Channels'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#161a22] border border-[#202738] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifySound}
                      onChange={(e) => setNotifySound(e.target.checked)}
                      className="accent-[#2962ff] rounded"
                    />
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isId ? 'Suara Chime' : 'Audio Chime'}</span>
                    </div>
                  </label>
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#161a22] border border-[#202738] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifyBrowser}
                      onChange={(e) => setNotifyBrowser(e.target.checked)}
                      className="accent-[#2962ff] rounded"
                    />
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isId ? 'Pop-up Toast' : 'Toast Alert'}</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Webhook URL Simulation */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    <span>Webhook URL ({isId ? 'Opsional: Discord / Telegram' : 'Optional'})</span>
                  </span>
                  <span className="text-[10px] text-neutral-500 font-normal">POST JSON Payload</span>
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/... or https://api.telegram.org/..."
                  className="w-full bg-[#161a22] border border-[#2a3040] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#2962ff]"
                />
              </div>

              {/* Alert Note */}
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">
                  {isId ? 'Pesan / Catatan' : 'Alert Message / Note'}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={isId ? 'Contoh: TP 1 BBCA tersentuh, pasang Trailing Stop' : 'e.g. Target hit, lock in profits'}
                  className="w-full bg-[#161a22] border border-[#2a3040] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#2962ff]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => playAlertChime()}
                  className="px-3 py-2 rounded-xl bg-[#1e2430] hover:bg-[#252e3e] text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Test Sound"
                >
                  <Play className="w-3 h-3 text-amber-400" />
                  <span>{isId ? 'Tes Suara' : 'Test Sound'}</span>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2962ff] hover:bg-[#1e54e4] text-white text-xs font-bold shadow-md shadow-blue-900/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isId ? 'Simpan Alert' : 'Create Alert'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {alerts.length === 0 ? (
                <div className="py-10 text-center text-neutral-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-amber-400" />
                  <p>{isId ? 'Belum ada alert yang dipasang.' : 'No active alerts created yet.'}</p>
                </div>
              ) : (
                alerts.map((alt) => (
                  <div
                    key={alt.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                      alt.triggered
                        ? 'bg-amber-950/20 border-amber-500/30 text-neutral-200'
                        : 'bg-[#161a22] border-[#222736] text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          alt.triggered
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-[#1f2638] text-cyan-400'
                        }`}
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{alt.symbol}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#202738] text-neutral-300 uppercase">
                            {alt.condition.replace('_', ' ')}
                          </span>
                          <span className="font-mono font-bold text-amber-400">
                            {alt.targetPrice.toLocaleString()}
                          </span>
                        </div>
                        {alt.note && <p className="text-[11px] text-neutral-400 mt-0.5">{alt.note}</p>}
                        <span className="text-[10px] text-neutral-500">
                          {alt.triggered
                            ? `${isId ? 'Terpicu pada' : 'Triggered at'} ${alt.triggeredAt || 'recent'}`
                            : `${isId ? 'Dibuat' : 'Created'} ${alt.createdAt}`}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteAlert(alt.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title={isId ? 'Hapus Alert' : 'Delete Alert'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
