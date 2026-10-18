import React from 'react';
import { X, Briefcase, Key, Scroll, Moon, Map, Feather, ShieldCheck, Lock } from 'lucide-react';
import { INITIAL_INVENTORY_ITEMS } from '../data/gameAssets';
import { SafeRoomState } from '../types/game';
import { soundManager } from '../services/audio';

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomState: SafeRoomState | null;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  roomState,
}) => {
  if (!isOpen) return null;

  const discoveredMap = new Set(roomState?.inventory.map(i => i.id) || []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Key': return <Key size={20} className="text-[#D5AE83]" />;
      case 'Scroll': return <Scroll size={20} className="text-[#C99BA8]" />;
      case 'Moon': return <Moon size={20} className="text-[#D5AE83]" />;
      case 'Map': return <Map size={20} className="text-[#C6A27C]" />;
      case 'Feather': return <Feather size={20} className="text-[#C99BA8]" />;
      case 'ShieldCheck': return <ShieldCheck size={20} className="text-[#D5AE83]" />;
      default: return <Key size={20} className="text-[#D5AE83]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md max-h-[85vh] bg-[#30232D] border border-[#C6A27C]/30 rounded-2xl p-5 shadow-2xl flex flex-col text-right overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#C6A27C]/20 mb-4">
          <div className="flex items-center gap-2 text-[#D5AE83]">
            <Briefcase size={20} />
            <h2 className="text-base font-bold font-heading">صندوق الأسرار والقطع المكتشفة</h2>
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
          الأدوات والشظايا التي تجمعها أنت وبسنت عبر الفصول الخمسة لحل اللغز النهائي.
        </p>

        {/* Relics Grid */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {INITIAL_INVENTORY_ITEMS.map((item) => {
            const isUnlocked = discoveredMap.has(item.id);

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-[#211A20] border-[#C6A27C]/40 shadow-sm'
                    : 'bg-[#211A20]/30 border-white/5 opacity-50'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-[#30232D] border border-white/5 shrink-0 flex items-center justify-center">
                  {isUnlocked ? getIcon(item.iconName) : <Lock size={20} className="text-[#C3ADA8]/40" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h3 className={`text-xs sm:text-sm font-bold ${
                      isUnlocked ? 'text-[#F6E9D7]' : 'text-[#C3ADA8]'
                    }`}>
                      {isUnlocked ? item.title : 'أثر مجهول لم يُكتشف بعد'}
                    </h3>
                    <span className="text-[10px] text-[#C6A27C]">الفصل {item.chapter}</span>
                  </div>
                  <p className="text-[11px] text-[#C3ADA8] leading-relaxed">
                    {isUnlocked ? item.description : 'يتطلب فتح مشاهد متقدمة في الحكاية للعثور عليه.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#C6A27C]/20 mt-3 text-center">
          <span className="text-xs text-[#D5AE83]">
            المكتشف: {discoveredMap.size} من ٦ قطع أثرية
          </span>
        </div>
      </div>
    </div>
  );
};
