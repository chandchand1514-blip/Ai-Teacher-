import React, { useState } from 'react';
import { Volume2, Sparkles, Play, Star, BookOpen, Search, Heart, CheckCircle2 } from 'lucide-react';
import { ALPHABETS, HINDI_VARNAMALA } from '../data/curriculum';

interface AlphabetPhonicsHubProps {
  onSpeakText: (text: string, voice?: string) => void;
  onAddStar: () => void;
}

export const AlphabetPhonicsHub: React.FC<AlphabetPhonicsHubProps> = ({
  onSpeakText,
  onAddStar,
}) => {
  const [subTab, setSubTab] = useState<'english-abc' | 'hindi-varnamala' | 'numbers-counting'>('english-abc');
  const [selectedLetter, setSelectedLetter] = useState<string>('A');
  const [favoriteLetters, setFavoriteLetters] = useState<string[]>(['A', 'M', 'S']);

  const activeAlpha = ALPHABETS.find((a) => a.letter === selectedLetter) || ALPHABETS[0];

  const handleSpeakAlphabet = (item: typeof ALPHABETS[0]) => {
    const text = `${item.letter} for ${item.word}. ${item.phonics}. In Hindi it is called ${item.hindi}. Fun fact: ${item.funFact}`;
    onSpeakText(text, 'Kore');
    onAddStar();
  };

  const handleSpeakHindi = (item: typeof HINDI_VARNAMALA[0]) => {
    const text = `${item.letter} se ${item.word}. ${item.meaning}. Shabash!`;
    onSpeakText(text, 'Kore');
    onAddStar();
  };

  const handleSpeakNumber = (num: number, word: string, itemEmoji: string) => {
    const text = `Number ${num}. ${word}. Here are ${num} items: ${itemEmoji.repeat(Math.min(num, 5))}. Great counting!`;
    onSpeakText(text, 'Kore');
    onAddStar();
  };

  const toggleFavorite = (letter: string) => {
    setFavoriteLetters((prev) =>
      prev.includes(letter) ? prev.filter((l) => l !== letter) : [...prev, letter]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Sub-Tabs */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-rose-950/80 border-2 border-indigo-500/40 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl shadow-lg shadow-amber-400/30">
              🔤
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <span>ABCD, Phonics & Hindi Varnamala</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  Audio TTS
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Tap any letter or number to hear clear, cheerful pronunciations and fun facts!
              </p>
            </div>
          </div>

          {/* Sub Tab Switcher */}
          <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setSubTab('english-abc')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                subTab === 'english-abc'
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🅰️ English A-Z
            </button>
            <button
              onClick={() => setSubTab('hindi-varnamala')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                subTab === 'hindi-varnamala'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇮🇳 हिंदी वर्णमाला
            </button>
            <button
              onClick={() => setSubTab('numbers-counting')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                subTab === 'numbers-counting'
                  ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔢 123 Counting
            </button>
          </div>
        </div>
      </div>

      {/* English Alphabet Tab */}
      {subTab === 'english-abc' && (
        <div className="space-y-6">
          {/* Active Featured Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-amber-400/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                {/* Massive Letter Box */}
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white font-black text-6xl sm:text-7xl shadow-2xl shadow-orange-500/40 border-4 border-white/20">
                  {activeAlpha.letter}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-3xl sm:text-4xl">{activeAlpha.emoji}</span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white font-['Plus_Jakarta_Sans']">
                      {activeAlpha.letter} for {activeAlpha.word}
                    </h3>
                  </div>

                  <p className="text-sm font-bold text-amber-300 font-mono">
                    Phonics Sound: <span className="text-white bg-slate-800 px-2 py-0.5 rounded">{activeAlpha.phonics}</span>
                  </p>
                  <p className="text-sm font-semibold text-rose-300">
                    Hindi Name: <span className="text-white">{activeAlpha.hindi}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                    💡 <strong className="text-cyan-300">Fun Fact:</strong> {activeAlpha.funFact}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <button
                  onClick={() => handleSpeakAlphabet(activeAlpha)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-400/30 transition-all active:scale-95"
                >
                  <Volume2 className="w-5 h-5 text-slate-950" />
                  <span>Listen Audio (TTS)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 26 Alphabet Cards Grid (A to Z) */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-bold text-slate-300 font-mono uppercase tracking-wider">
                Tap Any Letter to Learn & Hear Sound:
              </h3>
              <span className="text-xs text-amber-400 font-bold font-mono">26 Letters</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-3">
              {ALPHABETS.map((item) => {
                const isSelected = selectedLetter === item.letter;
                return (
                  <div
                    key={item.letter}
                    onClick={() => {
                      setSelectedLetter(item.letter);
                      handleSpeakAlphabet(item);
                    }}
                    className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-400/25 to-slate-900 border-amber-400 shadow-xl shadow-amber-400/20 scale-105'
                        : 'bg-slate-900/90 border-slate-800 hover:border-amber-400/60 hover:bg-slate-850 hover:scale-102'
                    }`}
                  >
                    <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">
                      {item.emoji}
                    </span>
                    <span className="text-3xl font-black text-white font-['Plus_Jakarta_Sans']">
                      {item.letter}
                    </span>
                    <span className="text-xs font-bold text-amber-300 mt-1 truncate max-w-[100px]">
                      {item.word}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[100px]">
                      {item.hindi.split(' ')[0]}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakAlphabet(item);
                      }}
                      className="mt-2.5 p-1.5 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 transition-colors"
                      title="Speak Letter"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Hindi Varnamala Tab */}
      {subTab === 'hindi-varnamala' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-300 font-mono">
              हिंदी स्वर और व्यंजन (Hindi Varnamala Cards):
            </h3>
            <span className="text-xs text-rose-400 font-bold font-mono">स्वर और व्यंजन</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
            {HINDI_VARNAMALA.map((item) => (
              <div
                key={item.letter}
                onClick={() => handleSpeakHindi(item)}
                className="p-4 rounded-2xl bg-slate-900 border-2 border-slate-800 hover:border-rose-400 hover:bg-slate-850 transition-all cursor-pointer flex flex-col items-center justify-between text-center group"
              >
                <span className="text-3xl mb-1 group-hover:scale-125 transition-transform">{item.emoji}</span>
                <span className="text-3xl font-black text-rose-400 font-mono">{item.letter}</span>
                <span className="text-xs font-bold text-white mt-1">{item.word}</span>
                <span className="text-[11px] text-slate-400">{item.meaning}</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeakHindi(item);
                  }}
                  className="mt-2.5 p-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-500 hover:text-white text-rose-300 border border-rose-800/80 transition-colors"
                  title="Speak Hindi Word"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 123 Numbers & Counting Tab */}
      {subTab === 'numbers-counting' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-sm font-bold text-slate-300 font-mono">
              1 to 20 Numbers & Object Counting (गिणती):
            </h3>
            <span className="text-xs text-cyan-400 font-bold font-mono">1 to 20</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { num: 1, word: 'One (एक)', emoji: '🍎', item: 'Apple' },
              { num: 2, word: 'Two (दो)', emoji: '⚽', item: 'Balls' },
              { num: 3, word: 'Three (तीन)', emoji: '🐱', item: 'Kittens' },
              { num: 4, word: 'Four (चार)', emoji: '🚗', item: 'Cars' },
              { num: 5, word: 'Five (पाँच)', emoji: '⭐', item: 'Stars' },
              { num: 6, word: 'Six (छह)', emoji: '🎈', item: 'Balloons' },
              { num: 7, word: 'Seven (सात)', emoji: '🌈', item: 'Rainbows' },
              { num: 8, word: 'Eight (आठ)', emoji: '🍦', item: 'Ice Creams' },
              { num: 9, word: 'Nine (नौ)', emoji: '🦋', item: 'Butterflies' },
              { num: 10, word: 'Ten (दस)', emoji: '🎁', item: 'Gifts' },
              { num: 12, word: 'Twelve (बारह)', emoji: '🧁', item: 'Cupcakes' },
              { num: 20, word: 'Twenty (बीस)', emoji: '🚀', item: 'Rockets' },
            ].map((item) => (
              <div
                key={item.num}
                onClick={() => handleSpeakNumber(item.num, item.word, item.emoji)}
                className="p-5 rounded-2xl bg-slate-900 border-2 border-slate-800 hover:border-cyan-400 hover:bg-slate-850 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-400 text-slate-950 font-black text-2xl flex items-center justify-center font-mono shadow-md shadow-cyan-400/20">
                    {item.num}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">{item.word}</h4>
                    <p className="text-xs text-slate-400">{item.item}</p>
                    <div className="text-base mt-1 tracking-wider">
                      {item.emoji.repeat(Math.min(item.num, 6))}
                      {item.num > 6 ? ` +${item.num - 6}` : ''}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeakNumber(item.num, item.word, item.emoji);
                  }}
                  className="p-2.5 rounded-xl bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-400 hover:text-slate-950 transition-colors"
                  title="Count aloud"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
