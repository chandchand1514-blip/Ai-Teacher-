import React, { useState } from 'react';
import {
  Award,
  Trophy,
  Sparkles,
  Star,
  X,
  CheckCircle2,
  Lock,
  ShieldCheck,
  Flame,
  Target
} from 'lucide-react';
import { StudentBadge } from '../utils/badgeManager';

interface StudentBadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: StudentBadge[];
  studentName: string;
  grade: string;
  onSelectBadge?: (badge: StudentBadge) => void;
}

export const StudentBadgesModal: React.FC<StudentBadgesModalProps> = ({
  isOpen,
  onClose,
  badges,
  studentName,
  grade,
}) => {
  const [selectedBadge, setSelectedBadge] = useState<StudentBadge | null>(null);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  if (!isOpen) return null;

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;
  const totalCount = badges.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredBadges = badges.filter((b) => {
    if (filter === 'unlocked') return b.isUnlocked;
    if (filter === 'locked') return !b.isUnlocked;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0b1b30] via-[#071324] to-[#030914] border border-cyan-500/40 rounded-3xl p-5 sm:p-7 shadow-[0_0_80px_rgba(6,182,212,0.35)] text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-hidden">
        {/* Ambient Corner Glows */}
        <div className="absolute top-0 right-0 w-52 h-52 bg-amber-500/15 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-52 h-52 bg-cyan-500/15 blur-3xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-cyan-500/25 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/30 to-yellow-400/20 border border-amber-400/60 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.35)]">
              <Trophy className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white tracking-wide">
                  Milestones & Badges
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-[10px] font-mono font-bold text-cyan-300 shadow-sm">
                  {unlockedCount} / {totalCount} Earned
                </span>
              </div>
              <p className="text-[11px] text-cyan-300/80 font-mono mt-0.5">
                {studentName ? `${studentName} • ${grade}` : 'Student Achievements'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-slate-700/80 shadow-sm"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Summary Card */}
        <div className="relative p-4 rounded-2xl bg-[#091e36]/90 border border-cyan-500/35 shadow-inner flex flex-col gap-2.5 z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-cyan-200 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Overall Achievement Level</span>
            </span>
            <span className="font-mono text-amber-300 font-extrabold tracking-wider">{completionPercent}% COMPLETE</span>
          </div>

          <div className="w-full bg-slate-900/90 h-2.5 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-[0_0_14px_rgba(251,191,36,0.85)]"
              style={{ width: `${Math.max(completionPercent, 8)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300 font-medium pt-0.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{unlockedCount === totalCount ? 'Legendary Scholar Status' : 'Active Scholar Progress'}</span>
            </span>
            <span className="text-cyan-300 font-mono text-[10px]">
              {unlockedCount === 0 ? 'Complete lessons to unlock badges!' : `${totalCount - unlockedCount} milestones remaining`}
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 z-10">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-cyan-500/25 border border-cyan-400/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Badges ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              filter === 'unlocked'
                ? 'bg-emerald-500/25 border border-emerald-400/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              filter === 'locked'
                ? 'bg-amber-500/25 border border-amber-400/60 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Locked ({totalCount - unlockedCount})
          </button>
        </div>

        {/* Badges Grid (Scrollable) */}
        <div className="overflow-y-auto pr-1 space-y-2.5 max-h-[44vh] z-10">
          {filteredBadges.map((badge) => {
            const isSelected = selectedBadge?.id === badge.id;
            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(isSelected ? null : badge)}
                className={`relative p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3.5 ${
                  badge.isUnlocked
                    ? `bg-[#09223c]/80 ${badge.borderClass} ${badge.glowClass} hover:scale-[1.01] shadow-lg`
                    : 'bg-[#050f1a]/70 border-slate-800/80 hover:border-slate-700 opacity-80'
                }`}
              >
                {/* Left: Icon & Title */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl relative shadow-lg ${
                      badge.isUnlocked
                        ? `bg-gradient-to-br ${badge.colorGradient} shadow-[0_0_20px_rgba(255,255,255,0.3)]`
                        : 'bg-slate-800/90 border border-slate-700 text-slate-500'
                    }`}
                  >
                    <span>{badge.icon}</span>
                    {badge.isUnlocked ? (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-slate-900 flex items-center justify-center shadow">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </span>
                    ) : (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-700 border border-slate-900 flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-slate-300" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-xs sm:text-sm font-extrabold tracking-wide truncate ${
                          badge.isUnlocked ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {badge.title}
                      </span>
                      {badge.isUnlocked && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/20 border border-amber-400/40 text-[9px] font-mono text-amber-300 font-bold tracking-wider">
                          UNLOCKED
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] text-cyan-300/90 font-medium truncate mt-0.5">
                      {badge.hindiTitle}
                    </span>

                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Right: Progress or Status Badge */}
                <div className="shrink-0 flex flex-col items-end gap-1">
                  {badge.isUnlocked ? (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold shadow-[0_0_14px_rgba(16,185,129,0.35)]">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span>Earned</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-1.5 min-w-[75px]">
                      <span className="text-[10px] font-mono text-slate-400">
                        {badge.progress} / {badge.target}
                      </span>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-700/80">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-sky-500 h-full rounded-full"
                          style={{ width: `${Math.min(100, (badge.progress / badge.target) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Badge Detailed Motivational Insight */}
        {selectedBadge && (
          <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-400/50 text-xs text-cyan-100 animate-in fade-in flex items-center gap-3 z-10 shadow-lg">
            <span className="text-2xl shrink-0">{selectedBadge.icon}</span>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-white block truncate text-xs sm:text-sm">{selectedBadge.title}</span>
              <span className="text-[11px] text-cyan-300/90 font-medium block mt-0.5">{selectedBadge.motivationalNote}</span>
            </div>
          </div>
        )}

        {/* Footer Close Button */}
        <div className="pt-2.5 border-t border-cyan-500/25 flex justify-end z-10">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs tracking-wider uppercase shadow-[0_4px_22px_rgba(14,165,233,0.4)] cursor-pointer active:scale-95 transition-all"
          >
            Shaabash! Padhai Jari Rakhein 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
