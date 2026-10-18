import React from 'react';
import { 
  Sparkles, 
  Smartphone, 
  KeyRound, 
  Heart, 
  Moon, 
  BookOpen, 
  Compass, 
  Crown,
  ChevronLeft,
  Volume2,
  VolumeX,
  Play
} from 'lucide-react';
import { CHAPTERS_DATA } from '../data/gameAssets';
import { soundManager } from '../services/audio';

interface HomeViewProps {
  onStartCreate: () => void;
  onStartJoin: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  savedRoomCode?: string | null;
  onResumeGame?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartCreate,
  onStartJoin,
  soundEnabled,
  onToggleSound,
  savedRoomCode,
  onResumeGame,
}) => {
  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 flex flex-col items-center">
      {/* Crescent Moon & Ambient Iconography */}
      <div className="relative mb-3 flex items-center justify-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#30232D] to-[#9B7A88]/40 border border-[#C6A27C]/30 flex items-center justify-center shadow-[0_0_35px_rgba(213,174,131,0.25)] animate-soft-pulse">
          <Moon className="w-8 h-8 sm:w-10 sm:h-10 text-[#D5AE83]" />
        </div>
        <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-[#C99BA8] animate-twinkle" />
      </div>

      {/* Main Title & Subtitle */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black font-heading bg-gradient-to-r from-[#D5AE83] via-[#F6E9D7] to-[#C99BA8] bg-clip-text text-transparent drop-shadow-sm">
          ♡ مشاعر — سرّ الحكاية
        </h1>
        <p className="text-base sm:text-lg text-[#C6A27C] font-serif-ar tracking-wide">
          حكاية لا يعرف نهايتها أحد
        </p>
        <p className="text-xs sm:text-sm text-[#C3ADA8] font-light">
          "A story written by two hearts."
        </p>
      </div>

      {/* Hero Quote Card */}
      <div className="mt-5 w-full max-w-md bg-[#30232D]/75 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#C6A27C]/25 text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C6A27C]/10 to-transparent pointer-events-none" />
        <p className="text-sm sm:text-base text-[#F6E9D7] font-serif-ar leading-relaxed">
          "فيه حكايات بتتكتب بالكلام... وحكايتكم هتتكتب بالاختيارات."
        </p>
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-[#C99BA8]">
          <Heart size={14} className="fill-[#C99BA8]" />
          <span>مغامرة خاصة تجمع بين بسنت وعمرو</span>
        </div>
      </div>

      {/* Resume Banner if already in a session */}
      {savedRoomCode && onResumeGame && (
        <div className="mt-4 w-full max-w-md bg-[#30232D]/95 border border-[#D5AE83]/60 rounded-xl p-3.5 flex items-center justify-between gap-3 shadow-md animate-pulse">
          <div className="text-right">
            <span className="text-xs text-[#D5AE83] font-bold block">لديكما مغامرة نشطة بالفعل!</span>
            <span className="text-[11px] text-[#C3ADA8]">الغرفة: {savedRoomCode}</span>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onResumeGame();
            }}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#C6A27C] to-[#D5AE83] text-[#211A20] text-xs font-bold flex items-center gap-1 shadow hover:opacity-95"
          >
            <Play size={13} />
            <span>استئناف اللعب</span>
          </button>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="mt-5 sm:mt-7 w-full max-w-md flex flex-col gap-3">
        <button
          onClick={() => {
            soundManager.playClick();
            onStartCreate();
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C6A27C] via-[#D5AE83] to-[#C99BA8] text-[#211A20] font-bold text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(213,174,131,0.3)] hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer font-heading"
        >
          <Sparkles className="w-5 h-5 text-[#211A20]" />
          <span>ابدأ حكايتنا</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            onStartJoin();
          }}
          className="w-full py-3 px-6 rounded-xl bg-[#30232D]/90 hover:bg-[#30232D] text-[#F6E9D7] border border-[#C6A27C]/30 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
        >
          <KeyRound className="w-4 h-4 text-[#D5AE83]" />
          <span>انضم لعمرو بكود</span>
        </button>
      </div>

      {/* "كيف نلعب؟" Section */}
      <div className="mt-8 w-full max-w-lg bg-[#211A20]/60 rounded-2xl p-4 sm:p-5 border border-white/5">
        <h2 className="text-sm font-bold text-[#D5AE83] flex items-center gap-2 mb-2.5 font-heading">
          <Smartphone size={16} />
          <span>كيف نلعب؟ (على تليفونين منفصلين)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#C3ADA8]">
          <div className="bg-[#30232D]/60 p-2.5 rounded-xl border border-white/5">
            <span className="text-[#C99BA8] font-bold block mb-1">١. غرفة خاصة</span>
            <span>بسنت بتنشئ الغرفة، وتشارك الكود مع عمرو لينضم من تليفونه.</span>
          </div>
          <div className="bg-[#30232D]/60 p-2.5 rounded-xl border border-white/5">
            <span className="text-[#D5AE83] font-bold block mb-1">٢. اختيارات سرية</span>
            <span>كل واحد بيختار إجابته بخصوصية تامة، ومحدش بيشوف إجابة التاني.</span>
          </div>
          <div className="bg-[#30232D]/60 p-2.5 rounded-xl border border-white/5">
            <span className="text-[#C6A27C] font-bold block mb-1">٣. الكشف المزدوج</span>
            <span>لما الاتنين يختاروا، الستار بينكشف سوا والحكاية بتتحرك بالنتائج!</span>
          </div>
        </div>
      </div>

      {/* Chapters Preview Carousel / Grid */}
      <div className="mt-8 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-[#F6E9D7] flex items-center gap-1.5 font-heading">
            <BookOpen size={16} className="text-[#C99BA8]" />
            <span>فصول الحكاية الخمسة</span>
          </h2>
          <span className="text-[11px] text-[#C3ADA8]">٢٥ مشهداً ولغزاً تفاعلياً</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {CHAPTERS_DATA.map((ch) => {
            const iconsMap: Record<string, React.ReactNode> = {
              Mail: <Moon className="w-4 h-4 text-[#D5AE83]" />,
              BookOpen: <BookOpen className="w-4 h-4 text-[#C99BA8]" />,
              Compass: <Compass className="w-4 h-4 text-[#C6A27C]" />,
              Heart: <Heart className="w-4 h-4 text-[#C99BA8]" />,
              Crown: <Crown className="w-4 h-4 text-[#D5AE83]" />,
            };

            return (
              <div 
                key={ch.id}
                className="bg-[#30232D]/70 p-3 rounded-xl border border-[#C6A27C]/15 hover:border-[#C6A27C]/30 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] text-[#C6A27C] font-mono">{ch.numberArabic}</span>
                    <div className="p-1 rounded bg-[#211A20]/80">
                      {iconsMap[ch.icon] || <Sparkles className="w-4 h-4 text-[#D5AE83]" />}
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#F6E9D7] mb-0.5">{ch.title}</h3>
                  <p className="text-[11px] text-[#C3ADA8] leading-relaxed line-clamp-2">{ch.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discreet Sound Toggle Bar */}
      <div className="mt-6 flex items-center gap-2">
        <button
          onClick={onToggleSound}
          className="flex items-center gap-1.5 text-xs text-[#C3ADA8] hover:text-[#F6E9D7] bg-[#30232D]/40 px-3 py-1.5 rounded-full border border-white/5 transition-all"
        >
          {soundEnabled ? <Volume2 size={14} className="text-[#D5AE83]" /> : <VolumeX size={14} />}
          <span>{soundEnabled ? 'المؤثرات الصوتية مفعّلة' : 'المؤثرات الصوتية مكتومة'}</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-[#C6A27C]/80 font-serif-ar border-t border-white/5 pt-4 w-full max-w-md">
        <span>صُنعت بحب لبسنت وعمرو</span>
        <span className="mx-2 text-[#C6A27C]/30">•</span>
        <span className="text-[11px] text-[#C3ADA8]/60">مشاعر — ٢٠٢٦</span>
      </footer>
    </div>
  );
};
