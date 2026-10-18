import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Heart, 
  Award, 
  RotateCcw, 
  Share2, 
  BookHeart,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import { SafeRoomState } from '../types/game';
import { soundManager } from '../services/audio';

interface EndingScreenProps {
  roomState: SafeRoomState;
  onResetGame: () => Promise<void>;
  onOpenMemoryBox: () => void;
}

export const EndingScreen: React.FC<EndingScreenProps> = ({
  roomState,
  onResetGame,
  onOpenMemoryBox,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const endingType = roomState.endingType || 'heart_mind';
  const p1Name = roomState.players.p1?.name || 'بسنت';
  const p2Name = roomState.players.p2?.name || 'عمرو';

  const endingDetails = {
    adventurers: {
      title: 'حكاية المغامرين الشجعان',
      subtitle: 'روحان لا تخشيان المجهول، وتبحثان عن الدهشة في كل أفق',
      themeColor: '#D5AE83',
      text: [
        `في هذه المغامرة، أثبتت بسنت وعمرو أن حكايتهما لا تعرف الروتين أو الجمود. كل خطوة كانت بدافع الشغف والفضول لاكتشاف الجديد، والتعاون الصادق لتخطي كل لغز.`,
        `سيمر الوقت، وستبقى تلك النظرة الجريئة التي يملأها الأمل هي البوصلة الحقيقية لكل درب تخوضانه سوياً.`,
        `"الرحلة التي تبدأ بالشغف وتستمر بالثقة، لا تصل إلى نهاية... بل تفتح كل يوم فصلاً أبهى."`,
      ],
    },
    heart_mind: {
      title: 'حكاية القلب والعقل المتناغمين',
      subtitle: 'حكمة تسند المحبة، ومودة تصنع وطناً دافئاً لا يميل',
      themeColor: '#C99BA8',
      text: [
        `اختيارات بسنت وعمرو عكست توازناً نادراً بين دفء المشاعر ورجاحة القرارات. كل واحد كان الأمان والسكينة للطرف الآخر في لحظات الحيرة والتأمل.`,
        `البيوت الحقيقية لا تُبنى بالجدران فقط، بل بلحظات التفاهم الهادئة، والتسامح الذي يغلب العتاب، والحرص المشترك على راحة البال.`,
        `"عندما يلتقي قلب صادق مع عقل حكيم، تولد حكاية تطمئن لها الروح للأبد."`,
      ],
    },
    little_secrets: {
      title: 'حكاية الأسرار الصغيرة والونس',
      subtitle: 'تفاصيل دقيقة، ضحكات خاصة، وعهد يحفظه القلب في صمت وجمال',
      themeColor: '#C6A27C',
      text: [
        `في أدق المواقف وأبسط الهمسات، ظهرت القوة الحقيقية لرابط بسنت وعمرو. حكاية مبنية على التفاصيل التي لا يلاحظها الغرباء: ضحكة خافتة، فنجان قهوة مشترك، ووعد محفور بالوفاء.`,
        `الأسرار الصغيرة بين الحبيبين هي النور الذي يضيء أطول الليالي ويجعل للأيام العادية طعماً استثنائياً.`,
        `"أعظم الحكايات هي تلك التي تُكتب في الزوايا الهادئة، وتزهر وداً وأماناً في كل صباح."`,
      ],
    },
  }[endingType];

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center text-center animate-fade-in">
      {/* Crown & Certificate Header */}
      <div className="relative mb-4 flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#30232D] to-[#9B7A88]/50 border border-[#D5AE83]/40 flex items-center justify-center shadow-[0_0_35px_rgba(213,174,131,0.35)] animate-soft-pulse">
          <Crown className="w-10 h-10 text-[#D5AE83]" />
        </div>
        <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-[#C99BA8] animate-twinkle" />
      </div>

      <div className="space-y-1 mb-6">
        <span className="text-xs text-[#D5AE83] font-bold tracking-widest uppercase block">
          وثيقة التتويج الأبدي • سرّ الحكاية
        </span>
        <h1 className="text-2xl sm:text-4xl font-black font-heading bg-gradient-to-r from-[#D5AE83] via-[#F6E9D7] to-[#C99BA8] bg-clip-text text-transparent">
          {endingDetails.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#C6A27C] font-serif-ar">
          {endingDetails.subtitle}
        </p>
      </div>

      {/* Main Ending Parchment Box */}
      <div className="w-full bg-[#30232D]/95 rounded-3xl p-6 sm:p-8 border border-[#C6A27C]/35 shadow-2xl relative overflow-hidden mb-6 text-right font-serif-ar leading-relaxed">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D5AE83]/15 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-4 text-xs text-[#D5AE83]">
          <span className="font-bold">مُهداة بكل حب إلى:</span>
          <span className="font-heading font-bold text-sm text-[#F6E9D7]">{p1Name} & {p2Name}</span>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-[#F6E9D7]/90 leading-relaxed">
          {endingDetails.text.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Stats Summary Badge */}
        <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 bg-[#211A20] rounded-xl border border-white/5">
            <span className="text-[10px] text-[#C6A27C] block">النقاط الإجمالية</span>
            <span className="text-sm font-bold text-[#D5AE83] font-mono">{roomState.points}</span>
          </div>
          <div className="p-2 bg-[#211A20] rounded-xl border border-white/5">
            <span className="text-[10px] text-[#C6A27C] block">القطع المكتشفة</span>
            <span className="text-sm font-bold text-[#C99BA8] font-mono">{roomState.inventory.length} / 6</span>
          </div>
          <div className="p-2 bg-[#211A20] rounded-xl border border-white/5">
            <span className="text-[10px] text-[#C6A27C] block">الأوسمة الفخرية</span>
            <span className="text-sm font-bold text-[#F6E9D7] font-mono">{roomState.achievements.length} / 6</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenMemoryBox();
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#C6A27C] via-[#D5AE83] to-[#C99BA8] text-[#211A20] font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(213,174,131,0.3)] hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer font-heading"
        >
          <BookHeart size={18} />
          <span>فتح صندوق الذكريات ورسائل بيننا 📜</span>
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setShowConfirmReset(true);
          }}
          className="w-full py-3 px-6 rounded-xl bg-[#30232D]/80 hover:bg-[#30232D] text-[#C3ADA8] border border-white/5 text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <RotateCcw size={15} />
          <span>إعادة خوض المغامرة واستكشاف مسارات أخرى</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-right">
          <div className="bg-[#30232D] border border-[#C6A27C]/30 rounded-2xl p-5 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-[#F6E9D7] mb-2 font-heading">
              هل تريدان إعادة بدء المغامرة؟
            </h3>
            <p className="text-xs text-[#C3ADA8] mb-5 leading-relaxed">
              سيتم إعادة تعيين المشاهد إلى الفصل الأول ليخوض كلاكما مسارات واختيارات جديدة معاً.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  setIsResetting(true);
                  await onResetGame();
                  setIsResetting(false);
                  setShowConfirmReset(false);
                }}
                disabled={isResetting}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#C6A27C] to-[#D5AE83] text-[#211A20] font-bold text-xs transition-opacity hover:opacity-95"
              >
                {isResetting ? 'جاري البدء...' : 'نعم، أعد المغامرة'}
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#211A20] border border-white/5 text-xs text-[#C3ADA8] hover:bg-[#211A20]/80"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
