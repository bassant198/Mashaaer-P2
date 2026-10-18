import React from 'react';
import { X, Check, Lock, Sparkles, MapPin } from 'lucide-react';
import { CHAPTERS_DATA } from '../data/gameAssets';
import { SafeRoomState } from '../types/game';
import { soundManager } from '../services/audio';

interface ChapterMapViewProps {
  isOpen: boolean;
  onClose: () => void;
  roomState: SafeRoomState | null;
}

export const ChapterMapView: React.FC<ChapterMapViewProps> = ({
  isOpen,
  onClose,
  roomState,
}) => {
  if (!isOpen) return null;

  const currentChapterId = roomState?.currentChapterId || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md max-h-[85vh] bg-[#30232D] border border-[#C6A27C]/30 rounded-2xl p-5 shadow-2xl flex flex-col text-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#C6A27C]/20 mb-4">
          <div className="flex items-center gap-2 text-[#D5AE83]">
            <MapPin size={20} />
            <h2 className="text-base font-bold font-heading">خريطة الحكاية</h2>
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

        {/* Total Points & Progress Stats */}
        <div className="flex items-center justify-around bg-[#211A20]/80 p-3 rounded-xl border border-white/5 mb-4 text-xs">
          <div className="text-center">
            <span className="text-[#C6A27C] block text-[10px]">نقاط المشاعر:</span>
            <span className="text-base font-bold text-[#D5AE83] font-mono">{roomState?.points || 0}</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="text-center">
            <span className="text-[#C6A27C] block text-[10px]">القطع المكتشفة:</span>
            <span className="text-base font-bold text-[#C99BA8] font-mono">{roomState?.inventory.length || 0} / 6</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="text-center">
            <span className="text-[#C6A27C] block text-[10px]">الأوسمة:</span>
            <span className="text-base font-bold text-[#F6E9D7] font-mono">{roomState?.achievements.length || 0} / 6</span>
          </div>
        </div>

        {/* Chapters Path List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {CHAPTERS_DATA.map((ch) => {
            const isCompleted = ch.id < currentChapterId;
            const isCurrent = ch.id === currentChapterId;
            const isLocked = ch.id > currentChapterId;

            return (
              <div
                key={ch.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-[#211A20] border-[#D5AE83] shadow-[0_0_15px_rgba(213,174,131,0.2)]'
                    : isCompleted
                    ? 'bg-[#211A20]/60 border-emerald-500/30'
                    : 'bg-[#211A20]/30 border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : isCurrent 
                        ? 'bg-[#D5AE83] text-[#211A20]' 
                        : 'bg-[#30232D] text-[#C3ADA8]'
                    }`}>
                      {isCompleted ? <Check size={14} /> : isLocked ? <Lock size={12} /> : ch.id}
                    </span>
                    <span className="text-xs text-[#C6A27C] font-semibold">{ch.numberArabic}</span>
                  </div>

                  {isCurrent && (
                    <span className="text-[10px] bg-[#D5AE83]/20 text-[#D5AE83] px-2 py-0.5 rounded-full border border-[#D5AE83]/30 flex items-center gap-1">
                      <Sparkles size={10} />
                      <span>المحطة الحالية</span>
                    </span>
                  )}
                  {isCompleted && (
                    <span className="text-[10px] text-emerald-400">مكتمل بنجاح</span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-[#F6E9D7] mt-1">{ch.title}</h3>
                <p className="text-[11px] text-[#C3ADA8] mt-0.5 leading-relaxed">{ch.subtitle}</p>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#C6A27C]/20 mt-3 text-center">
          <p className="text-[11px] text-[#C3ADA8]">
            كل فصل يفتح أبواباً جديدة وأسراراً تُضاف لصندوقكما الخاص.
          </p>
        </div>
      </div>
    </div>
  );
};
