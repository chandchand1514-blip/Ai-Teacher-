export type GradeLevel = 'LKG' | 'UKG' | 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10' | 'Class 11' | 'Class 12';

export type StudentRole = 'Basic User' | 'Maulana' | 'Qari' | 'Mufti';

export interface AlphabetItem {
  letter: string;
  word: string;
  hindi: string;
  phonics: string;
  emoji: string;
  funFact: string;
}

export interface HindiVarnamalaItem {
  letter: string;
  word: string;
  meaning: string;
  emoji: string;
}

export interface LessonTopic {
  id: string;
  title: string;
  subject: 'Mathematics' | 'English & Grammar' | 'Science & Nature' | 'Hindi' | 'General Knowledge' | 'Phonics & Words';
  emoji: string;
  grade: GradeLevel;
  summary: string;
  content: string[];
  example: string;
  audioPrompt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Rhyme {
  id: string;
  title: string;
  language: 'English' | 'Hindi';
  emoji: string;
  lyrics: string[];
  funFact: string;
}

export interface ExamMistake {
  question: string;
  studentAnswer?: string;
  correctAnswer: string;
  topic?: string;
  remedialExplanation?: string;
}

export interface ExamResult {
  id: string;
  studentName: string;
  grade: string;
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercent: number;
  gradeLetter: string;
  mistakes: ExamMistake[];
  remedialCompleted?: boolean;
}
