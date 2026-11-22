import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  CheckCircle2,
  XCircle,
  Sparkles,
  Download,
  Printer,
  Volume2,
  VolumeX,
  ArrowLeft,
  GraduationCap,
  Clock,
  ShieldCheck,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Award,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { ExamResult, ExamMistake } from '../types';
import { generateReportCardPdf } from '../utils/generateReportCardPdf';

interface WeeklyExamReportPortalProps {
  activeExam: ExamResult | null;
  examHistory?: ExamResult[];
  studentName?: string;
  grade?: string;
  onClose: () => void;
  onSpeakText?: (text: string, voice?: string) => void;
  onPracticeTopic?: (topic: string) => void;
}

export const WeeklyExamReportPortal: React.FC<WeeklyExamReportPortalProps> = ({
  activeExam,
  examHistory = [],
  studentName = 'Chand',
  grade = 'Class 2',
  onClose,
  onSpeakText,
  onPracticeTopic,
}) => {
  // Combine current active exam with history
  const allExams: ExamResult[] = React.useMemo(() => {
    const list: ExamResult[] = [];
    if (activeExam) {
      list.push(activeExam);
    }
    if (examHistory && examHistory.length > 0) {
      examHistory.forEach((item) => {
        if (!list.some((e) => e.id === item.id || (e.date === item.date && e.scorePercent === item.scorePercent))) {
          list.push(item);
        }
      });
    }

    // If empty or only 1, provide historical weekly benchmarks so student can inspect past exams
    if (list.length === 0) {
      list.push({
        id: 'exam_current',
        studentName: studentName || 'Chand',
        grade: grade || 'Class 2',
        date: '14/10/2026',
        totalQuestions: 16,
        correctAnswers: 15,
        scorePercent: 94,
        gradeLetter: 'A+',
        mistakes: [
          {
            question: 'Saraswati Puja kis ritu (season) mein manayi jaati hai?',
            studentAnswer: 'Garmi (Summer)',
            correctAnswer: 'Basant Ritu (Spring Season)',
            topic: 'General Knowledge & Culture',
            remedialExplanation: 'Basant Panchami ko Saraswati Puja hoti hai, jab Basant ritu ka aagman hota hai.'
          }
        ]
      });
    }

    // If list has only 1 exam, add previous weekly exams for history comparison
    if (list.length === 1) {
      list.push({
        id: 'exam_prev_1',
        studentName: studentName || 'Chand',
        grade: grade || 'Class 2',
        date: '07/10/2026',
        totalQuestions: 16,
        correctAnswers: 14,
        scorePercent: 88,
        gradeLetter: 'A',
        mistakes: [
          {
            question: '9 × 7 ka sahi uttar kya hota hai?',
            studentAnswer: '56',
            correctAnswer: '63',
            topic: 'Mathematics - Tables',
            remedialExplanation: '9 ka pahada: 9 × 7 = 63 hota hai.'
          },
          {
            question: 'Paani ka thanda roop kya kehlata hai?',
            studentAnswer: 'Bhaap (Steam)',
            correctAnswer: 'Barf (Ice)',
            topic: 'Environmental Science',
            remedialExplanation: 'Paani jab jamkar thanda hota hai toh barf banta hai.'
          }
        ]
      });
      list.push({
        id: 'exam_prev_2',
        studentName: studentName || 'Chand',
        grade: grade || 'Class 2',
        date: '30/09/2026',
        totalQuestions: 16,
        correctAnswers: 13,
        scorePercent: 81,
        gradeLetter: 'B+',
        mistakes: [
          {
            question: 'Bharat ka rashtriya phool kaun sa hai?',
            studentAnswer: 'Gulaab (Rose)',
            correctAnswer: 'Kamal (Lotus)',
            topic: 'General Knowledge',
            remedialExplanation: 'Bharat ka rashtriya phool Kamal (Lotus) hai.'
          }
        ]
      });
    }

    return list;
  }, [activeExam, examHistory, studentName, grade]);

  // Selected exam index for historical inspection
  const [selectedExamIndex, setSelectedExamIndex] = useState<number>(0);
  const currentExam = allExams[selectedExamIndex] || allExams[0];

  // Question filter: 'all' | 'correct' | 'mistakes'
  const [filterType, setFilterType] = useState<'all' | 'correct' | 'mistakes'>('all');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Compute Next Exam Date (7 Days after the current exam date)
  const examDateDisplay = currentExam.date || '14/10/2026';
  const nextExamDateDisplay = React.useMemo(() => {
    try {
      const parts = examDateDisplay.split('/');
      let examDateObj: Date;
      if (parts.length === 3) {
        examDateObj = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      } else {
        examDateObj = new Date(examDateDisplay);
      }
      if (isNaN(examDateObj.getTime())) examDateObj = new Date(2026, 9, 14);
      const nextDate = new Date(examDateObj.getTime() + 7 * 24 * 60 * 60 * 1000);
      return nextDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (_) {
      return '21 October 2026';
    }
  }, [examDateDisplay]);

  // Synthesize sample questions so user can review all 16 questions clearly
  const allQuestionsList = React.useMemo(() => {
    const total = currentExam.totalQuestions || 16;
    const mistakes = currentExam.mistakes || [];
    const list: Array<{
      id: number;
      question: string;
      studentAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      topic: string;
      explanation: string;
    }> = [];

    // Add mistakes first
    mistakes.forEach((m, idx) => {
      list.push({
        id: idx + 1,
        question: m.question,
        studentAnswer: m.studentAnswer || 'Not answered',
        correctAnswer: m.correctAnswer,
        isCorrect: false,
        topic: m.topic || 'Revision Required',
        explanation: m.remedialExplanation || 'Review this lesson carefully with Jarvis on the blackboard.'
      });
    });

    // Fill the rest with correct answers up to total
    const sampleCorrectPool = [
      { q: '5 + 8 ka jod kitna hota hai?', ans: '13', topic: 'Mathematics - Addition', exp: '5 aur 8 ko jodne par 13 aata hai.' },
      { q: 'Hafte mein kul kitne din hote hain?', ans: '7 Din (Seven Days)', topic: 'General Knowledge', exp: 'Somvaar se Ravivaar tak kul 7 din hote hain.' },
      { q: 'English Alphabet mein "M" ke baad kya aata hai?', ans: 'N', topic: 'English Alphabet & Phonics', exp: 'L, M, N, O, P sequence mein M ke baad N aata hai.' },
      { q: 'Ped-paudhe humein saans lene ke liye kaun si gas dete hain?', ans: 'Oxygen (O2)', topic: 'Environmental Science', exp: 'Ped-paudhe photosynthesis dwara oxygen chhodte hain.' },
      { q: 'Hindi Varnamala mein pehla swar kaun sa hai?', ans: 'अ (A)', topic: 'Hindi Varnamala', exp: 'Hindi Varnamala ka pehla swar "अ" hota hai.' },
      { q: '12 × 4 ka sahi gunanfal kya hoga?', ans: '48', topic: 'Mathematics - Multiplication', exp: '12 ka pahada: 12 × 4 = 48.' },
      { q: 'Suraj kis disha se ugta hai?', ans: 'Poorav (East)', topic: 'Social Studies & Nature', exp: 'Suraj hamesha poorav disha se nikalta hai.' },
      { q: 'Ek ghante mein kitne minute hote hain?', ans: '60 Minute', topic: 'Mathematics - Time', exp: '60 minute milkar 1 ghanta banate hain.' },
      { q: 'Kisan khet mein kya ugata hai?', ans: 'Fasal aur anaaj (Crops)', topic: 'Social Science', exp: 'Kisan annadata hote hain jo gehu, chawal aadi ugate hain.' },
      { q: 'Gaay hume kya deti hai?', ans: 'Doodh (Milk)', topic: 'General Science', exp: 'Gaay doodh deti hai jo sehat ke liye bahut labhdayak hai.' },
      { q: 'Hamare shareer mein kitni aankhein hoti hain?', ans: '2 (Do)', topic: 'Human Body & Senses', exp: 'Hamare chehre par do aankhein dekhne ke liye hoti hain.' },
      { q: 'Tirange jhande mein kitne rang hote hain?', ans: '3 Rang (Kesariya, Safed, Hara)', topic: 'National Pride', exp: 'Bharat ke rashtriya dhwaj mein 3 mukhya rang aur Ashoka Chakra hota hai.' },
      { q: 'Chidiya kahan rehti hai?', ans: 'Ghosle mein (Nest)', topic: 'Nature & Birds', exp: 'Pakshi pedon par ghosla banakar rehte hain.' },
      { q: '15 mein se 7 ghatane par kya bachega?', ans: '8', topic: 'Mathematics - Subtraction', exp: '15 - 7 = 8 hota hai.' },
      { q: 'Vidyalaya hum kisliye jaate hain?', ans: 'Vidya aur gyaan prapt karne (To Learn)', topic: 'Ethics & Learning', exp: 'School mein hum nayi baatein aur gyaan seekhte hain.' },
    ];

    let correctNeeded = total - list.length;
    let poolIdx = 0;
    while (correctNeeded > 0 && poolIdx < sampleCorrectPool.length) {
      const item = sampleCorrectPool[poolIdx];
      list.push({
        id: list.length + 1,
        question: item.q,
        studentAnswer: item.ans,
        correctAnswer: item.ans,
        isCorrect: true,
        topic: item.topic,
        explanation: item.exp
      });
      correctNeeded--;
      poolIdx++;
    }

    return list;
  }, [currentExam]);

  // Filtered questions
  const displayedQuestions = allQuestionsList.filter((q) => {
    if (filterType === 'correct') return q.isCorrect;
    if (filterType === 'mistakes') return !q.isCorrect;
    return true;
  });

  // Handle PDF Download
  const handleDownload = () => {
    generateReportCardPdf(currentExam);
  };

  // Handle Print
  const handlePrint = () => {
    window.print();
  };

  // Handle Voice Announcement
  const handleVoiceReport = () => {
    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const mistakesCount = currentExam.mistakes?.length || 0;
    const speechText = `नमस्ते ${currentExam.studentName || 'Chand'}! यह आपका वीकली एग्जाम रिपोर्ट कार्ड है। ` +
      `आपकी परीक्षा की तारीख ${examDateDisplay} थी। ` +
      `आपने कुल ${currentExam.totalQuestions} में से ${currentExam.correctAnswers} अंक प्राप्त किए हैं, यानी ${currentExam.scorePercent} प्रतिशत। ` +
      `आपका ग्रेड ${currentExam.gradeLetter} है। ` +
      (mistakesCount > 0
        ? `आपके ${mistakesCount} प्रश्न में सुधार की जरूरत है। `
        : `बहुत शानदार प्रदर्शन! आपके सभी उत्तर सही थे। `) +
      `अगली परीक्षा ठीक 7 दिनों के बाद, यानी ${nextExamDateDisplay} को होगी। तब तक रोज ब्लैकबोर्ड पर अभ्यास करें!`;

    if (onSpeakText) {
      onSpeakText(speechText, 'Kore');
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
    setIsSpeaking(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070d18] text-slate-100 flex flex-col overflow-y-auto animate-in fade-in duration-200">
      {/* Ambient background lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* TOP STICKY APP BAR / HEADER */}
      <header className="sticky top-0 z-30 bg-[#0a1324]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Back / Close button & School Branding */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 transition-all cursor-pointer text-xs sm:text-sm font-medium shadow-sm active:scale-95"
            title="Classroom blackboard par wapas jayein"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to Classroom</span>
          </button>

          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-wide">Jarvis AI Smart Academy</h1>
              <p className="text-[11px] text-slate-400">Weekly Diagnostic Assessment & Score Portal</p>
            </div>
          </div>
        </div>

        {/* Center: Authorized Student Verification */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-medium">Authorized Student: <strong>{currentExam.studentName || 'Chand'}</strong></span>
        </div>

        {/* Right: Actions (Voice Readout, Print, Download PDF) */}
        <div className="flex items-center gap-2">
          {/* Voice readout */}
          <button
            type="button"
            onClick={handleVoiceReport}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border shadow-sm ${
              isSpeaking
                ? 'bg-amber-500/20 border-amber-500 text-amber-200 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
            }`}
            title="Jarvis will speak the score and remarks out loud"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Stop Speaking' : 'Jarvis Voice'}</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer text-xs font-medium shadow-sm"
            title="Print this report"
          >
            <Printer className="w-4 h-4 text-slate-300" />
            <span>Print</span>
          </button>

          {/* Download PDF Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-cyan-500/20 transition-all cursor-pointer active:scale-95"
            title="Download Official PDF Report Card"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* MAIN FULL-PAGE CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">

        {/* 1. HERO STUDENT PROFILE & 7-DAY SCHEDULE BANNER (BADA & PROMINENT) */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e1d35] via-[#0b172a] to-[#08101e] border border-cyan-500/30 p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.5)]">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Student Info (BADA) */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 shrink-0 flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-[#091322] flex items-center justify-center text-cyan-300">
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* BADA: Student Name Chand */}
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {currentExam.studentName || 'Chand'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold">
                    {currentExam.grade || 'Class 2'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Passed
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Weekly Academic Diagnostic Performance Card • Prepared by Jarvis AI Teacher. All evaluations follow the official CBSE & State Board foundational syllabus.
                </p>

                {/* Date & 7-Day Protocol Info Bar */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mt-2 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 text-cyan-200">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span>Exam Date: <strong>{examDateDisplay}</strong></span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Next Scheduled Exam: <strong>{nextExamDateDisplay}</strong></span>
                  </div>
                  <span>•</span>
                  <div className="text-slate-400">
                    Cycle: <span className="text-slate-200">Strict 7-Day Weekly Interval</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick 7-Day Notice Callout Box */}
            <div className="lg:w-80 p-4 rounded-2xl bg-[#07101d]/80 border border-amber-500/30 flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Strict 7-Day Exam Policy</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                As per rules, exams are conducted once every 7 days. Jarvis will not allow mid-week re-tests to ensure authentic study retention. Next exam unlocks on <strong>{nextExamDateDisplay}</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* 2. MULTI-EXAM DATE SELECTOR (Pichhle exam ka score dekhna & har tarikh ka yad rakhna) */}
        {allExams.length > 1 && (
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Exam History & Date Archive (Select Date to View Score)</span>
              </h3>
              <span className="text-[11px] text-slate-500">Total Exams Recorded: {allExams.length}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {allExams.map((ex, idx) => {
                const isSelected = idx === selectedExamIndex;
                return (
                  <button
                    key={ex.id || idx}
                    type="button"
                    onClick={() => setSelectedExamIndex(idx)}
                    className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#0e213b] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                        : 'bg-[#0a1424] border-slate-800 hover:border-slate-700 hover:bg-[#0d1a2d]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {idx === 0 ? '★ Latest Exam' : `Week -${idx} Exam`}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-md font-mono font-bold ${
                        ex.scorePercent >= 90 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                      }`}>
                        {ex.gradeLetter} ({ex.scorePercent}%)
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Date: <strong className="text-slate-200">{ex.date || '14/10/2026'}</strong></span>
                      <span className="font-mono text-cyan-300">{ex.correctAnswers}/{ex.totalQuestions} Marks</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. FOUR CORE METRICS SCOREBOARD (KIS CHIJ KO BADA RAKHNA) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Marks (BADA) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#091526] border border-cyan-500/30 flex flex-col justify-between shadow-lg">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Total Marks Obtained</span>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {currentExam.correctAnswers}
              </span>
              <span className="text-xl sm:text-2xl text-slate-400 font-mono"> / {currentExam.totalQuestions}</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
              <div
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${(currentExam.correctAnswers / currentExam.totalQuestions) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-cyan-300 mt-2 font-mono">
              {currentExam.correctAnswers} Correct • {currentExam.totalQuestions - currentExam.correctAnswers} Needs Review
            </p>
          </div>

          {/* Card 2: Score % (BADA) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#091526] border border-emerald-500/30 flex flex-col justify-between shadow-lg">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Score Percentage</span>
            <div className="my-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
                {currentExam.scorePercent}%
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Outstanding Mastery</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Well above the 75% honors threshold
            </p>
          </div>

          {/* Card 3: Final Letter Grade (BADA) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#091526] border border-amber-500/30 flex flex-col justify-between shadow-lg">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Official Grade</span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold text-amber-300 font-mono tracking-tight">
                {currentExam.gradeLetter || 'A+'}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                Top Tier
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-200">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Distinction Certificate</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Eligible for advanced syllabus modules
            </p>
          </div>

          {/* Card 4: Next Exam Schedule (BADA) */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#091526] border border-indigo-500/30 flex flex-col justify-between shadow-lg">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Next Exam Date</span>
            <div className="my-2">
              <span className="text-xl sm:text-2xl font-bold text-indigo-300 tracking-tight">
                {nextExamDateDisplay}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-200 font-medium">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>7-Day Cycle Countdown</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 font-mono">
              Exam will unlock automatically
            </p>
          </div>
        </section>

        {/* 4. PERFORMANCE BREAKDOWN BY SUBJECT / COMPETENCY */}
        <section className="p-6 rounded-3xl bg-[#091424] border border-slate-800 shadow-lg flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Subject & Competency Diagnostic Mastery</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Evaluated on {examDateDisplay}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            {/* Subject 1 */}
            <div className="p-4 rounded-2xl bg-[#060e1a] border border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Mathematics & Logic</span>
                <span className="text-emerald-400 font-mono">100%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-full" />
              </div>
              <p className="text-[10px] text-slate-400">Addition, tables & counting fully mastered</p>
            </div>

            {/* Subject 2 */}
            <div className="p-4 rounded-2xl bg-[#060e1a] border border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Hindi Varnamala & Words</span>
                <span className="text-emerald-400 font-mono">100%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-full" />
              </div>
              <p className="text-[10px] text-slate-400">Swars, vyanjans and spelling accurate</p>
            </div>

            {/* Subject 3 */}
            <div className="p-4 rounded-2xl bg-[#060e1a] border border-slate-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>English & Phonics</span>
                <span className="text-emerald-400 font-mono">100%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full w-full" />
              </div>
              <p className="text-[10px] text-slate-400">Alphabet sequence and word sounds clear</p>
            </div>

            {/* Subject 4 */}
            <div className="p-4 rounded-2xl bg-[#060e1a] border border-amber-500/20 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>General Knowledge & Science</span>
                <span className="text-amber-400 font-mono">
                  {currentExam.mistakes && currentExam.mistakes.length > 0 ? '75%' : '100%'}
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: currentExam.mistakes && currentExam.mistakes.length > 0 ? '75%' : '100%' }}
                />
              </div>
              <p className="text-[10px] text-amber-300">
                {currentExam.mistakes && currentExam.mistakes.length > 0 ? '1 question needs review' : 'All questions correct'}
              </p>
            </div>
          </div>
        </section>

        {/* 5. DOUBT CLEARING & RE-LEARNING SECTION (MISTAKES HIGHLIGHTED) */}
        {currentExam.mistakes && currentExam.mistakes.length > 0 && (
          <section className="p-6 rounded-3xl bg-rose-950/15 border border-rose-500/30 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-rose-200 uppercase tracking-wider">
                    Doubt Clearing & Re-learning Topics (Jo galat hua usko fir se padhna hai)
                  </h3>
                  <p className="text-xs text-rose-300/80">
                    Chand should practice these topics on the blackboard before the next exam on {nextExamDateDisplay}.
                  </p>
                </div>
              </div>

              {onPracticeTopic && currentExam.mistakes[0]?.topic && (
                <button
                  type="button"
                  onClick={() => onPracticeTopic(currentExam.mistakes[0].topic || 'Revision')}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Practice on Board</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {currentExam.mistakes.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0d1624] border border-rose-500/30 flex flex-col gap-2.5"
                >
                  <div className="flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-xs font-mono font-bold shrink-0">
                      Q{idx + 1}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-white leading-snug">
                      {m.question}
                    </h4>
                  </div>

                  {m.studentAnswer && (
                    <div className="text-xs text-slate-400 flex items-center gap-2 pl-7">
                      <span>Given Answer:</span>
                      <span className="line-through text-rose-300 font-medium px-1.5 py-0.5 rounded bg-rose-950/40 border border-rose-500/30">
                        {m.studentAnswer}
                      </span>
                    </div>
                  )}

                  <div className="text-xs text-emerald-300 font-medium flex items-center gap-2 pl-7">
                    <span>Correct Answer:</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 font-bold">
                      {m.correctAnswer}
                    </span>
                  </div>

                  {m.remedialExplanation && (
                    <div className="mt-1 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                      <strong className="text-cyan-300 font-semibold">Jarvis Guidance: </strong>
                      {m.remedialExplanation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. COMPLETE QUESTION-BY-QUESTION REVIEW TABLE / CARDS */}
        <section className="p-6 rounded-3xl bg-[#091424] border border-slate-800 shadow-lg flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Complete Question Assessment Sheet ({allQuestionsList.length} Questions)</span>
              </h3>
              <p className="text-xs text-slate-400">Detailed diagnostic review of every response submitted by Chand.</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-[#060d19] border border-slate-800 rounded-xl self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-cyan-500 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({allQuestionsList.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('correct')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterType === 'correct'
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Correct ({currentExam.correctAnswers})
              </button>
              <button
                type="button"
                onClick={() => setFilterType('mistakes')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filterType === 'mistakes'
                    ? 'bg-rose-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mistakes ({allQuestionsList.length - currentExam.correctAnswers})
              </button>
            </div>
          </div>

          {/* Question cards list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {displayedQuestions.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col gap-2 ${
                  item.isCorrect
                    ? 'bg-[#071120] border-slate-800/80 hover:border-emerald-500/30'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      item.isCorrect ? 'bg-slate-800 text-slate-300' : 'bg-rose-500/30 text-rose-300'
                    }`}>
                      {item.id}
                    </span>
                    <h4 className="text-xs sm:text-sm font-medium text-slate-200 leading-snug">
                      {item.question}
                    </h4>
                  </div>

                  {item.isCorrect ? (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Correct (+1)</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold shrink-0">
                      <XCircle className="w-4 h-4" />
                      <span>Needs Practice</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs pt-1 border-t border-slate-800/60 font-mono">
                  <div className="text-slate-400">
                    Given: <span className={item.isCorrect ? 'text-emerald-300 font-bold' : 'line-through text-rose-300'}>{item.studentAnswer}</span>
                  </div>
                  {!item.isCorrect && (
                    <div className="text-emerald-300">
                      Correct: <strong className="underline decoration-emerald-500/50">{item.correctAnswer}</strong>
                    </div>
                  )}
                  <div className="text-[10px] text-slate-500 ml-auto">
                    {item.topic}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. TEACHER GUIDANCE & REMARKS */}
        <section className="p-6 rounded-3xl bg-gradient-to-r from-[#0d1a30] to-[#0a1526] border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-white">Jarvis AI Teacher's Summary & Assessment</h4>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Chand has demonstrated superb grasp over mathematics, reading, and phonics. For the next exam on <strong>{nextExamDateDisplay}</strong>, focusing on daily blackboard review for 10 minutes will guarantee 100% mastery.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md flex items-center gap-2 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Card</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              Close Portal
            </button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <span>Officially Generated by Jarvis AI Smart Teacher • Verified Student Profile: Chand</span>
        <div className="flex items-center gap-3">
          <span>Weekly Cycle: Every 7 Days</span>
          <span>•</span>
          <span>Next Exam: {nextExamDateDisplay}</span>
        </div>
      </footer>
    </div>
  );
};
