import React, { useState } from 'react';
import { X, BookOpen, Volume2, Sparkles, Star, ChevronRight, PenTool, CheckCircle2, HelpCircle, Loader2 } from 'lucide-react';
import { GradeLevel } from '../types';
import { safeFetchJson } from '../utils/safeFetch';
import { CLASS_TEXTBOOKS, ALL_SUPPORTED_GRADES, ClassTextbook, TextbookChapter } from '../data/classTextbooks';

interface ClassTextbookReaderModalProps {
  initialGrade: GradeLevel;
  onClose: () => void;
  onOpenWritingPad: (wordToPractice?: string) => void;
  onSpeakText: (text: string, voice?: string) => void;
  onAddStar?: () => void;
  onSendActionToLive?: (message: string) => void;
}

export const ClassTextbookReaderModal: React.FC<ClassTextbookReaderModalProps> = ({
  initialGrade,
  onClose,
  onOpenWritingPad,
  onSpeakText,
  onAddStar,
  onSendActionToLive
}) => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(initialGrade);
  
  // Available textbooks for selected grade
  const gradeBooks = CLASS_TEXTBOOKS.filter(b => b.grade === selectedGrade);
  const [selectedBookId, setSelectedBookId] = useState<string>(gradeBooks[0]?.id || CLASS_TEXTBOOKS[0].id);

  // Active book
  const activeBook = CLASS_TEXTBOOKS.find(b => b.id === selectedBookId) || gradeBooks[0] || CLASS_TEXTBOOKS[0];
  const [selectedChapterId, setSelectedChapterId] = useState<string>(activeBook.chapters[0]?.id || '');

  // Active chapter
  const activeChapter: TextbookChapter = activeBook.chapters.find(c => c.id === selectedChapterId) || activeBook.chapters[0];

  // Quiz state for this chapter
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState<boolean>(false);

  // AI Ask state
  const [aiQuestion, setAiQuestion] = useState<string>('');
  const [aiAnswer, setAiAnswer] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // When grade changes, pick first book for that grade
  const handleSelectGrade = (grade: GradeLevel) => {
    setSelectedGrade(grade);
    const books = CLASS_TEXTBOOKS.filter(b => b.grade === grade);
    if (books.length > 0) {
      setSelectedBookId(books[0].id);
      if (books[0].chapters.length > 0) {
        setSelectedChapterId(books[0].chapters[0].id);
      }
    }
    setSelectedAnswers({});
    setShowQuizResults(false);
    setAiAnswer('');
  };

  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    const b = CLASS_TEXTBOOKS.find(x => x.id === bookId);
    if (b && b.chapters.length > 0) {
      setSelectedChapterId(b.chapters[0].id);
    }
    setSelectedAnswers({});
    setShowQuizResults(false);
    setAiAnswer('');
  };

  const handleReadAloud = () => {
    if (!activeChapter) return;
    const speech = `कक्षा ${activeBook.grade} के लिए पुस्तक ${activeBook.bookName} का अध्याय: ${activeChapter.title}. ${activeChapter.explanation}. इसमें लिखा है: ${activeChapter.textbookExcerpt}. क्या आपने समझा? बहुत शानदार!`;
    onSpeakText(speech, 'Kore');
    if (onAddStar) onAddStar();
  };

  const handleAskAiAboutChapter = async () => {
    if (!aiQuestion.trim() && !activeChapter) return;
    setIsAiLoading(true);
    setAiAnswer('');
    try {
      const q = aiQuestion.trim() || `इस अध्याय '${activeChapter.title}' में क्या-क्या मुख्य बातें लिखी हैं, मुझे सरल हिंदी में समझाइए।`;
      const data = await safeFetchJson('/api/kids/ask-teacher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `Regarding ${activeBook.bookName} (${selectedGrade}) Chapter '${activeChapter.title}': ${q}`,
          grade: selectedGrade
        })
      });
      if (data?.success && data.result) {
        setAiAnswer(data.result.explanation || data.result.speechText);
        if (data.result.speechText) {
          onSpeakText(data.result.speechText, 'Kore');
        }
      } else {
        setAiAnswer('इस अध्याय में सुंदर बातें सिखाई गई हैं। अपनी शिक्षिका से और पूछें!');
      }
    } catch (e) {
      setAiAnswer('अध्याय को ध्यान से पढ़ें और याद रखें: मेहनत ही सफलता की कुंजी है!');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in select-none">
      <div className="relative w-full max-w-4xl h-[92vh] bg-[#07111e] border-2 border-cyan-500/40 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.25)] flex flex-col text-slate-100 overflow-hidden font-sans">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-cyan-500/30 bg-[#09172a]/90 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-cyan-500/20">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  Class Textbooks & Syllabus (कक्षा की किताबें)
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/50 text-cyan-300">
                  NCERT / State
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                हर क्लास की किताब में क्या लिखा है — पूरा पाठ, शब्दार्थ, आवाज़ में पढ़ाई और लिखाई
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grade Selector Row (Class 1 to 10) */}
        <div className="px-4 sm:px-6 py-2 bg-[#050c17] border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-mono font-bold text-cyan-400 whitespace-nowrap mr-1">
            Class:
          </span>
          {ALL_SUPPORTED_GRADES.map(grade => {
            const isSelected = selectedGrade === grade;
            return (
              <button
                key={grade}
                type="button"
                onClick={() => handleSelectGrade(grade)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/30'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {grade}
              </button>
            );
          })}
        </div>

        {/* Books Row for selected Grade */}
        <div className="px-4 sm:px-6 py-2 bg-[#091524] border-b border-cyan-900/40 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-mono font-bold text-amber-300 whitespace-nowrap mr-1">
            Kitab:
          </span>
          {gradeBooks.length > 0 ? (
            gradeBooks.map(book => {
              const isSelected = selectedBookId === book.id;
              return (
                <button
                  key={book.id}
                  type="button"
                  onClick={() => handleSelectBook(book.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span>{book.coverEmoji}</span>
                  <span>{book.bookName}</span>
                </button>
              );
            })
          ) : (
            <span className="text-xs text-slate-400 italic">
              All NCERT subjects for {selectedGrade} available with AI Tutor
            </span>
          )}
        </div>

        {/* Main Content Split: Left Chapter Nav, Right Chapter Reader */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Chapter Selector List (Left Column) */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 bg-[#06101c] p-3 overflow-y-auto shrink-0 flex md:flex-col gap-1.5 scrollbar-thin">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Chapters ({activeBook?.chapters.length || 0})
            </span>
            {activeBook?.chapters.map(ch => {
              const isSelected = ch.id === activeChapter?.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    setSelectedChapterId(ch.id);
                    setSelectedAnswers({});
                    setShowQuizResults(false);
                    setAiAnswer('');
                  }}
                  className={`text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 shadow-sm'
                      : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800/80'
                  }`}
                >
                  <div className="truncate">
                    <span className="text-[10px] font-mono text-cyan-400 block">Ch {ch.chapterNumber}</span>
                    <span className="font-bold truncate block">{ch.title}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                </button>
              );
            })}
          </div>

          {/* Chapter Details & Reader (Right Column) */}
          {activeChapter ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
              
              {/* Chapter Header Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-900/70 text-cyan-300 border border-cyan-500/40">
                      {selectedGrade} • Chapter {activeChapter.chapterNumber}
                    </span>
                    <span className="text-xs font-bold text-amber-300">
                      {activeChapter.topic}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 font-['Plus_Jakarta_Sans']">
                    {activeChapter.hindiTitle || activeChapter.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {activeChapter.summary}
                  </p>
                </div>

                {/* Read Aloud & Writing Practice Buttons */}
                <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={handleReadAloud}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-slate-950" />
                    <span>Listen Chapter (TTS)</span>
                  </button>

                  {activeChapter.writingPracticeWord && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenWritingPad(activeChapter.writingPracticeWord);
                        onClose();
                      }}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-400/20 transition-all cursor-pointer active:scale-95"
                      title="Practice writing on blackboard"
                    >
                      <PenTool className="w-4 h-4 text-slate-950" />
                      <span>Write: "{activeChapter.writingPracticeWord}"</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 1. Textbook Excerpt: "Kitab Mein Kya Likha Hai" */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>1. Kitab Mein Kya Likha Hai (Textbook Lines):</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Official NCERT Text</span>
                </div>
                <div className="p-4 rounded-2xl bg-[#030913] border border-cyan-500/30 text-amber-100 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-inner">
                  {activeChapter.textbookExcerpt}
                </div>
              </div>

              {/* 2. Line-by-Line Explanation in Simple Hindi */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>2. Aasan Bhasha Mein Samajh (Lesson Explanation):</span>
                </h4>
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  {activeChapter.explanation}
                </div>
              </div>

              {/* 3. Word Meanings (शब्दार्थ) */}
              {activeChapter.wordMeanings && activeChapter.wordMeanings.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <span>📖 3. Shabdarth (Word Meanings / शब्दार्थ):</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeChapter.wordMeanings.map((wm, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col gap-0.5">
                        <span className="font-bold text-amber-200">{wm.word}</span>
                        <span className="text-slate-300">{wm.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Interactive Textbook Daily Questions */}
              {activeChapter.dailyQuestions && activeChapter.dailyQuestions.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    <span>4. Is Path Ke Sawal (Practice Questions):</span>
                  </h4>
                  <div className="space-y-3">
                    {activeChapter.dailyQuestions.map((q, qIdx) => {
                      const userChoice = selectedAnswers[qIdx];
                      const isSubmitted = showQuizResults;
                      return (
                        <div key={qIdx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                          <p className="text-xs sm:text-sm font-semibold text-white">
                            {qIdx + 1}. {q.question}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = userChoice === optIdx;
                              const isCorrect = q.correctIndex === optIdx;
                              let btnClass = 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-300';

                              if (isSubmitted) {
                                if (isCorrect) {
                                  btnClass = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                                } else if (isSelected && !isCorrect) {
                                  btnClass = 'bg-rose-950 border-rose-500 text-rose-200';
                                }
                              } else if (isSelected) {
                                btnClass = 'bg-cyan-900 border-cyan-400 text-cyan-200 font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => {
                                    if (!showQuizResults) {
                                      setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
                                    }
                                  }}
                                  className={`p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer ${btnClass}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {isSubmitted && (
                            <div className="p-2.5 rounded-xl bg-slate-950 text-[11px] text-cyan-300 border border-cyan-900">
                              💡 <strong>Sahi Jawab:</strong> {q.options[q.correctIndex]} — {q.explanation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    {!showQuizResults ? (
                      <button
                        type="button"
                        onClick={() => {
                          setShowQuizResults(true);
                          if (onAddStar) onAddStar();
                        }}
                        className="py-2 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                      >
                        Check Answers (उत्तर देखें)
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setShowQuizResults(false);
                          setSelectedAnswers({});
                        }}
                        className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all cursor-pointer"
                      >
                        Try Again (दोबारा प्रयास करें)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Ask Gemini 3.8 Flash Teacher about this chapter */}
              <div className="p-4 rounded-2xl bg-[#0a182a] border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    Ask Teacher Jarvis (Gemini 3.8 Flash Explainer)
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="Is chapter ke baare mein kuch bhi poochein..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAskAiAboutChapter();
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAskAiAboutChapter}
                    disabled={isAiLoading}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Ask AI</span>
                  </button>
                </div>
                {aiAnswer && (
                  <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs text-cyan-100 leading-relaxed animate-in fade-in">
                    👩‍🏫 <strong>Teacher Jarvis:</strong> {aiAnswer}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-slate-400 text-xs">
              Select a chapter from the list to start reading.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
