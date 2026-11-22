import React, { useState } from 'react';
import { BookOpen, Volume2, Sparkles, CheckCircle2, ChevronRight, Star, HelpCircle } from 'lucide-react';
import { GradeLevel, LessonTopic } from '../types';
import { LESSONS_BY_GRADE } from '../data/curriculum';

interface ClassCurriculumHubProps {
  selectedGrade: GradeLevel;
  onSpeakText: (text: string, voice?: string) => void;
  onAddStar: () => void;
}

export const ClassCurriculumHub: React.FC<ClassCurriculumHubProps> = ({
  selectedGrade,
  onSpeakText,
  onAddStar,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [activeLessonId, setActiveLessonId] = useState<string>('');

  const subjects = ['All', 'Mathematics', 'Science & Nature', 'English & Grammar', 'General Knowledge', 'Phonics & Words'];

  // Filter lessons for active class
  const classLessons = LESSONS_BY_GRADE.filter((l) => l.grade === selectedGrade);
  const filteredLessons = selectedSubject === 'All'
    ? classLessons
    : classLessons.filter((l) => l.subject === selectedSubject);

  const handleSpeakLesson = (lesson: LessonTopic) => {
    const fullSpeech = `${lesson.title} for ${lesson.grade}. ${lesson.audioPrompt} Key points: ${lesson.content.join('. ')}. Example: ${lesson.example}. Wonderful learning!`;
    onSpeakText(fullSpeech, 'Kore');
    onAddStar();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950/80 border-2 border-teal-500/40 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3.5 rounded-2xl bg-teal-400 text-slate-950 font-black text-2xl shadow-lg shadow-teal-400/30">
              📚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white font-['Plus_Jakarta_Sans']">
                  {selectedGrade} Learning Curriculum
                </h2>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-mono">
                  {filteredLessons.length} Lessons Available
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Fun interactive concepts in Math, Science, English, and General Knowledge designed for {selectedGrade} students.
              </p>
            </div>
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-800/80 scrollbar-none">
          {subjects.map((subj) => {
            const isSelected = selectedSubject === subj;
            return (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-teal-400 text-slate-950 shadow-md shadow-teal-400/20'
                    : 'bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {subj}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lessons Cards Grid */}
      {filteredLessons.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
          <span className="text-4xl block">🔍</span>
          <h3 className="text-lg font-bold text-white">No lessons found for this subject filter.</h3>
          <p className="text-xs text-slate-400">Click "All" above to see all lessons for {selectedGrade}.</p>
          <button
            onClick={() => setSelectedSubject('All')}
            className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs"
          >
            Show All {selectedGrade} Lessons
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-slate-900 border-2 border-slate-800 hover:border-teal-400/50 rounded-3xl p-6 transition-all shadow-xl flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
                      {lesson.emoji}
                    </span>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider font-mono text-teal-400">
                        {lesson.subject}
                      </span>
                      <h3 className="text-lg font-black text-white leading-tight font-['Plus_Jakarta_Sans']">
                        {lesson.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    {lesson.grade}
                  </span>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  {lesson.summary}
                </p>

                {/* Step-by-step Content List */}
                <div className="space-y-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
                    Key Learning Points:
                  </span>
                  {lesson.content.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-200">
                      <span className="text-teal-400 font-bold mt-0.5">✦</span>
                      <span className="leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>

                {/* Real-world Example Box */}
                <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-800/60 text-xs text-amber-200 leading-relaxed">
                  🌟 <strong className="text-amber-300">Try It Out:</strong> {lesson.example}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-3">
                <button
                  onClick={() => handleSpeakLesson(lesson)}
                  className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-400/20 transition-all active:scale-95"
                >
                  <Volume2 className="w-4 h-4 text-slate-950" />
                  <span>Listen Explanation (TTS)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
