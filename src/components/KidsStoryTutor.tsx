import React, { useState } from 'react';
import { Sparkles, Send, Volume2, Wand2, Star, BookOpen, MessageSquare, Play, CheckCircle2 } from 'lucide-react';
import { GradeLevel } from '../types';
import { safeFetchJson } from '../utils/safeFetch';

interface KidsStoryTutorProps {
  selectedGrade: GradeLevel;
  onSpeakText: (text: string, voice?: string) => void;
  onAddStar: () => void;
}

export const KidsStoryTutor: React.FC<KidsStoryTutorProps> = ({
  selectedGrade,
  onSpeakText,
  onAddStar,
}) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseResult, setResponseResult] = useState<{
    title?: string;
    explanation?: string;
    speechText?: string;
    funActivity?: string;
  } | null>({
    title: 'Why do leaves change color in autumn?',
    explanation: '🌱 In sunny spring and summer, leaves have lots of green chlorophyll to make food! In autumn, the days get shorter, and trees save energy. The green color fades away, revealing gorgeous golden yellow 🟡, fiery orange 🟠, and bright red 🔴 colors hidden underneath!',
    speechText: 'In autumn, trees save energy as sunlight decreases. The green color fades away, revealing magical yellow, orange, and red leaves! Try picking up fallen leaves to make a colorful nature collage!',
    funActivity: 'Look outside and collect 3 different shaped leaves. Compare their colors with your crayons!'
  });

  const sampleQuestions = [
    'Tell me a bedtime story about a baby dinosaur 🦕',
    'How do fish breathe inside water? 🐠',
    'Explain 24 divided by 4 with a story ➗',
    'Why does the moon change its shape in the night? 🌙',
    'What is the largest animal on Earth? 🐋',
  ];

  const handleAskTeacher = async (customPrompt?: string) => {
    const query = customPrompt || question;
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const data = await safeFetchJson('/api/kids/ask-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          grade: selectedGrade
        })
      });

      if (data?.success && data.result) {
        setResponseResult(data.result);
        onAddStar();
        if (data.result.speechText) {
          onSpeakText(data.result.speechText, 'Kore');
        }
      }
    } catch (err) {
      console.error('Teacher ask error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakCurrentResult = () => {
    if (!responseResult) return;
    const textToSpeak = responseResult.speechText || responseResult.explanation || '';
    onSpeakText(textToSpeak, 'Kore');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950/80 border-2 border-purple-500/40 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-purple-400 text-slate-950 font-black text-2xl shadow-lg shadow-purple-400/30">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                  AI Homework Helper & Story Generator
                </h2>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-400 text-slate-950 font-mono">
                  {selectedGrade}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Ask any question, solve math doubts, or generate bedtime stories with voice narration!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Input Box & Question Chips */}
      <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskTeacher();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
            placeholder={`Ask Teacher Jarvis any question for ${selectedGrade}...`}
            className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl pl-5 pr-32 py-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Thinking...' : 'Ask Teacher'}</span>
          </button>
        </form>

        {/* Quick Sample Questions */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold uppercase font-mono text-purple-400 whitespace-nowrap">
            Try Asking:
          </span>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => {
                setQuestion(sq);
                handleAskTeacher(sq);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-purple-950 hover:text-purple-300 border border-slate-800 text-xs text-slate-300 whitespace-nowrap font-medium transition-colors"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Answer / Story Display Card */}
      {responseResult && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-2.5 rounded-2xl bg-purple-950 border border-purple-800">
                ✨
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 font-mono">
                  Teacher Explanation & Story
                </span>
                <h3 className="text-xl font-black text-white font-['Plus_Jakarta_Sans']">
                  {responseResult.title || 'Learning Answer'}
                </h3>
              </div>
            </div>

            <button
              onClick={handleSpeakCurrentResult}
              className="px-4 py-2 rounded-2xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
            >
              <Volume2 className="w-4 h-4 text-slate-950" />
              <span>Listen Aloud (TTS)</span>
            </button>
          </div>

          {/* Explanation Text */}
          <div className="bg-slate-950/70 p-6 rounded-3xl border border-slate-800/80 text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
            {responseResult.explanation}
          </div>

          {/* Fun Activity Box */}
          {responseResult.funActivity && (
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 flex items-start gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <strong className="text-amber-300 block mb-0.5">Mini 1-Minute Fun Activity:</strong>
                <p>{responseResult.funActivity}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
