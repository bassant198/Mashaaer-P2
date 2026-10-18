import React, { useState } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Heart, 
  Play, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { SafeRoomState } from '../types/game';
import { soundManager } from '../services/audio';

interface WaitingRoomViewProps {
  roomState: SafeRoomState;
  onStartGame: () => void;
}

export const WaitingRoomView: React.FC<WaitingRoomViewProps> = ({
  roomState,
  onStartGame,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const p1 = roomState.players.p1;
  const p2 = roomState.players.p2;
  const isBothConnected = !!p1 && !!p2;

  const copyCode = () => {
    navigator.clipboard.writeText(roomState.roomCode);
    setCopiedCode(true);
    soundManager.playClick();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}?room=${encodeURIComponent(roomState.roomCode)}&join=amr`;
    if (navigator.share) {
      navigator.share({
        title: "مشاعر — سرّ الحكاية",
        text: `يا عمرو، بسنت مستنياك في مغامرة "مشاعر"! ادخل بكود: ${roomState.roomCode}`,
        url: shareUrl,
      }).catch(() => {
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      soundManager.playClick();
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-8 flex flex-col items-center text-center">
      {/* Decorative Moon & Heart Badge */}
      <div className="w-16 h-16 rounded-full bg-[#30232D] border border-[#C6A27C]/30 flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(213,174,131,0.2)]">
        <Heart className="w-8 h-8 text-[#C99BA8] fill-[#C99BA8]/40" />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#F6E9D7] mb-1">
        غرفة الانتظار السرية
      </h1>
      <p className="text-xs sm:text-sm text-[#C3ADA8] max-w-xs mb-6">
        شاركي الكود ده مع عمرو عشان يبدأ يدخل من تليفونه.
      </p>

      {/* Big Room Code Card */}
      <div className="w-full bg-[#30232D]/90 backdrop-blur-md rounded-2xl p-5 border border-[#C6A27C]/30 shadow-xl mb-6">
        <span className="text-[11px] text-[#C6A27C] block mb-1">كود الغرفة الخاص بكم:</span>
        <div className="flex items-center justify-center gap-3 my-2">
          <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#D5AE83] tracking-widest bg-[#211A20] px-5 py-2 rounded-xl border border-[#C6A27C]/20 shadow-inner">
            {roomState.roomCode}
          </span>
          <button
            onClick={copyCode}
            aria-label="نسخ الكود"
            className="p-3 rounded-xl bg-[#211A20] hover:bg-[#211A20]/80 border border-[#C6A27C]/30 text-[#D5AE83] transition-all active:scale-95"
            title="نسخ الكود"
          >
            {copiedCode ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
          </button>
        </div>

        {/* Share Link Button */}
        <button
          onClick={copyShareLink}
          className="mt-3 w-full py-2.5 px-3 rounded-xl bg-[#211A20]/60 hover:bg-[#211A20] border border-white/5 text-xs text-[#C99BA8] flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
        >
          <Share2 size={14} />
          <span>{copiedLink ? 'تم نسخ رابط الدعوة المباشر!' : 'مشاركة أو نسخ رابط الانضمام السريع'}</span>
        </button>
      </div>

      {/* Players Cards */}
      <div className="w-full grid grid-cols-2 gap-3 mb-6">
        {/* Player 1 Card (Bassant) */}
        <div className="bg-[#30232D]/80 rounded-2xl p-4 border border-[#C99BA8]/30 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-[#211A20] border border-[#C99BA8]/40 flex items-center justify-center text-xl mb-2 shadow">
            🌸
          </div>
          <span className="text-sm font-bold text-[#F6E9D7]">{p1 ? p1.name : 'بسنت'}</span>
          <span className="text-[11px] text-[#C99BA8] mt-0.5">اللاعب الأول</span>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>جاهزة للحكاية</span>
          </div>
        </div>

        {/* Player 2 Card (Amr) */}
        <div className={`rounded-2xl p-4 border flex flex-col items-center transition-all ${
          p2 ? 'bg-[#30232D]/80 border-[#D5AE83]/40' : 'bg-[#211A20]/60 border-dashed border-[#C6A27C]/25'
        }`}>
          <div className="w-12 h-12 rounded-full bg-[#211A20] border border-[#C6A27C]/30 flex items-center justify-center text-xl mb-2 shadow">
            {p2 ? '🌟' : '⏳'}
          </div>
          <span className="text-sm font-bold text-[#F6E9D7]">{p2 ? p2.name : 'عمرو'}</span>
          <span className="text-[11px] text-[#C6A27C] mt-0.5">اللاعب الثاني</span>
          <div className="mt-2 flex items-center gap-1 text-[11px]">
            {p2 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>انضم الآن!</span>
              </span>
            ) : (
              <span className="text-amber-400/80 flex items-center gap-1">
                <Clock size={11} className="animate-spin" />
                <span>في انتظار انضمامه...</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status & Start Action */}
      {isBothConnected ? (
        <div className="w-full space-y-3 animate-fade-in">
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-center gap-2">
            <Sparkles size={16} />
            <span>عمرو وصل بنجاح! أنتوا الاتنين جاهزين لبدء المغامرة!</span>
          </div>

          <button
            onClick={() => {
              soundManager.playClueUnlock();
              onStartGame();
            }}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#C6A27C] via-[#D5AE83] to-[#C99BA8] text-[#211A20] font-bold text-base sm:text-lg flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(213,174,131,0.35)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer font-heading"
          >
            <Play size={20} className="fill-[#211A20]" />
            <span>ابدأوا الحكاية معاً</span>
          </button>
        </div>
      ) : (
        <div className="p-3.5 bg-[#211A20]/80 rounded-xl border border-white/5 text-xs text-[#C3ADA8] max-w-sm">
          <span>مستنيين عمرو يدخل الكود... الشاشة هتتحدث تلقائياً أول ما ينضم!</span>
        </div>
      )}
    </div>
  );
};
