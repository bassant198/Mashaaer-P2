import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Briefcase, 
  Award, 
  BookHeart, 
  MapPin, 
  Copy, 
  Check, 
  Users, 
  Home
} from 'lucide-react';
import { SafeRoomState } from '../types/game';
import { soundManager } from '../services/audio';

interface HeaderProps {
  roomState: SafeRoomState | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenInventory: () => void;
  onOpenAchievements: () => void;
  onOpenMemoryBox: () => void;
  onOpenMap: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  roomState,
  soundEnabled,
  onToggleSound,
  onOpenInventory,
  onOpenAchievements,
  onOpenMemoryBox,
  onOpenMap,
  onGoHome,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyRoomCode = () => {
    if (!roomState) return;
    navigator.clipboard.writeText(roomState.roomCode);
    setCopied(true);
    soundManager.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  const inventoryCount = roomState?.inventory.length || 0;
  const achievementsCount = roomState?.achievements.length || 0;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#211A20]/85 border-b border-[#C6A27C]/20 px-3 py-2.5 transition-all">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Title */}
        <div className="flex items-center gap-2">
          <button
            onClick={onGoHome}
            aria-label="الرئيسية"
            className="flex items-center gap-1.5 text-right hover:opacity-90 active:scale-95 transition-transform"
          >
            <span className="text-xl font-bold bg-gradient-to-l from-[#D5AE83] via-[#C99BA8] to-[#F6E9D7] bg-clip-text text-transparent font-heading">
              ♡ مشاعر
            </span>
            <span className="hidden sm:inline text-xs text-[#C6A27C] font-serif-ar border-r border-[#C6A27C]/30 pr-2 mr-1">
              سرّ الحكاية
            </span>
          </button>
        </div>

        {/* Room Info & Status (Only when in active room) */}
        {roomState && (
          <div className="flex items-center gap-2 bg-[#30232D]/90 px-2.5 py-1 rounded-full border border-[#C6A27C]/25 text-xs">
            <button
              onClick={copyRoomCode}
              title="نسخ كود الغرفة"
              className="flex items-center gap-1 font-mono text-[#D5AE83] font-bold hover:text-white transition-colors"
            >
              <span>{roomState.roomCode}</span>
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            </button>

            <span className="text-[#C6A27C]/40">|</span>

            {/* Partner Connection Indicator */}
            <div className="flex items-center gap-1 text-[11px] text-[#C3ADA8]">
              <Users size={12} className={roomState.partnerConnected ? 'text-emerald-400' : 'text-amber-400'} />
              <span className="hidden xs:inline">
                {roomState.partnerName ? (
                  roomState.partnerConnected ? `${roomState.partnerName} متصل` : `${roomState.partnerName} غائب`
                ) : (
                  'مستنيين الشريك'
                )}
              </span>
            </div>
          </div>
        )}

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {roomState && (
            <>
              {/* Map Button */}
              <button
                onClick={onOpenMap}
                title="خريطة الفصول"
                aria-label="خريطة الفصول"
                className="p-1.5 sm:p-2 rounded-lg bg-[#30232D]/60 hover:bg-[#30232D] text-[#C6A27C] border border-[#C6A27C]/20 transition-all active:scale-90"
              >
                <MapPin size={17} />
              </button>

              {/* Inventory Button */}
              <button
                onClick={onOpenInventory}
                title="صندوق الأسرار"
                aria-label="صندوق الأسرار"
                className="relative p-1.5 sm:p-2 rounded-lg bg-[#30232D]/60 hover:bg-[#30232D] text-[#C6A27C] border border-[#C6A27C]/20 transition-all active:scale-90"
              >
                <Briefcase size={17} />
                {inventoryCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C99BA8] text-[#211A20] font-bold text-[10px] rounded-full flex items-center justify-center">
                    {inventoryCount}
                  </span>
                )}
              </button>

              {/* Achievements Button */}
              <button
                onClick={onOpenAchievements}
                title="الأوسمة والإنجازات"
                aria-label="الأوسمة والإنجازات"
                className="relative p-1.5 sm:p-2 rounded-lg bg-[#30232D]/60 hover:bg-[#30232D] text-[#D5AE83] border border-[#C6A27C]/20 transition-all active:scale-90"
              >
                <Award size={17} />
                {achievementsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D5AE83] text-[#211A20] font-bold text-[10px] rounded-full flex items-center justify-center">
                    {achievementsCount}
                  </span>
                )}
              </button>

              {/* Memory Box Button */}
              <button
                onClick={onOpenMemoryBox}
                title="صندوق الذكريات"
                aria-label="صندوق الذكريات"
                className="p-1.5 sm:p-2 rounded-lg bg-[#30232D]/60 hover:bg-[#30232D] text-[#C99BA8] border border-[#C6A27C]/20 transition-all active:scale-90"
              >
                <BookHeart size={17} />
              </button>
            </>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل النغمات'}
            aria-label={soundEnabled ? 'كتم الصوت' : 'تشغيل النغمات'}
            className={`p-1.5 sm:p-2 rounded-lg border transition-all active:scale-90 ${
              soundEnabled
                ? 'bg-[#C6A27C]/20 text-[#D5AE83] border-[#C6A27C]/40'
                : 'bg-[#30232D]/40 text-[#C3ADA8]/60 border-white/5'
            }`}
          >
            {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
};
