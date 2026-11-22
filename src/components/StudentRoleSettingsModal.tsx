import React, { useState } from 'react';
import { X, Check, Sparkles, BookOpen, GraduationCap, ShieldCheck, User, Sliders } from 'lucide-react';
import { GradeLevel, StudentRole } from '../types';

interface StudentRoleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentGrade: string;
  currentRole: StudentRole;
  onSave: (name: string, grade: string, role: StudentRole) => void;
}

const AVAILABLE_GRADES: GradeLevel[] = [
  'LKG',
  'UKG',
  'Class 1',
  'Class 2',
  'Class 3',
  'Class 4',
  'Class 5',
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

interface RoleCardInfo {
  role: StudentRole;
  emoji: string;
  badgeLabel: string;
  title: string;
  subtitle: string;
  description: string;
  honorific: string;
  curriculumHighlight: string;
  accentBorder: string;
  accentBg: string;
  accentText: string;
  glowColor: string;
}

const ROLE_OPTIONS: RoleCardInfo[] = [
  {
    role: 'Basic User',
    emoji: '🎒',
    badgeLabel: 'Basic User',
    title: 'Basic User (स्कूल विद्यार्थी)',
    subtitle: 'Aam Talib-e-Ilm / Standard School Syllabus',
    description: 'Class 1 to 10 standard school textbook syllabus (Maths, English, Hindi, EVS, Science) + basic Noorani Qaida reading when requested.',
    honorific: 'Student / Beta / Champion',
    curriculumHighlight: 'Class 1-10 NCERT/State Board Syllabus, Phonics, Maths & Tables, Drawing, basic Urdu alphabets (Baa, Taa).',
    accentBorder: 'border-cyan-500/40 hover:border-cyan-400',
    accentBg: 'bg-cyan-950/20',
    accentText: 'text-cyan-300',
    glowColor: 'rgba(6,182,212,0.25)',
  },
  {
    role: 'Maulana',
    emoji: '🎓',
    badgeLabel: '🎓 Maulana',
    title: 'Maulana (मौलाना / आलिम-ए-दीन)',
    subtitle: 'Dars-e-Nizami, Sarf & Nahw, Hadith, Tafseer',
    description: 'All Urdu Sharif teaching. Advanced Dars-e-Nizami: Ilm-us-Sarf (Abwaab, Gardaan), Ilm-un-Nahw (Hidayat-un-Nahw, Kaafiya), Fiqh-e-Hanafi (Qudoori, Hidayah), Hadith, and Tafseer. Elementary kids topics are disabled.',
    honorific: 'Maulana Sahab / Hazrat Maulana',
    curriculumHighlight: 'Pure Urdu Sharif, Sarf, Nahw, Abwaab-e-Thulathi, Fiqh-e-Hanafi, Hadith & Tafseer.',
    accentBorder: 'border-emerald-500/40 hover:border-emerald-400',
    accentBg: 'bg-emerald-950/20',
    accentText: 'text-emerald-300',
    glowColor: 'rgba(16,185,129,0.25)',
  },
  {
    role: 'Qari',
    emoji: '📖',
    badgeLabel: '📖 Qari',
    title: 'Qari (क़ारी साहब / इल्म-उत-तजवीद)',
    subtitle: 'Ilm-ut-Tajweed & Qira\'at Specialist',
    description: 'All Urdu Sharif teaching. Advanced Makhaarij-ul-Huroof (Halaq, Lisaan, Shafatan), Ahkam-e-Noon/Meem Sakin, Maddat, Sifaat-e-Lazimah, and Waqf rules. Elementary kids topics are disabled.',
    honorific: 'Qari Sahab (क़ारी साहब)',
    curriculumHighlight: 'Pure Urdu Sharif, Makhaarij-ul-Huroof, Ahkam-e-Tajweed, Maddat, Sifaat, Waqf.',
    accentBorder: 'border-sky-500/40 hover:border-sky-400',
    accentBg: 'bg-sky-950/20',
    accentText: 'text-sky-300',
    glowColor: 'rgba(14,165,233,0.25)',
  },
  {
    role: 'Mufti',
    emoji: '🕌',
    badgeLabel: '🕌 Mufti',
    title: 'Mufti (मुफ़्ती साहब / उसूल-उल-फ़िक़्ह)',
    subtitle: 'Usool-ul-Fiqh & Ifta (Highest Scholarly Rank)',
    description: 'All Urdu Sharif teaching. Advanced Usool-ul-Fiqh (Noor-ul-Anwar, Usool-ush-Shashi: Aam, Khaas, Mushtarak, Muawwal, Zahir, Nass, Dalalat-un-Nass, Qiyas), Radd-ul-Muhtar (Fatawa Shami), Qawa\'id-ul-Fiqhiyyah, and Istifta analysis. Elementary kids topics are strictly forbidden.',
    honorific: 'Hazrat Mufti Sahab (हज़रत मुफ़्ती साहब)',
    curriculumHighlight: 'Pure Urdu Sharif, Usool-ul-Fiqh, Ifta & Fatawa Naweesi, Qawa\'id-ul-Fiqhiyyah, contemporary Masail.',
    accentBorder: 'border-amber-400/60 hover:border-amber-300',
    accentBg: 'bg-amber-950/30',
    accentText: 'text-amber-300',
    glowColor: 'rgba(251,191,36,0.35)',
  },
];

export const StudentRoleSettingsModal: React.FC<StudentRoleSettingsModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentGrade,
  currentRole,
  onSave,
}) => {
  const [name, setName] = useState<string>(currentName || '');
  const [grade, setGrade] = useState<string>(currentGrade || 'Class 1');
  const [selectedRole, setSelectedRole] = useState<StudentRole>(currentRole || 'Basic User');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Sync state if modal reopens
  React.useEffect(() => {
    setName(currentName || '');
    setGrade(currentGrade || 'Class 1');
    setSelectedRole(currentRole || 'Basic User');
    setSavedSuccess(false);
  }, [isOpen, currentName, currentGrade, currentRole]);

  if (!isOpen) return null;

  const currentOption = ROLE_OPTIONS.find((r) => r.role === selectedRole) || ROLE_OPTIONS[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name.trim() || 'Chand', grade, selectedRole);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-[#071120] border border-cyan-500/40 rounded-3xl shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="relative px-5 py-4 border-b border-cyan-500/20 bg-gradient-to-r from-[#0b1c33] via-[#071324] to-[#0b1c33] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-950/80 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Sliders className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Student Role & Level Settings</span>
              </h2>
              <p className="text-[11px] text-cyan-300/80">
                Choose learning status to automatically adjust AI teaching difficulty
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          
          {/* Student Name & Class Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Student Name</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chand, Arbaaz, Rahul"
                className="w-full px-3 py-2 rounded-xl bg-[#030914] border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm font-medium transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Class / Grade Level</span>
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#030914] border border-cyan-500/30 text-cyan-200 focus:outline-none focus:border-cyan-400 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                {AVAILABLE_GRADES.map((g) => (
                  <option key={g} value={g} className="bg-[#071120] text-slate-200">
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role Selection Label */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Learning Role</span>
              </label>
              <span className="text-[10px] text-cyan-400 font-mono">
                Active: {currentOption.badgeLabel}
              </span>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROLE_OPTIONS.map((opt) => {
                const isSelected = selectedRole === opt.role;
                return (
                  <div
                    key={opt.role}
                    onClick={() => setSelectedRole(opt.role)}
                    className={`relative p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 text-left ${
                      isSelected
                        ? `${opt.accentBorder} ${opt.accentBg} shadow-[0_0_20px_${opt.glowColor}] ring-1 ring-white/20`
                        : 'border-slate-800 bg-[#040b17] hover:border-slate-700 hover:bg-[#071224]'
                    }`}
                  >
                    {/* Top Row: Emoji, Title & Radio */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl shrink-0 p-1 rounded-xl bg-black/40 border border-white/5">
                          {opt.emoji}
                        </span>
                        <div>
                          <div className={`text-xs font-bold ${isSelected ? opt.accentText : 'text-slate-200'}`}>
                            {opt.title}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {opt.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-400 text-black'
                          : 'border-slate-700 bg-slate-900/60'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-[10.5px] text-slate-300 leading-snug">
                      {opt.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live AI Adaptive Behavior Preview Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#08182c] to-[#0b1f38] border border-cyan-500/30 text-xs flex flex-col gap-1.5 shadow-[inset_0_1px_15px_rgba(6,182,212,0.1)]">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>How AI Teacher Adapts To This Role:</span>
            </div>
            <div className="text-[11px] text-slate-200 leading-relaxed space-y-1">
              <div>
                <span className="text-slate-400 font-medium">Respectful Address: </span>
                <span className="text-amber-300 font-semibold">{currentOption.honorific}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Curriculum Focus: </span>
                <span className="text-cyan-200">{currentOption.curriculumHighlight}</span>
              </div>
              {selectedRole !== 'Basic User' && (
                <div className="text-amber-300 text-[10px] bg-amber-950/40 p-1.5 rounded-lg border border-amber-500/30 mt-1">
                  🕌 <strong>Strict Scholastic Mode:</strong> Teacher will speak pure Urdu Sharif, ask advanced scholastic questions, and avoid basic nursery/school topics unless requested.
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savedSuccess}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved & Updated!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save & Update AI Teacher</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
