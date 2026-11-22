import React, { useState } from 'react';
import { Music, Play, Volume2, Sparkles, Star, Heart } from 'lucide-react';
import { RHYMES_LIST } from '../data/curriculum';
import { Rhyme } from '../types';

interface RhymesAudioStudioProps {
  onSpeakText: (text: string, voice?: string) => void;
  onAddStar: () => void;
}

export const RhymesAudioStudio: React.FC<RhymesAudioStudioProps> = ({
  onSpeakText,
  onAddStar,
}) => {
  const [selectedRhymeId, setSelectedRhymeId] = useState<string>(RHYMES_LIST[0].id);

  const activeRhyme = RHYMES_LIST.find((r) => r.id === selectedRhymeId) || RHYMES_LIST[0];

  const handleSingRhyme = (rhyme: Rhyme) => {
    const fullLyrics = `Let's sing ${rhyme.title}! <breath> ${rhyme.lyrics.join('. ')}. Shabash! Great singing!`;
    const voiceToUse = 'Kore';
    onSpeakText(fullLyrics, voiceToUse);
    onAddStar();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-pink-950 via-slate-900 to-rose-950/80 border-2 border-pink-500/40 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-pink-400 text-slate-950 font-black text-2xl shadow-lg shadow-pink-400/30">
              🎵
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                Sing-Along Rhymes & Hindi Kavita
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Classic nursery rhymes and poems with cheerful voice recitation powered by Gemini 3.8 Flash TTS!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rhyme Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-900 rounded-2xl border border-slate-800 scrollbar-none">
        {RHYMES_LIST.map((rhyme) => (
          <button
            key={rhyme.id}
            onClick={() => setSelectedRhymeId(rhyme.id)}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedRhymeId === rhyme.id
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/30 scale-105'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <span className="text-base">{rhyme.emoji}</span>
            <span>{rhyme.title}</span>
          </button>
        ))}
      </div>

      {/* Active Rhyme Display Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-pink-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-center max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-2">
          <span className="text-5xl sm:text-6xl animate-bounce">{activeRhyme.emoji}</span>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-['Plus_Jakarta_Sans']">
            {activeRhyme.title}
          </h3>
          <span className="text-xs font-bold font-mono px-3 py-1 rounded-full bg-pink-950 text-pink-300 border border-pink-800">
            {activeRhyme.language} Rhyme
          </span>
        </div>

        {/* Lyrics Box */}
        <div className="bg-slate-950/70 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-3 font-medium text-slate-100 text-base sm:text-lg leading-loose">
          {activeRhyme.lyrics.map((line, idx) => (
            <p key={idx} className="hover:text-pink-300 transition-colors">
              {line}
            </p>
          ))}
        </div>

        {/* Fun fact */}
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          💡 <strong>Fun Fact:</strong> {activeRhyme.funFact}
        </p>

        {/* Sing / Listen Audio Button */}
        <div className="pt-2 flex items-center justify-center gap-4">
          <button
            onClick={() => handleSingRhyme(activeRhyme)}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 hover:from-pink-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center gap-2.5 shadow-xl shadow-pink-500/30 transition-all active:scale-95"
          >
            <Volume2 className="w-5 h-5 text-slate-950" />
            <span>Sing Aloud with Teacher (TTS)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
