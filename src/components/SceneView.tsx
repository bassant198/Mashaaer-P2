import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Send, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Feather, 
  MessageSquare,
  EyeOff,
  Lightbulb
} from 'lucide-react';
import { Scene, SafeRoomState, PlayerSlot } from '../types/game';
import { soundManager } from '../services/audio';

interface SceneViewProps {
  scene: Scene;
  roomState: SafeRoomState;
  onSubmitAnswer: (answer: string) => Promise<void>;
  onSendLetter?: (content: string) => Promise<void>;
  isSubmitting: boolean;
}

export const SceneView: React.FC<SceneViewProps> = ({
  scene,
  roomState,
  onSubmitAnswer,
  onSendLetter,
  isSubmitting,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [riddleCode, setRiddleCode] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);

  const mySlot = roomState.mySlot || 'p1';
  const myName = roomState.myName || (mySlot === 'p1' ? 'بسنت' : 'عمرو');
  const partnerName = roomState.partnerName || (mySlot === 'p1' ? 'عمرو' : 'بسنت');

  // Check current answer state
  const currentAnswer = roomState.answers[scene.id];
  const hasMySubmitted = mySlot === 'p1' ? currentAnswer?.p1Submitted : currentAnswer?.p2Submitted;
  const hasPartnerSubmitted = mySlot === 'p1' ? currentAnswer?.p2Submitted : currentAnswer?.p1Submitted;

  const handleChoiceSubmit = (val?: string) => {
    const finalVal = val || selectedOption || customText || riddleCode;
    if (!finalVal) return;
    soundManager.playClick();
    onSubmitAnswer(finalVal);
  };

  const handleLetterSubmit = (text: string) => {
    if (!text.trim()) return;
    soundManager.playLetterOpen();
    if (onSendLetter) {
      onSendLetter(text.trim());
    }
    onSubmitAnswer(text.trim());
  };

  const handleSkip = () => {
    soundManager.playClick();
    onSubmitAnswer('تم التخطي بكل ود وتقدير');
  };

  // Determine personalized prompt
  const displayPrompt = (mySlot === 'p1' && scene.p1Prompt) 
    ? scene.p1Prompt 
    : (mySlot === 'p2' && scene.p2Prompt) 
    ? scene.p2Prompt 
    : scene.promptText;

  // Mood backdrop colors
  const moodBackdrops: Record<string, string> = {
    night: 'from-[#30232D]/90 to-[#211A20]',
    library: 'from-[#362726]/90 to-[#211A20]',
    city: 'from-[#2B2338]/90 to-[#211A20]',
    garden: 'from-[#233027]/90 to-[#211A20]',
    sanctum: 'from-[#382626]/90 to-[#211A20]',
  };

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center">
      {/* Chapter & Scene Indicator */}
      <div className="w-full flex items-center justify-between text-xs text-[#C6A27C] mb-3 px-1">
        <span className="font-semibold bg-[#30232D]/80 px-2.5 py-1 rounded-full border border-[#C6A27C]/20">
          الفصل {scene.chapterId} • المشهد {scene.order} من ٥
        </span>
        <span className="text-[#C3ADA8] font-mono text-[11px]">
          {scene.type === 'riddle' ? 'لغز وتحدي' : scene.type === 'asymmetric' ? 'لغز تعاوني' : 'اختيار ومشاعر'}
        </span>
      </div>

      {/* Narrative Card */}
      <div className={`w-full bg-gradient-to-b ${moodBackdrops[scene.backgroundMood] || moodBackdrops.night} rounded-3xl p-5 sm:p-7 border border-[#C6A27C]/30 shadow-2xl relative overflow-hidden mb-6 text-right`}>
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-40 h-20 bg-[#D5AE83]/10 blur-2xl pointer-events-none" />

        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#F6E9D7] mb-1">
            {scene.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#C6A27C] font-serif-ar">
            {scene.subtitle}
          </p>
        </div>

        {/* Narrative Paragraphs */}
        <div className="space-y-3 text-xs sm:text-sm text-[#F6E9D7]/90 leading-relaxed font-serif-ar border-t border-white/5 pt-4">
          {scene.narrativeText.map((paragraph, idx) => (
            <p key={idx} className="transition-all">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Asymmetric Clue Banner (For Chapter 3 Scene 2) */}
      {scene.asymmetric && (
        <div className="w-full bg-[#30232D] border border-[#D5AE83]/50 rounded-2xl p-4 mb-6 text-right shadow-lg">
          <div className="flex items-center gap-2 text-[#D5AE83] font-bold text-xs mb-2">
            <Sparkles size={16} />
            <span>نصف الشفرة الخاص بك (تحدثا معاً واجمعا الرقمين!):</span>
          </div>
          <div className="p-3 bg-[#211A20] rounded-xl border border-white/10 text-sm font-semibold text-[#F6E9D7]">
            {mySlot === 'p1' ? scene.asymmetric.p1Clue : scene.asymmetric.p2Clue}
          </div>
          <p className="text-[11px] text-[#C3ADA8] mt-2">
            شريكك يملك النصف الآخر على شاشته... اخبره بما تراه واطلب منه نصفه!
          </p>
        </div>
      )}

      {/* If current player has already submitted: Show Private Waiting State */}
      {hasMySubmitted ? (
        <div className="w-full bg-[#30232D]/90 rounded-2xl p-6 sm:p-8 border border-[#C6A27C]/30 text-center flex flex-col items-center shadow-xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#211A20] border border-[#C6A27C]/40 flex items-center justify-center mb-4 shadow-inner relative">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <div className="absolute inset-0 rounded-full border-2 border-[#D5AE83]/20 animate-ping pointer-events-none" />
          </div>

          <h2 className="text-lg font-bold text-[#F6E9D7] mb-1 font-heading">
            إجابتك اتحفظت في سرية تامة 🔒
          </h2>

          <div className="my-3 px-4 py-2 rounded-xl bg-[#211A20]/70 border border-white/5 text-xs text-[#D5AE83]">
            <span>إجابتك المسجلة: </span>
            <span className="font-semibold text-[#F6E9D7]">
              {currentAnswer?.p1Answer || currentAnswer?.p2Answer || 'تم التأكيد'}
            </span>
          </div>

          <p className="text-xs text-[#C3ADA8] max-w-sm leading-relaxed mb-4">
            {hasPartnerSubmitted ? (
              <span className="text-emerald-400 font-semibold">
                {partnerName} اختار/ت هو كمان! جاري الكشف المشترك الآن...
              </span>
            ) : (
              <span>
                مستنيين {partnerName} يختار... الإجابات مش هتنكشف لأي حد فيكم غير لما الاتنين يدوسوا تأكيد!
              </span>
            )}
          </p>

          {!hasPartnerSubmitted && (
            <div className="flex items-center gap-2 text-xs text-[#C6A27C] bg-[#211A20] px-3.5 py-1.5 rounded-full border border-white/5">
              <Clock size={13} className="animate-spin" />
              <span>{partnerName} بيفكر ويختار...</span>
            </div>
          )}
        </div>
      ) : (
        /* Action / Question Card */
        <div className="w-full bg-[#30232D]/95 rounded-2xl p-5 sm:p-6 border border-[#C6A27C]/30 text-right shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D5AE83] mb-2">
            <EyeOff size={14} className="text-[#C99BA8]" />
            <span>اختيار سري خاص بك ({myName}):</span>
          </div>

          <h2 className="text-sm sm:text-base font-bold text-[#F6E9D7] mb-4 leading-relaxed font-heading">
            {displayPrompt}
          </h2>

          {/* Hint Trigger if available */}
          {scene.puzzleHint && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  setShowHint(!showHint);
                }}
                className="text-[11px] text-[#C6A27C] hover:text-[#D5AE83] flex items-center gap-1 transition-colors"
              >
                <Lightbulb size={13} />
                <span>{showHint ? 'إخفاء التلميح' : 'هل تحتاجان تلميحاً صغيراً؟'}</span>
              </button>
              {showHint && (
                <div className="mt-2 p-2.5 rounded-xl bg-[#211A20] border border-[#C6A27C]/20 text-xs text-[#D5AE83] animate-fade-in">
                  {scene.puzzleHint}
                </div>
              )}
            </div>
          )}

          {/* ASYMMETRIC OR RIDDLE INPUT */}
          {scene.type === 'asymmetric' ? (
            <div className="space-y-3">
              <input
                type="text"
                value={riddleCode}
                onChange={(e) => setRiddleCode(e.target.value)}
                placeholder="أدخل الكود المكون من ٤ أرقام هنا (مثال: 3721)"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl bg-[#211A20] border border-[#C6A27C]/30 text-center font-mono text-lg text-[#D5AE83] tracking-widest focus:outline-none focus:border-[#D5AE83]"
              />
              <button
                onClick={() => handleChoiceSubmit(riddleCode)}
                disabled={!riddleCode.trim() || isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C6A27C] to-[#D5AE83] text-[#211A20] font-bold text-sm flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                <Lock size={15} />
                <span>تأكيد الشفرة وفتح البوابة</span>
              </button>
            </div>
          ) : scene.type === 'secret_letter' ? (
            /* SECRET LETTER COMPOSER */
            <div className="space-y-3">
              <div className="space-y-2">
                <span className="text-[11px] text-[#C3ADA8] block">اختر رسالة جاهزة أو اكتب بوحك الخاص بالأسفل:</span>
                {scene.options?.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCustomText(opt.label)}
                    className="w-full p-3 rounded-xl bg-[#211A20]/80 hover:bg-[#211A20] border border-white/5 text-xs text-[#F6E9D7] text-right transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={4}
                placeholder="اكتب هنا ما يمليه عليك قلبك لشريكك..."
                className="w-full p-3 rounded-xl bg-[#211A20] border border-[#C6A27C]/30 text-xs sm:text-sm text-[#F6E9D7] focus:outline-none focus:border-[#D5AE83] resize-none"
              />

              <button
                onClick={() => handleLetterSubmit(customText)}
                disabled={!customText.trim() || isSubmitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#C99BA8] via-[#C6A27C] to-[#D5AE83] text-[#211A20] font-bold text-sm flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                <Feather size={16} />
                <span>ختم الرسالة بالشمع الأحمر وإرسالها 💌</span>
              </button>
            </div>
          ) : (
            /* MULTIPLE CHOICE OPTIONS */
            <div className="space-y-2.5">
              {scene.options?.map((opt) => {
                const isSelected = selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOption(opt.id)}
                    className={`w-full p-3.5 sm:p-4 rounded-xl border text-right transition-all flex items-start gap-3 active:scale-[0.99] cursor-pointer ${
                      isSelected
                        ? 'bg-[#211A20] border-[#D5AE83] shadow-[0_0_15px_rgba(213,174,131,0.2)]'
                        : 'bg-[#211A20]/60 hover:bg-[#211A20]/90 border-white/5 text-[#F6E9D7]'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#D5AE83] bg-[#D5AE83]' : 'border-[#C6A27C]/40'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#211A20]" />}
                    </div>
                    <div className="flex-1">
                      <span className={`text-xs sm:text-sm leading-relaxed block ${
                        isSelected ? 'font-bold text-[#F6E9D7]' : 'text-[#F6E9D7]/90'
                      }`}>
                        {opt.label}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Submit Button */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={() => handleChoiceSubmit()}
                  disabled={!selectedOption || isSubmitting}
                  className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#C6A27C] via-[#D5AE83] to-[#C99BA8] text-[#211A20] font-bold text-sm flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer font-heading"
                >
                  <Send size={15} />
                  <span>تأكيد اختياري السري</span>
                </button>

                {/* Optional Skip for Reflection Questions */}
                {scene.isOptional && (
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-transparent hover:bg-white/5 text-xs text-[#C3ADA8] transition-colors"
                  >
                    تخطي هذا السؤال باحترام
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
