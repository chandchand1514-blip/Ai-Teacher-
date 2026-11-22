import React, { useState, useEffect } from 'react';
import { X, Trash2, Check, User, GraduationCap, Sparkles, ChevronDown, Layers, Globe, Headset } from 'lucide-react';
import { GradeLevel, StudentRole } from '../types';
import { safeFetchJson } from '../utils/safeFetch';
import { getDeviceId } from '../utils/deviceId';
import { LanguageSelectionModal } from './LanguageSelectionModal';
import { ComplaintModal } from './ComplaintModal';

interface StudentProfileModalProps {
  isOpen: boolean;
  currentName: string;
  currentGrade: string;
  currentRole?: StudentRole;
  currentLanguage?: string;
  onClose: () => void;
  onSave: (name: string, grade: string, role?: StudentRole, language?: string, adminPassword?: string) => void;
  onDelete: () => void;
}

const SCHOOL_GRADES: GradeLevel[] = [
  'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12',
];

const ISLAMIC_ROLES: { role: StudentRole; label: string; icon: string; subtitle: string }[] = [
  { role: 'Basic User', label: 'Basic Student', icon: '📚', subtitle: 'Standard School Student' },
  { role: 'Maulana', label: 'Maulana Sahab', icon: '🎓', subtitle: 'Dars-e-Nizami & Urdu Scholar' },
  { role: 'Qari', label: 'Qari Sahab', icon: '📖', subtitle: 'Tajweed & Qiraat Expert' },
  { role: 'Mufti', label: 'Mufti Sahab', icon: '🕌', subtitle: 'Ifta & Fatawa Jurisprudence' },
];

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  currentName,
  currentGrade,
  currentRole = 'Basic User',
  currentLanguage = 'Hinglish',
  onClose,
  onSave,
  onDelete,
}) => {
  const [nameInput, setNameInput] = useState(currentName || '');
  const [gradeInput, setGradeInput] = useState<GradeLevel>(
    (SCHOOL_GRADES.includes(currentGrade as GradeLevel) ? currentGrade : 'Class 2') as GradeLevel
  );
  const [roleInput, setRoleInput] = useState<StudentRole>(currentRole || 'Basic User');
  const [languageInput, setLanguageInput] = useState<string>(currentLanguage || 'Hinglish');
  const [isPickerModalOpen, setIsPickerModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNameInput(currentName || '');
      setGradeInput((SCHOOL_GRADES.includes(currentGrade as GradeLevel) ? currentGrade : 'Class 2') as GradeLevel);
      setRoleInput(currentRole || 'Basic User');
      setLanguageInput(currentLanguage || 'Hinglish');
      setAdminPassInput('');
      setProfileError('');
    }
  }, [isOpen, currentName, currentGrade, currentRole, currentLanguage]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = nameInput.trim();
    if (trimmedName.toLowerCase().includes('chand')) {
      const cleanPass = adminPassInput.trim();
      if (!cleanPass) {
        setProfileError('Chand naam set karne ke liye 6-digit admin password anivary hai.');
        return;
      }
      try {
        const res = await safeFetchJson('/api/admin/verify-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: cleanPass }),
        });
        if (!res?.valid) {
          setProfileError('Galat password! Chand naam set karne ke liye sahi 6-digit admin password darj karein.');
          return;
        }
      } catch (_) {
        setProfileError('Password verify karne mein samasya aayi.');
        return;
      }
    }
    setProfileError('');
    onSave(trimmedName, gradeInput, roleInput, languageInput, adminPassInput);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 250);
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
        <div className="relative w-full max-w-[280px] sm:max-w-[295px] bg-[#07111e] border border-cyan-500/40 rounded-2xl p-3 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-slate-100 flex flex-col gap-2 overflow-hidden">
          
          <div className="flex items-center justify-between pb-1.5 border-b border-cyan-500/20">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 rounded-md bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                <User className="w-3.5 h-3.5 text-cyan-300" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-[11px] text-cyan-200 leading-none truncate">
                  Student Profile
                </h3>
                <p className="text-[9px] text-slate-400 truncate">
                  Naam, Class & Position
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setIsComplaintModalOpen(true)}
                title="Help / Complaint"
                className="p-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-cyan-400 transition-all cursor-pointer"
              >
                <Headset className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsLanguageModalOpen(true)}
                title="Change Spoken Language (भाषा चुनें)"
                className="px-2 py-0.5 rounded-full bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-400/60 text-cyan-200 text-[9px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              >
                <Globe className="w-3 h-3 text-cyan-300 shrink-0" />
                <span className="truncate max-w-[65px]">{languageInput || 'Hinglish'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          <ComplaintModal
            isOpen={isComplaintModalOpen}
            onClose={() => setIsComplaintModalOpen(false)}
            studentName={currentName}
            grade={currentGrade}
          />

          <div className="px-2 py-1.5 rounded-lg bg-[#0b1a2e] border border-cyan-500/25 flex items-center justify-between">
            <div className="flex items-center gap-1 min-w-0">
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="text-[10px] font-bold text-white truncate">
                {currentName ? currentName : 'No Name'}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {roleInput !== 'Basic User' && (
                <span className="px-1.5 py-0.2 rounded bg-amber-950 border border-amber-400/60 text-[8px] font-bold text-amber-300">
                  {roleInput}
                </span>
              )}
              <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-[8px] font-mono text-cyan-300 font-semibold">
                {gradeInput || 'Class 2'}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-2">
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-mono font-medium text-slate-300">
                Student Name:
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Chand, Zaid, Priya"
                className="w-full px-2 py-1 rounded-md bg-slate-900/90 border border-cyan-500/30 text-white text-[11px] font-sans focus:outline-none focus:border-cyan-400 transition-all placeholder:text-slate-500"
              />
            </div>

            {nameInput.trim().toLowerCase().includes('chand') && (
              <div className="flex flex-col gap-0.5 animate-in fade-in">
                <label className="text-[9px] font-mono font-medium text-amber-300">
                  🔒 Admin Password Required (Chand):
                </label>
                <input
                  type="password"
                  value={adminPassInput}
                  onChange={(e) => setAdminPassInput(e.target.value)}
                  placeholder="******"
                  className="w-full px-2 py-1 rounded-md bg-amber-950/50 border border-amber-500/60 text-amber-200 text-[11px] font-mono focus:outline-none focus:border-amber-400 transition-all placeholder:text-amber-500/50"
                />
              </div>
            )}

            {profileError && (
              <p className="text-[9px] font-mono text-rose-400 font-semibold animate-bounce">{profileError}</p>
            )}
            <div className="flex flex-col gap-0.5">
              <label className="text-[9px] font-mono font-medium text-slate-300 flex items-center justify-between">
                <span>Select Class / Position:</span>
                <span className="text-[8px] font-bold text-cyan-300">
                  {roleInput !== 'Basic User' ? `${roleInput} • ${gradeInput}` : gradeInput}
                </span>
              </label>
              <button
                type="button"
                onClick={() => setIsPickerModalOpen(true)}
                className="w-full px-2 py-1.5 rounded-md bg-gradient-to-r from-slate-900 via-[#0a1b2d] to-slate-900 border border-cyan-500/50 hover:border-cyan-400 text-white text-[11px] font-medium flex items-center justify-between cursor-pointer transition-all shadow-md active:scale-95 group"
              >
                <span className="flex items-center gap-1.5 text-cyan-200 truncate">
                  <span>{roleInput !== 'Basic User' ? (roleInput === 'Mufti' ? '🕌' : roleInput === 'Qari' ? '📖' : '🎓') : '🎒'}</span>
                  <span className="font-bold">{roleInput !== 'Basic User' ? `${roleInput} Sahab` : gradeInput}</span>
                </span>
                <div className="w-5 h-5 rounded-md bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-900 transition-all shrink-0">
                  <ChevronDown className="w-3 h-3 text-cyan-300" />
                </div>
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-mono text-slate-400">Quick Urdu / Islamic Position:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  { role: 'Basic User' as StudentRole, label: 'Standard' },
                  { role: 'Maulana' as StudentRole, label: '🎓 Maulana' },
                  { role: 'Qari' as StudentRole, label: '📖 Qari' },
                  { role: 'Mufti' as StudentRole, label: '🕌 Mufti' },
                ].map((item) => (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => setRoleInput(item.role)}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-mono cursor-pointer transition-all ${
                      roleInput === item.role
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-400 font-bold'
                        : 'bg-slate-900/70 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-0.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-[0_0_12px_rgba(6,182,212,0.4)] transition-all cursor-pointer active:scale-95"
            >
              {isSaved ? <Check className="w-3 h-3 text-emerald-200" /> : <Sparkles className="w-3 h-3" />}
              <span>Save Profile</span>
            </button>
          </form>

          <div className="pt-1 border-t border-slate-800/80">
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-1 rounded-md bg-rose-950/80 hover:bg-rose-900 border border-rose-600/40 text-rose-200 hover:text-white font-semibold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
            >
              <Trash2 className="w-3 h-3 text-rose-400" />
              <span>Delete Name (Clear Profile)</span>
            </button>
          </div>
        </div>
      </div>
      {isPickerModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2.5 bg-black/90 backdrop-blur-lg animate-in fade-in zoom-in-95 duration-200 select-none">
          <div className="relative w-full max-w-[245px] sm:max-w-[260px] max-h-[60vh] bg-[#071322] border-2 border-cyan-400/70 rounded-xl p-2.5 shadow-[0_0_50px_rgba(6,182,212,0.6)] text-slate-100 flex flex-col gap-2 overflow-hidden">
            <div className="flex items-center justify-between pb-1 border-b border-cyan-500/30">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
                  <Layers className="w-3 h-3 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-bold text-[10px] text-cyan-200 leading-tight">Class & Position</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerModalOpen(false)}
                className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono font-bold text-cyan-300 uppercase tracking-wider">🎒 SCHOOL CLASSES</span>
                <div className="grid grid-cols-3 gap-1">
                  {SCHOOL_GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => { setGradeInput(g); setIsPickerModalOpen(false); }}
                      className={`py-1 px-1 rounded-lg text-[9px] font-mono text-center font-bold transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-0.5 ${
                        gradeInput === g && roleInput === 'Basic User'
                          ? 'bg-cyan-500/30 border border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.4)] text-cyan-200'
                          : 'bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate">{g}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-800/80 my-0.5" />
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono font-bold text-amber-300 uppercase tracking-wider">🕌 URDU & ISLAMIC POSITIONS</span>
                <div className="grid grid-cols-1 gap-1">
                  {ISLAMIC_ROLES.map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => { setRoleInput(r.role); setIsPickerModalOpen(false); }}
                      className={`p-1.5 rounded-lg text-left flex items-center justify-between transition-all cursor-pointer active:scale-95 ${
                        roleInput === r.role
                          ? 'bg-amber-500/25 border border-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.3)] text-amber-200 font-bold'
                          : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs shrink-0">{r.icon}</span>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold block leading-tight truncate">{r.label}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <LanguageSelectionModal
        isOpen={isLanguageModalOpen}
        selectedLanguage={languageInput}
        onClose={() => setIsLanguageModalOpen(false)}
        onSelectLanguage={(lang) => {
          setLanguageInput(lang);
          onSave(nameInput.trim(), gradeInput, roleInput, lang);
        }}
      />
    </>
  );
};
