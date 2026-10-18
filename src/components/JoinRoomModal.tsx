import React, { useState } from 'react';
import { X, KeyRound, User, ArrowLeft, Loader2 } from 'lucide-react';
import { soundManager } from '../services/audio';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomCode: string, name: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  initialCode?: string;
}

export const JoinRoomModal: React.FC<JoinRoomModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  isLoading,
  error,
  initialCode = '',
}) => {
  const [name, setName] = useState('عمرو');
  const [code, setCode] = useState(initialCode);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;
    soundManager.playClick();
    onJoin(code.trim().toUpperCase(), name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#30232D] border border-[#C6A27C]/30 rounded-2xl p-6 shadow-2xl text-right">
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 left-4 p-1.5 rounded-full bg-[#211A20]/60 hover:bg-[#211A20] text-[#C3ADA8] transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#D5AE83]">
          <KeyRound size={20} />
          <h2 className="text-lg font-bold font-heading">الانضمام للحكاية</h2>
        </div>
        <p className="text-xs text-[#C3ADA8] mb-5 leading-relaxed">
          اكتب كود الغرفة اللي وصلك من بسنت علشان تنضم للحكاية وتلعبوا سوا.
        </p>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F6E9D7] mb-1.5 flex items-center gap-1.5">
              <KeyRound size={14} className="text-[#C6A27C]" />
              <span>كود الغرفة المشترك:</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="مثال: QAMAR42"
              maxLength={12}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#211A20] border border-[#C6A27C]/25 text-[#D5AE83] font-mono text-center text-lg tracking-widest focus:outline-none focus:border-[#D5AE83] transition-colors uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F6E9D7] mb-1.5 flex items-center gap-1.5">
              <User size={14} className="text-[#C6A27C]" />
              <span>اسمك في الحكاية (اللاعب الثاني):</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: عمرو"
              maxLength={20}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#211A20] border border-[#C6A27C]/25 text-[#F6E9D7] text-sm focus:outline-none focus:border-[#D5AE83] transition-colors text-right"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !code.trim() || !name.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C6A27C] via-[#D5AE83] to-[#C99BA8] text-[#211A20] font-bold text-sm flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>جاري الاتصال بالغرفة...</span>
                </>
              ) : (
                <>
                  <span>دخول الغرفة وبدء المغامرة</span>
                  <ArrowLeft size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
