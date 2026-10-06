import React, { useState } from 'react';
import {
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  Share2,
  Bookmark,
  Sparkles,
  Flame,
  Calendar,
  Send,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Language, StockQuote, UserProfile } from '../types';

interface CommunityPageProps {
  language?: Language;
  stocks: StockQuote[];
  userProfile?: UserProfile;
  onSelectStock: (symbol: string) => void;
  onNavigateToChart: () => void;
}

interface IdeaPost {
  id: string;
  author: string;
  avatar: string;
  avatarUrl?: string;
  role: string;
  symbol: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  title: string;
  content: string;
  timeAgo: string;
  likes: number;
  comments: number;
  chartImgNote: string;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({
  language = 'en',
  stocks,
  userProfile,
  onSelectStock,
  onNavigateToChart,
}) => {
  const isId = language === 'id';

  const [posts, setPosts] = useState<IdeaPost[]>([
    {
      id: 'post-1',
      author: 'Hendro Wijaya, CFA',
      avatar: 'HW',
      role: isId ? 'Senior Technical Strategist' : 'Senior Technical Strategist',
      symbol: 'BBCA.JK',
      sentiment: 'BULLISH',
      title: isId
        ? 'BBCA Menguji Support Kuat 10.350 - Peluang Swing Buy Menuju Target 11.200'
        : 'BBCA Testing Major Support at 10,350 - Swing Buy Opportunity Toward 11,200 Target',
      content: isId
        ? 'Volume akumulasi asing kembali mencatatkan inflow Rp 350 Milyar pada sesi 2. Indikator RSI harian menunjukkan sinyal golden cross rebound dari area oversold 42. Disarankan akumulasi bertahap dengan batas risiko (stop loss) di bawah 10.150.'
        : 'Foreign accumulation logged Rp 350B inflow in session 2. Daily RSI indicator shows golden cross reversal from oversold 42. Accumulate on dips with stop loss below 10,150.',
      timeAgo: isId ? '2 jam yang lalu' : '2 hours ago',
      likes: 84,
      comments: 19,
      chartImgNote: isId
        ? 'Double Bottom Setup pada timeframe 4 Jam (Target: 11.200)'
        : 'Double Bottom Setup on 4-Hour timeframe (Target: 11,200)',
    },
    {
      id: 'post-2',
      author: 'Marcus Vance',
      avatar: 'MV',
      role: 'Wall Street Tech Quant',
      symbol: 'NVDA',
      sentiment: 'BULLISH',
      title: 'NVIDIA Blackwell Architecture Deployment Exceeding Guidance',
      content:
        'Hyperscaler capex projections for Q3/Q4 confirm sustained compute acceleration demand. NVIDIA price holding firmly above the $135 MA-20 line. Breakout resistance targets $150 prior to upcoming earnings catalyst.',
      timeAgo: isId ? '4 jam yang lalu' : '4 hours ago',
      likes: 142,
      comments: 38,
      chartImgNote: 'Ascending Triangle continuation pattern on Daily chart',
    },
    {
      id: 'post-3',
      author: 'Bambang Soediro',
      avatar: 'BS',
      role: 'Macro Analyst',
      symbol: 'COMPOSITE',
      sentiment: 'NEUTRAL',
      title: isId
        ? 'IHSG Berkonsolidasi di Kisaran 6.480 - 6.550 Menanti Keputusan Suku Bunga BI'
        : 'IDX Composite Consolidating in 6,480 - 6,550 Range Ahead of BI Rate Decision',
      content: isId
        ? 'Tekanan jual pada sektor komoditas dan batubara diimbangi penguatan saham perbankan big cap. Range trading masih dominan. Perhatikan level kritis 6.450 sebagai batas support psikologis bulanan.'
        : 'Selling pressure in commodities offset by inflows into big-cap banking stocks. Range trading remains dominant. Keep an eye on 6,450 critical support.',
      timeAgo: isId ? '7 jam yang lalu' : '7 hours ago',
      likes: 65,
      comments: 12,
      chartImgNote: 'Symmetrical Triangle compression on IHSG Index',
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [selectedSymbolForPost, setSelectedSymbolForPost] = useState('BBCA.JK');
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [shareToastId, setShareToastId] = useState<string | null>(null);

  const [postCommentsMap, setPostCommentsMap] = useState<Record<string, { id: string; author: string; text: string; time: string }[]>>({
    'post-1': [
      { id: 'c-1', author: 'Rizky Pratama', text: isId ? 'Setup yang sangat menarik, saya antre beli di 10.375.' : 'Great setup, placed limit order at 10,375.', time: '1 jam lalu' },
      { id: 'c-2', author: 'Siti Aminah', text: isId ? 'Bagaimana target resistance 11.000 jika asing terus akumulasi?' : 'What about resistance 11,000 if foreign inflows continue?', time: '30 mnt lalu' },
    ],
    'post-2': [
      { id: 'c-3', author: 'David S.', text: 'Guidance beat looks very likely with new datacenter contracts.', time: '2h ago' },
    ],
    'post-3': [
      { id: 'c-4', author: 'Agus Santoso', text: isId ? 'Tetap hati-hati dengan volatilitas nilai tukar Rupiah.' : 'Keep an eye on USD/IDR currency fluctuations.', time: '3h ago' },
    ],
  });

  const toggleLike = (id: string) => {
    setLikedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleBookmark = (id: string) => {
    setSavedPosts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSharePost = (id: string) => {
    navigator.clipboard?.writeText?.(`${window.location.origin}/#community-${id}`);
    setShareToastId(id);
    setTimeout(() => setShareToastId(null), 2000);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    const authorName = userProfile?.name || 'Market Enthusiast';
    const newC = {
      id: `c-${Date.now()}`,
      author: authorName,
      text: commentText.trim(),
      time: isId ? 'Baru saja' : 'Just now',
    };
    setPostCommentsMap((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newC],
    }));
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p))
    );
    setCommentText('');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const authorName = userProfile?.name || 'Market Enthusiast';
    const newEntry: IdeaPost = {
      id: `post-${Date.now()}`,
      author: authorName,
      avatar: authorName.charAt(0) || 'M',
      avatarUrl: userProfile?.avatarUrl,
      role: userProfile?.title || (isId ? 'Investor Saham & Analis Pasar' : 'Stock Investor & Market Analyst'),
      symbol: selectedSymbolForPost,
      sentiment: 'BULLISH',
      title: isId ? `Analisis Pasar Terbaru: ${selectedSymbolForPost}` : `Latest Market Analysis: ${selectedSymbolForPost}`,
      content: newComment.trim(),
      timeAgo: isId ? 'Baru saja' : 'Just now',
      likes: 1,
      comments: 0,
      chartImgNote: isId ? 'Setup teknikal aktif pada platform Market Enthusiast' : 'Active technical setup on Pro Terminal',
    };

    setPosts([newEntry, ...posts]);
    setNewComment('');
  };

  return (
    <div className="w-full flex flex-col gap-5 p-2 sm:p-5 max-w-7xl mx-auto animate-in fade-in">
      {/* 1. Page Header */}
      <div className="bg-gradient-to-r from-[#0d121d] via-[#121929] to-[#0d121d] border border-[#1e273b] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>{isId ? 'Komunitas & Ide Analisis TradingView' : 'Community & Trading Ideas'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {isId ? 'Ide Pasar & Diskusi Komunitas' : 'Market Ideas & Community Stream'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            {isId
              ? 'Bagikan analisis teknikal, diskusikan setup chart saham IHSG dan Wall Street, serta pantau sentimen pasar dari para analis profesional.'
              : 'Share technical analysis, discuss chart setups, and gauge market sentiment from verified analysts.'}
          </p>
        </div>

        {/* Market Sentiment Gauge */}
        <div className="bg-[#141b2a] border border-[#222e47] rounded-xl p-3.5 flex items-center gap-3.5 shrink-0 font-mono-num">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base">
            64
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 font-sans block">
              {isId ? 'Sentimen Pasar Global' : 'Market Sentiment (Fear & Greed)'}
            </span>
            <span className="text-emerald-400 font-bold text-xs uppercase">
              {isId ? 'Greed (Optimis Menguat)' : 'Greed (Optimistic)'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Community Posts Stream (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Create Post Box */}
          <div className="bg-[#0c1018] border border-[#1b2336] rounded-2xl p-4 shadow-lg">
            <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2962ff]" />
              <span>{isId ? 'Publikasikan Ide / Catatan Analisis Anda' : 'Post Your Trading Idea'}</span>
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium">
                  {isId ? 'Pilih Saham:' : 'Select Symbol:'}
                </span>
                <select
                  value={selectedSymbolForPost}
                  onChange={(e) => setSelectedSymbolForPost(e.target.value)}
                  className="bg-[#141b2b] border border-[#232f48] rounded-lg px-2.5 py-1 text-xs text-white font-bold focus:outline-none"
                >
                  {stocks.map((s) => (
                    <option key={s.symbol} value={s.symbol} className="bg-[#0e1422]">
                      {s.symbol} ({s.name})
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  isId
                    ? 'Tulis setup chart, level support/resistance, atau katalis penggerak harga...'
                    : 'Write your setup notes, key support/resistance levels, or catalysts...'
                }
                rows={3}
                className="w-full bg-[#131927] border border-[#212b40] focus:border-[#2962ff] rounded-xl p-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none resize-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">
                  {isId ? `Sebagai: ${userProfile?.name || 'Market Enthusiast'}` : `Posting as: ${userProfile?.name || 'Market Enthusiast'}`}
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 rounded-xl bg-[#2962ff] hover:bg-[#1e52e0] disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isId ? 'Kirim Ide' : 'Publish Idea'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {posts.map((post) => {
              const isLiked = likedPosts.includes(post.id);

              return (
                <div
                  key={post.id}
                  className="bg-[#0c1018] border border-[#1b2336] rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 transition-colors hover:border-[#283652]"
                >
                  {/* Post Top: Author Info & Symbol Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-tr from-[#2962ff] to-[#22ab94] flex items-center justify-center font-bold text-xs text-white shrink-0 border border-white/10">
                        {post.avatarUrl ? (
                          <img
                            src={post.avatarUrl}
                            alt={post.author}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          post.avatar
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs sm:text-sm flex items-center gap-1.5">
                          <span>{post.author}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 font-normal">
                            Pro
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {post.role} • <span className="text-neutral-500">{post.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onSelectStock(post.symbol);
                          onNavigateToChart();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#151d2e] hover:bg-[#1f2b42] border border-[#25334d] text-cyan-400 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Buka chart emiten ini"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{post.symbol}</span>
                      </button>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          post.sentiment === 'BULLISH'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {post.sentiment}
                      </span>
                    </div>
                  </div>

                  {/* Title & Body */}
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">
                      {post.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Chart Note Box */}
                  <div className="bg-[#121826] border border-[#1d273c] rounded-xl p-2.5 text-xs text-neutral-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{post.chartImgNote}</span>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#172031] text-xs text-neutral-400">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isLiked ? 'text-rose-400 font-bold' : 'hover:text-white'
                        }`}
                        title="Like"
                      >
                        <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        <span>{post.likes + (isLiked ? 1 : 0)}</span>
                      </button>

                      <button
                        onClick={() =>
                          setOpenCommentsPostId(openCommentsPostId === post.id ? null : post.id)
                        }
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          openCommentsPostId === post.id ? 'text-cyan-400 font-bold' : 'hover:text-white'
                        }`}
                        title={isId ? 'Lihat & Tulis Komentar' : 'View & Write Comments'}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>

                      <button
                        onClick={() => toggleBookmark(post.id)}
                        className={`flex items-center gap-1 transition-colors cursor-pointer ${
                          savedPosts.includes(post.id) ? 'text-amber-400 font-bold' : 'hover:text-white'
                        }`}
                        title={savedPosts.includes(post.id) ? (isId ? 'Tersimpan' : 'Saved') : (isId ? 'Simpan Analisis' : 'Bookmark')}
                      >
                        <Bookmark className={`w-4 h-4 ${savedPosts.includes(post.id) ? 'fill-current' : ''}`} />
                        <span className="hidden sm:inline">{savedPosts.includes(post.id) ? (isId ? 'Tersimpan' : 'Saved') : (isId ? 'Simpan' : 'Save')}</span>
                      </button>

                      <button
                        onClick={() => handleSharePost(post.id)}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer relative"
                        title={isId ? 'Bagikan Ide' : 'Share Idea'}
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">{isId ? 'Bagikan' : 'Share'}</span>
                        {shareToastId === post.id && (
                          <span className="absolute -top-7 left-0 bg-neutral-900 border border-neutral-700 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-20 animate-in fade-in">
                            {isId ? 'Tautan disalin!' : 'Link copied!'}
                          </span>
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        onSelectStock(post.symbol);
                        onNavigateToChart();
                      }}
                      className="text-xs font-semibold text-[#2962ff] hover:text-blue-400 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isId ? 'Pantau di Superchart' : 'Open in Superchart'}</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* Expanded Comments Thread */}
                  {openCommentsPostId === post.id && (
                    <div className="pt-3 border-t border-[#182133] space-y-3 animate-in fade-in">
                      <div className="space-y-2">
                        {(postCommentsMap[post.id] || []).length === 0 ? (
                          <p className="text-[11px] text-neutral-500 italic">
                            {isId ? 'Belum ada komentar. Jadilah yang pertama berkomentar!' : 'No comments yet. Be the first to comment!'}
                          </p>
                        ) : (
                          (postCommentsMap[post.id] || []).map((c) => (
                            <div
                              key={c.id}
                              className="p-2.5 rounded-xl bg-[#111726] border border-[#1b253b] text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-bold text-white">{c.author}</span>
                                <span className="text-[10px] text-neutral-500">{c.time}</span>
                              </div>
                              <p className="text-neutral-300 text-[11px] leading-relaxed">{c.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Comment Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                          placeholder={isId ? 'Tulis tanggapan atau analisis Anda...' : 'Write your comment or analysis...'}
                          className="flex-1 bg-[#111726] border border-[#1e2a42] rounded-xl px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#2962ff]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          className="px-3 py-1.5 rounded-xl bg-[#2962ff] hover:bg-[#1e54e4] text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          {isId ? 'Kirim' : 'Post'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Calendar & Trending Topics (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Economic Calendar Widget */}
          <div className="bg-[#0c1018] border border-[#1b2336] rounded-2xl p-4 shadow-lg space-y-3">
            <div className="flex items-center gap-2 border-b border-[#182133] pb-2.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {isId ? 'Agenda Ekonomi Pekan Ini' : 'Economic Calendar'}
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#131927] border border-[#1e283d] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white">{isId ? 'Rapat Dewan Gubernur BI' : 'Bank Indonesia Rate Decision'}</span>
                  <span className="text-emerald-400 font-mono">17 Sep 2026</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  {isId
                    ? 'Konsensus proyeksi suku bunga acuan BI 7-Day Reverse Repo Rate bertahan di 6.00%.'
                    : 'Consensus forecast for BI 7-Day Reverse Repo Rate holds steady at 6.00%.'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#131927] border border-[#1e283d] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white">{isId ? 'US FOMC Interest Rate Decision' : 'US FOMC Interest Rate Decision'}</span>
                  <span className="text-cyan-400 font-mono">18 Sep 2026</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  {isId
                    ? 'Ekspektasi pemangkasan suku bunga 25 bps oleh Federal Reserve AS.'
                    : 'Expected 25 bps interest rate reduction by the US Federal Reserve.'}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#131927] border border-[#1e283d] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white">{isId ? 'Rilis Neraca Perdagangan RI' : 'Indonesia Trade Balance Report'}</span>
                  <span className="text-amber-400 font-mono">20 Sep 2026</span>
                </div>
                <p className="text-neutral-400 text-[11px]">
                  {isId
                    ? 'Surplus neraca perdagangan diperkirakan mencapai US$ 2.8 Milyar.'
                    : 'Trade balance surplus estimated to reach US$ 2.8 Billion.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Monitor Shortcuts */}
          <div className="bg-[#0c1018] border border-[#1b2336] rounded-2xl p-4 shadow-lg space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>{isId ? 'Pantau Cepat Top Movers' : 'Top Movers'}</span>
            </h3>

            <div className="space-y-2">
              {stocks.slice(0, 5).map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => {
                    onSelectStock(stock.symbol);
                    onNavigateToChart();
                  }}
                  className="p-2 rounded-xl bg-[#121826] hover:bg-[#192235] border border-[#1c263c] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div>
                    <span className="font-bold text-white text-xs">{stock.symbol}</span>
                    <span className="text-[10px] text-neutral-400 block truncate max-w-[120px]">
                      {stock.name}
                    </span>
                  </div>
                  <div className="text-right font-mono-num text-xs font-bold">
                    <span
                      className={stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}
                    >
                      {stock.change >= 0 ? '+' : ''}
                      {stock.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
