import React, { useEffect } from 'react';
import { 
  Sparkles, 
  Heart, 
  ArrowLeft, 
  Award, 
  Key, 
  Check, 
  Scale, 
  Crown,
  Loader2
} from 'lucide-react';
import { Scene, SafeRoomState } from '../types/game';
import { soundManager } from '../services/audio';

interface RevealViewProps {
  scene: Scene;
  roomState: SafeRoomState;
  onNextScene: () => Promise<void>;
  isAdvancing: boolean;
}

export const RevealView: React.FC<RevealViewProps> = ({
  scene,
  roomState,
  onNextScene,
  isAdvancing,
}) => {
  const currentAnswer = roomState.answers[scene.id];
  const p1Name = roomState.players.p1?.name || 'بسنت';
  const p2Name = roomState.players.p2?.name || 'عمرو';

  const p1Answer = currentAnswer?.p1Answer || 'لم يُحدد';
  const p2Answer = currentAnswer?.p2Answer || 'لم يُحدد';
  const isMatch = p1Answer === p2Answer;

  // Find human-readable label if option id was chosen
  const getReadableLabel = (val: string) => {
    const found = scene.options?.find(o => o.id === val);
    return found ? found.label : val;
  };

  useEffect(() => {
    soundManager.playReveal();
  }, []);

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-6 flex flex-col items-center animate-fade-in text-right">
      {/* Celebration Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D5AE83]/20 border border-[#D5AE83]/40 text-xs text-[#D5AE83] font-semibold mb-2 shadow">
          <Sparkles size={14} />
          <span>انكشف السر المشترك</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#F6E9D7]">
          {scene.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#C6A27C] font-serif-ar mt-0.5">
          {isMatch ? 'قلبان يفكران بنبض واحد في هذه اللحظة ❤️' : 'اختلاف لطيف يكمل لوحة الحكاية بتناغم ⚖️'}
        </p>
      </div>

      {/* Side-by-Side Answers Comparison */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {/* Bassant's Card */}
        <div className="bg-[#30232D]/90 rounded-2xl p-4 sm:p-5 border border-[#C99BA8]/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#C99BA8] flex items-center gap-1">
              <span>🌸</span>
              <span>اختيار {p1Name}</span>
            </span>
            <Check size={14} className="text-[#C99BA8]" />
          </div>
          <div className="p-3 bg-[#211A20] rounded-xl border border-white/5 text-xs sm:text-sm text-[#F6E9D7] leading-relaxed font-serif-ar">
            {getReadableLabel(p1Answer)}
          </div>
        </div>

        {/* Amr's Card */}
        <div className="bg-[#30232D]/90 rounded-2xl p-4 sm:p-5 border border-[#D5AE83]/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#D5AE83] flex items-center gap-1">
              <span>🌟</span>
              <span>اختيار {p2Name}</span>
            </span>
            <Check size={14} className="text-[#D5AE83]" />
          </div>
          <div className="p-3 bg-[#211A20] rounded-xl border border-white/5 text-xs sm:text-sm text-[#F6E9D7] leading-relaxed font-serif-ar">
            {getReadableLabel(p2Answer)}
          </div>
        </div>
      </div>

      {/* Narrative Reaction Box in Egyptian Arabic */}
      <div className="w-full bg-[#211A20]/90 rounded-2xl p-5 border border-[#C6A27C]/30 shadow-xl mb-6 relative">
        <div className="flex items-center gap-2 text-xs font-bold text-[#D5AE83] mb-2">
          {isMatch ? <Heart size={15} className="fill-[#C99BA8] text-[#C99BA8]" /> : <Scale size={15} />}
          <span>صدى الحكاية:</span>
        </div>
        <p className="text-sm sm:text-base text-[#F6E9D7] font-serif-ar leading-relaxed">
          {currentAnswer?.narrativeReaction || scene.revealDialogue.general}
        </p>
      </div>

      {/* Rewards Unlocked Banner (Clues & Achievements) */}
      <div className="w-full space-y-2 mb-6">
        {scene.rewardClueId && (
          <div className="w-full p-3 bg-[#30232D] rounded-xl border border-[#C6A27C]/40 flex items-center gap-2 text-xs text-[#D5AE83] shadow">
            <Key size={16} className="text-[#D5AE83] shrink-0" />
            <span>تم العثور على أثر جديد وإضافته إلى صندوق أسراركما! 🗝️</span>
          </div>
        )}

        {scene.rewardAchievementId && (
          <div className="w-full p-3 bg-[#30232D] rounded-xl border border-[#C99BA8]/40 flex items-center gap-2 text-xs text-[#C99BA8] shadow">
            <Award size={16} className="text-[#C99BA8] shrink-0" />
            <span>وسام جديد تم إلغاء قفله في سجل إنجازاتكما! 🏆</span>
          </div>
        )}

        {/* Points indicator */}
        <div className="text-center text-xs text-[#C6A27C]">
          <span>+ {scene.points} نقطة أُضيفت إلى رصيدكما المشترك</span>
        </div>
      </div>

      {/* Synchronous Advance Button */}
      <div className="w-full max-w-sm">
        <button
          onClick={() => {
            soundManager.playClick();
            onNextScene();
          }}
          disabled={isAdvancing}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C6A27C] via-[#D5AE83] to-[#C99BA8] text-[#211A20] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(213,174,131,0.3)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer font-heading"
        >
          {isAdvancing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>جاري الانتقال سوياً...</span>
            </>
          ) : (
            <>
              <span>المشهد التالي</span>
              <ArrowLeft size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
