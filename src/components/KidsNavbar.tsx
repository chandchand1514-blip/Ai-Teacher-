import React from 'react';
import { Sparkles, Mic, Star, BookOpen, Volume2, Palette, Trophy, Music, HelpCircle, MessageSquare } from 'lucide-react';
import { GradeLevel } from '../types';

interface KidsNavbarProps {
  selectedGrade: GradeLevel;
  onSelectGrade: (grade: GradeLevel) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLiveTeacher: () => void;
  starsCount: number;
  isLiveActive: boolean;
}

export const KidsNavbar: React.FC<KidsNavbarProps> = ({
  selectedGrade,
  onSelectGrade,
  activeTab,
  setActiveTab,
  onOpenLiveTeacher,
  starsCount,
  isLiveActive,
}) => {
  const grades: GradeLevel[] = ['UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

  const navItems = [
    { id: 'alphabet', label: 'ABCD & Phonics', icon: '🔤', desc: 'Alphabet, Hindi & Numbers' },
    { id: 'lessons', label: 'Class Lessons', icon: '📚', desc: 'Math, Science, English, GK' },
    { id: 'quiz', label: 'Quiz & Games', icon: '🎯', desc: 'Earn Stars & Badges' },
    { id: 'ai-tutor', label: 'AI Homework & Stories', icon: '🤖', desc: 'Ask any question + Story' },
    { id: 'rhymes', label: 'Rhymes & Poems', icon: '🎵', desc: 'Sing-along Audio Rhymes' },
    { id: 'drawing', label: 'Drawing & Tracing', icon: '🎨', desc: 'Magic Writing Pad' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-amber-500/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & App Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 text-white shadow-lg shadow-rose-500/25 border-2 border-amber-300">
              <span className="text-2xl sm:text-3xl">🎒</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans'] flex items-center gap-1.5">
                  Kids <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400 bg-clip-text text-transparent">Padhai Hub</span>
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  UKG to 5th
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Bacchon ki Padhai • Voice AI Teacher & Lessons
              </p>
            </div>
          </div>

          {/* Center / Right: Stars Counter + Live Voice Teacher Button */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Stars Score Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-300 shadow-sm animate-pulse">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-mono font-black text-sm">{starsCount}</span>
              <span className="text-[10px] font-bold uppercase hidden sm:inline">Stars</span>
            </div>

            {/* Talk to AI Teacher (Live API) Button */}
            <button
              onClick={onOpenLiveTeacher}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-xl active:scale-95 ${
                isLiveActive
                  ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white animate-bounce border-2 border-rose-300 shadow-rose-500/40'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 border-2 border-emerald-300 shadow-emerald-500/30'
              }`}
            >
              <Mic className="w-4 h-4 text-slate-950 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block font-black">{isLiveActive ? 'Talking Live...' : 'Talk to Teacher'}</span>
                <span className="text-[9px] font-mono opacity-80 block">gemini-3.8-live</span>
              </div>
            </button>
          </div>
        </div>

        {/* Grade Selector Row */}
        <div className="flex items-center justify-between gap-2 py-2 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-amber-400 font-mono whitespace-nowrap mr-1">
              Select Class:
            </span>
            {grades.map((grade) => {
              const isSelected = selectedGrade === grade;
              return (
                <button
                  key={grade}
                  onClick={() => onSelectGrade(grade)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105 border border-amber-200'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <span>{grade === 'UKG' ? '🧸 UKG / Nursery' : `🎒 ${grade}`}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1.5 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800/60">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 text-cyan-300 border-2 border-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
