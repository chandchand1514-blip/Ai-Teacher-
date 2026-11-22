export interface StudentBadge {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  motivationalNote: string;
  icon: string;
  badgeLevel: string;
  colorGradient: string;
  borderClass: string;
  glowClass: string;
  bgGlowClass: string;
  category: 'lesson' | 'exam' | 'streak' | 'creative';
  progress: number;
  target: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export const BADGE_DEFINITIONS: Omit<StudentBadge, 'progress' | 'isUnlocked' | 'unlockedAt'>[] = [
  {
    id: 'ten_lessons',
    title: '10 Lessons Completed',
    hindiTitle: '10 सबक़ मुकम्मल (10 Lessons Master)',
    description: 'Completed 10 interactive learning lessons or study sessions with Jarvis.',
    motivationalNote: 'Shaandar! Aapne 10 sabak pure karke dum lagaya!',
    icon: '🌟',
    badgeLevel: 'Gold Star Scholar',
    colorGradient: 'from-amber-400 via-yellow-400 to-amber-500',
    borderClass: 'border-amber-400/60 hover:border-amber-300',
    glowClass: 'shadow-[0_0_15px_rgba(251,191,36,0.5)]',
    bgGlowClass: 'bg-amber-500/15',
    category: 'lesson',
    target: 10,
  },
  {
    id: 'perfect_exam',
    title: 'Perfect Exam Score',
    hindiTitle: '100% परफेक्ट स्कोर (100% Marks)',
    description: 'Scored a perfect 100% in the Weekly Classroom Exam!',
    motivationalNote: 'Superstar! Ek bhi galti nahi, 100 me se 100 marks!',
    icon: '💯',
    badgeLevel: 'Diamond Ace',
    colorGradient: 'from-emerald-400 via-teal-400 to-cyan-400',
    borderClass: 'border-emerald-400/60 hover:border-emerald-300',
    glowClass: 'shadow-[0_0_15px_rgba(52,211,153,0.5)]',
    bgGlowClass: 'bg-emerald-500/15',
    category: 'exam',
    target: 100,
  },
  {
    id: 'grade_a_topper',
    title: 'Exam Topper',
    hindiTitle: 'ग्रेड A टॉपर (Grade A/A+)',
    description: 'Achieved Grade A or A+ in the Weekly Exam.',
    motivationalNote: 'Wah! Topper list me naam darj ho gaya!',
    icon: '🏆',
    badgeLevel: 'Top Performer',
    colorGradient: 'from-purple-400 via-pink-400 to-rose-400',
    borderClass: 'border-purple-400/60 hover:border-purple-300',
    glowClass: 'shadow-[0_0_15px_rgba(192,132,252,0.5)]',
    bgGlowClass: 'bg-purple-500/15',
    category: 'exam',
    target: 1,
  },
  {
    id: 'consistent_scholar',
    title: 'Daily Learner',
    hindiTitle: 'रोज़ाना का होनहार (3+ Days Streak)',
    description: 'Studied consistently across 3 or more days.',
    motivationalNote: 'Roz thoda thoda padhne se hi sabse aage nikalte hain!',
    icon: '🔥',
    badgeLevel: 'Dedicated Student',
    colorGradient: 'from-orange-400 via-amber-400 to-red-500',
    borderClass: 'border-orange-400/60 hover:border-orange-300',
    glowClass: 'shadow-[0_0_15px_rgba(251,146,60,0.5)]',
    bgGlowClass: 'bg-orange-500/15',
    category: 'streak',
    target: 3,
  },
  {
    id: 'qaida_star',
    title: 'Noorani Qaida Star',
    hindiTitle: 'नूरानी क़ायदा स्टार (Arabic Scholar)',
    description: 'Mastered Noorani Qaida Takhti & Arabic reading rules.',
    motivationalNote: 'Mubarak! Huroof aur Tajweed ki shuruat shaandar rahi!',
    icon: '🌙',
    badgeLevel: 'Arabic Reader',
    colorGradient: 'from-sky-400 via-cyan-300 to-indigo-400',
    borderClass: 'border-sky-400/60 hover:border-sky-300',
    glowClass: 'shadow-[0_0_15px_rgba(56,189,248,0.5)]',
    bgGlowClass: 'bg-sky-500/15',
    category: 'lesson',
    target: 1,
  },
  {
    id: 'drawing_artist',
    title: 'Creative Artist',
    hindiTitle: 'नन्हा चित्रकार (Little Picasso)',
    description: 'Created beautiful drawings and colored pictures in Drawing Studio.',
    motivationalNote: 'Kitni sundar drawing aur rang bhare hain aapne!',
    icon: '🎨',
    badgeLevel: 'Creative Champ',
    colorGradient: 'from-pink-400 via-rose-400 to-yellow-400',
    borderClass: 'border-pink-400/60 hover:border-pink-300',
    glowClass: 'shadow-[0_0_15px_rgba(244,114,182,0.5)]',
    bgGlowClass: 'bg-pink-500/15',
    category: 'creative',
    target: 1,
  },
  {
    id: 'vocab_champ',
    title: 'English Bol Champ',
    hindiTitle: 'इंग्लिश बोल स्टार (Hindi to English)',
    description: 'Learned daily conversational English sentences and family talk.',
    motivationalNote: 'English bolne me confidence aa gaya hai!',
    icon: '🗣️',
    badgeLevel: 'Bilingual Speaker',
    colorGradient: 'from-blue-400 via-cyan-400 to-emerald-400',
    borderClass: 'border-blue-400/60 hover:border-blue-300',
    glowClass: 'shadow-[0_0_15px_rgba(96,165,250,0.5)]',
    bgGlowClass: 'bg-blue-500/15',
    category: 'lesson',
    target: 1,
  },
];

export interface StudentProfileForBadges {
  name?: string;
  grade?: string;
  visitCount?: number;
  askedQuestionsHistory?: string[];
  learnedTopics?: string[];
  weeklyQuestionsTaught?: Array<{ question: string; topic: string; date: string }>;
  studyDaysLogged?: string[];
  lastTopic?: string;
  examHistory?: Array<{ scorePercent: number; gradeLetter: string; date: string }>;
  badges?: string[];
}

export function computeStudentBadges(profile: StudentProfileForBadges): StudentBadge[] {
  const manualBadges = new Set(profile.badges || []);
  const visitCount = profile.visitCount || 1;
  const learnedCount = profile.learnedTopics?.length || 0;
  const askedCount = profile.askedQuestionsHistory?.length || 0;
  const totalLessonInteractions = Math.max(visitCount, learnedCount, askedCount);

  // Highest exam score
  const scores = profile.examHistory?.map((e) => e.scorePercent) || [];
  const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
  const hasPerfectScore = maxScore >= 100 || manualBadges.has('perfect_exam');
  const hasGradeA = (profile.examHistory?.some((e) => e.gradeLetter === 'A+' || e.gradeLetter === 'A')) || manualBadges.has('grade_a_topper') || maxScore >= 80;

  // Study days streak
  const studyDaysCount = Math.max(profile.studyDaysLogged?.length || 0, Math.min(visitCount, 3));

  // Drawing topic
  const hasDrawing = manualBadges.has('drawing_artist') ||
    Boolean(profile.lastTopic && profile.lastTopic.toLowerCase().includes('draw')) ||
    Boolean(profile.learnedTopics?.some((t) => t.toLowerCase().includes('draw')));

  // Qaida topic
  const hasQaida = manualBadges.has('qaida_star') ||
    Boolean(profile.lastTopic && (profile.lastTopic.toLowerCase().includes('qaida') || profile.lastTopic.toLowerCase().includes('arabi') || profile.lastTopic.toLowerCase().includes('urdu'))) ||
    Boolean(profile.learnedTopics?.some((t) => t.toLowerCase().includes('qaida') || t.toLowerCase().includes('arabi') || t.toLowerCase().includes('urdu')));

  // English vocab
  const hasVocab = manualBadges.has('vocab_champ') ||
    Boolean(profile.lastTopic && profile.lastTopic.toLowerCase().includes('english')) ||
    Boolean(profile.learnedTopics?.some((t) => t.toLowerCase().includes('english')));

  return BADGE_DEFINITIONS.map((def) => {
    let progress = 0;
    let isUnlocked = manualBadges.has(def.id);

    if (def.id === 'ten_lessons') {
      progress = Math.min(def.target, totalLessonInteractions);
      if (progress >= def.target) isUnlocked = true;
    } else if (def.id === 'perfect_exam') {
      progress = Math.min(def.target, maxScore);
      if (hasPerfectScore) isUnlocked = true;
    } else if (def.id === 'grade_a_topper') {
      progress = hasGradeA ? 1 : 0;
      if (hasGradeA) isUnlocked = true;
    } else if (def.id === 'consistent_scholar') {
      progress = Math.min(def.target, studyDaysCount);
      if (progress >= def.target) isUnlocked = true;
    } else if (def.id === 'qaida_star') {
      progress = hasQaida ? 1 : 0;
      if (hasQaida) isUnlocked = true;
    } else if (def.id === 'drawing_artist') {
      progress = hasDrawing ? 1 : 0;
      if (hasDrawing) isUnlocked = true;
    } else if (def.id === 'vocab_champ') {
      progress = hasVocab ? 1 : 0;
      if (hasVocab) isUnlocked = true;
    }

    return {
      ...def,
      progress,
      isUnlocked,
      unlockedAt: isUnlocked ? 'Achieved ⭐' : undefined,
    };
  });
}
