import React from 'react';
import { X, Award, Sparkles, Search, Compass, HeartHandshake, Key, Crown, Lock } from 'lucide-react';
import { INITIAL_ACHIEVEMENTS } from '../data/gameAssets';
import { SafeRoomState } from '../types/game';
import { soundManager } from '../services/audio';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomState: SafeRoomState | null;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  roomState,
}) => {
  if (!isOpen) return null;

  const unlockedMap = new Set(roomState?.achievements.map(a => a.id) || []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles size={20} className="text-[#D5AE83]" />;
      case 'Search': return <Search size={20} className="text-[#C99BA8]" />;
      case 'Compass': return <Compass size={20} className="text-[#C6A27C]" />;
      case 'HeartHandshake': return <HeartHandshake size={20} className="text-[#C99BA8]" />;
      case 'Key': return <Key size={20} className="text-[#D5AE83]" />;
      case 'Crown': return <Crown size={20} className="text-[#D5AE83]" />;
      default: return <Award size={20} className="text-[#D5AE83]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md max-h-[85vh] bg-[#30232D] border border-[#C6A27C]/30 rounded-2xl p-5 shadow-2xl flex flex-col text-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#C6A27C]/20 mb-4">
          <div className="flex items-center gap-2 text-[#D5AE83]">
            <Award size={20} />
            <h2 className="text-base font-bold font-heading">سجل الأوسمة والإنجازات</h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-[#211A20]/60 hover:bg-[#211A20] text-[#C3ADA8] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-[#C3ADA8] mb-4 leading-relaxed">
          أوسمة شرف تخلد المحطات المميزة والقرارات المشتركة لبسنت وعمرو.
        </p>

        {/* Badges List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {INITIAL_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = unlockedMap.has(ach.id);

            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-[#211A20] border-[#D5AE83]/40 shadow-[0_0_15px_rgba(213,174,131,0.15)]'
                    : 'bg-[#211A20]/30 border-white/5 opacity-50'
                }`}
              >
                <div className={`p-2.5 rounded-xl border shrink-0 flex items-center justify-center ${
                  isUnlocked ? 'bg-[#30232D] border-[#D5AE83]/40' : 'bg-[#211A20] border-white/5'
                }`}>
                  {isUnlocked ? getIcon(ach.iconName) : <Lock size={20} className="text-[#C3ADA8]/40" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className={`text-xs sm:text-sm font-bold ${
                      isUnlocked ? 'text-[#F6E9D7]' : 'text-[#C3ADA8]'
                    }`}>
                      {ach.title}
                    </h3>
                    {isUnlocked && (
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        مكتسب 🌟
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#C3ADA8] leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#C6A27C]/20 mt-3 text-center">
          <span className="text-xs text-[#D5AE83]">
            تم إحراز: {unlockedMap.size} من ٦ أوسمة
          </span>
        </div>
      </div>
    </div>
  );
};
