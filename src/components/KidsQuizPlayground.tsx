import React, { useState } from 'react';
import { Star, Trophy, Sparkles, CheckCircle2, XCircle, RotateCcw, Volume2, Wand2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GradeLevel, QuizQuestion } from '../types';

import { safeFetchJson } from '../utils/safeFetch';

interface KidsQuizPlaygroundProps {
  selectedGrade: GradeLevel;
  onAddStar: () => void;
  onSpeakText: (text: string, voice?: string) => void;
}

export const KidsQuizPlayground: React.FC<KidsQuizPlaygroundProps> = ({
  selectedGrade,
  onAddStar,
  onSpeakText,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentQuiz, setCurrentQuiz] = useState<{
    grade: string;
    subject: string;
    questions: QuizQuestion[];
  }>({
    grade: 'Class 2',
    subject: 'Mathematics',
    questions: [
      {
        id: 1,
        question: '🍎 If you have 4 apples and teacher gives you 3 more apples, how many apples do you have in total?',
        options: ['6 Apples', '7 Apples', '8 Apples', '5 Apples'],
        correctIndex: 1,
        explanation: '4 + 3 = 7 apples! Excellent addition!'
      },
      {
        id: 2,
        question: '🦁 Which animal is known as the King of the Jungle?',
        options: ['Elephant', 'Giraffe', 'Lion', 'Monkey'],
        correctIndex: 2,
        explanation: 'The Lion is the brave King of the Jungle!'
      },
      {
        id: 3,
        question: '☀️ Which shape is round like the shining sun?',
        options: ['Triangle', 'Square', 'Circle', 'Rectangle'],
        correctIndex: 2,
        explanation: 'A circle is completely round with no sharp corners!'
      },
      {
        id: 4,
        question: '🌿 What color are most healthy tree leaves?',
        options: ['Blue', 'Green', 'Purple', 'Pink'],
        correctIndex: 1,
        explanation: 'Leaves are green because of chlorophyll!'
      }
    ]
  });

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const activeQ = currentQuiz.questions[currentQuestionIdx];

  const handleGenerateNewQuiz = async () => {
    setIsLoading(true);
    setQuizCompleted(false);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);

    try {
      const data = await safeFetchJson('/api/kids/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: selectedGrade,
          subject: selectedSubject
        })
      });

      if (data?.success && data.quiz && data.quiz.questions) {
        setCurrentQuiz(data.quiz);
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered || !activeQ) return;

    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === activeQ.correctIndex;
    if (isCorrect) {
      setScore((s) => s + 1);
      onAddStar();

      // Launch Confetti Celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (_) {}

      onSpeakText(`Superstar! That is correct! ${activeQ.explanation}`, 'Kore');
    } else {
      onSpeakText(`Oops, nice try! The right answer was ${activeQ.options[activeQ.correctIndex]}. ${activeQ.explanation}`, 'Kore');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < currentQuiz.questions.length - 1) {
      setCurrentQuestionIdx((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 }
        });
      } catch (_) {}
    }
  };

  const handleSpeakQuestion = () => {
    if (!activeQ) return;
    const text = `Question: ${activeQ.question}. Option A: ${activeQ.options[0]}. Option B: ${activeQ.options[1]}. Option C: ${activeQ.options[2]}. Option D: ${activeQ.options[3]}. Which one is correct?`;
    onSpeakText(text, 'Kore');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950/80 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl shadow-lg shadow-amber-400/30">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                  Kids Quiz & Star Playground
                </h2>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-mono">
                  {selectedGrade}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Answer fun questions, win sparkling star coins, and celebrate your knowledge!
              </p>
            </div>
          </div>

          {/* Subject Switcher & New Quiz Generator Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs font-bold text-white px-3 py-2 rounded-2xl focus:outline-none"
            >
              <option value="Mathematics">🔢 Mathematics</option>
              <option value="Science & Nature">🌱 Science & Nature</option>
              <option value="English & Grammar">📖 English Grammar</option>
              <option value="General Knowledge">🌍 General Knowledge</option>
            </select>

            <button
              onClick={handleGenerateNewQuiz}
              disabled={isLoading}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-400/25 transition-all"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Creating...' : 'New AI Quiz'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Card View */}
      {!quizCompleted && activeQ ? (
        <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-3xl mx-auto space-y-6">
          {/* Progress bar & Question Number */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Question {currentQuestionIdx + 1} of {currentQuiz.questions.length}
              </span>
              <span className="text-xs text-slate-400 font-mono">{currentQuiz.subject}</span>
            </div>

            <button
              onClick={handleSpeakQuestion}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-colors"
              title="Speak Question"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Listen</span>
            </button>
          </div>

          {/* Question Text */}
          <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800">
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {activeQ.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activeQ.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = isAnswered && idx === activeQ.correctIndex;
              const isWrong = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border-2 font-bold text-sm text-left transition-all flex items-center justify-between gap-3 ${
                    isCorrect
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-950'
                      : isWrong
                      ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                      : isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-amber-400/60 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-mono font-black text-slate-300">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                  {isWrong && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Answer Feedback & Next Button */}
          {isAnswered && (
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                💡 <strong className="text-cyan-300">Explanation:</strong> {activeQ.explanation}
              </p>

              <button
                onClick={handleNextQuestion}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-400/30 transition-all"
              >
                <span>{currentQuestionIdx < currentQuiz.questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete Results Card */
        <div className="bg-slate-900 border-2 border-amber-400 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-6 shadow-2xl">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-2xl shadow-amber-400/40 animate-bounce">
            <Trophy className="w-12 h-12 text-slate-950" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-['Plus_Jakarta_Sans']">
              Shabash! Quiz Completed!
            </h3>
            <p className="text-sm text-slate-300">
              You scored <strong className="text-amber-400 text-lg">{score}</strong> out of{' '}
              <strong className="text-white text-lg">{currentQuiz.questions.length}</strong>!
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-400 text-amber-300 font-bold text-sm">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span>You earned {score} Star Coins!</span>
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleGenerateNewQuiz}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-400/25"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Another Quiz</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
