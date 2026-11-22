import React from 'react';
import { MessageSquare, X, CheckCircle2, Sparkles, Crown } from 'lucide-react';

export interface AdminUserMessage {
  id: string;
  studentName?: string;
  deviceId?: string;
  title: string;
  message: string;
  sender: string;
  timestamp: string;
  isRead: boolean;
  complaintId?: string;
  originalComplaint?: string;
}

interface AdminMessageReceivedModalProps {
  messageItem: AdminUserMessage | null;
  onClose: () => void;
  onAcknowledge: (messageId: string) => void;
}

export const AdminMessageReceivedModal: React.FC<AdminMessageReceivedModalProps> = ({
  messageItem,
  onClose,
  onAcknowledge,
}) => {
  if (!messageItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#0a1b2e] to-[#040d17] border border-amber-400/50 rounded-3xl p-5 sm:p-6 shadow-[0_0_60px_rgba(251,191,36,0.25)] text-slate-100 flex flex-col gap-4 overflow-hidden">
        {/* Ambient Corner Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/15 blur-2xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/15 blur-2xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30 shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white tracking-wide flex items-center gap-1.5">
                <span>{messageItem.title || 'Chand Admin Ka Jawab'}</span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-amber-300 font-mono">
                From: {messageItem.sender || 'Chand Admin 👑'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Original Complaint (If Reply) */}
        {messageItem.originalComplaint && (
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Aapki Complaint / Message:
            </span>
            <p className="text-xs text-slate-300 italic font-mono">
              "{messageItem.originalComplaint}"
            </p>
          </div>
        )}

        {/* Admin Reply Body */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900/90 border border-amber-400/40 space-y-2 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Chand Admin Ka Jawab:</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {new Date(messageItem.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <p className="text-sm font-semibold text-white leading-relaxed whitespace-pre-wrap">
            {messageItem.message}
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => {
            onAcknowledge(messageItem.id);
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Shukriya Chand Admin! Samajh Gaya ✅</span>
        </button>
      </div>
    </div>
  );
};
