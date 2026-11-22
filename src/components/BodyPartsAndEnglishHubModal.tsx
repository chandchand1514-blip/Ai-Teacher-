import React, { useState } from 'react';
import {
  X,
  Volume2,
  Sparkles,
  BookOpen,
  PenTool,
  HelpCircle,
  CheckCircle2,
  Languages,
  Heart,
  Palette,
  Calculator,
  Smile,
  Mic
} from 'lucide-react';

export interface BodyPartItem {
  id: string;
  hindi: string;
  english: string;
  transliteration: string;
  emoji: string;
  category: 'face' | 'upper' | 'lower' | 'internal';
  exampleSentenceHindi: string;
  exampleSentenceEnglish: string;
}

export const BODY_PARTS_LIST: BodyPartItem[] = [
  {
    id: 'nose',
    hindi: 'नाक',
    english: 'Nose',
    transliteration: 'Naak',
    emoji: '👃',
    category: 'face',
    exampleSentenceHindi: 'हम नाक से सूंघते हैं।',
    exampleSentenceEnglish: 'We smell with our nose.',
  },
  {
    id: 'hand',
    hindi: 'हाथ',
    english: 'Hand',
    transliteration: 'Hath',
    emoji: '✋',
    category: 'upper',
    exampleSentenceHindi: 'हम हाथ से लिखते और खाते हैं।',
    exampleSentenceEnglish: 'We write and eat with our hands.',
  },
  {
    id: 'eye',
    hindi: 'आँख',
    english: 'Eye',
    transliteration: 'Aankh',
    emoji: '👁️',
    category: 'face',
    exampleSentenceHindi: 'हम आँखों से दुनिया देखते हैं।',
    exampleSentenceEnglish: 'We see the world with our eyes.',
  },
  {
    id: 'ear',
    hindi: 'कान',
    english: 'Ear',
    transliteration: 'Kaan',
    emoji: '👂',
    category: 'face',
    exampleSentenceHindi: 'हम कानों से अच्छी बातें सुनते हैं।',
    exampleSentenceEnglish: 'We hear sounds with our ears.',
  },
  {
    id: 'mouth',
    hindi: 'मुँह',
    english: 'Mouth',
    transliteration: 'Muh',
    emoji: '👄',
    category: 'face',
    exampleSentenceHindi: 'हम मुँह से बोलते और खाते हैं।',
    exampleSentenceEnglish: 'We speak and eat with our mouth.',
  },
  {
    id: 'teeth',
    hindi: 'दाँत',
    english: 'Teeth',
    transliteration: 'Daant',
    emoji: '🦷',
    category: 'face',
    exampleSentenceHindi: 'दांतों को रोज सुबह ब्रश करना चाहिए।',
    exampleSentenceEnglish: 'We should brush our teeth every morning.',
  },
  {
    id: 'tongue',
    hindi: 'जीभ',
    english: 'Tongue',
    transliteration: 'Jeebh',
    emoji: '👅',
    category: 'face',
    exampleSentenceHindi: 'जीभ से हमें खाने का स्वाद मिलता है।',
    exampleSentenceEnglish: 'Tongue helps us taste delicious food.',
  },
  {
    id: 'foot',
    hindi: 'पैर',
    english: 'Foot / Leg',
    transliteration: 'Pair',
    emoji: '🦶',
    category: 'lower',
    exampleSentenceHindi: 'पैरों से हम चलते और दौड़ते हैं।',
    exampleSentenceEnglish: 'We walk and run with our feet and legs.',
  },
  {
    id: 'head',
    hindi: 'सिर',
    english: 'Head',
    transliteration: 'Sir',
    emoji: '🧠',
    category: 'upper',
    exampleSentenceHindi: 'सिर में हमारा दिमाग होता है।',
    exampleSentenceEnglish: 'Our head holds our smart brain.',
  },
  {
    id: 'fingers',
    hindi: 'उँगलियाँ',
    english: 'Fingers',
    transliteration: 'Ungliyan',
    emoji: '🖐️',
    category: 'upper',
    exampleSentenceHindi: 'हमारे दोनों हाथों में 10 उंगलियां हैं।',
    exampleSentenceEnglish: 'We have ten fingers in both hands.',
  },
  {
    id: 'chest',
    hindi: 'छाती / दिल',
    english: 'Chest / Heart',
    transliteration: 'Chhati / Dil',
    emoji: '🫀',
    category: 'internal',
    exampleSentenceHindi: 'हमारा दिल हर पल धड़कता है।',
    exampleSentenceEnglish: 'Our heart beats and pumps blood.',
  },
  {
    id: 'hair',
    hindi: 'बाल',
    english: 'Hair',
    transliteration: 'Baal',
    emoji: '💇',
    category: 'upper',
    exampleSentenceHindi: 'बालों में कंघी करना अच्छा होता है।',
    exampleSentenceEnglish: 'Combing our hair keeps us tidy.',
  },
  {
    id: 'knee',
    hindi: 'घुटना',
    english: 'Knee',
    transliteration: 'Ghutna',
    emoji: '🦵',
    category: 'lower',
    exampleSentenceHindi: 'घुटने से हमारा पैर मुड़ता है।',
    exampleSentenceEnglish: 'Knee helps our leg bend while running.',
  },
  {
    id: 'stomach',
    hindi: 'पेट',
    english: 'Stomach',
    transliteration: 'Pet',
    emoji: '🤰',
    category: 'internal',
    exampleSentenceHindi: 'खाना पचने के लिए पेट में जाता है।',
    exampleSentenceEnglish: 'Food digests in our stomach.',
  },
  {
    id: 'shoulder',
    hindi: 'कंधा',
    english: 'Shoulder',
    transliteration: 'Kandha',
    emoji: '💪',
    category: 'upper',
    exampleSentenceHindi: 'हम कंधे पर अपना स्कूल बैग टांगते हैं।',
    exampleSentenceEnglish: 'We carry our school bag on our shoulders.',
  },
  {
    id: 'neck',
    hindi: 'गर्दन',
    english: 'Neck',
    transliteration: 'Gardan',
    emoji: '🦒',
    category: 'face',
    exampleSentenceHindi: 'गर्दन से हम सिर को इधर-उधर घुमाते हैं।',
    exampleSentenceEnglish: 'Neck helps us turn our head left and right.',
  },
];

export interface HindiToEnglishPhrase {
  id: string;
  hindi: string;
  english: string;
  pronunciation: string;
  category: 'conversation' | 'daily' | 'feelings' | 'study';
  emoji: string;
}

export const HINDI_TO_ENGLISH_PHRASES: HindiToEnglishPhrase[] = [
  {
    id: 'p1',
    hindi: 'नमस्ते!',
    english: 'Hello / Greetings!',
    pronunciation: 'Hel-lo / Gree-tings',
    category: 'conversation',
    emoji: '🙏',
  },
  {
    id: 'p2',
    hindi: 'आप कैसे हो?',
    english: 'How are you?',
    pronunciation: 'How are you?',
    category: 'conversation',
    emoji: '😊',
  },
  {
    id: 'p3',
    hindi: 'मैं ठीक हूँ, धन्यवाद!',
    english: 'I am fine, thank you!',
    pronunciation: 'I am fine, thank you',
    category: 'conversation',
    emoji: '✨',
  },
  {
    id: 'p4',
    hindi: 'आपका नाम क्या है?',
    english: 'What is your name?',
    pronunciation: 'What is your name?',
    category: 'conversation',
    emoji: '🏷️',
  },
  {
    id: 'p5',
    hindi: 'मेरा नाम ... है।',
    english: 'My name is ...',
    pronunciation: 'My name is ...',
    category: 'conversation',
    emoji: '⭐',
  },
  {
    id: 'p6',
    hindi: 'मुझे भूख लगी है।',
    english: 'I am hungry.',
    pronunciation: 'I am hun-gry',
    category: 'feelings',
    emoji: '🥪',
  },
  {
    id: 'p7',
    hindi: 'मुझे पानी चाहिए।',
    english: 'I want water.',
    pronunciation: 'I want wa-ter',
    category: 'daily',
    emoji: '💧',
  },
  {
    id: 'p8',
    hindi: 'चलो खेलते हैं!',
    english: "Let's play!",
    pronunciation: 'Lets play!',
    category: 'daily',
    emoji: '⚽',
  },
  {
    id: 'p9',
    hindi: 'मुझे समझ आ गया।',
    english: 'I understood.',
    pronunciation: 'I un-der-stood',
    category: 'study',
    emoji: '💡',
  },
  {
    id: 'p10',
    hindi: 'यह क्या है?',
    english: 'What is this?',
    pronunciation: 'What is this?',
    category: 'study',
    emoji: '❓',
  },
  {
    id: 'p11',
    hindi: 'यह बहुत सुंदर है।',
    english: 'This is very beautiful.',
    pronunciation: 'This is ve-ry beau-ti-ful',
    category: 'feelings',
    emoji: '🌸',
  },
  {
    id: 'p12',
    hindi: 'शुभ रात्रि!',
    english: 'Good night!',
    pronunciation: 'Good night!',
    category: 'conversation',
    emoji: '🌙',
  },
];

interface BodyPartsAndEnglishHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic: (topicPrompt: string, chalkText?: string) => void;
  onSpeak: (text: string) => void;
  lastTopic?: string;
}

export const BodyPartsAndEnglishHubModal: React.FC<BodyPartsAndEnglishHubModalProps> = ({
  isOpen,
  onClose,
  onSelectTopic,
  onSpeak,
  lastTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'bodyParts' | 'hindiToEnglish' | 'allCapabilities' | 'quiz'>('bodyParts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  if (!isOpen) return null;

  const quizQuestions = [
    {
      q: 'नाक (Naak) को English में क्या बोलते हैं?',
      options: ['Nose', 'Hand', 'Ear', 'Eye'],
      correct: 'Nose',
      emoji: '👃',
      explanation: 'नाक को English में Nose बोलते हैं!',
    },
    {
      q: 'हाथ (Hath) को English में क्या बोलते हैं?',
      options: ['Foot', 'Hand', 'Teeth', 'Mouth'],
      correct: 'Hand',
      emoji: '✋',
      explanation: 'हाथ को English में Hand बोलते हैं!',
    },
    {
      q: 'आँख (Aankh) को English में क्या बोलते हैं?',
      options: ['Eye', 'Nose', 'Tongue', 'Ear'],
      correct: 'Eye',
      emoji: '👁️',
      explanation: 'आँख को English में Eye बोलते हैं!',
    },
    {
      q: 'कान (Kaan) को English में क्या बोलते हैं?',
      options: ['Ear', 'Head', 'Hand', 'Hair'],
      correct: 'Ear',
      emoji: '👂',
      explanation: 'कान को English में Ear बोलते हैं!',
    },
    {
      q: '"How are you?" का हिंदी में क्या मतलब होता है?',
      options: ['आप कैसे हो?', 'आपका नाम क्या है?', 'पानी पियो', 'नमस्ते'],
      correct: 'आप कैसे हो?',
      emoji: '😊',
      explanation: '"How are you?" का अर्थ है "आप कैसे हो?"!',
    },
  ];

  const currentQuiz = quizQuestions[quizIndex];

  const handleQuizAnswer = (opt: string) => {
    if (quizAnswered) return;
    setSelectedOption(opt);
    setQuizAnswered(true);
    if (opt === currentQuiz.correct) {
      setQuizScore((prev) => prev + 1);
      onSpeak(`बहुत शानदार! बिल्कुल सही जवाब! ${currentQuiz.explanation}`);
    } else {
      onSpeak(`ओह! सही जवाब है: ${currentQuiz.correct}. ${currentQuiz.explanation}`);
    }
  };

  const handleNextQuiz = () => {
    setQuizAnswered(false);
    setSelectedOption(null);
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((prev) => prev + 1);
    } else {
      setQuizIndex(0);
      onSpeak(`क्विज पूरा हुआ! आपका स्कोर रहा ${quizScore + (selectedOption === currentQuiz.correct ? 1 : 0)} में से 5! शाबाश!`);
    }
  };

  const filteredBodyParts = BODY_PARTS_LIST.filter((bp) => {
    const matchesSearch =
      bp.hindi.includes(searchQuery) ||
      bp.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bp.transliteration.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || bp.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-gradient-to-b from-[#0b1728] via-[#08121f] to-[#040810] border border-cyan-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/20 flex items-center justify-between gap-3 bg-[#0c1a2e]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 text-xl sm:text-2xl">
              🗣️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold text-white tracking-wide">
                  शरीर के अंग & Hindi to English Studio
                </h2>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  All in One
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                नाक, हाथ, कान, आँख को हिंदी-इंग्लिश में क्या बोलते हैं और Jarvis क्या-क्या सिखा सकती है!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/30 text-slate-400 hover:text-white border border-slate-700/60 transition-all cursor-pointer active:scale-95"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 border-b border-slate-800 bg-[#07111e] overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('bodyParts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'bodyParts'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 scale-100'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>👃 शरीर के अंग (Body Parts)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('hindiToEnglish')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'hindiToEnglish'
                ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-400/30 scale-100'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🗣️ Hindi to English सीखना</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('allCapabilities')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'allCapabilities'
                ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30 scale-100'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🌟 Jarvis क्या-क्या पढ़ा सकती है</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/30 scale-100'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>🎯 Mini Quiz</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: BODY PARTS */}
          {activeTab === 'bodyParts' && (
            <div className="space-y-4">
              {/* Quick Prompt Banner */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">💡</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-cyan-200">
                      शरीर के अंगों के नाम (Hindi & English)
                    </h4>
                    <p className="text-[11px] text-slate-300">
                      नाक = Nose, हाथ = Hand, आँख = Eye, कान = Ear, पैर = Foot, मुँह = Mouth
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTopic(
                      '[STUDENT_ACTION]: Student requested to learn all body parts in Hindi and English (Naak ko Nose, Hath ko Hand, Aankh ko Eye, Kaan ko Ear, Pair ko Foot). Please teach enthusiastically and write on the board!',
                      'Nose = नाक (Naak) 👃\nHand = हाथ (Hath) ✋\nEye = आँख (Aankh) 👁️\nEar = कान (Kaan) 👂'
                    );
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Mic className="w-3.5 h-3.5 text-slate-950" />
                  <span>Jarvis से पूरा पढ़ाओ</span>
                </button>
              </div>

              {/* Category Pills & Search */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {[
                    { id: 'all', label: 'सभी अंग' },
                    { id: 'face', label: 'चेहरा (Face)' },
                    { id: 'upper', label: 'ऊपरी अंग (Upper)' },
                    { id: 'lower', label: 'निचले अंग (Lower)' },
                    { id: 'internal', label: 'भीतरी अंग (Internal)' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                        selectedCategory === c.id
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="खोजें (e.g. naak, hand, aankh)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 w-full sm:w-48"
                />
              </div>

              {/* Body Parts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredBodyParts.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-[#091524] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c1c30] transition-all group relative flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-2xl border border-slate-700/60 group-hover:scale-105 transition-transform">
                          {item.emoji}
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            onSpeak(
                              `${item.hindi} को इंग्लिश में ${item.english} कहते हैं! ${item.exampleSentenceHindi}`
                            )
                          }
                          className="p-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer active:scale-95"
                          title="सुनो"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2.5">
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-base font-bold text-white tracking-wide">
                            {item.hindi}
                          </h3>
                          <span className="text-xs font-mono text-cyan-400">
                            ({item.transliteration})
                          </span>
                        </div>
                        <div className="text-xs font-extrabold text-amber-300 mt-0.5">
                          = {item.english}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                          {item.exampleSentenceHindi}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTopic(
                            `[STUDENT_ACTION]: Teach me about body part: "${item.hindi} = ${item.english}". How to spell it, how to pronounce it, and practice!`,
                            `${item.english} = ${item.hindi} (${item.transliteration}) ${item.emoji}\nExample: ${item.exampleSentenceHindi}`
                          );
                          onClose();
                        }}
                        className="flex-1 py-1 px-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-200 text-[10px] font-semibold border border-cyan-500/30 text-center transition-all cursor-pointer active:scale-95"
                      >
                        ✍️ Board पर सीखें
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onSpeak(`${item.english}. In Hindi, ${item.hindi}.`)
                        }
                        className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold transition-all cursor-pointer"
                        title="English Pronunciation"
                      >
                        EN 🔊
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HINDI TO ENGLISH CONVERSATION */}
          {activeTab === 'hindiToEnglish' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 via-indigo-950/50 to-slate-900 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-sky-500 text-slate-950 text-2xl font-black shadow-lg shadow-sky-500/30">
                    🇬🇧
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-sky-200">
                      Hindi to English Spoken Course (हिंदी बोलकर अंग्रेजी सीखें)
                    </h4>
                    <p className="text-xs text-slate-300">
                      "Hindi to English sikhna hai kya?" - Daily conversations, greetings, and useful sentences!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectTopic(
                      '[STUDENT_ACTION]: Student says: "Haan mujhe Hindi to English sikhna hai!". Please teach me spoken English step-by-step with daily phrases, words, and write on the board!',
                      'HINDI TO ENGLISH 🗣️\nNamaste = Hello!\nAap kaise ho? = How are you?\nMain theek hoon = I am fine!'
                    );
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-sky-500/25 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>हाँ, Hindi to English सीखना है!</span>
                </button>
              </div>

              {/* Phrase Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HINDI_TO_ENGLISH_PHRASES.map((phrase) => (
                  <div
                    key={phrase.id}
                    className="p-3.5 rounded-2xl bg-[#091524] border border-slate-800 hover:border-sky-400/40 hover:bg-[#0c1c30] transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{phrase.emoji}</span>
                        <button
                          type="button"
                          onClick={() =>
                            onSpeak(
                              `${phrase.hindi} को इंग्लिश में बोलते हैं: ${phrase.english}`
                            )
                          }
                          className="p-1.5 rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-500/30 transition-all cursor-pointer active:scale-95"
                          title="सुनो"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2">
                        <div className="text-sm font-bold text-white">
                          🇮🇳 {phrase.hindi}
                        </div>
                        <div className="text-sm font-extrabold text-sky-300 mt-0.5">
                          🇬🇧 {phrase.english}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-1">
                          बोलो ऐसे: {phrase.pronunciation}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectTopic(
                            `[STUDENT_ACTION]: Teach me this Hindi to English sentence: "${phrase.hindi}" = "${phrase.english}". Ask me to repeat!`,
                            `${phrase.hindi} = ${phrase.english} ${phrase.emoji}\nPronounce: ${phrase.pronunciation}`
                          );
                          onClose();
                        }}
                        className="flex-1 py-1 px-2 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 text-sky-200 text-[10px] font-semibold border border-sky-500/30 text-center transition-all cursor-pointer active:scale-95"
                      >
                        ✍️ Board पर प्रैक्टिस करें
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ALL CAPABILITIES (JARVIS KYA-KYA PADHA SAKTI HAI) */}
          {activeTab === 'allCapabilities' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs sm:text-sm">
                <span className="font-bold">✨ Jarvis AI Teacher की पूरी क्षमताएं:</span> खाना पूछने के बाद आप इनमें से कोई भी विषय चुन सकते हैं, या पिछला टॉपिक जारी रख सकते हैं!
              </div>

              {lastTopic && (
                <div className="p-3.5 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <div className="text-xs text-indigo-300 font-semibold">पिछला पढ़ा हुआ टॉपिक:</div>
                      <div className="text-sm font-bold text-white">{lastTopic}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectTopic(
                        `[STUDENT_ACTION]: Student wants to continue their previous topic: "${lastTopic}". Please resume right where we left!`,
                        `RESUMING: ${lastTopic}`
                      );
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    यही जारी रखें
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    title: '1. Hindi (हिंदी)',
                    icon: '🇮🇳',
                    desc: 'वर्णमाला (अ से ज्ञ), दो-तीन अक्षर के शब्द, मात्राएँ, प्यारी बाल कहानियाँ और कविताएँ।',
                    actionPrompt: '[STUDENT_ACTION]: Student chose to study Hindi! Please teach Hindi varnamala or word meanings and write on board.',
                    chalk: 'हिंदी वर्णमाला (Varnamala) 🇮🇳\nअ आ इ ई उ ऊ ए ऐ ओ औ अं अः\nक ख ग घ ङ ...',
                  },
                  {
                    title: '2. English (अंग्रेजी)',
                    icon: '🇬🇧',
                    desc: 'Alphabets A to Z, Phonics sounds, Word Spellings, Vocabulary, and Hindi to English spoken translation.',
                    actionPrompt: '[STUDENT_ACTION]: Student chose English! Please teach English phonics, vocabulary or Hindi to English.',
                    chalk: 'ENGLISH PHONICS & WORDS 🇬🇧\nA for Apple 🍎\nB for Ball ⚽\nC for Cat 🐱',
                  },
                  {
                    title: '3. Maths ("Manth" / गणित)',
                    icon: '🔢',
                    desc: '1 से 100 तक गिनती और स्पेलिंग, जोड़ (Addition), घटाना (Subtraction), गुणा, भाग, और पहाड़े (Tables 1-20)।',
                    actionPrompt: '[STUDENT_ACTION]: Student chose Maths! Teach numbers 1 to 100 spelling, addition, or tables and write on board.',
                    chalk: 'MATHS (गणित) 🔢\n1 = One | 2 = Two | 3 = Three\n5 + 3 = 8\n10 - 4 = 6',
                  },
                  {
                    title: '4. Drawing & Coloring (ड्राइंग करना)',
                    icon: '🎨',
                    desc: "'खुद बनाओ ✏️' फ्रीहैंड ड्राइंग और 'रंग भरो 🎨' प्री-ड्रॉन शीट्स (फूल, बिल्ली, सूरज, घर, तितली में रंग भरना)।",
                    actionPrompt: '[STUDENT_ACTION]: Student wants to open drawing/coloring! Open drawing studio or color fill book.',
                    chalk: 'DRAWING & COLORING 🎨\nDrawing Studio ready!',
                  },
                  {
                    title: '5. Sharir ke Ang (शरीर के अंग)',
                    icon: '👃',
                    desc: 'नाक, हाथ, कान, आँख, पैर, मुँह - इनको हिंदी में क्या बोलते हैं और इंग्लिश में क्या बोलते हैं (Nose, Hand, Ear, Eye, Foot, Mouth)।',
                    actionPrompt: '[STUDENT_ACTION]: Student wants to learn Body Parts (Sharir ke Ang) in Hindi and English! Teach step-by-step and write on board.',
                    chalk: 'SHARIR KE ANG (BODY PARTS) 👃✋\nNose = नाक | Hand = हाथ\nEye = आँख | Ear = कान\nFoot = पैर | Mouth = मुँह',
                  },
                  {
                    title: '6. Hindi to English सीखना',
                    icon: '🗣️',
                    desc: 'हिंदी बोलकर अंग्रेजी बोलना सीखें - दैनिक बोलचाल के वाक्य, अभिवादन और वर्ड मीनिंग्स।',
                    actionPrompt: '[STUDENT_ACTION]: Student asked: "Hindi to English sikhna hai!". Please teach spoken English conversation!',
                    chalk: 'HINDI TO ENGLISH 🗣️\nAap kaise ho? = How are you?\nMain theek hoon = I am fine!',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#091524] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{item.icon}</span>
                        <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectTopic(item.actionPrompt, item.chalk);
                        onClose();
                      }}
                      className="mt-3.5 py-1.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-200 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 transition-all cursor-pointer text-center active:scale-95"
                    >
                      यह विषय शुरू करें 🚀
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUIZ */}
          {activeTab === 'quiz' && (
            <div className="p-4 rounded-2xl bg-[#091524] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400">
                  Question {quizIndex + 1} of {quizQuestions.length}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Score: {quizScore}
                </span>
              </div>

              <div className="text-center py-3">
                <span className="text-4xl">{currentQuiz.emoji}</span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-2">
                  {currentQuiz.q}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentQuiz.options.map((opt, idx) => {
                  let btnStyle = 'bg-slate-800 text-slate-200 hover:bg-slate-700';
                  if (quizAnswered) {
                    if (opt === currentQuiz.correct) {
                      btnStyle = 'bg-emerald-500 text-slate-950 font-bold';
                    } else if (opt === selectedOption) {
                      btnStyle = 'bg-rose-500 text-white font-bold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={quizAnswered}
                      onClick={() => handleQuizAnswer(opt)}
                      className={`p-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center border border-slate-700 ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 animate-fade-in">
                  <div className="text-xs text-slate-300">
                    {currentQuiz.explanation}
                  </div>
                  <button
                    type="button"
                    onClick={handleNextQuiz}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-md active:scale-95"
                  >
                    {quizIndex < quizQuestions.length - 1 ? 'अगला सवाल ➡️' : 'दोबारा खेलें 🔄'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-[#07111e] flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Jarvis Ma'am Voice AI Teacher Ready</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all cursor-pointer"
          >
            वापस Blackboard पर जाएँ
          </button>
        </div>
      </div>
    </div>
  );
};
