import React, { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  MessageSquare,
  Search,
  ChevronDown,
  ChevronUp,
  Shield,
  Send,
  Sparkles,
  Bot,
  User,
  Zap,
  ExternalLink,
  BookMarked,
} from 'lucide-react';
import { Language } from '../types';

interface HelpCenterPageProps {
  language?: Language;
}

interface FAQItem {
  id: string;
  category: 'account' | 'payment' | 'trading' | 'glossary';
  question: string;
  answer: string;
}

export const HelpCenterPage: React.FC<HelpCenterPageProps> = ({ language = 'id' }) => {
  const isId = language === 'id';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<'ALL' | 'account' | 'payment' | 'trading' | 'glossary'>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  // Support chat simulator state
  const [chatMessages, setChatMessages] = useState<
    { sender: 'user' | 'support'; text: string; time: string }[]
  >([
    {
      sender: 'support',
      text: isId
        ? 'Halo! Selamat datang di Help Desk Terminal. Ada yang bisa kami bantu terkait deposit, pembacaan grafik, atau keamanan akun?'
        : 'Hello! Welcome to Terminal Help Desk. How can we assist with your trading, deposits, or charts today?',
      time: 'Just now',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const faqs: FAQItem[] = [
    {
      id: 'faq-1',
      category: 'account',
      question: isId ? 'Bagaimana cara kerja PIN keamanan pada akun saya?' : 'How does the security PIN work on my account?',
      answer: isId
        ? 'PIN keamanan 6-digit terenkripsi wajib dimasukkan setiap kali Anda mengeksekusi order jual/beli, menarik dana kas, atau mengubah foto profil. PIN ini bersifat rahasia dan terlindungi enkripsi.'
        : 'An encrypted 6-digit security PIN is required for trade executions, cash withdrawals, and profile changes.',
    },
    {
      id: 'faq-2',
      category: 'payment',
      question: isId ? 'Bagaimana cara mengisi saldo kas RDN (Deposit)?' : 'How do I deposit funds into my cash balance?',
      answer: isId
        ? 'Buka menu Wallet > pilih tab Isi Saldo (Deposit). Anda dapat memilih saluran BCA Virtual Account, Mandiri, BRI, QRIS Instan, atau USDT Web3 MetaMask. Dana langsung diproses secara real-time.'
        : 'Go to Wallet > select Deposit. Choose between Virtual Accounts (BCA/Mandiri/BRI), instant QRIS, or Web3 USDT.',
    },
    {
      id: 'faq-3',
      category: 'trading',
      question: isId ? 'Apa perbedaan Akun Real dan Akun Demo?' : 'What is the difference between Real and Demo accounts?',
      answer: isId
        ? 'Akun Real menggunakan saldo kas RDN BCA Anda yang sesungguhnya. Akun Demo menyediakan saldo simulasi $100,000 USD virtual untuk menguji strategi tanpa risiko kehilangan uang asli.'
        : 'Real mode trades with your actual custodian cash balance. Demo mode provides $100,000 virtual balance to test strategies risk-free.',
    },
    {
      id: 'faq-4',
      category: 'trading',
      question: isId ? 'Bagaimana cara membaca grafik Candlestick?' : 'How do I read Candlestick charts?',
      answer: isId
        ? 'Lilin hijau menandakan harga penutupan (Close) lebih tinggi dari pembukaan (Open), menandakan tekanan beli. Lilin merah menandakan harga turun. Garis sumbu atas dan bawah menandakan harga tertinggi (High) dan terendah (Low).'
        : 'Green candles indicate bullish close higher than open. Red candles show bearish downward momentum. Wicks indicate highest and lowest points reached.',
    },
    {
      id: 'faq-5',
      category: 'glossary',
      question: isId ? 'Apa arti istilah Bid, Ask, dan Spread?' : 'What do Bid, Ask, and Spread mean?',
      answer: isId
        ? 'Bid adalah harga tertinggi yang siap dibayar pembeli. Ask adalah harga terendah yang diminta penjual. Spread adalah selisih antara harga Ask terendah dan Bid tertinggi.'
        : 'Bid is the highest price buyers are offering. Ask is the lowest price sellers are willing to take. Spread is the difference between Ask and Bid.',
    },
    {
      id: 'faq-6',
      category: 'glossary',
      question: isId ? 'Apa itu Stop Loss (SL) dan Take Profit (TP)?' : 'What are Stop Loss (SL) and Take Profit (TP)?',
      answer: isId
        ? 'Stop Loss adalah order otomatis untuk membatasi kerugian jika harga bergerak berlawanan dengan analisa Anda. Take Profit adalah target otomatis untuk mengunci keuntungan ketika target tercapai.'
        : 'Stop Loss automatically sells to cap loss if price moves against your trade. Take Profit automatically secures gains at your target.',
    },
  ];

  const filteredFaqs = faqs.filter((f) => {
    const matchesCat = selectedCat === 'ALL' || f.category === selectedCat;
    const matchesSearch =
      !searchQuery ||
      f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    setInputMsg('');

    const newMsgs = [
      ...chatMessages,
      { sender: 'user' as const, text: userText, time: 'Just now' },
    ];
    setChatMessages(newMsgs);

    // Dynamic smart answer simulation
    setTimeout(() => {
      let reply = isId
        ? 'Pertanyaan Anda telah kami terima. Tim support kami siap membantu memverifikasi kendala Anda 24/7.'
        : 'We received your inquiry. Our support desk is monitoring live markets and standing by to assist.';

      const lower = userText.toLowerCase();
      if (lower.includes('pin') || lower.includes('sandi') || lower.includes('password')) {
        reply = isId
          ? 'Kode PIN keamanan Anda terenkripsi demi privasi (••••••). Anda dapat melakukan verifikasi atau reset PIN melalui menu Pengaturan Keamanan.'
          : 'Your security PIN is securely encrypted (••••••). You can manage it in Security Settings.';
      } else if (lower.includes('deposit') || lower.includes('isi saldo') || lower.includes('saldo')) {
        reply = isId
          ? 'Untuk deposit, buka tab "Wallet" di menu navigasi atas > klik "Isi Saldo (Deposit)" > pilih BCA Virtual Account atau QRIS.'
          : 'You can deposit funds via the Wallet page using Virtual Accounts, QRIS, or Web3 USDT.';
      } else if (lower.includes('withdraw') || lower.includes('tarik')) {
        reply = isId
          ? 'Penarikan dana diproses instan ke rekening Bank BCA Anda atas nama Achmad Husain setelah verifikasi PIN keamanan.'
          : 'Withdrawals are processed instantly to your verified BCA account with PIN authorization.';
      } else if (lower.includes('demo') || lower.includes('paper')) {
        reply = isId
          ? 'Anda bisa mengaktifkan Mode Demo ($100,000 USD virtual) melalui tombol switch di navbar atas kapan saja.'
          : 'You can switch between Real and Demo mode anytime using the header toggle switch.';
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'support', text: reply, time: 'Just now' },
      ]);
    }, 600);
  };

  return (
    <div className="w-full flex flex-col gap-6 p-2 sm:p-5 max-w-7xl mx-auto animate-in fade-in select-none">
      {/* 1. Header Hero */}
      <div className="bg-gradient-to-r from-[#0c101a] via-[#101726] to-[#0c101a] border border-[#1b2336] rounded-2xl p-6 shadow-xl text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151f33] border border-[#233352] text-xs font-bold text-cyan-300">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>{isId ? 'Pusat Bantuan & Panduan Edukasi Pasar' : 'Support Desk & Education Center'}</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
          {isId ? 'Ada yang Bisa Kami Bantu Hari Ini?' : 'How Can We Help You Today?'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
          {isId
            ? 'Temukan jawaban cepat seputar deposit, penarikan, indikator teknikal, order book, dan keamanan PIN akun Anda.'
            : 'Find instant answers regarding deposits, withdrawals, indicators, order books, and PIN security.'}
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto pt-2">
          <Search className="w-4 h-4 text-[#2962ff] absolute left-4 top-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isId
                ? 'Ketik pertanyaan (misal: PIN sandi, cara deposit, apa itu spread)...'
                : 'Search questions (e.g. security PIN, how to deposit, what is spread)...'
            }
            className="w-full bg-[#0c111c] border border-[#202b3f] focus:border-[#2962ff] rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none shadow-inner"
          />
        </div>
      </div>

      {/* 2. Main Grid: FAQs & Live Chat Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: FAQ Accordion (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            {[
              { id: 'ALL', label: isId ? 'Semua Topik' : 'All Topics' },
              { id: 'account', label: isId ? 'Akun & PIN' : 'Account & PIN' },
              { id: 'payment', label: isId ? 'Deposit & Tarik' : 'Deposit & Withdraw' },
              { id: 'trading', label: isId ? 'Trading & Chart' : 'Trading & Charts' },
              { id: 'glossary', label: isId ? 'Kamus Istilah' : 'Glossary' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-[#2962ff] text-white font-bold shadow'
                    : 'bg-[#0d121c] border border-[#1b2438] text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion Items */}
          <div className="space-y-2.5">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl bg-[#090d16] border border-[#1b2336] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-[#0f1524] transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-white">{faq.question}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-500 shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 text-xs text-neutral-300 leading-relaxed border-t border-[#141b2a] bg-[#0c101a]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Chat Assistant (5 cols) */}
        <div className="lg:col-span-5 bg-[#090d16] border border-[#1b2336] rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="p-3.5 border-b border-[#182133] bg-[#0d121c] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Terminal AI & Desk Support</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono">Online • Respon Cepat</span>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'support' && (
                  <div className="w-6 h-6 rounded-full bg-cyan-900/40 text-cyan-300 flex items-center justify-center shrink-0 text-[10px] font-bold">
                    CS
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#2962ff] text-white rounded-br-none'
                      : 'bg-[#121724] border border-[#1c2438] text-neutral-200 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-60 mt-1 block text-right font-mono">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div className="p-2 border-t border-[#141b2a] bg-[#0c1018] flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              onClick={() => setInputMsg(isId ? 'Berapa PIN keamanan saya?' : 'What is my security PIN?')}
              className="px-2 py-0.5 rounded-lg bg-[#141b2a] text-neutral-400 hover:text-white shrink-0 cursor-pointer"
            >
              PIN Keamanan
            </button>
            <button
              onClick={() => setInputMsg(isId ? 'Cara deposit saldo kas?' : 'How to deposit cash?')}
              className="px-2 py-0.5 rounded-lg bg-[#141b2a] text-neutral-400 hover:text-white shrink-0 cursor-pointer"
            >
              Deposit Kas
            </button>
            <button
              onClick={() => setInputMsg(isId ? 'Cara aktifkan akun demo?' : 'How to use demo account?')}
              className="px-2 py-0.5 rounded-lg bg-[#141b2a] text-neutral-400 hover:text-white shrink-0 cursor-pointer"
            >
              Akun Demo
            </button>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#182133] bg-[#0d121c] flex items-center gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder={isId ? 'Tanyakan sesuatu pada AI & Support...' : 'Ask AI & Support desk...'}
              className="flex-1 bg-[#121724] border border-[#20293d] focus:border-[#2962ff] rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-[#2962ff] hover:bg-[#1a4de0] text-white cursor-pointer transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
