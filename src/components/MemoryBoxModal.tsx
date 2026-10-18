import React from 'react';
import { X, BookHeart, Mail, Heart, Sparkles, Calendar } from 'lucide-react';
import { SafeRoomState } from '../types/game';
import { STORY_SCENES } from '../data/storyData';
import { soundManager } from '../services/audio';

interface MemoryBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomState: SafeRoomState | null;
}

export const MemoryBoxModal: React.FC<MemoryBoxModalProps> = ({
  isOpen,
  onClose,
  roomState,
}) => {
  if (!isOpen) return null;

  const messages = roomState?.messages || [];
  const answers = roomState?.answers || {};
  const p1Name = roomState?.players.p1?.name || 'بسنت';
  const p2Name = roomState?.players.p2?.name || 'عمرو';

  // Filter revealed scenes with reactions
  const revealedScenes = Object.values(answers).filter(a => a.status === 'revealed');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[85vh] bg-[#30232D] border border-[#C6A27C]/30 rounded-2xl p-5 shadow-2xl flex flex-col text-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#C6A27C]/20 mb-4">
          <div className="flex items-center gap-2 text-[#C99BA8]">
            <BookHeart size={20} />
            <h2 className="text-base font-bold font-heading">صندوق الذكريات ورسائل بيننا</h2>
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

        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {/* SECTION: رسائل بيننا */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#D5AE83]">
              <Mail size={15} />
              <span>رسائل بيننا (البوح السري المشترك)</span>
            </div>

            {messages.length === 0 ? (
              <div className="p-4 bg-[#211A20]/60 rounded-xl border border-white/5 text-center text-xs text-[#C3ADA8]">
                <span>لم تُكتب الرسائل بعد... ستظهر هنا بعد الانتهاء من الفصل الرابع! 💌</span>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div 
                    key={msg.id || i}
                    className="p-4 bg-[#211A20] rounded-xl border border-[#C99BA8]/30 shadow relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#C99BA8] flex items-center gap-1.5">
                        <Heart size={13} className="fill-[#C99BA8]" />
                        <span>رسالة من {msg.senderName}:</span>
                      </span>
                      <span className="text-[10px] text-[#C3ADA8]/60 font-mono">
                        {new Date(msg.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#F6E9D7] leading-relaxed font-serif-ar whitespace-pre-wrap">
                      "{msg.content}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION: سجل المحطات والقرارات المكتملة */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#D5AE83]">
              <Sparkles size={15} />
              <span>المشاهد والقرارات المحفوظة ({revealedScenes.length} محطة)</span>
            </div>

            {revealedScenes.length === 0 ? (
              <div className="p-4 bg-[#211A20]/60 rounded-xl border border-white/5 text-center text-xs text-[#C3ADA8]">
                <span>ابدآ اللعب لتسجيل أولى اللحظات والقرارات في الحكاية.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {revealedScenes.map((ans) => {
                  const scene = STORY_SCENES[ans.sceneId];
                  if (!scene) return null;

                  return (
                    <div 
                      key={ans.sceneId}
                      className="p-3 bg-[#211A20]/80 rounded-xl border border-white/5 text-xs text-right"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#F6E9D7]">{scene.title}</span>
                        <span className="text-[10px] text-[#C6A27C]">الفصل {scene.chapterId}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 my-2 text-[11px] bg-[#30232D]/40 p-2 rounded-lg">
                        <div>
                          <span className="text-[#C99BA8] block font-semibold">{p1Name}:</span>
                          <span className="text-[#F6E9D7] truncate block">{ans.p1Answer}</span>
                        </div>
                        <div>
                          <span className="text-[#D5AE83] block font-semibold">{p2Name}:</span>
                          <span className="text-[#F6E9D7] truncate block">{ans.p2Answer}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#C3ADA8] font-serif-ar leading-relaxed">
                        {ans.narrativeReaction || scene.revealDialogue.general}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-[#C6A27C]/20 mt-3 text-center">
          <p className="text-[11px] text-[#C3ADA8]">
            صندوق الذكريات محفوظ بأمان ويمكنكما مراجعته في أي وقت ومن أي جهاز.
          </p>
        </div>
      </div>
    </div>
  );
};
